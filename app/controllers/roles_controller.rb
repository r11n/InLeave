# frozen_string_literal: true

class RolesController < ApplicationController
  def index
    @roles = Role.all
  end

  def for_form
    @roles = Role.all.pluck(:id, :name).reject { |a| a[1].downcase == 'admin' }
    render json: @roles
  end
end
