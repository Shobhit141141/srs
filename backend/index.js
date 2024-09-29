const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const sequelize = require('./config/db');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const morgan = require('morgan');

const app = express();
app.use(morgan('dev'));
const server = new ApolloServer({
  typeDefs,
  resolvers,
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
