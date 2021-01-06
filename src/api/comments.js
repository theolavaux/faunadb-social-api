const express = require('express');
const faunadb = require('faunadb');

const db = require('../database');

const router = express.Router();

const {
  Paginate,
  Documents,
  Collection,
  Lambda,
  Get,
  Select,
  Ref,
  Now,
  Create,
} = faunadb.query;

// GET all comments
router.get('/', async (_, res, next) => {
  try {
    const comments = await db.get().query(
      Map(
        Paginate(Documents(Collection('comments'))),
        Lambda((x) => Get(x))
      )
    );
    res.send(comments);
  } catch (e) {
    next(e);
  }
});

// POST comments
router.post('/', async (req, res, next) => {
  const { targetPostId, commentAuthorId, title, content } = req.body;

  try {
    const data = {
      commentAuthor: Select(
        'ref',
        Get(Ref(Collection('users'), commentAuthorId))
      ),
      targetPost: Select('ref', Get(Ref(Collection('posts'), targetPostId))),
      title,
      content,
      created_at: Now(),
    };

    const post = await db.get().query(Create(Collection('comments'), { data }));
    res.send(post);
  } catch (e) {
    next(e);
  }
});

// // PUT post
// router.put('/', async (req, res) => {});

// // DELETE post
// router.delete('/', async (req, res) => {});

module.exports = router;
