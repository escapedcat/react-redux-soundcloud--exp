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
console.info('action: authScUser');
  return {
    type: actionTypes.AUTH_SC_USER
  }
}

// // set user
// export function setMe(user) {
// console.info('action: setMe', user);
//   return {
//     type: actionTypes.ME_SET,
//     user
//   };
// }