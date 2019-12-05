module LeaveMailServicer
  CPROC = ->(l) do
    if l.auto_approved?
      "leave request was #{l.state.sub('_', ' ')}"
    else
      "#{l.state.sub('_', ' ')} leave request"
    end
  end
  SUBJECT_PROCS = {
    applied: ->(l) { "#{l.user.name} applied for leave" },
    auto_approved: CPROC,
    cancelled: ->(l) { "#{l.user.name} cancelled leave request" },
    hr_approved: CPROC,
    hr_rejected: CPROC,
    manager_approved: CPROC,
    manager_rejected: CPROC
  }.freeze

  def build_mail(leave)
    to, cc = [], [hr]
    if (leave.applied? || leave.cancelled?) 
      to = [leave.user.manager]
    elsif leave.auto_approved?
      to = [leave.user, leave.user.manager]
    else
      to = [leave.user]
    end
    @mailer = Mailer.new(
      to,subject_builder(leave), content_builder(leave),
      cc: cc
    )
  end

  def hr
    @hr ||= User.joins(:role).where(roles: {name: 'hr'}).first
  end

  def subject_builder(leave)
    SUBJECT_PROCS[leave.state.to_sym].call(leave)
  end

  def content_builder(leave)
    ContentBuilder.new(leave)
  end
end