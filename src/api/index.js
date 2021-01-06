const express = require('express');

const users = require('./users');
const posts = require('./posts');
const comments = require('./comments');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API route',
  });
});

router.use('/users', users);
router.use('/posts', posts);
router.use('/users', comments);

module.exports = router;
