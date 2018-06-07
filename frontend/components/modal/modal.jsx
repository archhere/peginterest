import React from 'react';
import { closeModal } from '../../actions/modal_actions';
import { connect } from 'react-redux';
import LoginFormContainer from '../session_form/login_form_container';
import SignupFormContainer from '../session_form/signup_form_container';

const mapStateToProps = (state) => ({
  modal: state.ui.modal
})

const mapDispatchToProps = dispatch => ({
  closeModal: dispatch(closeModal())
})

function Modal({modal, closeModal}) {      //object deconstruction of props 
  if (!modal) return null;

  let component;
  switch (modal) {
    case 'login':
      component = <LoginFormContainer />;
      break;
    case 'signup':
      component = <SignupFormContainer />;
      break;
    default:
      return null;
  }
  return (
    <div className="modal-background" onClick={closeModal}>
      <div className="modal-child" onClick={e => e.stopPropagation()}>
        { component }
      </div>
    </div>
  );
}



export default connect(mapStateToProps, mapDispatchToProps)(Modal);
