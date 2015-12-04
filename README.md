# image-clipper
> Clip & Crop images purely using Canvas for [Electron](https://github.com/atom/electron/), [NW.js](https://github.com/nwjs/nw.js) (Node-webkit) and the Browser, without any image processing library dependencies. Still on development.

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Bower version][bower-image]][bower-url]

[![comparev](https://nodei.co/npm/image-clipper.png)](https://npmjs.org/package/image-clipper)

[npm-url]: https://npmjs.org/package/image-clipper
[downloads-image]: http://img.shields.io/npm/dm/image-clipper.svg
[npm-image]: http://img.shields.io/npm/v/image-clipper.svg
[bower-url]:http://badge.fury.io/bo/image-clipper
[bower-image]: https://badge.fury.io/bo/image-clipper.svg

[API Documentation](#api)

## Why image-clipper?

When we develop [Electron](https://github.com/atom/electron/) or [NW.js](https://github.com/nwjs/nw.js) application, I found it's very inconvenient when using image processing libraries such as [gm](https://github.com/aheckmann/gm) and [node-canvas](https://github.com/Automattic/node-canvas), when you publish your application, probably the first thing you have to do is prompts your user to install multiple local dependencies, For example, `gm` relies [GraphicsMagick](http://www.graphicsmagick.org/), `node-canvas` relies [Cairo](http://cairographics.org/).

However, i just need to use a very small part of `gm` functions provided, and do some simple image operations, such as clip & crop, we should avoid users to install those cumbersome things, that may frustrated your user, there is no need to install those!

## When should you use image-clipper?

Your application running in the browser & Electron & NW.js, and you just want to do some simple image operations, `image-clipper` may be what you want!

`image-clipper` can make you avoid using the kind of large modules that depends client to install additional local dependencies.

**If your project is a purely Node.js project, please use the dedicated image processing library that providing more comprehensive functions, such as `gm` and `node-canvas`, because you can install anything on the server.**


# Install

```
$ npm install image-clipper
```

# Usage

### Electron & NW.js

```js
var path = require('path');
var ImageClipper = require('image-clipper');
var clipper = new ImageClipper();

var x = 20;
var y = 20;
var width = 100;
var height = 100;
var outputFileName = path.join(exportPath, 'example-clipped.jpg');

clipper.loadImageFromUrl('example.jpg', function() {
    this.crop(x, y, width, height, function(dataUrl) {
        this.toFile(outputFileName, dataUrl, function() {
            console.log('the file has been saved');
        });
    });
});
```

### Browser

HTML:

```html
<img src="example.jpg" id="source">
<img src="" alt="preview result" id="preview">
<script src="./dist/imageClipper.js"></script>
```

JS:

```js
var clipper = new ImageClipper();
var previewImage = document.getElementById('preview');

clipper.loadImageFromUrl('example.jpg', function() {
    this.crop(x, y, width, height, function(dataUrl) {
        previewImage.src = dataUrl;
    });
});
```

or load image from memory:

```js
var sourceImage = document.getElementById('source');
var previewImage = document.getElementById('preview');

sourceImage.onload(function(){
    clipper.loadImageFromMemory(sourceImage).crop(x, y, width, height, function(dataUrl) {
        previewImage.src = dataUrl;
    });
});
```

# API

> To be continued...

# Example

```
npm run server
```

http://localhost:9100/example/browser.html

# Test case

http://localhost:9100/test/jasmine/runner.html

# License

MIT, see the [LICENSE](/LICENSE) file for detail.