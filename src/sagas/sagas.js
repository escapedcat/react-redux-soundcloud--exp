import { connectSc, fetchScUser, fetchStream } from '../actions/auth';
import { put, take } from 'redux-saga/effects';


export function* auth() {
console.info('sagas - auth');
  try {
    const session = yield connectSc();
console.log(session);

    const me = yield fetchScUser(session);
console.log(me);
    yield put({type: 'ME_SET', me});

    const activities = yield fetchStream(me, session);
console.log(activities);
    const tracks = activities.collection;

    yield put({type: 'TRACKS_SET', tracks});

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

