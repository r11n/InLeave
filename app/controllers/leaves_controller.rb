# frozen_string_literal: true

class LeavesController < ApplicationController
  include LeavesHelper
  load_and_authorize_resource
  before_action :load_leaves, except: %i[create update effective_days]
  before_action :load_leave, only: %i[show update save]
  def index
    respond_to do |format|
      format.html { render :index }
      format.json do
        render json: attributize_leaves(@leaves)
      end
    end
  end

  def new
    render :index
  end

  def show
    render :index
  end

  def create
    @leave = Leave.new(leave_params.extend_user(current_user))
    handle_leave_state
    if @leave.save
      render json: { message: 'Leave created', id: @leave.id }, status: :created
    else
      render json: {
        validations: @leave.errors
      }, status: :bad_request
    end
  end

  def update
    handle_leave_state
    if @leave.update(leave_params.extend_user(current_user))
      render json: {
        message: 'Leave updated', leave: filter_leave(@leave)
      }, status: :created
    else
      render json: {
        validations: @leave.errors
      }, status: :bad_request
    end
  end

  def effective_days
    leave = Leave.new(day_calc_params)
    days = leave.days
    render json: { day_collection: days, effective_days: days.size }
  end

  def team
  end

  def requests
    @leaves = Leave.includes(user: :reporting).where(
      reportings: { manager_id: current_user.id },
      state: %w[applied re_applied]
    )
    respond_to do |format|
      format.html { render :requests }
      format.json { render json: present_to_manager(@leaves) }
    end
  end

  def save
    if save_call
      render json: { message: 'saved' }, status: :ok
    else
      render json: { validations: @leave.errors }, status: :bad_request
    end
  rescue ArgumentError, AASM::InvalidTransition => e
    render json: { message: e.message }, status: :bad_request
  end

  private

  def load_leave
    @leave = Leave.find(params[:id])
  end

  def load_leaves
    @leaves = current_user.leaves
  end

  def day_calc_params
    date_wrap(params.permit(:from_date, :end_date))
  end

  def leave_params
    date_wrap(
      params.require(:leave).permit(
        :leave_type_id, :reason, :from_date, :end_date, :half
      )
    )
  end

  def save_call
    unless Leave.aasm.events.map(&:name).include? params[:destination].to_sym
      raise ArgumentError, 'Requested change is not authorized'
    end

    @leave.send(params[:destination])
    @leave.save
  end

  def handle_leave_state
    @leave.state = 're_applied' if @leave.state != 'applied'
  end
end
