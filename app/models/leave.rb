# frozen_string_literal: true

class Leave < ApplicationRecord
  extend CsvExporter
  include AASM
  HALF_DAY_STATES ||= %w[first second].freeze
  audited
  csv_attributes('title', 'day_collection', 'effective_days')
  belongs_to :user
  belongs_to :leave_type
  before_save :save_effective_days
  validates :from_date, presence: true
  validate :days_uniq?
  validate :end_after_from
  validate :valid_days?
  validate :validate_half_day
  after_commit :update_balances, on: [:update]
  after_commit :notify_users
  scope :current_year, -> { by_year(Time.zone.today.year) }
  scope :by_year, lambda { |year|
    where(
      arel_table[:from_date].gteq("#{year}-01-01").and(
        arel_table[:end_date].lteq("#{year}-12-31")
      )
    ).or(where(from_date: ("#{year}-01-01".."#{year}-12-31")))
  }

  scope :with_range_dates, lambda { |*args|
    with_range_days(:day_collection, *args)
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
    state :re_applied
    state :cancel_requested

    event :manager_approve do
      transitions from: %i[applied re_applied manager_rejected], to: :manager_approved
    end
    event :auto_approve do
      transitions from: %i[re_applied applied], to: :auto_approved, guard: :not_responded?
    end
    event :hr_approve do
      transitions from: %i[applied re_applied hr_rejected], to: :hr_approved
    end
    event :cancel do
      transitions from: %i[applied re_applied hr_approved manager_approved auto_approved], to: :cancel_requested
    end
    event :approve_cancel do
      transitions from: %i[cancel_requested], to: :cancelled
    end
    event :manager_reject do
      transitions from: %i[applied re_applied hr_approved manager_approved auto_approved], to: :manager_rejected
    end
    event :hr_reject do
      transitions from: %i[applied re_applied hr_approved manager_approved auto_approved], to: :hr_rejected
    end
    event :re_apply do
      transitions from: %i[cancelled manager_rejected hr_rejected], to: :re_applied
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
      id: id, title: title,
      start: "#{day_collection[0]}T00:00:00",
      end: event_end, description: reason,
      className: leave_type.to_style,
      eventColor: leave_type.to_color,
      state: state,
      url: routable? || nil,
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

  def recently_approved?
    %w[
      applied re_applied manager_rejected hr_rejected
    ].include?((audits.last.audited_changes['state'] || [])[0]) && (
      manager_approved? || auto_approved? || hr_approved?
    )
  end

  def recently_cancelled?
    (
      aasm.states.map(&:name).map(&:to_s) - %w[applied re_applied]
    ).include?((audits.last.audited_changes['state'] || [])[0]) && (
      cancelled? || manager_rejected? || hr_rejected?
    )
  end

  def type_day
    "#{(half.presence || 'Full')} #{half.present? ? 'half' : ''} Day"
  end

  private

  def routable?
    %w[
      applied re_applied cancel_requested auto_approved
    ].include?(state) && Rails.application.routes.url_helpers.requests_leaves_path(
      leave_id: id
    )
  end

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
    return if from_date > Time.zone.today - 2.months

    errors.add(:from_date, 'Can not apply leave older than 2 month')
  end

  def save_effective_days
    half_day_removal = half.present? && HALF_DAY_STATES.include?(half) ? 0.5 : 0
    self.effective_days = days.size - half_day_removal
    self.day_collection = days
  end

  def before_three_days?
    (Time.zone.today - from_date).to_f < 3
  end

  def not_responded?
    (created_at - Time.zone.now) >= 7.days
  end

  def update_balances
    user.supply_balance.decreement(self) if recently_approved?
    user.supply_balance.increement(self) if recently_cancelled?
  end

  def notify_users
    NotificationWorker.perform_async(id)
  end
end
