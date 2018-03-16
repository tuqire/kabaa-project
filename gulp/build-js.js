const gulp = require('gulp');
const path = require('path');
const gutil = require('gulp-util');
const webpack = require('webpack');

const prodConfig = Object.create(require('../webpack.config.js'));

const gitPortfolioOutput = 'tuqire.github/kabaa-project';

gulp.task('build-js', (callback) => {
	prodConfig.devtool = 'source-map';
	prodConfig.entry.vendor = ['dat-gui', 'detector-webgl', 'stats.js', 'three', 'three-trackballcontrols'];

	prodConfig.plugins.push(
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify('production')
			}
		}),
		new webpack.optimize.UglifyJsPlugin({
			sourceMap: true
		}),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    })
	);

	webpack(prodConfig, (err, stats) => {
		if(err) throw new gutil.PluginError('build-prod', err);
		gutil.log('[build-prod]', stats.toString({
			colors: true
		}));

		if (process.env.NODE_ENV === 'production') {
			prodConfig.output.path = path.resolve(__dirname, '../../', gitPortfolioOutput, 'js');

			webpack(prodConfig, (err, stats) => {
				if(err) throw new gutil.PluginError('build-prod-git', err);
				gutil.log('[build-prod]', stats.toString({
					colors: true
				}));

				callback();
			});
		} else {
			callback();
		}
	});
});
