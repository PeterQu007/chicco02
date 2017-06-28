// add average sf price to the form

import legalDescription from '../assets/scripts/modules/LegalDescription';

var averagePrice = $('<div style="top:7px;left:471px;width:147px;height:13px;" id="averagePrice" class="mls18"></div>');
var div = $('div.mls0');
var divLP = $('div[style="top:7px;left:571px;width:147px;height:13px;"]');
var divFinishedFloorArea = $('div[style="top:698px;left:120px;width:50px;height:16px;"]');
var divReport = $('div#divHtmlReport');


console.log("In Listing Full Realtor View Page");

//averagePrice.text('Hello 550');
//averagePrice.insertAfter(divLP);

var LP = getDecimalNumber(divLP.text());
console.log(LP);
var FinishedFloorArea = getDecimalNumber(divFinishedFloorArea.text());
console.log(FinishedFloorArea);
var sfPrice = LP / FinishedFloorArea ;

//averagePrice.text('$' + sfPrice.toFixed(0) + '(/SF)');

divLP.text(divLP.text() + ' [$'+ sfPrice.toFixed(0) +'/sf]');

var divMLS = $('<div style="position: absolute; top:7px;left:771px;width:147px;height:13px;">MLS #</div>');
divMLS.appendTo(divReport);

var mlsNO = $('div[style="top:18px;left:4px;width:123px;height:13px;"] a').text();

divMLS.text(mlsNO);

//process legal description, get strata plan

var divLegal = $('div[style="top:426px;left:75px;width:593px;height:24px;"]')
var legal = divLegal.text();
var legalDesc = new legalDescription(legal);

var divStrPlan = $('<div style="position: absolute; top:21px;left:771px;width:147px;height:13px;"></div>')
var strPlanLink = $('<a href="http://bcres.paragonrels.com/ParagonLS/Home/Page.mvc#HomeTab" target="HomeTab" id="strataPlanLink" ></a>')
strPlanLink.text(legalDesc.strataPlan);
strPlanLink.appendTo(divStrPlan);
divStrPlan.appendTo(divReport);

var strataPlanLink = $('#strataPlanLink');

chrome.storage.sync.set({strataPlan: legalDesc.strataPlan});

//get realtor remarks
var divRealtorRemarks = $('div[style="top:860px;left:53px;width:710px;height:35px;"]');
var realtorRemarks = divRealtorRemarks.text();
var divNewRealtorRemarks = $('<div style = "position: absolute; top:34px;left:771px;width:147px;height:60px;"></div>');
divNewRealtorRemarks.text(realtorRemarks);
divNewRealtorRemarks.appendTo(divReport);

function getDecimalNumber(strNum){

	var result = 0,
    numbers='';

    strNum = strNum.replace(/,/g, '');
	for (var i = 0, len = strNum.length; i < len; ++i) {
	  
	  if (!isNaN(strNum[i])) {
	    numbers += strNum[i];
	  }
	}

	result = Number(numbers);
	return result.toFixed(0);
}

strataPlanLink.click( function(e){

	e.preventDefault();
	var homeTab = $('#HomeTabLink', top.document);
	
	homeTab[0].click();
	console.log("hello iframe2");

	var mlsDateLow =$("#f_33_Low__1-2-3-4");
    var mlsDateHigh =$("#f_33_High__1-2-3-4");
                    
   chrome.runtime.sendMessage(

   		{from: 'ListingReport', todo: 'switchTab'},

   		function(response){

   			console.log('mls-fullrealtor got response', response);

   		}
   	)

});