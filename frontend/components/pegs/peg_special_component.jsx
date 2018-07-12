import React from 'react';
import Masonry from 'react-masonry-component';
import UserShow from '../user/user_show';
import {  Link, withRouter } from 'react-router-dom';


class PegsSpecialComponent extends React.Component {
  constructor (props) {
    super(props);
  }

  componentDidMount(){
    if (this.props.match.path === "/user/:id/boards/:id/pegs") {
      this.props.requestBoardPeg(this.props.match.params.id);
    } else {
      this.props.requestAllBoardPegs();
    }
  }

  componentDidUpdate(prevProps,prevState){
      if (prevProps.pegs.length !== this.props.pegs.length){
        if (this.props.match.path === "/user/:id/boards/:id/pegs") {
          this.props.requestBoardPeg(this.props.match.params.id);
        } else {
          this.props.requestAllBoardPegs();
        }
      }
  }

  displaypegs(){
    let masonryOptions = {
      transitionDuration: 1,
      gutter: 20,
    };
    if (this.props.pegs === []){
      return "";
    }
    return (

      <div class='create-peg-container'>
        <div className='create-peg-internal-div1'></div>
        <Masonry className={"pegs-index1"}
          elementType={'ul'}
          options={masonryOptions}
          disableImagesLoaded={false}
          updateOnEachImageLoad={false}
          >
          <div className="outeraddpeg"
            onClick={() => this.props.openModal({modal: 'CreatePeg'} )}><i id="addpeg"
            class="fa fa-plus" aria-hidden="true"></i></div>
          {this.props.pegs.map(peg=>


            <div className="divpegshow" onClick={ () => this.props.history.push(`/peg/${peg.peg.id}`) }>

              <div className="index-image" >
                <div className="divshowmodal">
                  <div onClick={e => {e.preventDefault();
                      e.stopPropagation();
                      this.props.openModal({modal: 'SavePeg', peg: peg} );}} className="peg-save">Save</div>
                  </div>
                  <div className="masonry">
                    <div class="container">
                      <img src={peg.peg.image_url}/>

                    </div>
                    <span>{peg.peg.title}</span>
                  </div>
                </div>
              </div>

            )}
          </Masonry>
        </div>
    );
  }

  render(){
    let superduper;
    if (this.props.currentBoard.title !== ""){
      var val = <img
        src="https://res.cloudinary.com/archhere/image/upload/v1528847964/simple-grey-small-pencil-icon.jpg"
        className="editbutton"/>;
      superduper = "boardpeg34";
    }
    else {
      val = "";
      superduper = "boardpeg3456";
    }

    if(!this.props.currentBoard){
      return (
        <div>Loading</div>
      );
    }

    return(
        <div>
          <div className={superduper}>
          <div className="val12"
            onClick={() => this.props.openModal({modal: 'EditBoard',
              board: this.props.currentBoard}  )}>{val}</div>
          <h3>{this.props.currentBoard.title}</h3>
          </div>
            {this.displaypegs()}
        </div>
    );

    }

    }

    export default withRouter (PegsSpecialComponent);
