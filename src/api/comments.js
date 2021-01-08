const express = require('express');
const faunadb = require('faunadb');
const joi = require('joi');

const db = require('../database');

const router = express.Router();

const {
  Paginate,
  Collection,
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
    const { data } = await db
      .get()
      .query(
        Map(Paginate(Match(Index('all_comments'))), (comment) => Get(comment))
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
  const body = await joi
    .object({
      commentAuthor: joi.string().trim().required().min(1),
      targetPost: joi.string().trim().required().min(1),
      title: joi.string().trim().required().min(1),
      content: joi.string().trim().required().min(1),
    })
    .validateAsync(req.body, { abortEarly: false });

  const { commentAuthor, targetPost, title, content } = body;

  try {
    const data = {
      commentAuthor: Ref(Collection('users'), commentAuthor),
      targetPost: Ref(Collection('posts'), targetPost),
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
  const body = await joi
    .object({
      title: joi.string().min(1),
      content: joi.string().min(1),
    })
    .or('title', 'content')
    .validateAsync(req.body, { abortEarly: false });

  const { title, content } = body;

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
