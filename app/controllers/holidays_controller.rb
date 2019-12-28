# frozen_string_literal: true

# Holidays Controller
class HolidaysController < ApplicationController
  include LeavesHelper
  load_and_authorize_resource
  before_action :load_holidays, except: %i[create update]
  before_action :load_holiday, only: %i[show update]
  def index
    respond_to do |format|
      format.html { render :index }
      format.json do
        render json: attributize_leaves(@holidays)
      end
    end
  end

  def new
    render :index
  end

  def show
    render :index
  end

  def create
    @holiday = Holiday.new(holiday_params)
    if @holiday.save
      render json: { message: 'Leave created', id: @holiday.id }, status: :created
    else
      render json: {
        validations: @holiday.errors
      }, status: :bad_request
    end
  end

  def update
    if @holiday.update(holiday_params)
      render json: {
        message: 'Leave updated', holiday: filter_leave(@holiday)
      }, status: :created
    else
      render json: {
        validations: @holiday.errors
      }, status: :bad_request
    end
  end

  private

  def load_holiday
    @holiday = Holiday.find(params[:id])
  end

  def load_holidays
    @holidays = Holiday.by_year(params[:year] || Time.zone.now.year)
    @range = (
      Holiday.minimum(:from_date).year..Holiday.maximum(:from_date).year
    ).to_a
  end

  def holiday_params
    date_wrap(
      params.require(:holiday).permit(
        :description, :from_date, :end_date, :name
      )
    )
  end
end
