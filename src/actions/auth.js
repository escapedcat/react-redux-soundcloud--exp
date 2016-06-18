import { CLIENT_ID, REDIRECT_URI } from '../constants/auth';

// export function auth() {
//     SC.initialize({ client_id: CLIENT_ID, redirect_uri: REDIRECT_URI });

//     SC.connect().then((session) => {
//       fetch(`//api.soundcloud.com/me?oauth_token=${session.oauth_token}`)
//         .then((response) => response.json())
//         .then((me) => {
//           console.log(me);
//         });
//     });
// };

export const fetchScUser = () => {

  return new Promise(function(resolve, reject) {
    SC.initialize({ client_id: CLIENT_ID, redirect_uri: REDIRECT_URI });

    SC.connect().then((session) => {
      fetch(`//api.soundcloud.com/me?oauth_token=${session.oauth_token}`)
        .then((response) => resolve(response.json()))
    });
  });

};
