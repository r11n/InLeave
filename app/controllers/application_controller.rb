# frozen_string_literal: true

class ApplicationController < ActionController::Base
  before_action :authenticate_user!
  layout 'blank', if: :devise_controller?
  def authenticated_user
    current_user || 'InTrack System'
  end
end
