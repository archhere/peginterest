export const fetchUser = id => {
  return $.ajax({
    method: 'GET',
    url: `/api/users/${id}`
  });
};

export const updateUser = (formData,id) => {
  return $.ajax({
    method: 'PATCH',
    contentType: false,
    processData: false,
    url: `/api/users/${id}`,
    data: formData
  });
};


export const createUser = (user) => (
  $.ajax({
    url: `api/users`,
    method: 'GET',
    data: { user }
  })
);
