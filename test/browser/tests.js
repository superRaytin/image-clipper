
var Clipper = window.imageClipper
var jpgImagePath = '../../example/house.jpg'
var pngImagePath = '../../example/building.png'
var exportDir = '../../example/'
var pushToBody = false

var x = 20
var y = 20
var width = 100
var height = 100

function createDOM(dataUrl) {
  var img = new Image()
  img.src = dataUrl
  document.body.appendChild(img)
}

describe('entrance method clipper()', function() {
  it('clipper(path, function() {...}) works', function(done) {
    Clipper(jpgImagePath, function() {
      var initialized = !!(this.canvas && this.options.imageFormat)
      initialized.should.equal(true)
      done()
    })
  })

  it('clipper(Image).crop(...) works', function(done) {
    var img = new Image
    img.onload = function() {
      Clipper(img).crop(x, y, width, height).toDataURL(function(dataUrl) {
        should.exist(dataUrl)
        dataUrl.indexOf('data:image/png;base64,').should.equal(0)
        done()
      })
    }
    img.src = pngImagePath
  })

  it('clipper(path, {...}, function() {...}) works', function(done) {
    Clipper(jpgImagePath, {quality: 50}, function() {
      this.options.quality.should.equal(50)
      var initialized = !!(this.canvas && this.options.imageFormat)
      initialized.should.equal(true)
      done()
    })
  })

  it('clipper(Image, function() {...}) works and displays a warning message', function(done) {
    var img = new Image
    img.onload = function() {
      Clipper(img, function() {
        var initialized = !!(this.canvas && this.options.imageFormat)
        initialized.should.equal(true)
        done()
      })
    }
    img.src = pngImagePath
  })

  it('clipper(Image, {...}, function() {...}) works and displays a warning message', function(done) {
    var img = new Image
    img.onload = function() {
      Clipper(img, {quality: 50}, function() {
        this.options.quality.should.equal(50)
        var initialized = !!(this.canvas && this.options.imageFormat)
        initialized.should.equal(true)
        done()
      })
    }
    img.src = pngImagePath
  })

  it('clipper() works', function() {
    var clipper = Clipper()
    should(!!clipper.options.quality).equal(true)
  })

  it('clipper({quality: Number}) works', function() {
    var clipper = Clipper({
      quality: 66
    })
    clipper.options.quality.should.equal(66)
  })

  it('clipper("path/to/image.jpg") throws since callback did not be provided', function(done) {
    try {
      Clipper(pngImagePath)
    } catch (e) {
      e.message.should.equal('callback must be specified when load from path')
      done()
    }
  })

})

describe('image', function() {
  it('image("path/to/image.jpg", function() {...}) works', function(done) {
    var clipper = Clipper()
    clipper.image(jpgImagePath, function() {
      var initialized = !!(this.canvas && this.options.imageFormat)
      initialized.should.equal(true)
      done()
    })
  })

  it('image(Image) works', function(done) {
    var img = new Image
    var clipper = new Clipper()
    img.onload = function() {
      clipper.image(img).resize(200).quality(10).toFile(exportDir + 'output9.jpg', function(dataUrl) {
        pushToBody && createDOM(dataUrl)
        this.canvas.width.should.equal(200)
        this.options.quality.should.equal(10)
        done()
      })
    }
    img.src = jpgImagePath
  })

  it('image(Image, function() {...}) works and displays a warning message', function(done) {
    var img = new Image
    var clipper = new Clipper()
    img.onload = function() {
      clipper.image(img, function() {
        var initialized = !!(this.canvas && this.options.imageFormat)
        initialized.should.equal(true)
        done()
      })
    }
    img.src = pngImagePath
  })

  it('image("path/to/image.jpg") throws', function(done) {
    var clipper = Clipper()
    try {
      clipper.image(jpgImagePath)
    } catch (e) {
      e.message.should.equal('callback must be specified when load from path')
      done()
    }
  })
})

