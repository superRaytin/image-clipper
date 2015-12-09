
var fs = require('fs');
var Canvas = require('canvas');
var should = require('should');
var ImageClipper = require('../lib/index');
var utils = require('../lib/utils');

var jpgImagePath = './example/house.jpg';
var pngImagePath = './example/building.png';
var exportDir = './example/';
var deleteTempFile = true;

var x = 20;
var y = 20;
var width = 100;
var height = 100;

describe('image-clipper tests with node-canvas', function() {
  it('loadImageFromUrl(url, function() {...}) works', function(done) {
    var clipper = new ImageClipper({
      canvas: Canvas
    });
    clipper.loadImageFromUrl(jpgImagePath, function() {
      var initialized = !!(this.canvas && this.imageFormat);
      initialized.should.equal(true);
      done();
    });
  });

  it('loadImageFromMemory(img).crop(...) works', function(done) {
    var clipper = new ImageClipper({
      canvas: Canvas
    });
    var img = new Canvas.Image;
    img.onload = function() {
      clipper.loadImageFromMemory(img).crop(x, y, width, height).toDataURL(function(dataUrl) {
        should.exist(dataUrl);
        dataUrl.indexOf('data:image/png;base64,').should.equal(0);
        done();
      });
    };
    img.src = pngImagePath;
  });

  it('destroy() works', function(done) {
    var clipper = new ImageClipper({
      canvas: Canvas
    });
    clipper.loadImageFromUrl(pngImagePath, function() {
      clipper.destroy();
      should(clipper.canvas).equal(null);
      done();
    });

  });

  it('reset() works', function(done) {
    var clipper = new ImageClipper({
      canvas: Canvas
    });
    clipper.loadImageFromUrl(pngImagePath, function() {
      clipper.destroy();
      should(clipper.canvas).equal(null);
      clipper.reset();
      should(clipper.canvas).not.eql(null);
      should(clipper.imageFormat).not.eql(null);
      done();
    });
  });

  it('clear(x, y, width, height) works', function(done) {
    var clipper = new ImageClipper({
      canvas: Canvas
    });
    clipper.loadImageFromUrl(pngImagePath, function() {
      this.clear(50, 50, 100, 100)
          .crop(20, 20, 200, 200)
          .toFile(exportDir + 'output7.png', function() {
            deleteTempFile && deleteFile(exportDir + 'output7.png');
            done();
          });
    });
  });

  it('setImageFormat(imageFormat) works', function() {
    var clipper = new ImageClipper();
    clipper.setImageFormat('image/jpeg');
    clipper.imageFormat.should.equal('image/jpeg');
  });

  it('injectNodeCanvas(Canvas) works', function(done) {
    var clipper = new ImageClipper();
    clipper.injectNodeCanvas(Canvas);
    clipper.loadImageFromUrl(jpgImagePath, function() {
      this.crop(x, y, width, height).toDataURL(function(dataUrl) {
        should.exist(dataUrl);
        dataUrl.indexOf('data:image/jpeg;base64,').should.equal(0);
        done();
      });
    });
  });

  it('new ImageClipper() throws', function(done) {
    var clipper = new ImageClipper();
    try {
      clipper.loadImageFromUrl(pngImagePath, function() {
        done();
      });
    } catch (e) {
      e.message.should.equal('Require node-canvas on the server-side Node.js');
      done();
    }
  });

  it('new ImageClipper({canvas: 12}) throws', function(done) {
    var clipper = new ImageClipper({
      canvas: 12
    });
    try {
      clipper.loadImageFromUrl(pngImagePath, function() {
        done();
      });
    } catch (e) {
      e.message.should.equal('Require node-canvas on the server-side Node.js');
      done();
    }
  });

});

describe('crop', function() {
  it('crop(x, y, width, height) works', function(done) {
    var clipper = new ImageClipper({
      canvas: Canvas
    });
    clipper.loadImageFromUrl(jpgImagePath, function() {
      this.crop(x, y, width, height);
      this.canvas.width.should.equal(width);
      this.canvas.height.should.equal(height);
      done();
    });
  });

  it('crop(x, y, width, height).toDataURL(function(dataUrl) {...}) works', function(done) {
    var clipper = new ImageClipper({
      canvas: Canvas
    });
    clipper.loadImageFromUrl(jpgImagePath, function() {
      this.crop(x, y, width, height).toDataURL(function(dataUrl) {
        should.exist(dataUrl);
        dataUrl.indexOf('data:image/jpeg;base64,').should.equal(0);
        done();
      });
    });
  });

  it('crop(x, y, width, height).resize(width2, height2) works', function(done) {
    var clipper = new ImageClipper({
      canvas: Canvas
    });
    clipper.loadImageFromUrl(jpgImagePath, function() {
      this.crop(x, y, width, height).resize(50, 50);
      this.canvas.width.should.equal(50);
      this.canvas.height.should.equal(50);
      done();
    });
  });

  it('crop(x, y, width, height).toFile(...) works', function(done) {
    var clipper = new ImageClipper({
      canvas: Canvas,
      quality: 30
    });
    clipper.loadImageFromUrl(jpgImagePath, function() {
      this.crop(x, y, width, height).toFile(exportDir + 'output5.jpg', function() {
        deleteTempFile && deleteFile(exportDir + 'output5.jpg');
        done();
      });
    });
  });

  it('crop(x, y, width, height).resize(width2, height2).toFile(...) works', function(done) {
    var clipper = new ImageClipper({
      canvas: Canvas
    });
    clipper.loadImageFromUrl(jpgImagePath, function() {
      this.crop(x, y, width, height).resize(50, 50).toFile(exportDir + 'output5-1.jpg', function() {
        deleteTempFile && deleteFile(exportDir + 'output5-1.jpg');
        done();
      });
    });
  });
});

