# frozen_string_literal: true
# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
roles = Role.count
role_seed_data = [
  { name: 'hr' },
  { name: 'admin' },
  { name: 'manager' },
  { name: 'employee' },
  { name: 'dummy' }
]
types = LeaveType.count
leave_type_seed_data = [
  {
    name: 'Casual Leave',
    limit: 12, forwadable: true, forward_limit: 20, counting_type: 'yearly'
  },
  {
    name: 'Sick Leave',
    limit: 6, forwadable: false, forward_limit: nil, counting_type: 'yearly'
  },
  {
    name: 'Work From Home',
    limit: 2.5, forwadable: false, forward_limit: nil, counting_type: 'monthly'
  },
  {
    name: 'Annual Leave',
    limit: 10, forwadable: false, forward_limit: nil, counting_type: 'yearly'
  },
  {
    name: 'Maternity Leave',
    limit: 180, forwadable: false, forward_limit: nil, counting_type: 'yearly'
  }
]

leave_type_seed_data.each{ |d| LeaveType.create(d) } if types.zero?
role_seed_data.each { |d| Role.create(d) } if roles.zero?
admin_role = Role.find_by(name: 'admin')
user = User.find_by(email: 'admin@in-track.com')
if user.blank?
  user = User.create(
    first_name: 'Admin',
    last_name: 'InTrack',
    email: 'admin@in-track.com',
    joining_date: Time.zone.today - 10.years,
    employee_id: '000000',
    password: '1qazxsw23edc',
    password_confirmation: '1qazxsw23edc'
  )
  user.role = admin_role
  user.save
end
