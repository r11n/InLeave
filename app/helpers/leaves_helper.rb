# frozen_string_literal: true

module LeavesHelper
  NON_MANAGER_EVENTS ||= %i[
    re_apply hr_reject hr_approve auto_approve cancel
  ].freeze
  def attributize_leaves(leaves)
    leaves.map do |u|
      filter_leave(u)
    end
  end

  def filter_leave(leave)
    leave.attributes.except('created_at', 'updated_at')
  end

  def present_to_manager(leaves)
    leaves.map do |l|
      leave = filter_leave(l)
      leave[:name] = l.user.name
      leave[:email] = l.user.email
      leave[:events] = l.aasm.events.map(&:name) - NON_MANAGER_EVENTS
      leave
    end
  end
end
