# extends active record querying to search jsonb array columns
module JsonExtender
  def array_eq(column_name, *args)
    array_contains(column_name, *args)
  end

  def array_contains(column_name, *args)
    args = args.map(&:to_s) unless [Integer, Float].include?(args[0].class)
    where(["#{table_name}.#{column_name} ?& ARRAY[:vals]", { vals: args }])
  end

  def array_contains_any(column_name, *args)
    args = args.map(&:to_s) unless [Integer, Float].include?(args[0].class)
    where(["#{table_name}.#{column_name} ?| ARRAY[:vals]", { vals: args }])
  end

  def with_json_keys(column_name, *args)
    array_contains(column_name, *args)
  end

  def with_any_json_keys(column_name, *args)
    array_contains_any(column_name, *args)
  end

  def with_json_key_value(column, **args)
    where("#{table_name}.#{column} @> '{#{build_for_json(args)}}'::jsonb")
  end

  def with_removed_array_item(column_name, arg)
    select("*, (#{table_name}.#{column_name} - '#{arg}') as #{column_name}")
  end

  def with_removed_json_keys(column, *args)
    select('*', infix_build('-', column, args, prefix: '{', suffix: '}'))
  end

  private

  def build_for_json(hash)
    hash.to_a.map do |a|
      str = "\"#{a[0]}\": "
      str += [Integer, Float].include?(a[1]) ? a[1] : "\"#{a[1]}\""
      str
    end.join(', ')
  end

  def infix_build(operator, column, arr, **opts)
    Arel::Nodes::InfixOperation.new(
      operator, arel_table[column], quoted_build(arr, **opts)
    ).as(column.to_s)
  end

  def quoted_build(arr, **opt)
    Arel::Nodes.build_quoted("#{opt[:prefix]}#{arr.join(', ')}#{opt[:suffix]}")
  end
end
