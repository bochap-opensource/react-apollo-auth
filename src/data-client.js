import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';

export const createClient = (
  cache, link, ssrMode
) => new ApolloClient({
  cache, link, ssrMode
});

export const createHttpLink = (uri, fetch) => {
  const options = { uri };
  if (fetch) {
    options.fetch = fetch;
  }

  return new HttpLink(options);
};

export const createInMemoryCache = (initialState) => {
  const cache = new InMemoryCache();
  if (initialState) {
    cache.restore(initialState);
  }
  return cache;
};

export const createErrorLink = onError(({ response }) => {
  // Moving the errors into the data object so that apollo-client will not blow up
  // the consumer can use the errors property in data for display
  response.data.errors = response.errors.reduce(
    (accumulator, error) => {
      return [ error.message, ...accumulator ];
    }, []
  );
  response.errors = null;
});
