# frozen_string_literal: true

# for storing reporting manager
class Reporting < ApplicationRecord
  belongs_to :user
  belongs_to :manager,  class_name: 'User',
                        foreign_key: 'manager_id',
                        inverse_of: :user
end
