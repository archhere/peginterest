import { RECEIVE_BOARDS,RECEIVE_SINGLE_BOARD,
  REMOVE_BOARD} from './../actions/board_actions';
import { REMOVE_PEG, RECEIVE_SINGLE_PIN } from './../actions/peg_actions';
import { merge } from 'lodash';

const boardsReducer = (state={},action) => {
  Object.freeze(state);
  switch (action.type) {
    case RECEIVE_BOARDS:
      if (action.payload.boards === undefined) {
        return state;
      }
      return action.payload.boards;
    case RECEIVE_SINGLE_BOARD:
      let id = Object.values(action.payload.board)[0].id;
      let value = Object.values(action.payload.board)[0];
      return merge({},state,{[id]: value});
    case REMOVE_BOARD:
      let delete_id = Object.values(action.id.board)[0].id;
      const newState = merge({},state);
      delete newState[delete_id];
      return newState;
    default:
      return state;
  }
};

export default boardsReducer;
