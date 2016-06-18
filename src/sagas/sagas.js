import { fetchScUser } from '../actions/auth';
import { put, take } from 'redux-saga/effects';


export function* loadScUser() {
console.info('loadScUser');
  try {
    const posts = yield fetchPosts()
console.log(posts)
    yield put({type: 'SC_USER_LOADED', posts})
  } catch(error) {
    yield put({type: 'SC_USER_LOAD_FAILURE', error})
  }
}


export function* watchForLoadScUser() {
  while(true) {
    yield take('LOAD_SC_USER');
    yield loadScUser();
  }
}

