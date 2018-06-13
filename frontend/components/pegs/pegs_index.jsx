import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import Masonry from 'react-masonry-component';
import MasonryInfiniteScroller from 'react-masonry-infinite';
import MasonryLayout from 'react-masonry-layout';
import PegShowContainer from './peg_show_container';
import { ProtectedRoute } from '../../util/route_util';
// import { openModal } from '../../actions/modal_actions';
// import Masonry from 'react-masonry-component';

class PegsIndex extends React.Component {
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

    let actualProps;
    if (this.props.match.path === "/") actualProps = this.props.pegs;
    else actualProps = this.props.props;
    console.log(actualProps);

    return(

        <ul class='create-peg-container'>
          <Masonry className={"pegs-index"}
                elementType={'ul'}
                options={masonryOptions}
                disableImagesLoaded={false}
                updateOnEachImageLoad={false}
                >

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

export default withRouter (PegsIndex);
