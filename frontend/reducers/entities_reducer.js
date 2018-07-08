import { combineReducers } from 'redux';
import usersReducer from './users_reducer';
import pegsReducer from './pegs_reducer';
import boardsReducer from './boards_reducer';
import boardpegReducer from './boardpeg_reducer';

const entitiesReducer = combineReducers({
  users: usersReducer,
  pegs: pegsReducer,
  boards: boardsReducer,
  boardpegs: boardpegReducer
});



export default entitiesReducer;
