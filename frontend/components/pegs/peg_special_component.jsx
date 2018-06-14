import React from 'react';
import Masonry from 'react-masonry-component';
import UserShow from '../user/user_show';
import {  Link, withRouter } from 'react-router-dom';


class PegsSpecialComponent extends React.Component {
  constructor (props) {
    super(props);
    console.log("props",props);
  }

  componentDidMount(){
    this.props.requestAllPegs();
  }



  render(){
    let masonryOptions = {
      transitionDuration: 1,
      gutter: 20,
    };

    if (this.props.currentBoard.title !== ""){
      var val = <img src="https://res.cloudinary.com/archhere/image/upload/v1528847964/simple-grey-small-pencil-icon.jpg" className="editbutton"/>;
    }
    else {
      val = "";
    }

    return(
        <div>
          <div>{val}</div>
          <h3>{this.props.currentBoard.title}</h3>
        <ul class='create-peg-container'>
          <Masonry className={"pegs-index"}
                elementType={'ul'}
                options={masonryOptions}
                disableImagesLoaded={false}
                updateOnEachImageLoad={false}
                >
              <div className="outeraddpeg" onClick={() => this.props.openModal({modal: 'CreatePeg'} )}><i id="addpeg" class="fa fa-plus" aria-hidden="true"></i></div>
            {this.props.pegs.map(peg=>


              <div className="divpegshow" onClick={ () => this.props.history.push(`/peg/${peg.id}`) }>
                <i id="thumbtack" class="fas fa-thumbtack" ></i>
                <li className="index-image" >
                  <div className="masonry">
                    <div class="container">
                    <img src={peg.image_url}/>
                    </div>
                    <span>{peg.title}</span>
                  </div>
                </li>
              </div>

            )}
          </Masonry>
        </ul>
        </div>
    );

  }

}

export default withRouter (PegsSpecialComponent);
