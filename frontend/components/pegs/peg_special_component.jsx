import React from 'react';
import Masonry from 'react-masonry-component';
import UserShow from '../user/user_show';
import {  Link, withRouter } from 'react-router-dom';
import { openModal } from '../../actions/modal_actions';

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

    return(

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

    );

  }

}

export default withRouter (PegsSpecialComponent);
