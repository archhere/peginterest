import { connect } from 'react-redux';
import { closeModal } from './../../actions/modal_actions';
import EditBoard from './edit_board';
import { updateBoard,receiveBoardErrors,deleteBoard} from './../../actions/board_actions';
import { openModal } from '../../actions/modal_actions';
import {  Link, withRouter } from 'react-router-dom';
import { deletePeg } from './../../actions/peg_actions';
import { createBoard,requestAllBoardPegs,requestBoardPeg } from './../../actions/board_actions';


const mapStateToProps = (state,ownProps) => {
  let location = ownProps.location.pathname.slice(15);
  console.log(state);
  let pegs = Object.values(state.entities.boardpegs);
  let path = location.replace(/\/pegs/g,'');
  console.log("path",path.slice(1));
  console.log(ownProps);
  console.log(pegs);
  let boardpegs = pegs.filter(peg => peg.board_id == path);
  return {
    currentUser: state.entities.users[state.session.id],
    errors: state.errors.boards,
    board: state.entities.boards[path.slice(1)],
    pegs: boardpegs
  };
};

const mapDispatchToProps = dispatch => {
  return {
    receiveBoardErrors: errors => dispatch(receiveBoardErrors(errors)),
    updateBoard: board => dispatch(updateBoard(board)),
    deleteBoard: id => dispatch(deleteBoard(id)),
    closeModal: () => dispatch(closeModal()),
    openModal: modal => dispatch(openModal(modal)),
    deletePeg: id => dispatch(deletePeg(id)),
    requestAllBoardPegs: () => dispatch(requestAllBoardPegs()),
  };
};

export default withRouter (connect (
  mapStateToProps,
  mapDispatchToProps
)(EditBoard));
