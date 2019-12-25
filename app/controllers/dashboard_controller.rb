# frozen_string_literal: true

class DashboardController < ApplicationController
  include EventLoader
  def index
    year(params[:year]) if params[:year].present? && params[:year].to_i > 2010
    load_events
  end
end