describe('toDataURL', function() {
  it('toDataURL() throws', function(done) {
    var clipper = new ImageClipper({
      canvas: Canvas
    });
    clipper.loadImageFromUrl(jpgImagePath, function() {
      try {
        this.toDataURL();
      } catch (e) {
        e.message.should.equal('toDataURL(): callback must be specified');
        done();
      }
    });
  });

  it('toDataURL(quality) throws', function(done) {
    var clipper = new ImageClipper({
      canvas: Canvas
    });
    clipper.loadImageFromUrl(jpgImagePath, function() {
      try {
        this.toDataURL(30);
      } catch (e) {
        e.message.should.equal('toDataURL(): callback must be specified');
        done();
      }
    });
  });

  it('toDataURL(callback) works', function(done) {
    var clipper = new ImageClipper({
      canvas: Canvas
    });
    clipper.loadImageFromUrl(jpgImagePath, function() {
      this.toDataURL(function(dataUrl) {
        dataUrl.indexOf('data:image/jpeg;base64,').should.equal(0);
        done();
      });
    });
  });

  it('toDataURL(quality, callback) works', function(done) {
    var clipper = new ImageClipper({
      canvas: Canvas
    });
    clipper.loadImageFromUrl(jpgImagePath, function() {
      this.toDataURL(30, function(dataUrl) {
        dataUrl.indexOf('data:image/jpeg;base64,').should.equal(0);
        done();
      });
    });
  });
});

describe('resize', function() {
  it('resize(width, height) works', function(done) {
    var clipper = new ImageClipper({
      canvas: Canvas,
      quality: 98
    });
    clipper.loadImageFromUrl(pngImagePath, function() {
      this.resize(100, 100);
      this.canvas.width.should.equal(100);
      this.canvas.height.should.equal(100);
      done();
    });
  });

  it('resize(width) works', function(done) {
    var clipper = new ImageClipper({
      canvas: Canvas,
      quality: 98
    });
    clipper.loadImageFromUrl(pngImagePath, function() {
      this.resize(100);
      this.canvas.width.should.equal(100);
      this.canvas.height.should.equal(100);
      done();
    });
  });

  it('resize() throws', function(done) {
    var clipper = new ImageClipper({
      canvas: Canvas,
      quality: 98
    });
    try {
      clipper.resize();
    } catch (e) {
      e.message.should.equal('resize() must be specified at least one parameter');
      done();
    }
  });

  it('resize(width, height).toFile(path, function() {...}) works', function(done) {
    var clipper = new ImageClipper({
      canvas: Canvas,
      quality: 98
    });
    clipper.loadImageFromUrl(pngImagePath, function() {
      this.resize(100, 100).toFile(exportDir + 'output6.png', function() {
        deleteTempFile && deleteFile(exportDir + 'output6.png');
        done();
      });
    });
  });

  it('resize(width).toFile(path, function() {...}) works', function(done) {
    var clipper = new ImageClipper({
      canvas: Canvas,
      quality: 92
    });
    clipper.loadImageFromUrl(jpgImagePath, function() {
      this.resize(800).toFile(exportDir + 'output6-2.jpg', function() {
        deleteTempFile && deleteFile(exportDir + 'output6-2.jpg');
        done();
      });
    });
  });
});

describe('quality', function() {
  it('quality(level) works', function() {
    var clipper = new ImageClipper();
    clipper.quality(68);
    clipper.qualityLevel.should.equal(68);

    clipper.quality(1);
    clipper.qualityLevel.should.equal(1);
    clipper.quality(92);
    clipper.qualityLevel.should.equal(92);
  });

  it('works when quality level > max quality level', function() {
    var clipper = new ImageClipper();
    clipper.quality(101);
    clipper.qualityLevel.should.equal(clipper.maxQualityLevel);
    clipper.quality(92.2);
    clipper.qualityLevel.should.equal(clipper.maxQualityLevel);
  });

  it('works when quality level < min quality level', function() {
    var clipper = new ImageClipper();
    clipper.quality(0.1);
    clipper.qualityLevel.should.equal(clipper.minQualityLevel);
    clipper.quality(-1);
    clipper.qualityLevel.should.equal(clipper.minQualityLevel);
    clipper.quality(0);
    clipper.qualityLevel.should.equal(clipper.minQualityLevel);
  });
});

describe('utils', function() {
  it('isBrowser() works', function() {
    should(utils.isBrowser()).equal(false);
  });

  it('isNode() works', function() {
    should(utils.isNode()).equal(true);
  });

  it('isNW() works', function() {
    should(utils.isNW()).equal(false);
  });

  it('isElectron() works', function() {
    should(utils.isElectron()).equal(false);
  });

  it('rangeNumber(num, min, max) works', function() {
    utils.rangeNumber(10, 1, 92).should.equal(10);
    utils.rangeNumber(1, 1, 92).should.equal(1);
    utils.rangeNumber(-1, 1, 92).should.equal(1);
    utils.rangeNumber(0, 1, 92).should.equal(1);
    utils.rangeNumber(92, 1, 92).should.equal(92);
    utils.rangeNumber(100, 1, 92).should.equal(92);
    utils.rangeNumber(91, 1, 92).should.equal(91);
  });

  it('getImageFormat(str) works', function() {
    utils.getImageFormat(jpgImagePath).should.equal('image/jpeg');
    utils.getImageFormat(pngImagePath).should.equal('image/png');
  });

  it('upperCaseFirstLetter(str) works', function() {
    utils.upperCaseFirstLetter('apple').should.equal('Apple');
  });
});

function deleteFile(path) {
  fs.unlink(path, function(err) {
    if (err) throw err;
  });
}