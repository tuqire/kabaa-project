const gulp = require('gulp');
const gutil = require('gulp-util');
const webpack = require('webpack');

const devConfig = Object.create(require('../webpack.config.js'));

gulp.task('watch-js', () => {
	devConfig.watch = true;

	webpack(devConfig, (err, stats) => {
		if(err) throw new gutil.PluginError('build-dev', err);
		gutil.log('[build-dev]', stats.toString({
			colors: true
		}));
	});
});
