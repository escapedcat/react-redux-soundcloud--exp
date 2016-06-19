import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import track from './track';
import auth from './auth';

export default combineReducers({
  track,
  auth,
  routing: routerReducer
});