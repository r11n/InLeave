# frozen_string_literal: true

# Reporting Controller
class ReportingsController < ApplicationController
  def index
    load_reporting_buckets
  end
end
