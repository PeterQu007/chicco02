//webpack video : 818990 - 38 - The JS Module Pattern and _webpack_ @7:00
//babel to transpile the es6 yo es5
//bundle the modules
//transpile es6 to es5

var path=require('path');
var webpack=require('webpack');

module.exports={
	
	entry: {

		EventPage: "./app/background/eventPage.js",
		"Content-Login": "./app/content/content-login.js",
		DefaultPage: "./app/content/defaultpage.js",
		"MLS-Data": "./app/content/mls-data.js",
		"MLS-Warning": "./app/content/mls-warning.js",
		"MLS-Logout": "./app/content/mls-logout.js",
		"MLS-Export": "./app/content/mls-logout.js",
		"MLS-FullRealtor": "./app/content/mls-fullrealtor.js"
		

	},

	output: {
		path: "./app/temp/scripts",
		filename: "[name].js"
	},
	
	//integrid babel with webpack
	//transpile js files
	module: {
		loaders: [
			{
				//"test" is commonly used to match the file extension
				test: /\.js$/,

				exclude: /node_modules/ ,

				loader: 'babel-loader',

				query: { presets: ['es2015'] }
			}
		]
	},

	//resolveLoader: { 
	//	//root: path.join(__dirname, "node_modules") 
	//	modules: ['node_modules', path.join(__dirname, "node_modules") ]
	//}
}