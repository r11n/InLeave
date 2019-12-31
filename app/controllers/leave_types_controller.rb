# frozen_string_literal: true

class LeaveTypesController < ApplicationController
  load_and_authorize_resource except: [:for_form]
  def index
    @leave_types = LeaveType.all
  end

  def create
    @leave_type = LeaveType.new(leave_type_params)
    if @leave_type.save
      render json: { message: 'Created', id: @leave_type.id }, status: :created
    else
      render json: { validations: @leave_type.errors }, status: :bad_request
    end
  end

  def update
    @leave_type = LeaveType.find(params[:id])
    if @leave_type.update(leave_type_params)
      render json: { message: 'Updated' }, status: :created
    else
      render json: { validations: @leave_type.errors }, status: :bad_request
    end
  end

  def for_form
    @leave_types = LeaveType.all.pluck(:id, :name)
    render json: @leave_types
  end

  private

  def leave_type_params
    params.require(:leave_type).permit(
      :name, :forwadable, :limit, :forward_limit, :forward_count, :counting_type
    )
  end
end
