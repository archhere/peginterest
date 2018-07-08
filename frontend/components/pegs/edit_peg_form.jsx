import React from 'react';

class EditPegForm extends React.Component{
  constructor(props){
    super(props);
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
      this.props.deletePeg(this.state.id).then(this.props.closeModal());
    }


  render(){
      return (

        <div className="edit-peg-form">
          <form onSubmit={this.handleSubmit}>
            <div className="edit-peg-header-outer"><h3 className="edit-peg-header">Edit this Peg</h3></div><br/>
            <p>{this.renderErrors()}</p>
            <span class="close-modal" onClick={() => this.props.closeModal()}>X</span>
            <div className="editform12">
              <label className="website78"><span>Website</span> <br />
              <input type="text" required value={this.state.url} onChange={this.update('url')}/>
              </label>
              <br/> <br/>
              <label className="titleform78"><span>Title</span> <br />
              <input type="text" required value={this.state.title} onChange={this.update('title')}/>
              </label>
              <br/> <br/>
              <div className="thumbnailouter98">
              <div className="thumbnail12"><img src={this.state.image_url} width="150" height="200" border-radius="15" /></div>
              </div>
            </div>


      <div className="submitouterdiv">
        <ul className="submits123">
          <li><button className="submit-cancel-button126" onClick={() => this.props.closeModal()}>Cancel</button></li>
          <li><input className="submit-edit-button12" type="submit" value='Save' /></li>
        </ul>
      </div>

      <div className="submitouterdiv">
        <button onClick={this.handleclick} className="submit-create-button123">Delete</button>
      </div>

        </form>
      </div>
    );
  }
}

export default EditPegForm;
