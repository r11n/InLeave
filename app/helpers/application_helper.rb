# frozen_string_literal: true

module ApplicationHelper
  def mat_icon(name)
    tag.i name, class: 'material-icons'
  end
end
