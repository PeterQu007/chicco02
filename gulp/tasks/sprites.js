var gulp=require('gulp'),
svgSprite=require('gulp-svg-sprite'),
rename=require('gulp-rename'),
del=require('del');

var config = {
	mode: {
		css: {
			sprite: 'sprite.svg',
			render: {
				css: {
					template: './gulp/templates/sprite.css'
				}
			}
		}
	}
}

gulp.task('beginClean', function(){
	return del(['./app/temp/sprite','./app/assets/images/sprites'])
});

gulp.task('createSprite',['beginClean'],function(){
	return gulp.src('./app/assets/images/icons/**/*.svg')
		.pipe(svgSprite(config))
		.pipe(gulp.dest('./app/temp/sprite/'));
});

//copy new sprite.svg file to the target folder
gulp.task('copySpriteGraphic', ['createSprite'], function(){
	return gulp.src('./app/temp/sprite/css/**/*.svg')
		.pipe(gulp.dest('./app/assets/images/sprites'));
});

//copy new sprite.css to the target folder as _sprite.css
gulp.task('copySpriteCss', ['createSprite'], function(){
	return gulp.src('./app/temp/sprite/css/sprite.css')
		.pipe(rename('_sprite.css'))
		.pipe(gulp.dest('./app/assets/styles/modules'));
});

gulp.task('endClean', ['copySpriteGraphic','copySpriteCss'], function(){
	return del('./app/temp/sprite');
})

gulp.task('icons',['beginClean','createSprite','copySpriteGraphic','copySpriteCss', 'endClean']);
