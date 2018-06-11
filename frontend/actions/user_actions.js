import * as userAPIUtil from './../util/user_api_util';

export const RECEIVE_USER = "RECEIVE_USER";



export const requestUser = id => dispatch => (
  userAPIUtil.fetchUser(id)
    .then(response => dispatch({type: RECEIVE_USER,user: response}))
);

export const updateUser = (formData, id) => dispatch => (
  userAPIUtil.updateUser(formData, id)
  .then(response => dispatch({type: RECEIVE_USER,user: response}))
);

export const createUser = (user) => dispatch => (
  userAPIUtil.createUser(user)
  .then(response => dispatch({type: RECEIVE_USER,user: response}))
);
