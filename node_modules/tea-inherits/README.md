# tea-inherits [![Build Status](https://secure.travis-ci.org/qualiancy/tea-inherits.png?branch=master)](https://travis-ci.org/qualiancy/tea-inherits)

> Constructor inheritance.

## Installation

### Node.js

`tea-inherits` is available on [npm](http://npmjs.org).

    $ npm install tea-inherits

### Component

`tea-inherits` is available as a [component](https://github.com/component/component).

    $ component install qualiancy/tea-inherits

## Usage

### inherits (constructor, super)

* **@param** _{Function}_ constructor to inherit
* **@param** _{Function}_ constructor to inherit from

Set up a constructor to inherit from it's super.

```js
var EventEmitter = require('events').EventEmitter
  , inherits = require('tea-inherits');

function MyConstructor () {
  // snazzy things
}

inherits(MyConstructor, EventEmitter);

var myctor = new MyConstructor();
myctor.should.be.instanceof(EventEmitter);
myctor.should.be.instanceof(MyConstructor);
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
