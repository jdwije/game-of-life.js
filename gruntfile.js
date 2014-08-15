module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: [ 
	    'src/objects/gol-base.js',
	    'src/objects/gol-controller.js',
	    'src/objects/gol-display-html5.js',
	    'src/objects/gol-display-html.js',
	    'src/objects/gol-engine.js',
	    'src/snippets/functions.js'
	],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>'],
	  'dist/gol-engine-worker.min.js' : ['src/processes/gol-engine-worker.js'],
	  'dist/gol-display-worker.min.js' : ['src/processes/gol-display-worker.js']
        }
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },     
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint', 'qunit']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');

//  grunt.registerTask('test', ['qunit']);

  grunt.registerTask('default', [ // 'qunit', 
      'concat', 'uglify']);
};
