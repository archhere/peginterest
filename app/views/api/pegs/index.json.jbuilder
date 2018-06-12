





@pegs.each do |peg|
  json.set! peg.id do
    json.extract! peg, :id,:title,:description,:url,:image_url,:author_id
    json.auther_username peg.author.username




    json.board_id peg.board.id

  end
end
