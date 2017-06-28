//webpack automation
//bundle modules to single js file
//create gulp task to auto run webpack as configured in webpack.config.js

var gulp=require('gulp'),
webpack=require('webpack');

gulp.task('scripts', function(callback){

	webpack(require('../../webpack.config.js'), function(err, stats){
		if(err){
			console.log(err.toString());
		}
		console.log(stats.toString());
		callback();
	});

});

