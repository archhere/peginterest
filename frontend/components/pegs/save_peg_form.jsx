import React from 'react';
import { Link, withRouter } from 'react-router-dom';


class SavePegForm extends React.Component {
  constructor(props){
    super(props);
    // console.log("props",props);
    this.state = {
      title: this.props.peg.title,
      url: this.props.peg.url,
      description: this.props.peg.description,
      image_url: this.props.peg.image_url,
      board_id: "",
    };
    // console.log("state",this.state);
  }

  handleclick(val){
    return (e)=>{
      this.setState({board_id: val});
    };
  }


  componentDidUpdate() {
    const peg = this.state;
    console.log(peg);
    this.props.createPeg(peg).then(() => this.props.closeModal());
  }


  render(){
    const boards = Object.values(this.props.currentUser.boards);
    return (
      <div className="saveform1236">
        <div className="superheader">
        <span class="close-modal" onClick={() => this.props.closeModal()}>X</span>
        <h3>Choose Board</h3>
        </div>
        <div className="superimg55">
        <img src={this.props.peg.image_url}/>
        </div>
        <ul className="superboard">
          {boards.map(board=>
            <li>
            <input type="submit" value={board.title}
              onClick={this.handleclick(board.id)}/>
            </li>
          )}
        </ul>

        <div className="boardinfo1234" onClick={() => this.props.openModal({modal: 'CreateBoard'} )}><div className="boards22">Create Board</div><i id="addboard11" class="fa fa-plus" aria-hidden="true"></i></div>


      </div>
    );
  }

}

export default withRouter(SavePegForm);
