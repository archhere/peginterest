import { connect } from 'react-redux';
import { closeModal } from './../../actions/modal_actions';
import EditPegForm from './edit_peg_form';
import { updatePeg,receivePegErrors } from './../../actions/peg_actions';
import { createBoard } from './../../actions/board_actions';
import { openModal } from '../../actions/modal_actions';


const mapStateToProps = (state,ownProps) => {
  return {
    currentUser: state.entities.users[state.session.id],
    errors: state.errors.pegs,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updatePeg: peg => dispatch(updatePeg(peg)),
    receivePegErrors: errors => dispatch(receivePegErrors(errors)),
    closeModal: () => dispatch(closeModal()),
    openModal: modal => dispatch(openModal(modal)),
  };
};

export default connect (
  mapStateToProps,
  mapDispatchToProps
)(EditPegForm);
