# frozen_string_literal: true

class LeavesController < ApplicationController
  include LeavesHelper
  load_and_authorize_resource
  before_action :load_leaves, except: %i[create update effective_days]
  before_action :load_leave, only: %i[show update]
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

  def team
  end

  def requests
  end

  private

  def load_leave
    @leave = Leave.find(params[:id])
  end

  def load_leaves
    @leaves = current_user.leaves
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
end
