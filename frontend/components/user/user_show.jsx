import React from 'react';
import {  Link, withRouter } from 'react-router-dom';
import Masonry from 'react-masonry-component';
import PegsSpecialComponent from '../pegs/peg_special_component';
import BoardIndexComponent from '../boards/board_index_component';



class UserShow extends React.Component{
  constructor(props){
    super(props);
    this.state = {component: BoardIndexComponent};
    console.log(this.state);
  }

  componentDidMount(){
    this.forceUpdate();
  }


  handleclick(type){
    return (e) => {
      if (type === "peg") {
        this.setState({component: PegsSpecialComponent});
      }
      else {
        this.setState({component: BoardIndexComponent});
      }
    };
  }


componentWillReceiveProps(nextProps){
  console.log("componentdidupdate");
}



  render(){
    return (
      <div>
        <div class="changes">
          <this.state.component props={this.props}/>
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
