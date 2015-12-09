var fs = require('fs');
var utils = require('./utils');
var polyfills = require('./polyfills');

// whether is Electron
var isElectron = utils.isElectron();

// whether is NW.js (Node-webkit)
var isNW = utils.isNW();

// pure Browser
var isBrowser = utils.isBrowser();

// whether support canvas
var isSupportCanvas = isBrowser || isElectron || isNW;

// constructor
function ImageClipper(options) {
  options = options || {};

  this.originalOptions = options;
  this.maxQualityLevel = options.maxQualityLevel || 92;
  this.minQualityLevel = options.minQualityLevel || 1;
  this.qualityLevel = options.quality || this.maxQualityLevel;
  this.quality(this.qualityLevel);

  return this;
}

/**
 * load image from memory
 *
 * @param {Object} image, Image Object
 * @return ImageClipper instance
 * */
ImageClipper.prototype.loadImageFromMemory = function(image) {
  image = image || this.originalImage;

  var width = image.width;
  var height = image.height;

  var canvas = this.__createCanvas(width, height);
  var ctx = canvas.getContext('2d');

  ctx.drawImage(image, 0, 0, width, height);

  this.canvas = canvas;
  this.imageFormat = this.imageFormat || utils.getImageFormat(image.src) || 'image/jpeg';

  if (!this.originalImage) {
    this.originalImage = image;
  }

  return this;
};

/**
 * load image from url
 *
 * @param {String} url, image url
 * @param {Function} callback, fired when image completely loaded
 * */
ImageClipper.prototype.loadImageFromUrl = function(url, callback) {
  var self = this;
  var image = this.__createImage();

  this.imageFormat = utils.getImageFormat(url) || 'image/jpeg';

  image.onload = function() {
    self.loadImageFromMemory(image);
    callback.call(self);
  };

  image.src = url;
};

/**
 * Crops the resultant image to the given width and height at the given x and y position.
 *
 * @param {Number} x, The x axis of the coordinate for the rectangle starting point
 * @param {Number} y, The y axis of the coordinate for the rectangle starting point
 * @param {Number} width, The rectangle's width
 * @param {Number} height, The rectangle's height
 * @return ImageClipper instance
 * */
ImageClipper.prototype.crop = function(x, y, width, height) {
  var canvas = this.canvas;
  var ctx = canvas.getContext('2d');

  // Get cropped pixel data
  var imageData = ctx.getImageData(x, y, width, height);

  // Create a temporary canvas to place cropped pixel data
  var tempcanvas = this.__createCanvas(width, height);
  var tempctx = tempcanvas.getContext('2d');

  tempctx.rect(0, 0, width, height);
  tempctx.fillStyle = 'white';
  tempctx.fill();
  tempctx.putImageData(imageData, 0, 0);

  // change context canvas
  this.canvas = tempcanvas;

  return this;
};

/**
* Write the resultant image to file.
*
* Note: in the Browser (not contain Electron & NW.js),
* this method is equivalent to toDataURL, callback will still be executed.
*
* @param {String} the path where the resultant image will be saved
* @param {Function} a function to be executed when saving is complete
* */
ImageClipper.prototype.toFile = function(path, callback) {
  var self = this;
  var imageFormat = self.imageFormat;

  this.toDataURL(function(dataUrl) {
    // return data url when using in browser
    if (isBrowser) {
      callback.call(self, dataUrl);
    }
    // Electron & NW.js & server Node.js
    else {
      this.dataUrlToFile(path, dataUrl, imageFormat, function() {
        callback.call(self);
      });
    }
  });

  return this;
};

ImageClipper.prototype.dataUrlToFile = function(path, dataUrl, imageFormat, callback) {
  var self = this;
  var base64 = dataUrl.replace('data:'+ imageFormat +';base64,', '');

  var dataBuffer = new Buffer(base64, 'base64');

  // create image binary file
  polyfills.writeFile(path, dataBuffer, function() {
    callback.call(self);
  });
};

/**
 * Resize the resultant image to the given width and height
 *
 * @param {Number} width, Number of pixels wide
 * @param {Number} height, Number of pixels high
 * @return ImageClipper instance
 * */
ImageClipper.prototype.resize = function(width, height) {
  var originalCanvas = this.canvas;
  var scaleX, scaleY;

  if (!arguments.length) throw new Error('resize() must be specified at least one parameter');

  // proportional scale when resize(width)
  if (arguments.length === 1) {
    // resize(null)
    if (!width) throw new Error('resize() inappropriate parameter');

    scaleX = width / originalCanvas.width;
    height = originalCanvas.height * scaleX;
  } else {
    // proportional scale when resize(null, height)
    if (!width && height) {
      scaleY = height / originalCanvas.height;
      width = originalCanvas.width * scaleY;
    }
  }

  var canvas = this.__createCanvas(width, height);
  var ctx = canvas.getContext('2d');

  ctx.drawImage(originalCanvas, 0, 0, width, height);

  // change context canvas
  this.canvas = canvas;

  return this;
};

