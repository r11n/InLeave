# used in creating the reporting grouping
class CreateUserDateType < ActiveRecord::Migration[6.0]
  def up
    execute <<~SQL
      CREATE TYPE reporting_user_data AS (
        id bigint,
        first_name varchar,
        last_name varchar,
        email varchar,
        manager_id bigint
      );
    SQL
  end

  def down
    execute <<~SQL
      DROP TYPE IF EXISTS reporting_user_data;
    SQL
  end
end
