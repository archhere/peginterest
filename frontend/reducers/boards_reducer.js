import { RECEIVE_BOARDS,RECEIVE_SINGLE_BOARD,
  REMOVE_BOARD} from './../actions/board_actions';
import { REMOVE_PEG, RECEIVE_SINGLE_PIN } from './../actions/peg_actions';
import { merge } from 'lodash';

const boardsReducer = (state={},action) => {
  Object.freeze(state);
  switch (action.type) {
    case RECEIVE_BOARDS:
      return action.payload.boards;
    case RECEIVE_SINGLE_BOARD:
      return merge({},state,{[action.board.id]: action.payload.board });
    case REMOVE_BOARD:
      const newState = merge({},state);
      delete newState[action.id];
      return newState;
    default:
      return state;
  }
};

export default boardsReducer;
