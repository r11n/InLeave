# frozen_string_literal: true

class LeaveType < ApplicationRecord
  COUNTING_TYPES ||= %w[yearly monthly].freeze
  validate :valid_counting_type?
  validates :limit, :counting_type, presence: true
  validates :name, presence: true, uniqueness: { case_sensitive: false }
  validates :forward_limit, presence: true, if: :forward?
  validates :limit, numericality: { greater_than: 0 }
  validates :forward_limit, :forward_count,
            numericality: { greater_than: 0 }, if: :forward?
  before_validation :trim_name

  default_scope { order(:id) }

  def self.with_styles
    all.map do |type|
      type.attributes.tap do |val|
        val['style_name'] = type.to_color
      end
    end
  end

  def to_style
    "event-#{style_name}"
  end

  def to_color
    style_name
  end

  def monthly?
    counting_type == 'monthly'
  end

  private

  def style_name
    return 'azure' if name.downcase.include?('casual')
    return 'red' if name.downcase.include?('sick')
    return 'orange' if name.downcase.include?('work')
    return 'rose' if name.downcase.include?('annual')
    return 'blue' if name.downcase.include?('maternity')

    'default'
  end

  def valid_counting_type?
    return if COUNTING_TYPES.include? counting_type

    errors.add(:counting_type, 'Must be among "Yearly" "Monthly"')
  end

  def forward?
    forwadable.present? && forwadable
  end

  def trim_name
    self.name = name.strip
  end
end
