class Board < ApplicationRecord
  validates :title, :author_id, presence: true

  # has_many(
  #   :pegs,
  #   primary_key: :id,
  #   foreign_key: :board_id,
  #   class_name: :Peg
  # )

  belongs_to(
    :author,
    primary_key: :id,
    foreign_key: :author_id,
    class_name: :User
    )
end
