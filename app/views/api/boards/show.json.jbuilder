json.board do

  json.partial! "api/boards/board", board: @board

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
