import fetch from 'isomorphic-fetch';
import jwt from 'jsonwebtoken';
import React from 'react';
import { renderRoutes } from 'react-router-config';
import { StaticRouter } from 'react-router-dom';
import { ApolloProvider, renderToStringWithData } from 'react-apollo';

import { BASE_URI, COOKIE_KEY, JWT_SECRET_KEY } from './constants';
import {
  createClient, createHttpLink, createInMemoryCache
} from './data-client';
import routesConfig from './routes';
import { currentCredentialQuery } from './client/query';

const renderPage = (component, state) => (
  `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>React Apollo Auth</title>
        <base href="${BASE_URI}" />
      </head>
      <body>
        <div id="appRoot">${component}</div>
        <script>
          // WARNING: See the following for security issues around embedding JSON in HTML:
          // http://redux.js.org/docs/recipes/ServerRendering.html#security-considerations
          window.__APOLLO_STATE__ = ${JSON.stringify(state).replace(/</g, '\\u003c')}
        </script>
        <script type="text/javascript" src="assets/bundle.js"></script></body>
      </body>
    </html>
  `
);

export default () => (
  async (req, res, next) => {
    try {
      const cache = createInMemoryCache();
      const client = createClient(
        cache
        , createHttpLink(`${BASE_URI}/graphql`, fetch)
        , true
      );

      // This obtains the authentication credential from the signed cookie
      const token = req.cookies.get(COOKIE_KEY, { signed: true }) || '';
      let decoded = null;
      try {
        decoded = await jwt.verify(token, JWT_SECRET_KEY);
      } catch(err) {
        decoded = {
          email: ''
          , name: ''
        };
      }

      const credential = {
        ...decoded
        , token
        , __typename: 'Credential'
      };

      // Populate the store with the initial state of authentication during SSR
      client.writeQuery({
        query: currentCredentialQuery
        , data: { credential }
      });

      const context = {};
      const component = await renderToStringWithData(
        <StaticRouter
          location={req.url}
          context={context}
        >
          <ApolloProvider client={client}>
            {renderRoutes(routesConfig())}
          </ApolloProvider>
        </StaticRouter>
      );
      const initialState = client.cache.extract();
      res.send(renderPage(component, initialState));
    } catch (err) {
      next(err);
    }
  }
);
