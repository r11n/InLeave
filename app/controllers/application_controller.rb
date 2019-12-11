# frozen_string_literal: true

class ApplicationController < ActionController::Base
  before_action :authenticate_user!
  # rescues
  rescue_from CanCan::AccessDenied, with: -> { deny_access }

  def authenticated_user
    current_user || 'InTrack System'
  end

  private

  def deny_access
    render '/shared/not_found', layout: 'blank', status: :not_found
  end
end
