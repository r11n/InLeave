# frozen_string_literal: true

class Holiday < ApplicationRecord
  def self.holiday?(date)
    multi_start = where(from: (date..), multiple: true)
    multi_end = where(
      arel_table[:end].lteq(date).and(arel_table[:multiple].eq(true))
    )
    single = where(from: (date..), multiple: [nil, false])
    multi_start.or(multi_end).or(single).present?
  end

  def multi_day?
    from && self.end
  end

  def valid_selection?
    from < self.end
  end
end
