'use strict';
module.exports = function(grunt) {
	var fs = require('fs');

	// load all grunt tasks
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	var path = require('path');
	var fs = require('fs');
	var _ = require('underscore');
	var sprite 	= require('node-sprite');
	var im = require('imagemagick');
	var url = require('url');
	var httpProxy = require('http-proxy');
	grunt.loadTasks(__dirname + "/node_tasks");



	grunt.initConfig({
		/* Compiling less files */
		less: {
			all: {
				src: 'styles/aspe.less',
				dest: 'styles/aspe.css',
				options: {
					compress: true
				}
			}
		},

		/*create Sprite*/
		sprites: {
			sourcePath: "assets/sprites/",
			webPath: 	"/assets/sprites/",
			lessPath: 	"styles/sprite.less",
		},

		clean: {
			sprite: {
				files: [{
					dot: true,
					src: [
						'assets/sprites/*.png',
					]
				}]
			}
		},

		staging: 'temp',
		// final build output
		output: 'dist'		
	});
	

	grunt.registerTask('spritegen', [
		'clean:sprite',
		'sprite',
	]);

	grunt.registerTask('build', [
		'spritegen',
		'less',
	]);
};