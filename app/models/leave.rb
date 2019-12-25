# frozen_string_literal: true

class Leave < ApplicationRecord
  HALF_DAY_STATES ||= %w[first second].freeze
  include AASM
  audited
  belongs_to :user
  belongs_to :leave_type
  before_save :save_effective_days
  validates :from_date, presence: true
  validate :days_uniq?
  validate :end_after_from
  validate :valid_days?
  validate :validate_half_day
  scope :current_year, lambda {
    where(
      arel_table[:from_date].gteq(Time.zone.today.beginning_of_year).and(
        arel_table[:end_date].lteq(Time.zone.today.end_of_year)
      ).and(arel_table[:multiple].eq(true)).or(
        arel_table[:from_date].between(
          Time.zone.today.beginning_of_year..Time.zone.today.end_of_year
        ).and(arel_table[:multiple].in([false, nil]))
      )
    )
  }

  scope :by_year, lambda { |year|
    where(
      arel_table[:from_date].gteq("#{year}-01-01").and(
        arel_table[:end_date].lteq("#{year}-12-31")
      )
    ).or(where(from_date: ("#{year}-01-01".."#{year}-12-31")))
  }
  # states
  aasm column: 'state' do
    state :applied, initial: true
    state :manager_approved
    state :hr_approved
    state :cancelled
    state :manager_rejected
    state :hr_rejected
    state :auto_approved

    event :manager_approve do
      transitions from: %i[applied manager_rejected], to: :manager_approved
    end
    event :auto_approve do
      transitions from: %i[applied], to: :auto_approved, guard: :not_responded?
    end
    event :hr_approve do
      transitions from: %i[applied hr_rejected], to: :hr_approved
    end
    event :cancel do
      transitions from: %i[applied hr_approved manager_approved auto_approved], to: :cancelled, guard: :before_three_days?
    end
    event :manager_reject do
      transitions from: %i[applied hr_approved manager_approved auto_approved], to: :manager_rejected, guard: :before_three_days?
    end
    event :hr_reject do
      transitions from: %i[applied hr_approved manager_approved auto_approved], to: :hr_rejected, guard: :before_three_days?
    end
  end

  def approve(user = nil)
    auto_approve unless user
  end

  def days
    end_dat = end_date.presence || from_date
    range = (from_date..end_dat).to_a
    @days = range.reject { |d| d.saturday? || d.sunday? || d.holiday? }
  end

  def as_event
    {
      id: id,
      title: title,
      start: "#{day_collection[0]}T00:00:00",
      end: event_end,
      description: reason,
      className: leave_type.to_style,
      eventColor: leave_type.to_color,
      allDay: false
    }
  end

  def event_end
    return nil if effective_days == 1.0

    time = effective_days < 1 ? '12:00:00' : '23:59:59'
    "#{day_collection[-1]}T#{time}"
  end

  def title
    user.name
  end

  private

  def validate_half_day
    return if (half.present? && HALF_DAY_STATES.include?(half)) || half.blank?

    errors.add(:half_day, 'Must be a valid half')
  end

  def end_after_from
    return unless end_date && from_date

    errors.add(:end_date, 'must be after from date') if end_date <= from_date
  end

  def days_uniq?
    from_validate
    end_validate
  end

  def from_validate
    leaves = Leave.array_contains_any(:day_collection, from_date.to_s).where(
      user_id: user_id,
      state: %w[auto_approved hr_approved manager_approved applied]
    ).where.not(id: id).count
    return unless leaves.positive?

    errors.add(:from_date, 'already applied leave on this day')
  end

  def end_validate
    leaves = Leave.array_contains_any(:day_collection, end_date.to_s).where(
      user_id: user_id,
      state: %w[auto_approved hr_approved manager_approved applied]
    ).where.not(id: id).count
    return unless leaves.positive?

    errors.add(:end_date, 'already applied leave on this day')
  end

  def valid_days?
    errors.add(:dates, 'Atleast one day must not be a holiday') if days.blank?
  end

  def save_effective_days
    half_day_removal = half.present? && HALF_DAY_STATES.include?(half) ? 0.5 : 0
    self.effective_days = days.size - half_day_removal
    self.day_collection = days
  end

  def before_three_days?
    (Time.zone.today - from).to_f < 3
  end

  def not_responded?
    (created_at - Time.zone.now) >= 7.days
  end
end
