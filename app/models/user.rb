# frozen_string_literal: true

class User < ApplicationRecord
  SERIALIZER_EXCEPTIONS = %w[
    encrypted_password created_at updated_at reset_password_token
    reset_password_sent_at remember_created_at
  ].freeze
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  has_one :user_role, dependent: :destroy
  has_one :role, through: :user_role
  has_one :reporting, dependent: :destroy
  has_one(
    :manager, class_name: 'User',
              through: :reporting,
              source: :manager
  )
  accepts_nested_attributes_for(
    :user_role,
    reject_if: ->(attributes) { attributes['role_id'].blank? },
    allow_destroy: true
  )
  validates :email, presence: true, uniqueness: { case_sensitive: false }
  validates :first_name, :last_name, presence: true
  validate :has_role?

  def name
    @name = "#{first_name} #{last_name}"
    @name = @name.presence || email
  end

  def extended_save(params)
    save && update(params)
  end

  private

  def has_role?
    errors.add(:user_role, "Can't be blank") if user_role.blank?
  end
end