
var Buffers = require('bufs')
  , debug = require('sherlock')('lotus:encoder')
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
 * Internal Dependencies
 */

var EncoderStream = require('./encoder-stream');

/*!
 * Primary Exports
 */

module.exports = Encoder;

function Encoder () {
  Readable.call(this);

  // settings / storage
  this._init = false;
  this._singleStream = false;

  // internal storage
  this._streams = Object.create(null);
  this._store = new Buffers();

  this.on('end', this.close);
}

/*!
 * Inherit from Readable Stream
 */

inherits(Encoder, Readable);

Encoder.prototype.stream = function (id, dsl) {
  // possibly convert to single stack
  if ('number' !== typeof id) {
    dsl = id;
    id = -1;
  }

  // construct stream
  var self = this
    , stream = this._streams[id]
    , err;

  // stop if stream already exists
  if (stream) return stream;

  // check to ensure not already tagged as single stack
  if (this._singleStream && arguments.length > 1) {
    err = new Error('Cannot convert Encoder to use multiple DSLs.');
  } else if (Object.keys(this._streams).length && id === -1) {
    err = new Error('Cannot convert Encoder to use single DSL.');
  }

  // bail if an error
  if (err) return this.emit('error', err);

  // return null for getter
  if (!dsl) return null;

  // convert dsl object to simple function with handle
  if (dsl.handle && 'function' === typeof dsl.handle) {
    dsl = dsl.handle;
  }

  // convert to single stack
  if (id === -1) {
    this._singleStream = true;
  }

  // construct stream
  stream = this._streams[id] = new EncoderStream(id, dsl);

  // listen for entries
  stream.on('entry', function (buf, end) {
    debug('(stream) [%d] entry: %d bytes', id, buf.length);
    self._store.push(buf);
    self.read(0);
  });

  // listen for writer ends
  stream.once('finish', function () {
    debug('(stream) [%d] finish', id);
    delete self._streams[id];
    self.read(0);
  });

  // set init
  this._init = true;

  // notify
  debug('(stream) %d', id);
  this.emit('stream', stream);

  // return our new stream
  return stream;
};

Encoder.prototype._read = function (n) {
  var store = this._store
    , streams = Object.keys(this._streams).length
    , buf, max;

  if (this._init && !store.length && streams === 0) {
    debug('(read) end');
    return this.push(null);
  }

  if (store.length && n > 0) {
    max = n < store.length ? n : store.length;
    debug('(read) push: %d bytes', max);
    buf = store.splice(0, max).slice();
    this.push(buf);
  } else {
    this.push('');
  }
};

Encoder.prototype.close = function (cb) {
  var self = this
    , store = this._store
    , streams = this._streams
    , keys = Object.keys(this._streams)
    , i = 0
    , key, stream;

  if (cb) {
    this.once('close', cb);
  }

  if (keys.length > 0) {
    debug('(close) start');
    for (; i < keys.length; i++) {
      key = keys[i];
      debug('(close) [%d] invoke', key);
      stream = streams[key];
      stream.end();
    }
  } else {
    process.nextTick(function () {
      debug('(close) done');
      self.emit('close');
    });
  }
};
