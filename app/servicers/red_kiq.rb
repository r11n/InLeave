# frozen_string_literal: true

class RedKiq
  EXPIRY_PERIOD = 3.days
  attr_accessor :client
  def initialize(namespace = 'intrack')
    @namespace = namespace
    @client = Redis::Namespace.new(namespace, redis: Redis.new)
  end

  def store(date, val = 'YES')
    client.set(redis_key(date), val)
    client.expireat(redis_key(date), (Time.zone.now + EXPIRY_PERIOD).to_i)
  end

  def cached?(key)
    client.exists(redis_key(key))
  end

  def holiday?(date)
    cached?(date) && client.get(redis_key(date)) == 'YES'
  end

  def flush
    client.del(client.keys('*'))
  end

  private

  def redis_key(key)
    key.to_s
  end
end
