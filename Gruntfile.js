
module.exports = function(grunt){

    var banner = '/*\n' +
        ' * <%= pkg.name %> <%= pkg.version %>\n' +
        ' * <%= pkg.description %>\n' +
        ' * <%= pkg.homepage %>\n' +
        ' *\n' +
        ' * Copyright 2015, <%= pkg.author %>\n' +
        ' * Released under the <%= pkg.license %> license.\n' +
        '*/\n\n';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: banner
            },
            main: {
                files: [
                    {
                        src: ['dist/imageClipper.js'],
                        dest: 'dist/imageClipper.js'
                    }
                ]
            }
        },
        browserify: {
            options: {
                banner: banner
            },
            main: {
                files: [
                    {
                        src: ['lib/index.js'],
                        dest: 'dist/imageClipper.js'
                    }
                ]
            }
        },
        'http-server': {
            dev: {
                root: './',
                port: 9100,
                openBrowser: false
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-browserify');

    grunt.registerTask('build', ['browserify', 'uglify']);
};