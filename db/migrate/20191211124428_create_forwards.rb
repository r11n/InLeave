class CreateForwards < ActiveRecord::Migration[6.0]
  def change
    create_table :forwards do |t|
      t.references :user, null: false, foreign_key: true
      t.string :year
      t.jsonb :data

      t.timestamps
    end
  end
end
