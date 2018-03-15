/*!
 * Module dependencies
 */

var lotus = require('../../');

/**
 * .decode
 *
 * @api public
 */

exports.decode = lotus.decode()
  .u16be('payloadLen')
  .take('payloadLen', 'payload', JSON.parse);

/**
 * .encode
 *
 * @api public
 */

exports.encode = lotus.encode()
  .u16be(function (msg) {
    var payload = JSON.stringify(msg.payload);
    return Buffer.byteLength(payload, 'utf8');
  })
  .write('payload', 'utf8', JSON.stringify);
