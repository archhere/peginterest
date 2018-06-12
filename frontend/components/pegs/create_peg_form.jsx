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
          <h4>Place Image or Click here</h4>
        </div>
      );
      } else {
        return (
          <div>
            <img src={this.state.image_url}/>
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
      console.log(this.state);
      this.props.openModal({modal: 'SavePeg', peg: this.state});
    }

  render() {
    console.log(this.state);
    return (
      <div>
        <form id="CreatePegForm" onSubmit={this.handleSubmit} className="create-peg-form">
          <h1>Create Peg!</h1><br/>
          <p>{this.renderErrors()}</p>

          <label><span>Title</span>
            <input type="text" requiredvalue={this.state.title} onChange={this.update('title')}/>
          </label>
          <br/>

          <label><span>Description</span>
            <input type="text" value={this.state.description} onChange={this.update('description')}/>
          </label>
          <br/>

          <label><span>url</span>
            <input type="text" value={this.state.url} onChange={this.update('url')}/>
          </label>
          <br/>

          <Dropzone
            multiple={false}
            accept="image/*"
            onDrop={this.handleImageUpload}>
            <p>Drop an image or click to select a file to upload.</p>
            {this.picturethumbnail()}
          </Dropzone>

          <input className="submit-create-button" type="submit" value={'Submit'} />

        </form>
      </div>
    );

  }


}

export default CreatePegForm;
