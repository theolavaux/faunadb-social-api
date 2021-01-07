const express = require('express');
const swaggerUi = require('swagger-ui-express');

const users = require('./users');
const posts = require('./posts');
const comments = require('./comments');

const router = express.Router();

const swaggerDocument = require('./swagger.json');

router.get('/', (req, res) => {
  res.json({
    message: 'v1 API route',
  });
});

router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

router.use('/users', users);
router.use('/posts', posts);
router.use('/comments', comments);

module.exports = router;
