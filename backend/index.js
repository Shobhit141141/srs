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
    // Only apply the auth middleware if it's not a signup or login request
    const isAuthRequired = !(
      req.body.operationName === 'signupTeacher' || req.body.operationName === 'loginTeacher'
    );

    if (isAuthRequired) {
      const teacher = await authMiddleware(req);
      if (!teacher) {
        throw new Error('Authentication token is missing or invalid.');
      }
      console.log('context teacher:', teacher.id);
      return { teacher, req }; // Return the teacher in the context
    }

    return { req }; // No teacher in context for login/signup
  }
});

server.start().then(() => {
  server.applyMiddleware({ app });

  sequelize.sync().then(() => {
    app.listen(4000, () => {
      console.log(
        `Server is running at http://localhost:4000${server.graphqlPath}`
      );
    });
  });
});
