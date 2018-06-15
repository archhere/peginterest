import React from 'react';
import Masonry from 'react-masonry-component';
import UserShow from '../user/user_show';
import {  Link, withRouter } from 'react-router-dom';
import PegsSpecialComponent from '../pegs/peg_special_component';
import  { Redirect } from 'react-router-dom';

class BoardIndexComponent extends React.Component {
  constructor (props) {
    super(props);
  }


  componentDidMount(){
    this.props.requestAllBoards();
  }



  render(){
    

    return (
      <div className="boardindexpage">
        <ul className="boardinfor1">
          <li><div className="boardinfo123" onClick={() => this.props.openModal({modal: 'CreateBoard'} )}><i id="addboard" class="fa fa-plus" aria-hidden="true"></i></div></li>
          {this.props.boards.map(board =>
          <Link style={{textDecoration: 'none'}} to={`${this.props.currentUser.id}/boards/${board.id}/pegs`}>
            <div className="boardinfo123"><li className="boardinfo12">{board.title}</li></div>
          </Link>
          )}
        </ul>
      </div>
    );
  }
}

export default withRouter(BoardIndexComponent);
