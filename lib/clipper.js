'use strict'

var utils = require('./utils')
var polyfills = require('./polyfills')

// whether is Electron
var isElectron = utils.isElectron()

// whether is NW.js (Node-webkit)
var isNW = utils.isNW()

// whether is Browser
var isBrowser = utils.isBrowser()

// whether support canvas
var isSupportCanvas = isBrowser || isElectron || isNW

// constructor
function ImageClipper(options) {
  options = options || {}

  // instance properties
  this.options = {}

  // extend instance properties with global defaults and initial properties
  utils.extend(this.options, this.defaults, options)

  // the quality number requires special handling,
  // to ensure that the number will always be between 'min' and 'max'
  this.quality(this.options.quality)

  return this
}

ImageClipper.prototype.defaults = {
  canvas: null,
  // compression level, default: 92
  quality: 92,
  maxQuality: 100,
  minQuality: 1,
  // output buffer size in bytes for JPEG while using node-canvas
  bufsize: 4096
}

/**
 * load image from the memory.
 *
 * @param {Object} source, anything ctx.drawImage() accepts, usually HTMLImageElement
 * @return ImageClipper instance
 * */
ImageClipper.prototype.loadImageFromMemory = function(source) {
  var options = this.options

  source = source || this.originalImage

  var width = source.width
  var height = source.height

  var canvas = this.__createCanvas(width, height)
  var ctx = canvas.getContext('2d')

  ctx.drawImage(source, 0, 0, width, height)

  this.canvas = canvas
  options.imageFormat = options.imageFormat || utils.getImageFormat(source.src)

  if (!this.originalImage) {
    this.originalImage = source
  }

  return this
}

/**
 * Load image from the given path.
 *
 * @param {String} path, the path where the source image
 * @param {Function} callback, to be executed when loading is complete
 * */
ImageClipper.prototype.loadImageFromUrl = function(path, callback) {
  var self = this
  var options = this.options
  var image = this.__createImage()

  options.imageFormat = options.imageFormat || utils.getImageFormat(path)

  image.onload = function() {
    self.loadImageFromMemory(image)
    callback.call(self)
  }

  image.src = path
}

/**
 * Load image through loadImageFromUrl or loadImageFromMemory.
 *
 * @param {String | Image} source, the path where the source image
 * @param {Function} callback, to be executed when loading is complete
 * */
ImageClipper.prototype.image = function(source, callback) {
  var options = this.options

  var sourceType = utils.type(source)

  if (sourceType !== 'String' &&
      sourceType !== 'Image' &&
      sourceType !== 'HTMLImageElement') {
    throw new Error('invalid arguments')
  }

  // imageClipper('path/to/image.jpg')
  if (sourceType === 'String') {
    if (!callback) {
      throw new Error('callback must be specified when load from path')
    }

    options.imageFormat = options.imageFormat || utils.getImageFormat(source)

    this.loadImageFromUrl(source, function() {
      callback.call(this)
    })
  }
  // imageClipper(Canvas.Image) or imageClipper(new Image),
  // Object.prototype.toString.call(Canvas.Image) on the server-side Node.js will return '[Object Image]',
  // Object.prototype.toString.call(new Image) in Browser will return '[Object HTMLImageElement]'
  else if (sourceType === 'Image' || sourceType === 'HTMLImageElement') {
    options.imageFormat = options.imageFormat || utils.getImageFormat(source.src)

    this.loadImageFromMemory(source)

    if (callback && utils.type(callback) === 'Function') {
      callback.call(this)
      console.warn('No need to specify callback when load from memory, please use chain-capable method directly like this: clipper(Image).crop(...).resize(...)')
    }

    return this
  }
}

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
  var canvas = this.canvas
  var ctx = canvas.getContext('2d')

  // Get cropped pixel data
  var imageData = ctx.getImageData(x, y, width, height)

  // Create a temporary canvas to place cropped pixel data
  var tempcanvas = this.__createCanvas(width, height)
  var tempctx = tempcanvas.getContext('2d')

  tempctx.rect(0, 0, width, height)
  tempctx.fillStyle = 'white'
  tempctx.fill()
  tempctx.putImageData(imageData, 0, 0)

  // change context canvas
  this.canvas = tempcanvas

  return this
}

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
  var self = this
  var options = this.options
  var imageFormat = options.imageFormat

  this.toDataURL(function(dataUrl) {
    // return data URI while using in browser
    if (isBrowser) {
      callback.call(self, dataUrl)
    }
    // Electron & NW.js & server-side Node.js
    else {
      this.dataUrlToFile(path, dataUrl, imageFormat, function() {
        callback.call(self)
      })
    }
  })

  return this
}

ImageClipper.prototype.dataUrlToFile = function(path, dataUrl, imageFormat, callback) {
  var self = this
  var base64 = dataUrl.replace('data:' + imageFormat + ';base64,', '')

  var dataBuffer = new Buffer(base64, 'base64')

  // create image binary file
  polyfills.writeFile(path, dataBuffer, function() {
    callback.call(self)
  })
}

/**
 * Resize the resultant image to the given width and height
 *
 * @param {Number} width, Number of pixels wide
 * @param {Number} height, Number of pixels high
 * @return ImageClipper instance
 * */
