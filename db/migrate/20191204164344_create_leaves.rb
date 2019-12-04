# frozen_string_literal: true

class CreateLeaves < ActiveRecord::Migration[6.0]
  def change
    create_table :leaves do |t|
      t.references :user, null: false, foreign_key: true
      t.references :leave_type, null: false, foreign_key: true
      t.text :reason
      t.date :from
      t.date :end
      t.integer :effective_days

      t.timestamps
    end
  end
end
