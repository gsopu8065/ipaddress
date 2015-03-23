/* jshint maxlen: false */

'use strict';
var util = require('util');

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
  var isWindowsMachine =  /^win/.test(process.platform);
  // Just-in-time task loader
  require('jit-grunt')(grunt, {
    useminPrepare: 'grunt-usemin',
    cdnify: 'grunt-google-cdn',
    shell: 'grunt-shell-spawn',
    instrument: 'grunt-istanbul'
  });

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);


   // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    config: grunt.file.readJSON('package.json'),

    yeoman: {
      // configurable paths
      app: require('./bower.json').appPath || 'app',
      dist: 'dist',
      index: '/index.html',      
    },

 // Watches files for changes and runs tasks based on the changed files
    watch: {
      js: {
        files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
        options: {
          livereload: true
        }
      },
      styles: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
        tasks: ['newer:copy:styles']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      },
      indexHtml: {
        files: ['<%= yeoman.app %>/index.html'],
        tasks: ['template:weinre-dev']
      },
      css: {
        files: ['<%= yeoman.app %>/styles/**/{,*/}*.scss'],
        tasks: ['sass']
      }
    },

     // The actual grunt server settings
    connect: {
      options: {
        protocol: 'http',
        port: 9000,
        hostname: '127.0.0.1', //load localhost when it's window machine
        livereload: 35729
      },
      livereload: {
        options: {
          open: '<%= connect.options.protocol %>' + '://' +
                '<%= connect.options.hostname %>' + ':' +
                '<%= connect.options.port %>' +
                '<%= yeoman.testIface %>',
          base: [
            '.tmp',
            'env',
            'test-iface',
            'helper-interface',
            '<%= yeoman.app %>'
          ]
        }
      },
      test: {
        options: {
          port: 9000,
          base: [
            '.tmp',
            'test',
            '<%= yeoman.app %>'
          ]
        }
      },
      dist: {
        options: {
          open: '<%= connect.options.protocol %>' + '://' +
                '<%= connect.options.hostname %>' + ':' +
                '<%= connect.options.port %>',
          base: ['<%= yeoman.dist %>'],
          keepalive: true
        }
      },
      e2e: {
        options: {
          port: 9000,
          base: [
            '.tmp/instrumented/app'
          ]
        }
      }
    },


    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/scripts/{,*/}*.js'
      ],
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

     // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },


    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/scripts/{,*/}*.js',
            '<%= yeoman.dist %>/styles/{,*/}*.css',
            '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= yeoman.dist %>/styles/fonts/*'
          ]
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: ['<%= yeoman.app %>/index.html', '<%= yeoman.dist %>/index-unmin.html'],
      options: {
        dest: '<%= yeoman.dist %>'
      }
    },

    
 // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: [
        '<%= yeoman.dist %>/{,*/}*.html',
        '.tmp/templates/**/*.html',
        // '!<%= yeoman.dist %>/*unmin.html'
      ],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        assetsDirs: ['<%= yeoman.dist %>', '<%= yeoman.dist %>/images']
      }
    },

    /*
    * The following *-min tasks produce minified files in the dist folder.
    * The images located in '/images/sears' and '/images/kmart' are excluded from the minification process
    * due to those folders contain the favicon and apple-touch files.
    */
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: ['{,*/}*.{png,jpg,jpeg,gif}','!**/sears/*','!**/kmart/*'],
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },
    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          // collapseBooleanAttributes: true,
          // removeCommentsFromCDATA: true,
          // removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['*.html', '!*unmin.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    // Allow the use of non-minsafe AngularJS files. Automatically makes it
    // minsafe compatible so Uglify does not destroy the ng references
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '*.html',
            'bower_components/**/*',
            'images/{,*/}*.{webp}',
            'fonts/**/*',
          ],
        }, {
          expand: true,
          cwd: '<%= yeoman.app %>/bower_components/bootstrap',
          dest: '<%= yeoman.dist %>',
          src: ['fonts/**/*']
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/images',
          src: ['generated/*']
        }]
      },
      unmin: {
        files: [
          /** Copy index.html and rename to index-unmin.html **/
          {
            expand: true,
            dot: true,
            cwd: '<%= yeoman.app %>',
            dest: '<%= yeoman.dist %>/',
            src: ['index.html'],
            rename: function (dest, src) {
              return dest + src.replace('index', 'index-unmin')
            }
          },
          /** Copy images **/
          {
            expand: true,
            cwd: '<%= yeoman.app %>/images',
            dest: '<%= yeoman.dist %>/images',
            src: ['**'],
          },
          /** Copy scripts and templates **/
          {
            expand: true,
            dot: true,
            cwd: '<%= yeoman.app %>/scripts',
            dest: '<%= yeoman.dist %>/scripts',
            src: ['**']
          },
          /** Copy css **/
          {
            expand: true,
            dot: true,
            cwd: '.tmp/styles',
            dest: '<%= yeoman.dist %>/styles',
            src: ['**']
          }
        ]
      },
      templates: {
        expand: true,
        cwd: '<%= yeoman.app %>/scripts',
        dest: '.tmp/templates',
        src: '**/*.html'
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      },
      dev: {
        files: [
          {
            expand: true,
            cwd: '<%= yeoman.app %>',
            dest: '<%= yeoman.dist %>',
            src: [
              'callbacks-sample.js',
              'scripts/**/*',
              'images/*'
            ]
          },
          {
            src: '.tmp/styles/main.css',
            dest: '<%= yeoman.dist %>/styles/main.css'
          },
          {
            src: '.tmp/scripts/env.js',
            dest: '<%= yeoman.dist %>/scripts/env.js'
          },
          {
            src: 'env/env.js',
            dest: '<%= yeoman.dist %>/env.js'
          },
          {
            expand: true,
            cwd: 'test-iface',
            dest: '<%= yeoman.dist %>',
            src: '*'
          },
          {
            expand: true,
            cwd: 'coverage-html',
            src: '**',
            dest: '<%= yeoman.dist %>/coverage'
          },
          {
            expand: true,
            cwd: 'complexity',
            src: '**',
            dest: '<%= yeoman.dist %>/complexity'
          }
        ]
      },
      cssmin: {
        files: [
          { dest: 'dist/styles/vendor.css', src: '.tmp/concat/styles/vendor.css'},
          { dest: 'dist/styles/main.css', src: '.tmp/concat/styles/main.css'}
        ]
      },
      // Copy favicon and apple touch files to dist folder.
      favicon: {
        files: [
          {
            expand: true,
            cwd: '<%= yeoman.app %>',
            dest: '<%= yeoman.dist %>',
            src: ['images/sears/*','images/kmart/*']
          }
        ]
      },
      nonInstrument: {
        files: [
          {
            expand: true,
            cwd: '<%= yeoman.app %>',
            dest: '.tmp/instrumented/app',
            src: ['**','!scripts/**/*.js']
          },
          {
            expand:true,
            flatten: true,
            dest: '.tmp/instrumented/app/scripts/',
            src: ['.tmp/scripts/env.js']
          }
        ]
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'copy:styles'
      ],
      test: [
        'copy:styles'
      ],
      dist: [
        'imagemin',
        'svgmin'
      ]
    },

    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/styles/main.css': [
    //         '.tmp/styles/{,*/}*.css',
    //         '<%= yeoman.app %>/styles/{,*/}*.css'
    //       ]
    //     }
    //   }
    // },

    uglify: {
      options: {
        mangle: false
      }
    },

    concat: {
      templates2js: {
        options: {
          process: function (src, filepath) {
            if (!/templates\.js$/.test(filepath)) {
              return src;
            } else {
              return ';(function (window, angular, undefined) { ' +
                     '\'use strict\';\n\n' + src +
                     '\n\n})(window, window.angular);';
            }
          }
        },
        src: [
          '.tmp/concat/scripts/scripts.js',
          '.tmp/templates/templates.js'
        ],
        dest: '.tmp/concat/scripts/scripts.js'
      },
      'fake-scripts': {
        src: [],
        dest: '<%= yeoman.dist %>/scripts/scripts.js'
      },
      env: {
        src: [
          '.tmp/concat/scripts/scripts.js',
          '.tmp/scripts/env.js'
        ],
        dest: '.tmp/concat/scripts/scripts.js'
      },
      unminInit: {
        src: [
          'env/enable-min.js',
          '.tmp/concat/scripts/scripts.js',
        ],
        dest: '.tmp/concat/scripts/scripts.js'
      },
      unmin: {
        src: [
          '<%= yeoman.dist %>/scripts/app.js',
          '.tmp/scripts/env.js'
        ],
        dest: '<%= yeoman.dist %>/scripts/app.js'
      }
    },

    // Test settings
    karma: {
      options: {
        configFile: 'karma.conf.js',
        singleRun: true,
        autoWatch: false
      },
      unit: {
        reporters: ['coverage'],
        preprocessors: {
          // 'app/scripts/**/*.js': ['coverage'],
          // 'app/{scripts,scripts/!(map.analytics)/**/}/*.js': ['coverage'],
          'app/scripts/!(bower_components|app.js|map.analytics|map.route)/**/*.js': ['coverage'],
          'app/scripts/**/*.html': ['ng-html2js']
        },
        coverageReporter: {
          reporters: [
            {
              type: 'html',
              dir: 'coverage-html/',
              subdir: '.'
            }
          ]
        }
      },
      jenkins: {
        browsers: ['PhantomJS'],
        reporters: ['coverage', 'junit'],
        preprocessors: {
          'app/scripts/!(bower_components|app.js|map.analytics|map.route)/**/*.js': ['coverage'],
          'app/scripts/**/*.html': ['ng-html2js']
        },
        coverageReporter: {
          reporters: [
            {type: 'cobertura', dir: 'coverage/'}
          ]
        },
        junitReporter: {
          outputFile: 'test-results.xml'
        }
      }
    },

    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: {
          '.tmp/styles/main.css': '<%= yeoman.app %>/styles/main.scss'
        }
      },
      e2e: {
        options: {
          style: 'expanded'
        },
        files: {
          '.tmp/instrumented/app/styles/main.css': '<%= yeoman.app %>/styles/main.scss'
        }
      }
    },

    html2js: {
      options: {
        base: '.tmp/templates',
        rename: function (moduleName) {
          return 'scripts/' + moduleName;
        },
        module: 'map.templates-wlcc',
        singleModule: true,
        htmlmin: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          removeComments: true,
          removeEmptyAttributes: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true
        }
      },
      wlcc: {
        src: ['.tmp/templates/**/*.html'],
        // dest: '<%= yeoman.dist %>/templates.js'
        dest: '.tmp/templates/templates.js'
      }
    },

    rename: {
      scripts: {
        src: '<%= yeoman.dist %>/scripts/scripts.js',
        dest: '<%= yeoman.dist %>/scripts/foo-scripts.js'
      }
    },

    plato: {
      report: {
        options: {
          jshint: grunt.file.readJSON('.jshintrc')
        },
        files: {
          'complexity': ['app/scripts/*/**.js']
        }
      }
    },

    'string-replace': {
      inline: {
        options: {
          replacements: [{pattern: 'undefined', replacement: '' }]
        },
        files: {
          '<%= yeoman.dist %>/index.html': '<%= yeoman.dist %>/index.html'
        }
      }
    },

    template: {
      weinre: {
        'options': {
          'data': {
            'weinre': '<script src="http://10.27.34.53:9999/target/target-script-min.js#anonymous"></script>'
          }
        },
        'files': {
          'dist/index.html': ['dist/index.html']
        }
      },
      'weinre-nothing': {
        'options': {
          'data': {
            'weinre': ''
          }
        },
        'files': {
          'dist/index.html': ['dist/index.html']
        }
      },
      'weinre-dev': {
        'options': {
          'data': {
            'weinre': ''
          }
        },
        'files': {
          '.tmp/index.html': ['<%= yeoman.app %>/index.html']
        }
      },
      unmin: {
        options: {
          data: {
            weinre: ''
          }
        },
        files: {
          'dist/index-unmin.html': ['dist/index-unmin.html']
        }
      }
    },

    // This task runs the e2e tests and collects the code coverage information and store it into a json file.
    protractor_coverage: {
      options: {
        keepAlive: true, // If false, the grunt process stops when the test fails.
        noColor: false, // If true, protractor will not use colors in its output.
        coverageDir: 'e2e-coverage',
        args: {},
        configFile: 'test/e2e/protractor.conf.js'
      },
      chrome: {
        options: {
          args: {
            baseUrl: 'http://localhost:9000/',
            'browser': 'chrome'
          }
        }
      }
    },

    /*This task process the information that comes from the 'protractor_coverage' and create a report into the
     e2e-coverage folder*/
    makeReport: {
      src: 'e2e-coverage/**/*.json',
      options: {
        type: 'lcov',
        dir: 'e2e-coverage'
      }
    },

    // This task instrument the js files which the protractor_coverage task will use to generate the coverage.json file.
    instrument: {
      files: ['<%= yeoman.app %>/scripts/**/*.js'],
      options: {
        basePath: ".tmp/instrumented"
      }
    }

  });  

