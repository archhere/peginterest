import * as boardAPIUtil from '../util/board_api_util';

export const RECEIVE_BOARDS = "RECEIVE_BOARDS";
export const RECEIVE_SINGLE_BOARD = "RECEIVE_SINGLE_BOARD";
export const REMOVE_BOARD = "REMOVE_BOARD";
export const RECEIVE_BOARD_ERRORS = "RECEIVE_BOARD_ERRORS";
export const CLEAR_BOARD_ERRORS = "CLEAR_BOARD_ERRORS";

export const requestAllBoards = () => dispatch => {
  return boardAPIUtil.fetchBoards()
  .then(response => dispatch({type: RECEIVE_BOARDS,payload: response}));
  };

export const requestOneBoard = (id) => dispatch => {
  return boardAPIUtil.fetchBoard(id)
  .then(response => dispatch({type: RECEIVE_SINGLE_BOARD,payload: response}));
};

export const deleteBoard = (id) => (dispatch) => {
  return boardAPIUtil.deleteBoard(id)
  .then(response => dispatch({type: REMOVE_BOARD,id: response}));
};

export const receiveBoardErrors = errors => ({
  type: RECEIVE_BOARD_ERRORS,
  errors
});

export const clearBoardErrors = () => ({
  type: CLEAR_BOARD_ERRORS
});

export const createBoard = (board) => (dispatch) => {
  return boardAPIUtil.createBoard(board)
  .then(response => dispatch({type: RECEIVE_SINGLE_BOARD,payload: response}));
};

export const updateBoard = (board) => (dispatch) => {
  return boardAPIUtil.updateBoard(board)
  .then(response => dispatch({type: RECEIVE_SINGLE_BOARD,payload: response}));
};
