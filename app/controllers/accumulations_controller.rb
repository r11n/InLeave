# frozen_string_literal: true

# Balances Controller
class AccumulationsController < ApplicationController
  load_and_authorize_resource except: [:balance]

  def index
    @type_data = LeaveType.with_styles
    user_load
    @accumulations = @users.map do |user|
      {
        name: user.name,
        email: user.email,
        accumulation: user.supply_balance
      }
    end
  end

  def balance
    @type_data = LeaveType.with_styles
    @accumulation = (paramed_user.presence || current_user).supply_balance
    render json: { accumulation: @accumulation, types: @type_data }
  end

  def update
    raise CanCan::AccessDenied unless current_user.hr? || current_user.admin?

    @accumulation = Accumulation.find(params[:id])
    if @accumulation.update(accumulations_params)
      render json: { message: 'updated' }, status: :ok
    else
      render json: { validations: @accumulation.errors }, status: :bad_request
    end
  end

  private

  def paramed_user
    return nil if current_user.employee?

    @user = User.find_by(id: params[:user_id])
  end

  def user_load
    raise CanCan::AccessDenied unless current_user.hr? || current_user.admin?

    @users = []
    return if current_user.employee?

    @users = User.includes(:current_balance).select(
      :id, :first_name, :last_name, :email, :joining_date
    )
    return unless current_user.manager?

    @users = @users.where(id: current_user.team_member_ids)
  end

  def accumulations_params
    params.require(:accumulation).permit(forward_data: {})
  end
end
