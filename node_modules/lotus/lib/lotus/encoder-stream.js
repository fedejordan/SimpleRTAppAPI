
var Buffers = require('bufs')
  , debug = require('sherlock')('lotus:encoder-stream')
  , inherits = require('util').inherits
  , Writable = require('stream').Writable;

/*!
 * Node 0.8.x compat
 */

if (!Writable) {
  debug('(bootstrap) using node 0.8 compat');
  Writable = require('readable-stream/writable');
}

/*!
 * Primary Exports
 */

module.exports = EncoderStream;

function EncoderStream (id, dsl) {
  Writable.call(this, { objectMode: true, highWaterMark: 1 });

  // settings
  this.headerid = id;
  this.dsl = dsl;
}

/*!
 * Inherit from Writable Stream
 */

inherits(EncoderStream, Writable);

EncoderStream.prototype._write = function (obj, enc, next) {
  debug('(write) [%d]', this.headerid);

  var self = this
    , bufs = new Buffers()
    , dsl =  this.dsl
    , id = this.headerid;

  if (id !== -1) {
    bufs.push(new Buffer([ id ]));
  }

  dsl(obj, function (err, res) {
    if (err) return next(err);
    bufs.push(res);
    debug('(write) [%d] entry: %d bytes', id, bufs.length);
    self.emit('entry', bufs.slice());
    next();
  });
};
