# frozen_string_literal: true

# for building mail content
module LeaveMailServicer
  attr_accessor :leave, :mailer
  CPROC = lambda do |l|
    if l.auto_approved? || l.cancelled?
      "leave request was #{l.state.sub('_', ' ')}"
    else
      "#{l.state.sub('_', ' ')} leave request"
    end
  end
  SUBJECT_PROCS = {
    applied: ->(l) { "#{l.user.name} applied for leave" },
    re_applied: ->(l) { "#{l.user.name} re applied for leave" },
    auto_approved: CPROC,
    cancel_requested: ->(l) { "#{l.user.name} requested Leave cancellation" },
    cancelled: CPROC,
    hr_approved: CPROC,
    hr_rejected: CPROC,
    manager_approved: CPROC,
    manager_rejected: CPROC
  }.freeze

  def build_mail(leave)
    @leave = leave
    to = receivers
    cc = [*hr, *(leave.cc_list || [])].uniq
    @mailer = Mailer.new(
      to, subject_builder(leave), content_builder(leave).content,
      cc: cc
    )
  end

  def receivers
    to = if leave.applied? || leave.cancel_requested?
           [leave.user.manager&.email].reject(&:nil?).presence || hr
         elsif leave.auto_approved?
           [leave.user.email, leave.user.manager&.email]
         else
           [leave.user.email]
         end
    to
  end

  def hr
    @hr ||= User.joins(:role).where(roles: { name: 'hr' }).pluck(:email)
  end

  def subject_builder(leave)
    SUBJECT_PROCS[leave.state.to_sym].call(leave)
  end

  def content_builder(leave)
    ContentBuilder.new(leave)
  end
end
