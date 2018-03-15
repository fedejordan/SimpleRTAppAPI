/*!
 * sherlock
 * Copyright(c) 2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * No Operation Constant
 */

var COLORS = [ 1, 2, 3, 4, 5, 6 ]
  , NOOP = function () {}
  , TTY = require('tty').isatty(2);

var count = 1;

/*!
 * Primary Export
 */

module.exports = sherlock;

/**
 * ### Node
 *
 * @param {String} namespace
 * @param {Boolean} force enable
 * @return {Function} log
 * @api public
 */

function sherlock (ns, enable) {
  if (!sherlock.enabled(ns) && !enable) return NOOP;
  var color = COLORS[count++ % COLORS.length]
    , last, test;

  // Colorized output for ttys
  function colorize (msg) {
    var time = new Date()
      , diff = last
        ? time.getTime() - last.getTime()
        : 0;

    msg = ''
      + '  \033[9' + color + 'm' + ns + '\033[0m'
      + ' ' + diff + 'ms'
      + ' \033[90m' + msg + '\033[0m';

    last = time;

    for (var i = 0; i < sherlock.stack.length; i++) {
      sherlock.stack[i].apply(null, arguments);
    }
  }

  // Plaintext output for non-ttys
  function log (msg) {
    var time = new Date()
      , diff = last
        ? time.getTime() - last.getTime()
        : 0;

    msg = ''
     + ns
     + ' [' + diff + 'ms]'
     + ' ' + msg;

    last = time;

    for (var i = 0; i < sherlock.stack.length; i++) {
      sherlock.stack[i].apply(null, arguments);
    }
  }

  // return env compatible
  return TTY ? colorize : log;
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
  console.warn.apply(console.warn, arguments);
});

/*!
 * include `process.env.DEBUG`
 */

if (process.env.DEBUG) {
  sherlock.enable(process.env.DEBUG);
}
