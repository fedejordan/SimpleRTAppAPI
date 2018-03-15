module.exports = process.env.extend_COV
  ? require('./lib-cov/extend')
  : require('./lib/extend');
