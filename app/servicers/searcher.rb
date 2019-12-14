module Searcher
  # TODO: @raghavendranekkanti add support for other models too
  def all_search(query, user = current_user)
    return full_search(query) if user.hr? || user.admin?

    employee_search(query)
  end

  private

  def employee_search(_query)
    []
  end

  def full_search(query)
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
        index: res.id
      }
    end
  end

  def path_linker(res)
    return user_path(res) if res.class == User
  end

  def texter(res)
    return res.name if res.class == User
  end

  def bi_texter(res)
    return res.email if res.class == User
  end
end
