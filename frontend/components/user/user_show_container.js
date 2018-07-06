import { connect } from 'react-redux';
import {  Link, withRouter } from 'react-router-dom';
import UserShow from './user_show';
import { openModal } from '../../actions/modal_actions';
import { requestAllBoards } from './../../actions/board_actions';


const mapStateToProps = (state,ownProps) => {
  
  const user = state.entities.users[ownProps.match.params.id];


  return {
    user: user,
    boards: Object.values(user.boards || {}),
    pegs: Object.values(user.pegs || {}),
  };
};

const mapDispatchToProps = dispatch => ({
  requestAllBoards: () => dispatch(requestAllBoards()),
  openModal: modal => dispatch(openModal(modal)),
});



export default
withRouter(connect(mapStateToProps, mapDispatchToProps)(UserShow));
