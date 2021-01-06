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
  Ref,
  Now,
  Create,
  Match,
  Index,
  Map,
} = faunadb.query;

// GET all users
router.get('/', async (_, res, next) => {
  // Lambda('user', Select('data', Get(Var('user'))))
  try {
    const users = await db.get().query(
      Map(
        Paginate(Documents(Collection('users'))),
        Lambda((user) => Get(user))
      )
    );
    res.send(users);
  } catch (e) {
    next(e);
  }
});

// GET user by id
router.get('/:id', async (req, res, next) => {
  try {
    const user = await db
      .get()
      .query(Get(Ref(Collection('users'), req.params.id)));

    res.send(user);
  } catch (e) {
    next(e);
  }
});

// GET posts by user
router.get('/:id/posts', async (req, res, next) => {
  try {
    const posts = await db.get().query(
      Map(
        Paginate(Match(Index('posts_by_user'), req.params.id)),
        Lambda((post) => Get(post))
      )
    );
    res.send(posts);
  } catch (e) {
    next(e);
  }
});

// GET comments by user
router.get('/:id/comments', async (req, res, next) => {
  try {
    const comments = await db
      .get()
      .query(Paginate(Match(Index('comments_by_user'), req.params.id)));
    res.send(comments);
  } catch (e) {
    next(e);
  }
});

// POST user
router.post('/', async (req, res, next) => {
  try {
    const data = {
      name: req.body.name,
      created_at: Now(),
    };

    const user = await db.get().query(Create(Collection('users'), { data }));
    res.send(user);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
