module.exports = process.env.BUFS_COV
  ? require('./lib-cov/bufs')
  : require('./lib/bufs');
