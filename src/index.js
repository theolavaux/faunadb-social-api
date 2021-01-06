const app = require('./app');
const db = require('./database');
require('dotenv').config();

// Set application port
const port = process.env.PORT || 5000;

// App configuration
app.set('port', port);

// Establish server connection
db.connect(() => {
  app.listen(port, () => {
    console.log(`API running on http://localhost:${port}`);
  });
});
