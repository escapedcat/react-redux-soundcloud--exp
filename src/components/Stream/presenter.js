import React from 'react';

function Stream({ user, tracks = [], onAuth }) {
  return (
    <div>
      <div>
        {
          user ?
            <div>{user.username}</div> :
            <button onClick={onAuth} type="button">Login</button>
        }
        </div>
        <br/>
        <div>
        {
          tracks.map((track, key) => {
            return <div className="track" key={key}>{track.origin.title}</div>;
          })
        }
      </div>
    </div>
  );
}

export default Stream;