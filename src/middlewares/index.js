const notFound = (req, res, next) => {
  res.status(404);
  const error = new Error(`Not Found - ${req.originalUrl}`);
  next(error);
};

/* eslint-disable no-unused-vars */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.requestResult
    ? err.requestResult.statusCode
    : res.statusCode;
  res.status(statusCode);
  res.send(err);
};

module.exports = {
  notFound,
  errorHandler,
};
