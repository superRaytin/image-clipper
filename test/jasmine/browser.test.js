
var jpgImagePath = '../../example/house.jpg';
var pngImagePath = '../../example/building.png';
var exportDir = '../../example/';
var pushToBody = false;

var x = 20;
var y = 20;
var width = 100;
var height = 100;

function createDOM(dataUrl) {
  var img = new Image();
  img.src = dataUrl;
  document.body.appendChild(img);
}

describe('image-clipper tests in the Browser & Electron & NW.js (Node-webkit)', function() {
  it('loadImageFromUrl(url, function() {...}) works', function(done) {
    var clipper = new ImageClipper();
    clipper.loadImageFromUrl(jpgImagePath, function() {
      var initialized = !!(this.canvas && this.imageFormat);
      expect(initialized).toBe(true);
      done();
    });
  });

  it('loadImageFromMemory(img).crop(...) works', function(done) {
    var clipper = new ImageClipper({
      canvas: 11
    });
    var img = new Image();
    img.onload = function() {
      clipper.loadImageFromMemory(img).crop(x, y, width, height).toDataURL(function(dataUrl) {
        //should.exist(dataUrl);
        expect(dataUrl.indexOf('data:image/png;base64,')).toEqual(0);
        done();
      });
    };
    img.src = pngImagePath;
  });

  it('destroy() works', function(done) {
    var clipper = new ImageClipper();

    clipper.loadImageFromUrl(jpgImagePath, function() {
      clipper.destroy();
      expect(clipper.canvas).toEqual(null);
      done();
    });
  });

  it('reset() works', function(done) {
    var clipper = new ImageClipper();

    clipper.loadImageFromUrl(jpgImagePath, function() {
      clipper.destroy();
      expect(clipper.canvas).toEqual(null);
      clipper.reset();
      expect(clipper.canvas).not.toBe(null);
      expect(clipper.imageFormat).not.toBe(null);
      done();
    });
  });

  it('clear(x, y, width, height) works', function(done) {
    var clipper = new ImageClipper();
    clipper.loadImageFromUrl(pngImagePath, function() {
      this.clear(50, 50, 100, 100)
          .crop(20, 20, 200, 200)
          .toDataURL(function(dataUrl) {
            pushToBody && createDOM(dataUrl);
            expect(dataUrl.indexOf('data:image/png;base64,')).toEqual(0);
            done();
          });
    });
  });

  it('setImageFormat(imageFormat) works', function() {
    var clipper = new ImageClipper();
    clipper.setImageFormat('image/png');
    expect(clipper.imageFormat).toEqual('image/png');
  });

});

describe('crop', function() {
  it('crop(x, y, width, height) works', function(done) {
    var clipper = new ImageClipper();
    clipper.loadImageFromUrl(jpgImagePath, function() {
      this.crop(x, y, width, height);
      expect(this.canvas.width).toEqual(width);
      expect(this.canvas.height).toEqual(height);
      done();
    });
  });

  it('crop(x, y, width, height).toDataURL(function(dataUrl) {...}) works', function(done) {
    var clipper = new ImageClipper();
    clipper.loadImageFromUrl(jpgImagePath, function() {
      this.crop(x, y, width, height).toDataURL(function(dataUrl) {
        // should > 'data:image/jpeg;base64,'.length
        //expect(dataUrl.length).toBeGreaterThan(23);
        expect(dataUrl.indexOf('data:image/jpeg;base64,')).toEqual(0);
        done();
      });
    });
  });

  it('crop(x, y, width, height).resize(width2, height2) works', function(done) {
    var clipper = new ImageClipper();
    clipper.loadImageFromUrl(jpgImagePath, function() {
      this.crop(x, y, width, height).resize(50, 50);
      expect(this.canvas.width).toEqual(50);
      expect(this.canvas.height).toEqual(50);
      done();
    });
  });

  it('crop(x, y, width, height).toFile(...) works', function(done) {
    var clipper = new ImageClipper();
    clipper.loadImageFromUrl(jpgImagePath, function() {
      this.crop(x, y, width, height).toFile(exportDir + 'output.jpg', function(dataUrl) {
        expect(dataUrl.indexOf('data:image/jpeg;base64,')).toEqual(0);
        pushToBody && createDOM(dataUrl);
        done();
      });
    });
  });

  it('crop(x, y, width, height).resize(width2, height2).toFile(...) works', function(done) {
    var clipper = new ImageClipper();
    clipper.loadImageFromUrl(jpgImagePath, function() {
      this.crop(x, y, width, height).resize(50, 50).toFile(exportDir + 'output.jpg', function(dataUrl) {
        expect(dataUrl.indexOf('data:image/jpeg;base64,')).toEqual(0);
        pushToBody && createDOM(dataUrl);
        done();
      });
    });
  });
});

