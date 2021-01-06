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
  Match,
  Index,
} = faunadb.query;

// GET all posts
router.get('/', async (_, res, next) => {
  try {
    const posts = await db.get().query(
      Map(
        Paginate(Documents(Collection('posts'))),
        Lambda((x) => Get(x))
      )
    );
    res.send(posts);
  } catch (e) {
    next(e);
  }
});

// GET comments by post
router.get('/:id/comments', async (req, res, next) => {
  try {
    const comments = await db
      .get()
      .query(Paginate(Match(Index('comments_by_post'), req.params.id)));
    res.send(comments);
  } catch (e) {
    next(e);
  }
});

// + query and pagination

// POST post
router.post('/', async (req, res, next) => {
  const { postAuthorId, title, content } = req.body;

  try {
    const data = {
      postAuthor: Select('ref', Get(Ref(Collection('users'), postAuthorId))),
      title,
      content,
      created_at: Now(),
    };

    const post = await db.get().query(Create(Collection('posts'), { data }));
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
