# frozen_string_literal: true

# imported flag
class AddImportedToAccumulations < ActiveRecord::Migration[6.0]
  def change
    add_column :accumulations, :imported, :boolean
  end
end
