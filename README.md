# the soundcloud client in react redux with saga instead of thunk


## Tutorial finsihed till _Redux Thunk_

Tutorial done so far. Everything seems to be ok so far.
I _do not_ install `whatwg-fetch` because I want to use generator functions and saga again.  
Issue with these tutorials is, that the amount of self-thinking involved is so low that it's hard to remember how and why things are done. It's a bit like technical dept, you make progress really fast, but the effort it takes later to actually understand what you have done and re-create this from scratch by yourself should not be underestimated.


### Recap generators from earlier projects

I already did [two]() [other]() tutorials on this. Let me briefly check on that code again before I continue here.  

I'm a bit confused because everyone is using different module bundlers, different babel plugins and different ES6 functionalities.  

But I know I want _generators_, instead of using _fetch_ so let's try that first.  
So this is wrong, I do want to use _fetch_ but in combination __WITH__ _generators_ so those can handle the _promises_.  
If I login I get my user information. So _fetch_ works.


### `sagas/sagas.js`

Juts to start somewhere I add a _saga_ file now with a basic approach of a sage to get the _soundcloud user data_.  


```
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
```
This is just the idea of the approach, nothing else, nothing correct.  
The idea is to fetch the userdata via the _soundcloud API_ but let _saga_ handle the _promise_ and _dispatch_ stuff.  
If I would load this now I don't think anything will change, because I don't _dispatch_ the saga action yet anywhere. Also, there is no action defined so far. Maybe I'll do that next.


### adding _load soundcloud user_ action

#### `actions/sc.js`
For now I decided to add all soundcloud related _actions_ to on file.

```
import * as actionTypes from '../constants/actionTypes';

// load SC user data
export function loadScUser() {
  return {
    type: actionTypes.LOAD_SC_USER
  }
}
```
And because in thsi tutorial all _action constants_ are collected in pne place I need to extend that file as well.

#### `constants/actionTypes.js`

```
export const TRACKS_SET = 'TRACKS_SET';
export const LOAD_SC_USER = 'LOAD_SC_USER';
```
At the momen tI don't see the benefit of doing this, but I guess in bigger applications this helps to keep the overview.

#### `actions/index.js`
Also we have to add our new action here.
```
import { auth } from './auth';
import { sc } from './sc';
import { setTracks } from './track';

export {
  auth,
  sc,
  setTracks
};
```

We still won't see anything I new I guess because `LOAD_SC_USER` is not dispatched somewhere. How is this triggered at the moment?

##### `components/Stream.js`
Let's look it up here.

```
...

import * as actions from '../../actions'

...

function mapDispatchToProps(dispatch) {
  return {
    onAuth: bindActionCreators(actions.auth, dispatch)
  };
}

...
```
On click the `auth` action is dispatched. Let me check how this was done in [the tutorial i did before]().  
It was done with `componentDidMount()`. Ok, but in this case it makes sense to dispatch it on click, because we need to trigger the _soundcloud login_ before we do anything else.  
Can we make that work? Instead of calling `auth` directly, can we instead dispatch `loadScUser`?

```
function mapDispatchToProps(dispatch) {
  return {
    onAuth: bindActionCreators(actions.loadScUser, dispatch)
  };
}
```
If I didn't forget anything (I usually do) then this shoudl trigger the saga and then fail because the sage calls `fetchScUser` from `actions/auth` which doesn't exists (yet). Let'se try!  
 
__Error__, I get:
```
bundle.js:36037 Uncaught Error: bindActionCreators expected an object or a function, instead received undefined. Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?
```
#### `actions/index.js`
I imported the `sc.js` but I did not import the correct functions. Let's try this:

```
import { auth } from './auth';
import { loadScUser } from './sc';
import { setTracks } from './track';

export {
  auth,
  loadScUser,
  setTracks
};
```
Ok, no error anymore. Let's click the button!!!!  
Ok, works, now my addded `LOAD_SC_USER` action is dispatched, but I don't even get an error message that `fetchScUser` isn't defined. Why is that?  
That's because the _saga middleware_ isn't yet included into the app... I think. Let's try.  
For reference we can check on [how reduc-thunk is included the original tutorial]() and how it was done on [the other tutorial]() I did.  

