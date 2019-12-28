class AddJoiningToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :joining_date, :date
  end
end
