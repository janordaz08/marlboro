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
  directives: {
    src: ['directives/*.js', 'directives/**/*.*.js'],
    dest: 'dist/'
  },
  directivesViews: {
    src: ['directives/**/*.html'],
    dest: 'dist/views'
  },
  services: {
    src: ['services/*.module.js', 'services/*.*.js'],
    dest: 'dist/'
  }
};

gulp.task('directives', function() { 
  return gulp.src(paths.directives.src, { sourcemaps: true })
    .pipe(concat('directives.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .on('error', function (err) { util.log(util.colors.red('[Error]'), err.toString()); })
    .pipe(gulp.dest(paths.directives.dest));
});

gulp.task('services', function() { 
  return gulp.src(paths.services.src, { sourcemaps: true })
    .pipe(concat('services.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .on('error', function (err) { util.log(util.colors.red('[Error]'), err.toString()); })
    .pipe(gulp.dest(paths.services.dest));
});

gulp.task('directivesViews', function() { 
	return gulp.src(paths.directivesViews.src)
	.pipe(gulp.dest(paths.directivesViews.dest));
});

gulp.task('clean', function() { 
  return del([ 'dist' ]);
});

gulp.task('clean-directives', function() { 
  return del([ 'dist/directives.min.js' ]);
});

gulp.task('clean-services', function() { 
  return del([ 'dist/services.min.js' ]);;
});

gulp.task('watch', function() {
  gulp.watch(paths.directives.src, ['clean-directives', 'directives', 'directivesViews']);
  gulp.watch(paths.services.src, ['clean-services', 'services']);
});


gulp.task('default', ['directives', 'directivesViews', 'services', 'watch']);