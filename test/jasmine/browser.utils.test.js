
var jpgImagePath = '../../example/house.jpg';
var pngImagePath = '../../example/building.png';

var utils = {};

// uppercase first letter
utils.upperCaseFirstLetter = function(str) {
  return str.replace(str.charAt(0), function(a) {
    return a.toUpperCase();
  });
};

// get image format
utils.getImageFormat = function(str) {
  var format = str.substr(str.lastIndexOf('.') + 1, str.length);
  format = format === 'jpg' ? 'jpeg' : format;
  return 'image/' + format;
};

// whether is browser
utils.isBrowser = function() {
  var isElectron = utils.isElectron();
  var isNW = utils.isNW();
  return !isElectron && !isNW && !(typeof window == 'undefined' || typeof navigator == 'undefined');
};

// whether is in Node
utils.isNode = function() {
  return !(typeof process == 'undefined' || !process.platform || !process.versions);
};

// whether is NW.js (Node-webkit)
utils.isNW = function() {
  var isNode = utils.isNode();
  return isNode && !(typeof global == 'undefined' || !global.gui || !global.gui.Menu);
};

// whether is NW.js (Node-webkit)
utils.isElectron = function() {
  var isNode = utils.isNode();
  return isNode && !(typeof global == 'undefined' || !process.versions.electron);
};

// return min ~ max number
utils.rangeNumber = function(num, min, max) {
  return num > max ? max : num < min ? min : num;
};

describe('utils', function() {
  it('isBrowser() works', function() {
    expect(utils.isBrowser()).toEqual(true);
  });

  it('isNode() works', function() {
    expect(utils.isNode()).toEqual(false);
  });

  it('isNW() works', function() {
    expect(utils.isNW()).toEqual(false);
  });

  it('isElectron() works', function() {
    expect(utils.isElectron()).toEqual(false);
  });

  it('rangeNumber(num, min, max) works', function() {
    expect(utils.rangeNumber(10, 1, 92)).toEqual(10);
    expect(utils.rangeNumber(1, 1, 92)).toEqual(1);
    expect(utils.rangeNumber(-1, 1, 92)).toEqual(1);
    expect(utils.rangeNumber(0, 1, 92)).toEqual(1);
    expect(utils.rangeNumber(92, 1, 92)).toEqual(92);
    expect(utils.rangeNumber(100, 1, 92)).toEqual(92);
    expect(utils.rangeNumber(91, 1, 92)).toEqual(91);
  });

  it('getImageFormat(str) works', function() {
    expect(utils.getImageFormat(jpgImagePath)).toEqual('image/jpeg');
    expect(utils.getImageFormat(pngImagePath)).toEqual('image/png');
  });

  it('upperCaseFirstLetter(str) works', function() {
    expect(utils.upperCaseFirstLetter('apple')).toEqual('Apple');
  });
});