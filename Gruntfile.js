module.exports = function(grunt) {

  grunt.initConfig({
	pkg : grunt.file.readJSON('package.json'),
    connect: {
      server: {
        options: {
          base: 'app'
        }
      }
    },

    less: {
      development: {
        options: {
          paths: ["app/styles/"]
        },
        files: {
          "app/styles/css/main.css": "app/styles/less/main.less",
        }
      }
    },
   
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      app: {
        files: {
          'app/dist/app.min.css': [
            'app/styles/css/main.css'
          ],
        }
      },
      libs: {
        files: {
          'app/dist/libs.min.css': [
            'app/bower_components/html5-boilerplate/css/normalize.css',
            'app/bower_components/html5-boilerplate/css/main.css',
            'app/bower_components/animate.css/animate.min.css',
            'app/bootstrap/dist/css/bootstrap.min.css',
            'app/styles/css/sandstone.bootstrap.min.css',
          ],
        }
      },
    },

    uglify: {
      options: {
        beautify: true,
        compress: true,
        sourceMap: true
      },
      app: {
        files: {
          'app/dist/app.min.js': [
            'app/scripts/app.js', 
            'app/scripts/guest/guest.js', 
            'app/scripts/profile/profile.js',
            'app/scripts/game/game.js',

            'app/scripts/components/services/services.js',
            'app/scripts/components/services/auth/auth.js',
            'app/scripts/components/services/game/game.js',

            'app/scripts/components/version/version.js',
            'app/scripts/components/version/version-directive.js',
            'app/scripts/components/version/interpolate-filter.js',

            'app/scripts/translations.js',
          ],
        }
      },
      libs: {
        files: {
          'app/dist/libs.min.js': [
            'app/bower_components/jquery/dist/jquery.min.js', 
            'app/bower_components/bootstrap/dist/js/bootstrap.min.js', 
            'app/bower_components/firebase/firebase.js',

            'app/bower_components/angular/angular.js',
            'app/bower_components/angular-ui-router/release/angular-ui-router.min.js',
            'app/bower_components/angular-cookies/angular-cookies.js',
            'app/bower_components/angular-animate/angular-animate.min.js',
            'app/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',

            'app/bower_components/angular-gettext/dist/angular-gettext.min.js',
            'app/bower_components/angularfire/dist/angularfire.min.js',
            'app/bower_components/angular-cookie/angular-cookie.js',
          ]
        }
      },
    },

    // Append a timestamp to JS and CSS files which are located in 'index.html'
    cachebreaker: {
      dev: {
        options: {
          match: [
            // CSS
            'bower_components/font-awesome/css/font-awesome.min.css',
            'dist/libs.min.css',
            'dist/app.min.css',

            // JS
            'dist/libs.min.js',
            'dist/app.min.js',
          ],
        },
        files: {
          src: ['app/index.html']
        }
      }
    },

    nggettext_extract: {
      pot: {
        files: {
          'app/po/template.pot': ['app/*.html', 'app/*/*.html']
        }
      },
    },

    nggettext_compile: {
      all: {
        files: {
          'app/scripts/translations.js': ['app/po/*.po']
        }
      },
    },

    watch: {
      options: {
        livereload: true,
      },
      html: {
        files: ['app/index.html', 'app/*/*.html'],
        tasks: ['nggettext_extract']
      },
      js: {
        files: ['app/*/*.js'],
        tasks: ['uglify:app']
      },
      less: {
        options: {
          livereload: false
        },
        files: ['app/styles/less/*.less'],
        tasks: ['less', 'cssmin:app'],
      },
      // Watch js for concatenations
    },
  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-concat');
  
  grunt.loadNpmTasks('grunt-cache-breaker');

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-cache-breaker');
  grunt.loadNpmTasks('grunt-angular-gettext');
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.task.run('notify_hooks');
  
  grunt.registerTask('default', ['less', 'cssmin:app', 'uglify:app', 'nggettext_extract', 'nggettext_compile', 'cachebreaker', 'connect', 'watch']);
  grunt.registerTask('build', ['less', 'cssmin:libs', 'cssmin:app', 'uglify:libs', 'uglify:app', 'nggettext_extract', 'nggettext_compile', 'cachebreaker', 'connect', 'watch']);

};