import { connect } from 'react-redux';
import { closeModal } from './../../actions/modal_actions';
import EditPegForm from './edit_peg_form';
import { updatePeg,receivePegErrors,deletePeg } from './../../actions/peg_actions';
import { createBoard } from './../../actions/board_actions';
import {  Link, withRouter } from 'react-router-dom';

const mapStateToProps = (state,ownProps) => {
  return {
    currentUser: state.entities.users[state.session.id],
    errors: state.errors.pegs,
    peg: ownProps.peg,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updatePeg: peg => dispatch(updatePeg(peg)),
    receivePegErrors: errors => dispatch(receivePegErrors(errors)),
    deletePeg: id => dispatch(deletePeg(id)),
    closeModal: () => dispatch(closeModal()),
  };
};



export default withRouter(connect(mapStateToProps,
  mapDispatchToProps)(EditPegForm));
