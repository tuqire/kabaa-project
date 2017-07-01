const gulp = require('gulp');

require('./server');
require('./build-js');
require('./build-html');
require('./watch-js');
require('./watch-html');

gulp.task('default', ['server']);
gulp.task('watch', ['watch-js', 'watch-html']);

gulp.task('build', ['build-js', 'build-html']);
