/*!
 * goodwin - deep object get/set path values
 * Copyright(c) 2012 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Module dependancies
 */

var nextTick = require('breeze-nexttick')
  , type = require('tea-type');

/*!
 * Constants
 */

var noop = function () {};

/*!
 * Helpers
 */

function invoke (cb) {
  return cb && 'function' === type(cb) ? cb : noop;
}

/*!
 * Primary Exports
 */

module.exports = Queue;

/**
 * ### Queue (iterator, concurrency)
 *
 * The queue mechanism allows for a any number of
 * data objects to be processed by an iterator
 * when they become available. The queue will processes
 * items in parellel, up to a given concurrently value
 * then will wait until an item has finished before
 * beginning to process the next.
 *
 * Should any item in the queue
 * fail to process and provide an error to the `next`
 * callback, no further items will be processed though items
 * already started will run to completion.
 *
 * ```js
 * var Queue = require('breeze-queue');
 *
 * var queue = new Queue(function (obj, next) {
 *   setTimeout(next, 10);
 * }, 5);
 * ```
 *
 * @param {Function} iterator
 * @param {Number} concurrency (defaults to 10)
 * @return {Object} queue api
 * @name queue
 * @api public
 */

function Queue (iterator, concurrency) {
  if (!(this instanceof Queue)) {
    return new Queue(iterator, concurrency);
  }

  this._iterator = iterator;
  this._concurrency = concurrency || 10;
  this._tasks = [];
  this._err = false;
  this._paused = false;
  this.workers = 0;
}

/**
 * ### .length
 *
 * Property indicating the number of items current
 * in the queue. An item is removed from this list
 * prior to being processed.
 *
 * @return {Number} count of queued items
 * @api public
 */

Object.defineProperty(Queue.prototype, 'length',
  { get: function () {
      return this._tasks.length;
    }
});

/**
 * ### .push (items[, callback[, autostart]])
 *
 * You can push an item or an array of items into
 * the queue for processing. The callback will be
 * called for the completion of each item if the queue
 * has not entered into an error state. A `autostart`
 * boolean my also be provided if you wish to start
 * processing the queue with this push of items. If
 * no pushes provide the autostart, then the queue
 * must be started manually with `.process()`.
 *
 * Note that if the queue has already been started but
 * has been drained of items, it will not start again
 * with another push unless the `autostart` toggle is present.
 *
 * ```js
 * // single item
 * queue.push({ hello: 'universe' });
 *
 * // multiple items
 * queue.push([
 *     { hello: 'world' }
 *   , { hello: 'universe' }
 * ]);
 *
 * // notify callback
 * queue.push({ hello: 'universe' }, notify);
 *
 * // autostart
 * queue.push({ hello: 'universe' }, true);
 *
 * // notify + autostart
 * queue.push({ hello: 'univeerse' }, notify, true);
 * ```
 *
 * @param {Mixed} item or items to be added to the queue
 * @param {Function} callback for completion of each item
 * @param {Boolean} autostart process (defaults to false)
 * @name push
 * @api public
 */

Queue.prototype.push = function (items, cb, start) {
  return this.pushAt(this._tasks.length, items, cb, start);
};

/**
 * ### .pushAt (position, items[, callback[, autostart]])
 *
 * Similar to `.push()` but allows items to be added to
 * the queue at certain position, such as the beginning.
 *
 * ```js
 * queue.pushAt(0, { hello: 'universe' });
 * ```
 *
 * @param {Number} position
 * @param {Mixed} item or items to be added to the queue
 * @param {Function} callback for completion of each item
 * @param {Boolean} autostart process (defaults to false)
 * @name pushAt
 * @api public
 */

Queue.prototype.pushAt = function (pos, items, cb, start) {
  if ('array' !== type(items)) items = [ items ];
  if ('boolean' === type(cb)) start = cb, cb = noop;
  cb = invoke(cb);

  var self = this
    , cc = this._concurrency
    , sat = invoke(this.saturated)
    , tasks = this._tasks
    , i = 0;

  for (; i < items.length; i++) {
    tasks.splice(pos++, 0, { task: items[i], cb: cb });
    if (tasks.length === cc) sat();
  }

  if (true === start) {
    nextTick(function () {
      self.process();
    });
  }

  return this;
};

/**
 * ### .process ()
 *
 * Begin the queue processing cycle. Has no impact if
 * the queue is already processing.
 *
 * ```js
 * queue.process();
 * ```
 *
 * @name process
 * @api public
 */

Queue.prototype.process = function () {
  // reasons to not process
  if (!this.length) return this;
  if (this.workers >= this._concurrency) return this;
  if (this._paused) return this;
  if (this._err) return this;

  // options, item
  var self = this
    , cc = this._concurrency
    , iterator = this._iterator
    , line = this._tasks.shift()
    , task = line.task;

  // tick workers
  this.workers++;
  if (!this.length) invoke(this.empty)();

  // callback to pass iterator
  function next () {
    self.workers--;
    invoke(line.cb).apply(null, arguments);
    if (self._err) return;

    var err = arguments[0]
      , empty = self.length + self.workers === 0
      , paused = self._paused && self.workers === 0;

    if (err) {
      self._err = true;
      invoke(self.onerror)(err);
    }

    if (empty || paused) invoke(self.drain)();
    self.process();
  }

  // prepare iterator
  nextTick(function () {
    iterator(task, next);
    self.process();
  });

  return this;
};

Queue.prototype.pause = function () {
  var self = this;

  nextTick(function () {
    if (self._paused && self.workers === 0) {
      invoke(self.drain)();
    }
  });

  this._paused = true;
  return this;
};

Queue.prototype.resume = function () {
  var self = this;

  nextTick(function () {
    self.process();
  });

  this._paused = false;
  return this;
};

/**
 * ### .onerror
 *
 * Setting this to a function will provide a listener
 * should an error occur. It will not be executed otherwise.
 *
 * ```js
 * queue.onerror = function (err) {
 *   console.error(err.message);
 * };
 * ```
 *
 * @default null
 * @expected {Function} on error callback
 * @cb {Error} object that was passed as error during iteration
 * @api public
 */

Queue.prototype.onerror = null;

/**
 * ### .saturated
 *
 * This listener will be executed when the number of
 * queued items exceeds the current concurrency value.
 * This will be executed directly after the push of
 * said items.
 *
 * ```js
 * queue.saturated = function () {
 *   console.log('the queue is saturated');
 * };
 * ```
 *
 * @default null
 * @expected {Function}
 * @api public
 */

Queue.prototype.saturated = null;

/**
 * ### .empty
 *
 * This listener will be executed when the queue is empty.
 * In other words, prior to the last item in the queue
 * being processed.
 *
 * ```js
 * queue.empty = function () {
 *   console.log('the queue is on the last item');
 * };
 * ```
 *
 * @default null
 * @expected {Function}
 * @api public
 */

Queue.prototype.empty = null;

/**
 * ### .drain
 *
 * This listener will be executed when all queued
 * items have been executed through the iterator.
 *
 * ```js
 * queue.drain = function () {
 *   console.log('the queue has processed all tiems');
 * };
 * ```
 *
 * @default null
 * @expected {Function}
 * @api public
 */

Queue.prototype.drain = null;
