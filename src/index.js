import "babel-polyfill";

import SC from 'soundcloud';

import React from 'react';
import ReactDOM from 'react-dom';

import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import { Provider } from 'react-redux';

import * as storeConfig from './stores/configureStore';
import * as actions from './actions';

import App from './components/App';
import Callback from './components/Callback';
import Stream from './components/Stream';


const tracks = [
  {
    title: 'Some track'
  },
  {
    title: 'Some other track'
  }
];

const store = storeConfig.default();

import { watchForLoadScUser } from './sagas/sagas';

storeConfig.sagaMiddleware.run(watchForLoadScUser);




store.dispatch(actions.setTracks(tracks));

const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={Stream} />
        <Route path="/" component={Stream} />
        <Route path="/callback" component={Callback} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
);