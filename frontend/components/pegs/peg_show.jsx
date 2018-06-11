import React from 'react';
import {  Link, withRouter } from 'react-router-dom';


class PegShow extends React.Component{
  constructor(props){
    super(props);
  }

  componentDidMount(){
    this.props.requestOnePeg(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.id != nextProps.match.params.id) {
      this.props.requestOnePeg(nextProps.match.params.id);
    }
  }

  render(){
    if (this.props.peg){
      return (


      <div className="divshow">
        <div
          onClick={() => this.props.openModal({modal: 'SavePeg', peg: this.props.peg} )}>
          <img src={window.savebutton} className="savebutton"/>
        </div>  
          <ul className="peg-show">
            <li className="title">{this.props.peg.title}</li>
            <li><img src={this.props.peg.image_url}/></li>
            <li className="author"><span>{this.props.peg_author.firstname}</span> Saved peg to board {this.props.board.title}</li>
          </ul>
          <span className="link"><Link to='/' style={{ textDecoration: 'none',color: '#555'}}>&lt;&nbsp;Home</Link></span>

        </div>

      );
    }
      else return null;
  }

}


export default withRouter(PegShow);
