import React from 'react';
import {  Link, withRouter } from 'react-router-dom';


class PegShow extends React.Component{
  constructor(props){
    super(props);
  }

  componentDidMount(){
    this.props.requestOnePeg(this.props.match.params.id);
    window.scroll(150,150);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.id != nextProps.match.params.id) {
      this.props.requestOnePeg(nextProps.match.params.id);
    }
  }

  render(){
    let author = this.props.peg_author;
    author = author[0].toUpperCase()+author.slice(1);




    if (this.props.peg){

      if (this.props.peg.author_id === this.props.currentUser.id){
        var val = <img src="https://res.cloudinary.com/archhere/image/upload/v1528847964/simple-grey-small-pencil-icon.jpg" className="editbutton"/>;
      }
      else {
        val = "";
      }

      return (


      <div className="divshow" onClick={ () => this.props.history.goBack() }>
        <div className="box101">

        <div className="saveedit101">
          <div className="editbutton1011" onClick={() => this.props.openModal({modal: 'EditPeg', peg: this.props.peg} )}>
            {val}
          </div>
          <div className="savebutton1011"
            onClick={() => this.props.openModal({modal: 'SavePeg', peg: this.props.peg} )}>
            <img src={window.savebutton} className="savebutton"/>
          </div>
        </div>




            <div className="title102">{this.props.peg.title}</div>
            <div><img src={this.props.peg.image_url} className='image101' /></div>
            <div className="userimg123"><img src={this.props.peg.auther_image}/></div>
            <div className="author102"><strong>{author}</strong>&nbsp; saved peg to board</div>


          </div>
        </div>

      );
    }
      else return null;
  }

}


export default withRouter(PegShow);
