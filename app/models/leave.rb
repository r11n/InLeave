# frozen_string_literal: true

class Leave < ApplicationRecord
  include AASM
  audited
  belongs_to :user
  belongs_to :leave_type
  before_save :save_effective_days
  validates :from_date, presence: true
  validate :days_uniq?
  validate :end_after_from
  validate :valid_days?
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

  private

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
    self.effective_days = days.size
    self.day_collection = days
  end

  def before_three_days?
    (Time.zone.today - from).to_f < 3
  end

  def not_responded?
    (created_at - Time.zone.now) >= 7.days
  end
end
