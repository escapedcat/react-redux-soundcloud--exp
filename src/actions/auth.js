import { CLIENT_ID, REDIRECT_URI } from '../constants/auth';
import * as actionTypes from '../constants/actionTypes';


export const connectSc = () => {
console.info('connectSc');
  return new Promise(function(resolve, reject) {
    SC.initialize({ client_id: CLIENT_ID, redirect_uri: REDIRECT_URI });
    SC.connect().then((session) => resolve( session ));
  });
};


export const fetchScUser = (session) => {
console.info('fetchScUser');
    return fetch(`//api.soundcloud.com/me?oauth_token=${session.oauth_token}`)
      .then( response => response.json() )
};


export const fetchStream = (me, session) => {
console.info('fetchStream');
  return fetch(`//api.soundcloud.com/me/activities?limit=20&offset=0&oauth_token=${session.oauth_token}`)
    .then((response) => response.json())
}


// auth/load SC user data
export function authScUser() {
console.info('action: authScUser');
  return {
    type: actionTypes.AUTH_SC_USER
  }
}

