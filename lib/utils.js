
var utils = {};

// whether is browser
utils.isBrowser = function() {
  var isElectron = utils.isElectron();
  var isNW = utils.isNW();
  return !isElectron && !isNW && !(typeof window == 'undefined' || typeof navigator == 'undefined');
};

// whether is Node
utils.isNode = function() {
  return !(typeof process == 'undefined' || !process.platform || !process.versions);
};

// whether is NW.js (Node-webkit)
utils.isNW = function() {
  var isNode = utils.isNode();
  return isNode && !(typeof global == 'undefined' || !process.__node_webkit || !process.versions['node-webkit']);
};

// whether is Electron
utils.isElectron = function() {
  var isNode = utils.isNode();
  return isNode && !(typeof global == 'undefined' || !process.versions.electron);
};

// return a number between 'min' and 'max'
utils.rangeNumber = function(num, min, max) {
  return num > max ? max : num < min ? min : num;
};

// get image format
utils.getImageFormat = function(str) {
  var format = str.substr(str.lastIndexOf('.') + 1, str.length);
  format = format === 'jpg' ? 'jpeg' : format;
  return 'image/' + format;
};

// uppercase first letter
utils.upperCaseFirstLetter = function(str) {
  return str.replace(str.charAt(0), function(a) {
    return a.toUpperCase();
  });
};

module.exports = utils;
