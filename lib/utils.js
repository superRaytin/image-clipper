
var utils = {};

// get image format
utils.getImageFormat = function(str) {
  var format = str.substr(str.lastIndexOf('.') + 1, str.length);

  // 震惊：image/jpg 切出来的图片文件比 image/jpeg 大将近 10 倍！
  format = format === 'jpg' ? 'jpeg' : format;

  return 'image/' + format;
};

// uppercase first
utils.upperCase = function(str) {
  return str.replace(str.charAt(0), function(a) {
    return a.toUpperCase();
  });
};

// whether is browser
utils.isBrowser = function() {
  return typeof window !== 'undefined' && typeof navigator !== 'undefined';
};

// whether support Image Object
utils.supportImageObj = function() {
  return typeof Image !== 'undefined';
};

// whether is Electron or NW.js (Node-webkit)
utils.isElectronOrNW = function() {
  var isBrowser = utils.isBrowser();
  return isBrowser &&
      typeof global !== 'undefined' &&
      typeof process !== 'undefined' && typeof process.platform !== 'undefined';
};

module.exports = utils;
