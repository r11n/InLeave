# frozen_string_literal: true

class Leave < ApplicationRecord
  include AASM
  audited
  belongs_to :user
  belongs_to :leave_type
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

  private

  def before_three_days?
    (Date.today - from).to_f < 3
  end

  def not_responded?
    (created_at - Time.now) >= 7.days
  end
end
