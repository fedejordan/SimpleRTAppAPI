var Buffers = require('bufs')
  , debug = require('sherlock')('lotus:decoder-stream')
  , inherits = require('util').inherits
  , Readable = require('stream').Readable;

/*!
 * Node 0.8.x compat
 */

if (!Readable) {
  debug('(bootstrap) using node 0.8 compat');
  Readable = require('readable-stream');
}

/*!
 * Primary Exports
 */

module.exports = DecoderStream;

function DecoderStream (id, handle) {
  Readable.call(this, { objectMode: true, highWaterMark: 1 });

  // settings
  this.id = id;
  this._handle = handle;
  this._finished = false;
  this._queue = [];
}

inherits(DecoderStream, Readable);

DecoderStream.prototype._nudge = function (bufs, cb) {
  var self = this
    , handle = this._handle
    , queue = this._queue;

  handle(bufs, function (err, msg) {
    if (err) return cb(err);
    debug('(queue) push');
    queue.push(msg);
    self.emit('_entry');
    cb();
  });
};

DecoderStream.prototype._finish = function () {
  this._finished = true;
  this.emit('_entry');
};

DecoderStream.prototype._read = function (n) {
  var queue = this._queue;

  // how to perform a read
  function read () {
    var queue = this._queue
      , item = queue.shift();

    // don't push null
    if (item) {
      debug('(read) push');
      this.push(item);
    }

    // handle if we are done
    if (this._finished && !queue.length) {
      debug('(read) end');
      this.push(null);
    }
  }

  // decide how best to handle current read scenario
  if (queue.length) {
    read.call(this);
  } else if (this._finished) {
    debug('(read) end');
    this.push(null);
  } else {
    debug('(read) waiting');
    this.once('_entry', read);
  }
};
