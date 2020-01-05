# frozen_string_literal: true

module LeaveMailServicer
  class ContentBuilder
    attr_accessor :content, :leave
    def initialize(leave)
      @leave = leave
      build_content
    end

    private

    def build_content
      @content = summary
      content
    end

    def summary
      <<~HTML
        <html lang="en">
          <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
            <style>
              table {
                font-family: arial, sans-serif;
                border-collapse: collapse;
                margin-top: 15px;
                width: 100%;
                max-width: 500px;
              }
              td, th {
                border: 1px solid #dddddd;
                text-align: left;
                padding: 8px;
              }
              tr:nth-child(even) {
                background-color: #dddddd;
              }
            </style>
          </head>
          <body>
            #{user_details}
            #{description}
          </body>
        </html>
      HTML
    end

    def user_details
      <<~HTML
        <table>
          <thead>
            <tr><th colspan="2">User Details</th></tr>
            <tr><th>Name</th><th>Email</th></tr>
          </thead>
          <tbody>
            <tr><td>#{leave.user.name}</td><td>#{leave.user.email}</td></tr>
          </tbody>
        </table>
      HTML
    end

    def description
      <<~HTML
        <table>
          <thead>
            <tr><th colspan="2">Leave Details</th></tr>
          </thead>
          <tbody>
            <tr><th>Type:</th><td>#{leave.leave_type.name}</td></tr>
            <tr><th>Dates:#{leave.effective_days} day(s)</th><td>#{calendar_link}</td></tr>
            <tr><th>Reason:</th><td>#{leave.reason.presence || 'Not Specified'}</td></tr>
            <tr><th>Status:</th><td>#{leave.state.split('_').map(&:capitalize).join(' ')}</td></tr>
            #{manager_note}
          </tbody>
        </table>
      HTML
    end

    def manager_note
      return if leave.note.blank?

      <<~HTML
        <tr><th>Manager/HR Note:</th><td>#{leave.note}</td></tr>
      HTML
    end

    def calendar_link
      "<a href='#{build_link}'><b>#{leave.day_collection.join(', ')}</b></a>"
    end

    def build_link
      URI.parse("http://www.google.com/calendar/event#{param_build}").to_s
    end

    def param_build
      "?action=TEMPLATE&#{range_build}&text=#{leave.title}"\
      ' Leave&location=&details='
    end

    def range_build
      tfix = '00:00:00'
      tfix = '12:00:00' if leave.half == 'second'
      from = utc_parser(leave.day_collection[0], tfix)
      tfix = '23:59:59'
      tfix = '12:00:00' if leave.half == 'first'
      endd = utc_parser(leave.day_collection[-1], tfix)
      "dates=#{from}/#{endd}"
    end

    def utc_parser(date, time)
      Time.parse.utc("#{date} #{time} +5:30").strftime('%Y%m%dT%H%I%MZ')
    end
  end
end
