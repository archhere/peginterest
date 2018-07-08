import { connect } from 'react-redux';
import { closeModal } from './../../actions/modal_actions';
import PegsSpecialComponent from './peg_special_component';
import { updatePeg,receivePegErrors,deletePeg,requestAllPegs } from './../../actions/peg_actions';
import { createBoard,requestAllBoardPegs,requestBoardPeg } from './../../actions/board_actions';
import { openModal } from '../../actions/modal_actions';
import {  Link, withRouter } from 'react-router-dom';

const mapStateToProps = (state,ownProps) => {
  let pegs = Object.values(state.entities.boardpegs || {});
  let currentBoard;
  if (ownProps.match.path === "/user/:id/boards/:id/pegs") {
    currentBoard =  state.entities.boards[ownProps.match.params.id];
  }
  else {
    currentBoard = {id: "",title: ""};
  }

  return {
    currentUser: state.entities.users[state.session.id],
    errors: state.errors.pegs,
    pegs: pegs,
    currentBoard: currentBoard
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updatePeg: peg => dispatch(updatePeg(peg)),
    receivePegErrors: errors => dispatch(receivePegErrors(errors)),
    deletePeg: id => dispatch(deletePeg(id)),
    closeModal: () => dispatch(closeModal()),
    openModal: modal => dispatch(openModal(modal)),
    requestAllPegs: () => dispatch(requestAllPegs()),
    requestAllBoardPegs: () => dispatch(requestAllBoardPegs()),
    requestBoardPeg: (id) => dispatch(requestBoardPeg(id))
  };
};



export default withRouter(connect(mapStateToProps,
  mapDispatchToProps)(PegsSpecialComponent));
