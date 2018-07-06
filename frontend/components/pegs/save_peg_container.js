import { connect } from 'react-redux';
import { createPeg } from './../../actions/peg_actions';
import { createBoard } from './../../actions/board_actions';
import { closeModal } from './../../actions/modal_actions';
import { requestOneBoard } from './../../actions/board_actions';
import SavePegForm from './save_peg_form';
import { openModal } from '../../actions/modal_actions';


const mapStateToProps = (state) => {
  let currentUser = state.entities.users[state.session.id];
  return {
    currentUser: currentUser,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createPeg: peg => dispatch(createPeg(peg)),
    createBoard: board => dispatch(createBoard(board)),
    requestSingleBoard: id => dispatch(requestOneBoard(id)),
    closeModal: () => dispatch(closeModal()),
    openModal: modal => dispatch(openModal(modal)),
  };
};

export default connect (
  mapStateToProps,
  mapDispatchToProps
)(SavePegForm);
