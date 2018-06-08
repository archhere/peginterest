export const fetchAllPegs = () => {
  return $.ajax({
    method: 'GET',
    url: '/api/pegs',
  });
};


export const fetchSinglePeg = (id) => {
  return $.ajax({
    method: 'GET',
    url: `/api/pegs/${id}`
  });
};


export const createPeg = (peg) => {
  return $.ajax({
    method: 'POST',
    url: '/api/pegs',
    data: {peg}
  });
};


export const updatePeg = (peg) => {
  return $.ajax({
    method: 'PATCH',
    url: `/api/pegs/${peg.id}`,
    data: {peg}
  });
};



export const deletePeg = (id) => {
  return $.ajax({
    method: 'DELETE',
    url: `/api/pegs/${id}`
  });
};
