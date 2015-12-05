var fs = require('fs');
var utils = require('./utils');

// constructor
function ImageClipper(options) {
  options = options || {};

  this.maxQualityLevel = options.maxQualityLevel || 0.92;
  this.minQualityLevel = options.minQualityLevel || 0.01;
  this.qualityLevel = options.quality || this.maxQualityLevel;

  return this;
}

/**
 * load image from memory
 *
 * @param {Object} image, Image Object
 * @return ImageClipper instance
 * */
ImageClipper.prototype.loadImageFromMemory = function(image) {
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');

  image = image || this.originalImage;

  var width = image.width;
  var height = image.height;
  var imageUrl = image.getAttribute('src');

  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(image, 0, 0, width, height);

  this.canvas = canvas;
  this.imageFormat = this.imageFormat || utils.getImageFormat(imageUrl) || 'image/jpeg';

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
  var image = new Image();

  image.onload = function() {
    self.loadImageFromMemory(image);
    callback.call(self);
  };

  image.src = url;
};

/**
 * crop canvas area and pass data url to callback
 *
 * @param {Number} x, The x axis of the coordinate for the rectangle starting point
 * @param {Number} y, The y axis of the coordinate for the rectangle starting point
 * @param {Number} width, The rectangle's width
 * @param {Number} height, The rectangle's height
 * @param {Function} callback
 *    function(dataUrl)
 *    @param {String} dataUrl, data url of crop area
 * */
ImageClipper.prototype.crop = function(x, y, width, height, callback) {
  var dataUrl = this.getCropDataUrl(x, y, width, height);
  callback.call(this, dataUrl);
};

ImageClipper.prototype.getCropDataUrl = function(x, y, width, height) {
  var imageFormat = this.imageFormat;
  var quality = this.qualityLevel;

  var canvas = this.canvas;
  var ctx = canvas.getContext('2d');

  // Get cropped pixel data
  var imageData = ctx.getImageData(x, y, width, height);

  // Create a temporary canvas to place cropped pixel data
  var tempcanvas = document.createElement('canvas');
  var tempctx = tempcanvas.getContext('2d');

  tempcanvas.width = width;
  tempcanvas.height = height;

  tempctx.rect(0, 0, width, height);
  tempctx.fillStyle = 'white';
  tempctx.fill();
  tempctx.putImageData(imageData, 0, 0);

  var dataUrl = tempcanvas.toDataURL(imageFormat, quality);

  tempcanvas = tempctx = null;

  return dataUrl;
};

/**
* convert data url to binary image file
*
* @param {String} path
* @param {String} dataUrl, optional
* @param {Function} callback
* */
ImageClipper.prototype.toFile = function(path, dataUrl, callback) {

  if (arguments.length === 2) {
    callback = dataUrl;
    dataUrl = this.toDataUrl();
  }

  // return data url when using in browser
  var isElectronOrNW = utils.isElectronOrNW();
  if (!isElectronOrNW) {
    callback.call(this, dataUrl);
    return dataUrl;
  }

  var imageFormat = this.imageFormat;
  var imgbase64 = dataUrl.replace('data:'+ imageFormat +';base64,', '')
      .replace('data:image/jpg;base64,', '');

  var dataBuffer = new Buffer(imgbase64, 'base64');

  // create image file
  fs.writeFile(path, dataBuffer, function(err) {
    if (err) {
      return console.log(err);
    }

    callback.call(this);
  });
};

/**
 * clear canvas area
 *
 * @param {Number} x, The x axis of the coordinate for the rectangle starting point
 * @param {Number} y, The y axis of the coordinate for the rectangle starting point
 * @param {Number} width, The rectangle's width
 * @param {Number} height, The rectangle's height
 * @return ImageClipper instance
 * */
ImageClipper.prototype.clearArea = function(x, y, width, height) {
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
 * set quality
 *
 * @param {Number | String} level
 * @return ImageClipper instance
 * */
ImageClipper.prototype.quality = function(level) {
  level = parseFloat(level);

  // 0.01 ~ 0.92
  level = level > 0.92 ? 0.92 : level < 0.01 ? 0.01 : level;

  this.qualityLevel = level;

  return this;
};

// convert to data url
ImageClipper.prototype.toDataUrl = function(quality) {
  quality = quality || this.qualityLevel;

  var canvas = this.canvas;
  var imageFormat = this.imageFormat;

  return canvas.toDataURL(imageFormat, quality);
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

// initialize setter
function initSetter(construct) {
  var keys = ['imageFormat'];

  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];

    (function(k) {
      construct.prototype['set' + utils.upperCase(k)] = function(v) {
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