json.extract! user, :id, :username, :email, :firstname, :lastname,:image_url

json.boards do
  user.boards.each do |board|
    json.set! board.id do
      json.extract! board, :id, :title
    end
  end
end


json.pegs do
  user.pegs.each do |peg|
    json.set! peg.id do
      json.extract! peg, :id,:title,:description,:board_id,:image_url
    end
  end
end
