const express = require('express');
const faunadb = require('faunadb');

const db = require('../database');

const router = express.Router();

const {
  Paginate,
  Collection,
  Lambda,
  Get,
  Update,
  Delete,
  Ref,
  Now,
  Create,
  Match,
  Index,
  Map,
} = faunadb.query;

// GET all posts
router.get('/', async (_, res, next) => {
  try {
    const { data } = await db.get().query(
      Map(
        Paginate(Match(Index('all_posts'))),
        Lambda((post) => Get(post))
      )
    );
    res.send(data);
  } catch (e) {
    next(e);
  }
});

// GET post by id
router.get('/:id', async (req, res, next) => {
  try {
    const post = await db
      .get()
      .query(Get(Ref(Collection('posts'), req.params.id)));

    res.send(post);
  } catch (e) {
    next(e);
  }
});

// GET comments by post
router.get('/:id/comments', async (req, res, next) => {
  try {
    const { data } = await db.get().query(
      Map(
        Paginate(Match(Index('comments_by_post'), req.params.id)),
        Lambda((comment) => Get(comment))
      )
    );
    res.send(data);
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
      postAuthor: Ref(Collection('users'), postAuthorId),
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

// PUT post
router.put('/:id', async (req, res, next) => {
  const { title, content } = req.body;

  try {
    const data = {
      title,
      content,
    };

    const post = await db
      .get()
      .query(Update(Ref(Collection('posts'), req.params.id), { data }));
    res.send(post);
  } catch (e) {
    next(e);
  }
});

// DELETE post
router.delete('/:id', async (req, res, next) => {
  try {
    const post = await db
      .get()
      .query(Delete(Ref(Collection('posts'), req.params.id)));
    res.send(post);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
