class LeavesController < ApplicationController
  load_and_authorize_resource
  before_action :load_leave_types
  before_action :load_leave
  def index; end

  def new; end

  def show
    @leave = Leave.find(params[:id])
    render :index
  end

  def create
  end

  def update
  end

  def effective_days
    Leave.new(day_calc_params)
  end

  private

  def day_calc_params
    params.require(:leave).permit(:from, :end)
  end

  def leave_params
    params.require(:leave).permit(:leave_type_id, :reason, :from, :end)
  end

  def load_ess_vars
    @leave_types = LeaveTypes.all
    @new_leave = Leave.new
  end
end
