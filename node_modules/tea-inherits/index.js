module.exports = process.env.inherits_COV
  ? require('./lib-cov/inherits')
  : require('./lib/inherits');
