# frozen_string_literal: true

# Role based authorizations 
class Ability
  include CanCan::Ability
  attr_accessor :user
  def initialize(user)
    @user = user
    send(@user.role.name.downcase) if user.present? && user.role.present?
  end

  def admin
    can :manage, :all
  end

  def hr
    can(
      :manage,
      [User, Leave, Holiday, Reporting, LeaveType, Accumulation]
    )
  end

  def dummy
    cannot :view, :all
  end

  def manager
    can :manage, [Leave, Reporting]
    can :read, [Holiday, LeaveType]
    can :read, [Accumulation], user_id: [user.id, *user.team_members.ids]
    can :read, [user], id: [user.id, *user.team_members.ids]
  end

  def employee
    can :manage, [Leave], user_id: user.id
    can :read, [Holiday, LeaveType]
    can :read, [Accumulation], user_id: user.id
  end
end
