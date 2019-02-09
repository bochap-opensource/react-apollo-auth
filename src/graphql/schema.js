import jwt from 'jsonwebtoken';
import { gql } from 'apollo-server-express';

import { JWT_SECRET_KEY } from '../constants';

// Type Definition
const typeDefs = gql`
  type Status {
    message: String!
  }

  type Credential {
    token: String!
    email: String!
    name: String!
  }

  input CredentialInput {
    email: String!
  }

  type Query {
    status: Status
  }

  type Mutation {
    createCredential(credential: CredentialInput!): Credential
  }
`;

const resolvers = {
  Query: {
    status: () => {
      return {
        message: 'Live'
      };
    }
  },
  Mutation: {
    createCredential: async (root, { credential }) => {
      // This is hardcoded since it is a POC and to made the example simple
      // The resolver should be by itself and there should be a store to do this authentication
      if (credential.email !== 'test@test.com') {
        throw new Error('Credential validation error');
      }

      const user = {
        email: 'test@test.com',
        name: 'Test Users'
      };

      // Signing the JWT with a common secret here hardcoded in the file to keep in simple.
      const token = jwt.sign(user, JWT_SECRET_KEY);

      return {
        token,
        ...user
      };
    }
  }
};

export { typeDefs, resolvers };
