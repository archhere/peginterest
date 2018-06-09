import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import Masonry from 'react-masonry-component';
import MasonryInfiniteScroller from 'react-masonry-infinite';
import MasonryLayout from 'react-masonry-layout';
// import Masonry from 'react-masonry-component';

class PegsIndex extends React.Component {
  constructor (props) {
    super(props);



  }
  componentDidMount(){
    this.props.requestAllPegs();
  }

  render(){
    let masonryOptions = {
      transitionDuration: 1,
      gutter: 10,
      
    };

    return <ul class='create-item-container'>
      <Masonry className={"pegs-index"}
            elementType={'ul'}
            options={masonryOptions}
            disableImagesLoaded={false}
            updateOnEachImageLoad={false}
            >

        {this.props.pegs.map(peg=>
          <li>
            <div>
              <img src={peg.image_url}/>
              <span>{peg.title}</span>
            </div>

      </li>

        )}
      </Masonry>
    </ul>;
  }

}

export default withRouter (PegsIndex);
