# frozen_string_literal: true

# generic routes
class DashboardController < ApplicationController
  include EventLoader
  include ReportBuilder
  def index
    year(params[:year]) if params[:year].present? && params[:year].to_i > 2010
    load_events
  end

  def team
    restrict_employee
    @users = User.make_for_manager(current_user)
  end

  def reports
    restrict_manager
    respond_to do |format|
      format.html { render :reports }
      format.csv do
        send_data build_csv(report_params)
      end
    end
  end

  private

  def report_params
    params.permit(:type, :from_date, :end_date)
  end
end
