/*gulp code for css tasks*/

var gulp=require('gulp'),
watch=require('gulp-watch'),
rename=require('gulp-rename'),
del=require('del'),
fileCount=1,
$=require('jquery');
var fs = require('fs');
var csv = require("fast-csv");
var csvName;
var FileCopied=false;
 

gulp.task("WatchExcel", function(){

	watch('../../../Downloads/*.csv', function(){

		console.log("Start to copy files...");
		
		gulp.start('CopyExcels');
		FileCopied=!FileCopied;
		
	});

	watch('../../../MLS Data/*.csv', function(){

		gulp.start('ReadPrice');
		gulp.start('endClean2');
	});
});

gulp.task("CopyExcels", function(){

	if (!FileCopied) {

		console.log("---Update the destination Excel file:"); 
		csvName='Home'+(fileCount)+'.csv';
		fileCount=fileCount+1;

		return gulp.src('../../../Downloads/*.csv')
			.pipe(rename(csvName))
			.pipe(gulp.dest('../../../MLS Data/'));
			
	}

});

gulp.task('endClean2', function(){
	
	return del(['../../../Downloads/*.csv'], {force: true}).then(paths => {
    	console.log('Files and folders that would be deleted:\n', paths.join('\n'));
	});

});

gulp.task("ReadPrice",function(){

	if (csvName===undefined) {return};

	console.log("------------READing FileName: ------"+csvName);
	var fileStream = fs.createReadStream('../../../MLS Data/'+csvName, 'utf8');
	var csvStream = csv({headers: true});

	fileStream.pipe(csvStream);

	var rows = [];
	var onData = function(row){
	  rows.push(row);
	  if (rows.length == 1500) {
	  	console.log("------------Price:" + csvName+"---------");
	  	console.log(row.Price);
	  	console.log("---------------------------------------");
	    csvStream.emit('donereading'); //custom event for convenience
	  }
	};
	csvStream.on('data', onData);
	csvStream.on('donereading', function(){
	  fileStream.close();
	  csvStream.removeListener('data', onData);
	  //console.log('got 20 rows', rows);
	});

	

})