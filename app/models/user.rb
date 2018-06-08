# == Schema Information
#
# Table name: users
#
#  id              :bigint(8)        not null, primary key
#  username        :string           not null
#  password_digest :string           not null
#  session_token   :string           not null
#  firstname       :string
#  lastname        :string
#  email           :string           not null
#  image_url       :string
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

class User < ApplicationRecord

  attr_reader :password

  validates :username, :password_digest, :session_token,:email,presence: true
  validates :email, uniqueness: true
  validates :username, uniqueness: true
  validates :password, length: { minimum: 6 }, allow_nil: true

  after_initialize :ensure_session_token
  after_initialize :ensure_others

  has_many(
    :boards,
    primary_key: :id,
    foreign_key: :author_id,
    class_name: :Board
  )


  has_many(
    :pegs,
    primary_key: :id,
    foreign_key: :author_id,
    class_name: :Peg
  )


  def ensure_others
    self.username ||= self.email[0...(self.email.index("@") || (self.email.length-1))]
    self.firstname ||= self.username
    self.lastname ||= self.username
    self.image_url ||= "https://s33.postimg.cc/pjju7pp9b/shire.jpg"
  end

  def self.find_by_credentials(email, password)
    user = User.find_by(email: email)
    return nil unless user
    user.is_password?(password) ? user : nil
  end

  def password=(password)
    @password = password
    self.password_digest = BCrypt::Password.create(password)
  end

  def is_password?(password)
    BCrypt::Password.new(self.password_digest).is_password?(password)
  end

  def reset_session_token!
    SecureRandom.urlsafe_base64
    save!
    self.session_token
  end

  private

  def ensure_session_token
    self.session_token ||= SecureRandom.urlsafe_base64
  end

  def new_session_token
    SecureRandom.urlsafe_base64
  end


end
