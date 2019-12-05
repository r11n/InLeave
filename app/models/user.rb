# frozen_string_literal: true

class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  has_one :user_role
  has_one :role, through: :user_role
  has_one :reporting
  has_one(
    :manager, class_name: 'User',
                        through: :reporting,
                        source: :manager
  )

  def name
    @name = "#{first_name} #{last_name}"
    @name = @name.blank? ? email : @name
  end
end
