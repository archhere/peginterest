import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import Masonry from 'react-masonry-component';
import MasonryInfiniteScroller from 'react-masonry-infinite';
import MasonryLayout from 'react-masonry-layout';
import PegShowContainer from './peg_show_container';
import { ProtectedRoute } from '../../util/route_util';
// import { openModal } from '../../actions/modal_actions';


class PegsIndex extends React.Component {
  constructor (props) {
    super(props);
    console.log("props",props);
    this.state = {
      end: 10,
    };

    this.infiniteScroll = this.infiniteScroll.bind(this);
  }

  componentDidMount(){
    window.bottom = false;
    window.addEventListener("scroll", this.infiniteScroll);
    this.props.requestAllPegs();
  }

  infiniteScroll() {
    $(window).scroll( function() {
      if ($(window).scrollTop() <= $(document).height() - $(window).height() && $(window).scrollTop() >= $(document).height() - $(window).height() - 50) {
        window.bottom = true;
      }
    });

    if (window.bottom) {
      if (this.state.end < this.props.pegs.length) {
        this.setState({
          end: this.state.end + 10
        });
      }
      window.bottom = false;
    }
  }


  componentWillUnmount() {
    window.removeEventListener("scroll",this.infiniteScroll);
  }




  render(){
    let masonryOptions = {
      transitionDuration: 1,
      gutter: 20,
    };

    return(

        <div class='create-peg-container' onClick={ () => this.props.closeModal()}>
          <Masonry className={"pegs-index"}
                elementType={'ul'}
                options={masonryOptions}
                disableImagesLoaded={false}
                updateOnEachImageLoad={false}
                >

            {this.props.pegs.map(peg=>


              <div className="divpegshow" onClick={ () => this.props.history.push(`/peg/${peg.id}`) }>

                <div className="index-image" >
                  <div className="divshowmodal">
                    <div onClick={e => {e.preventDefault();
                    e.stopPropagation();
                    this.props.openModal({modal: 'SavePeg', peg: peg} );}} className="peg-save">Save</div>
                  </div>
                  <div className="masonry">
                    <div class="container">
                    <img src={peg.image_url}/>

                    </div>
                    <span>{peg.title}</span>
                  </div>
                </div>
              </div>

            )}
          </Masonry>
        </div>

    );

  }

}

export default withRouter (PegsIndex);
