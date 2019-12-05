# frozen_string_literal: true

class Holiday < ApplicationRecord
  def self.holiday?(date)
    where(arel_table[:from].gteq(date).or(arel_table[:end].lteq(date))).present?
  end
end
