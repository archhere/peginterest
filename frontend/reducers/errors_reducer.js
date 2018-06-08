import { combineReducers } from 'redux';
import sessionErrorsReducer from './session_errors_reducer';
import pegsErrorsReducer from './pegs_error_reducer';


const errorsReducer = combineReducers({
  session: sessionErrorsReducer,
  pegs: pegsErrorsReducer
});

export default errorsReducer;
