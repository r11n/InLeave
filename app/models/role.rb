# frozen_string_literal: true

class Role < ApplicationRecord
  has_many :user_role, dependent: :destroy
  has_many :users, class_name: 'User', through: :user_roles

  def self.employee
    find_by(name: %w[employee Employee EMPLOYEE])
  end

  def self.dummy
    find_by(name: %w[dummy Dummy DUMMY])
  end
end
