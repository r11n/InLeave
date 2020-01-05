# frozen_string_literal: true

# supports for holiday? to Date
# supports working_hours? to Time
Date.class_eval do
  define_method('holiday?') do
    Holiday.holiday?(self)
  end

  define_method('month_name') do
    self.strftime('%B')
  end
end

Time.class_eval do
  define_method('working_hours?') do
    hour >= 9 && hour <= 19
  end
end

ActionController::Parameters.class_eval do
  define_method('extend_with_password') do
    password = [*('a'..'z'), *(0..9)].sample(10).join
    self[:password] = self[:password_confirmation] = password
    self
  end

  define_method('extend_default_role') do
    role_attrs = self[:user_role_attributes]
    return if role_attrs.present? && role_attrs[:role_id].to_i.positive?

    sample_role = Role.find_by(name: %w[employee Employee EMPLOYEE'])
    self[:user_role_attributes] = {} if role_attrs.blank?
    self[:user_role_attributes][:role_id] = sample_role.id
    self
  end

  define_method('extend_user') do |user|
    return if user.blank?

    self[:user_id] = user.id
    self
  end
end
