//add extra functions to the full realtor report
//show bca info
//show strata info
//cal unit price, percent numbers

//manifest matches: "https://bcres.paragonrels.com/ParagonLS/Reports/Report.mvc?listingIDs=*viewID=c65*"
//production file name: MLS-FullRealtor.js

'use strict'

import legalDescription from '../assets/scripts/modules/LegalDescription';
import addressInfo from '../assets/scripts/modules/AddressInfo';
import uiListingInfo from '../assets/scripts/ui/uiListingInfo';
import { mainNavItem } from '../assets/scripts/modules/MainNavBar';

//var curTabID = null;
var $fx = L$();

var fullRealtor = {

	init: function () {
		//console.clear();
		//read full realtor report, get listing data
		//$fx.getCurrentTab(curTabID);
		//link to iframe's tabID
		this.tabID = $fx.getTabID(window.frameElement.src);
		
        this.tabNo = parseInt(this.tabID.replace('#tab',''));
        var x = $('ul#tab-bg', top.document); //find the top tab panel
        var y = x.children('li')[this.tabNo];
        this.tabTitle = $(y).children().find('span').text().trim();
        console.warn('[FR]===>tabID, tabNo, tabTitle', this.tabID, this.tabNo, this.tabTitle);
		console.warn('[FR]===>window.frameElement.id', this.tabID);
		chrome.storage.sync.set({curTabID: this.tabID});
		//this.lockVisibility();
		this.addLock(this.tabID);
		console.warn('[FR]===>tabContentContainer: ', this.tabContentContainer);
		this.clearAssess();
		this.houseListingType = this.houseType.text().replace(',', '').replace(' ', '');
		$fx.setHouseType(this.houseListingType);
		this.getMorePropertyInfo(); //get pid, complexName, lotArea, etc.
		this.calculateSFPrice();

		//create extra listing info UI:
		this.uiListingInfo.showUI(this.report);
		this.populateUiListing();
		//add event listeners:
		this.addDataEvents();
		this.addStrataEvents();
		this.addComplexEvent();
		//do searches:
		this.searchStrataPlanSummary();
		var that =this;
		setTimeout(function(){
				that.searchTax()}
			,500); //delay does not help the tab jumps issue
		//this.lockVisibility();
	},

	uiListingInfo: new uiListingInfo(),
	//elements on the page
	houseType: $('div[style="top:32px;left:46px;width:61px;height:14px;"]'),
	div: $('div.mls0'),
	lp: $('div[style="top:7px;left:571px;width:147px;height:13px;"]'),
	sp: $('div[style="top:23px;left:571px;width:147px;height:15px;"]'),
	lotArea: null, //lotArea from getMorePropertyInfo
	finishedFloorArea: null, // from getMorePropertyInfo
	report: $('div#divHtmlReport'),
	pid: null, //pid from getMorePropertyInfo
	complexOrSubdivision: null, //complex name from getMorePropertyInfo
	mlsNo: $('div[style="top:18px;left:4px;width:123px;height:13px;"] a'),
	legal: $('div[style="top:426px;left:75px;width:593px;height:22px;"]'),
	realtorRemarks: $('div[style="top:860px;left:53px;width:710px;height:35px;"]'),
	publicRemarks: $('div[style="top:897px;left:4px;width:758px;height:75px;"]'),
	keyword: $('div#app_banner_links_left input.select2-search__field', top.document),
	spreadsheetTable: parent.document.querySelector('#ifSpreadsheet').contentDocument.querySelector('#grid'),
	curPage: parent.document.querySelector('#txtCurPage'),

	//complex info:
	address: $('div[style="top:4px;left:134px;width:481px;height:17px;"]'),
	houseListingType: null,
	subArea: $('div[style="top:20px;left:134px;width:480px;height:13px;"]'),
	neighborhood: $('div[style="top:33px;left:134px;width:479px;height:13px;"]'),
	postcode: $('div[style="top:46px;left:306px;width:130px;height:13px;"]'),
	dwellingType: $('div[style="top:46px;left:4px;width:137px;height:15px;"]'),
	totalUnits: null, //from getMorePropertyInfo
	devUnits: null, //from getMorePropertyInfo

	saveComplexButton: null,
	legalDesc: null, //need be inited at addStrataPlan
	strataPlan: null, //new strataPlan field, to be added
	formalAddress: null, //new formal Address field, to be added
	strataPlanLink: null, //new strataPlan search link, to be added
	complexSummary: null, //new complex summary data, to be added
	complexName: null,
	complexListingSummary: null,
	bcAssess: null,
	bcLand: null,
	bcImprovement: null,
	bcLand2ImprovementRatio: null,
	valueChange: null,
	valueChangePercent: null,
	oldTimerLotValuePerSF: null,
	marketLotValuePerSF: null,
	marketHouseValuePerSF: null,
	street: null,
	streetNumber: null,
	tabID: null,
	tabNo: 0,
	tabTitle: '',
	tabContentContainer: null,

	lockVisibility: function () {
		var divTab = $('div' + this.tabID, top.document);
		var divTaxSearch = $('div#tab1', top.document);
		this.tabContentContainer = divTab;
		//console.log(divTab);
		divTab.attr("style", "display: block!important");
		divTaxSearch.attr("style", "display: none!important");
		chrome.storage.sync.set({curTabID: this.tabID});
	},

	addLock: function(tabID) {
        
        chrome.runtime.sendMessage(
            { from: 'FullRealtorReport', todo: 'addLock', tabID, tabID },
            function (response) {
                console.log('FullRealtorReport got tax response:', response);
        
            }
        )
    },

	getMorePropertyInfo: function () {
		var self = this;
		var listingHouseType = self.houseType.text().replace(',', '').replace(' ', '');
		var $lotAreaAcres;
		var $lotAreaHect;
		var $lotAreaSqM;

		switch (listingHouseType) {
			case 'Attached':
				self.pid = $('div[style="top:194px;left:355px;width:82px;height:15px;"]'); //P.I.D.
				self.complexOrSubdivision = $('div[style="top:236px;left:381px;width:383px;height:14px;"]'); //Complex/Subdiv
				self.totalUnits = $('div[style="top:326px;left:659px;width:101px;height:16px;"'); //Total units in Strata
				self.devUnits = $('div[style="top:326px;left:470px;width:95px;height:15px;"'); //Units in Development
				self.lotArea = $('div[style="top:129px;left:355px;width:75px;height:13px;"'); //Sq. Footage
				self.finishedFloorArea = $('div[style="top:698px;left:120px;width:50px;height:16px;"]'); //finishedFloorArea
				break;
			case 'Detached':
				self.pid = $('div[style="top:198px;left:681px;width:82px;height:15px;"]'); //P.I.D.
				self.complexOrSubdivision = $('div[style="top:229px;left:393px;width:369px;height:13px;"]'); //Complex/Subdiv
				self.lotArea = $('div[style="top:133px;left:375px;width:67px;height:13px;"'); //
				self.devUnits = $('<div>1</div>'); // N/A for single house
				self.totalUnits = $('<div>1</div>'); // N/A for single house
				self.finishedFloorArea = $('div[style="top:698px;left:120px;width:50px;height:16px;"]'); //finishedFloorArea
				break;
			case 'Land Only':
				self.pid = $('div[style="top:117px;left:536px;width:82px;height:15px;"]'); //P.I.D.
				self.complexOrSubdivision = $('div[style="top:101px;left:536px;width:227px;height:15px;"]'); //Complex/Subdiv
				self.lotArea = $('div[style="top:242px;left:687px;width:75px;height:16px;"'); // Area in Square Feet
				$lotAreaAcres = $('div[style="top:210px;left:687px;width:75px;height:16px;"'); // Area in Acres
				$lotAreaHect = $('div[style="top:226px;left:687px;width:75px;height:16px;"'); // Area in Hect
				$lotAreaSqM = $('div[style="top:258px;left:687px;width:75px;height:16px;"'); // Area in Square Meters
				if (self.lotArea.text() == '0.00'){
					let x = $lotAreaAcres.text();
					let lotAreaAcres = $fx.convertStringToDecimal(x, true);
					let lotAreaInSquareFeet = lotAreaAcres * 43560;
					let lotAreaInSquareMeters = lotAreaInSquareFeet / 10.76;
					
					self.lotArea.text($fx.numberWithCommas(lotAreaInSquareFeet.toFixed(0)));
					$lotAreaSqM.text($fx.numberWithCommas(lotAreaInSquareMeters.toFixed(0)));
				}
				
				self.devUnits = $('<div>1</div>'); // N/A for Land Only
				self.totalUnits = $('<div>1</div>'); // N/A for Land Only
				self.finishedFloorArea = $('<div>1</div>'); // N/A for Land Only
				break;
		}
	},

	calculateSFPrice: function () {
		//console.log(this.lp.text(), this.sp.text(), this.finishedFloorArea.text());
		var listPrice = $fx.convertStringToDecimal(this.lp.text());
		var soldPrice = $fx.convertStringToDecimal(this.sp.text());
		var baseArea;
		if (this.houseListingType != 'Land Only') {
			baseArea = $fx.convertStringToDecimal(this.finishedFloorArea.text());
		}else{
			baseArea = $fx.convertStringToDecimal(this.lotArea.text());
		}
		var sfPriceList = listPrice / baseArea;
		var sfPriceSold = soldPrice / baseArea;

		this.lp.text(this.lp.text() + ' [$' + sfPriceList.toFixed(0) + '/sf]');
		if (sfPriceSold > 0) {
			this.sp.text(this.sp.text() + ' [$' + sfPriceSold.toFixed(0) + '/sf]');
		}
	},

	populateUiListing: function () {
		this.addMLSNo();
		this.addStrataPlan(); //move this operation inside updateAssessment
		
		this.addBCAssessment();

		this.addRemarks();
	},

	addMLSNo: function () {
		var mlsNO = this.mlsNo.text();
		this.uiListingInfo.mlsNo.text(mlsNO);
	},

	addStrataPlan: function (planNum) {

		var legal = "";
		
		if(planNum == undefined){
			legal = this.legal.text(); //get legal description from the Report
		}else{
			legal = planNum.toString();
		}
		
		var legalDesc = this.legalDesc = new legalDescription(legal);
		var complexName = this.complexOrSubdivision.text();
		this.strataPlan = legalDesc.strataPlan1; //set up the strata Plan number
		
		this.uiListingInfo.planLink.text(legalDesc.strataPlan1 + (planNum == undefined ? '' : "*"));

		this.saveComplexButton = $('#saveComplexName');
		this.strataPlanLink = $('#strataPlanLink');
		this.complexSummary = $('#complexSummary');
		this.complexName = $('#complexName');
		if (complexName) {
			this.complexName.text(complexName + ": ");
		};
		this.complexListingSummary = $('#listingQuantity');
		this.formalAddress = $('#formalAddress');

		if(planNum != undefined){
			//Start PlanNum Search:
			chrome.storage.sync.set({
				strataPlan1: legalDesc.strataPlan1,
				strataPlan2: legalDesc.strataPlan2,
				strataPlan3: legalDesc.strataPlan3,
				strataPlan4: legalDesc.strataPlan4
			});
		}
		
	},

	addComplexInfo: function (complex) {
		var self = this;
		var subArea = self.subArea.text();
		var neighborhood = self.neighborhood.text();
		var postcode = self.postcode.text();
		var dwellingType = self.dwellingType.text();
		var complexName = complex || self.complexOrSubdivision.text().trim();
		complexName = $fx.normalizeComplexName(complexName);
		if(typeof complexName != 'string' && complexName.length<=0){
			console.log("ComplexName does not existed"); ////exit
			return;
		}
		var addressSelect = '';
		var isFormalAddress = true;
		if(typeof self.formalAddress.text() =="string" && self.formalAddress.text().length > 0 ){
			addressSelect = self.formalAddress.text();
		}else{
			addressSelect = self.address.text();
			isFormalAddress = false;
		}
		var address = new addressInfo(addressSelect, this.houseListingType, isFormalAddress); //todo list...
		var strataPlan = self.strataPlan;
		var totalUnits = self.totalUnits.text();
		var devUnits = self.devUnits.text();

		var complexInfo = {
			_id: strataPlan + '-' + address.streetNumber + '-' + address.streetName + '-' + address.streetType,
			name: $fx.normalizeComplexName(complexName),
			complexName: complexName,
			strataPlan: strataPlan,
			addDate: $fx.getToday(),
			subArea: subArea,
			neighborhood: neighborhood,
			postcode: postcode,
			streetNumber: address.streetNumber,
			streetName: address.streetName + address.streetType,
			dwellingType: dwellingType,
			totalUnits: totalUnits,
			devUnits: devUnits,
			todo: complex != undefined ? 'saveComplex' : 'searchComplex',
			from: "fullRealtorReport"
		};

		//console.log('===>add ComplexInfo: ', complexInfo);
		chrome.runtime.sendMessage(
			complexInfo,
			function (response) {
				if (response) {
					self.complexName.text(response.name);
					self.complexOrSubdivision.text(response.name);
				}
			}
		)

		

	},

	addBCAssessment: function () {
		//set bc assessment properties:
		this.bcAssess = $("#totalValue");
		this.bcLand = $("#landValue");
		this.bcImprovement = $("#houseValue");
		this.bcLand2ImprovementRatio = $('#land2HouseRatio');
		this.valueChange = $("#valueChange");
		this.valueChangePercent = $("#valueChangePercent");
		this.oldTimerLotValuePerSF = $('#oldTimerLotValuePerSF');
		this.marketValuePerSF = $('#marketValuePerSF');
	},

	addRemarks: function () {
		//get realtor remarks:
		var realtorRemarks = this.realtorRemarks.text();
		this.uiListingInfo.realtorRemarks.text(realtorRemarks);
		//get public remarks:
		var publicRemarks = this.publicRemarks.text();
		this.uiListingInfo.publicRemarks.text(publicRemarks);
		//highlight keyword in public remarks:
		$fx.highlight_words(this.keyword.val(), this.uiListingInfo.publicRemarks);
	},

	addShowingInfo: function () {
		//todo ...
	},

	searchTax: function () {
		var PID = this.pid.text();
		var self = this;
		console.log('[FR]===>Check the container class before TaxSearch:', self.tabContentContainer);
		if (!PID) { return; };
		chrome.storage.sync.set({ 'PID': PID });
		chrome.storage.sync.get('PID', function (result) {
			//console.log(">>>PID saved for tax search: ", result.PID);
			chrome.runtime.sendMessage(
				{ from: 'ListingReport', todo: 'taxSearch' },
				function (response) {
					//console.log('>>>mls-fullpublic got tax response:', response);
					var divTab = $('div' + self.tabID, top.document);
					var divTaxSearch = $('div#tab1', top.document);
					self.tabContentContainer = divTab;
					console.log(divTab);
					divTab.attr("style", "display: block!important");
					divTaxSearch.attr("style", "display: none!important");
					chrome.storage.sync.set({curTabID: self.tabID});
				}
			)
		});
	},

	searchStrataPlanSummary: function () {
		
		var strataPlan = this.legalDesc.strataPlan1;
		var complexName = this.complexOrSubdivision.text();
		complexName = $fx.normalizeComplexName(complexName); ////NORMALIZE THE COMPLEX NAME FROM THE REPORT
		chrome.storage.sync.set({ 'strataPlan': strataPlan, 'complexName': complexName }, function (e) {
			
			chrome.runtime.sendMessage(
				{
					from: 'ListingReport',
					todo: 'searchStrataPlanSummary',
					showResult: true,
					saveResult: true
				},
				function (response) {
				
				}
			)
		});
	},
	//send strata plan number to Home Tab - Quick search
	addStrataEvents: function () {

		var self = this;

		this.strataPlanLink.click(function (e) {

			e.preventDefault();
			var homeTab = $('#HomeTabLink', top.document);
			homeTab[0].click();
			//console.log("strata plan Link Clicked!");
			var mlsDateLow = $("#f_33_Low__1-2-3-4");
			var mlsDateHigh = $("#f_33_High__1-2-3-4");
			var divTab = $('div' + this.tabID, top.document);
			//console.log(divTab);
			divTab.removeAttr("style");

			chrome.runtime.sendMessage(
				{
					from: 'ListingReport',
					todo: 'switchTab',
					showResult: false,
					saveResult: true
				},

				function (response) {
					//console.log('mls-fullrealtor got response: ', response);
				}
			)

		});
	},

	addComplexEvent: function () {
		(function event(self) {
			self.saveComplexButton.click(
				self.saveComplexInfo.bind(self)
			);
		})(this);
	},

	saveComplexInfo: function () {
		//console.log('save button clicked!');
		//manually save or update complex name to the database
		var self = this;
		var inputName = $('#inputComplexName').val();
		inputName = $fx.normalizeComplexName(inputName);
		if (inputName.length > 0) {
			this.addComplexInfo(inputName);
			this.complexName.text(inputName + '*');

			var recordNo = parseInt(self.curPage.value);
			var recordRows = $(self.spreadsheetTable).children().find('tr');
			var recordRow = $(recordRows[recordNo]);
			var cells = recordRow.children();
			var cols = $fx.setCols(self.tabTitle);
			var complexCell = cells[cols.complexName];
			var strataPlan = cells[cols.strataPlan].textContent;
			var streetAddress = cells[cols.streetAddress].textContent;
			var recordRow_i = null;
			var strataPlan_i ="";
			var streetAddress_i = "";
			var cells_i = null;
			var complexCell_i = null;
			for(var i =1; i<recordRows.length; i++){
				recordRow_i = $(recordRows[i]);
				cells_i = recordRow_i.children();
				complexCell_i = cells_i[cols.complexName];
				strataPlan_i = cells_i[cols.strataPlan].textContent;
				streetAddress_i = cells_i[cols.streetAddress].textContent;
				if (strataPlan == strataPlan_i && streetAddress == streetAddress_i){
					complexCell_i.textContent = inputName;
				}
			};
	
		};
	},

	addDataEvents: function () {

		(function onEvents(self) {

			chrome.storage.onChanged.addListener(function (changes, area) {
				console.log("====>fullrealtor: got a message: !", changes);
				if (area == "sync" && "from" in changes) {
					if (changes.from.newValue.indexOf('assess') > -1 && changes.from.newValue.indexOf('ForListingReport') > -1) {
						self.updateAssess();
					};
					if (changes.from.newValue.indexOf('strataPlanSummary') > -1) {
						self.updateComplexListingQuan(changes);
						//self.syncTabToContent();
						//let topTabInfo = new TopTabInfo(curTabID);
						//topTabInfo.ActiveThisTab();

					}
					if (changes.from.newValue.indexOf('complex') > -1 && changes.from.newValue.indexOf('fullRealtorReport')>-1 ) {
						self.updateComplexInfo();
					}
					console.log("this: ", self);
				}

			});
		})(this);
	},

	updateAssess: function () {
		var self = this;
		var listPrice = $fx.convertStringToDecimal(self.lp.text());
		var soldPrice = $fx.convertStringToDecimal(self.sp.text());
		chrome.storage.sync.get(['totalValue', 'improvementValue', 'landValue', 'lotSize', 'address', 'bcaDataUpdateDate','planNum', 'dataFromDB'], function (result) {
			var totalValue = result.totalValue;
			var formalAddress = result.address.trim();
			if (totalValue==0){
				console.log("No BCA Assess Published Yet");
				//Update PlanNum and formal Address:
				if(result.planNum){
					self.addStrataPlan(result.planNum);
					//self.uiListingInfo.planNo.text('Plan Num: ' + result.planNum + '*'); //Update the strataNum
				}
				
				self.formalAddress.text(formalAddress);
				if(formalAddress){
					self.addComplexInfo(); //Search Complex Name
				}
				return;
			}
			var improvementValue = result.improvementValue;
			var landValue = result.landValue;
			var lotSize = result.lotSize;
			var lotArea = $fx.convertStringToDecimal(lotSize, true);
			var lotAreaInSquareFeet = (lotArea < 500 ? (lotArea * 43560).toFixed(0) : $fx.numberWithCommas($fx.removeDecimalFraction(lotArea)));
			
			var finishedFloorArea = $fx.convertStringToDecimal(self.finishedFloorArea.text());
			var intTotalValue = $fx.convertStringToDecimal(totalValue);
			var intImprovementValue = $fx.convertStringToDecimal(improvementValue);
			var intLandValue = $fx.convertStringToDecimal(landValue);
			var land2TotalRatio = (intLandValue / intTotalValue * 100).toFixed(1);
			var house2TotalRatio = (intImprovementValue / intTotalValue * 100).toFixed(1);
			var land2HouseRatio = (intLandValue / intImprovementValue).toFixed(1);
			var landValuePerSF = '';
			var houseValuePerSF = '';
			var olderTimerLotValuePerSF = '';
			var marketLotValuePerSF = '';
			var marketHouseValuePerSF = '';
			var marketValuePerSF = '';
			var houseType = self.houseListingType;
			var dataFromDB = result.dataFromDB;

			//Update PlanNum and formal Address:
			if(result.planNum){
				self.addStrataPlan(result.planNum);
				//self.uiListingInfo.planNo.text('Plan Num: ' + result.planNum + '*'); //Update the strataNum
			}
			
			self.formalAddress.text(formalAddress);
			if(formalAddress){
				self.addComplexInfo(); //Search Complex Name
			}

			//console.log("mls-fullpublic got total bc assessment: ", landValue, improvementValue, totalValue, lotArea);
			if (totalValue != 0) {
				if (soldPrice > 0) {
					var changeValue = soldPrice - intTotalValue;
					var changeValuePercent = changeValue / intTotalValue * 100;
					marketLotValuePerSF = (soldPrice * land2TotalRatio / 100 / lotAreaInSquareFeet).toFixed(0);
					marketHouseValuePerSF = (soldPrice * house2TotalRatio / 100 / finishedFloorArea).toFixed(0);
				} else {
					var changeValue = listPrice - intTotalValue;
					var changeValuePercent = changeValue / intTotalValue * 100;
					marketLotValuePerSF = (listPrice * land2TotalRatio / 100 / lotAreaInSquareFeet).toFixed(0);
					marketHouseValuePerSF = (listPrice * house2TotalRatio / 100 / finishedFloorArea).toFixed(0);
				}
			}
			if (houseType == 'Detached') {
				var bcaLandValuePerSF = (intLandValue / lotAreaInSquareFeet).toFixed(0);
				var bcaHouseValuePerSF = (intImprovementValue / finishedFloorArea).toFixed(0);
				landValuePerSF = '[ $' + bcaLandValuePerSF.toString() + '/sf ]';
				//console.log('landValue / lotArea', intLandValue, lotAreaInSquareFeet);
				houseValuePerSF = '[ $' + bcaHouseValuePerSF.toString() + '/sf ]';
				//console.log('houseValue / finishedArea', intImprovementValue, finishedFloorArea);
				if (soldPrice > 0) {
					var soldOldTimerPerSF = (soldPrice / lotAreaInSquareFeet).toFixed(0).toString();
					olderTimerLotValuePerSF = 'OT Lot/SF sold$' + soldOldTimerPerSF + ' /bca$' + (intTotalValue / lotAreaInSquareFeet).toFixed(0).toString();
				} else {
					var listOldTimerPerSF = (listPrice / lotAreaInSquareFeet).toFixed(0).toString();
					olderTimerLotValuePerSF = 'OT Lot/SF list$' + listOldTimerPerSF + ' /bca$' + (intTotalValue / lotAreaInSquareFeet).toFixed(0).toString();
				}
			}
			self.bcAssess.text((dataFromDB ? 'total:  ' : 'total*:  ') + $fx.removeDecimalFraction(totalValue));
			self.bcLand.text('land:  ' + $fx.removeDecimalFraction(landValue) + landValuePerSF);
			self.bcImprovement.text('house:' + $fx.removeDecimalFraction(improvementValue) + houseValuePerSF);
			self.bcLand2ImprovementRatio.text(land2TotalRatio.toString() + '%L-T ' + house2TotalRatio.toString() + '%H-T ' + land2HouseRatio.toString() + 'L-H');
			self.valueChange.text("$" + $fx.numberWithCommas(changeValue.toFixed(0)) + " [ " + changeValuePercent.toFixed(0).toString() + '% ]   ');
			self.oldTimerLotValuePerSF.text(olderTimerLotValuePerSF);
			self.marketValuePerSF.text('Lot:$' + marketLotValuePerSF.toString() + '/SF' + ' | Impv:$' + marketHouseValuePerSF.toString() + '/SF')
			self.lotArea.text($fx.numberWithCommas($fx.convertStringToDecimal(lotAreaInSquareFeet, true)));
			
		})
	},

	clearAssess: function () {
		var self = this;
		chrome.storage.sync.set({
			'totalValue': '',
			'improvementValue': '',
			'landValue': '',
			'lotSize': '',
			'address': '',
			'bcaDataUpdateDate': ''
		}, function () {
			//console.log("mls-fullpublic clear AssessInfo! ");
		})
	},

	updateComplexListingQuan: function (changes) {
		var self = this;
		//console.log("update strataPlanSummary:");
		chrome.storage.sync.get('count', function (result) {
			var complexName = (self.complexOrSubdivision.text().length > 0 ? self.complexOrSubdivision.text() : 'Complex');
			var summary = ': [ ' + result.count + ' ]';
			self.complexName.text(complexName);
			self.complexListingSummary.text(summary);
		})
	},

	updateComplexInfo: function () {
		var self = this;
		var $inputName = $('#inputComplexName');
		var compName = "";
		
		chrome.storage.sync.get('complexName', function (result) {
			compName = $fx.normalizeComplexName(result.complexName);
			self.complexName.text(compName);
			self.complexOrSubdivision.text(compName);
			$inputName.val(compName);
	
		})
	},
}

//star the app
$(function () {
	fullRealtor.init();
});
