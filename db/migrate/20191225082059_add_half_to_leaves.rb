class AddHalfToLeaves < ActiveRecord::Migration[6.0]
  def change
    add_column :leaves, :half, :string
  end
end
