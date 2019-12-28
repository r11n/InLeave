# frozen_string_literal: true

# for storing reporting manager
class Reporting < ApplicationRecord
  include AASM
  belongs_to :user
  belongs_to :manager,  class_name: 'User',
                        foreign_key: 'manager_id',
                        inverse_of: :user,
                        optional: true
  # states
  aasm column: 'state' do
    state :unassigned, initial: true
    state :relieved
    state :requested
    state :assigned

    event :relieve do
      transitions from: %i[requested assigned], to: :relieved
    end

    event :request do
      transitions from: %i[assigned relieved unassigned], to: :requested
    end

    event :assign do
      transitions from: %i[relieved unassigned requested], to: :assigned
    end
  end

  def self.bucketed_list
    joins(:user).select(
      'reportings.state, array_agg('\
        'row_to_json(cast('\
          'row(reportings.id, users.first_name, users.last_name, users.email, '\
        'reportings.manager_id) as reporting_user_data))'\
      ') as user_data'
    ).group(:state)
  end
end
