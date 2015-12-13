/*
 * image-clipper 0.4.0
 * Node.js module for clip & crop JPEG, PNG, WebP images purely using the native Canvas APIs, excellent compatibility with the Browser & Electron & NW.js (Node-webkit), itself doesn't relies on any image processing libraries.
 * https://github.com/superRaytin/image-clipper
 *
 * Copyright 2015, Leon Shi
 * Released under the MIT license.
*/

!function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);var j=new Error("Cannot find module '"+g+"'");throw j.code="MODULE_NOT_FOUND",j}var k=c[g]={exports:{}};b[g][0].call(k.exports,function(a){var c=b[g][1][a];return e(c?c:a)},k,k.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a,b,c){(function(c){function d(a){return a=a||{},this.options={},e.extend(this.options,this.defaults,a),this.quality(this.options.quality),this}var e=(a("fs"),a("./utils")),f=a("./polyfills"),g=e.isElectron(),h=e.isNW(),i=e.isBrowser(),j=i||g||h;d.prototype.defaults={canvas:null,quality:92,maxQuality:100,minQuality:1,bufsize:4096},d.prototype.loadImageFromMemory=function(a){var b=this.options;a=a||this.originalImage;var c=a.width,d=a.height,f=this.__createCanvas(c,d),g=f.getContext("2d");return g.drawImage(a,0,0,c,d),this.canvas=f,b.imageFormat=b.imageFormat||e.getImageFormat(a.src),this.originalImage||(this.originalImage=a),this},d.prototype.loadImageFromUrl=function(a,b){var c=this,d=this.options,f=this.__createImage();d.imageFormat=d.imageFormat||e.getImageFormat(a),f.onload=function(){c.loadImageFromMemory(f),b.call(c)},f.src=a},d.prototype.image=function(a,b){var c=this.options,d=e.type(a);if("String"!==d&&"Image"!==d&&"HTMLImageElement"!==d)throw new Error("invalid arguments");if("String"===d){if(!b)throw new Error("callback must be specified when load from path");c.imageFormat=c.imageFormat||e.getImageFormat(a),this.loadImageFromUrl(a,function(){b.call(this)})}else if("Image"===d||"HTMLImageElement"===d)return c.imageFormat=c.imageFormat||e.getImageFormat(a.src),this.loadImageFromMemory(a),b&&"Function"===e.type(b)&&(b.call(this),console.warn("No need to specify callback when load from memory, please use chain-capable method directly like this: clipper(Image).crop(...).resize(...)")),this},d.prototype.crop=function(a,b,c,d){var e=this.canvas,f=e.getContext("2d"),g=f.getImageData(a,b,c,d),h=this.__createCanvas(c,d),i=h.getContext("2d");return i.rect(0,0,c,d),i.fillStyle="white",i.fill(),i.putImageData(g,0,0),this.canvas=h,this},d.prototype.toFile=function(a,b){var c=this,d=this.options,e=d.imageFormat;return this.toDataURL(function(d){i?b.call(c,d):this.dataUrlToFile(a,d,e,function(){b.call(c)})}),this},d.prototype.dataUrlToFile=function(a,b,d,e){var g=this,h=b.replace("data:"+d+";base64,",""),i=new c(h,"base64");f.writeFile(a,i,function(){e.call(g)})},d.prototype.resize=function(a,b){var c,d,e=this.canvas;if(!arguments.length)throw new Error("resize() must be specified at least one parameter");if(1===arguments.length){if(!a)throw new Error("resize() inappropriate parameter");c=a/e.width,b=e.height*c}else!a&&b&&(d=b/e.height,a=e.width*d);var f=this.__createCanvas(a,b),g=f.getContext("2d");return g.drawImage(e,0,0,a,b),this.canvas=f,this},d.prototype.clear=function(a,b,c,d){var e=this.canvas,f=e.getContext("2d");return f.clearRect(a,b,c,d),f.fillStyle="#fff",f.fillRect(a,b,c,d),this},d.prototype.quality=function(a){if("Number"!==e.type(a)&&"String"!==e.type(a))throw new Error("Invalid arguments");if(!a)return this;var b=this.options;return a=parseFloat(a),a=e.rangeNumber(a,b.minQuality,b.maxQuality),b.quality=a,this},d.prototype.toDataURL=function(a,b){var c=this,d=this.options,g=d.quality,h=d.minQuality,i=d.maxQuality,k=d.imageFormat,l=d.bufsize;"string"==typeof a&&(a=parseFloat(a)),0==arguments.length?a=g:1==arguments.length?"number"==typeof a?a=e.rangeNumber(a,h,i):"function"==typeof a&&(b=a,a=g):2==arguments.length&&(a=e.rangeNumber(a,h,i));var m=this.canvas;if(j){var n=m.toDataURL(k,a/100);return b&&b.call(this,n),n}if(!b)throw new Error("toDataURL(): callback must be specified");return f.toDataURL({canvas:m,imageFormat:k,quality:a,bufsize:l},function(a){b.call(c,a)}),this},d.prototype.configure=function(a,b){var c=this.options;return e.setter(c,a,b),c.quality&&this.quality(c.quality),this},d.prototype.getCanvas=function(){return this.canvas},d.prototype.destroy=function(){return this.canvas=null,this},d.prototype.reset=function(){return this.destroy().loadImageFromMemory()},d.prototype.injectNodeCanvas=function(a){"undefined"!=typeof a&&(this.options.canvas=a)},d.prototype.__createCanvas=function(a,b){var c,d;if(j){var e=window.document;d=e.createElement("canvas"),d.width=a,d.height=b}else{if(c=this.options.canvas,!c||!c.Image)throw new Error("Require node-canvas on the server-side Node.js");d=new c(a,b)}return d},d.prototype.__createImage=function(){var a,b,c;if(j)a=window.Image;else{if(c=this.options.canvas,!c||!c.Image)throw new Error("Require node-canvas on the server-side Node.js");a=c.Image}return b=new a},d.__configure=function(a,b){var c=d.prototype.defaults;e.setter(c,a,b),c.quality&&(c.quality=e.rangeNumber(c.quality,c.minQuality,c.maxQuality))},b.exports=d}).call(this,a("buffer").Buffer)},{"./polyfills":3,"./utils":4,buffer:5,fs:5}],2:[function(a,b,c){function d(a,b,c){var d;switch(arguments.length){case 0:d=new e;break;case 1:var g=f.type(a);"Object"===g?d=new e(a):(d=new e,d.image(a));break;case 2:c=b,b=null,d=new e,d.image(a,function(){c.call(this)});break;default:if("Object"!==f.type(b))throw new Error("invalid arguments");d=new e(b),d.image(a,function(){c.call(this)})}return d}var e=a("./clipper"),f=a("./utils");d.configure=function(a,b){e.__configure(a,b)},c=b.exports=d,c.imageClipper=d,"function"==typeof define&&define.amd?define(function(){return d}):("undefined"!=typeof window||"undefined"!=typeof navigator)&&(window.imageClipper=d)},{"./clipper":1,"./utils":4}],3:[function(a,b,c){var d=a("fs"),e=(a("./utils"),{});e.writeFile=function(a,b,c){d.writeFile(a,b,function(a){if(a)throw a;c()})},e.toDataURL=function(a,b){var c=a.canvas,d=a.imageFormat,e=a.quality,f=a.bufsize;"image/jpeg"===d?c.toDataURL(d,{quality:e,bufsize:f},function(a,c){if(a)throw a;b(c)}):c.toDataURL(d,function(a,c){if(a)throw a;b(c)})},b.exports=e},{"./utils":4,fs:5}],4:[function(a,b,c){(function(a,c){var d={};d.isBrowser=function(){var a=d.isElectron(),b=d.isNW();return!a&&!b&&!("undefined"==typeof window||"undefined"==typeof navigator)},d.isNode=function(){return!("undefined"==typeof a||!a.platform||!a.versions)},d.isNW=function(){var b=d.isNode();return b&&!("undefined"==typeof c||!a.__node_webkit||!a.versions["node-webkit"])},d.isElectron=function(){var b=d.isNode();return b&&!("undefined"==typeof c||!a.versions.electron)},d.type=function(a){return Object.prototype.toString.call(a).split(" ")[1].replace("]","")},d.rangeNumber=function(a,b,c){return a>c?c:b>a?b:a},d.each=function(a,b){var c=a.length;if(c)for(var d=0;c>d&&b.call(a[d],a[d],d)!==!1;d++);else if("undefined"==typeof c)for(var e in a)if(b.call(a[e],a[e],e)===!1)break},d.extend=function(a){d.each(arguments,function(b,c){c>0&&d.each(b,function(b,c){"undefined"!=typeof b&&(a[c]=b)})})},d.setter=function(a,b,c){var e=d.type(b);if("String"===e){if("undefined"==typeof a[b])throw new Error("Invalid configuration name.");if("undefined"==typeof c)throw new Error("Lack of a value corresponding to the name");"Object"===d.type(c)&&"Object"===d.type(a[b])?d.extend(a[b],c):a[b]=c}else{if("Object"!==e)throw new Error("Invalid arguments");c=b,d.extend(a,c)}},d.getImageFormat=function(a){var b=a.substr(a.lastIndexOf(".")+1,a.length);return b="jpg"===b?"jpeg":b,"image/"+b},d.upperCaseFirstLetter=function(a){return a.replace(a.charAt(0),function(a){return a.toUpperCase()})},b.exports=d}).call(this,a("_process"),"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{_process:6}],5:[function(a,b,c){},{}],6:[function(a,b,c){function d(){k=!1,h.length?j=h.concat(j):l=-1,j.length&&e()}function e(){if(!k){var a=setTimeout(d);k=!0;for(var b=j.length;b;){for(h=j,j=[];++l<b;)h&&h[l].run();l=-1,b=j.length}h=null,k=!1,clearTimeout(a)}}function f(a,b){this.fun=a,this.array=b}function g(){}var h,i=b.exports={},j=[],k=!1,l=-1;i.nextTick=function(a){var b=new Array(arguments.length-1);if(arguments.length>1)for(var c=1;c<arguments.length;c++)b[c-1]=arguments[c];j.push(new f(a,b)),1!==j.length||k||setTimeout(e,0)},f.prototype.run=function(){this.fun.apply(null,this.array)},i.title="browser",i.browser=!0,i.env={},i.argv=[],i.version="",i.versions={},i.on=g,i.addListener=g,i.once=g,i.off=g,i.removeListener=g,i.removeAllListeners=g,i.emit=g,i.binding=function(a){throw new Error("process.binding is not supported")},i.cwd=function(){return"/"},i.chdir=function(a){throw new Error("process.chdir is not supported")},i.umask=function(){return 0}},{}]},{},[2]);