module.exports = process.env.async_COV
  ? require('./lib-cov/async')
  : require('./lib/async');
