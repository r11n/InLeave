class AddCcListToLeave < ActiveRecord::Migration[6.0]
  def change
    add_column :leaves, :cc_list, :jsonb
  end
end