describe('toDataURL', function() {
  it('toDataURL() works', function(done) {
    var clipper = new ImageClipper();
    clipper.loadImageFromUrl(jpgImagePath, function() {
      var dataUrl = this.toDataURL();
      expect(dataUrl.indexOf('data:image/jpeg;base64,')).toEqual(0);
      done();
    });
  });

  it('toDataURL(quality) works', function(done) {
    var clipper = new ImageClipper();
    clipper.loadImageFromUrl(jpgImagePath, function() {
      var dataUrl = this.toDataURL(10);
      expect(dataUrl.indexOf('data:image/jpeg;base64,')).toEqual(0);
      done();
    });
  });

  it('toDataURL(callback) works', function(done) {
    var clipper = new ImageClipper();
    clipper.loadImageFromUrl(jpgImagePath, function() {
      this.toDataURL(20, function(dataUrl) {
        expect(dataUrl.indexOf('data:image/jpeg;base64,')).toEqual(0);
        done();
      });
    });
  });

  it('toDataURL(quality, callback) works', function(done) {
    var clipper = new ImageClipper();
    clipper.loadImageFromUrl(jpgImagePath, function() {
      this.toDataURL(10, function(dataUrl) {
        expect(dataUrl.indexOf('data:image/jpeg;base64,')).toEqual(0);
        done();
      });
    });
  });
});

describe('resize', function() {
  it('resize() throws', function(done) {
    var clipper = new ImageClipper({
      quality: 98
    });
    try {
      clipper.resize();
    } catch (e) {
      expect(e.message).toEqual('resize() must be specified at least one parameter');
      done();
    }
  });

  it('resize(width) works', function(done) {
    var clipper = new ImageClipper({
      quality: 98
    });
    clipper.loadImageFromUrl(pngImagePath, function() {
      this.resize(100);
      expect(this.canvas.width).toEqual(100);
      expect(this.canvas.height).toEqual(100);
      done();
    });
  });

  it('resize(width, height) works', function(done) {
    var clipper = new ImageClipper({
      quality: 98
    });
    clipper.loadImageFromUrl(pngImagePath, function() {
      this.resize(100, 100);
      expect(this.canvas.width).toEqual(100);
      expect(this.canvas.height).toEqual(100);
      done();
    });
  });

  it('resize(width, height).toFile(path, function() {...}) works', function(done) {
    var clipper = new ImageClipper({
      quality: 98
    });
    clipper.loadImageFromUrl(pngImagePath, function() {
      this.resize(100, 100).toFile(exportDir + 'output6-1.png', function(dataUrl) {
        expect(dataUrl.indexOf('data:image/png;base64,')).toEqual(0);
        pushToBody && createDOM(dataUrl);
        done();
      });
    });
  });

  it('resize(width).toFile(path, function() {...}) works', function(done) {
    var clipper = new ImageClipper({
      quality: 92
    });
    clipper.loadImageFromUrl(jpgImagePath, function() {
      this.resize(800).toFile(exportDir + 'output6-2.jpg', function(dataUrl) {
        expect(dataUrl.indexOf('data:image/jpeg;base64,')).toEqual(0);
        pushToBody && createDOM(dataUrl);
        done();
      });
    });
  });
});

describe('quality', function() {
  it('quality(level) works', function() {
    var clipper = new ImageClipper();
    clipper.quality(68);
    expect(clipper.qualityLevel).toEqual(68);

    clipper.quality(1);
    expect(clipper.qualityLevel).toEqual(1);
    clipper.quality(92);
    expect(clipper.qualityLevel).toEqual(92);
  });

  it('works when quality level > max quality level', function() {
    var clipper = new ImageClipper();
    clipper.quality(101);
    expect(clipper.qualityLevel).toEqual(clipper.maxQualityLevel);
    clipper.quality(92.2);
    expect(clipper.qualityLevel).toEqual(clipper.maxQualityLevel);
  });

  it('works when quality level < min quality level', function() {
    var clipper = new ImageClipper();
    clipper.quality(0.1);
    expect(clipper.qualityLevel).toEqual(clipper.minQualityLevel);
    clipper.quality(-1);
    expect(clipper.qualityLevel).toEqual(clipper.minQualityLevel);
    clipper.quality(0);
    expect(clipper.qualityLevel).toEqual(clipper.minQualityLevel);
  });
});