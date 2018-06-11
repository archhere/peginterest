import { connect } from 'react-redux';
import {  Link, withRouter } from 'react-router-dom';
import UserShow from './user_show';
import { openModal } from '../../actions/modal_actions';


const mapStateToProps = (state,ownProps) => {
  const user = state.entities.users[state.session.id];
  return {
    user: user,
    boards: Object.values(user.boards),
    pegs: Object.values(user.pegs)
  };
};

const mapDispatchToProps = dispatch => ({

});



export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserShow));
