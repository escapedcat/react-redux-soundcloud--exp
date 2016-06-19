import { fetchScUser } from '../actions/auth';
import { put, take } from 'redux-saga/effects';


export function* auth() {
console.info('sagas - auth');
  try {
    const me = yield fetchScUser();
console.log(me);
    yield put({type: 'ME_SET', me});
  } catch(error) {
    yield put({type: 'ME_SET_FAILURE', error});
  }
}


export function* watchForAuthScUser() {
  while(true) {
    yield take('AUTH_SC_USER');
    yield auth();
  }
}