##### Adapted Wesbos tutorial
`store.js`
```
...
import createSagaMiddleware from 'redux-saga';
import {watchForLoadPosts, watchForLoadComments} from './sagas/sagas';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(watchForLoadPosts);
sagaMiddleware.run(watchForLoadComments);
...
```

##### Original favesound tutorial
```
import { createStore, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';

...

const logger = createLogger();
const router = routerMiddleware(browserHistory);

const createStoreWithMiddleware = applyMiddleware(thunk, router, logger)(createStore);
```

So both not that different. Let's just stuff that `sagaMiddleware` into our current `configureStore.js`.

#### `configureStore.js`
```
import { createStore, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';

import { browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';

import rootReducer from '../reducers/index';

const logger = createLogger();
const router = routerMiddleware(browserHistory);

import createSagaMiddleware from 'redux-saga';
import {watchForLoadScUser} from '../sagas/sagas';

const sagaMiddleware = createSagaMiddleware();
sagaMiddleware.run(watchForLoadScUser);

const createStoreWithMiddleware = applyMiddleware(router, logger, sagaMiddleware)(createStore);

export default function configureStore(initialState) {
  return createStoreWithMiddleware(rootReducer, initialState);
}
```

__Error!1!11__, because `redux-saga` is not yet installed. Let's do that:
```
npm install --save redux-saga
```

Another __Error!1!11__
```
bundle.js:38625 Uncaught ReferenceError: regeneratorRuntime is not defined
```
Good thing is I [encountered that one already during the other tutorial]().

##### `index.js`
```
import "babel-polyfill";

import SC from 'soundcloud';
...
```
And now I get
```
Module not found: Error: Cannot resolve module 'babel-polyfill'
```
Yay! So what did I miss here? I didn't actually install [https://babeljs.io/docs/usage/polyfill]. Let's do that.
```
npm install --save-dev babel-polyfill
```
So better, but...
```
bundle.js:44823 Uncaught Error: Before running a Saga, you must mount the Saga middleware on the Store using applyMiddleware
```
Issue now is that I'm not sure when and where to `sagaMiddleware.run(watchForLoadScUser)`. In `configureStore.js` the store isn't created, only prepared and in `index.js` where the `store` is created I'm not sure how to use the `sagaMiddleware`. Dang.


###### `sagaMiddleware.run(watchForLoadScUser)`

To make this work I need to things:

1. a ready & created `store`
2. the `sagaMiddleware` the `store` was created with

How to get this? `configureStore.js` is exporting the function to create the store: `export default function configureStore(initialState)`  
So what about exporting the used `sagaMiddleware` as well? Like this:
```
export const sagaMiddleware = createSagaMiddleware();
```

###### `index.js`

Now the import must be changed as well.
```
import * as storeConfig from './stores/configureStore';

...

const store = storeConfig.default();
import { watchForLoadScUser } from './sagas/sagas';
storeConfig.sagaMiddleware.run(watchForLoadScUser);
```
And now the error message sare gone. Yay? What happens if I cklick the button now? I almost do not dare... Let's click it anyway!  

`0_o` finally what we expected to get like 2 hours ago:
```
Object {type: "SC_USER_LOAD_FAILURE", error: ReferenceError: fetchPosts is not defined
    at loadScUser$ (http://localhost:8080/bundle.js:46598:…}
```
Coffee break!!!!


## Debugging help

### `webpack.config.js`
Dunno why I didn't chekc on this earlier:
```
  },
  devtool: 'source-map'
```

### [DevTools for Redux](https://github.com/gaearon/redux-devtools)
Install teh extension and add following changes:

`configureStore.js`
```
import { compose, createStore, applyMiddleware } from 'redux';

...

const enhancers = compose(
  window.devToolsExtension ? window.devToolsExtension() : f => f
);

...

export default function configureStore(initialState) {
  return createStoreWithMiddleware(rootReducer, initialState, enhancers);
}
```

## Saga is added and configured - next steps: Using sagas

