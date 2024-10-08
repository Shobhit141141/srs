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
  }
});

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  // Sync Sequelize models
  await sequelize.sync();
}

// Call the function to start the server
startServer();
module.exports = app;