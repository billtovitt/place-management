import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundScreen = () => {
  return (
    <div id="not-found" className="hero is-fullheight">
      <div className="hero-body columns">
        <div className="column is-offset-2">
          <h1 className="title is-1">Page not found</h1>
          <h4 className="title is-4">
            Please go back, or go <Link to="/">home</Link>
          </h4>
        </div>
      </div>
    </div>
  );
}

export default NotFoundScreen;
