import React from 'react';

class EditPegForm extends React.Component{
  constructor(props){
    super(props);
    console.log("props",props);
    this.state = {
      id: this.props.peg.id,
      title: this.props.peg.title,
      url: this.props.peg.url,
      description: this.props.peg.description,
      image_url: this.props.peg.image_url,
      board_id: this.props.peg.board_id,
    };
    this.handleclick = this.handleclick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  componentDidMount(){
    console.log("Mounted");
  }

  componentWillReceiveProps(){
    console.log("receivedprops");
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


  update(type){
      return e => this.setState({
        [type]: e.target.value
      });
    }

    handleSubmit(e){
      e.preventDefault();
      this.props.updatePeg(this.state).then(this.props.closeModal());
    }

    handleclick(e){
      e.preventDefault();
      this.props.deletePeg(this.state.id).then(this.props.closeModal())
      .then(this.props.history.push(`/user/${this.props.currentUser.id}`));
    }


  render(){
      return (

        <div className="edit-peg-form">
          <form onSubmit={this.handleSubmit}>
            <div className="edit-peg-header-outer"><h3 className="edit-peg-header">Edit this Peg</h3></div><br/>
            <p>{this.renderErrors()}</p>
            <span class="close-modal" onClick={() => this.props.closeModal()}>X</span>
            <div className="editform12">
              <label className="website"><span>Website</span> <br />
              <input type="text" value={this.state.url} onChange={this.update('url')}/>
              </label>
              <br/> <br/>
              <label className="titleform"><span>Title</span> <br />
              <input type="text" value={this.state.title} onChange={this.update('title')}/>
              </label>
              <br/> <br/>
              <div className="thumbnail"><img src={this.state.image_url} width="150" height="200" border-radius="15" /></div>
            </div>
        <div className="submitouterdiv">
          <button onClick={this.handleclick} className="submit-create-button">Delete</button>
        </div>

      <div className="submitouterdiv">
        <ul className="submits123">
          <li><input className="submit-edit-button" type="submit" value='Save' /></li>
          <li><button className="submit-cancel-button" onClick={() => this.props.closeModal()}>Cancel</button></li>
        </ul>
      </div>

        </form>
      </div>
    );
  }
}

export default EditPegForm;
