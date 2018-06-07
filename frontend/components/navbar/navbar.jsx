import React from 'react';
import { Link } from 'react-router-dom';

import LogInFormContainer from '../session_form/login_form_container';


const navBar = ({currentUser, logout}) => {
  const sessionLinks = () => (
    <div className='loginbackground'>
      <LogInFormContainer/>
    </div>
  );
  const nav = () => (
    <hgroup className="header-group">
      <ul>
        <li><img src={window.logo}/></li>
        <li><input type="text" className="searchbar" placeholder="Search"/></li>
        <li className="search"><i className="fas fa-search"></i></li>
        <li><Link className="nav_link" to={'/'}>Profile</Link></li>
        <li className="userimg"><i className="fas fa-user"></i></li>
        <li>{currentUser.username}</li>
        <li><button className="header-button" onClick={()=>logout()}>Log Out</button></li>
      </ul>
      
    </hgroup>
  );

  return currentUser ?
  nav(currentUser, logout) :
  sessionLinks();
};


export default navBar;
