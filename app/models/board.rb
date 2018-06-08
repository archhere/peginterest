# == Schema Information
#
# Table name: boards
#
#  id          :bigint(8)        not null, primary key
#  title       :string           not null
#  description :text
#  author_id   :integer          not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

class Board < ApplicationRecord
  validates :title, :author_id, presence: true

  has_many(
    :pegs,
    dependent: :destroy,
    primary_key: :id,
    foreign_key: :board_id,
    class_name: :Peg
  )

  belongs_to(
    :author,
    primary_key: :id,
    foreign_key: :author_id,
    class_name: :User
    )
end
