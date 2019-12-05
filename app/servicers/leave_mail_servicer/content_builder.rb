module LeaveMailServicer
  class ContentBuilder
      attr_accessor :content, :leave
      def initialize(leave)
        @leave = leave
        build_content
      end

      private 

      def build_content
        add_summary
        add_description
        content
      end

      def add_summary
        <<~HTML
          <p>#{}</p>
        HTML
      end
  end
end