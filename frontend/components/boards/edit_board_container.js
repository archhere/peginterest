import { connect } from 'react-redux';
import { closeModal } from './../../actions/modal_actions';
import EditBoard from './edit_board';
import { updateBoard,receiveBoardErrors,deleteBoard} from './../../actions/board_actions';
import { openModal } from '../../actions/modal_actions';
import {  Link, withRouter } from 'react-router-dom';
import { deletePeg } from './../../actions/peg_actions';


const mapStateToProps = (state,ownProps) => {
  let location = ownProps.location.pathname.slice(15);
  let pegs = Object.values(state.entities.pegs);
  let path = location.replace(/\/pegs/g,'');
  let boardpegs = pegs.filter(peg => peg.board_id == path);
  return {
    currentUser: state.entities.users[state.session.id],
    errors: state.errors.boards,
    board: state.entities.boards[path],
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
  };
};

export default withRouter (connect (
  mapStateToProps,
  mapDispatchToProps
)(EditBoard));
