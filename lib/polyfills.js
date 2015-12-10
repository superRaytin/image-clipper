
var fs = require('fs');
var utils = require('./utils');
var polyfills = {};

// whether is Electron
var isElectron = utils.isElectron();

// whether is NW.js (Node-webkit)
var isNW = utils.isNW();

// whether is Browser
var isBrowser = utils.isBrowser();

// whether support canvas
var isSupportCanvas = isBrowser || isElectron || isNW;

// write an image to file
polyfills.writeFile = function(path, dataBuffer, callback) {
  fs.writeFile(path, dataBuffer, function(err) {
    if (err) throw(err);
    callback();
  });
};

// return a string containing the data URI of current resultant canvas.
polyfills.toDataURL = function(options, callback) {
  var canvas = options.canvas;
  var imageFormat = options.imageFormat;
  var quality = options.quality;
  var bufsize = options.bufsize;

  if (isSupportCanvas) {
    var dataUrl = canvas.toDataURL(imageFormat, quality / 100);
    callback(dataUrl);

  } else {
    if (imageFormat === 'image/jpeg') {
      // JPEG quality number support 1 ~ 100
      canvas.toDataURL(imageFormat, {quality: quality, bufsize: bufsize}, function(err, str) {
        if (err) throw err;
        callback(str);
      });

    } else {
      // PNG doesn't support quality setting
      canvas.toDataURL(imageFormat, function(err, str) {
        if (err) throw err;
        callback(str);
      });
    }
  }

};

module.exports = polyfills;
