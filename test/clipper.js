
var should = require('should');
var ImageClipper = require('../lib/index');

var imagepath = './example/house.jpg';
var x = 20;
var y = 20;
var width = 100;
var height = 100;

describe('clipper', function() {
  it('should crop() work', function(done) {
    var clipper = new ImageClipper();
    clipper.loadImageFromUrl(imagepath, function() {
      this.crop(x, y, width, height, function(dataUrl) {
        //dataUrl.should.equal('<div class="like">something...</div>');
        should.exist(dataUrl).with.be.above(23);

        // > 'data:image/jpeg;base64,'.length
        //dataUrl.length.should.equal(23);
        done();
      });
    });
  });
});