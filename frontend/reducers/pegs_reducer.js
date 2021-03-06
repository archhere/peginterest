import {RECEIVE_PEGS,
  RECEIVE_SINGLE_PEG,REMOVE_PEG,RECEIVE_PEG_ERRORS,
  CLEAR_PEG_ERRORS,RESET_PEG} from '../actions/peg_actions';

import merge from 'lodash/merge';

const pegsReducer = (state={},action) => {
  Object.freeze(state);
  switch (action.type) {
    case RECEIVE_PEGS:
      return merge({},state,action.pegs);
    case RECEIVE_SINGLE_PEG:
      return merge({},state,{[action.peg.id]: action.peg});
    case REMOVE_PEG:
      let newerState = merge({},state);
      delete newerState[action.peg.id];
      return newerState;
    default:
      return state;
  }
};

export default pegsReducer;
