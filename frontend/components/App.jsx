import React from 'react';
import { Provider } from 'react-redux';
import {
  Route,
  Redirect,
  Switch,
  Link,
  HashRouter
} from 'react-router-dom';


import NavBarContainer from './navbar/navbar_container';
import SignUpFormContainer from './session_form/signup_form_container';
import LogInFormContainer from './session_form/login_form_container';
import { AuthRoute, ProtectedRoute } from '../util/route_util';
import PegsIndexContainer from './pegs/pegs_index_container';
import PegShowContainer from './pegs/peg_show_container';
import Modal from './modal/modal';



const App = () => (
  <div>
    <Modal />
    <Route exact path='/' component={NavBarContainer}/>
    <AuthRoute exact path="/login" component={LogInFormContainer} />
    <AuthRoute exact path="/signup" component={SignUpFormContainer} />
    <Switch>
      <ProtectedRoute exact path="/peg/:id" component={PegShowContainer} />
    </Switch>
  </div>
);

export default App;
