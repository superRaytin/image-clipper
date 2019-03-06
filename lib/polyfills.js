'use strict'

var fs = require('fs')
var polyfills = {}

// write an image to file
polyfills.writeFile = function(path, dataBuffer, callback) {
  fs.writeFile(path, dataBuffer, function(err) {
    if (err) {
      throw err
    }

    callback()
  })
}

// return a string containing the data URI of current resultant canvas.
polyfills.toDataURL = function(options, callback) {
  var canvas = options.canvas
  var imageFormat = options.imageFormat
  var quality = options.quality
  var bufsize = options.bufsize

  if (imageFormat === 'image/jpeg') {
    // JPEG quality number support 1 ~ 100
    canvas.toDataURL(imageFormat, {quality: quality, bufsize: bufsize}, function(err, str) {
      if (err) {
        throw err
      }

      callback(str)
    })

  } else {
    // PNG doesn't support quality setting
    canvas.toDataURL(imageFormat, function(err, str) {
      if (err) {
        throw err
      }

      callback(str)
    })
  }
}

module.exports = polyfills
