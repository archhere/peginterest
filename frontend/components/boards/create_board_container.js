import { connect } from 'react-redux';
import { closeModal } from './../../actions/modal_actions';
import CreateBoard from './create_board';
import { createBoard,receiveBoardErrors } from './../../actions/board_actions';
import { openModal } from '../../actions/modal_actions';


const mapStateToProps = (state) => {
  return {
    currentUser: state.entities.users[state.session.id],
    errors: state.errors.boards,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    receiveBoardErrors: errors => dispatch(receiveBoardErrors(errors)),
    createBoard: board => dispatch(createBoard(board)),
    closeModal: () => dispatch(closeModal()),
    openModal: modal => dispatch(openModal(modal)),
  };
};

export default connect (
  mapStateToProps,
  mapDispatchToProps
)(CreateBoard);
