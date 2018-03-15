
process.env.DEBUG = '-pong:*,ping:*';

var sherlock = require('../..')
  , debug = sherlock('ping:name')
  , d2 = sherlock('pong:name')
  , i = 0
  , interval;

debug('skip me');

interval = setInterval(function () {
  debug('iteration %d', i++);
  if (i === 15) {
    clearInterval(interval);
    debug('done');
  }
}, 3);
