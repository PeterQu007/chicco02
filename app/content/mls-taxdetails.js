console.log("mls-taxdetails iFrame: "); 

$("#ifView").

var landValue=$('div[style="top:643px;left:0px;width:246px;height:14px;"]').text();
var improvementValue=$('div[style="top:643px;left:250px;width:246px;height:14px;"]').text();
var totalValue=$('div[style="top:643px;left:500px;width:246px;height:14px;"]').text();

chrome.storage.sync.set({landValue:landValue, improvementValue:improvementValue, totalValue:totalValue});

chrome.storage.sync.get(['landValue','improvementValue','totalValue'], function(result){


	console.log("bcAssessment is: ", result);

	var reportLink = $('div#app_tab_switcher a[href="#tab3"]', top.document);
	console.log("reportLink is: ", reportLink);
	reportLink[0].click();

})