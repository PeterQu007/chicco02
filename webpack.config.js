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
		'@MLS-Login': './app/content/@mls-Login.js',
		"DefaultPage": './app/content/DefaultPage.js',
		'MLS-Data': './app/content/mls-Data.js',
		'MLS-Warning': './app/content/mls-Warning.js',
		'MLS-Logout': './app/content/mls-Logout.js',
		'MLS-Export': './app/content/mls-Logout.js',
		'MLS-FullRealtor': './app/content/mls-FullRealtor.js',
		'MLS-FullPublic': './app/content/mls-FullPublic.js',
		'MLS-TaxSearchCriteria': './app/content/taxSearchCriteria.js',
		'MLS-TaxSearchResult': './app/content/taxSearchResult.js',
		'MLS-TaxSearchDetails': './app/content/taxSearchDetails.js',
		'MLS-SearchBypassCriteria': './app/content/mlsSearchBypassCriteria.js',
		'MLS-QuickSearch': './app/content/mls-QuickSearch.js',
		'MLS-SpreadSheetSummary': './app/content/mls-SpreadSheetSummary.js'
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
