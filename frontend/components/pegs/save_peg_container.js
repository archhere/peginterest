import { connect } from 'react-redux';
import { createPeg } from './../../actions/peg_actions';
import { closeModal } from '../../../actions/modal_actions';
import { requestSingleBoard } from './../../actions/board_actions';
import SavePegForm from './save_peg_form';


const mapStateToProps = (state) => {
  return {
    currentUser: state.entities.users[state.session.id]
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createPeg: peg => dispatch(createPeg(peg)),
    // requestSingleBoard: id => dispatch(requestSingleBoard(id)),
    closeModal: () => dispatch(closeModal()),
  };
};

export default connect (
  mapStateToProps,
  mapDispatchToProps
)(SavePegForm);
