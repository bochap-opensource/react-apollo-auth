import React from 'react';
import { hydrate } from 'react-dom';
import { renderRoutes } from 'react-router-config';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter } from 'react-router-dom';

import {
  createClient, createErrorLink, createHttpLink, createInMemoryCache
} from '../data-client';
import RoutesConfig from '../routes';

const client = createClient(
  createInMemoryCache({ ...window.__APOLLO_STATE__ })
  , createErrorLink.concat(createHttpLink('http://localhost:3000/graphql'))
  , false
);

hydrate(
  <BrowserRouter>
    <ApolloProvider client={client}>
      {renderRoutes(RoutesConfig())}
    </ApolloProvider>
  </BrowserRouter>
  , document.getElementById('appRoot')
);
