# == Schema Information
#
# Table name: pegs
#
#  id              :bigint(8)        not null, primary key
#  title           :string           not null
#  description     :text
#  author_id       :integer          not null
#  board_id        :integer          not null
#  url             :string
#  image_url       :string           not null
#  image_file_name :string
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

require 'test_helper'

class PegTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
