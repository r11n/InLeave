class ErrorsController < ApplicationController
  def not_found
    render '/shared/not_found', layout: 'blank', status: :not_found
  end

  def internal_error
    render '/shared/internal_error', layout: 'blank', status: 500
  end
end