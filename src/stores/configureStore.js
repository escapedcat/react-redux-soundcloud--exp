import { compose, createStore, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';

import { browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';

import rootReducer from '../reducers/index';

const enhancers = compose(
  window.devToolsExtension ? window.devToolsExtension() : f => f
);

const logger = createLogger();
const router = routerMiddleware(browserHistory);

import createSagaMiddleware from 'redux-saga';
import { watchForLoadScUser } from '../sagas/sagas';

export const sagaMiddleware = createSagaMiddleware();

const createStoreWithMiddleware = applyMiddleware(router, logger, sagaMiddleware)(createStore);

export default function configureStore(initialState) {
  return createStoreWithMiddleware(rootReducer, initialState, enhancers);
}