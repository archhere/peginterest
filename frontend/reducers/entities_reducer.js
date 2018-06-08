import { combineReducers } from 'redux';
import usersReducer from './users_reducer';
import pegsReducer from './pegs_reducer';


const entitiesReducer = combineReducers({
  users: usersReducer,
  pegs: pegsReducer,
});



export default entitiesReducer;
