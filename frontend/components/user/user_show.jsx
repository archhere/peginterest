import React from 'react';
import {  Link, withRouter } from 'react-router-dom';
import Masonry from 'react-masonry-component';
import PegsSpecialContainer from '../pegs/peg_special_container';
import BoardIndexContainer from '../boards/board_index_container';
import PegsIndexContainer from '../pegs/pegs_index_container';


class UserShow extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      component: 'boardSpecialContainer'
    };


  }

  componentDidMount(){
    this.forceUpdate();
  }


  handleclick(type){
    return (e) => {
      if (type === "peg") {
        this.setState({component: 'pegsSpecialContainer'});
      }
      else {
        this.setState({component: 'boardSpecialContainer'});
      }
    };
  }



  render(){

    const components = {
      'pegsSpecialContainer': <PegsSpecialContainer />,
    'boardSpecialContainer': <BoardIndexContainer />
    };
    const chosenComponent = this.state.component;
    return (
      <div>
        <div class="changes">
          {components[chosenComponent]}
        </div>
        <ul className="boards">
        <h3 className="profileheader">{this.props.user.firstname+" "+this.props.user.lastname}</h3>
        <ul className="profilelist">
          <li><button className="boardbutton" onClick={this.handleclick("board")}>Boards</button></li>
          <li><button className="pegbutton" onClick={this.handleclick("peg")}>Pegs</button></li>
        </ul>
        </ul>


      </div>

    );


  }



}

export default UserShow;
