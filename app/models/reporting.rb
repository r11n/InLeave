# frozen_string_literal: true

# for storing reporting manager
class Reporting < ApplicationRecord
  include AASM
  belongs_to :user
  belongs_to :manager,  class_name: 'User',
                        foreign_key: 'manager_id',
                        inverse_of: :user,
                        optional: true
  validate :self_reporting?
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
      transitions from: %i[relieved unassigned requested assigned], to: :assigned
    end
  end

  def self.bucketed_list
    list = joins(:user).select(
      'reportings.state, array_agg('\
        'row_to_json(cast('\
          'row(reportings.id, users.first_name, users.last_name, users.email, '\
        'reportings.manager_id) as reporting_user_data))'\
      ') as user_data'
    ).group(:state).chunk(&:state).to_a
    Hash[*list.flatten]
  end

  def self.hr_list
    list = bucketed_list
    assigned = []
    unlinked = list['assigned']&.user_data&.chunk { |l| l['manager_id'] }.to_a
    User.joins(:role).where(roles: { name: 'manager' }).find_each do |man|
      assigned << {
        id: man.id, name: man.name, dom_id: "assigned-#{man.id}",
        user_data: (
          unlinked.select { |k| (k || [])[0] == man.id }[0] || []
        )[1] || []
      }
    end
    list['assigned'] = assigned
    list
  end

  def self.manager_list(manager)
    Reporting.includes(:user).where(manager: manager).map do |rep|
      {
        events: rep.aasm.events.map(&:name) - %i[request assign],
        id: rep.id,
        name: rep.user.name,
        email: rep.user.email,
        state: rep.state
      }
    end
  end

  private

  def self_reporting?
    return if user_id.blank? || manager_id.blank? || user_id != manager_id

    errors.add(:manager_id, 'User cannot self report to himself')
  end
end
