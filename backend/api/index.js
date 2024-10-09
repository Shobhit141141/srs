const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const sequelize = require('./config/db');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const morgan = require('morgan');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
app.use(morgan('dev'));

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
      console.log('context teacher:', teacher.id);
      return { teacher, req };
    }

    return { req };
  },
});

// Start the Apollo server
const startServer = async () => {
  await server.start();
  server.applyMiddleware({ app });

  // Sync the database
  await sequelize.sync();
};

// Vercel requires an exportable function
module.exports = async (req, res) => {
  await startServer();
  app(req, res); // Call the express app
};
