# frozen_string_literal: true

# Reporting Controller
class ReportingsController < ApplicationController
  load_and_authorize_resource
  def index
    @reportings = Reporting.hr_list if current_user.hr? || current_user.admin?
    @reportings = Reporting.manager_list(current_user) if current_user.manager?
    @reporting = Reporting.find_by(user: current_user)
  end

  def save
    @reporting = Reporting.find(params[:id])
    if save_call
      render json: { message: 'saved' }, status: :ok
    else
      render json: { validations: @reporting.errors }, status: :bad_request
    end
  rescue AASM::InvalidTransition => e
    render json: { message: e.message }
  end

  private

  def save_call
    id = /^assigned\-(\d+)/.match(params[:destination]).to_a[1]
    dest = params[:destination]
    dest = 'assigned' if id.present?
    @reporting.manager_id = id if id.present?
    @reporting.manager_id = nil if %w[relieved relieve].include? dest
    @reporting.send(lookup(dest)) && @reporting.save
  end

  def lookup(location)
    OpenStruct.new(
      relieved: :relieve,
      requested: :request,
      assigned: :assign,
      relieve: :relieve,
      request: :request,
      assign: :assign
    ).send(location)
  end
end
