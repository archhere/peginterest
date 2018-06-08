@pegs.each do |peg|
  json.set! peg.id do
    json.partial! 'api/pegs/peg',peg: peg
  end
end
