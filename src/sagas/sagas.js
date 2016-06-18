import { fetchScUser } from '../actions/auth';
import { put, take } from 'redux-saga/effects';


export function* loadScUser() {
console.info('loadScUser');
  try {
    const me = yield fetchScUser();
console.log(me);
    yield put({type: 'SC_USER_LOADED', me});
  } catch(error) {
    yield put({type: 'SC_USER_LOAD_FAILURE', error});
  }
}


export function* watchForLoadScUser() {
  while(true) {
    yield take('LOAD_SC_USER');
    yield loadScUser();
  }
}