describe('crop', function() {
  it('crop(x, y, width, height) works', function(done) {
    Clipper(jpgImagePath, function() {
      this.crop(x, y, width, height)
      this.canvas.width.should.equal(width)
      this.canvas.height.should.equal(height)
      done()
    })
  })

  it('crop(x, y, width, height).toDataURL(function(dataUrl) {...}) works', function(done) {
    Clipper(jpgImagePath, function() {
      this.crop(x, y, width, height).toDataURL(function(dataUrl) {
        should.exist(dataUrl)
        dataUrl.indexOf('data:image/jpeg;base64,').should.equal(0)
        done()
      })
    })
  })

  it('crop(x, y, width, height).resize(width2, height2) works', function(done) {
    Clipper(jpgImagePath, function() {
      this.crop(x, y, width, height).resize(50, 50)
      this.canvas.width.should.equal(50)
      this.canvas.height.should.equal(50)
      done()
    })
  })

  it('crop(x, y, width, height).toFile(...) works', function(done) {
    var clipper = Clipper({
      quality: 30
    })
    clipper.image(jpgImagePath, function() {
      this.crop(x, y, width, height).toFile(exportDir + 'output5.jpg', function(dataUrl) {
        pushToBody && createDOM(dataUrl)
        done()
      })
    })
  })

  it('crop(x, y, width, height).resize(width2, height2).toFile(...) works', function(done) {
    Clipper(jpgImagePath, function() {
      this.crop(x, y, width, height).resize(50, 50).toFile(exportDir + 'output5-1.jpg', function(dataUrl) {
        pushToBody && createDOM(dataUrl)
        done()
      })
    })
  })
})

describe('toDataURL', function() {
  it('toDataURL() works', function(done) {
    Clipper(jpgImagePath, function() {
      var dataUrl = this.toDataURL()
      dataUrl.indexOf('data:image/jpeg;base64,').should.equal(0)
      done()
    })
  })

  it('toDataURL(quality) works', function(done) {
    Clipper(jpgImagePath, function() {
      var dataUrl = this.toDataURL(30)
      dataUrl.indexOf('data:image/jpeg;base64,').should.equal(0)
      done()
    })
  })

  it('toDataURL(callback) works', function(done) {
    Clipper(jpgImagePath, function() {
      this.toDataURL(function(dataUrl) {
        dataUrl.indexOf('data:image/jpeg;base64,').should.equal(0)
        done()
      })
    })
  })

  it('toDataURL(quality, callback) works', function(done) {
    Clipper(jpgImagePath, function() {
      this.toDataURL(30, function(dataUrl) {
        dataUrl.indexOf('data:image/jpeg;base64,').should.equal(0)
        done()
      })
    })
  })

  it('toDataURL("quality", callback) works', function(done) {
    Clipper(jpgImagePath, function() {
      this.toDataURL('30', function(dataUrl) {
        dataUrl.indexOf('data:image/jpeg;base64,').should.equal(0)
        done()
      })
    })
  })
})

describe('resize', function() {
  it('resize(width, height) works', function(done) {
    Clipper(pngImagePath, function() {
      this.resize(100, 100)
      this.canvas.width.should.equal(100)
      this.canvas.height.should.equal(100)
      done()
    })
  })

  it('resize(width) works', function(done) {
    Clipper(pngImagePath, function() {
      this.resize(100)
      this.canvas.width.should.equal(100)
      this.canvas.height.should.equal(100)
      done()
    })
  })

  it('resize(null, height) works', function(done) {
    Clipper(pngImagePath, function() {
      this.resize(null, 200)
      this.canvas.width.should.equal(200)
      this.canvas.height.should.equal(200)
      done()
    })
  })

  it('resize() throws', function(done) {
    var clipper = Clipper()
    try {
      clipper.resize()
    } catch (e) {
      e.message.should.equal('resize() must be specified at least one parameter')
      done()
    }
  })

  it('resize(width, height).toFile(path, function() {...}) works', function(done) {
    Clipper(pngImagePath, function() {
      this.resize(100, 100).toDataURL(function(dataUrl) {
        pushToBody && createDOM(dataUrl)
        done()
      })
    })
  })

  it('resize(width, height).crop(x, y, width, height).toFile(path, function() {...}) works', function(done) {
    Clipper(pngImagePath, function() {
      this.resize(100, 100).crop(0, 0, 50, 50).toDataURL(function(dataUrl) {
        pushToBody && createDOM(dataUrl)
        done()
      })
    })
  })

  it('resize(width).toFile(path, function() {...}) works', function(done) {
    var clipper = Clipper({
      quality: 92
    })
    clipper.image(jpgImagePath, function() {
      this.resize(600).toFile(exportDir + 'output6-2.jpg', function(dataUrl) {
        pushToBody && createDOM(dataUrl)
        done()
      })
    })
  })
})

