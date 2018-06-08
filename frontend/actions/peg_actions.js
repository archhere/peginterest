import * as pegAPIUtil from '../util/peg_api_util';

export const RECEIVE_PEGS = "RECEIVE_PEGS";
export const RECEIVE_SINGLE_PEG = "RECEIVE_SINGLE_PEG";
export const REMOVE_PEG = "REMOVE_PEG";
export const RECEIVE_PEG_ERRORS = "RECEIVE_PEG_ERRORS";
export const CLEAR_PEG_ERRORS = "CLEAR_PEG_ERRORS";


export const receivePegs = pegs => ({
  type: RECEIVE_PEGS,
  pegs
});

export const receiveSinglePeg = peg => ({
  type: RECEIVE_SINGLE_PEG,
  peg
});

export const removePeg = peg => ({
  type: REMOVE_PEG,
  peg
});

export const receivePegErrors = errors => ({
  type: RECEIVE_PEG_ERRORS,
  errors
});

export const clearPegErrors = () => ({
  type: CLEAR_PEG_ERRORS
});

export const requestAllPegs = () => (dispatch) => {
  return pegAPIUtil.fetchAllPegs()
  .then(response => dispatch(receivePegs(response)));
};

export const requestOnePeg = (id) => (dispatch) => {
  return pegAPIUtil.fetchSinglePeg(id)
  .then(response => dispatch(receiveSinglePeg(response)));
};

export const createPeg = (peg) => (dispatch) => {
  return pegAPIUtil.createPeg(peg)
  .then(
  response => dispatch(receiveSinglePeg(response)),
  err => dispatch(receivePegErrors(err.responseJSON))
  );
};

export const updatePeg = peg => (dispatch) => {
  return pegAPIUtil.updatePeg(peg)
  .then(
  response => dispatch(receiveSinglePeg(response)),
  err => dispatch(receivePegErrors(err.responseJSON))
  );
};

export const deletePeg = (id) => (dispatch) => {
  return pegAPIUtil.deletePeg(id)
    .then(response => dispatch(removePeg(response)));
};
