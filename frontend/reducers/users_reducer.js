import { RECEIVE_CURRENT_USER} from '../actions/session_actions';
import merge from 'lodash/merge';

const usersReducer = (state={},action) => {
  switch (action.type) {
    case RECEIVE_CURRENT_USER:
      merge({},state,{[action.currentUser.id]: action.currentUser})

    default:
      return state;
  }
}

export default usersReducer;
