# frozen_string_literal: true

module EventLoader
  LEAVE_STATES ||= %w[
    manager_approved hr_approved auto_approved applied re_applied
    cancel_requested
  ].freeze
  def year(year = Time.zone.today.year)
    @year = year
  end

  def load_events
    year unless @year
    @events = holidays + user_events
    @events += manager_events if current_user.manager?
    @events += hr_events if current_user.admin? || current_user.hr?
    @events = @events.uniq
  end

  def user_events
    current_user.leaves.includes(
      :leave_type
    ).by_year(@year).where(state: LEAVE_STATES).map(&:as_event)
  end

  def holidays
    @holidays ||= Holiday.by_year(@year).map(&:as_event)
  end

  def manager_events
    Leave.includes(:user, :leave_type).by_year(@year).joins(
      user: :reporting
    ).where(
      reportings: { manager_id: current_user.id },
      state: LEAVE_STATES
    ).map(&:as_event)
  end

  def hr_events
    Leave.includes(:user, :leave_type).by_year(@year).where(
      state: LEAVE_STATES
    ).map(&:as_event)
  end
end
