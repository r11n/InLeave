# frozen_string_literal: true

class CreateLeaveTypes < ActiveRecord::Migration[6.0]
  def change
    create_table :leave_types do |t|
      t.string :name
      t.integer :limit
      t.boolean :forwadable
      t.integer :forward_limit
      t.integer :forward_count

      t.timestamps
    end
  end
end
