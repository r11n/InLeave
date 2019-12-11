# frozen_string_literal: true

module ApplicationHelper
  def extend_with_roles(users)
    users.map do |u|
      u.attributes.tap do |i|
        i[:role_name] = u.role&.name || 'Employee'
      end
    end
  end

  def mat_icon(name)
    tag.i name, class: 'material-icons'
  end
end
