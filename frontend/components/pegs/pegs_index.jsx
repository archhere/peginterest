import React from 'react';
import { Link, withRouter } from 'react-router-dom';


class PegsIndex extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      end: 20
    };

    // this.infiniteScroll = this.infiniteScroll.bind(this);
  }

  componentDidMount() {
    window.bottom = false;
    window.addEventListener("scroll", this.infiniteScroll);
    this.props.requestAllPegs();
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.infiniteScroll);
  }

  render() {
    this.props.pegs.map(peg=>
      peg.image_url
    )

}
}

export default withRouter(PegsIndex);
