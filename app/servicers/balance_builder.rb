# frozen_string_literal: true

# For building balances
module BalanceBuilder
  def old_data
    @old_data ||= user.lastyear_balance.presence || user.build_lastyear_balance
  end

  def types
    @types ||= LeaveType.all
  end

  def forward_from_old_data
    return if imported

    forward_data_import
    balance_data_import
    self.imported = true
    save
  end

  def decreement(leave)
    type = leave.leave_type
    uid = type.id.to_s
    if type.monthly?
      balance_data[uid][leave.from_date.month - 1] -= leave.effective_days
    else
      balance_data[uid] -= leave.effective_days
    end
    save
  end

  def increemnet(leave)
    type = leave.leave_type
    uid = type.id.to_s
    if type.monthly?
      balance_data[uid][eave.from_date.month - 1] += leave.effective_days
    else
      balance_data[uid] += leave.effective_days
    end
    save
  end

  private

  def forward_data_import
    types.select(&:forwadable).each do |type|
      uid = type.id.to_s
      count = old_data.forward_data[uid] - old_data.balance_data[uid]
      val = type.forward_limit > count ? count : type.forward_limit
      forward_data[uid] = val
    end
  end

  def balance_data_import
    month = user.joining_date.year == year ? user.joining_date.month : 1
    factor = user.joining_date.year == year ? ((13 - month) / 12.0) : 1
    types.each do |type|
      uid = type.id.to_s
      balance_data[uid] = (factor * type.limit).round
      balance_data[uid] = [[type.limit, 0]] * 12 if type.monthly?
    end
  end
end
