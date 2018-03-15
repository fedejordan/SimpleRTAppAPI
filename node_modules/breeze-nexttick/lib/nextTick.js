/*!
 * Breeze - process.nextTick browser shim
 * Copyright(c) 2012 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

module.exports = 'function' === typeof setImmediate
  ? setImmediate
  : process.nextTick;
