# frozen_string_literal: true

module ApplicationHelper
  GENERIC ||= [
    {
      text: 'Apply for Leave',
      link: new_leave_path
    },
    {
      text: 'My Leaves',
      link: leaves_path
    },
    {
      text: 'Calendar',
      link: root_path
    }
  ].freeze

  MANAGER ||= [
    {
      text: 'Leave Requests',
      link: requests_leave_path
    }
  ]

  def mat_icon(name)
    tag.i name, class: 'material-icons'
  end

  def flash_message_make(errors)
    errors.full_messages.join('<br />')
  end

  def menus
    return full_menu if current_user.hr? || current_user.admin?
    return man_menu if current_user.manager?

    employee_menu
  end

  def full_menu
  end

  def man_menu
  end

  def employee_menu
  end
end
