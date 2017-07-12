// add average sf price to the form

import legalDescription from '../assets/scripts/modules/LegalDescription';

var averagePrice = $('<div style="top:7px;left:471px;width:147px;height:13px;" id="averagePrice" class="mls18"></div>');
var div = $('div.mls0');
var divLP = $('div[style="top:7px;left:571px;width:147px;height:13px;"]');
var divSP = $('div[style="top:23px;left:571px;width:147px;height:15px;"]');
var divFinishedFloorArea = $('div[style="top:698px;left:120px;width:50px;height:16px;"]');
var divReport = $('div#divHtmlReport');
var divPID = $('div[style="top:194px;left:355px;width:82px;height:15px;"]');
var curTabID = null;

//get current Tab ID
chrome.storage.sync.set({'curTabID': null});

chrome.runtime.sendMessage(

	{todo: 'readCurTabID', from: 'mls-fullrealtor'},

	function(response){

		console.log('current Tab ID is: ', response);

	}

)

var db = new PouchDB('http://localhost:5984/bcassessment');
db.info().then(function(info){
  console.log(info);
});

var divTab3 = $('div#tab3', top.document);
var divTab1 = $('div#tab1', top.document);
console.log(divTab3);

//divTab3.attr("style","display: block!important");
//divTab1.attr("style","display: none!important");

console.log("In Listing Full Realtor View Page");

//averagePrice.text('Hello 550');
//averagePrice.insertAfter(divLP);

var LP = getDecimalNumber(divLP.text());
var SP = getDecimalNumber(divSP.text());
var PID = divPID.text();

chrome.storage.sync.set({'PID': PID});

chrome.storage.sync.get('PID', function(result){

	console.log(result.PID);

	chrome.runtime.sendMessage(

   		{from: 'ListingReport', todo: 'taxSearch'},

   		function(response){

   			console.log('mls-fullrealtor got response:', response);

   		}
   	)
})

console.log(LP);
var FinishedFloorArea = getDecimalNumber(divFinishedFloorArea.text());
console.log(FinishedFloorArea);
var sfPriceList = LP / FinishedFloorArea ;
var sfPriceSold = SP / FinishedFloorArea ;

//averagePrice.text('$' + sfPrice.toFixed(0) + '(/SF)');

divLP.text(divLP.text() + ' [$'+ sfPriceList.toFixed(0) +'/sf]');
if (sfPriceSold > 0) {
	divSP.text(divSP.text() + ' [$'+ sfPriceSold.toFixed(0) +'/sf]');
}

var topPosition = 7;

var newDivMLS = $('<div style="position: absolute; top:' + topPosition.toString() + 'px;left:771px;width:147px;height:13px;">MLS #</div>');
newDivMLS.appendTo(divReport);
var addBreak = $('<br>');
addBreak.appendTo(divReport);
topPosition += 13 + 1;

var mlsNO = $('div[style="top:18px;left:4px;width:123px;height:13px;"] a').text();

newDivMLS.text(mlsNO);

//process legal description, get strata plan

var divLegal = $('div[style="top:426px;left:75px;width:593px;height:24px;"]')
var legal = divLegal.text();
var legalDesc = new legalDescription(legal);

var newDivStrPlan = $('<div style="position: absolute; top:' +topPosition.toString()+ 'px;left:771px;width:147px;height:13px;"></div>')
var strPlanLink = $('<a href="http://bcres.paragonrels.com/ParagonLS/Home/Page.mvc#HomeTab" target="HomeTab" id="strataPlanLink" ></a>')
strPlanLink.text(legalDesc.strataPlan1);
strPlanLink.appendTo(newDivStrPlan);
newDivStrPlan.appendTo(divReport);
addBreak.appendTo(divReport);
topPosition += 13 + 1;

var strataPlanLink = $('#strataPlanLink');

chrome.storage.sync.set({strataPlan1: legalDesc.strataPlan1, strataPlan2: legalDesc.strataPlan2, strataPlan3: legalDesc.strataPlan3, strataPlan4: legalDesc.strataPlan4});

//get bc assessment
var newDivLandValue = $('<div id="landValue" style="position: absolute; top:' +topPosition.toString()+ 'px;left:771px;width:147px;height:13px;"></div>');
topPosition += 13 + 1;
var newDivImprovementValue = $('<div id="improvementValue" style="position: absolute; top:' +topPosition.toString()+ 'px;left:771px;width:147px;height:13px;"></div>');
topPosition += 13 + 1;
var newDivTotalValue = $('<div id="totalValue" style="position: absolute; top:' +topPosition.toString()+ 'px;left:771px;width:147px;height:13px;"></div>');
topPosition += 13 + 1; 
var newDivValueChange = $('<div id="changeValue" style="position: absolute; top:' +topPosition.toString()+ 'px;left:771px;width:147px;height:13px;"></div>');
topPosition += 13 + 1; 
var newDivValueChangePercent = $('<div id="changeValuePercent" style="position: absolute; top:' +topPosition.toString()+ 'px;left:771px;width:147px;height:13px;"></div>');
topPosition += 13 + 1; 

