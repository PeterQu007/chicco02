// webpack video : 818990 - 38 - The JS Module Pattern and _webpack_ @7:00
// babel to transpile the es6 yo es5
// bundle the modules
// transpile es6 to es5

let path=require('path');
let webpack=require('webpack');

module.exports={

	entry: {
		"app": './app/app.js',
		"Library": './app/assets/scripts/Library.js',
		"EventPage": './app/background/eventPage.js',
		'@MLS-Login': './app/content/@mls-login.js',
		"DefaultPage": './app/content/defaultpage.js',
		'MLS-Data': './app/content/mls-data.js',
		'MLS-Warning': './app/content/mls-warning.js',
		'MLS-Logout': './app/content/mls-logout.js',
		'MLS-Export': './app/content/mls-logout.js',
		'MLS-FullRealtor': './app/content/mls-fullrealtor.js',
		'MLS-FullPublic': './app/content/mls-fullpublic.js',
		'MLS-Tax': './app/content/mls-tax.js',
		'MLS-TaxResult': './app/content/mls-taxresult.js',
		'MLS-TaxDetails': './app/content/mls-taxdetails.js',
		'MLS-SearchBypassCriteria': './app/content/mls-searchbypasscriteria.js',
	},

	output: {
		path: './app/temp/scripts',
		filename: '[name].js',
	},

	// integrid babel with webpack
	// transpile js files
	module: {
		loaders: [
			{
				// "test" is commonly used to match the file extension
				test: /\.js$/,

				exclude: /node_modules/,

				loader: 'babel-loader',

				query: {presets: ['es2015']},
			},
		],
	},

	// resolveLoader: { 
	//	//root: path.join(__dirname, "node_modules") 
	//	modules: ['node_modules', path.join(__dirname, "node_modules") ]
	// }
};