ImageClipper.prototype.resize = function(width, height) {
  var originalCanvas = this.canvas
  var scaleX, scaleY

  if (!arguments.length) {
    throw new Error('resize() must be specified at least one parameter')
  }

  // proportional scale when resize(width)
  if (arguments.length === 1) {
    // resize(null)
    if (!width) {
      throw new Error('resize() inappropriate parameter')
    }

    scaleX = width / originalCanvas.width
    height = originalCanvas.height * scaleX
  } else {
    // proportional scale when resize(null, height)
    if (!width && height) {
      scaleY = height / originalCanvas.height
      width = originalCanvas.width * scaleY
    }
  }

  var canvas = this.__createCanvas(width, height)
  var ctx = canvas.getContext('2d')

  ctx.drawImage(originalCanvas, 0, 0, width, height)

  // change context canvas
  this.canvas = canvas

  return this
}

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
  var canvas = this.canvas
  // get target canvas's context
  var ctx = canvas.getContext('2d')

  // clear rect pixel
  ctx.clearRect(x, y, width, height)

  // fill the cleared area with a white background
  ctx.fillStyle = '#fff'
  ctx.fillRect(x, y, width, height)

  return this
}

/**
 * Adjusts the jpeg and webp compression level.
 *
 * @param {Number | String} level, a Number between 1 and 100 indicating image quality
 * @return ImageClipper instance
 * */
ImageClipper.prototype.quality = function(level) {
  if (utils.type(level) !== 'Number' && utils.type(level) !== 'String') {
    throw new Error('Invalid arguments')
  }

  if (!level) {
    return this
  }

  var options = this.options

  level = parseFloat(level)

  // this will always be between 'min' and 'max'
  level = utils.rangeNumber(level, options.minQuality, options.maxQuality)

  options.quality = level

  return this
}

/**
 * Return a string containing the data URI of current resultant canvas.
 *
 * @param {Number} quality
 * @param {Function} callback, optional in the Browser & Electron & NW.js, neccessary on the server-side Node.js
 * @return ImageClipper instance
 * */
ImageClipper.prototype.toDataURL = function(quality, callback) {
  var self = this
  var options = this.options
  var qualityLevel = options.quality
  var minQuality = options.minQuality
  var maxQuality = options.maxQuality
  var imageFormat = options.imageFormat
  var bufsize = options.bufsize

  // toDataURL('68', function() {...})
  if (typeof quality === 'string') {
    quality = parseFloat(quality)
  }

  // toDataURL()
  if (arguments.length === 0) {
    quality = qualityLevel
  }
  else if (arguments.length === 1) {
    // toDataURL(quality)
    if (typeof quality === 'number') {
      quality = utils.rangeNumber(quality, minQuality, maxQuality)
    }
    // toDataURL(callback)
    else if (typeof quality === 'function') {
      callback = quality
      quality = qualityLevel
    }
  }
  // toDataURL(quality, callback)
  else if (arguments.length === 2) {
    quality = utils.rangeNumber(quality, minQuality, maxQuality)
  }

  var canvas = this.canvas

  // Browsers & Electron & NW.js
  if (isSupportCanvas) {
    var dataUrl = canvas.toDataURL(imageFormat, quality / 100)
    callback && callback.call(this, dataUrl)
    return dataUrl
  }
  // server-side Node.js
  else {
    if (!callback) {
      throw new Error('toDataURL(): callback must be specified')
    }

    polyfills.toDataURL({
      canvas: canvas,
      imageFormat: imageFormat,
      quality: quality,
      bufsize: bufsize
    }, function(dataUrl) {
      callback.call(self, dataUrl)
    })
  }

  return this
}

/**
 * configure instance properties
 * this will override the global settings
 *
 * support both configure(name, value) and configure({name: value})
 * @param {String | Object} name, property name or properties list
 * @param {String | Undefined} value, property value or nothing
 * */
ImageClipper.prototype.configure = function(name, value) {
  var options = this.options

  utils.setter(options, name, value)

  // the quality number requires special handling,
  // to ensure that the number will always be between 'min' and 'max'
  if (options.quality) {
    this.quality(options.quality)
  }

  return this
}

// get canvas
ImageClipper.prototype.getCanvas = function() {
  return this.canvas
}

// destroy canvas
ImageClipper.prototype.destroy = function() {
  this.canvas = null
  return this
}

// reset canvas
ImageClipper.prototype.reset = function() {
  return this.destroy().loadImageFromMemory()
}

// inject canvas implementation library
// tiis will override the global settings
ImageClipper.prototype.injectNodeCanvas = function(canvas) {
  if (typeof canvas !== 'undefined') {
    this.options.canvas = canvas
  }
}

// create Canvas object
ImageClipper.prototype.__createCanvas = function(width, height) {
  var c

  if (isSupportCanvas) {
    var document = window.document
    c = document.createElement('canvas')
    c.width = width
    c.height = height
  } else {
    // Node.js
    var canvas = this.options.canvas
    if (canvas && canvas.createCanvas) {
      c = canvas.createCanvas(width, height)
    } else {
      throw new Error('Require node-canvas on the server-side Node.js')
    }
  }

  return c
}

// create Image object
ImageClipper.prototype.__createImage = function() {
  var Image, img

  if (isSupportCanvas) {
    Image = window.Image
  } else {
    // Node.js
    var canvas = this.options.canvas
    if (canvas && canvas.Image) {
      Image = canvas.Image
    } else {
      throw new Error('Require node-canvas on the server-side Node.js')
    }
  }

  img = new Image

  return img
}

/**
 * configure global default properties
 * properties changed in this object (same properties configurable through the constructor)
 * will take effect for every instance created after the change
 *
 * support both configure(name, value) and configure({name: value})
 * @param {String | Object} name, property name or properties list
 * @param {String | Undefined} value, property value or nothing
 * */
ImageClipper.__configure = function(name, value) {
  var defaults = ImageClipper.prototype.defaults

  utils.setter(defaults, name, value)

  // the quality number requires special handling,
  // to ensure that the number will always be between 'min' and 'max'
  if (defaults.quality) {
    defaults.quality = utils.rangeNumber(defaults.quality, defaults.minQuality, defaults.maxQuality)
  }
}

module.exports = ImageClipper