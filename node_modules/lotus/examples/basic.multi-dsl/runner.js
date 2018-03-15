/*!
 * Module dependencies
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

var incoming1 = decoder.stream(1, dsl.decode)
  , incoming2 = decoder.stream(2, dsl.decode);

/*!
 * Setup protocols for outgoing stream
 */

var outgoing1 = encoder.stream(1, dsl.encode)
  , outgoing2 = encoder.stream(2, dsl.encode);

/*!
 * Simple piping demo
 */

encoder.pipe(decoder);

/*!
 * Log it
 */

incoming1.on('readable', function () {
  var msg = incoming1.read();
  console.log('receive [1]:', msg.payload);
});

incoming2.on('readable', function () {
  var msg = incoming2.read();
  console.log('receive [2]:', msg.payload);
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

setTimeout(function () {
  outgoing1.write({ payload: data[0] });
  outgoing1.write({ payload: data[1] });
  outgoing2.write({ payload: data[0] });
}, 5);

setTimeout(function () {
  outgoing2.write({ payload: data[1] });
  outgoing1.write({ payload: data[2] });
  outgoing1.end();
}, 10);

setTimeout(function () {
  outgoing2.write({ payload: data[2] });
  outgoing2.end();
}, 15);
