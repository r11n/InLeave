# frozen_string_literal: true

class LeaveType < ApplicationRecord
  COUNTING_TYPES ||= %w[yearly monthly].freeze
  validate :valid_counting_type?
  validates :name, :limit, :counting_type, presence: true
  validates :forward_limit, :forward_count, presence: true, if: :forward?
  validates :limit, numericality: { greater_than: 0 }
  validates :forward_limit, :forward_count,
            numericality: { greater_than: 0 }, if: :forward?

  def to_style
    "event-#{style_name}"
  end

  def to_color
    style_name
  end

  private

  def style_name
    return 'azure' if name.downcase.include?('casual')
    return 'red' if name.downcase.include?('sick')
    return 'orange' if name.downcase.include?('work')
    return 'rose' if name.downcase.include?('annual')
  end

  def valid_counting_type?
    return if COUNTING_TYPES.include? counting_type

    errors.add(:counting_type, 'Must be among "Yearly" "Monthly"')
  end

  def forward?
    forwadable.present? && forwadable
  end
end
