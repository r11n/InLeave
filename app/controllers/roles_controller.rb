class RolesController < ApplicationController
  def index
    @roles = Role.all
  end

  def for_form
    @roles = Role.all.pluck(:id, :name)
    render json: @roles
  end
end