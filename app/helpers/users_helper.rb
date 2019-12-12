module UsersHelper
  def extend_with_roles(users)
    users.map do |u|
      with_role(u)
    end
  end

  def with_role(user)
    user.attributes.tap do |i|
      i[:role_name] = user.role&.name || 'Employee'
      i[:role_id] = user.role&.id
    end.except(*User::SERIALIZER_EXCEPTIONS)
  end
end
