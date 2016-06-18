import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import track from './track';

export default combineReducers({
  track,
  routing: routerReducer
});