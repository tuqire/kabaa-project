const gulp = require('gulp');
const image = require('gulp-imagemin');
const flatten = require('gulp-flatten');
const changed = require('gulp-changed');

const gitPortfolioOutput = 'tuqire.github/kabaa-project';

gulp.task('build:images', () => {
  const imagePipe = gulp.src('src/images/**/*.{svg,png,jpg,jpeg,gif}')
    .pipe(flatten())
    .pipe(changed('./dest/images'))
    .pipe(image())
    .pipe(gulp.dest('./dest/images'));
	
		if (process.env.NODE_ENV === 'production') {
			imagePipe
				.pipe(gulp.dest(`../${gitPortfolioOutput}`));
		}
});

gulp.task('watch:images', () => {
	gulp.watch('src/images/**/*.{svg,png,jpg,jpeg,gif}', ['build:images']);
});
