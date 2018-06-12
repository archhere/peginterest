import React from 'react';
import Masonry from 'react-masonry-component';
import UserShow from '../user/user_show';

class BoardIndexComponent extends React.Component {
  constructor (props) {
    super(props);
    console.log("props",props);
  }

  render(){
    console.log("boardval",this.props.props.boards);
    return (
      <div>
        <ul>
      {this.props.props.boards.map(board =>
      <li>{board.title}</li>
      )}
      </ul>
      </div>
    );



  }
}

export default BoardIndexComponent;
