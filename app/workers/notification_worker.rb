# frozen_string_literal: true

class NotificationWorker
  include Sidekiq::Worker

  def perform(leave)
    mailer = build_mail(leave)
    mailer.send
  end
end
