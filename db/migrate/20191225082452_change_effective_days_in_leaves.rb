# frozen_string_literal: true

class ChangeEffectiveDaysInLeaves < ActiveRecord::Migration[6.0]
  def change
    change_column :leaves, :effective_days, :float
  end
end
