//custom full public report

import legalDescription from '../assets/scripts/modules/LegalDescription';


//console.log("full public script activated now: ");

var fullpublic = {

	init: function(){
		console.log("full public script loaded!");
		console.log(this.lp, this.sp);

		this.events();

		this.bcAssess.addClass(this.lp.attr('class'));
		var divBC = $('<div style="top:111px;left:703px;width:23px;height:14px;">(BC)</div>');
		var banner = $('<div id="peterqu" style="z-index: 999; height:88px; position:absolute; top: 2px; padding-right:0px; padding-left:0px; padding-top:0px; padding-bottom:0px; left:0px; width: 766px"></div>');
		divBC.addClass(this.lpSuffix.attr('class'));
		divBC.insertAfter(this.bcAssess);
		this.bcAssess.animate({left:'555px'});
		this.addBanner(banner);
		this.translate();
		this.calculateSFPrice();
		this.searchTax();

	},

	calculateSFPrice: function(){

		console.log(this.lp.text(), this.sp.text(), this.finishedFloorArea.text());
		var listPrice = convertStringToDecimal(this.lp.text());
		var soldPrice = convertStringToDecimal(this.sp.text());
		var FinishedFloorArea = convertStringToDecimal(this.finishedFloorArea.text());
		var sfPriceList = listPrice / FinishedFloorArea ;
		var sfPriceSold = soldPrice / FinishedFloorArea ;

		this.lp.text(this.lp.text() + ' [$'+ sfPriceList.toFixed(0) +'/sf]');
		if (sfPriceSold > 0) {
			this.sp.text(this.sp.text() + ' [$'+ sfPriceSold.toFixed(0) +'/sf]');
		}
	},

	searchTax: function(){

		var PID = this.pid.text();

		chrome.storage.sync.set({'PID': PID});

		chrome.storage.sync.get('PID', function(result){

			console.log(result.PID);

			chrome.runtime.sendMessage(

		   		{from: 'ListingReport', todo: 'taxSearch'},

		   		function(response){

		   			console.log('mls-fullpublic got response:', response);

		   		}
		   	)
		});

	},

	addBanner: function(banner){

		var img = $('<img src="http://localhost/chromex/mlshelper/app/assets/images/banner4.jpg">');
		img.appendTo(banner);
		banner.appendTo($('div#divHtmlReport'));
	},

	translate: function(){

		this.cnStrataFee.text('月管理費：');
		this.cnGrossTaxes.text('地稅金額：');
		this.cnFinishedFloor.text('室内縂面積：');
		this.cnRestrictedAge.text('年齡限制：');
		this.cnForTaxYear.text('納稅年度：');
		this.cnAge.text('樓齡: ');
		this.cnYearBuilt.text('建造年份：');
		this.cnOriginalPrice.text('挂牌價格：');
		this.cnBedrooms.text('臥室數：');
		this.cnBathrooms.text('衛生間：');
		this.cnFullBaths.text('全衛：');
		this.cnHalfBaths.text('半衛：');
		this.cnExposure.text('朝向：');
		this.cnComplex.text('小區名稱：');
		this.cnMgmtName.text('管理公司名稱：');
		this.cnMgmtPhone.text('管理公司電話：');
		this.cnView.text('是否有風景：');

	},

	events: function(){

		(function onEvents(self){

			chrome.storage.onChanged.addListener(function(changes, area) {
		    if (area == "sync" && "totalValue" in changes && "improvementValue" in changes && "landValue" in changes) {
		        console.log("this:", self);
		    	var listPrice = convertStringToDecimal(self.lp.text());
				var soldPrice = convertStringToDecimal(self.sp.text());

		        var totalValue  = changes.totalValue.newValue;
		        var improvementValue = changes.improvementValue.newValue;
		        var landValue = changes.landValue.newValue;
		        console.log("mls-fullpublic got total bc assessment: ", landValue, improvementValue, totalValue);

		        self.bcAssess.text(totalValue);
		        
		        if(soldPrice>0 && totalValue != 0){

		        	var intTotalValue = convertStringToDecimal(totalValue);
			        var changeValue = soldPrice - intTotalValue ;
			        var changeValuePercent = changeValue / intTotalValue * 100;

		        }else if(totalValue != 0 )
		        {
		        	var intTotalValue = convertStringToDecimal(totalValue);
			        var changeValue = listPrice - intTotalValue ;
			        var changeValuePercent = changeValue / intTotalValue * 100;

		        }

		        self.bcAssess.text(removeDecimalFraction(self.bcAssess.text()) + " [ "+ changeValuePercent.toFixed(0).toString() + '% ]   ');
		       
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

		

	},

	lp: $('div[style="top:129px;left:555px;width:147px;height:13px;"]'),
	sp: $('div[style="top:147px;left:555px;width:147px;height:15px;"]'),
	lpSuffix: $('div[style="top:129px;left:703px;width:23px;height:14px;"]'),
	bcAssess: $('div[style="top:111px;left:578px;width:147px;height:16px;"]'),
	finishedFloorArea: $('div[style="top:804px;left:120px;width:50px;height:16px;"]'),
	pid: $('div[style="top:283px;left:637px;width:82px;height:15px;"]'),
	complex: $('div[style="top:341px;left:393px;width:369px;height:13px;"]'),
	strataFee: $('div[style="top:267px;left:530px;width:67px;height:13px;"]'),
	exposure: $('div[style="top:261px;left:376px;width:68px;height:13px;"]'),
	age: $('div[style="top:203px;left:698px;width:65px;height:13px;"]'),
	year: $('div[style="top:187px;left:698px;width:39px;height:13px;"]'),
	tax: $('div[style="top:235px;left:698px;width:65px;height:13px;"]'),
	title: $('div[style="top:444px;left:440px;width:321px;height:13px;"]'),
	
	cnStrataFee: $('div[style="top:267px;left:451px;width:61px;height:14px;"]'),
	cnGrossTaxes: $('div[style="top:235px;left:603px;width:71px;height:13px;"]'),
	cnFinishedFloor: $('div[style="top:804px;left:3px;width:111px;height:16px;"]'),
	cnRestrictedAge: $('div[style="top:780px;left:210px;width:74px;height:12px;"]'),
	cnForTaxYear: $('div[style="top:251px;left:603px;width:81px;height:15px;"]'),//$('div[style=""]'),
	cnAge: $('div[style="top:203px;left:603px;width:27px;height:14px;"]'),
	cnYearBuilt: $('div[style="top:187px;left:603px;width:97px;height:15px;"]'),
	cnOriginalPrice: $('div[style="top:171px;left:603px;width:76px;height:15px;"]'),
	cnBedrooms: $('div[style="top:203px;left:451px;width:75px;height:16px;"]'),
	cnBathrooms: $('div[style="top:219px;left:451px;width:77px;height:15px;"]'),
	cnFullBaths: $('div[style="top:235px;left:451px;width:55px;height:15px;"]'),
	cnHalfBaths: $('div[style="top:251px;left:451px;width:55px;height:13px;"]'),
	cnExposure: $('div[style="top:261px;left:289px;width:79px;height:15px;"]'),
	cnComplex: $('div[style="top:341px;left:289px;width:93px;height:14px;"]'),
	cnMgmtName: $('div[style="top:293px;left:289px;width:96px;height:17px;"]'),
	cnMgmtPhone: $('div[style="top:309px;left:289px;width:95px;height:17px;"]'),
	cnView: $('div[style="top:325px;left:289px;width:77px;height:13px;"]'),

}; 

function convertStringToDecimal(strNum){

		var result = 0,
	    numbers='';

	    strNum = strNum.replace(/,/g, '');
	    //remove the fraction
	    strNum = strNum.substring(0, strNum.indexOf('.') == -1 ? strNum.length : strNum.indexOf('.'));
	    //remove the [] 
	    strNum = strNum.substring(0, strNum.indexOf('[') == -1 ? strNum.length : strNum.indexOf('['));
		for (var i = 0, len = strNum.length; i < len; ++i) {
		  
		  if (!isNaN(strNum[i])) {
		    numbers += strNum[i];
		  }
		}

		result = Number(numbers);
		return result.toFixed(0);
	}

function removeDecimalFraction(strNum){

		var result = 0,
	   
	    //remove the fraction
	    result = strNum.substring(0, strNum.indexOf('.') == -1 ? strNum.length : strNum.indexOf('.'));
	    
		return result;
	}



//fullpublic startpoint
//document.addEventListener("DOMContentLoaded", function(){
$(function(){

	fullpublic.init();

})	

//});

