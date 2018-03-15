# breeze-queue [![Build Status](https://secure.travis-ci.org/qualiancy/breeze-queue.png?branch=master)](https://travis-ci.org/qualiancy/breeze-queue)

> Throttled parallel function invocation.

## Installation

### Node.js

`breeze-queue` is available on [npm](http://npmjs.org).

    $ npm install breeze-queue

### Component

`breeze-queue` is available as a [component](https://github.com/component/component).

    $ component install qualiancy/breeze-queue

## Usage

### Queue (iterator, concurrency)

* **@param** _{Function}_ iterator 
* **@param** _{Number}_ concurrency (defaults to 10)
* **@return** _{Object}_  queue api

The queue mechanism allows for a any number of
data objects to be processed by an iterator
when they become available. The queue will processes
items in parellel, up to a given concurrently value,
then will wait until an item has finished until
beginning to process the next. The items queued
can have a callback executed when it has completed
its iterator.

In addition, a queue may also have
functions attached to listen for specific events.
On such event is an error. Should any item in the queue
fail to process and provide an error to it's `next`
callback, no further items will be processed.

```js
var Queue = require('breeze-queue');

var queue = Queue(function (obj, next) {
  setTimeout(next, 10);
}, 5);
```


### .length

* **@return** _{Number}_  count of queued items

Property indicating the number of items current
in the queue. An item is removed from this list
prior to being processed.


### .push (items[, callback[, autostart]])

* **@param** _{Array}_ item or items to be added to the queue
* **@param** _{Function}_ callback for completion of each item
* **@param** _{Boolean}_ autostart process (defaults to false)

You can push an item or an array of items into
the queue for processing. The callback will be
called for the completion of each item if the queue
has not entered into an error state. A `autostart`
boolean my also be provided if you wish to start
processing the queue with this push of items. If
no pushes provide the autostart, then the queue
must be started manually with `.process()`.

Note that if the queue has already been started but
has been drained of items, it will not start again
with another push unless the `autostart` toggle is present.

```js
// single item
queue.push({ hello: 'universe' });

// multiple items
queue.push([
    { hello: 'world' }
  , { hello: 'universe' }
]);

// notify callback
queue.push({ hello: 'universe' }, notify);

// autostart
queue.push({ hello: 'universe' }, true);

// notify + autostart
queue.push({ hello: 'univeerse' }, notify, true);
```


### .process ()


Begin the queue processing cycle. Has no impact if
the queue is already processing.

```js
queue.process();
```


### .onerror

* **@cb** {Error} object that was passed as error during iteration

Setting this to a function will provide a listener
should an error occur. It will not be executed otherwise.

```js
queue.onerror = function (err) {
  console.error(err.message);
};
```


### .saturated


This listener will be executed when the number of
queued items exceeds the current concurrency value.
This will be executed directly after the push of
said items.

```js
queue.saturated = function () {
  console.log('the queue is saturated');
};
```


### .empty


This listener will be executed when the queue is empty.
In other words, prior to the last item in the queue
being processed.

```js
queue.empty = function () {
  console.log('the queue is on the last item');
};
```


### .drain


This listener will be executed when all queued
items have been executed through the iterator.

```js
queue.drain = function () {
  console.log('the queue has processed all tiems');
};
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
