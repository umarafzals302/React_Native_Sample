import { combineReducers } from 'redux';
import userSession from './reducers/userSession';
import generalParam from './reducers/generalParam'

export default combineReducers({
  userSession: userSession,
  generalParam:generalParam
});
