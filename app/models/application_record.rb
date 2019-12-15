# frozen_string_literal: true

class ApplicationRecord < ActiveRecord::Base
  extend JsonExtender
  self.abstract_class = true
end
