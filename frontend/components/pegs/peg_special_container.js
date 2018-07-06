import { connect } from 'react-redux';
import { closeModal } from './../../actions/modal_actions';
import PegsSpecialComponent from './peg_special_component';
import { updatePeg,receivePegErrors,deletePeg,requestAllPegs } from './../../actions/peg_actions';
import { createBoard } from './../../actions/board_actions';
import { openModal } from '../../actions/modal_actions';
import {  Link, withRouter } from 'react-router-dom';

const mapStateToProps = (state,ownProps) => {
  const currentUser = state.entities.users[state.session.id];
  const usualpegs = Object.values(state.entities.pegs)
  .filter(peg => (peg.author_id === currentUser.id));

  let pegs;
  let currentBoard;
  if (ownProps.match.path === "/user/:id/boards/:id/pegs") {
    pegs = usualpegs.filter(peg => (peg.board_id == ownProps.match.params.id));
    currentBoard =  state.entities.boards[ownProps.match.params.id];
  }
  else {
    pegs = usualpegs;
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
  };
};



export default withRouter(connect(mapStateToProps,
  mapDispatchToProps)(PegsSpecialComponent));
