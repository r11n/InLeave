# frozen_string_literal: true

module Searcher
  # TODO: @raghavendranekkanti add support for other models too
  def all_search(query, user = current_user)
    return full_search(query) if user.hr? || user.admin?

    employee_search(query)
  end

  private

  def employee_search(query)
    holiday_search(query) + leave_search(query)
  end

  def holiday_search(query)
    map_as_results(Holiday.ransack(
      name_or_description_cont_any: query
    ).result.limit(10))
  end

  def leave_search(query)
    map_as_results(Leave.where(user_id: current_user.id).ransack(
      reason_cont_any: query
    ).result.limit(10))
  end

  def full_search(query)
    user_search(query) + holiday_search(query) + leave_search(query)
  end

  def user_search(query)
    map_as_results(User.ransack(
      first_name_or_last_name_or_email_cont_any: query
    ).result.limit(10))
  end

  def map_as_results(results)
    return [] if results.blank?

    results.map do |res|
      {
        link: path_linker(res),
        text: texter(res),
        secondary_text: bi_texter(res),
        index: indexer(res)
      }
    end
  end

  def indexer(res)
    "#{res.class}iden#{res.id}"
  end

  def path_linker(res)
    return user_path(res) if res.class == User

    return unless [Holiday, Leave].include?(res.class)

    root_path(
      year: res.from_date.year,
      month: res.from_date.month
    )
  end

  def texter(res)
    return res.name if res.class == User
    return unless [Holiday, Leave].include?(res.class)

    res.name
  rescue NoMethodError
    res.class.to_s
  end

  def bi_texter(res)
    return res.email if res.class == User
    return "#{res.from_date}: #{res.description}" if res.class == Holiday
    return "#{res.from_date}: #{res.reason}" if res.class == Leave
  end
end
