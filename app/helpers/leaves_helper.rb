module LeavesHelper
  def attributize_leaves(leaves)
    leaves.map do |u|
      filter_leave(u)
    end
  end

  def filter_leave(leave)
    leave.attributes.except('created_at', 'updated_at')
  end
end