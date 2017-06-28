//gulp watch task, run it : gulp watch
//gulp automation core file

var gulp=require('gulp');
var watch=require('gulp-watch');
var browserSync=require('browser-sync').create();

gulp.task('watch', function(){
	
	browserSync.init({
		notify: false, //inhibit notification box/message
		server: {
			baseDir: "app"
		}
		//Change index.html
		//index: "./popup/popup.html"
		//Load alive page
		//proxy: 'http://google.ca'
	});
	
	watch('./app/index.html', function(){
		gulp.start('html');
	});
	
	watch('./app/assets/styles/**/*.css', function(){
		gulp.start('cssInject');
	});

	watch('./app/content/**/*.css', function(){
		gulp.start('cssInject');
	});
	//lecture 39
	watch('./app/assets/scripts/**/*.js', function(){
		gulp.start('scriptsRefresh');
		//gulp.start('jsCompile');
	});

	watch('./app/background/**/*.js', function(){
		gulp.start('scriptsRefresh');
		//gulp.start('jsCompile');
	});

	watch('./app/popup/**/*.js', function(){
		gulp.start('scriptsRefresh');
		//gulp.start('jsCompile');
	});

	watch('./app/content/**/*.js', function(){
		gulp.start('scriptsRefresh');
		//gulp.start('jsCompile');
	});
});


//assistant tasks:

gulp.task('cssInject', ['styles'], function(){
	return gulp.src('./app/temp/styles.css')
		.pipe(browserSync.stream());
});

gulp.task("html", function(){
	browserSync.reload();
});

gulp.task("scriptsRefresh",['scripts'],function(){
	browserSync.reload();
})

gulp.task("default", ['watch']);