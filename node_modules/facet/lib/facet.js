/*!
 * Facet
 * Copyright(c) 2012-2013 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/**
 * ## Usage
 */

/**
 * ### facet (object[, options])
 *
 * This mixin provides a way to store arbitray key/value
 * pairs on a constructor or object. Furthermore, it provides
 * a number of helper methods to retrieve the stored values.
 *
 * Begin by applying the mixin to a constructor or object.
 *
 * ```js
 * // on a constructor
 * facet(MyConstructor.prototype);
 *
 * // on an object
 * var obj = {};
 * facet(obj);
 * ```
 *
 * **Storage:** Facet will default to creating and using the `.settings`
 * object on the constructor or object to store the
 * key/value pairs. If you would like to use something else
 * you may specify a different storage key.
 *
 * ```js
 * facet(MyConstructor.prototype, '_options');
 * ```
 *
 * **Handle:** Facet can also invoke a handle anytime a setting is
 * written. This is preferred method of responding to
 * writes as opposed to overwriting the `.set` method.
 *
 * The `this` context in the handle will be the object
 * instance.
 *
 * ```js
 * facet(MyEventEmitter.prototype, function (key, value) {
 *   // emit changes on self
 *   this.emit('settings', key, value);
 * });
 *
 * var ee = new MyEventEmitter();
 *
 * ee.on('settings', function (key, value) {
 *   console.log('%s was set to: ', key, value);
 * });
 *
 * ee.set('hello', 'universe');
 * // "hello was set to: universe"
 * ```
 *
 * **All Settings:** If you are changing more than one of the
 * options than you can use an object as the second argument.
 *
 * - **@param** _{String}_ `store`
 * - **@param** _{Function}_ `handle`
 *
 * ```js
 * facet(MyEventEmitter.prototype, {
 *     store: '_options'
 *   , handle: function (key, value) {
 *       this.emit('options', key, value);
 *     }
 * });
 * ```
 *
 * @param {Object} Constructor or Object
 * @param {Mixed} Options
 * @return {Object} Constructor or Object
 * @api public
 */

module.exports = function (proto, opts) {
  // handle second argument
  if ('string' === typeof opts) {
    opts = { store: opts };
  } else if ('function' === typeof opts) {
    opts = { handle: opts };
  } else {
    opts = opts || {};
  }

  // fill in the blanks
  if (!opts.store) opts.store = 'settings';
  if (!opts.handle) opts.handle = function () {};

  /**
   * ## API
   */

  /**
   * #### .set (key[, value])
   *
   * Modify a key/value pair of settings, or use
   * an object to modify many settings at once.
   *
   * ```js
   * obj
   * .set('hello', 'universe')
   * .set({
   *     hello: 'universe'
   *   , say: 'loudly'
   * });
   * ```
   *
   * @param {String|Object} key or object
   * @param {Mixed} value
   * @return {this} for chaining
   * @api public
   */

  proto.set = (function (opts) {
    var handle = opts.handle
      , prop = opts.store;

    return function (key, value) {
      var settings = this[prop] || (this[prop] = {});

      if (1 === arguments.length) {
        if ('string' === typeof key) {
          return settings[key];
        } else {
          for (var name in key) {
            this.set(name, key[name]);
          }
        }
      } else {
        settings[key] = value;
        handle.call(this, key, value);
      }

      return this;
    };
  })(opts);

  /**
   * #### .get (key)
   *
   * Return the value of a stored setting.
   *
   * ```js
   * obj.get('hello').should.equal('universe');
   * ```
   *
   * @param {String} key
   * @api public
   */

  proto.get = function (key) {
    return this.set(key);
  };

  /**
   * #### .enable (key)
   *
   * Mark a setting key as "enabled" (true).
   *
   * ```js
   * obj.enable('loudly');
   * ```
   *
   * @param {String} key
   * @return {this} for chaining
   * @api public
   */

  proto.enable = function (key) {
    return this.set(key, true);
  };

  /**
   * #### .disable (key)
   *
   * Mark a setting key as "disabled" (false).
   *
   * ```js
   * obj.disable('whisper');
   * ```
   *
   * @param {String} key
   * @return {this} for chaining
   * @api public
   */

  proto.disable = function (key) {
    return this.set(key, false);
  };

  /**
   * #### .enabled (key)
   *
   * Confirm that a given key is enabled (=== true).
   * Settings that do not exist will return `false`.
   *
   * ```js
   * obj.enabled('loudly').should.be.true;
   * obj.enabled('whisper').should.be.false;
   * obj.enabled('scream').should.be.false;
   * ```
   *
   * @param {String} key
   * @name enabled
   * @api public
   */

  proto.enabled = function (key) {
    return !! this.get(key);
  };

  /**
   * #### .disabled (key)
   *
   * Confirm that a setting key is disabled (=== false).
   * Settings that do not exists will return `true`.
   *
   * ```js
   * obj.disabled('loudly').should.be.false;
   * obj.disabled('whisper').should.be.true;
   * obj.disabled('scream').should.be.true;
   * ```
   *
   * @param {String} key
   * @name disabled
   * @api public
   */

  proto.disabled = function (key) {
    return !!! this.get(key);
  };

  // pass it back out
  return proto;
};
