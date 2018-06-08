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

class Peg < ApplicationRecord

  validates :title,:image_url,:author_id,:board_id,presence: true

  after_initialize :ensure_others
  # need validation for document uploading

  belongs_to(
    :board,
    primary_key: :id,
    foreign_key: :board_id,
    class_name: :Board
  )



  belongs_to(
    :author,
    primary_key: :id,
    foreign_key: :author_id,
    class_name: :User
  )

 #
 # has_one :author,
 #   through: :board,
 #   source: :author


  def ensure_others
   self.description ||= self.title
   self.url ||= "http://www.google.com"
   self.image_url ||= "https://s33.postimg.cc/pjju7pp9b/shire.jpg"
  end


end
