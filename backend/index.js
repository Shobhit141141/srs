const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const sequelize = require('./config/db');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const feesRecordRoutes = require('./routes/feesRecordRoutes');

app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/fees', feesRecordRoutes);
app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

sequelize.sync().then(() => {
  app.listen(4000, () => {
    console.log(`Server is running at http://localhost:4000`);
  });
});
