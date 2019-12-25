# frozen_string_literal: true

# Load the Rails application.
require_relative 'application'

# Initialize the Rails application.
Rails.application.initialize!
# mailer settings
ActionMailer::Base.smtp_settings = {
  user_name: 'apikey',
  password: ENV['SMTP_PASSWORD'],
  domain: ENV['HOST'],
  address: 'smtp.sendgrid.net',
  port: 587,
  authentication: :plain,
  enable_starttls_auto: true
}
