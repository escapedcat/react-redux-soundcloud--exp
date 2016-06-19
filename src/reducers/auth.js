import * as actionTypes from '../constants/actionTypes';

const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case actionTypes.ME_SET:
console.info('reducers - actionTypes.ME_SET', action);
      return setMe(state, action);

    case actionTypes.ME_SET_FAILURE:
console.error('oh oh, ME_SET_FAILURE');
      return state;
  }
  return state;
}

function setMe(state, action) {
console.info('reducers - setMe()', action);
  // const { user } = action;
  const user = action.me;
  return { ...state, user };
}