const gulp = require('gulp')

require('./build-html')

gulp.task('watch-html', () => {
  gulp.watch('src/html/*.html', ['build-html'])
})
