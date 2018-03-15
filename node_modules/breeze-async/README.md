# breeze-async [![Build Status](https://secure.travis-ci.org/qualiancy/breeze-async.png?branch=master)](https://travis-ci.org/qualiancy/breeze-async)

> Simple series and parallel flow control.

## Installation

### Node.js

`breeze-async` is available on [npm](http://npmjs.org).

    $ npm install breeze-async

### Component

`breeze-async` is available as a [component](https://github.com/component/component).

    $ component install qualiancy/breeze-async

## Usage

Once you require `breeze-async`, the following API will be available.

```js
var async = require('breeze-async');
```

### .forEach (array, iterator, done)

* **@param** _{Array}_ array to iterate
* **@param** _{Function}_ iterator function
* **@param** _{Function}_ callback on complete or error
* **@cb** _{Error|null}_ if error

Apply an iterator to each item in an array
in parellel. Execute a callback when all items
have been completed or immediately if there is
an error provided.

```js
async.forEach([ 1, 2, 3 ], function (i, next) {
  setTimeout(function () {
    console.log(i);
    next();
  }, 10);
}, function (err) {
  should.not.exist(err);
  console.log('all done');
});
```


### .forEachSeries (array, iterator, done)

* **@param** _{Array}_ array to iterate
* **@param** _{Function}_ iterator function
* **@param** _{Function}_ callback on complete or error
* **@cb** _{Error|null}_ if error

Apply an iterator to each item in an array
serially. Execute a callback when all items
have been completed or immediately if there is
is an error provided.

```js
async.forEachSeries([ 1, 2, 3 ], function (i, next) {
  setTimeout(function () {
    console.log(i);
    next();
  }, 10);
}, function (err) {
  should.not.exist(err);
  console.log('all done');
});
```


### .parallel (fns, done)

* **@param** _{Array|Object}_ functions to execute
* **@param** _{Function}_ callback on completion or error
* **@cb** _{Error|null}_ if error
* **@cb** _{Array|Object}_ reflecting the results

Execute a collection of functions in parellel
and execute a callback upon completion or occurance
of an error. Functions can be provided as either
an array or an object. Each function will be passed
a callback to signal completion. The callback accepts
either an error for the first argument, or null for the
first argument and results following. The results will be
provied as the second argument of the callback in-kind,
maintaining the order of the input array or the keys
of the input object.

##### Asrray

```js
async.parallel([
    function (next) {
      setTimeout(function () {
        next(null, 'one');
      }, 15);
    }
  , function (next) {
      setTimeout(function () {
        next(null, 'two');
      }, 10);
    }
  , function (next) {
      setTimseout(function () {
        next(null, 'three');
      }, 5);
    }s
], function (err, res) {
  should.not.exist(err);
  res.should.deep.equal([ 'one', 'two', 'three' ]);
});
```

##### Object

```js
async.parallel({
    one: function (next) {
      setTimeout(function () {
        next(null, 'one');
      }, 15);
    }
  , two: function (next) {
      setTimeout(function () {
        next(null, 'two');
      }, 10);
    }
  , three: function (next) {
      setTimeout(function () {
        next(null, 'three');
      }, 5);
    }
}, function (err, res) {
  should.not.exist(err);
  res.should.deep.equal({
      one: 'one'
    , two: 'two'
    , three: 'three'
  });
});
```


### series (fns, done)

* **@param** _{Array|Object}_ functions to execute
* **@param** _{Function}_ callback on completion or error
* **@cb** _{Error|null}_ if error
* **@cb** _{Array|Object}_ reflecting the results

Execute a collection of functions serially
and execute a callback upon completion or occurance
of an error. Functions can be provided as either
an array or an object. Each function will be passed
a callback to signal completion. The callback accepts
either an error for the first argument, or null for the
first argument and results following. The results will be
provied as the second argument of the callback in-kind,
maintaining the order of the input array or the keys
of the input object.

##### Asrray

```js
async.series([
    function (next) {
      setTimeout(function () {
        next(null, 'one');
      }, 15);
    }
  , function (next) {
      setTimeout(function () {
        next(null, 'two');
      }, 10);
    }
  , function (next) {
      setTimseout(function () {
        next(null, 'three');
      }, 5);
    }s
], function (err, res) {
  should.not.exist(err);
  res.should.deep.equal([ 'one', 'two', 'three' ]);
});
```

##### Object

```js
async.series({
    one: function (next) {
      setTimeout(function () {
        next(null, 'one');
      }, 15);
    }
  , two: function (next) {
      setTimeout(function () {
        next(null, 'two');
      }, 10);
    }
  , three: function (next) {
      setTimeout(function () {
        next(null, 'three');
      }, 5);
    }
}, function (err, res) {
  should.not.exist(err);
  res.should.deep.equal({
      one: 'one'
    , two: 'two'
    , three: 'three'
  });
});
```



## License

(The MIT License)

Copyright (c) 2012 Jake Luer <jake@qualiancy.com> (http://qualiancy.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
