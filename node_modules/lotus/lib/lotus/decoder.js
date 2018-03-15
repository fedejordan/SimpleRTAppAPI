var Buffers = require('bufs')
  , debug = require('sherlock')('lotus:decoder')
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
 * Internal Dependencies
 */

var DecoderStream = require('./decoder-stream');

/*!
 * Primary Exports
 */

module.exports = Decoder;

function Decoder () {
  Writable.call(this);
  var self = this;

  // settings / storage
  this._init = false;
  this._singleStream = false;

  // internal storage
  this._nudge = this._nudge.bind(this);
  this._store = new Buffers();
  this._store.once('push', this._nudge);
  this._streams = Object.create(null);

  this.once('finish', function () {
    self._store.emit('push');
  });
}

inherits(Decoder, Writable);

Decoder.prototype.stream = function (id, dsl) {
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
    err = new Error('Cannot convert Decoder to use multiple DSLs.');
  } else if (Object.keys(this._streams).length && id === -1) {
    err = new Error('Cannot convert Decoder to use single DSL.');
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
  stream = this._streams[id] = new DecoderStream(id, dsl);

  // set init
  this._init = true;

  // notify
  debug('(stream) %d', id);
  this.emit('stream', stream);

  // return our new stream
  return stream;
};

Decoder.prototype._nudge = function () {
  var self = this
    , state = this._writableState
    , store = this._store
    , id, stream;

  // handle any errors
  function error (err) {
    debug('(nudge) error: ', err.message);
    self.emit('error', err);
  }

  // logic for handling preparing next nudge
  function next (err) {
    if (err) return error(err);

    if (store.length) {
      process.nextTick(self._nudge);
    } else if (!store.length && state.finished) {
      self._close();
    } else {
      store.once('push', self._nudge);
    }
  }

  // if empty, move on
  if (!store.length) {
    return next();
  }

  // extract stream id
  id = !this._singleStream
    ? store.splice(0, 1).at(0)
    : -1;
  stream = this._streams[id];

  // handle no definition
  if (!stream) {
    return error(new Error('DecoderStream ' + id + ' not implemented.'));
  }

  // inform stream extract
  stream._nudge(store, next);
};

Decoder.prototype._write = function (_buf, enc, next) {
  if (!this._init) {
    debug('(write) waiting');
    return this.once('stream', function () {
      this._write(_buf, enc, next);
    });
  }

  debug('(write) %d bytes', _buf.length);
  this._store.push(_buf);
  next();
};

Decoder.prototype._close = function () {
  debug('(close) start');

  var self = this
    , streams = this._streams
    , store = this._store
    , keys = Object.keys(streams)
    , len = keys.length
    , i = 0
    , key, stream;

  if (store.length) return;

  function close (id) {
    return function () {
      debug('(close) [%d] complete', id);
      delete streams[id];
      --len || done();
    }
  }

  function done () {
    debug('(close) done');
    self.emit('close');
  }

  if (!keys.length) return done();

  for (; i < keys.length; i++) {
    key = keys[i];
    debug('(close) [%d] invoke', key);
    stream = streams[key];
    stream.once('end', close(key));
    stream._finish();
  }
};
