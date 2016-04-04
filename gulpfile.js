var gulp            = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');

const $ = gulpLoadPlugins();


 gulp.task('default', () => {
   gulp.start('lint');
 });


gulp.task('lint', () => {
  return gulp.src(['app.js', 'public/js/**/*/.js', 'lib/**/*.js'])
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError());
});
