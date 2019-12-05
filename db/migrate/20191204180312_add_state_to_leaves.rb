# frozen_string_literal: true

class AddStateToLeaves < ActiveRecord::Migration[6.0]
  def change
    add_column :leaves, :state, :string
  end
end
