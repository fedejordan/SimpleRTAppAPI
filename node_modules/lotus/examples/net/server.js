/*!
 * Module dependencies
 */

var lotus = require('../..')
  , net = require('net')
  , port = process.env.PORT || 8124;

/*!
 * Import codec
 */

var codec = require('./codec')
  , client = -1;

/*!
 * Create a server with connection listener
 */

var server = net.createServer(function (sock) {
  // unique id for connection
  sock.name = 'sock:' + (++client);
  console.log('(%s) connected', sock.name);

  // create decoder for each socket
  var decoder = lotus.createDecoder()
    , ev0 = decoder.stream(0, codec.decode)
    , ev1 = decoder.stream(1, codec.decode);

  // listen for event 0
  ev0.on('readable', function () {
    var msg = ev0.read();
    console.log('(%s) [event 0]: %j', sock.name, msg.payload);
  });

  // listen for event 1
  ev1.on('readable', function () {
    var msg = ev1.read();
    console.log('(%s) [event 1]: %j', sock.name, msg.payload);
  });

  // handle disconnect
  sock.on('end', function () {
    console.log('(%s) disconnect', sock.name);
  });

  // handle close (automatic when socket ends and all data parsed)
  decoder.on('close', function () {
    console.log('(%s) decoder close', sock.name);
  });

  // pipe to decoder
  sock.pipe(decoder);
});

/*!
 * Start the server
 */

server.listen(port, function () {
  console.log('server started on port %d', server.address().port);
});
