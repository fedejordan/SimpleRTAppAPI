/*!
 * Breeze Async - Flow Control Utility
 * Copyright(c) 2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * Helpers
 */

var noop = function () {}
  , slice = Array.prototype.slice;

/**
 * ### .forEach (array, iterator, done)
 *
 * Apply an iterator to each item in an array
 * in parellel. Execute a callback when all items
 * have been completed or immediately if there is
 * an error provided.
 *
 * ```js
 * async.forEach([ 1, 2, 3 ], function (i, next) {
 *   setTimeout(function () {
 *     console.log(i);
 *     next();
 *   }, 10);
 * }, function (err) {
 *   should.not.exist(err);
 *   console.log('all done');
 * });
 * ```
 *
 * @param {Array} array to iterate
 * @param {Function} iterator function
 * @param {Function} callback on complete or error
 * @cb _{Error|null}_ if error
 * @name forEach
 * @api public
 */

exports.forEach = function (arr, iterator, cb) {
  cb = cb || noop;
  if (!arr.length) return cb();
  var count = arr.length;
  for (var i = 0, l = arr.length; i < l; i++) {
    iterator(arr[i], function next (err) {
      if (err) return cb(err);
      --count || cb(null);
    });
  }
};

/**
 * ### .forEachSeries (array, iterator, done)
 *
 * Apply an iterator to each item in an array
 * serially. Execute a callback when all items
 * have been completed or immediately if there is
 * is an error provided.
 *
 * ```js
 * async.forEachSeries([ 1, 2, 3 ], function (i, next) {
 *   setTimeout(function () {
 *     console.log(i);
 *     next();
 *   }, 10);
 * }, function (err) {
 *   should.not.exist(err);
 *   console.log('all done');
 * });
 * ```
 *
 * @param {Array} array to iterate
 * @param {Function} iterator function
 * @param {Function} callback on complete or error
 * @cb _{Error|null}_ if error
 * @name forEachSeries
 * @api public
 */

exports.forEachSeries = function (arr, iterator, cb) {
  cb = cb || noop;
  if (!arr.length) return cb();
  function iterate (i) {
    if (i == arr.length) return cb();
    iterator(arr[i], function next (err) {
      if (err) return cb(err);
      iterate(++i);
    });
  }
  iterate(0);
};

/**
 * ### .parallel (fns, done)
 *
 * Execute a collection of functions in parellel
 * and execute a callback upon completion or occurance
 * of an error. Functions can be provided as either
 * an array or an object. Each function will be passed
 * a callback to signal completion. The callback accepts
 * either an error for the first argument, or null for the
 * first argument and results following. The results will be
 * provied as the second argument of the callback in-kind,
 * maintaining the order of the input array or the keys
 * of the input object.
 *
 * ##### Asrray
 *
 * ```js
 * async.parallel([
 *     function (next) {
 *       setTimeout(function () {
 *         next(null, 'one');
 *       }, 15);
 *     }
 *   , function (next) {
 *       setTimeout(function () {
 *         next(null, 'two');
 *       }, 10);
 *     }
 *   , function (next) {
 *       setTimseout(function () {
 *         next(null, 'three');
 *       }, 5);
 *     }s
 * ], function (err, res) {
 *   should.not.exist(err);
 *   res.should.deep.equal([ 'one', 'two', 'three' ]);
 * });
 * ```
 *
 * ##### Object
 *
 * ```js
 * async.parallel({
 *     one: function (next) {
 *       setTimeout(function () {
 *         next(null, 'one');
 *       }, 15);
 *     }
 *   , two: function (next) {
 *       setTimeout(function () {
 *         next(null, 'two');
 *       }, 10);
 *     }
 *   , three: function (next) {
 *       setTimeout(function () {
 *         next(null, 'three');
 *       }, 5);
 *     }
 * }, function (err, res) {
 *   should.not.exist(err);
 *   res.should.deep.equal({
 *       one: 'one'
 *     , two: 'two'
 *     , three: 'three'
 *   });
 * });
 * ```
 *
 * @param {Array|Object} functions to execute
 * @param {Function} callback on completion or error
 * @cb _{Error|null}_ if error
 * @cb _{Array|Object}_ reflecting the results
 * @name parellel
 * @api public
 */

