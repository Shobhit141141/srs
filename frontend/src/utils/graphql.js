
import { GraphQLClient } from 'graphql-request';

const client = new GraphQLClient('http://localhost:4000/graphql', {
  headers: {
    // Add any headers if needed (like authentication)
  },
});

export default client;
