/*!
 * Lotus
 * Copyright(c) 2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * Internal dependancies
 */

var DecoderDSL = require('./lotus/decoder-dsl')
  , Decoder = require('./lotus/decoder')
  , EncoderDSL = require('./lotus/encoder-dsl')
  , Encoder = require('./lotus/encoder');

/*!
 * Module version
 */

exports.version = '1.0.1';

/*!
 * Constructors
 */

exports.DecoderDSL = DecoderDSL;
exports.Decoder = Decoder;
exports.EncoderDSL = EncoderDSL;
exports.Encoder = Encoder;

/*!
 * Factories
 */

exports.decode = function () {
  return new DecoderDSL();
};

exports.createDecoder = function () {
  return new Decoder();
};

exports.encode = function () {
  return new EncoderDSL();
};

exports.createEncoder = function () {
  return new Encoder();
};
