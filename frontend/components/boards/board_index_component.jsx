import React from 'react';
import Masonry from 'react-masonry-component';
import UserShow from '../user/user_show';
import {  Link, withRouter } from 'react-router-dom';
import PegsSpecialComponent from '../pegs/peg_special_component';
import  { Redirect } from 'react-router-dom';
import { values } from 'lodash';

class BoardIndexComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true
    };
  }


  componentDidMount(){
    this.setState({ loading: false });
    this.props.requestAllBoards();
    this.props.requestAllBoardPegs();
  }



  componentDidUpdate(prevProps,prevState){
    if (prevProps.boards.length !== this.props.boards.length){
      this.props.requestAllBoards();
      this.props.requestAllBoardPegs();
    }
  }

  render(){
      let boardHash = {};
      console.log(this.props.boardPegs);
      this.props.boards.forEach((board) => {
        let boardPegs = this.props.boardPegs.filter(peg => peg.peg.board_id === board.id);
        boardHash[board.id] = boardPegs;
      });
      console.log(values(boardHash[81]).slice(0, 8));
      const masonryOptions = {
       fitWidth: true,
       transitionDuration: 0
     };

     return (
       this.state.loading ?
       <div className="spinner"></div> :
       <div className='user-profile-items'>
         <Masonry
           elementType={'div'}
           disableImagesLoaded={false}
           className='profile-boards-container'
           options={masonryOptions}
           >
          <div className="boardinfo123" className="board-index-item-container"
            onClick={() => this.props.openModal({modal: 'CreateBoard'} )}>
            <i id="addboard" class="fa fa-plus" aria-hidden="true"></i>
          </div>

           { this.props.boards.map( (board, idx) => {
             return (
               <div key={idx}>
                 <Link style={{textDecoration: 'none'}} to={`${this.props.currentUser.id}/boards/${board.id}/pegs`} key={idx} className="board-index-item-container">
                   <div className="title12345">
                     {board.title}
                   </div>
                   <Masonry
                     elementType={'div'}
                     disableImagesLoaded={false}
                     options={masonryOptions}
                     >
                    { values(boardHash[board.id]).slice(0, 8).map( (pin,idx) => {
                       return (
                         <div key={idx}>
                           <img className='pins-in-board-thumbnail-pic' key={idx} src={pin.peg.image_url}></img>
                         </div>
                       );
                     })
                   }
                   </Masonry>
                 </Link>
              </div>
             );
             }
           )}
         </Masonry>
     </div>
   );
  }
}

export default withRouter(BoardIndexComponent);
