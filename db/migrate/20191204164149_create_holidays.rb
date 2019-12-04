# frozen_string_literal: true

class CreateHolidays < ActiveRecord::Migration[6.0]
  def change
    create_table :holidays do |t|
      t.string :name
      t.text :description
      t.date :from
      t.date :end
      t.integer :effective_days
      t.boolean :multiple

      t.timestamps
    end
  end
end
