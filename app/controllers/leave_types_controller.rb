class LeaveTypesController < ApplicationController
  def index
    @leave_types = LeaveType.all.pluck(:id, :name)
    respond_to do |format|
      format.html { render 'index' }
      format.json { render json: @leave_types }
    end
  end
end
