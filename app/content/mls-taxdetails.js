//read tax details report, save the data

var taxDetails = {

	pid: $('div[style="top:113px;left:150px;width:221px;height:14px;"]').text(),
	landValue: $('div[style="top:643px;left:0px;width:246px;height:14px;"]').text(),
	improvementValue: $('div[style="top:643px;left:250px;width:246px;height:14px;"]').text(),
	totalValue: $('div[style="top:643px;left:500px;width:246px;height:14px;"]').text(),
	taxYear: $('div[style="top:176px;left:150px;width:221px;height:14px;"]').text(),
	taxRollNumber: $('div[style="top:162px;left:150px;width:221px;height:14px;"]').text(),
	grossTaxes: $('div[style="top:162px;left:525px;width:221px;height:14px;"]').text(),
	planNum: $('div[style="top:356px;left:0px;width:79px;height:14px;"]').text(),
	reportLink: null,

	init: function(){

		var self = this;

		var assess = {

			_id: this.pid,
			landValue: this.landValue,
			improvementValue: this.improvementValue,
			totalValue: this.totalValue,
			taxYear: this.taxYear,
			taxRollNumber: this.taxRollNumber,
			grossTaxes: this.grossTaxes,
			planNum: this.planNum
		}

		chrome.storage.sync.set(assess, function(){

			console.log("TaxDetails.bcAssessment is...", assess);
			self.getReportLink(function(){

				self.reportLink[0].click();

			});
			

		});

		chrome.runtime.sendMessage(

			{todo: 'saveTax',
			 taxData: assess	},

			 function(response){

			 	console.log("tax Data has been save to the database!");
			 }

			)

		
	},

	getReportLink: function(callback){

		var self = this;

		chrome.storage.sync.get('curTabID', function(result){

			self.reportLink = $('div#app_tab_switcher a[href="'+ result.curTabID +'"]', top.document);
			callback();

		})
	}

};

//start point:

$(function(){

	console.log("mls-taxdetails iFrame: "); 

	taxDetails.init();

})

// var landValue=$('div[style="top:643px;left:0px;width:246px;height:14px;"]').text();
// var improvementValue=$('div[style="top:643px;left:250px;width:246px;height:14px;"]').text();
// var totalValue=$('div[style="top:643px;left:500px;width:246px;height:14px;"]').text();
// var taxYear = $('div[style="top:176px;left:150px;width:221px;height:14px;"]').text();
// var taxRollNumber = $('div[style="top:162px;left:150px;width:221px;height:14px;"]').text();
// var grossTaxes = $('div[style="top:162px;left:525px;width:221px;height:14px;"]').text();
// var planNum = $('div[style="top:356px;left:0px;width:79px;height:14px;"]').text();


// chrome.storage.sync.set({landValue:landValue, improvementValue:improvementValue, totalValue:totalValue});

// chrome.storage.sync.get(['landValue','improvementValue','totalValue', 'curTabID'], function(result){


// 	console.log("bcAssessment is: ", result);

// 	var reportLink = $('div#app_tab_switcher a[href="'+ result.curTabID +'"]', top.document);
// 	console.log("reportLink is: ", reportLink);
// 	reportLink[0].click();

// })