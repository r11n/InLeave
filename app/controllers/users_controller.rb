class UsersController < ApplicationController
  include UsersHelper
  load_and_authorize_resource
  before_action :load_user, only: [:update]
  def index
    @users = User.includes(:role).all
    respond_to do |format|
      format.html { render 'index' }
      format.json { render json: extend_with_roles(@users) }
    end
  end

  def save
    extended_params = user_params.extend_with_password
    @user = User.new(extended_params)
    if @user.extended_save(extended_params)
      render json: { message: 'User created', id: @user.id }, status: :created
    else
      render json: {
        validations: @user.errors
      }, status: :bad_request
    end
  end

  def update
    if @user.update(user_params)
      render json: {
        message: 'User updated', user: with_role(@user.reload)
      }, status: :created
    else
      render json: {
        validations: @user.errors
      }, status: :bad_request
    end
  end

  private

  def load_user
    @user = User.find(params[:id])
  end

  def user_params
    params.require(:user).permit(
      :id, :first_name, :last_name, :email, user_role_attributes: [:role_id]
    )
  end
end
