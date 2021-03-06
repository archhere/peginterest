# json.id board.id
# json.title board.title
# json.author_id board.author_id
# json.description board.description

# json.extract! board,:id,:title,:description,:author_id


# json.created_at board.created_at
# json.peg_ids board.items.pluck(:id)



  json.extract! board, :id, :title, :description
  json.author_id board.author.id
  json.author_username board.author.username


json.pegs do
  board.pegs.each do |peg|
    json.set! peg.id do
      json.partial! 'api/pegs/peg', peg: peg
    end
  end
end
#
json.author do
  json.extract! board.author, :id, :username
  json.image_url asset_path(board.author.image_url)
end
