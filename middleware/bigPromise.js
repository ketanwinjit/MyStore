/**
 * ! HERE USE TRY / CATCH AND ASYNC / AWAIT || USE PROMISE
 */

module.exports = (func) => (req, res, next) =>
  Promise.resolve(func(req, res, next)).catch(next);
