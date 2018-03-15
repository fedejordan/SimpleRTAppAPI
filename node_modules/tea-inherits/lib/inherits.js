/*!
 * tea-inherits
 * Copyright(c) 2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/**
 * ### inherits (constructor, super)
 *
 * Set up a constructor to inherit from it's super.
 *
 * ```js
 * var EventEmitter = require('events').EventEmitter
 *   , inherits = require('tea-inherits');
 *
 * function MyConstructor () {
 *   // snazzy things
 * }
 *
 * inherits(MyConstructor, EventEmitter);
 *
 * var myctor = new MyConstructor();
 * myctor.should.be.instanceof(EventEmitter);
 * myctor.should.be.instanceof(MyConstructor);
 * ```
 *
 * @param {Function} constructor to inherit
 * @param {Function} constructor to inherit from
 * @api public
 */

module.exports = function (ctor, ctorSuper) {
  ctor._super = ctorSuper;
  ctor.prototype = Object.create(ctorSuper.prototype, {
    constructor: {
        value: ctor
      , enumerable: false
      , writeable: true
      , configurable: true
    }
  });
};