grunt.registerTask('serve', function (target, env) {
    if (target === 'dist') {
      if(grunt.file.isFile(grunt.config.get('yeoman').dist + '/index.html')) {
        return grunt.task.run(['connect:dist']);
      } else {
        return grunt.task.run(['build:' + env || 'local', 'connect:dist']);
      }

    }

    var taskList = [
      'clean:server',
      'template:weinre-dev',
      'concurrent:server',
      'connect:livereload',
      'sass',
      'watch'
    ];
    grunt.task.run(taskList);
  });

  grunt.registerTask('update-scripts-with-revved-templates', function () {
    grunt.log.writeln('Configuring the renaming of `scripts` file');
    var paths = grunt.file.expand('dist/scripts/*.scripts.js');
    if (1 !== paths.length) {
      grunt.fail.warn('A singular asset was not found');
    }
    grunt.config.set('rename.scripts.dest', paths[0]);
    grunt.task.run('rename:scripts');
  });

  grunt.registerTask('server', function () {
    grunt.log.warn('The `server` task has been deprecated. ' +
                   'Use `grunt serve` to start a server.');
    grunt.task.run(['serve']);
  });

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('build', function (target) {

    var tasks = [];

    target = target || 'local';

    if(/qa|stag|alpha|prod/i.test(target)) {
      [
        'clean:dist',
        'sass',
        'useminPrepare',
        'concurrent:dist',
        'copy:templates',
        'concat:generated',
        'env:' + target,
        'concat:env',
        'ngmin',
        'copy:dist',
        // 'cssmin',
        'copy:cssmin',
        'concat:fake-scripts',
        'rev',
        'usemin',
        'html2js',
        'concat:templates2js',
        'uglify',
        'update-scripts-with-revved-templates',
        'htmlmin',
        'string-replace',
        'copy:favicon'
      ].forEach(function(task){
        tasks.push(task);
      });

      if ('qa' === target) {
        tasks.push('template:weinre');
      } else {
        tasks.push('template:weinre-nothing');
      }

      if(/qa|stag|alpha|prod/i.test(target)) {
       tasks = tasks.concat([
         'copy:unmin',
         'concat:unmin',
         'template:unmin',
         'unminTask',
       ]);
       tasks.splice(tasks.indexOf('concat:env') + 1, 0, 'concat:unminInit');
      }

      return grunt.task.run(tasks);

    } else {
      tasks = [
        'clean:dist',
        'sass',
        'env:' + target,
        'copy:dist',
        'karma',
        'plato',
        'copy:dev',
        'template:weinre-nothing'
      ];

      return grunt.task.run(tasks);

    }
  });

  /** Replace all the build:remove contexts in index-umin.html **/
  grunt.registerTask('unminTask', function () {
    var buildRemove = '<!-- build:remove -->';
    var endBuild = '<!-- endbuild -->'
    var content = grunt.file.read('dist/index-unmin.html');
    var splitContents = content.split(buildRemove);
    var newContent = '';
    splitContents.forEach(function (splitContent, i) {
      if(i === 0) {
        newContent += splitContent;
      } else {
        var endBuildIndex = splitContent.indexOf(endBuild);
        newContent += splitContent.substring(endBuildIndex + endBuild.length, splitContent.length);
      }
    });
    grunt.file.write('dist/index-unmin.html', newContent);
  });

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);

  grunt.registerTask('env', function (target) {
    var envs = grunt.config.get('env');
    var env = envs[target];
    var config = {
      options: {
        data: {}
      },
      files: {
        '.tmp/scripts/env.js': ['env/env.tmpl.js']
      }
    };

    for (var key in env) {
      if ('object' === typeof env[key]) {
        config.options.data[key] = JSON.stringify(env[key]);
      } else {
        config.options.data[key] = env[key];
      }
    }

    grunt.config.set('template.generated', config);

    grunt.config.set('uglify.options.banner',
      '/* ' +
      '<%= wlcc.name %> - v<%= wlcc.version %>, ' +
      '' + target.toUpperCase() + ', ' +
      '<%= grunt.template.today("isoDateTime") %>' +
      ' */\n'
    );

    return grunt.task.run([
      'template:generated'
    ]);
  });


  // To run the e2e tests using Protractor framework just run 'grunt e2e'.
  grunt.registerTask('e2e', function () {
    grunt.task.run([
      'clean:server',
      'concurrent:test',
      'copy:nonInstrument',
      'instrument',
      'sass:e2e',
      'connect:e2e',
      'protractor_coverage:chrome',
      'makeReport',
      'clean:server'
    ]);
  });

};  