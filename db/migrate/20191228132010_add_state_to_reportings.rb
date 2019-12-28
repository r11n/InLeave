class AddStateToReportings < ActiveRecord::Migration[6.0]
  def change
    add_column :reportings, :state, :string, default: 'unassigned'
  end
end
