# image-clipper
> Node.js module for clipping & cropping JPEG, PNG, WebP images purely using the native Canvas APIs, excellent compatibility with the Browser & [Electron](https://github.com/atom/electron/) & [NW.js](https://github.com/nwjs/nw.js) (Node-webkit), itself doesn't relies on any image processing libraries.

[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][npm-url]
[![Bower version][bower-image]][bower-url]
[![Build Status](https://travis-ci.org/superRaytin/image-clipper.svg?branch=master)](https://travis-ci.org/superRaytin/image-clipper)

[![image-clipper](https://nodei.co/npm/image-clipper.png)](https://npmjs.org/package/image-clipper)

[npm-url]: https://npmjs.org/package/image-clipper
[downloads-image]: http://img.shields.io/npm/dm/image-clipper.svg
[npm-image]: http://img.shields.io/npm/v/image-clipper.svg
[bower-url]:http://badge.fury.io/bo/image-clipper
[bower-image]: https://badge.fury.io/bo/image-clipper.svg

# Installation / Download

`npm install image-clipper` or `bower install image-clipper` or just download [image-clipper.js](dist/image-clipper.js) from the git repo.

# Quick Start

```js
var Clipper = require('image-clipper');

Clipper('/path/to/image.jpg', function() {
    this.crop(20, 20, 100, 100)
    .resize(50, 50)
    .quality(80)
    .toFile('/path/to/result.jpg', function() {
       console.log('saved!');
   });
});
```

[API Documentation](#api)

[Differences between the server-side and the client-side on usage](#server-client-diff)

[Benefits for Electron & NW.js application](#benefits-for-electron-nw)

## Client-side (browser)

Simply download the latest minified version from the `dist/` folder. All APIs are available in a global object called `imageClipper`.

```html
<img id="preview" alt="image-clipper preview">
<script src="./dist/image-clipper.js"></script>
```

```js
var preview = document.getElementById('preview');

imageClipper('/path/to/image.jpg', function() {
    this.crop(x, y, width, height)
    .toDataURL(function(dataUrl) {
        console.log('cropped!');
        preview.src = dataUrl;
    });
});
```

You can also use `image-clipper` [via AMD or CMD](https://github.com/superRaytin/image-clipper/wiki/use-via-AMD-or-CMD)

### Supported browsers

See [caniuse.com/canvas](http://caniuse.com/canvas)

# API

Listed below are commonly used APIs, you can see all of the possible usages of APIs in the [Test Suite (server-side Node.js)](test/tests.js) and [Test Suite (client-side Browser & Electron & NW.js)](test/browser/tests.js), or [run them](#testing) to verify.

Just start with `Clipper()`, chain-capable styles provided.

## Contains

- [Clipper(path [, options], callback)](#clipperpath--options-callback)
- [Clipper(source [, options])](#clippersource--options)
- [Clipper(options)](#clipperoptions)
- [clipper.image(path, callback)](#clipperimagepath-callback)
- [clipper.image(source)](#clipperimagesource)
- [clipper.crop(x, y, width, height)](#clippercropx-y-width-height)
- [clipper.toFile(path, callback)](#clippertofilepath-callback)
- [clipper.toDataURL([quality, ]callback)](#clippertodataurlquality-callback)
- [clipper.quality(quality)](#clipperqualityquality)
- [clipper.resize(width [, height])](#clipperresizewidth--height)
- [clipper.clear(x, y, width, height)](#clipperclearx-y-width-height)
- [clipper.reset()](#clipperreset)
- [clipper.injectNodeCanvas(Canvas)](#clipperinjectnodecanvascanvas)
- [clipper.getCanvas()](#clippergetcanvas)
- [clipper.configure(options)](#clipperconfigureoptions)

### Clipper(path [, options], callback)

Load image from the given path with some optional parameters. This process will be performed asynchronously.

- **path:** the path where the source image
- **options:** properties configurable in the list of available values, reference [configure()](#clipperconfigureoptions)
- **callback:** a function to be executed when loading is complete.

> Note: in all callbacks, allow using `this` to call instance methods

```js
Clipper('/path/to/image.jpg', function() {
    this.toFile('/path/to/result.jpg', function() {
       console.log('saved!');
   });
});

Clipper('/path/to/image.jpg', {quality: 50}, function() {
	// ...
});
```

### Clipper(source [, options])

Load image from memory. This process will be performed synchronously.

- **source:** anything ctx.drawImage() accepts, usually HTMLImageElement, HTMLCanvasElement, HTMLVideoElement or [ImageBitmap](https://developer.mozilla.org/en-US/docs/Web/API/ImageBitmap). Keep in mind that [origin policies](https://en.wikipedia.org/wiki/Same-origin_policy) apply to the image source, and you may not use cross-domain images without [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing).

```js
Clipper(source)
    .toDataURL(function(dataUrl) {
        console.log('cropped!');
    });

Clipper(source, {quality: 50})
    .toDataURL(function(dataUrl) {
        console.log('cropped!');
    });
```

In this case, the best practice is to place the code in `onload`:

```js
var source = new Image;
source.onload(function(){ Clipper(source).resize(...) });
source.src = '/path/to/image.jpg';
```

### Clipper(options)

Create an image-clipper instance with some optional parameters.

```js
var clipper = Clipper({quality: 68, maxQuality: 92});

clipper.image(source)
    .toFile('/path/to/result.jpg', function() {
       console.log('saved!');
    });
```

### clipper.image(path, callback)

Load source image from the memory after initialized. Functionality is identical to `Clipper(path, callback)`.

```js
clipper.image('/path/to/image.jpg', function() {
    this.toFile('/path/to/result.jpg', function() {
       console.log('saved!');
   });
});
```

### clipper.image(source)

Load source image from the memory after initialized. This process will be performed synchronously; functionality is identical to `Clipper(source)`.

```js
clipper.image(source)
    .toFile('/path/to/result.jpg', function() {
       console.log('saved!');
   });
```

### clipper.crop(x, y, width, height)

Crops the resultant image to the given width and height at the given x and y position.

- **x:** the x axis of the coordinate for the rectangle starting point
- **y:** the y axis of the coordinate for the rectangle starting point
- **width:** the rectangle's width
- **height:** the rectangle's height

```js
Clipper(source)
    .crop(x, y, width, height)
    .toDataURL(function(dataUrl) {
        console.log('cropped!');
    });
```

### clipper.toFile(path, callback)

Write the resultant image to file.

> Note: in the Browser (not contain Electron & NW.js), this method is identical to **toDataURL()**, and callback will still be executed and will be passed the result data URI.

- **path:** the path where the resultant image will be saved
- **callback:** a function to be executed when saving is complete

Below is an example:

```js
Clipper('/path/to/image.jpg', function() {
    this.toFile('/path/to/result.jpg', function() {
        console.log('saved!');
    });
});
```

### clipper.toDataURL([quality, ]callback)

Return a string containing the data URI of current resultant canvas by optional compression level.

> Note: the quality (if provided) will only affect current `toDataURL()`

- **quality:** a Number between 1 and 100 indicating image quality. If not provided, this will be get from `quality()`
- **callback:** a function to be executed when converting is complete, callback will be passed the result data URI.

Using on the server-side Node.js:

```js
var clipper = Clipper(source);
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

Adjusts the jpeg and webp compression level. Level ranges from 1 to 100. Only be supported if the requested type is `image/jpeg` or `image/webp`.

- **quality:** a Number between 1 and 100 indicating image quality.

Below is an example:

```js
Clipper('/path/to/image.jpg', function() {
    this.quality(68)
    .toFile('/path/to/result.jpg', function() {
       console.log('saved!');
    });
});
```

### clipper.resize(width [, height])

Resize the resultant image to the given width and height.

- **width:** Number of pixels wide
- **height:** Number of pixels high

```js
var clipper = Clipper();

clipper.image('/path/to/image.jpg', function() {
    this.resize(100);
});
```

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
Clipper('/path/to/image.jpg', function() {
    this.clear(50, 50, 100, 100)
    .crop(0, 0, 300, 300)
    .toDataURL(function(dataUrl) {
        preview.src = dataUrl;
    });
});
```

### clipper.reset()

Restore the resultant image to its original.

Useful if you want to clip & crop the original image after `clear()`, `crop()`, `resize()` happened.

Below is an example:

```js
clipper('/path/to/image.jpg', function() {
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

<a name="inject-node-canvas"></a>
### clipper.injectNodeCanvas(Canvas)

Inject canvas implementation library into the instance context. You should use this only on the sever-side Node.js.

Usage:

```js
var Clipper = require('image-clipper');
var Canvas = require('canvas');
var clipper = Clipper();

clipper.injectNodeCanvas(Canvas);
```

The above is identical to:

```js
var Clipper = require('image-clipper');
var clipper = Clipper({
    canvas: Canvas
});
```

and:

```js
clipper.configure('canvas', Canvas);
```

### clipper.getCanvas()

Return the current instance Canvas object.

```js
var canvas = clipper.getCanvas();
// canvas.width
// canvas.height
```

### clipper.configure(options)

Configure properties (same properties configurable through the constructor) for global or the instance.

```js
var Clipper = require('image-clipper');
Clipper.configure({
    canvas: require('canvas')
});
```

Properties changed by the `Clipper.configure` method will take effect for every instance created after the change.

Or you can configure instance properties, below will only take effect for current instance and will override the global settings.

```js
var Clipper = require('image-clipper');
var clipper = Clipper();
clipper.configure({
    canvas: require('canvas')
});
```

Available properties:

- **canvas** canvas implementation library, default: null
- **quality** compression level, default: 92
- **maxQuality** maximum compression level, default: 100
- **minQuality** minimum compression level, default: 1
- **bufsize** output buffer size in bytes for JPEG while using node-canvas, default: 4096

Another usage for modifying single property:

```js
clipper.configure('bufsize', 2048);
```

<a name="server-client-diff"></a>
## Differences between the server-side and the client-side on usage

1. If you use `image-clipper` on the server-side Node.js, Canvas isn't being supported natively, you may specify a Canvas implementation library like [node-canvas](https://github.com/Automattic/node-canvas). See [injectNodeCanvas() API](#inject-node-canvas) for detail.
2. The `toFile()` doesn't support to write the resultant image to file in the Browsers (not contain Electron & NW.js)

<a name="benefits-for-electron-nw"></a>
## Benefits for Electron & NW.js application

When we develop [Electron](https://github.com/atom/electron/) or [NW.js](https://github.com/nwjs/nw.js) application, I found it's very inconvenient while using image processing libraries such as [gm](https://github.com/aheckmann/gm) and [sharp](https://github.com/lovell/sharp), when you publish your application, probably the first thing you have to do is to tell your user to install multiple local dependencies, known that `gm` relies on [GraphicsMagick](http://www.graphicsmagick.org/), `sharp` relies on [libvips](https://github.com/jcupitt/libvips).

However, sometimes we just need to use a very small part of `gm` provided, and do some simple operations to image, use image-clipper to avoid your user to install those cumbersome things which may frustrated them.

Electron & NW.js provide a mixture of Node.js and Browser, image-clipper just right using the Browser's native ability of Canvas and the Node's ability of File I/O, no longer needed the Canvas implementation libraries. Moreover, image-clipper use native Canvas APIs to process images, therefore no longer needed to install any other image processing libraries too.

Your desktop application will remain more stable and lightweight and your user will be peace of mind.

## Where is this library used?

If you are using this library in one of your projects, add it in this list :)

- [Puzzler](https://github.com/superRaytin/puzzler)
- [image-to-slices](https://github.com/superRaytin/image-to-slices)

**Happy Clipping!**

# Contributing

```
$ git clone https://github.com/superRaytin/image-clipper.git
$ cd image-clipper && npm install
```

Please keep your local edits to `lib/*.js`, `dist/*.js` will be built upon releases. Patches for features, bug fixes, documentation, examples and others are certainly welcome.

> I’m not a native English speaker, so feel free to point out grammatical and/or syntactical errors :)

# Testing

### Node.js (with node-canvas)

```
npm test
```

### Browser & Electron & NW.js

```
npm start
```

Then open http://localhost:9100/test/browser/index.html

# License

MIT, see the [LICENSE](/LICENSE) file for detail.