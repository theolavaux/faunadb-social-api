const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const middlewares = require('../middlewares');

const api = require('../api');

// Create the Express app
const app = express();

// Load app middlewware
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

// Define a response for '/'
app.get('/', (_, res) => {
  res.json({
    message: 'Server default route',
  });
});

// Load API routes
app.use('/api/v1', api);

// Custom middlewares
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
