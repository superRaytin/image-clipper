# image-clipper
> Node.js module for clip & crop JPEG, PNG, WebP images purely using the native Canvas APIs, excellent compatibility with the Browser & [Electron](https://github.com/atom/electron/) & [NW.js](https://github.com/nwjs/nw.js) (Node-webkit), itself doesn't relies on any image processing libraries.

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Bower version][bower-image]][bower-url]

[![image-clipper](https://nodei.co/npm/image-clipper.png)](https://npmjs.org/package/image-clipper)

[npm-url]: https://npmjs.org/package/image-clipper
[downloads-image]: http://img.shields.io/npm/dm/image-clipper.svg
[npm-image]: http://img.shields.io/npm/v/image-clipper.svg
[bower-url]:http://badge.fury.io/bo/image-clipper
[bower-image]: https://badge.fury.io/bo/image-clipper.svg

# Installation / Download

`npm install image-clipper` or `bower install image-clipper` or just download [imageClipper.js](dist/imageClipper.js) from the git repo.

# Quick Start

```js
var ImageClipper = require('image-clipper');
var clipper = new ImageClipper();

var x = 20;
var y = 20;
var width = 100;
var height = 100;

clipper.loadImageFromUrl('/path/to/image.jpg', function() {
    this.crop(x, y, width, height)
    .resize(50, 50)
    .toFile('/path/to/image-cropped.jpg', function() {
       console.log('saved!');
   });
});
```

[API Documentation](#api)

## Differences between the server-side and the client-side on usage

1. Since server-side Node.js doesn't natively support Canvas, therefore you must to specify a Canvas implementation library, such as [node-canvas](https://github.com/Automattic/node-canvas). [See injectNodeCanvas() API](#clipperinjectnodecanvascanvas)
2. `toFile()` not support to write the resultant image to file in the truly Browsers (not contain Electron & NW.js)

## Benefits for Electron & NW.js application

When we develop [Electron](https://github.com/atom/electron/) or [NW.js](https://github.com/nwjs/nw.js) application, I found it's very inconvenient while using image processing libraries such as [gm](https://github.com/aheckmann/gm) and [sharp](https://github.com/lovell/sharp), when you publish your application, probably the first thing you have to do is to tell your user to install multiple local dependencies, known that `gm` relies on [GraphicsMagick](http://www.graphicsmagick.org/), `sharp` relies on [libvips](https://github.com/jcupitt/libvips).

However, sometimes we just need to use a very small part of `gm` provided, and do some simple operations to image, use image-clipper to avoid your user to install those cumbersome things which may frustrated them.

Electron & NW.js provide a mixture of Node.js and Browser, image-clipper just right using the Browser's native ability of Canvas and the Node's ability of File I/O, no longer needed the Canvas implementation libraries. Moreover, image-clipper use native Canvas APIs to process images, therefore no longer needed to install any other image processing libraries too.

Your desktop application will remain more stable and lightweight and your user will be peace of mind.

## Basic usage in the truly Browser

```html
<img id="preview" alt="imageClipper preview">
<script src="./dist/imageClipper.js"></script>
```

```js
var preview = document.getElementById('preview');
var clipper = new ImageClipper();
clipper.loadImageFromUrl('/path/to/image.jpg', function() {
    this.crop(x, y, width, height)
    .toDataURL(function(dataUrl) {
        console.log('cropped!');
        preview.src = dataUrl;
    });
});
```

Also usable [via require.js](https://github.com/superRaytin/image-clipper/wiki/use-with-require.js)

### Supported browsers

See [caniuse.com/canvas](http://caniuse.com/canvas)

# API

You can see all possible usages of APIs in the [Test Suite (server-side Node.js)](test/server.test.js) and [Test Suite (client-side Browser & Electron & NW.js)](test/jasmine/browser.test.js), or [run them](#testing) to verify.

### clipper.loadImageFromUrl(url, callback)

Load image from the given url. callback will be executed when loading is complete.

- **url:** the path where the source image
- **callback:** function()

> Note: in all callbacks, allow using `this` to call instance methods

### clipper.loadImageFromMemory(image)

Load image from the memory.

- **image:** anything ctx.drawImage() accepts, usually HTMLImageElement, HTMLCanvasElement, HTMLVideoElement or [ImageBitmap](https://developer.mozilla.org/en-US/docs/Web/API/ImageBitmap). Keep in mind that [origin policies](https://en.wikipedia.org/wiki/Same-origin_policy) apply to the image source, and you may not use cross-domain images without [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing).

`clipper.loadImageFromUrl` will eventually using this method to load image.

Below is an example:

```js
clipper.loadImageFromMemory(image)
    .crop(x, y, width, height)
    .toDataURL(function(dataUrl) {
        console.log('cropped!');
    });
```

In this case, the best practice is to place the code in `onload` callback:

```js
var image = new Image;
image.onload(function(){ clipper.loadImageFromMemory(...) });
image.src = '/path/to/image.jpg';
```

### clipper.crop(x, y, width, height)

Crops the resultant image to the given width and height at the given x and y position.

- **x:** the x axis of the coordinate for the rectangle starting point
- **y:** the y axis of the coordinate for the rectangle starting point
- **width:** the rectangle's width
- **height:** the rectangle's height

### clipper.toFile(path, callback)

Write the resultant image to file.

> Note: in the Browser (not contain Electron & NW.js), this method is the equivalent of **toDataURL**, callback will still be executed and will be passed the result data URI.

- **path:** the path where the resultant image will be saved
- **callback:** a function to be executed when saving is complete

Below is an example:

```js
clipper.loadImageFromUrl('/path/to/image.jpg', function() {
    this.crop(x, y, width, height)
    .toFile('/path/to/image-cropped.jpg', function() {
        console.log('saved!');
    });
});
```

### clipper.toDataURL([quality, ]callback)

Return a string containing the data URI of current resultant canvas.

- **quality:** a Number between 1 and 100 indicating image quality.
- **callback:** function(dataUrl), a function to be executed when converting is complete, callback will be passed the result data URI.

Using on the server-side Node.js:

```js
clipper.toDataURL(function(dataUrl) {...});
clipper.toDataURL(quality, function(dataUrl) {...});
```

in the Browser & Electron & NW.js, in addition to the above usages, below usages also be supported since converting is synchronized:

```js
var dataUrl = clipper.toDataURL();
var dataUrl = clipper.toDataURL(quality);
```

If your application will run on both sides, the recommendation is using the "callback" way.

### clipper.quality(quality)

Adjusts the jpeg and webp compression level. Level ranges from 0 to 100. Only be supported if the requested type is `image/jpeg` or `image/webp`.

- **quality:** a Number between 1 and 100 indicating image quality.

Below is an example:

```js
clipper.loadImageFromUrl('/path/to/image.jpg', function() {
    this.quality(68)
    .crop(x, y, width, height)
    .toDataURL(function(dataUrl) {
        console.log('cropped!');
    });
});
```

### clipper.resize(width [, height])

Resize the resultant image to the given width and height.

- **width:** Number of pixels wide
- **height:** Number of pixels high

To resize the resultant image to a width of 50px while maintaining aspect ratio:

```js
clipper.resize(50);
```

To resize the resultant image to a height of 50px while maintaining aspect ratio:

```js
clipper.resize(null, 50);
```

To resize the resultant image to fit a 50x100 rectangle (lose aspect ratio):

```js
clipper.resize(50, 100);
```

### clipper.clear(x, y, width, height)

Removes rectangular pixels from the given width and height at the given x and y position.

- **x:** the x axis of the coordinate for the rectangle starting point
- **y:** the y axis of the coordinate for the rectangle starting point
- **width:** Number of pixels wide will be removed
- **height:** Number of pixels high will be removed

Below is an example:

```js
clipper.loadImageFromUrl('/path/to/image.jpg', function() {
    this.clear(50, 50, 100, 100)
    .crop(0, 0, 300, 300)
    .toDataURL(function(dataUrl) {
        preview.src = dataUrl;
    });
});
```

### clipper.reset()

Restore the resultant image to its original.

Useful if you want to clip & crop the original image when `clear()`, `crop()`, `resize()` happened.

Below is an example:

```js
clipper.loadImageFromUrl('/path/to/image.jpg', function() {
    this.clear(50, 50, 100, 100)
    .crop(0, 0, 300, 300)
    .toDataURL(function(dataUrl) {
        console.log('cropped, part of data has been cleared');
        this.reset()
        .crop(50, 50, 100, 100)
        .toDataURL(function(dataUrl2) {
            console.log('regained the cleared data:', dataUrl2);
        });
    });
});
```

Or you can also create a new instance to do that.

### clipper.injectNodeCanvas(Canvas)

Inject canvas implementation library into the instance's context. You should use this only on the sever-side Node.js.

Usage:

```js
var ImageClipper = require('image-clipper');
var Canvas = require('canvas');
var clipper = new ImageClipper();

clipper.injectNodeCanvas(Canvas);
```

Be equivalent to:

```js
var ImageClipper = require('image-clipper');
var Canvas = require('canvas');
var clipper = new ImageClipper({
    canvas: Canvas
});
```

### clipper.getCanvas()

Return the current Canvas object.

```js
var canvas = clipper.getCanvas();
// canvas.width
// canvas.height
```

# Testing

### Testing on the server-side Node.js (with node-canvas)

```
npm test
```

### Testing on the client-side (Browser & Electron & NW.js)

First install jasmine:

```
cd test/jasmine && bower install jasmine
```

Then you can run the tests using `npm start` and open http://localhost:9100/test/jasmine/runner.html

# License

MIT, see the [LICENSE](/LICENSE) file for detail.