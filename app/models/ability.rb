# frozen_string_literal: true

class Ability
  include CanCan::Ability

  def initialize(user)
    @user = user
    send(@user.role.name.downcase) if user.present?
  end

  def admin
    can :manage, :all
  end

  def hr
    can :manage, [User, Leave, Holiday, Reporting, LeaveType]
  end

  def manager
    can :manage, [Leave, Reporting]
    can :read, [Holiday, LeaveType]
  end

  def employee
    can :manage, [Leave, Reporting], user_id: user.id
    can :read, [Holiday, LeaveType]
  end
end
