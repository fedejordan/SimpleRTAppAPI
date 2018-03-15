
process.env.DEBUG = 'colors:*';

var sherlock = require('../..')
  , c = []
  , i = 0;

for (; i < 12; i++) {
  c.push(sherlock('colors:' + i));
}

c.forEach(function (color) {
  color('testing');
});
