# breeze-nexttick [![Build Status](https://secure.travis-ci.org/qualiancy/breeze-nexttick.png?branch=master)](https://travis-ci.org/qualiancy/breeze-nexttick)

> `process.nextTick` shim for node.js and the browser

#### Installation

##### Node.js

`breeze-nexttick` is available on [npm](http://npmjs.org).

    npm install breeze-nexttick

##### Component

`breeze-nexttick` is available as a [component](https://github.com/component/component).

    $ component install qualiancy/breeze-nexttick

#### Usage

`breeze-nextTick` allows you to utilize nextTick semantics in both node.js and the browser with 
no changes to your code. In node it will use `process.nextTick`, but in the browser it will attempt
to use `postMessage`. If either of the previous are not available, it will default to `setTimeout(fn, 0)`. 

```js
var nextTick = require('breeze-nexttick');

nextTick(function () {
  // ...
});
```

#### License

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
