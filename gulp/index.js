const gulp = require('gulp');

require('./server');
require('./build-js');
require('./build-html');
require('./watch-js');
require('./watch-html');
require('./image-tasks');

gulp.task('default', ['server']);
gulp.task('watch', ['watch-js', 'watch-html', 'watch:images']);
gulp.task('build', ['build-js', 'build-html', 'build:images']);
