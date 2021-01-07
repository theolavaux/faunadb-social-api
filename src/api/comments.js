const express = require('express');
const faunadb = require('faunadb');

const db = require('../database');

const router = express.Router();

const {
  Paginate,
  Collection,
  Lambda,
  Get,
  Ref,
  Now,
  Match,
  Index,
  Create,
  Map,
  Update,
  Delete,
} = faunadb.query;

// GET all comments
router.get('/', async (_, res, next) => {
  try {
    const { data } = await db.get().query(
      Map(
        Paginate(Match(Index('all_comments'))),
        Lambda((comment) => Get(comment))
      )
    );
    res.send(data);
  } catch (e) {
    next(e);
  }
});

// GET comment by id
router.get('/:id', async (req, res, next) => {
  try {
    const comment = await db
      .get()
      .query(Get(Ref(Collection('comments'), req.params.id)));

    res.send(comment);
  } catch (e) {
    next(e);
  }
});

// POST comment
router.post('/', async (req, res, next) => {
  const { commentAuthorId, targetPostId, title, content } = req.body;

  try {
    const data = {
      commentAuthor: Ref(Collection('users'), commentAuthorId),
      targetPost: Ref(Collection('posts'), targetPostId),
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

// PUT comment
router.put('/:id', async (req, res, next) => {
  const { title, content } = req.body;

  try {
    const data = {
      title,
      content,
    };

    const comment = await db
      .get()
      .query(Update(Ref(Collection('comments'), req.params.id), { data }));
    res.send(comment);
  } catch (e) {
    next(e);
  }
});

// DELETE comment
router.delete('/:id', async (req, res, next) => {
  try {
    const comment = await db
      .get()
      .query(Delete(Ref(Collection('comments'), req.params.id)));
    res.send(comment);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
