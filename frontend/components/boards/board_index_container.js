import { connect } from 'react-redux';
import { closeModal } from './../../actions/modal_actions';
import { requestAllBoards,receiveBoardErrors,deleteBoard,
  createBoard,updateBoard }
from './../../actions/board_actions';
import BoardIndexComponent from './board_index_component';
import { openModal } from '../../actions/modal_actions';
import {  Link, withRouter } from 'react-router-dom';

const mapStateToProps = (state,ownProps) => {
  const currentUser = state.entities.users[state.session.id];
  console.log(state);
  console.log(ownProps);
  return {
    currentUser: state.entities.users[state.session.id],
    errors: state.errors.boards,
    boards: Object.values(state.entities.boards)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateBoard: board => dispatch(updateBoard(board)),
    receiveBoardErrors: errors => dispatch(receiveBoardErrors(errors)),
    deleteBoard: id => dispatch(deleteBoard(id)),
    closeModal: () => dispatch(closeModal()),
    openModal: modal => dispatch(openModal(modal)),
    requestAllBoards: () => dispatch(requestAllBoards())
  };
};



export default withRouter(connect(mapStateToProps,
  mapDispatchToProps)(BoardIndexComponent));
