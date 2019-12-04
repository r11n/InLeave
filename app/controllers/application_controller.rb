class ApplicationController < ActionController::Base
  before_action :authenticate_user!
  layout 'blank', if: :devise_controller?
end
