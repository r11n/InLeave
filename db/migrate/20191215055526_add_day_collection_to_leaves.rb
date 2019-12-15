class AddDayCollectionToLeaves < ActiveRecord::Migration[6.0]
  def change
    add_column :leaves, :day_collection, :jsonb
  end
end
