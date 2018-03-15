module.exports = process.env.LOTUS_COV
  ? require('./lib-cov/lotus')
  : require('./lib/lotus');
