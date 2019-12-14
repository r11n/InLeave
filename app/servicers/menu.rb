class Menu
  include Rails.application.routes.url_helpers
  def employee_menus
    generic
  end

  def manager_menus
    generic + divider + manager
  end

  def hr_menus
    generic + divider + manager + divider + hr - team
  end

  def admin_menus
    hr_menus
  end

  private

  def generic
    @generic ||= [
      { text: 'Apply for Leave', link: new_leave_path },
      { text: 'My Leaves', link: leaves_path },
      { text: 'Calendar', link: root_path },
      { text: 'Change Reporting', link: reportings_path}
    ]
  end

  def manager
    @manager ||= team + [
      { text: 'Leave Requests', link: requests_leaves_path },
      { text: 'Reporting Requests', link: requests_reportings_path },
      { text: 'Balances', link: users_path }
    ] 
  end

  def team
    @team ||= [
      { text: 'Team', link: team_leaves_path }
    ]
  end

  def hr
    @hr ||= [
      { text: 'User Management', link: users_path },
      { text: 'Holiday Management', link: holidays_path }
    ]
  end

  def divider
    @divider ||= [
      {
        divider: true
      }
    ]
  end
end
