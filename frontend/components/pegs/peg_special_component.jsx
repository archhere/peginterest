import React from 'react';
import Masonry from 'react-masonry-component';
import UserShow from '../user/user_show';
import {  Link, withRouter } from 'react-router-dom';

class PegsSpecialComponent extends React.Component {
  constructor (props) {
    super(props);
    console.log("props",props);
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

            {this.props.props.pegs.map(peg=>


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
