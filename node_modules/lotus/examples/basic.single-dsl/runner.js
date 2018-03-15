/*!
 * Module dependancies
 */

var lotus = require('../..');

/*!
 * Import protocols
 */

var dsl = require('./dsl')

/*!
 * Example streams
 */

var decoder = lotus.createDecoder()
  , encoder = lotus.createEncoder();

/*!
 * Setup protocols for incoming stream
 */

var incoming = decoder.stream(dsl.decode);

/*!
 * Setup protocols for outgoing stream
 */

var outgoing = encoder.stream(dsl.encode);

/*!
 * Simple piping demo
 */

encoder.pipe(decoder);

/*!
 * Log it
 */

incoming.on('readable', function () {
  var msg = incoming.read();
  console.log('receive:', msg.payload);
});

/*!
 * Done with everything listener
 */

encoder.on('close', function () {
  console.log('encoding done');
});

decoder.on('close', function () {
  console.log('decoding done');
});

/*!
 * Actually write data
 */

var data = require('./data');

process.nextTick(function () {
  data.forEach(function (em) {
    outgoing.write({ payload: em });
  });

  outgoing.end();
});