newDivLandValue.appendTo(divReport);
newDivImprovementValue.appendTo(divReport);
newDivTotalValue.appendTo(divReport);
newDivValueChange.appendTo(divReport);
newDivValueChangePercent.appendTo(divReport);

//get realtor remarks
var divRealtorRemarks = $('div[style="top:860px;left:53px;width:710px;height:35px;"]');
var realtorRemarks = divRealtorRemarks.text();
var newDivRealtorRemarks = $('<div style = "position: absolute; top:' + topPosition.toString()+ 'px;left:771px;width:160px;height:130px;"></div>');
newDivRealtorRemarks.text(realtorRemarks);
newDivRealtorRemarks.appendTo(divReport);
topPosition += 130 +1; 
//get public remarks
var divPublicRemarks = $('div[style="top:897px;left:4px;width:758px;height:75px;"]');
var publicRemarks = divPublicRemarks.text();
var newDivPublicRemarks = $('<div style = "position: absolute; top:'+topPosition.toString()+'px;left:771px;width:160px;height:150px;"></div>');
newDivPublicRemarks.text(publicRemarks);
newDivPublicRemarks.appendTo(divReport);
topPosition += 150 + 1;

function getDecimalNumber(strNum){

	var result = 0,
    numbers='';

    strNum = strNum.replace(/,/g, '');
    //remove the fraction
    strNum = strNum.substring(0, strNum.indexOf('.') == -1 ? strNum.length : strNum.indexOf('.'));

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

    var divTab = $('div' + curTabID, top.document);
	
	console.log(divTab);

	divTab.removeAttr("style");
	
                    
    chrome.runtime.sendMessage(

   		{from: 'ListingReport', todo: 'switchTab'},

   		function(response){

   			console.log('mls-fullrealtor got response', response);

   		}
   	)

});

chrome.storage.onChanged.addListener(function(changes, area) {
    if (area == "sync" && "totalValue" in changes && "improvementValue" in changes && "landValue" in changes) {
        var totalValue  = changes.totalValue.newValue;
        var improvementValue = changes.improvementValue.newValue;
        var landValue = changes.landValue.newValue;
        console.log("mls-fullrealtor got total bc assessment: ", landValue, improvementValue, totalValue);

        var divLandValue = $('#landValue');
        divLandValue.text(landValue);
        var divImprovementValue = $('#improvementValue');
        divImprovementValue.text(improvementValue);
        var divTotalValue = $('#totalValue');
        divTotalValue.text(totalValue);

        if(SP>0 && totalValue != 0){

        	var intTotalValue = getDecimalNumber(totalValue);
	        var changeValue = SP - intTotalValue ;
	        var changeValuePercent = changeValue / intTotalValue * 100;

	        $('#changeValue').text(changeValue.toString());
	        $('#changeValuePercent').text(changeValuePercent.toFixed(0).toString() + '%');

        }else if(totalValue != 0 )
        {
        	var intTotalValue = getDecimalNumber(totalValue);
	        var changeValue = LP - intTotalValue ;
	        var changeValuePercent = changeValue / intTotalValue * 100;

	        $('#changeValue').text("[ "+changeValue.toString()+" ]");
	        $('#changeValuePercent').text("[ "+changeValuePercent.toFixed(0).toString() + '% ]');

        }

       
    }

    if(area == "sync" && "curTabID" in changes){

    	if(changes.curTabID.newValue){

    		if(changes.curTabID.oldValue){
    			//remove the old style of the div
    			var oldTabID = changes.curTabID.oldValue;
	    		console.log("mls-fullrealtor: my old tab ID is: ", oldTabID);

	    		var oldDivTab = $('div' + oldTabID, top.document);
				
				oldDivTab.removeAttr("style");
				
    		}

    		curTabID = changes.curTabID.newValue;
    		console.log("mls-fullrealtor: my tab ID is: ", curTabID);

    		var divTab = $('div' + curTabID, top.document);
			var divTab1 = $('div#tab1', top.document);
			console.log(divTab);

			divTab.attr("style","display: block!important");
			divTab1.attr("style","display: none!important");

    	}
    }
});