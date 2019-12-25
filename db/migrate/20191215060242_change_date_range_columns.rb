# frozen_string_literal: true

class ChangeDateRangeColumns < ActiveRecord::Migration[6.0]
  def change
    rename_column :leaves, :from, :from_date
    rename_column :holidays, :from, :from_date
    rename_column :leaves, :end, :end_date
    rename_column :holidays, :end, :end_date
  end
end
