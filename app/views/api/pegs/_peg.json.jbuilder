
  json.extract! peg, :id,:title,:description,:url,:image_url,:author_id


# extracting peg author details using association bwtn pegs and users

  json.author do
  json.extract! peg.author, :username
  json.image_url asset_path(peg.author.image_url)
end


  # extracting board details using association btwn pegs and boards
  #
  json.board_id peg.board.id   #sets board_id to peg.board.id using associations
  json.board_pegs peg.board.pegs
  json.board do
    json.extract! peg.board, :title, :id
  end
