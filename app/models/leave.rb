# frozen_string_literal: true

class Leave < ApplicationRecord
  belongs_to :user
  belongs_to :leave_type
end
