const gulp = require('gulp');

const gitPortfolioOutput = 'tuqire.github/kabaa-project';

gulp.task('build-html', () => {
	const htmlPipe = gulp.src(['src/html/*.html'])
		.pipe(gulp.dest('dest'));
	
	if (process.env.NODE_ENV === 'production') {
		htmlPipe
			.pipe(gulp.dest(`../${gitPortfolioOutput}`));
	}
});
