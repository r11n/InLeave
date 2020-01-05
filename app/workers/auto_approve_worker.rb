# frozen_string_literal: true

require 'sidekiq-scheduler'

# for auto approving leaves
class AutoApproveWorker
  include Sidekiq::Worker

  def perform
    leaves.each(&:auto_approve)
  end

  private

  def arel
    @arel ||= Leave.arel_table
  end

  def leaves
    @leaves ||= Leave.where(state: %w[applied re_applied]).where(
      arel[:updated_at].lteq(Time.zone.now - 7.days)
    )
  end
end
