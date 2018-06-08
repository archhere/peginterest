

@pegs.each do |peg|
  json.set! peg.id do
    json.partial! 'api/pegs/peg',peg: peg
  end
end


# @boards.each do |board|
#   json.set! board.id do
#     json.extract! board, :id, :title
#   end
# end
