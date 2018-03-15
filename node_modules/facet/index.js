module.exports = process.env.facet_COV
  ? require('./lib-cov/facet')
  : require('./lib/facet');
