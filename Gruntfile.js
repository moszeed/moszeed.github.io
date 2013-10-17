module.exports = function(grunt) {

    grunt.initConfig({

        //watch task
        watch: {

            //for javascript files
            javascript: {
                tasks: 'javascript',
                files: ['assets/scripts/libs/**/*.js',
                        'assets/scripts/modules/*.js',
                        'assets/scripts/pages/*.js']
            },

            //for less files
            less : {
                files : ['assets/styles/*.less'],
                tasks : 'less'
            }
        },

        //uglify js and create source map
        uglify: {

            options : {
                mangle : false
            },

            javascript: {

                options: {
                    sourceMap           : 'assets/scripts/app.map',
                    sourceMappingURL    : 'app.map',
                    sourceMapRoot       : '/',
                    sourceMapPrefix     : 1
                },

                files: {
                    'assets/scripts/app.min.js': ['assets/scripts/app.js']
                }
            }
        },

        concat: {

            javascript : {

                src:    [

                    //jquery and plugins
                    'assets/scripts/libs/jquery/jquery-2.0.3.js',
                    'assets/scripts/libs/jquery/plugins/jquery.lifestream.js',

                    //underscore and plugins
                    'assets/scripts/libs/underscore/underscore.js',
                    'assets/scripts/libs/underscore/underscore.string.js',

                    //backbone and plugins
                    'assets/scripts/libs/backbone/backbone.js',
                    'assets/scripts/libs/backbone/plugins/backbone-template.js',
                    'assets/scripts/libs/backbone/plugins/backbone-configloader.js',

                    'assets/scripts/modules/lifestream.module.js',
                    'assets/scripts/modules/main.module.js',
                    'assets/scripts/modules/router.module.js',

                    'assets/scripts/pages/start.pages.js'
                ],

                dest:   'assets/scripts/app.js'
            }
        },


        less : {

            options: {
                paths       : ["assets/style"],
                yuicompress : true
            },

            src: {
                src:    "assets/styles/main.less",
                dest:   "assets/styles/main.css"
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');


    //javascript task, for clean, concat and uglify
    grunt.registerTask('javascript', ['concat:javascript', 'uglify']);



};