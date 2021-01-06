const faunadb = require('faunadb');

let client;

const connect = (callback) => {
  client = new faunadb.Client({
    secret: process.env.FAUNA_SECRET,
  });
  callback();
};

const get = () => client;

module.exports = {
  get,
  connect,
};
