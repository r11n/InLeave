# frozen_string_literal: true

class Holiday < ApplicationRecord
  def self.holiday?(date)
    cacher = RedKiq.new('holiday')
    return cacher.holiday?(date) if cacher.cached?(date)

    avail = inbound_days(date).present?
    cacher.store(date, avail ? 'YES' : 'NO')
    avail
  end

  def multi_day?
    from && self.end
  end

  def valid_selection?
    from < self.end
  end

  def self.inbound_days(date)
    multi = where(
      arel_table[:end].gteq(date).and(arel_table[:from].lteq(date)).and(
        arel_table[:multiple].eq(true)
      )
    )
    single = where(from: date, multiple: [nil, false])
    multi.or(single)
  end
end
