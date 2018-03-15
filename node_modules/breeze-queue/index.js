module.exports = process.env.queue_COV
  ? require('./lib-cov/queue')
  : require('./lib/queue');
