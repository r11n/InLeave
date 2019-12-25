# frozen_string_literal: true

module ApplicationHelper
  FILTERED ||= %w[created_at updated_at].freeze
  def mat_icon(name)
    tag.i name, class: 'material-icons'
  end

  def flash_message_make(errors)
    errors.full_messages.join('<br />')
  end

  def menus
    menus = Menu.new
    return menus.hr_menus if current_user.hr? || current_user.admin?
    return menus.manager_menus if current_user.manager?

    menus.employee_menus
  end

  def attrize(objs)
    objs.map { |k| k.attributes.except(*FILTERED) }
  end
end