/**
 * Removes rectangular pixels from the given width and height at the given x and y position.
 *
 * @param {Number} x, The x axis of the coordinate for the rectangle starting point
 * @param {Number} y, The y axis of the coordinate for the rectangle starting point
 * @param {Number} width, Number of pixels wide will be removed
 * @param {Number} height, Number of pixels high will be removed
 * @return ImageClipper instance
 * */
ImageClipper.prototype.clear = function(x, y, width, height) {
  var canvas = this.canvas;
  // Get target canvas's context
  var ctx = canvas.getContext('2d');

  // clear rect pixel
  ctx.clearRect(x, y, width, height);

  // Fill the cleared area with a white background
  ctx.fillStyle = '#fff';
  ctx.fillRect(x, y, width, height);

  return this;
};

/**
 * set quality level
 *
 * @param {Number | String} level
 * @return ImageClipper instance
 * */
ImageClipper.prototype.quality = function(level) {
  level = parseFloat(level);

  // this will always be between 'min' and 'max'
  level = utils.rangeNumber(level, this.minQualityLevel, this.maxQualityLevel);

  this.qualityLevel = level;

  return this;
};

/**
 * Return a string containing the data URI of current resultant canvas.
 *
 * @param {Number} quality
 * @param {Function} callback, optional in the Browser & Electron & NW.js, neccessary on the server Node.js
 * @return ImageClipper instance
 * */
ImageClipper.prototype.toDataURL = function(quality, callback) {
  var self = this;

  // toDataURL('68', function() {...})
  if (typeof quality === 'string') {
    quality = parseFloat(quality);
  }

  // toDataURL()
  if (arguments.length == 0) {
    quality = this.qualityLevel;
  }
  else if (arguments.length == 1) {
    // toDataURL(quality)
    if (typeof quality === 'number') {
      quality = utils.rangeNumber(quality, this.minQualityLevel, this.maxQualityLevel);
    }
    // toDataURL(callback)
    else if (typeof quality === 'function') {
      callback = quality;
      quality = this.qualityLevel;
    }
  }
  // toDataURL(quality, callback)
  else if (arguments.length == 2) {
    quality = utils.rangeNumber(quality, this.minQualityLevel, this.maxQualityLevel);
  }

  var canvas = this.canvas;
  var imageFormat = this.imageFormat;

  // Browsers & Electron & NW.js
  if (isSupportCanvas) {
    var dataUrl = canvas.toDataURL(imageFormat, quality);
    callback && callback.call(self, dataUrl);
    return dataUrl;
  }
  // server Node.js
  else {
    if (!callback) throw new Error('toDataURL(): callback must be specified');

    polyfills.toDataURL({
      canvas: canvas,
      imageFormat: imageFormat,
      quality: quality,
      bufsize: this.originalOptions.bufsize || 4096
    }, function(dataUrl) {
      callback.call(self, dataUrl);
    });
  }

  return this;
};

// get canvas
ImageClipper.prototype.getCanvas = function() {
  return this.canvas;
};

// destroy canvas
ImageClipper.prototype.destroy = function() {
  this.canvas = null;
  return this;
};

// reset canvas
ImageClipper.prototype.reset = function() {
  return this.destroy().loadImageFromMemory();
};

// inject node-canvas
ImageClipper.prototype.injectNodeCanvas = function(Canvas) {
  this.originalOptions.canvas = Canvas;
};

// create Canvas object
ImageClipper.prototype.__createCanvas = function(width, height) {
  var canvas, c;

  if (isSupportCanvas) {
    var document = window.document;
    c = document.createElement('canvas');
    c.width = width;
    c.height = height;
  } else {
    // Node.js
    canvas = this.originalOptions.canvas;
    if (canvas && canvas.Image) {
      c = new canvas(width, height);
    } else {
      throw new Error('Require node-canvas on the server-side Node.js');
    }
  }

  return c;
};

// create Image object
ImageClipper.prototype.__createImage = function() {
  var Image, img, canvas;

  if (isSupportCanvas) {
    Image = window.Image;
  } else {
    // Node.js
    canvas = this.originalOptions.canvas;
    if (canvas && canvas.Image) {
      Image = canvas.Image;
    } else {
      throw new Error('Require node-canvas on the server-side Node.js');
    }
  }

  img = new Image;

  return img;
};

// initialize setter
function initSetter(construct) {
  var keys = ['imageFormat', 'maxQualityLevel', 'minQualityLevel'];

  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];

    (function(k) {
      construct.prototype['set' + utils.upperCaseFirstLetter(k)] = function(v) {
        this[k] = v;
      };
    })(key);
  }
}

// init attribute setter
initSetter(ImageClipper);

// use in AMD environment
if(typeof define === 'function' && define.amd){
  define(function(){
    return ImageClipper;
  });
}
// use in browser
else if(typeof window !== 'undefined'){
  window.ImageClipper = ImageClipper;
}

module.exports = ImageClipper;