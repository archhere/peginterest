import React from 'react';
import { Link } from 'react-router-dom';

import LogInFormContainer from '../session_form/login_form_container';


const navBar = ({ currentUser, logout}) => {
  const sessionLinks = () => (
    <div className='loginbackground'>
      <LogInFormContainer/>
    </div>
  );
  const nav = () => (
    <hgroup className="header-group">
      <h2 className="header-name">Hi, {currentUser.username}!</h2>
      <button className="header-button" onClick={logout}>Log Out</button>
    </hgroup>
  );

  return currentUser ?
  nav(currentUser, logout) :
  sessionLinks();
};


export default navBar;
