import { connect } from 'react-redux';
import { closeModal } from './../../actions/modal_actions';
import EditBoard from './edit_board';
import { updateBoard,receiveBoardErrors,deleteBoard} from './../../actions/board_actions';
import { openModal } from '../../actions/modal_actions';
import {  Link, withRouter } from 'react-router-dom';


const mapStateToProps = (state,ownProps) => {
  console.log(state);
  console.log(ownProps);
  console.log(ownProps.location.pathname[15,16]);
  let location = ownProps.location.pathname.slice(15);
  let path = location.replace(/\/pegs/g,'');
  console.log(path);
  return {
    currentUser: state.entities.users[state.session.id],
    errors: state.errors.boards,
    board: state.entities.boards[path]
  };
};

const mapDispatchToProps = dispatch => {
  return {
    receiveBoardErrors: errors => dispatch(receiveBoardErrors(errors)),
    updateBoard: board => dispatch(updateBoard(board)),
    deleteBoard: id => dispatch(deleteBoard(id)),
    closeModal: () => dispatch(closeModal()),
    openModal: modal => dispatch(openModal(modal)),
  };
};

export default withRouter (connect (
  mapStateToProps,
  mapDispatchToProps
)(EditBoard));
