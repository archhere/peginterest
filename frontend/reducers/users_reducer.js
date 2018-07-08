import { RECEIVE_CURRENT_USER} from '../actions/session_actions';
import { RECEIVE_USER } from './../actions/user_actions';
import merge from 'lodash/merge';
import { RECEIVE_BOARDS,RECEIVE_SINGLE_BOARD, REMOVE_BOARD } from './../actions/board_actions';
import { REMOVE_PEG, RECEIVE_SINGLE_PEG } from './../actions/peg_actions';


const usersReducer = (state={},action) => {
  switch (action.type) {
    case RECEIVE_CURRENT_USER:
      return merge({},state,{[action.currentUser.id]: action.currentUser});x
    default:
      return state;
  }
};

export default usersReducer;
