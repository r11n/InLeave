# frozen_string_literal: true

class NotificationWorker
  include Sidekiq::Worker
  include LeaveMailServicer
  def perform(leave_id)
    leave =Leave.find(leave_id)
    mailer = build_mail(leave)
    mailer.send
  end
end
