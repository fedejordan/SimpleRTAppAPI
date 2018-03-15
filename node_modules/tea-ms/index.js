module.exports = process.env.ms_COV
  ? require('./lib-cov/ms')
  : require('./lib/ms');
