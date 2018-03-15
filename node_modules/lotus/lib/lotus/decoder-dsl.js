/*!
 * Lotus - DecoderDSL Dsl
 * Copyright(c) 2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * Module dependancies
 */

var Buffers = require('bufs');

/*!
 * Primary export
 */

module.exports = DecoderDSL;

function DecoderDSL () {
  this.stack = [];
  this.handle = this.handle.bind(this);
}

/**
 * .handle (bufs, done)
 *
 * @param {Buffers} buffer queue
 * @param {Function} done callback
 * @name handle
 * @api public
 */

DecoderDSL.prototype.handle = function (raw, done) {
  var self = this
    , msg = {}
    , bufs;

  // convert node buffer to Buffers
  if (raw instanceof Buffer) {
    bufs = new Buffers();
    bufs.push(raw);
  } else {
    bufs = raw;
  }

  // iterate through the stack
  function iterate (i) {
    var line = self.stack[i];
    if (!line) return done(null, msg);
    line(msg, bufs, function (err) {
      if (err) return done(err);
      iterate(++i);
    });
  }

  iterate(0);
};

/**
 * .take (length, property[, decode])
 *
 * @param {Number|String} length or length reference
 * @param {String} as property in final message
 * @param {Function} decode (optional)
 * @returns {this} for chaining
 * @name end
 * @api public
 */

DecoderDSL.prototype.take = function (len, as, decode) {
  var fn = buildTake(len, as, decode);
  this.stack.push(fn);
  return this;
};

/*!
 * buildTake (len, prop, decode)
 *
 * Wrap the take function for insertion into
 * the reader stack.
 *
 * @param {Number|String} length or length reference
 * @param {String} as property in final message
 * @param {Function} decode (optional)
 * @returns {Function} stackable
 * @api private
 */

function buildTake (len, as, decode) {
  return function (msg, bufs, next) {
    var bytes = 'string' === typeof len
      ? msg[len]
      : len;

    waitFor(bytes, bufs, function (err, res) {
      if (err) return next(err);
      msg[as] = decode && 'function' === typeof decode
        ? decode(res)
        : res;
      next();
    });
  }
}

/**
 * #### Read Integers
 *
 * Allows for reading of integers based on signedness
 * and endianness.
 *
 * - u8
 * - u16le
 * - u16be
 * - u32le
 * - u32be
 * - s8
 * - s16le
 * - s16be
 * - s32le
 * - s32be
 *
 * @param {String} property
 * @param {Function} decoder (optional)
 * @returns {this} for chaining
 * @name Integer
 * @api public
 */

// unsigned 8 bit
DecoderDSL.prototype.u8 = function (prop, decode) {
  var fn = buildBytes(1, 'readUInt8', prop, decode);
  this.stack.push(fn);
  return this;
};

// signed 8 bit
DecoderDSL.prototype.s8 = function (prop, decode) {
  var fn = buildBytes(1, 'readInt8', prop, decode);
  this.stack.push(fn);
  return this;
};

// 2, 4 bytes === 16, 32 bits
[ 2, 4 ].forEach(function (bytes) {
  var bits = bytes * 8
    , proto = DecoderDSL.prototype

  // unsigned big endiant (16, 32)
  proto['u' + bits + 'be'] = function (prop, decode) {
    var fn = buildBytes(bytes, 'readUInt' + bits + 'BE', prop, decode);
    this.stack.push(fn);
    return this;
  };

  // unsigned little endiant (16, 32)
  proto['u' + bits + 'le'] = function () {
    var fn = buildBytes(bytes, 'readUInt' + bits + 'LE', prop, decode);
    this.stack.push(fn);
    return this;
  };

  // signed big endiant (16, 32)
  proto['s' + bits + 'be'] = function () {
    var fn = buildBytes(bytes, 'readInt' + bits + 'BE', prop, decode);
    this.stack.push(fn);
    return this;
  };

  // signed little endiant (16, 32)
  proto['s' + bits + 'le'] = function () {
    var fn = buildBytes(bytes, 'readInt' + bits + 'LE', prop, decode);
    this.stack.push(fn);
    return this;
  };
});

/*!
 * buildBytes (bytes, signed, endian, property, decode)
 *
 * Wrap the integer byte function for insertion
 * into the reader stack.
 *
 * @param {Number} bytes to collection
 * @param {String} signed :: `S` or `U`
 * @param {String} endian :: `BE` or `LE`
 * @param {String} property of message to write
 * @param {Function} decoder (optional)
 * @returns {Function} stackable
 * @api private
 */

function buildBytes (bytes, op, as, decode) {
  return function (msg, bufs, next) {
    waitFor(bytes, bufs, function (err, res) {
      if (err) return next(err);
      var int = res[op](0)
      msg[as] = decode && 'function' === typeof decode
        ? decode(int)
        : int;
      next();
    });
  }
}

/*!
 * waitFor (n, buffers, cb)
 *
 * Wait for the buffers queue to have a length
 * of n, then splice of n bytes from the begining
 * and return in the callback.
 *
 * @param {Number} bytes
 * @param {Buffers} buffer queue
 * @param {Function} callback
 * @cb {Error} or null
 * @cb {Buffer} result
 * @api private
 */

function waitFor (n, bufs, cb) {
  function check () {
    if (bufs.length < n) {
      return bufs.once('push', check);
    } else {
      var res = bufs.splice(0, n).slice();
      cb(null, res);
    }
  }

  check();
}
