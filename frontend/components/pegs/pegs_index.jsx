import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import Masonry from 'react-masonry-component';
import MasonryInfiniteScroller from 'react-masonry-infinite';
import MasonryLayout from 'react-masonry-layout';
// import Masonry from 'react-masonry-component';

class PegsIndex extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      perPage: 1,
      items: Array(4).fill()
    };


    let loadItems = () => {
        this.setState({
          items: this.state.items.concat(Array(this.state.perPage).fill())
        });
    };
  }
  componentDidMount(){
    this.props.requestAllPegs();
  }

  render(){
    return <ul class='create-item-container'>
      <MasonryLayout
          id="masonry-layout"
          infiniteScroll={this.loadItems}>

        {this.props.pegs.map(peg=>
          <li><img src={peg.image_url}
            /></li>
          )}
      </MasonryLayout>
    </ul>;
  }

}

export default withRouter (PegsIndex);
