# frozen_string_literal: true

require 'sendgrid-ruby'
class Mailer
  include SendGrid
  attr_accessor :api, :mail, :response

  def initialize(to, subject, content, opts = {})
    @mail = Mail.new
    @mail.from = Email.new(email: opts[:from] || 'intrack-india@inmar.com')
    @mail.subject = subject
    content_type = opts[:type] || 'text/html'
    build_to_n_cc(to, opts[:cc])
    @mail.add_content(Content.new(type: content_type, value: content))
    @api = SendGrid::API.new(api_key: ENV['SENDGRID_API_KEY'])
  end

  def send
    @response = api.client.mail._('send').post(request_body: @mail.to_json)
  end

  private

  def build_to_n_cc(to, cc)
    pers = Personalization.new
    to.each { |t| pers.add_to(Email.new(email: t)) } if to.class == Array
    pers.add_to(Email.new(email: to)) if to.class == String
    cc.each { |t| pers.add_cc(Email.new(email: t)) } if cc.class == Array
    pers.add_cc(Email.new(email: cc)) if cc.class == String
    @mail.add_personalization(pers)
  end
end
