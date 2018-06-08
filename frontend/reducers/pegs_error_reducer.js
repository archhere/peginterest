import {RECEIVE_PEG_ERRORS,
  CLEAR_PEG_ERRORS} from '../actions/peg_actions';




export default (state = [], action) => {
  Object.freeze(state);
  switch (action.type) {
    case RECEIVE_PEG_ERRORS:
      return action.errors;
    case CLEAR_PEG_ERRORS:
      return [];
    default:
      return state;
  }
};
