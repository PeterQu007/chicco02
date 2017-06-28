//use babel to compile js files
//transpile by babel

var gulp=require('gulp');
var babel=require('gulp-babel');

gulp.task('jsCompile', function(){

	console.log("--use babel to Compile js files");
	return gulp.src('./app/assets/sripts/apptest.js')
		.pipe(babel({
			presets: ['es2015']
		}))
		.on('error', function(errorInfo){
			console.log(errorInfo.toString()); //report error message for debuggin
			this.emit('end');
		})
		.pipe(gulp.dest('./app/temp/scripts'));
});