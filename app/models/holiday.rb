# frozen_string_literal: true

class Holiday < ApplicationRecord
  validates :from_date, presence: true, uniqueness: {
    case_sensitive: false
  }
  validates :end_date, uniqueness: {
    case_sensitive: false
  }, if: -> { end_date.present? }
  validates :name, presence: true
  validate :end_after_from?
  scope :current_year, lambda {
    where(
      arel_table[:from_date].gteq(Time.zone.today.beginning_of_year).and(
        arel_table[:end_date].lteq(Time.zone.today.end_of_year)
      ).and(arel_table[:multiple].eq(true)).or(
        arel_table[:from_date].between(
          Time.zone.today.beginning_of_year..Time.zone.today.end_of_year
        ).and(arel_table[:multiple].in([false, nil]))
      )
    )
  }

  scope :by_year, lambda { |year|
    where(
      arel_table[:multiple].eq(true).and(
        arel_table[:from_date].gteq("#{year}-01-01").and(
          arel_table[:end_date].lteq("#{year}-12-31")
        )
      )
    ).or(
      where(
        multiple: [nil, false],
        from_date: ("#{year}-01-01".."#{year}-12-31")
      )
    )
  }

  def self.holiday?(date)
    cacher = RedKiq.new('holiday')
    return cacher.holiday?(date) if cacher.cached?(date)

    avail = inbound_days(date).present?
    cacher.store(date, avail ? 'YES' : 'NO')
    avail
  end

  def multi_day?
    from && self.end
  end

  def valid_selection?
    from < self.end
  end

  def self.inbound_days(date)
    multi = where(
      arel_table[:end_date].gteq(date).and(
        arel_table[:from_date].lteq(date)
      ).and(arel_table[:multiple].eq(true))
    )
    single = where(from_date: date, multiple: [nil, false])
    multi.or(single)
  end

  def as_event
    {
      id: "h-#{id}",
      title: name || 'Holiday',
      start: "#{from_date}T00:00:00",
      end: multiple ? "#{end_date}T23:59:59" : nil,
      description: description || name,
      className: to_style,
      eventColor: to_color,
      allDay: false
    }
  end

  def to_style
    'event-green'
  end

  def to_color
    'green'
  end

  private

  def end_after_from?
    return unless from_date.present? && end_date.present?

    self.multiple = true
    errors.add(:end_date, 'Must be after start date') if from_date >= end_date
  end
end
