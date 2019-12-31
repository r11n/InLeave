class AddCountingTypeToLeaveTypes < ActiveRecord::Migration[6.0]
  def change
    change_table :leave_types, bulk: true do |t|
      t.string :counting_type, default: 'yearly'
    end
    change_column :leave_types, :limit, :float
  end
end
