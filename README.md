# image-clipper
> Crop your images purely using the native Canvas APIs, for the Browser & [Electron](https://github.com/atom/electron/) & [NW.js](https://github.com/nwjs/nw.js) (Node-webkit), without any image processing library dependencies.

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Bower version][bower-image]][bower-url]

[![image-clipper](https://nodei.co/npm/image-clipper.png)](https://npmjs.org/package/image-clipper)

[npm-url]: https://npmjs.org/package/image-clipper
[downloads-image]: http://img.shields.io/npm/dm/image-clipper.svg
[npm-image]: http://img.shields.io/npm/v/image-clipper.svg
[bower-url]:http://badge.fury.io/bo/image-clipper
[bower-image]: https://badge.fury.io/bo/image-clipper.svg

[Quick Start](#quick-start)

[API Documentation](#api)

## Why image-clipper?

When we develop [Electron](https://github.com/atom/electron/) or [NW.js](https://github.com/nwjs/nw.js) application, I found it's very inconvenient when using image processing libraries such as [gm](https://github.com/aheckmann/gm) and [node-canvas](https://github.com/Automattic/node-canvas), when you publish your application, probably the first thing you have to do is prompts your user to install multiple local dependencies, For example, `gm` relies [GraphicsMagick](http://www.graphicsmagick.org/), `node-canvas` relies [Cairo](http://cairographics.org/).

However, i just need to use a very small part of `gm` functions provided, and do some simple image operations, such as crop, we should avoid users to install those cumbersome things that may frustrated your user, sometimes there is no need to install those!

## When should you use image-clipper?

Your application will running in the browser or Electron or NW.js, and you just want to do some simple image operations, then `image-clipper` may be what you want!

`image-clipper` can make you avoid using the kind of large modules that depends client to install additional local dependencies. It use the native canvas APIs to crop your images.

**Note: If your project is a purely Node.js project, please use the dedicated image processing library that provide more comprehensive functions, such as `gm` and `node-canvas`, because you can install anything on the server.**


# Installation / Download

`npm install image-clipper` or `bower install image-clipper` or just download [imageClipper.js](dist/imageClipper.js) from the git repo.

# Quick Start

### Electron & NW.js (Node-webkit)

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

### Browser Example

HTML:

```html
<img src="" alt="preview" id="preview">
<script src="./dist/imageClipper.js"></script>
```

JS:

```js
var clipper = new ImageClipper();
var preview = document.getElementById('preview');

clipper.loadImageFromUrl('example.jpg', function() {
    this.crop(x, y, width, height, function(dataUrl) {
        preview.src = dataUrl;
    });
});
```

Or you can preview the demo using `npm run server` and open http://localhost:9100/example/browser.html

# Supported Browsers

See [caniuse.com/canvas](http://caniuse.com/canvas)

# API

> The API is not yet finalized.

initialize an ImageClipper instance to demonstrate:

```js
var ImageClipper = require('image-clipper');
var clipper = new ImageClipper();
```

### clipper.loadImageFromUrl(url, callback)

Load image from url.

- **url:** url of the source image
- **callback:** called when source image loaded.

> Note: in all callbacks, allow using `this` to call instance methods

### clipper.crop(x, y, width, height, callback)

Crop rectangular area of canvas and pass data url to callback when done.

- **x:** the x axis of the coordinate for the rectangle starting point
- **y:** the y axis of the coordinate for the rectangle starting point
- **width:** the rectangle's width
- **height:** the rectangle's height
- **callback:** function(dataUrl)

### clipper.loadImageFromMemory(image)

`clipper.loadImageFromUrl` will eventually using this method to crop image.

- **image:** anything ctx.drawImage() accepts, usually HTMLImageElement, HTMLCanvasElement, HTMLVideoElement or [ImageBitmap](https://developer.mozilla.org/en-US/docs/Web/API/ImageBitmap). Keep in mind that [origin policies](https://en.wikipedia.org/wiki/Same-origin_policy) apply to the image source, and you may not use cross-domain images without [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing).

Here is an example:

```js
clipper.loadImageFromMemory(image).crop(x, y, width, height, function(dataUrl) {
	console.log('cropped!');
});
```

In this case, the best practice is to place the code in `onload` callback:

```js
image.onload(function(){ //... });
```

### clipper.quality(level)

- **level:** a Number between 0 and 1 indicating image quality if the requested type is `image/jpeg` or `image/webp`.

Here is an example:

```js
clipper.loadImageFromMemory(image).quality(0.68).crop(x, y, width, height, function(dataUrl) {
	console.log('cropped!');
});
```

### clipper.toFile(path, dataUrl, callback)

Convert data url to binary image file.

> Note: just for Electron & NW.js, otherwise return the original data url.

- **path:** path of output file
- **dataUrl:** data url that crop() returned
- **callback:** function()

Here is an example:

```js
clipper.loadImageFromMemory(image).crop(x, y, width, height, function(dataUrl) {
	this.toFile(outputFileName, dataUrl, function() {
		console.log('saved');
	});
});
```

### clipper.clearArea(x, y, width, height)

Used to clear rectangular area of canvas. The parameters description see `crop` above.

Here is an example:

```js
clipper.loadImageFromUrl('example.jpg', function() {
    this.clearArea(50, 50, 100, 100).crop(0, 0, 300, 300, function(dataUrl) {
        preview.src = dataUrl;
    });
});
```

### clipper.toDataUrl(quality)

- **quality:** quality level.

Return data url of current canvas.

### clipper.reset()

Used to restore the canvas, useful after `clearArea()`.

Here is an example:

```js
clipper.loadImageFromUrl('example.jpg', function() {
    clipper.clearArea(50, 50, 100, 100).crop(0, 0, 300, 300, function(dataUrl) {
    	console.log('cropped, part of data has been cleared');
        clipper.reset().crop(50, 50, 100, 100, function(dataUrl2) {
			console.log('regained the cleared data:', dataUrl2);
		});
    });
});
```

### clipper.getCanvas()

Return current Canvas object.

```js
var canvas = clipper.getCanvas();
// canvas.width
// canvas.height
```

# Tests

First install jasmine:

```
cd test/jasmine && bower install jasmine
```

Then you can run the tests using `npm run server` and open http://localhost:9100/test/jasmine/runner.html

# License

MIT, see the [LICENSE](/LICENSE) file for detail.