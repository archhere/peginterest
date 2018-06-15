import { connect } from 'react-redux';
import PegsIndex from './pegs_index';
import { requestAllPegs, clearPegErrors } from './../../actions/peg_actions';
import { openModal } from '../../actions/modal_actions';
import { requestOneBoard } from './../../actions/board_actions';
import { closeModal } from './../../actions/modal_actions';

const mapStateToProps = (state,ownProps) => {
  console.log("indexpageownprops",ownProps);
  return ({
    pegs: Object.values(state.entities.pegs) || [],
    currentUser: state.entities.users[state.session.id]

  });
};

const mapDispatchToProps = dispatch => {
  return {
    requestAllPegs: () => dispatch(requestAllPegs()),
    clearPegErrors: () => dispatch(clearPegErrors()),
    openModal: modal => dispatch(openModal(modal)),
    closeModal: () => dispatch(closeModal()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PegsIndex);
