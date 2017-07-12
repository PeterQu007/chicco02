import legalDescription from '../assets/scripts/modules/LegalDescription';

var curTabID = null;
var topPosition = 7;

// get the currently seleted Chrome tab
var getCurrentTab = function() {
	
	chrome.storage.sync.set({'curTabID': curTabID});

	chrome.runtime.sendMessage(

		{todo: 'readCurTabID', from: 'mls-fullrealtor'},

		function(response){

			console.log('current Tab ID is: ', response);

		}

	)
};

var fullrealtor ={

	init: function(){

		getCurrentTab();

		this.calculateSFPrice();
		this.addMLSNo();
		this.addStrataPlan();
		this.addBCAssessment();
		this.addRemarks();
		this.addDataEvents();
		this.searchTax();

		this.addStrataEvents();

	},

	//elements on the page

	div: $('div.mls0'),
	lp: $('div[style="top:7px;left:571px;width:147px;height:13px;"]'),
	sp: $('div[style="top:23px;left:571px;width:147px;height:15px;"]'),
	finishedFloorArea: $('div[style="top:698px;left:120px;width:50px;height:16px;"]'),
	report: $('div#divHtmlReport'),
	pid: $('div[style="top:194px;left:355px;width:82px;height:15px;"]'),
	mlsNo: $('div[style="top:18px;left:4px;width:123px;height:13px;"] a'),
	legal: $('div[style="top:426px;left:75px;width:593px;height:24px;"]'),
	realtorRemarks: $('div[style="top:860px;left:53px;width:710px;height:35px;"]'),
	publicRemarks: $('div[style="top:897px;left:4px;width:758px;height:75px;"]'),
	keyword: $('div#app_banner_links_left input.select2-search__field', top.document),

	averagePrice: $('<div style="top:7px;left:471px;width:147px;height:13px;" id="averagePrice" class="mls18"></div>'),
	strataPlanLink: null,
	bcAssess: null,
	bcLand: null,
	bcImprovement: null,
	valueChange: null,
	valueChangePercent: null,
	curTabID: null,

	calculateSFPrice: function(){

		console.log(this.lp.text(), this.sp.text(), this.finishedFloorArea.text());
		var listPrice = convertStringToDecimal(this.lp.text());
		var soldPrice = convertStringToDecimal(this.sp.text());
		var finishedFloorArea = convertStringToDecimal(this.finishedFloorArea.text());
		var sfPriceList = listPrice / finishedFloorArea ;
		var sfPriceSold = soldPrice / finishedFloorArea ;

		this.lp.text(this.lp.text() + ' [$'+ sfPriceList.toFixed(0) +'/sf]');
		if (sfPriceSold > 0) {
			this.sp.text(this.sp.text() + ' [$'+ sfPriceSold.toFixed(0) +'/sf]');
		}
	},

	addMLSNo: function(){
		var newDivMLS = $('<div style="position: absolute; top:' + topPosition.toString() + 'px;left:771px;width:147px;height:13px;">MLS #</div>');
		newDivMLS.appendTo(this.report);
		var lineBreak = $('<br>');
		lineBreak.appendTo(this.report);
		topPosition += 13 + 1;

		var mlsNO = this.mlsNo.text();

		newDivMLS.text(mlsNO);
	},

	addStrataPlan: function(){

		var legal = this.legal.text();
		var legalDesc = new legalDescription(legal);
		var newDivStrPlan = $('<div style="position: absolute; top:' +topPosition.toString()+ 'px;left:771px;width:147px;height:13px;"></div>')
		var lineBreak = $('<br>');
		var strPlanLink = $('<a href="http://bcres.paragonrels.com/ParagonLS/Home/Page.mvc#HomeTab" target="HomeTab" id="strataPlanLink" ></a>');
		strPlanLink.text(legalDesc.strataPlan1);
		strPlanLink.appendTo(newDivStrPlan);
		newDivStrPlan.appendTo(this.report);
		lineBreak.appendTo(this.report);
		topPosition += 13 + 1;

		this.strataPlanLink = $('#strataPlanLink');

		chrome.storage.sync.set({strataPlan1: legalDesc.strataPlan1, strataPlan2: legalDesc.strataPlan2, strataPlan3: legalDesc.strataPlan3, strataPlan4: legalDesc.strataPlan4});

		
	}, 

	addBCAssessment: function(){

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

		newDivLandValue.appendTo(this.report);
		newDivImprovementValue.appendTo(this.report);
		newDivTotalValue.appendTo(this.report);
		newDivValueChange.appendTo(this.report);
		newDivValueChangePercent.appendTo(this.report);

		this.bcAssess = $("#totalValue");
		this.bcLand = $("#landValue");
		this.bcImprovement = $("#improvementValue");
		this.valueChange = $("#changeValue");
		this.valueChangePercent = $("#changeValuePercent");

	},

	addRemarks: function(){

		//get realtor remarks
		
		var realtorRemarks = this.realtorRemarks.text();
		var newDivRealtorRemarks = $('<div style = "position: absolute; top:' + topPosition.toString()+ 'px;left:771px;width:160px;height:130px;"></div>');
		newDivRealtorRemarks.text(realtorRemarks);
		newDivRealtorRemarks.appendTo(this.report);
		topPosition += 130 +1; 
		//get public remarks
		
		var publicRemarks = this.publicRemarks.text();
		var newDivPublicRemarks = $('<div style = "position: absolute; top:'+topPosition.toString()+'px;left:771px;width:160px;height:150px;"></div>');
		newDivPublicRemarks.text(publicRemarks);

		highlight_words(this.keyword.val(),newDivPublicRemarks);

		newDivPublicRemarks.appendTo(this.report);
		topPosition += 150 + 1;

	},

	searchTax: function(){

		var PID = this.pid.text();
		var self = this;

		if(!PID){return;};

		chrome.storage.sync.set({'PID': PID});

		chrome.storage.sync.get('PID', function(result){

			console.log(">>>PID saved for tax search: ", result.PID);

			chrome.runtime.sendMessage(

			   		{from: 'ListingReport', todo: 'taxSearch'},

			   		function(response){

			   			console.log('>>>mls-fullpublic got tax response:', response);
			   
			   		}
			)
		
			
			
		});

	},

	addStrataEvents: function(){

		this.strataPlanLink.click( function(e){

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

		   			console.log('mls-fullrealtor got response: ', response);

		   		}
		   	)

		});
	},

	addDataEvents: function(){

		(function onEvents(self){

			chrome.storage.onChanged.addListener(function(changes, area) {

			console.log("====>fullrealtor: got a message: !",changes);

		    if (area == "sync" && "totalValue" in changes && "improvementValue" in changes && "landValue" in changes) {
		        console.log("this: ", self);
		    	var listPrice = convertStringToDecimal(self.lp.text());
				var soldPrice = convertStringToDecimal(self.sp.text());

		        var totalValue  = changes.totalValue.newValue;
		        var improvementValue = changes.improvementValue.newValue;
		        var landValue = changes.landValue.newValue;
		        console.log("mls-fullpublic got total bc assessment: ", landValue, improvementValue, totalValue);
         	
         		if(totalValue != 0){

         			if(soldPrice>0 ){

			        	var intTotalValue = convertStringToDecimal(totalValue);
				        var changeValue = soldPrice - intTotalValue ;
				        var changeValuePercent = changeValue / intTotalValue * 100;

			        }else {
			        	var intTotalValue = convertStringToDecimal(totalValue);
				        var changeValue = listPrice - intTotalValue ;
				        var changeValuePercent = changeValue / intTotalValue * 100;

			        }

			        // var PID = self.pid.text();
			        // var assess = {
			        // 	"todo": "saveTax",
			        //    	"_id": PID,
			        // 	"landValue": landValue,
			        // 	"improvementValue": improvementValue,
			        // 	"totalValue": totalValue,
			        // 	"changeValue": changeValue,
			        // 	"changeValuePercent": changeValuePercent
			        // }

			 
			       
         		}
		        

		        self.bcAssess.text(removeDecimalFraction(totalValue));
		        self.bcLand.text(removeDecimalFraction(landValue));
		        self.bcImprovement.text(removeDecimalFraction(improvementValue));
		        self.valueChange.text("$" + numberWithCommas(changeValue.toFixed(0)) + " [ " + changeValuePercent.toFixed(0).toString() + '% ]   ');
		        //self.valueChangePercent.text(changeValuePercent.toFixed(0).toString());

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

		})(this);

		

	}
}

//star the app
$(function(){
	fullrealtor.init();
});

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
};

function convertStringToDecimal(strNum){

		var result = 0,
	    numbers='';

	    strNum = strNum.replace(/,/g, '');
	    //remove the fraction
	    strNum = strNum.substring(0, strNum.indexOf('.') == -1 ? strNum.length : strNum.indexOf('.'));
	    //remove the [] 
	    strNum = strNum.substring(0, strNum.indexOf('[') == -1 ? strNum.length : strNum.indexOf('['));
	    //remove the unit

		for (var i = 0, len = strNum.length; i < len; ++i) {
		  
		  if (!isNaN(strNum[i])) {
		    numbers += strNum[i];
		  }
		}

		result = Number(numbers);
		return result.toFixed(0);
	};

function removeDecimalFraction(strNum){

		var result = 0,
	   
	    //remove the fraction
	    result = strNum.substring(0, strNum.indexOf('.') == -1 ? strNum.length : strNum.indexOf('.'));
	    
		return result;
	};


function convertUnit(sf){

	sf = convertStringToDecimal(sf);
	var result = parseInt(sf) / 10.76;
	return result.toFixed(1);
};

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

function highlight_words(keywords, element) {
    if(keywords) {
        var textNodes;
        keywords = keywords.replace(/\W/g, '');
        var str = keywords.split(" ");
        $(str).each(function() {
            var term = this;
            var textNodes = $(element).contents().filter(function() { return this.nodeType === 3 });
            textNodes.each(function() {
              var content = $(this).text();
              var regex = new RegExp(term, "gi");
              content = content.replace(regex, '<span class="highlight">' + term + '</span>');
              $(this).replaceWith(content);
            });
        });
    }
};