class UsersController < ApplicationController
  # load_and_authorize_resource
  def index
    @users = User.includes(:role).all
  end
end
