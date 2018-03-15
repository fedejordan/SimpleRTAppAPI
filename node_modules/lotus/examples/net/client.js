/*!
 * Module dependencies
 */

var lotus = require('../..')
  , net = require('net')
  , port = process.env.PORT || 8124;


/*!
 * Import codec
 */

var codec = require('./codec');

/*!
 * Create encoder
 */

var encoder = lotus.createEncoder()
  , ev0 = encoder.stream(0, codec.encode)
  , ev1 = encoder.stream(1, codec.encode);

/*!
 * Timers
 */

var time1, time2;

/*!
 * Start sending data on connect
 */

function start () {
  time1 = setInterval(function () {
    var msg = { hello: 'world ' + Math.floor(Math.random() * 100) };
    console.log('[event 0] %j', msg);
    ev0.write({ payload: msg });
  }, Math.floor(Math.random() * 2000) || 100);

  time2 = setInterval(function () {
    var msg = { hello: 'universe ' + Math.floor(Math.random() * 100) };
    console.log('[event 1] %j', msg);
    ev1.write({ payload: msg });
  }, Math.floor(Math.random() * 2000) || 100);
}

/*!
 * How to stop
 */

function stop () {
  clearInterval(time1);
  clearInterval(time2);
  encoder.close();
}

/*!
 * Create client
 */

var client = net.connect(port, start);

/*!
 * Pipe from encoder. Closing encoder will close client.
 */

encoder.pipe(client);

/*!
 * Listen for close
 */

client.on('close', function () {
  console.log('disconnected');
  process.exit(0);
});

/*!
 * Listen for graceful shutdown instruction
 */

process.on('SIGINT', function () {
  console.log('\nstarting graceful disconnect');
  stop();
});
