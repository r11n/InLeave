# frozen_string_literal: true

class ApplicationController < ActionController::Base
  include Searcher
  before_action :authenticate_user!
  # rescues
  rescue_from CanCan::AccessDenied, with: -> { deny_access }

  def authenticated_user
    current_user || 'InTrack System'
  end

  def search
    render json: params[:query].present? ? all_search(params[:query]) : [], status: :ok
  end

  def date_wrap(params)
    params[:from_date] = Date.parse(
      Time.zone.parse(params[:from_date]).localtime.to_s
    )
    if params[:end_date].present?
      params[:end_date] = Date.parse(
        Time.zone.parse(params[:end_date]).localtime.to_s
      )
    end
    params
  end

  def restrict_employee
    restrict_dummy
    can_canize if current_user.employee?
  end

  def restrict_manager
    restrict_employee
    can_canize if current_user.manager?
  end

  def restrict_dummy
    can_canize if current_user.dummy?
  end

  def can_canize
    raise CanCan::AccessDenied
  end

  private

  def deny_access
    respond_to do |format|
      format.html do
        render '/shared/not_found', layout: 'blank', status: :not_found
      end
      format.json do
        render json: { message: 'page not found', status: :not_found }
      end
    end
  end
end
