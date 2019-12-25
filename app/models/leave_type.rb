# frozen_string_literal: true

class LeaveType < ApplicationRecord
  def to_style
    "event-#{style_name}"
  end

  def to_color
    style_name
  end

  private

  def style_name
    return 'azure' if name.downcase.include?('casual')
    return 'red' if name.downcase.include?('sick')
    return 'orange' if name.downcase.include?('work')
    return 'rose' if name.downcase.include?('annual')
  end
end
