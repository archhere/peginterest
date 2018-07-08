import { RECEIVE_BOARDSPEGS,RECEIVE_BOARDPEGS} from './../actions/board_actions';
import { merge } from 'lodash';

const boardpegReducer = (state={},action) => {
  Object.freeze(state);
  switch (action.type) {
    case RECEIVE_BOARDSPEGS:
      if (action.payload.pegs === undefined) return {};
      return action.payload.pegs;
    case RECEIVE_BOARDPEGS:
      if (action.payload.pegs === undefined) return {};
      return action.payload.pegs;
    default:
      return state;
  }
};

export default boardpegReducer;
