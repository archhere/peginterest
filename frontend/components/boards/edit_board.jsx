import React from 'react';
import {  Link, withRouter } from 'react-router-dom';

class EditBoard extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      title: this.props.board.title,
      id: this.props.board.id,
      author_id: this.props.board.author_id
    };

    this.handleclick = this.handleclick.bind(this);

  }

  renderErrors() {
    return(
      <ul>
        {this.props.errors.map((error, i) => (
          <li key={`error-${i}`}>
            {error}
          </li>
        ))}
      </ul>
    );
  }

update(e){
    this.setState({title: e.target.value
    });
  }


  handleSubmit(e){
    e.preventDefault();
    this.props.updateBoard(this.state).then(this.props.closeModal()).then(()=>this.props.history.push(`/user/${this.props.currentUser.id}`));
  }

  handleclick(e){
    this.props.deleteBoard(this.state.id).then(this.props.closeModal())
    .then(this.props.history.push(`/user/${this.props.currentUser.id}`));
  }

  render(){
    return (
      <div>
      <form id="EditBoardForm"  onSubmit={this.handleSubmit.bind(this)} className="create-peg-form">
        <div className="create-peg-header-outer">
          <h3 className="create-peg-header123">Edit Board</h3></div><br/>
        <p>{this.renderErrors()}</p>
        <span class="close-modal" onClick={() => this.props.closeModal()}>X</span>
        <label className="boardtitle1"><span>Name</span>
        <input type="text" required value={this.state.title} onChange={this.update.bind(this)}/>
      </label>
      <br/> <br/>
        <div className="submitouterdiv">
        <input className="submit-create-button12" type="submit" value='Update' /></div>
        <button className="submit-cancel-button1" onClick={() => this.props.closeModal()}>Cancel</button>
        <button onClick={this.handleclick} className="submit-delete-button12">Delete</button>
        </form>
      </div>

    );
  }
}

export default EditBoard;
