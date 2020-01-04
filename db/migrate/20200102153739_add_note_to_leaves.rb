class AddNoteToLeaves < ActiveRecord::Migration[6.0]
  def change
    add_column :leaves, :note, :text
    add_column :users, :employee_id, :string
  end
end
