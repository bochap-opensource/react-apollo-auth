import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const statusQuery = gql(
  `
    query StatusQuery {
      status {
        message
      }
    }
  `
);

export const getStatus = graphql(statusQuery, {
  name: 'getStatus'
});

export const currentCredentialQuery = gql(
  `
    query CurrentCredentialQuery {
      credential {
        email
        name
        token
      }
    }
  `
);

// This query should only be ran on the in memory cache on the client.
export const getCurrentCredential = graphql(currentCredentialQuery, {
  name: 'getCurrentCredential'
  ,  options: {
    fetchPolicy: 'cache-only'
  }
});


const loginMutation = gql(`
  mutation LoginMutation($email: String!) {
    createCredential(credential: {
      email: $email
    }) {
      email
      name
      token
    }
  }
`);

export const createCredential = graphql(loginMutation, {
  name: 'createCredential'
});
