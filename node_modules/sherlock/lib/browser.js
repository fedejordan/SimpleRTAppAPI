/*!
 * sherlock
 * Copyright(c) 2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * No Operation Constant
 */

var NOOP = function () {};

/*!
 * Primary Export
 */

module.exports = sherlock;

/**
 * ### Browser
 *
 * @param {String} namespace
 * @param {Boolean} force enable
 * @return {Function} log
 * @api public
 */

function sherlock (ns, enable) {
  if (!sherlock.enabled(ns) && !enable) return NOOP;
  var last, test;

  return function log (msg) {
    var time = new Date()
      , diff = last
        ? time.getTime() - last.getTime()
        : 0;

    msg = ''
      + ns
      + ' [' + diff + 'ms] '
      + msg;

    last = time;

    for (var i = 0; i < sherlock.stack.length; i++) {
      sherlock.stack[i].apply(null, arguments);
    }
  }
};

/*!
 * Allowed namespaces
 */

sherlock.allow = [];

/*!
 * Skipped namespaces
 */

sherlock.skip = []

/*!
 * Log stack
 */

sherlock.stack = [];

/**
 * #### .use (fn)
 *
 * Add a logging mechanism to the
 * display stack. A `console.log`
 * alternative is included by default.
 *
 * @param {Function} handle
 * @return {this} for chaining
 * @api public
 */

sherlock.use = function (fn) {
  if (fn.handle && 'function' === typeof fn.handle) {
    fn = fn.handle;
  }

  this.stack.push(fn);
  return this;
};

/**
 * #### .enable (namespace)
 *
 * Enable a namespace for display.
 *
 * @param {String} namespace shard
 * @return {this} for chaining
 * @api public
 */

sherlock.enable = function (ns) {
  (ns || '')
    .split(/[\s,]/g)
    .forEach(function (name) {
      var stack = name.charAt(0) === '-' ? 'skip' : 'allow';
      if ('skip' === stack) name = name.substr(1);
      name = name.replace(/\*/g, '(.*)');
      sherlock[stack].push(name);
    });

  return this;
};

/**
 * #### .enabled (namespace)
 *
 * Check to see if a namespace is
 * allowed to be display.
 *
 * @param {String} namespace
 * @return {Boolean} enabled
 * @api public
 */

sherlock.enabled = function (ns) {
  var allow = new RegExp('^(' + sherlock.allow.join('|') + ')$')
    , skip = new RegExp('^(' + sherlock.skip.join('|') + ')$');

  if (sherlock.skip.length && skip.test(ns)) {
    return false;
  } else if (sherlock.allow.length && allow.test(ns)) {
    return true;
  }

  return false;
};

/*!
 * Default `console.log` output
 */

sherlock.use(function () {
  window.console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
});

/*!
 * include `window.DEBUG`
 */

if (window.DEBUG) {
  sherlock.enable(window.DEBUG);
}

/*!
 * include `localStorage.debug`
 */

if (window.localStorage) {
  sherlock.enable(localStorage.debug);
}
