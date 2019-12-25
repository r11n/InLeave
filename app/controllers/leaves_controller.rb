# frozen_string_literal: true

class LeavesController < ApplicationController
  include LeavesHelper
  load_and_authorize_resource
  before_action :load_leaves, except: %i[create update effective_days]
  before_action :load_leave_types, except: %i[create update]
  before_action :load_leave, only: %i[show update]
  def index
    respond_to do |format|
      format.html { render :index }
      format.json do
        render json: @leaves.map do |k|
          k.attributes.except(*ApplicationHelper::FILTERED)
        end
      end
    end
  end

  def new
    render :index
  end

  def show
    @leave = Leave.find(params[:id])
    render :index
  end

  def create
    @leave = Leave.new(leave_params.extend_user(current_user))
    if @leave.save
      render json: { message: 'Leave created', id: @leave.id }, status: :created
    else
      render json: {
        validations: @leave.errors
      }, status: :bad_request
    end
  end

  def update
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

  private

  def load_leave
    @leave = Leave.find(params[:id])
  end

  def load_leaves
    @leaves = current_user.leaves
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

  def day_calc_params
    date_wrap(params.require(:leave).permit(:from_date, :end_date))
  end

  def leave_params
    date_wrap(
      params.require(:leave).permit(
        :leave_type_id, :reason, :from_date, :end_date, :half
      )
    )
  end

  def load_leave_types
    @leave_types = LeaveType.select(:id, :name).all
  end
end
