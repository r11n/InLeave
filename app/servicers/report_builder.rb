# frozen_string_literal: true

require_dependency 'csv'
# for building reports
module ReportBuilder
  TYPES ||= %w[daily weekly monthly yearly custom].freeze
  APPROVED_STATES ||= %w[auto_approved manager_approved auto_approved].freeze
  def build_csv(params)
    @type = params[:type]
    @from_date = params[:from_date]
    @end_date = params[:end_date]
    raise ArgumentError, 'Invalid report type' unless TYPES.include?(@type)

    generate_report
  end

  def generate_report
    send(@type)
  end

  private

  def daily
    Leave.includes(:leave_type, :user).matching_range(
      :day_collection, 'dates', Time.zone.today
    ).where(state: APPROVED_STATES).custom_csv_build(
      :from_date,
      'user.employee_id as id', 'user.name as username', 'user.email as email',
      'leave_type.name as leave type', 'type_day as half/full day'
    )
  end

  def weekly
    today = Time.zone.today
    query_builder(
      today.beginning_of_week, today.end_of_week
    ).custom_csv_build(
      :from_date,
      'from_date as start date', 'user.employee_id as id',
      'user.name as username', 'user.email as email',
      'leave_type.name as leave type', 'type_day as half/full day', 'dates',
      'dates.size as number of days'
    )
  end

  def monthly
    today = Time.zone.today
    query_builder(
      today.beginning_of_month, today.end_of_month
    ).custom_csv_build(
      :from_date,
      'from_date as start date', 'user.employee_id as id',
      'user.name as username', 'user.email as email',
      'leave_type.name as leave type', 'type_day as half/full day', 'dates',
      'dates.size as number of days'
    )
  end

  def yearly
    today = Time.zone.today
    query_builder(
      today.beginning_of_year, today.end_of_year
    ).custom_csv_build(
      :from_date,
      'from_date.month_name as month', 'from_date as start date',
      'user.employee_id as id', 'user.name as username', 'user.email as email',
      'leave_type.name as leave type', 'type_day as half/full day', 'dates',
      'dates.size as number of days'
    )
  end

  def custom
    raise ArgumentError 'dates not specified' unless dated?

    query_builder(
      parse_date(@from_date), parse_date(@end_date)
    ).custom_csv_build(
      :from_date,
      'from_date.month_name as month', 'from_date as start date',
      'user.employee_id as id', 'user.name as username', 'user.email as email',
      'leave_type.name as leave type', 'type_day as half/full day', 'dates',
      'dates.size as number of days'
    )
  end

  def dated?
    @from_date.present? && @end_date.present?
  end

  def parse_date(date)
    Date.parse(
      Time.zone.parse(date).localtime.to_s
    )
  end

  def query_builder(starting, ending)
    Leave.includes(:leave_type, :user).matching_range(
      :day_collection, 'dates',
      *(starting..ending).to_a
    ).where(state: APPROVED_STATES)
  end
end
