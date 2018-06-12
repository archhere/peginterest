import { connect } from 'react-redux';
import {  Link, withRouter } from 'react-router-dom';
import UserShow from './user_show';
import { openModal } from '../../actions/modal_actions';
import { requestAllBoards } from './../../actions/board_actions';


const mapStateToProps = (state,ownProps) => {
  console.log(ownProps);
  const user = state.entities.users[ownProps.match.params.id];
  console.log("user",user);
  // const some = Object.values(user.pegs).filter(peg => peg.board_id===2);
  // console.log("some",some);
  return {
    user: user,
    boards: Object.values(user.boards),
    pegs: Object.values(user.pegs)
  };
};

const mapDispatchToProps = dispatch => ({
  requestAllBoards: () => dispatch(requestAllBoards()),
  
});



export default
withRouter(connect(mapStateToProps, mapDispatchToProps)(UserShow));
