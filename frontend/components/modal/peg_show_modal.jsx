import React from 'react';
import Modal from 'react-modal';
import PegShowContainer from '../pegs/peg_show_container';

const style = {
  overlay : {
    position                   : 'fixed',
    top                        : 0,
    left                       : 0,
    right                      : 0,
    bottom                     : 0,
    backgroundColor            : 'rgba(0, 0, 0, .5)',
    zIndex                     : 10
  },
  content : {
    display                    : 'flex',
    justifyContent             : 'center',
    left                       : '15%',
    right                      : '15%',
    border                     : '1px solid #ccc',
    overflow                   : 'auto',
    WebkitOverflowScrolling    : 'touch',
    borderRadius               : '25px',
    outline                    : 'none',
    padding                    : '20px',
    backgroundColor            : '#f2f2f2',
    zIndex                     : 11,
    opacity                    : 0,
    transition                 : 'opacity 0.4s'
  }
};

class PegShowModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {modalOpen: false,};
  }

  closeModal() {
    debugger
    this.setState({ modalOpen: false });
    style.content.opacity = 0;
  }

  openModal() {
    this.setState({ modalOpen: true });
  }

  afterModalOpen() {
    style.content.opacity = 100;
  }



  render() {
    let { peg } = this.props;
    return(
      <div>
        <button
          onClick={this.openModal}>
        </button>
      <Modal
        isOpen={this.state.modalOpen}
        onAfterOpen={this.afterModalOpen}
        onRequestClose={this.closeModal}
        style = {style}
        contentLabel="Peg Modal">
        <PegShowContainer
            closeModal={this.closeModal}
            id={peg.id} peg={peg}/>
      </Modal>
      </div>
    );
    }
}


export default PegShowModal;
