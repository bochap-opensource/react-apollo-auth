import { withRouter } from 'react-router';
import { compose, withApollo } from 'react-apollo';

import App from './client/app';
import Home from './client/home';
import Login from './client/login';
import Logout from './client/logout';
import { getStatus, getCurrentCredential, createCredential } from './client/query';

export default () => [
  {
    component: compose(
      getStatus
      , getCurrentCredential
    ) (withRouter(App))
    , routes: [
      {
        path: '/'
        , exact: true
        , component: getCurrentCredential(withRouter(Home))
      }
      , {
        path: '/login'
        , component: withApollo(createCredential(withRouter(Login)))
      }
      , {
        path: '/logout'
        , component: withApollo(withRouter(Logout))
      }
    ]
  }
];
