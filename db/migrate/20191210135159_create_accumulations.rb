# frozen_string_literal: true

class CreateAccumulations < ActiveRecord::Migration[6.0]
  def change
    create_table :accumulations do |t|
      t.references :user, null: false, foreign_key: true
      t.string :year
      t.jsonb :data

      t.timestamps
    end
  end
end
