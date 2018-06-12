# @boards.each do |board|
#   json.boards do
#     json.set! board.id do
#     json.partial! "api/boards/board", board: board
#     end
#   json.board_pegs do
#   end
# end

@boards.each do |board|
  json.boards do
    json.set! board.id do
      json.extract! board, :id, :title, :description
      json.author_id board.author.id
      json.author_username board.author.username

    end
  end
end

@boards.each do |board|
  json.pegs do
    board.pegs.each do |peg|
      json.set! peg.id do
        json.partial! 'api/pegs/peg', peg: peg
      end
    end
  end
end