exports.parallel = function (tasks, cb) {
  cb = cb || noop;
  var keys = prepareKeys(tasks)
    , res = Array.isArray(tasks) ? Array(tasks.length) : {}
    , iterator = prepareIterator(tasks, keys, res);
  if (!keys.length) return cb();
  exports.forEach(keys, iterator, function (err) {
    if (err) return cb(err);
    cb(null, res);
  });
};

/**
 * ### series (fns, done)
 *
 * Execute a collection of functions serially
 * and execute a callback upon completion or occurance
 * of an error. Functions can be provided as either
 * an array or an object. Each function will be passed
 * a callback to signal completion. The callback accepts
 * either an error for the first argument, or null for the
 * first argument and results following. The results will be
 * provied as the second argument of the callback in-kind,
 * maintaining the order of the input array or the keys
 * of the input object.
 *
 * ##### Asrray
 *
 * ```js
 * async.series([
 *     function (next) {
 *       setTimeout(function () {
 *         next(null, 'one');
 *       }, 15);
 *     }
 *   , function (next) {
 *       setTimeout(function () {
 *         next(null, 'two');
 *       }, 10);
 *     }
 *   , function (next) {
 *       setTimseout(function () {
 *         next(null, 'three');
 *       }, 5);
 *     }s
 * ], function (err, res) {
 *   should.not.exist(err);
 *   res.should.deep.equal([ 'one', 'two', 'three' ]);
 * });
 * ```
 *
 * ##### Object
 *
 * ```js
 * async.series({
 *     one: function (next) {
 *       setTimeout(function () {
 *         next(null, 'one');
 *       }, 15);
 *     }
 *   , two: function (next) {
 *       setTimeout(function () {
 *         next(null, 'two');
 *       }, 10);
 *     }
 *   , three: function (next) {
 *       setTimeout(function () {
 *         next(null, 'three');
 *       }, 5);
 *     }
 * }, function (err, res) {
 *   should.not.exist(err);
 *   res.should.deep.equal({
 *       one: 'one'
 *     , two: 'two'
 *     , three: 'three'
 *   });
 * });
 * ```
 *
 * @param {Array|Object} functions to execute
 * @param {Function} callback on completion or error
 * @cb _{Error|null}_ if error
 * @cb _{Array|Object}_ reflecting the results
 * @name series
 * @api public
 */

exports.series = function (tasks, cb) {
  cb = cb || noop;
  var keys = prepareKeys(tasks)
    , res = Array.isArray(tasks) ? Array(tasks.length) : {}
    , iterator = prepareIterator(tasks, keys, res);
  if (!keys.length) return cb();
  exports.forEachSeries(keys, iterator, function (err) {
    if (err) return cb(err);
    cb(null, res);
  });
};

/*!
 * parseArgs (args
 *
 * Figure out how to return the a set of arguments
 * as part of a parallel or series set. If length
 * is more than one, return as item, else return
 * as an array.
 *
 * @param {Array} arguments to parse
 * @returns {Mixed} arguments
 * @api private
 */

function parseArgs (args) {
  if (args.length === 0) return null;
  return args.length === 1
    ? args[0]
    : args;
}

/*!
 * parseKeys (tasks)
 *
 * For a parallel or series set, determine the context
 * of the request as array or object, and return the
 * keys for that context. If working with an array,
 * create an array of indexes to lookup when passed
 * to the iterator.
 *
 * @param {Array|Object} tasks
 * @returns {Array} keys
 * @api private
 */

function prepareKeys (tasks) {
  if (Array.isArray(tasks)) {
    var keys = [];
    for (var i = 0, l = tasks.length; i < l; i++)
      keys.push(i);
    return keys;
  } else {
    return Object.keys(tasks);
  }
}

/*!
 * prepareIterator (tasks, keys, response)
 *
 * Create a function to use as an iterator for
 * a parallel or series execution. Handles
 * writing of the results to the result set
 * so that it can be passed back in the final
 * callback.
 *
 * @param {Mixed} array or object of tasks
 * @param {Array} keys to use to get current task
 * @param {Mixed} res object to write to
 * @returns {Function} iterator
 * @api private
 */

function prepareIterator (tasks, keys, res) {
  return function (key, next) {
    var fn = tasks[key];
    fn(function done () {
      var err = arguments[0];
      if (err) return next(err);
      var args = slice.call(arguments, 1)
        , arg = parseArgs(args);
      res[key] = arg;
      next();
    });
  }
}
