# frozen_string_literal: true

class CreateReportings < ActiveRecord::Migration[6.0]
  def change
    create_table :reportings do |t|
      t.references :user, null: false, foreign_key: true
      t.integer :manager_id

      t.timestamps
    end
  end
end
