# frozen_string_literal: true

require 'sidekiq-scheduler'

# for calculating accumulations
class AccumulationWorker
  include Sidekiq::Worker

  def perform
    puts 'Test run'
  end
end
