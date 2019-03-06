'use strict'

var Clipper = require('./clipper')
var utils = require('./utils')

// Clipper factory
function imageClipper(source, options, callback) {
  var clipper

  switch (arguments.length) {
    // imageClipper()
    case 0:
      clipper = new Clipper()
      break

    // imageClipper(Image) || imageClipper({...})
    case 1:
      // imageClipper({...})
      if (utils.type(source) === 'Object') {
        clipper = new Clipper(source)
      }
      else {
        clipper = new Clipper()
        clipper.image(source)
      }

      break

    // imageClipper('path/to/image.jpg', callback)
    case 2:
      callback = options
      options = null

      clipper = new Clipper()

      clipper.image(source, function() {
        callback.call(this)
      })
      break

    // imageClipper('path/to/image.jpg', {...}, callback)
    default:
      if (utils.type(options) !== 'Object') {
        throw new Error('invalid arguments')
      }

      clipper = new Clipper(options)

      clipper.image(source, function() {
        callback.call(this)
      })
  }

  return clipper
}

// Configure default properties
imageClipper.configure = function(name, value) {
  Clipper.__configure(name, value)
}

// Export the imageClipper object for Node.js, with
// backwards-compatibility for their old module API.
exports = module.exports = imageClipper
exports.imageClipper = imageClipper

// If we're in the browser,
// define it if we're using AMD, otherwise leak a global.
if (typeof define === 'function' && define.amd) {
  define(function() {
    return imageClipper
  })
} else if (typeof window !== 'undefined' || typeof navigator !== 'undefined') {
  window.imageClipper = imageClipper
}