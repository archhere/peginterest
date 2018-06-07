import { combineReducers } from 'redux';

import entitiesReducer from './entities_reducer';
import ui from './ui_reducer';
import sessionReducer from './session_reducer';
import errorsReducer from './errors_reducer';

const rootReducer = combineReducers({
  entities: entitiesReducer,
  session: sessionReducer,
  ui,
  errors: errorsReducer,
});

export default rootReducer;
