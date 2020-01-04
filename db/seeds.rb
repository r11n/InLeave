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

Role.import(role_seed_data.map { |d| Role.new(d) }) if roles.zero?
