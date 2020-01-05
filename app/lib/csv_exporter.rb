# frozen_string_literal: true

require_dependency 'csv'
# builds to_csv method for given model
module CsvExporter
  def csv_attributes(*args)
    define_nested_link
    @@export_attributes = args
  end

  def to_csv
    generate(:id, @@export_attributes)
  end

  def custom_csv_build(order_attr, *args)
    generate(order_attr.presence || :id, args)
  end

  private

  def generate(order_attr, attributes)
    CSV.generate(headers: true) do |csv|
      csv << filtered(attributes)
      order(order_attr).each do |obj|
        csv << attributes.map { |attr| obj.nested_send(non_as_name(attr)) }
      end
    end
  end

  def filtered(names)
    names.map { |k| as_name(k.split('.').join(' ')) }
  end

  def as_name(attr)
    attr.split(' as ')[-1]
  end

  def non_as_name(attr)
    attr.split(' as ')[0]
  end

  def define_nested_link
    class_eval do
      define_method(:nested_send) do |attribute|
        if attribute.match(/\./)
          relation, att = attribute.split('.')
          send(relation)&.send(att)
        else
          send(attribute)
        end
      end
    end
  end
end
