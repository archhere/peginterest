import React from 'react';
import { closeModal } from '../../actions/modal_actions';
import { connect } from 'react-redux';
import CreatePegContainer from './../pegs/create_peg_form_container';
import EditPegContainer from './../pegs/edit_peg_form_container';
import SavePegContainer from './../pegs/save_peg_container';
import PegShowContainer from './../pegs/peg_show_container';
import CreateBoardContainer from './../boards/create_board_container';
import EditBoardContainer from './../boards/edit_board_container';


//by importing react, is our functional component implicitly
//a functional component

const Modal = (props) => {
  if (!props.modal){
    return null;
  }


  let component;

  switch(props.modal.modal){
    case 'ShowPeg':
      component = <PegShowContainer />;
      break;
    case 'CreatePeg':
      component = <CreatePegContainer />;
      break;
    case 'EditPeg':
      component = <EditPegContainer peg={props.modal.peg}/>;
      break;
    case 'SavePeg':
      component = <SavePegContainer peg={props.modal.peg}/>;
      break;
    case "CreateBoard":
      component = <CreateBoardContainer />;
      break;
    case "EditBoard":
      component = <EditBoardContainer board={props.modal.board}/>;
      break;
    default:
      return null;
  }


  let modalStyle;
  if(props.modal === 'CreatePeg' || props.modal === 'CreateBoard'){
    modalStyle = {background: `linear-gradient( rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5) )`};
  } else {
    modalStyle = {background: `linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) )`};

  }


  return (
    <div className="modal-background" style={modalStyle}>
      <div className="modal-child" onClick={e => e.stopPropagation()}>
        { component }
      </div>
    </div>
  );

};
const mapStateToProps = (state) => {
    return {
      modal: state.ui.modal,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
      closeModal: () => dispatch(closeModal()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
