const { Sequelize } = require('sequelize');

require('dotenv').config();
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: false,
        rejectUnauthorized: false
      }
    }
  }
);

sequelize
  .authenticate()  // Check if the connection is successful
  .then(() => {
    console.log('Connected to Aiven PostgreSQL');
    
    // Once the connection is authenticated, sync the models
    return sequelize.sync();  // Sync the database (create tables if they don't exist)
  })
  .then(() => {
    console.log('Database synchronized successfully.');
  })
  .catch(err => {
    console.log('Error connecting to Aiven PostgreSQL or synchronizing the database:', err);
  });

module.exports = sequelize;
