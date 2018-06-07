import { connect } from 'react-redux';

import { logout } from '../../actions/session_actions';
import navBar from './navbar';
import { openModal } from '../../actions/modal_actions';

const mapStateToProps = ({entities: {users}, session}) => {
  return {
    // currentUser: users[session.id]
    currentUser: session.id
  };
};

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(navBar);
