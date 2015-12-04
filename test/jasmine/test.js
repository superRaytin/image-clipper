
var imagepath = '../../example/house.jpg';
var exportPath = '../../example/';
var x = 20;
var y = 20;
var width = 100;
var height = 100;

describe('image-clipper tests', function() {
  it('should loadImageFromUrl(), loadImageFromMemory(), crop() work', function(done) {
    var clipper = new ImageClipper();
    clipper.loadImageFromUrl(imagepath, function() {
      this.crop(x, y, width, height, function(dataUrl) {
        // should > 'data:image/jpeg;base64,'.length
        expect(dataUrl.length).toBeGreaterThan(23);
        done();
      });
    });
  });

  it('should toFile() work', function(done) {
    var clipper = new ImageClipper();
    clipper.loadImageFromUrl(imagepath, function() {
      this.crop(x, y, width, height, function(dataUrl) {
        this.toFile(exportPath, dataUrl, function(dataUrl2) {
          // should > 'data:image/jpeg;base64,'.length
          expect(dataUrl2.length).toBeGreaterThan(23);
          done();
        });
      });
    });
  });

  it('should destroy() work', function() {
    var clipper = new ImageClipper();
    clipper.destroy();
    expect(clipper.canvas).toBe(null);
  });

  it('should reset() work', function(done) {
    var clipper = new ImageClipper();

    clipper.loadImageFromUrl(imagepath, function() {
      clipper.destroy();
      expect(clipper.canvas).toEqual(null);
      clipper.reset();
      expect(clipper.canvas).not.toBe(null);
      expect(clipper.imageFormat).not.toBe(null);
      done();
    });

  });

  it('should quality() work', function() {
    var clipper = new ImageClipper();
    clipper.quality(0.68);
    expect(clipper.qualityLevel).toEqual(0.68);

    clipper.quality(0.01);
    expect(clipper.qualityLevel).toEqual(0.01);
    clipper.quality(0.92);
    expect(clipper.qualityLevel).toEqual(0.92);
  });

  it('should work when quality level > max quality level', function() {
    var clipper = new ImageClipper();
    clipper.quality(101);
    expect(clipper.qualityLevel).toEqual(clipper.maxQualityLevel);
    clipper.quality(0.922);
    expect(clipper.qualityLevel).toEqual(clipper.maxQualityLevel);
  });

  it('should work when quality level < min quality level', function() {
    var clipper = new ImageClipper();
    clipper.quality(0.001);
    expect(clipper.qualityLevel).toEqual(clipper.minQualityLevel);
    clipper.quality(-0.01);
    expect(clipper.qualityLevel).toEqual(clipper.minQualityLevel);
    clipper.quality(0);
    expect(clipper.qualityLevel).toEqual(clipper.minQualityLevel);
  });

  it('should setImageFormat() work', function() {
    var clipper = new ImageClipper();
    clipper.setImageFormat('image/png');
    expect(clipper.imageFormat).toEqual('image/png');
  });

});
