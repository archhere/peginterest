

  json.peg do
    json.extract! peg, :id,:title,:description,:url,:image_url,:author_id
    json.board_id peg.board.id
    json.extract! peg.author, :username
  end


  # json.author do
  # json.extract! peg.author, :username
  # json.image_url asset_path(peg.author.image_url)
# end

  # json.board do
    # json.extract! peg.board, :title, :id
  # end


  # json.board_pegs peg.board.pegs
