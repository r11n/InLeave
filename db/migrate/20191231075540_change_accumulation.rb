class ChangeAccumulation < ActiveRecord::Migration[6.0]
  def change
    remove_column :accumulations, :year
    change_table :accumulations, bulk: true do |t|
      t.jsonb :forward_data
      t.rename :data, :balance_data
      t.integer :year
    end
  end
end
