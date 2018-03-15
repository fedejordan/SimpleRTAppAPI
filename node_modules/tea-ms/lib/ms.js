/*!
 * tea-ms
 * Copyright(c) 2013 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * Conversion Constants
 */

var _ = {};
_.ms = 1;
_.s = 1000;
_.m = _.s * 60;
_.h = _.m * 60;
_.d = _.h * 24;

/*!
 * Primary Exports
 */

var exports = module.exports = ms;

/**
 * Allows for easily converting of timed strings
 * to milliseconds. Suports ms, s, m, h, d. Can
 * also use the `+` and `-` modifier to get a
 * timestamp in ms from the current time.
 *
 * ```js
 * var ms = require('tea-ms')
 *   , ten = ms('10s'); // 10 seconds
 *   , ften = ms('+10s'); // 10 seconds in the future
 * ```
 *
 * @param {String|Number} number of ms, or time format
 * @returns {Number} ms or time
 * @api public
 */

function ms (s) {
  if (+s) return +s;
  var r = /^([-+]?)((?:\d*\.)?\d+)([mshd]+)$/
    , n = new Date().getTime()
    , m = r.exec(s.toLowerCase())
    , o = m
        ? m[2] * _[m[3]]
        : null;

  return null !== o && m[1].length
    ? (m[1] === '+'
      ? n + o
      : n - o)
    : o;
};

/**
 * .unix (string)
 *
 * Quickly get a timestamp in epoch seconds from a given
 * valid `ms` input. Unless you specify `-` as the first character
 * of the string, `.unix()` assumes you want a timestamp in the future.
 * No arguments will yield the unix timestamp for now.
 *
 * @param {String|Number} number of ms, or time format
 * @returns {Number} unix timestamp
 * @api public
 */

exports.unix = function (s) {
  s = s || '0s';
  var n = '+' === s.charAt(0) || '-' == s.charAt(0)
    ? ms(s)
    : ms('+' + s);
  return Math.round(n / _.s);
};
