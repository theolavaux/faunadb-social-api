const express = require('express');
const faunadb = require('faunadb');
const joi = require('joi');

const db = require('../database');

const router = express.Router();

const {
  Paginate,
  Collection,
  Get,
  Update,
  Delete,
  Ref,
  Now,
  Create,
  Match,
  Index,
  Map,
  Drop,
  Intersection,
} = faunadb.query;

// GET all posts
router.get('/', async (_, res, next) => {
  try {
    const { data } = await db
      .get()
      .query(Map(Paginate(Match(Index('all_posts'))), (post) => Get(post)));
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
    const limit = parseInt(req.query.limit, 10);
    const offset = parseInt(req.query.offset, 10) || 0;

    const { commentAuthor, title, content } = req.query;

    let size;
    if (!limit) {
      size = undefined;
    } else if (!offset) {
      size = limit;
    } else {
      size = limit + offset;
    }

    const matches = [];

    matches.push(Match(Index('comments_by_post'), req.params.id));
    if (commentAuthor) {
      matches.push(Match(Index('comments_by_user'), commentAuthor));
    }
    if (title) {
      matches.push(Match(Index('comments_by_title'), title));
    }
    if (content) {
      matches.push(Match(Index('comments_by_content'), content));
    }

    const { data } = await db.get().query(
      Map(
        Drop(
          offset,
          Paginate(Intersection(matches), {
            size,
          })
        ),
        (comment) => Get(comment)
      )
    );
    res.send(data);
  } catch (e) {
    next(e);
  }
});

// POST post
router.post('/', async (req, res, next) => {
  const body = await joi
    .object({
      postAuthor: joi.string().trim().required().min(1),
      title: joi.string().trim().required().min(1),
      content: joi.string().trim().required().min(1),
    })
    .validateAsync(req.body, { abortEarly: false });

  const { postAuthor, title, content } = body;

  try {
    const data = {
      postAuthor: Ref(Collection('users'), postAuthor),
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
