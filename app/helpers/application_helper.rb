# frozen_string_literal: true

module ApplicationHelper
  def mat_icon(name)
    tag.i name, class: 'material-icons'
  end

  def flash_message_make(errors)
    errors.full_messages.join('<br />')
  end
end
