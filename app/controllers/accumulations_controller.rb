# frozen_string_literal: true

# Balances Controller
class AccumulationsController < ApplicationController
  load_and_authorize_resource

  def index
    @type_data = LeaveType.with_styles
    @accumulations = User.includes(:current_balance).select(
      :id, :first_name, :last_name, :email
    ).all.map do |user|
      {
        name: user.name,
        email: user.email,
        accumulation: user.supply_balance
      }
    end
  end

  def balance
    @type_data = LeaveType.with_styles
    @accumulation = current_user.supply_balance
    render json: { accumulation: @accumulation, types: @type_data }
  end

  def update
    @accumulation = Accumulation.find(params[:id])
    if @accumulation.update(accumulations_params)
      render json: { message: 'updated' }, status: :ok
    else
      render json: { validations: @accumulations.errors }, status: :bad_request
    end
  end

  private

  def accumulations_params
    params.require(:accumulation).permit(forward_data: {})
  end
end
