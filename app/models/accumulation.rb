# frozen_string_literal: true

# for storing leave balances
class Accumulation < ApplicationRecord
  include BalanceBuilder
  belongs_to :user
  after_initialize :jsonize

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
end
