# tea-extend [![Build Status](https://secure.travis-ci.org/qualiancy/tea-extend.png?branch=master)](https://travis-ci.org/qualiancy/tea-extend)

> Shallow object merge utility.

## Installation

### Node.js

`tea-extend` is available on [npm](http://npmjs.org).

    $ npm install tea-extend

### Component

`tea-extend` is available as a [component](https://github.com/component/component).

    $ component install qualiancy/tea-extend

## Usage

### extend (destination, source, ...)

* **@param** _{Object}_ destination 
* **@param** _{Object}_ sources ...
* **@return** _{Object}_  destination extended

For each source, shallow merge its key/values to the
destinatino. Sources are read in order, meaning the same
key in a later source will overwrite the key's value earlier
set.

```js
var extend = require('tea-extend');

// sample objects
var a = { hello: 'universe' }
  , b = { speak: 'loudly' };

// change a
extend(a, b);
a.should.deep.equal({ hello: 'universe', speak: 'loudly' });

// shallow clone to c
var c = extend({}, a);
a.language = 'en';

a.should.deep.equal({ hello: 'universe', speak: 'loudly', language: 'en' });
c.should.deep.equal({ hello: 'universe', speak: 'loudly' });
```


### extend.include (props, ...)

* **@param** _{String}_ each property to include as an argument
* **@return** _{Function}_  reusable include function

Create a new object that only includes the properties
specified. Unlike `extend()`, the original objects
will not be modified.

This method will return a function that can be
reused for the specified properties. Like `extend()`,
this function accepts an unlimited number of objects
as parameters to draw from. Also, the same key in later
specified objects will overwrite earlier specified values.

```js
var extend = require('tea-extend')
  , include = extend.include('one', 'two');

var a = { one: 1, three: 3 }
  , b = { zero: 0, two: 2 };

var c = include(a, b);

c.should.deep.equal({ one: 1, two: 2 });
```


### extend.exclude (props, ...)

* **@param** _{String}_ each property to exclude as an argument
* **@return** _{Function}_  reusable exclude function

Create a new object that include all but the properties
specified. Unlike `extend()`, the original objects
will not be modified.

This method will return a function that can be
reused for the specified properties. Like `extend()`,
this function accepts an unlimited number of objects
as parameters to draw from. Also, the same key in later
specified objects will overwrite earlier specified values.

```js
var extend = require('tea-extend')
  , exclude = extend.exclude('one', 'two');

var a = { one: 1, three: 3 }
  , b = { zero: 0, two: 2 };

var c = exclude(a, b);

c.should.deep.equal({ three: 3, zero: 0 });
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
