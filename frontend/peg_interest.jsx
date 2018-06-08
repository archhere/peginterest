import React from 'react';
import ReactDOM from 'react-dom';
import configureStore from './store/store.js';
import Root from './components/root';
// import { login,logout,signup } from './util/session_api_util'
import * as pegAPIUtil from './util/peg_api_util';


document.addEventListener('DOMContentLoaded',()=>{
  // window.login = login;
  // window.logout = logout;
  // window.fetchAllPegs = pegAPIUtil.fetchAllPegs;
  // window.fetchone = pegAPIUtil.fetchSinglePeg;

  let store;
  if (window.currentUser) {
    const preloadedState = {
      session: { id: window.currentUser.id },
      entities: {
        users: { [window.currentUser.id]: window.currentUser }
      }
    };
    store = configureStore(preloadedState);
    delete window.currentUser;
  } else {
    store = configureStore();
  }
  window.getState = store.getState;
  window.dispatch = store.dispatch;


  ReactDOM.render(<Root store={ store }/>,document.getElementById("root"));
});