describe('quality', function() {
  it('quality(level) works', function() {
    var clipper = Clipper()
    clipper.quality(68)
    clipper.options.quality.should.equal(68)

    clipper.quality(1)
    clipper.options.quality.should.equal(1)
    clipper.quality(92)
    clipper.options.quality.should.equal(92)
  })

  it('works when quality level > max quality level', function() {
    var clipper = Clipper({
      maxQuality: 92
    })
    clipper.quality(101)
    clipper.options.quality.should.equal(clipper.options.maxQuality)
    clipper.quality(92.2)
    clipper.options.quality.should.equal(clipper.options.maxQuality)
  })

  it('works when quality level < min quality level', function() {
    var clipper = Clipper({
      minQuality: 1
    })
    clipper.quality(0.1)
    clipper.options.quality.should.equal(clipper.options.minQuality)
    clipper.quality(-1)
    clipper.options.quality.should.equal(clipper.options.minQuality)
    clipper.quality(0)
    clipper.options.quality.should.equal(clipper.options.minQuality)
  })
})

describe('configure', function() {
  it('instance configure(name, value) works', function() {
    var clipper = Clipper()
    clipper.configure('quality', 90)
    clipper.options.quality.should.equal(90)
    clipper.configure('minQuality', 8)
    clipper.options.minQuality.should.equal(8)
    clipper.configure('maxQuality', 78)
    clipper.options.maxQuality.should.equal(78)
  })

  it('instance configure({...}) works', function() {
    var clipper = Clipper()
    clipper.configure({
      quality: 67,
      minQuality: 4,
      maxQuality: 97
    })
    clipper.options.quality.should.equal(67)
    clipper.options.minQuality.should.equal(4)
    clipper.options.maxQuality.should.equal(97)
  })

  it('global configure(name, value) works', function() {
    Clipper.configure('quality', 67)
    Clipper.configure('minQuality', 4)
    Clipper.configure('maxQuality', 97)
    var clipper = Clipper()
    clipper.options.quality.should.equal(67)
    clipper.options.minQuality.should.equal(4)
    clipper.options.maxQuality.should.equal(97)
  })

  it('global configure({...}) works', function() {
    Clipper.configure({
      quality: 68,
      minQuality: 7,
      maxQuality: 99
    })
    var clipper = Clipper()
    clipper.options.quality.should.equal(68)
    clipper.options.minQuality.should.equal(7)
    clipper.options.maxQuality.should.equal(99)
    clipper.configure('quality', 90)
    clipper.options.quality.should.equal(90)
    clipper.configure('minQuality', 8)
    clipper.options.minQuality.should.equal(8)
    clipper.configure('maxQuality', 78)
    clipper.options.maxQuality.should.equal(78)
  })
})

describe('other image-clipper tests', function() {
  it('destroy() works', function(done) {
    Clipper(pngImagePath, function() {
      this.destroy()
      should(this.canvas).equal(null)
      done()
    })
  })

  it('reset() works', function(done) {
    Clipper(pngImagePath, function() {
      this.destroy()
      should(this.canvas).equal(null)
      this.reset()
      should(this.canvas).not.eql(null)
      should(this.options.imageFormat).not.eql(null)
      done()
    })
  })

  it('clear(x, y, width, height) works', function(done) {
    Clipper(pngImagePath, function() {
      this.clear(50, 50, 100, 100)
          .crop(20, 20, 200, 200)
          .toDataURL(function(dataUrl) {
            pushToBody && createDOM(dataUrl)
            done()
          })
    })
  })

  it('getCanvas() works', function(done) {
    Clipper(pngImagePath, function() {
      should.exist(this.canvas)
      done()
    })
  })

})
