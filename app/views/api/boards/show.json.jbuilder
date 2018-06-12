# json.board do
#
#   json.partial! "api/boards/board", board: @board
#
# end


json.board do
  json.set! @board.id do
    json.extract! @board, :id, :title, :description
    json.author_id @board.author.id
    json.author_username @board.author.username

  end
end


json.pegs do
  @board.pegs.each do |peg|
    json.set! peg.id do
      json.partial! 'api/pegs/peg', peg: peg
    end
  end
end









# json.pegs do
#   @board.pegs.each do |peg|
#     json.set! peg.id do
#       json.extract! peg, :id, :description, :image
#     end
#   end
# end
#
# json.user do
#   json.partial! 'api/users/user', user: @collection.author
# end
