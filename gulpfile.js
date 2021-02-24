var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var util = require('gulp-util');
var watch = require('gulp-watch');
var pump = require('pump');
var cleanCSS = require('gulp-clean-css');
var del = require('del');
var sourcemaps = require('gulp-sourcemaps');

var paths = {
  controllers: {
    src: [
    	'!api/**/*',
    	'!ClientSideLibrary/**/*',
    	'!node_modules/**/*',
    	'!app.constants.js',
    	'!app.worker.js',
    	'app.module.js',
    	'app.*.js',
    	'**/*.js',
    	'**/*.js',
    	'!gulpfile.js'
	],
    dest: 'dist/'
  }
};

gulp.task('controllers', function() { 
  return gulp.src(paths.controllers.src, { sourcemaps: true })
    .pipe(concat('controllers.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .on('error', function (err) { util.log(util.colors.red('[Error]'), err.toString()); })
    .pipe(gulp.dest(paths.controllers.dest));
});


gulp.task('clean', function() { 
  return del([ 'dist/controllers.min.js' ]);
});


gulp.task('watch', function() {
  gulp.watch(paths.directives.src, ['clean-directives', 'directives', 'directivesViews']);
});


gulp.task('default', ['clean', 'controllers']);