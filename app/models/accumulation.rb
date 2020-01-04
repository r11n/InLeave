# frozen_string_literal: true

# for storing leave balances
class Accumulation < ApplicationRecord
  audited
  include BalanceBuilder
  belongs_to :user
  after_initialize :jsonize
  validate :forward_limits
  validate :correct_keys

  def jsonize
    self.balance_data = init_json_base if balance_data.blank?
    self.forward_data = init_json_base if forward_data.blank?
  end

  def init_json_base
    @leave_type_ids ||= LeaveType.all.pluck(:id)
    {}.tap do |hash|
      @leave_type_ids.each do |type|
        hash[type] = 0
      end
    end
  end

  private

  def forward_limits
    types.each do |type|
      over_limit?(type.id, forward_data[type.id.to_s])
    end
  end

  def correct_keys
    return if balance_data.keys.map(&:to_sym) == forward_data.keys.map(&:to_sym)

    errors.add(:forward_data, 'Wrong data entered')
  end
end
