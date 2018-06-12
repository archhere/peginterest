import { connect } from 'react-redux';
import { closeModal } from './../../actions/modal_actions';
import CreatePegForm from './create_peg_form';
import { createPeg,receivePegErrors } from './../../actions/peg_actions';
import { createBoard } from './../../actions/board_actions';
import { openModal } from '../../actions/modal_actions';


const mapStateToProps = (state) => {
  return {
    currentUser: state.entities.users[state.session.id],
    errors: state.errors.pegs,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createPeg: peg => dispatch(createPeg(peg)),
    receivePegErrors: errors => dispatch(receivePegErrors(errors)),
    createBoard: board => dispatch(createBoard(board)),
    closeModal: () => dispatch(closeModal()),
    openModal: modal => dispatch(openModal(modal)),
  };
};

export default connect (
  mapStateToProps,
  mapDispatchToProps
)(CreatePegForm);
