/*!
 * Buffers
 * Copyright(c) 2012 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * External dependancies
 */

var EventEmitter = require('events').EventEmitter
  , util = require('util');

/*!
 * Primary Export
 */

module.exports = Buffers;

/**
 * ### Buffers
 *
 *
 */

function Buffers () {
  EventEmitter.call(this);
  this.buffers = [];
}

/*!
 * Inherits from EventEmitter
 */

util.inherits(Buffers, EventEmitter);

/**
 * #### .length
 *
 * Property that gets the total length of all
 * buffers currently in this buffer collection
 *
 * @returns {Number}
 * @api public
 */

Object.defineProperty(Buffers.prototype, 'length',
  { get: function () {
      return this.buffers.reduce(function (s, buf) {
        return s + buf.length;
      }, 0);
    }
});

/**
 * #### .push(buf[, buf, ...])
 *
 * Push a buffer or multiple buffers into this
 * buffer collection. Will emit the `push` event
 * for each buffer pushed.
 *
 *     bufs.push(new Buffer([ 1, 2, 3 ]);
 *
 * @param {Buffer} buffer push
 * @returns this.length
 * @api public
 */

Buffers.prototype.push = function () {
  for (var i = 0; i < arguments.length; i++) {
    var buf = arguments[i];
    this.buffers.push(buf);
    this.emit('push', buf);
  }

  return this.length;
};

/**
 * #### .slice ([start], [end])
 *
 * Similiar to `Buffer.slice`, will return
 * a new buffer that includes all data within
 * the bounds specified.
 *
 *     var buf = bufs.slice(2, 5);
 *
 * @param {Number} start _optional_, default 0
 * @param {Number} end _optional_, default length
 * @returns {Buffer}
 * @api public
 */

Buffers.prototype.slice = function (a, b) {
  // sane defaults
  if (undefined === a) a = 0;
  if (undefined === b) b = this.length;
  if (b > this.length) b = this.length;

  var bufs = this.buffers
    , pos = 0
    , res = new Buffer(b - a)
    , start = findStart(bufs, a);

  // extract needed buffer parts
  for (var x = start.i; pos < b - a && x < bufs.length; x++) {
    var len = bufs[x].length
      , from = pos === 0
        ? a - start.bytes
        : 0
      , to = pos + len >= b - a
        ? Math.min(from + (b - a) - pos, len)
        : len;
    bufs[x].copy(res, pos, from, to);
    pos += to - from;
  }

  // return new buffer
  return res;
};

/**
 * #### .splice (start[, howMany])
 *
 * Similiar to `Array.splice`, will remove and
 * return a subsection of bytes from this buffer
 * collection.
 *
 * @param {Number} start
 * @param {Number} how many _optional_, default end
 * @returns {Buffers} buffers collection
 * @api public
 */

Buffers.prototype.splice = function (a, b) {
  var bufs = this.buffers
    , ind = a < 0
      ? this.length - a
      : a
    , res = new Buffers()
    , start = findStart(bufs, a)
    , pos = 0;

  // sane default
  if (undefined === b || b > this.length - ind) {
    b = this.length - ind;
  }

  // begin extraction
  for (var x = start.i; pos < b && x < bufs.length; x++) {
    var len = bufs[x].length
      , from = pos === 0
        ? ind - start.bytes
        : 0
      , to = pos + len >= b
        ? Math.min(from + b - pos, len)
        : len
      , buf = bufs[x].slice(from, to)

    // handle removal
    if (from > 0 && to === len) {
      var buf0 = bufs[x].slice(0, from);
      bufs[x] = buf0;
    } else if (from === 0 && to === len) {
      bufs[x] = null;
    } else if (from === 0 && to < len) {
      var buf0 = bufs[x].slice(to, len);
      bufs[x] = buf0;
    }

    // add to result
    res.push(buf);
    pos += buf.length;
  }

  // remove empty buffers
  for (var i = 0; i < bufs.length; i++) {
    if (bufs[i] === null) {
      bufs.splice(i, 1);
      i--;
    }
  }

  return res;
};

/*!
 * findStart (bufs, from)
 *
 * Determine which array in the buffers to start
 * on given a `from` byte point.
 *
 * @param {Array} buffer array
 * @param {Number} byte start point
 * @returns {Object} result
 * @api private
 */

function findStart (bufs, a) {
  var start = 0;

  for (var i = 0; i < bufs.length && start + bufs[i].length <= a; i++) {
    start += bufs[i].length;
  }

  return { i: i, bytes: start };
}

/**
 * #### .at(n)
 *
 * Return the byte at the given location
 * within this buffer collection.
 *
 * @param {Number} position
 * @returns {Binary}
 * @api public
 */

Buffers.prototype.at = function (n) {
  var bufs = this.slice();
  return bufs[n];
};
