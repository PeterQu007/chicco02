/*gulp code for css tasks*/

var gulp=require('gulp'); 

var postcss=require('gulp-postcss');
var autoprefixer=require('autoprefixer');
var cssvars=require('postcss-simple-vars'); //virables
var cssnested=require('postcss-nested'); //&__subModifier{}
var cssImport=require('postcss-import'); //@import css modules
var mixins=require('postcss-mixins');  //plug-in for mobile first
var hexRGBA=require('postcss-hexrgba'); //use virables for rgba();

gulp.task("styles", function(){
	console.log("---Update the destination stylesheet file:"); 
	return gulp.src('./app/content/readlisting.css')
		
		.pipe(postcss([cssImport, mixins, cssvars, cssnested, hexRGBA, autoprefixer]))
		//gulp error handling
		.on('error', function(errorInfo){
			console.log(errorInfo.toString()); //report error message for debuggin
			this.emit('end');
		})
		.pipe(gulp.dest('./app/temp/'));
});

