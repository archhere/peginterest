# json.id board.id
# json.title board.title
# json.author_id board.author_id
# json.description board.description

json.extract! board,:id,:title,:description,:author_id


# json.created_at board.created_at
# json.peg_ids board.items.pluck(:id)
