# supports for holiday? to Date
# supports working_hours? to Time
Date.class_eval do
  define_method('holiday?') do
    Holiday.holiday?(self)
  end
end

Time.class_eval do
  define_method('working_hours?') do
    hour >= 9 && hour <= 19
  end
end
