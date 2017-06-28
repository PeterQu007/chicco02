var gulp=require('gulp'),
imagemin=require('gulp-imagemin'),
del=require('del'),
usemin=require('gulp-usemin'),
rev=require('gulp-rev'),
cssnano=require('gulp-cssnano'),
uglify=require('gulp-uglify'),
browserSync=require('browser-sync').create();

gulp.task('previewDist', function(){
	browserSync.init({
		notify: false, //inhibit notification box/message
		server: {
			baseDir: "dist"
		}
	});
})

gulp.task('deleteDistFolder', function(){
	return del("./dist");
});

gulp.task('copyGeneralFiles', ['deleteDiskFolder'], function(){
	var pathsToCopy = [
		'./app/assets/lib/fontawesome/**/*',
		'!./app/assets/lib/fontawesome/less/**/*',
		'!./app/assets/lib/fontawesome/scss/**/*',
		'!./app/assets/lib/fontawesome/.bower.json',
		'!./app/assets/lib/fontawesome/.gitignore',
		'!./app/assets/lib/fontawesome/.npmigonre',
		'!./app/assets/lib/fontawesome/bower.json',
		'!./app/assets/lib/fontawesome/HELP-US-OUT.txt'
	]

	return gulp.src(pathsToCopy)
		.pipe(gulp.dest("./dist/assets/lib/fontawesome"));
});

gulp.task('optimizeImages',['deleteDistFolder', 'icons'],function(){
	return gulp.src(['./app/assets/images/**/*','!./app/assets/images/icons','!./app/assets/images/icons/**/*'])
		.pipe(imagemin({
			progressive: true,
			interlaced: true,
			multipass: true
		}))
		.pipe(gulp.dest("./dist/assets/images"));
});

gulp.task('usemin',['deleteDistFolder','styles'],function(){
	return gulp.src("./app/index.html")
		.pipe(usemin({
			css: [function(){return rev()}],
			js: [function(){return rev()}, function(){return uglify()}]
		}))
		.pipe(gulp.dest("./dist"));
});

gulp.task('buildnew',['deleteDistFolder','copyGeneralFiles','optimizeImages','usemin']);