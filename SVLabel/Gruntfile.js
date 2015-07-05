module.exports = function(grunt) {

    // 1. All configuration goes here
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            dist: {
                src: [
                    'lib/*.js',
                    'src/SVLabel/*.js'
                ],
                dest: 'build/SVLabel.js'
            }
        },
        uglify: {
            build: {
                src: 'build/SVLabel.js',
                dest: 'build/SVLabel.min.js'
            }
        },
        jsdoc : {
            dist : {
                src: 'src/SVLabel/*.js'
            }
        }
    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-jsdoc');


    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', ['concat', 'uglify']);

};
