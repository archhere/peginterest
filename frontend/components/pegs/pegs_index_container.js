import { connect } from 'react-redux';
import PegsIndex from './pegs_index';
import { requestAllPegs, clearPegErrors } from './../../actions/peg_actions';

const mapStateToProps = (state) => {
  return ({
    pegs: Object.values(state.entities.pegs) || []
  });
};

const mapDispatchToProps = dispatch => {
  return {
    requestAllPegs: () => dispatch(requestAllPegs()),
    clearPegErrors: () => dispatch(clearPegErrors()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PegsIndex);
