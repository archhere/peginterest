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

    <div>
      <hgroup className="header-group">
        <ul>
          <li><Link to="/"><img src={window.logo}/></Link></li>
          <li><input type="text" className="searchbar" placeholder="Search"/></li>
          <li className="search"><i className="fas fa-search"></i></li>
          <li>
            <ul className="profile-link">
            {(currentUser.image_url === null) ?
              <li className="userimg"><i className="fas fa-user"></i></li> :
              <li className="userimg"><img src={currentUser.image_url}/></li>
            }

          <li><Link className="nav_link" to={'/'}>
            {currentUser.username[0].toUpperCase()+currentUser.username.slice(1)}
              </Link>
          </li>
          </ul>
        </li>

          <li><button className="header-button"
            onClick={()=>logout()}>Log Out</button></li>

        </ul>
      </hgroup>
      <PegsIndexContainer/>
    </div>
  );

  return currentUser ?
  nav(currentUser, logout) :
  sessionLinks();
};


export default navBar;
