# facet [![Build Status](https://secure.travis-ci.org/qualiancy/facet.png?branch=master)](https://travis-ci.org/qualiancy/facet)

> Configuration mixin for constructors.

## Installation

### Node.js

`facet` is available on [npm](http://npmjs.org).

    $ npm install facet

### Component

`facet` is available as a [component](https://github.com/component/component).

    $ component install qualiancy/facet

## Usage

### facet (object[, options])

* **@param** _{Object}_ Constructor or Object
* **@param** _{Mixed}_ Options 
* **@return** _{Object}_  Constructor or Object

This mixin provides a way to store arbitray key/value
pairs on a constructor or object. Furthermore, it provides
a number of helper methods to retrieve the stored values.

Begin by applying the mixin to a constructor or object.

```js
// on a constructor
facet(MyConstructor.prototype);

// on an object
var obj = {};
facet(obj);
```

**Storage:** Facet will default to creating and using the `.settings`
object on the constructor or object to store the
key/value pairs. If you would like to use something else
you may specify a different storage key.

```js
facet(MyConstructor.prototype, '_options');
```

**Handle:** Facet can also invoke a handle anytime a setting is
written. This is preferred method of responding to
writes as opposed to overwriting the `.set` method.

The `this` context in the handle will be the object
instance.

```js
facet(MyEventEmitter.prototype, function (key, value) {
  // emit changes on self
  this.emit('settings', key, value);
});

var ee = new MyEventEmitter();

ee.on('settings', function (key, value) {
  console.log('%s was set to: ', key, value);
});

ee.set('hello', 'universe');
// "hello was set to: universe"
```

**All Settings:** If you are changing more than one of the
options than you can use an object as the second argument.

- **@param** _{String}_ `store`
- **@param** _{Function}_ `handle`

```js
facet(MyEventEmitter.prototype, {
    store: '_options'
  , handle: function (key, value) {
      this.emit('options', key, value);
    }
});
```


## API



#### .set (key[, value])

* **@param** _{String|Object}_ key or object
* **@param** _{Mixed}_ value 
* **@return** _{this}_  for chaining

Modify a key/value pair of settings, or use
an object to modify many settings at once.

```js
obj
.set('hello', 'universe')
.set({
    hello: 'universe'
  , say: 'loudly'
});
```


#### .get (key)

* **@param** _{String}_ key 

Return the value of a stored setting.

```js
obj.get('hello').should.equal('universe');
```


#### .enable (key)

* **@param** _{String}_ key 
* **@return** _{this}_  for chaining

Mark a setting key as "enabled" (true).

```js
obj.enable('loudly');
```


#### .disable (key)

* **@param** _{String}_ key 
* **@return** _{this}_  for chaining

Mark a setting key as "disabled" (false).

```js
obj.disable('whisper');
```


#### .enabled (key)

* **@param** _{String}_ key 

Confirm that a given key is enabled (=== true).
Settings that do not exist will return `false`.

```js
obj.enabled('loudly').should.be.true;
obj.enabled('whisper').should.be.false;
obj.enabled('scream').should.be.false;
```


#### .disabled (key)

* **@param** _{String}_ key 

Confirm that a setting key is disabled (=== false).
Settings that do not exists will return `true`.

```js
obj.disabled('loudly').should.be.false;
obj.disabled('whisper').should.be.true;
obj.disabled('scream').should.be.true;
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
