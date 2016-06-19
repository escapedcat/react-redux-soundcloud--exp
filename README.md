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

Here are clearly some unclear points involved. This is related to my limited knowledge of saga, redux and react itself. But let's go step by step...

1. When `Login` is clicked the `auth()` action is triggered, dispatched, started, ...  
  `index.js`
  ```
  function mapDispatchToProps(dispatch) {
    return {
      onAuth: bindActionCreators(actions.loadScUser, dispatch)
    };
  }
  ```
  Is this the right way to do it with _saga_ in mind? I don't know.  
  Maybe this is actually not needed. [Reading the beginner saga tutorial](http://yelouafi.github.io/redux-saga/docs/introduction/BeginnerTutorial.html) it looks like something dispatching the action only could work.  
  But I don't know now and this works for now so I'll leave it. I realize though that I shouldn't trigger `loadScUser` directly because actually `watchForLoadScUser` is waiting for `LOAD_SC_USER` and would then trigger `watchForLoadScUser`.  
  But it's ok I noticed this now. I'll fix it later.

2. In `sagas.js` `loadScUser` is called directly (shouldn't) and then _yields_ the Soundcloud API call.

3. `auth.js` - Here instead of doing it like [the tutorial shows]() we need to return the response so that the `yield` can handle it.

I couldn't figure out how to do this properly. How to return some sort of function that does an API call and returns the result to the `yield`.  
In the earlier tutorial I did this:
```
export const fetchPosts = () => {
    return fetch(API_ENDPOINT).then( response => response.json())
};
```
This is pretty straight-forward. But looking at this, I wasn't sure how to modify it:
```
export function auth() {
    SC.initialize({ client_id: CLIENT_ID, redirect_uri: REDIRECT_URI });

    SC.connect().then((session) => {
      fetch(`//api.soundcloud.com/me?oauth_token=${session.oauth_token}`)
        .then((response) => response.json())
        .then((me) => {
          console.log(me);
        });
    });
};
```
Where to add the return? Or how to wrap this to return a function? Looking at the [redux-thunk]() version it looks like this:
```
export function auth() {
  return function (dispatch) {
    SC.initialize({ client_id: CLIENT_ID, redirect_uri: REDIRECT_URI });

    SC.connect().then((session) => {
      fetch(`//api.soundcloud.com/me?oauth_token=${session.oauth_token}`)
        .then((response) => response.json())
        .then((me) => {
          dispatch(setMe(me));
        });
    });
  };
};
```
But in my _saga_ case I don't want to dispatch anything directly from inside that function. I kinda thought about returning a promise here, but couldn't make it work.
After asking my [JavaScript Superhero](https://twitter.com/usefulthink) for help he recommended [two](https://www.twilio.com/blog/2015/10/asyncawait-the-hero-javascript-deserved.html) [articles](https://jakearchibald.com/2014/es7-async-functions/) to read. After reading the first article I tried this:
```
export const fetchScUser = () => {

  return new Promise(function(resolve, reject) {
    SC.initialize({ client_id: CLIENT_ID, redirect_uri: REDIRECT_URI });

    SC.connect().then((session) => {
      fetch(`//api.soundcloud.com/me?oauth_token=${session.oauth_token}`)
        .then((response) => resolve(response.json()))
    });
  });

};
```
I renamed it to `fetchScUser`, but that's not important. The interesting part is that this now returns the _resolved promise_ that `yield` is waiting for.  

Still, I have no clue if this is the nice/right way to do it. I'll have a break now and will continue within the next days with this.

...Ok, back at it...  

Regrading [my point above](2. In `sagas.js` `loadScUser` is called directly (shouldn't) and then _yields_ the Soundcloud API call.): I think I am wrong. `index.js` does not trigge rthe `saga` directly, but is dispatching the action (`actions.loadScUser`) the sage (`watchForLoadScUser`) is `taking` (watching).  
So let me not touch this again.  

Where to continue though? Forgot... let's have a look at [the official tutorial]() again and see what's up next.  


### Set `me`

The original tutorial does:
```
.then((me) => {
  dispatch(setMe(me));
});
```
Adding the `me` data to the store. Let's do that as well and also maybe rename our functions to be closer the original tutorial again so it's easier to follow.  

#### `sagas.js`
```
import { fetchScUser } from '../actions/auth';
import { put, take } from 'redux-saga/effects';


export function* auth() {
console.info('auth');
  try {
    const me = yield fetchScUser();
console.log(me);
    yield put({type: 'SC_USER_LOADED', me});
  } catch(error) {
    yield put({type: 'SC_USER_LOAD_FAILURE', error});
  }
}


export function* watchForAuthScUser() {
  while(true) {
    yield take('AUTH_SC_USER');
    yield auth();
  }
}
```
This means we need to change naming related functions in:
- `components/Stream.js`
- `index.js`
- `actions/sc.js`
- `constants/actionTypes.js`
- `actions/index.js`

#### `auth.js`
And now let's combine `sc.js` and `auth.js` again to keep close to the tutorial again.
```
import { CLIENT_ID, REDIRECT_URI } from '../constants/auth';
import * as actionTypes from '../constants/actionTypes';

export const fetchScUser = () => {

  return new Promise(function(resolve, reject) {
    SC.initialize({ client_id: CLIENT_ID, redirect_uri: REDIRECT_URI });

    SC.connect().then((session) => {
      fetch(`//api.soundcloud.com/me?oauth_token=${session.oauth_token}`)
        .then((response) => resolve(response.json()))
    });
  });

};

// auth/load SC user data
export function authScUser() {
  return {
    type: actionTypes.AUTH_SC_USER
  }
}
```
Had to modify `actions/index.js` as well.  

#### Add `setMe` function
`constants/actionTypes.js`  

```
...
export const ME_SET = 'ME_SET';
```


`actions/auth.js`  

```
function setMe(user) {
  return {
    type: actionTypes.ME_SET,
    user
  };
}
```

#### Add new reducer

#####`reducers/index.js`  

```
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import auth from './auth';
import track from './track';

export default combineReducers({
  auth,
  track,
  routing: routerReducer
});
```


##### `reducers/auth.js`  

```
import * as actionTypes from '../constants/actionTypes';

const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case actionTypes.ME_SET:
      return setMe(state, action);
  }
  return state;
}

function setMe(state, action) {
  const { user } = action;
  return { ...state, user };
}
```


##### `components/Stream/index.js`

```
...

function mapStateToProps(state) {
  const { user } = state.auth;
  const tracks = state.track;
  return {
    user,
    tracks
  }
}

...
```

##### `components/Stream/presenter.js`

```
...

function Stream({ user, tracks = [], onAuth }) {
  return (
    <div>
      <div>
        {
          user ?
            <div>{user.username}</div> :
            <button onClick={onAuth} type="button">Login</button>
        }

...
```

Now I modified and added a bunch of files. `ME_SET` action is bein gtriggered and I get the SC userdata. But for som ereason the `me` is not being added to the `auth` state.  
Found it, but again, not sure if this is correct. We don't need the special `setMe` action here, because the saga is dispatching the action and the reducer listens to it. 
  
Making this small change, the userdata is being added to the store and the login button will change to my _username_:

##### `reducers/auth.js`  

```
...

function setMe(state, action) {
  // const { user } = action;
  const user = action.me;
  return { ...state, user };
}

...
```
Not sure if this is the way to go, but I asked myself [the question during the last tutorial]() as well.  