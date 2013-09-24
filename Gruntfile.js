module.exports = function(grunt) {
  pkg: grunt.file.readJSON( 'package.json' ),

  grunt.initConfig({

    ember_handlebars: {
      options: {
          processName: function(filePath) {
            var shortFilePath = filePath.replace(/views\/templates\//, '').replace('.hbs', '');
            return shortFilePath;
          },
          processPartialName: function(filePath) {
            var shortFilePath = filePath.replace(/views\/templates\//, '').replace('.hbs', '');
            return shortFilePath;
          }
      },
      compile: {
        files: {
          'public/javascripts/templates.js': 'views/templates/**/*.hbs'
        }
      }
    },


    watch: {
      ember_handlebars: {
        files: 'views/templates/**/*.hbs',
        tasks: ['ember_handlebars']
      }
    }


  });

// Load the plugin. This assumes you have installed it via NPM.
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-ember-handlebars');
grunt.registerTask('default', ['ember_handlebars']);
}