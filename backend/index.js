// This file isn't really needed for Vercel deployment
// But if you want to maintain it for local development or static serving, here's a possible structure:

const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express();

// Morgan for logging
app.use(morgan('dev'));

// Serve static files (for frontend, if any)
app.use(express.static(path.join(__dirname, 'public')));

// Fallback route to handle any undefined routes (optional)
app.get('*', (req, res) => {
  res.status(404).send('Page not found');
});

// Start server for local development only (Vercel will handle in production)
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;
