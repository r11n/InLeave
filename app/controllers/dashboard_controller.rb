# frozen_string_literal: true

class DashboardController < ApplicationController
  include EventLoader
  def index
    year(params[:year]) if params[:year].present? && params[:year].to_i > 2010
    load_events
  end

  def team
    restrict_employee
    @users = User.make_for_manager(current_user)
  end
end
