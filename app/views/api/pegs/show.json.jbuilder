

# json.partial! 'api/pegs/peg', peg: @peg








json.extract! @peg, :id,:title,:description,:url,:image_url,:author_id
json.auther_username @peg.author.username




json.board_id @peg.board.id
