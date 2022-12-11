import React from 'react';
import { Route } from 'react-router-dom';

/**
 * Import all page components here
 */
import App from './components/App';
import Uploads from './components/Upload';

/**
 * All routes go here.
 * Don't forget to import the components above after adding new route.
 */
export default (
  <Route path="/" component={App}>
    <Route component={App} />
    <Route path="/Upload" component={Uploads} />
  </Route>
);