import React from 'react';
import Dropzone from 'react-dropzone';
import uploadRequest from 'superagent';


const UPLOAD_PRESET = "zselilmq";
const UPLOAD_URL = "https://api.cloudinary.com/v1_1/archhere/image/upload";



class CreatePegForm extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        title: '',
        url: '',
        description: '',
        image_url: '',
        board_id: '',
      };
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleImageUpload = this.handleImageUpload.bind(this);
    }




  handleImageUpload(image){
    let upload = uploadRequest.post(UPLOAD_URL)
    .field('upload_preset', UPLOAD_PRESET)
    .field('file', image);
    upload.end((err, response) => {
      if (err) {
        this.props.receivePegErrors(err);
      }
      if (response.body.secure_url !== '') {
        this.setState({
          image_url: response.body.secure_url
        });
      }
    });
  }

  picturethumbnail(){
    if (this.state.image_url === '') {
      return (
        <div className="dropzone-text-container">
          <i class="fa fa-camera" aria-hidden="true"></i>
          <p>Drop an image or click to select a file to upload.</p>
        </div>
      );
      } else {
        return (
          <div className="picturethumbnail">
            <p>Image upload successful.Click done</p>
            <img width="150" height="150" className="imgthumbnail" src={this.state.image_url}/>
          </div>
        );
      }
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
        [type]: e.currentTarget.value
      });
    }

    handleSubmit(e){
      e.stopPropagation();
      e.preventDefault();
      this.props.openModal({modal: 'SavePeg', peg: this.state});
    }

  render() {
    let someclass;
    if (this.state.image_url === ''){
      someclass = "submit-create-button";
    }
    else {
      someclass = "submit-create-buttonawesome";
    }

    return (
      <div>
        <form id="CreatePegForm" onSubmit={this.handleSubmit} className="create-peg-form">
          <div className="create-peg-header-outer"><h3 className="create-peg-header">Create Peg</h3></div><br/>
          <p>{this.renderErrors()}</p>
          <span class="close-modal" onClick={() => this.props.closeModal()}>X</span>
          <label className="website"><span>Website</span> <br />
          <input type="text" required value={this.state.url} placeholder="Add the URL this peg links to" onChange={this.update('url')}/>
        </label>
        <br/> <br/>
          <label className="titleform"><span>Title</span> <br />
            <input type="text" required value={this.state.title} placeholder="Give a title" onChange={this.update('title')}/>
          </label>
          <br/> <br/>

          <label className="formdescp"><span>Description</span> <br />
            <textarea placeholder="Add a description(optional)" onChange={this.update('description')}>
            {this.state.description}</textarea>
          </label>
          <br/>


          <Dropzone
            multiple={false}
            accept="image/*"
            onDrop={this.handleImageUpload} className="dropzone" minSize={1}>
            {this.picturethumbnail()}

          </Dropzone>

          <div className="submitouterdiv">
          <input className={someclass} type="submit" value='Done' /></div>

        </form>
      </div>
    );

  }


}

export default CreatePegForm;
