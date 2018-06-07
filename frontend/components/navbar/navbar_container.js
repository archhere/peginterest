import { connect } from 'react-redux';

import { logout } from '../../actions/session_actions';
import navBar from './navbar';
import { openModal } from '../../actions/modal_actions';

const mapStateToProps = (state) => {
  console.log("state is",state);
  // console.log(state.entities.users[state.session.id]);
  // console.log(state.session.id);
  
  return {
    // currentUser: users[session.id]
    // currentUser: state.session.id,
    currentUser: state.entities.users[state.session.id]

    // currentUser: session.id
  };
};

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(navBar);
