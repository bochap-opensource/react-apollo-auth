import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import Cookies from 'cookies';

import { ApolloServer } from 'apollo-server-express';

import { COOKIE_KEY, COOKIE_SECRET_KEY } from './constants';
import renderEngine from './renderEngine';
import { typeDefs, resolvers } from './graphql/schema';

const PORT = 3000;

const start = async () => {
  const app = express();

  app.server = http.createServer(app);
  app.use(bodyParser.json({ extended: false }));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use('/assets', express.static('src/client/assets'));

  // Make cookies a property of req to allow easy setting and getting of cookies
  app.use((req, res, next) => {
    const options = {
      keys: [COOKIE_SECRET_KEY]
    };
    req.cookies = new Cookies(req, res, options);
    next();
  });

  // Endpoint to control the creation of the cookie on the Server
  // more security like secure, path or domain could be added
  app.post('/credentialCookie', (req, res) => {
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + req.body.expiryInDays);
    req.cookies.set(COOKIE_KEY, req.body.token, {
      signed: true,
      expires: currentDate
    });
    res.send('OK').end();
  });

  // Endpoint to destroy the cookie on the Server
  app.delete('/credentialCookie', (req, res) => {
    req.cookies.set(COOKIE_KEY);
    res.send('OK').end();
  });

  // Putting the GraphQL server togather with the client to make the code simple
  // Usually implementations will look to split them up
  const server = new ApolloServer({ typeDefs, resolvers });
  server.applyMiddleware({ app });

  // SSR the React client
  app.use((req, res, next) => renderEngine()(req, res, next));
  app.server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
