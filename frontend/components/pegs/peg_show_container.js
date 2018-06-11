import { connect } from 'react-redux';
import { requestOnePeg} from '../../actions/peg_actions';
import {  Link, withRouter } from 'react-router-dom';
import PegShow from './peg_show';
import { openModal } from '../../actions/modal_actions';

const mapStateToProps = (state,ownProps) => {
  console.log("state is",state);
  console.log("ownProps is",ownProps);

  const peg = state.entities.pegs[ownProps.match.params.id];
  console.log("peg",peg);
  console.log("author",state.entities.users[peg.author_id]);
  console.log("peg_author",peg.author_id);
  console.log("allusers",state.entities.users);
  console.log("board",peg.board);
  return {
    peg: peg,
    currentUser: state.entities.users[state.session.id],
    peg_author: peg.author,
    board: peg.board
  };
};

const mapDispatchToProps = dispatch => ({
  requestOnePeg: (id) => dispatch(requestOnePeg(id)),
  openModal: modal => dispatch(openModal(modal)),
});



export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PegShow));
