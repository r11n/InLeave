# frozen_string_literal: true

# user model
class User < ApplicationRecord
  extend CsvExporter
  SERIALIZER_EXCEPTIONS = %w[
    encrypted_password created_at updated_at reset_password_token
    reset_password_sent_at remember_created_at
  ].freeze
  csv_attributes('employee_id', 'name', 'email', 'current_leaves.count', 'role.name')
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  has_one :user_role, dependent: :destroy
  has_one :role, through: :user_role
  has_one :reporting, dependent: :destroy
  has_many :leaves, dependent: :destroy
  has_many :current_leaves, -> { current_year.order(:from_date) },
           class_name: 'Leave', inverse_of: :user
  has_many :accumulations, dependent: :destroy
  has_one :current_balance, -> { where(year: Time.zone.today.year) },
          class_name: 'Accumulation',
          dependent: :destroy,
          inverse_of: :user
  has_one :lastyear_balance, -> { where(year: Time.zone.today.year - 1) },
          class_name: 'Accumulation',
          dependent: :destroy,
          inverse_of: :user
  has_many(
    :reporter_links, foreign_key: :manager_id,
                     class_name: 'Reporting',
                     dependent: :nullify,
                     inverse_of: :user
  )
  has_many :team_members, through: :reporter_links, source: :user
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
  validates :email, :employee_id, presence: true,
                                  uniqueness: { case_sensitive: false }
  validates :first_name, :last_name, :joining_date, presence: true
  validate :role?
  after_create :create_reporting

  def name
    @name = "#{first_name} #{last_name}"
    @name = @name.presence || email
  end

  def extended_save(params)
    save && update(params)
  end

  def hr?
    role.present? && role.name.downcase == 'hr'
  end

  def admin?
    role.present? && role.name.downcase == 'admin'
  end

  def employee?
    role.present? && role.name.downcase == 'employee'
  end

  def manager?
    role.present? && role.name.downcase == 'manager'
  end

  def dummy?
    role.present? && role.name.downcase == 'dummy'
  end

  def supply_balance
    current_balance.presence || build_current_balance.forward_from_old_data
  end

  def self.make_for_manager(manager)
    {
      types: LeaveType.with_styles,
      users: includes(
        :current_balance, :current_leaves, :reporting
      ).where(reportings: { manager_id: manager.id }).map do |user|
        {
          name: user.name, email: user.email,
          leaves: user.current_leaves, accumulation: user.supply_balance
        }
      end
    }
  end

  private

  def role?
    errors.add(:user_role, "Can't be blank") if user_role.blank?
  end

  def create_reporting
    return reporting if reporting.present?

    build_reporting.save
  end
end
