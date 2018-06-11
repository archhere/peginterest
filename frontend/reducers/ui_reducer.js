import { combineReducers } from 'redux';
import modalsReducer from './modal_reducer';

const uiReducer = combineReducers({
  modal: modalsReducer,
});

export default uiReducer;
