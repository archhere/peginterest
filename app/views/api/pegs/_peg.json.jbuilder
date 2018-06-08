
  json.extract! peg, :id,:title,:description,:url,:image_url,:author_id


  # extracting board details using association btwn pegs and boards
  #
  json.board_id peg.board.id   #sets board_id to peg.board.id using associations
  # json.board_pegs peg.board.pegs
  # json.board do
  #   json.extract! peg.board, :title, :id
  # end
