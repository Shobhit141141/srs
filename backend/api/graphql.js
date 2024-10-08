const { ApolloServer } = require('apollo-server-micro');
const typeDefs = require('../graphql/typeDefs');
const resolvers = require('../graphql/resolvers');
const authMiddleware = require('../middleware/authMiddleware');

// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const isAuthRequired = !(
      req.body.operationName === 'signupTeacher' || req.body.operationName === 'loginTeacher'
    );

    if (isAuthRequired) {
      const teacher = await authMiddleware(req);
      if (!teacher) {
        throw new Error('Authentication token is missing or invalid.');
      }
      return { teacher, req };
    }

    return { req };
  }
});

const startServer = server.start();

module.exports = async function handler(req, res) {
  await startServer;
  await server.createHandler({ path: '/api/graphql' })(req, res);
};

// Disable bodyParser, ApolloServer already does this
export const config = {
  api: {
    bodyParser: false,
  },
};
