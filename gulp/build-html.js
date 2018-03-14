const gulp = require('gulp');

const gitPortfolioOutput = 'tuqire.github/kabaa-project';

gulp.task('build-html', () => {
	gulp.src(['src/html/*.html'])
		.pipe(gulp.dest('dest'))
    .pipe(gulp.dest(`../${gitPortfolioOutput}`));
});
