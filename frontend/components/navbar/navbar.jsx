import React from 'react';
import { Link } from 'react-router-dom';

import LogInFormContainer from '../session_form/login_form_container';
import PegsIndexContainer from '../pegs/pegs_index_container';

const navBar = ({currentUser, logout}) => {
  const sessionLinks = () => (
    <div className='loginbackground'>
      <LogInFormContainer/>
    </div>
  );
  const nav = () => (

    <div className="final">
      <hgroup className="header-group">
          <div className="searchandlogo">
          <div>
            <Link to="/"><img src={window.logo}/></Link>
          </div>
          <div className="searchbarouter">
            <div>
              <input type="text" className="searchbar" placeholder="Search"/>
            </div>
            <div className="search"><i className="fas fa-search"></i></div>
          </div>
          </div>

          <div className="profile-link-outer">
            <Link style={{ textDecoration: 'none'}} to={`/user/${currentUser.id}`}>
              <div className="profile-link">
            {(currentUser.image_url === null) ?
              <div className="userimg"><i className="fas fa-user"></i></div> :
              <div className="userimg"><img src={currentUser.image_url}/></div>
            }
            </div>
          <div className="nav_link">
            {currentUser.username[0].toUpperCase()+currentUser.username.slice(1)}

          </div>

          </Link>
        </div>

          <li><button className="header-button"
            onClick={()=>logout()}>Log Out</button></li>

          
      </hgroup>

    </div>
  );

  return currentUser ?
  nav(currentUser, logout) :
  sessionLinks();
};


export default navBar;
