import { connect } from 'react-redux';
import { requestOnePeg} from '../../actions/peg_actions';
import {  Link, withRouter } from 'react-router-dom';
import PegShow from './peg_show';
import { openModal } from '../../actions/modal_actions';

const mapStateToProps = (state,ownProps) => {

  const peg = state.entities.pegs[ownProps.match.params.id];
    return {
      peg: peg,
      currentUser: state.entities.users[state.session.id],
      peg_author: peg.auther_username,
    };
};

const mapDispatchToProps = dispatch => ({
  requestOnePeg: (id) => dispatch(requestOnePeg(id)),
  openModal: modal => dispatch(openModal(modal)),
});



export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PegShow));
