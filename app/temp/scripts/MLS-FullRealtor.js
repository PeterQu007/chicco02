/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	//add extra functions to the full realtor report
	//show bca info
	//show strata info
	//cal unit price, percent numbers

	'use strict';

	var _LegalDescription = __webpack_require__(5);

	var _LegalDescription2 = _interopRequireDefault(_LegalDescription);

	var _AddressInfo = __webpack_require__(6);

	var _AddressInfo2 = _interopRequireDefault(_AddressInfo);

	var _uiListingInfo = __webpack_require__(7);

	var _uiListingInfo2 = _interopRequireDefault(_uiListingInfo);

	var _MainNavBar = __webpack_require__(2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	//var curTabID = null;
	var $fx = L$();

	var fullRealtor = {

		init: function init() {
			//console.clear();
			//read full realtor report, get listing data
			//$fx.getCurrentTab(curTabID);
			//link to iframe's tabID
			this.tabID = $fx.getTabID(window.frameElement.src);
			console.warn('[FR]===>window.frameElement.id', this.tabID);
			chrome.storage.sync.set({ curTabID: this.tabID });
			this.lockVisibility();
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
			var that = this;
			setTimeout(function () {
				that.searchTax();
			}, 500); //delay does not help the tab jumps issue
			//this.lockVisibility();
		},

		uiListingInfo: new _uiListingInfo2.default(),
		//elements on the page
		houseType: $('div[style="top:32px;left:46px;width:61px;height:14px;"]'),
		div: $('div.mls0'),
		lp: $('div[style="top:7px;left:571px;width:147px;height:13px;"]'),
		sp: $('div[style="top:23px;left:571px;width:147px;height:15px;"]'),
		lotArea: null, //lotArea from getMorePropertyInfo
		finishedFloorArea: $('div[style="top:698px;left:120px;width:50px;height:16px;"]'),
		report: $('div#divHtmlReport'),
		pid: null, //pid from getMorePropertyInfo
		complexOrSubdivision: null, //complex name from getMorePropertyInfo
		mlsNo: $('div[style="top:18px;left:4px;width:123px;height:13px;"] a'),
		legal: $('div[style="top:426px;left:75px;width:593px;height:22px;"]'),
		realtorRemarks: $('div[style="top:860px;left:53px;width:710px;height:35px;"]'),
		publicRemarks: $('div[style="top:897px;left:4px;width:758px;height:75px;"]'),
		keyword: $('div#app_banner_links_left input.select2-search__field', top.document),

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
		legalDesc: null,
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
		tabContentContainer: null,

		lockVisibility: function lockVisibility() {
			var divTab = $('div' + this.tabID, top.document);
			var divTaxSearch = $('div#tab1', top.document);
			this.tabContentContainer = divTab;
			//console.log(divTab);
			divTab.attr("style", "display: block!important");
			divTaxSearch.attr("style", "display: none!important");
			chrome.storage.sync.set({ curTabID: this.tabID });
		},

		getMorePropertyInfo: function getMorePropertyInfo() {
			var self = this;
			var listingHouseType = self.houseType.text().replace(',', '').replace(' ', '');
			switch (listingHouseType) {
				case 'Attached':
					self.pid = $('div[style="top:194px;left:355px;width:82px;height:15px;"]'); //P.I.D.
					self.complexOrSubdivision = $('div[style="top:236px;left:381px;width:383px;height:14px;"]'); //Complex/Subdiv
					self.totalUnits = $('div[style="top:326px;left:659px;width:101px;height:16px;"'); //Total units in Strata
					self.devUnits = $('div[style="top:326px;left:470px;width:95px;height:15px;"'); //Units in Development
					self.lotArea = $('div[style="top:129px;left:355px;width:75px;height:13px;"'); //Sq. Footage
					break;
				case 'Detached':
					self.pid = $('div[style="top:198px;left:681px;width:82px;height:15px;"]'); //P.I.D.
					self.complexOrSubdivision = $('div[style="top:229px;left:393px;width:369px;height:13px;"]'); //Complex/Subdiv
					self.lotArea = $('div[style="top:133px;left:375px;width:67px;height:13px;"'); //
					self.devUnits = $('<div>1</div>'); // N/A for single house
					self.totalUnits = $('<div>1</div>'); // N/A for single house
					break;
			}
		},

		calculateSFPrice: function calculateSFPrice() {
			//console.log(this.lp.text(), this.sp.text(), this.finishedFloorArea.text());
			var listPrice = $fx.convertStringToDecimal(this.lp.text());
			var soldPrice = $fx.convertStringToDecimal(this.sp.text());
			var finishedFloorArea = $fx.convertStringToDecimal(this.finishedFloorArea.text());
			var sfPriceList = listPrice / finishedFloorArea;
			var sfPriceSold = soldPrice / finishedFloorArea;

			this.lp.text(this.lp.text() + ' [$' + sfPriceList.toFixed(0) + '/sf]');
			if (sfPriceSold > 0) {
				this.sp.text(this.sp.text() + ' [$' + sfPriceSold.toFixed(0) + '/sf]');
			}
		},

		populateUiListing: function populateUiListing() {
			this.addMLSNo();
			this.addStrataPlan();
			this.addComplexInfo();
			this.addBCAssessment();
			this.addRemarks();
		},

		addMLSNo: function addMLSNo() {
			var mlsNO = this.mlsNo.text();
			this.uiListingInfo.mlsNo.text(mlsNO);
		},

		addStrataPlan: function addStrataPlan() {
			var legal = this.legal.text(); //get legal description from the Report
			var legalDesc = this.legalDesc = new _LegalDescription2.default(legal);
			var complexName = this.complexOrSubdivision.text();
			this.strataPlan = legalDesc.strataPlan1;
			this.uiListingInfo.planLink.text(legalDesc.strataPlan1);

			this.saveComplexButton = $('#saveComplexName');
			this.strataPlanLink = $('#strataPlanLink');
			this.complexSummary = $('#complexSummary');
			this.complexName = $('#complexName');
			if (complexName) {
				this.complexName.text(complexName + ": ");
			};
			this.complexListingSummary = $('#listingQuantity');
			this.formalAddress = $('#formalAddress');

			chrome.storage.sync.set({
				strataPlan1: legalDesc.strataPlan1,
				strataPlan2: legalDesc.strataPlan2,
				strataPlan3: legalDesc.strataPlan3,
				strataPlan4: legalDesc.strataPlan4
			});
		},

		addComplexInfo: function addComplexInfo(complex) {
			var self = this;
			var subArea = self.subArea.text();
			var neighborhood = self.neighborhood.text();
			var postcode = self.postcode.text();
			var dwellingType = self.dwellingType.text();
			var complexName = complex || self.complexOrSubdivision.text().trim();
			var address = new _AddressInfo2.default(self.address.text(), this.houseListingType); //todo list...
			var strataPlan = self.strataPlan;
			var totalUnits = self.totalUnits.text();
			var devUnits = self.devUnits.text();

			var complexInfo = {
				_id: strataPlan + '-' + address.streetNumber + '-' + address.streetName + '-' + address.streetType,
				name: complexName,
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
				todo: complexName.length > 0 ? 'saveComplex' : 'searchComplex'
			};

			//console.log('===>add ComplexInfo: ', complexInfo);
			chrome.runtime.sendMessage(complexInfo, function (response) {
				if (response) {
					self.complexName.text(response);
					self.complexOrSubdivision.text(response);
				}
			});
		},

		addBCAssessment: function addBCAssessment() {
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

		addRemarks: function addRemarks() {
			//get realtor remarks:
			var realtorRemarks = this.realtorRemarks.text();
			this.uiListingInfo.realtorRemarks.text(realtorRemarks);
			//get public remarks:
			var publicRemarks = this.publicRemarks.text();
			this.uiListingInfo.publicRemarks.text(publicRemarks);
			//highlight keyword in public remarks:
			$fx.highlight_words(this.keyword.val(), this.uiListingInfo.publicRemarks);
		},

		addShowingInfo: function addShowingInfo() {
			//todo ...
		},

		searchTax: function searchTax() {
			var PID = this.pid.text();
			var self = this;
			console.log('[FR]===>Check the container class before TaxSearch:', self.tabContentContainer);
			if (!PID) {
				return;
			};
			chrome.storage.sync.set({ 'PID': PID });
			chrome.storage.sync.get('PID', function (result) {
				//console.log(">>>PID saved for tax search: ", result.PID);
				chrome.runtime.sendMessage({ from: 'ListingReport', todo: 'taxSearch' }, function (response) {
					//console.log('>>>mls-fullpublic got tax response:', response);
					var divTab = $('div' + self.tabID, top.document);
					var divTaxSearch = $('div#tab1', top.document);
					self.tabContentContainer = divTab;
					console.log(divTab);
					divTab.attr("style", "display: block!important");
					divTaxSearch.attr("style", "display: none!important");
					chrome.storage.sync.set({ curTabID: self.tabID });
				});
			});
		},

		searchStrataPlanSummary: function searchStrataPlanSummary() {
			//console.log('mls-fullrealtor.search strataPlanSummary listings: ');
			var strataPlan = this.legalDesc.strataPlan1;
			var complexName = this.complexOrSubdivision.text();
			chrome.storage.sync.set({ 'strataPlan': strataPlan, 'complexName': complexName }, function (e) {
				//console.log('mls-fullrealtor.searchComplex.callback parameters: ', e);
				chrome.runtime.sendMessage({
					from: 'ListingReport',
					todo: 'searchStrataPlanSummary',
					showResult: true,
					saveResult: true
				}, function (response) {
					//console.log('mls-fullrealtor got search strataPlanSummary response: ', response);
					//set the current Tab 
				});
			});
		},
		//send strata plan number to Home Tab - Quick search
		addStrataEvents: function addStrataEvents() {

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

				chrome.runtime.sendMessage({
					from: 'ListingReport',
					todo: 'switchTab',
					showResult: false,
					saveResult: true
				}, function (response) {
					//console.log('mls-fullrealtor got response: ', response);
				});
			});
		},

		addComplexEvent: function addComplexEvent() {
			(function event(self) {
				self.saveComplexButton.click(self.saveComplexInfo.bind(self));
			})(this);
		},

		saveComplexInfo: function saveComplexInfo() {
			//console.log('save button clicked!');
			var inputName = $('#inputComplexName').val();
			if (inputName.length > 0) {
				this.addComplexInfo(inputName);
				this.complexName.text(inputName + '*');
				//this.complexSummary.text(inputName + '*');
			};
		},

		addDataEvents: function addDataEvents() {

			(function onEvents(self) {

				chrome.storage.onChanged.addListener(function (changes, area) {
					console.log("====>fullrealtor: got a message: !", changes);
					if (area == "sync" && "from" in changes) {
						if (changes.from.newValue.indexOf('assess') > -1) {
							self.updateAssess();
						};
						if (changes.from.newValue.indexOf('strataPlanSummary') > -1) {
							self.updateComplexListingQuan(changes);
							//self.syncTabToContent();
							//let topTabInfo = new TopTabInfo(curTabID);
							//topTabInfo.ActiveThisTab();
						}
						if (changes.from.newValue.indexOf('complex') > -1) {
							self.updateComplexInfo();
						}
						console.log("this: ", self);
					}

					// if (area == "sync" && "curTabID" in changes) {
					// 	if (changes.curTabID.newValue) {
					// 		if (changes.curTabID.oldValue) {
					// 			//remove the old style of the div
					// 			var oldTabID = changes.curTabID.oldValue;
					// 			console.log("mls-fullrealtor: my old tab ID is: ", oldTabID);
					// 			var oldDivTab = $('div' + oldTabID, top.document);
					// 			oldDivTab.removeAttr("style");
					// 		}
					// 		curTabID = changes.curTabID.newValue;
					// 		console.log("mls-fullrealtor: my tab ID is: ", curTabID);
					// 		var divTab = $('div' + curTabID, top.document);
					// 		var divTab1 = $('div#tab1', top.document);
					// 		console.log(divTab);
					// 		divTab.attr("style", "display: block!important");
					// 		divTab1.attr("style", "display: none!important");
					// 	}
					// }
				});
			})(this);
		},

		updateAssess: function updateAssess() {
			var self = this;
			var listPrice = $fx.convertStringToDecimal(self.lp.text());
			var soldPrice = $fx.convertStringToDecimal(self.sp.text());
			chrome.storage.sync.get(['totalValue', 'improvementValue', 'landValue', 'lotSize', 'address', 'bcaDataUpdateDate'], function (result) {
				var totalValue = result.totalValue;
				var improvementValue = result.improvementValue;
				var landValue = result.landValue;
				var lotSize = result.lotSize;
				var lotArea = $fx.convertStringToDecimal(lotSize, true);
				var lotAreaInSquareFeet = lotArea < 500 ? (lotArea * 43560).toFixed(0) : lotArea;
				var formalAddress = result.address.trim();
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
				self.bcAssess.text('total:  ' + $fx.removeDecimalFraction(totalValue));
				self.bcLand.text('land:  ' + $fx.removeDecimalFraction(landValue) + landValuePerSF);
				self.bcImprovement.text('house:' + $fx.removeDecimalFraction(improvementValue) + houseValuePerSF);
				self.bcLand2ImprovementRatio.text(land2TotalRatio.toString() + '%L-T ' + house2TotalRatio.toString() + '%H-T ' + land2HouseRatio.toString() + 'L-H');
				self.valueChange.text("$" + $fx.numberWithCommas(changeValue.toFixed(0)) + " [ " + changeValuePercent.toFixed(0).toString() + '% ]   ');
				self.oldTimerLotValuePerSF.text(olderTimerLotValuePerSF);
				self.marketValuePerSF.text('Lot:$' + marketLotValuePerSF.toString() + '/SF' + ' | Impv:$' + marketHouseValuePerSF.toString() + '/SF');
				self.lotArea.text($fx.numberWithCommas($fx.convertStringToDecimal(lotAreaInSquareFeet, true)));
				self.formalAddress.text(formalAddress);
			});
		},

		clearAssess: function clearAssess() {
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
			});
		},

		updateComplexListingQuan: function updateComplexListingQuan(changes) {
			var self = this;
			//console.log("update strataPlanSummary:");
			chrome.storage.sync.get('count', function (result) {
				var complexName = self.complexOrSubdivision.text().length > 0 ? self.complexOrSubdivision.text() : 'Complex';
				var summary = ': [ ' + result.count + ' ]';
				self.complexName.text(complexName);
				self.complexListingSummary.text(summary);
			});
		},

		updateComplexInfo: function updateComplexInfo() {
			var self = this;
			//console.log('update Complex info:');
			chrome.storage.sync.get('complexName', function (result) {
				self.complexName.text(result.complexName);
				self.complexOrSubdivision.text(result.complexName);
			});
		}

		// syncTabToContent(){
		// 	chrome.runtime.sendMessage(
		// 		{todo: 'syncTabToContent',
		// 		 from: 'full-realtor syncTabToContent',
		// 		 tabID: this.tabID}
		// 	)
		// }


		//star the app
	};$(function () {
		fullRealtor.init();
	});

/***/ }),
/* 1 */,
/* 2 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	//Class Wrapper mainNavBar for Top Level Tabs Container - Main Navigation Bar(mainNav)
	//Top Level Tabs Container(mainNavBar) is an HTML Elements ul Complex inside top level URL:
	//https://bcres.paragonrels.com/ParagonLS/Default.mvc#2
	//mainNavBar contains mainNavItem - individual topTab ui Complexes
	//sub Class Wrapper mainNavItem for topTab ui Complex

	var mainPanelID = 'div#app_tab_switcher'; //Top Level Panel Container of TopTab mainNav & subContent Selector ID
	var mainNavBarID = 'ul#tab-bg'; //Top Tabs Main Navigation Selector ID
	var newMainNavItemClass = '.ui-corner-top'; //Top Tab li element class
	var mainNavItemClass = 'li.ui-state-default.ui-corner-top'; //Top Tab li element class
	var activeNavItemClass = 'ui-tabs-selected ui-state-active'; //Current Active Top Tab Selector Class

	//const savedPropertySearches = 'iframe#tab2';

	var MainNavBar = function () {
	    function MainNavBar() {
	        _classCallCheck(this, MainNavBar);

	        this.$mainNavBar = $(mainNavBarID);
	        this.$mainNavItems = null; //set of top tap ui HTML elements
	        this.mainNavItems = []; //set of class of mainNavItems
	        this.curNavItem = null;
	        this.enableOnAddNewNavItem = false; //disable onAddNewTab event in the init
	        this.onAddNewNavItem();
	        this.onAddNewNavItemContent();
	        this.update();
	        this.onClick();
	        this.enableOnAddNewNavItem = true; //enable onAddNewTab event after the init
	    }
	    //events:


	    _createClass(MainNavBar, [{
	        key: 'onAddNewNavItem',
	        value: function onAddNewNavItem() {
	            //event will be triggered by adding new tab with class ".ui-corner-top" (mainNavItemClass)
	            //goggle: jquery detecting div of certain class has been added to DOM
	            var self = this;
	            $.initialize(newMainNavItemClass, function () {
	                var $navItem = $(this);
	                //if added $tab is the top tab item, then update the mainNavItem:
	                if (self.enableOnAddNewNavItem && $navItem.parent().attr('id') == "tab-bg") {

	                    var newNavItemID = $navItem.children('a').attr('href');
	                    console.warn('[Class.TopTabs]onAddNewTab===>New Tab added, newTabID:', newNavItemID, $navItem, $navItem.parent().attr('id'));
	                    //self.updateTopTabInfos(newTabID);
	                    self.setCurMainNavItem(newNavItemID); //updateTopTabInfos, and set Current tab
	                }
	            });
	        }
	    }, {
	        key: 'onAddNewNavItemContent',
	        value: function onAddNewNavItemContent() {
	            //event will be triggered by adding new tab with class ui-corner-top
	            //goggle: jquery detecting div of certain class has been added to DOM
	            var self = this;
	            $.initialize(".ui-tabs-sub", function () {
	                var $tabContent = $(this);
	                //if added $tab is the top tab, then update the topTabInfos:
	                //if(self.EnableOnAddNewTab && $tab.parent().attr('id')=="tab-bg") {
	                //console.warn('Class.TopTabs.onAddNewTabContent===>New TabContent added', $tabContent, $tabContent.parent().attr('id'));
	                //    self.updateTopTabInfos();
	                //}
	                chrome.storage.sync.get('showTabQuickSearch', function (result) {
	                    //console.log('Class.TopTabs.onAddNewTabContent::get showTabQuickSearch:', result.showTabQuickSearch);
	                    self.mainNavItems.forEach(function (mainNavItem) {
	                        //console.log('tabInfo.tabTitle:', tabInfo.tabTitle)
	                        if (mainNavItem.tabTitle == 'Quick Search') {
	                            mainNavItem.deactivate();
	                        }
	                    });
	                });
	            });
	        }
	    }, {
	        key: 'onClick',
	        value: function onClick() {
	            var self = this;
	            //jquery add click event to a li element
	            this.$mainNavItems.each(function (index) {
	                $(this).click(function (e) {
	                    console.log('top tab clicked', e);
	                    self.mainNavItems.forEach(function (navItem) {
	                        navItem.deactivate();
	                    });
	                    var navItem = new mainNavItem($(e.currentTarget));
	                    console.log(navItem);
	                    navItem.activate();
	                });
	            });
	        }

	        //methods:

	    }, {
	        key: 'update',
	        value: function update() {
	            var self = this;
	            self.mainNavItems.length = 0; //clean up the array of mainNavItem object
	            this.$mainNavItems = null; //clean up the $topTabs HTML collection
	            this.$mainNavItems = this.$mainNavBar.children(mainNavItemClass); //set of top tab items for navigation
	            this.$mainNavItems.each(function (index) {
	                var navItem = new mainNavItem($(this)); //convert each top tab element to mainNavItem Class
	                self.mainNavItems.push(navItem); //
	            });
	        }
	    }, {
	        key: 'setCurMainNavItem',
	        value: function setCurMainNavItem(curNavItemID) {
	            this.update();
	            var i;
	            for (i = 0; i < this.mainNavItems.length; i++) {
	                var navItem = this.mainNavItems[i];
	                if (navItem.ID == curNavItemID) {
	                    navItem.activate();
	                } else {
	                    navItem.deactivate();
	                }
	            }
	        }

	        // closeQuickSearchTab(tabID){
	        //     this.topTabInfos.forEach(function(tabInfo){
	        //         if(tabInfo.tabTitle.trim()=="Quick Search"){
	        //             tabInfo.$tabLink.click();
	        //             tabInfo.$tabCloseLink.click();
	        //         }
	        //     })
	        // }

	    }]);

	    return MainNavBar;
	}();

	exports.default = MainNavBar;

	var mainNavItem = exports.mainNavItem = function () {
	    //Class Wrapper of a top level tab ui complex, as Main Nav Item inside Main Nav Bar
	    //parameter $navItem : Top Level Tab Element of HTML li
	    function mainNavItem($navItem) {
	        _classCallCheck(this, mainNavItem);

	        //$navItem element is a li under ul#tab-bg:
	        //populate the properties:
	        this.$me = $navItem; //keep the tab li element <li>
	        this.$contentLink = this.$me.children('a'); //keep the tab link <a>
	        this.ID = this.$contentLink.attr('href'); //keep the tabID, '#tab3', '#' is reserved
	        this.contentURL = this.$contentLink.attr('url'); //keep the tab url
	        this.$closeLink = this.$me.children('em'); //close the tab
	        this.$Title = this.$contentLink.children('span'); //keep the tab title <span>
	        this.Title = this.$Title.text().trim(); //keep the tab title text string

	        //navItem Content Element: e.g. div#tab2 or iframe#tab2
	        this.$Content = $(mainPanelID).children(this.ID); //keep the tab's content <element>

	        //events Click:
	        this.Clicked = false; //
	        this.onClick();
	    }

	    //events:


	    _createClass(mainNavItem, [{
	        key: 'onClick',
	        value: function onClick() {
	            var self = this;
	            //jquery add click event to anchor element a
	            this.$contentLink.click(function () {
	                console.log('click top tab Link');
	                self.Clicked = true;
	                if (self.Title != 'Home') {
	                    self.$Content.removeAttr('style');
	                }
	                //self.ActiveThisTab();
	            });

	            this.$Title.click(function () {
	                console.log('click tab span-title');
	                self.Clicked = true;
	                if (self.Title != 'Home') {
	                    self.$Content.removeAttr('style');
	                }
	            });

	            this.$me.click(function () {
	                console.log('click tab li');

	                self.$Content.removeAttr('style');
	            });
	        }

	        //methods:

	    }, {
	        key: 'activate',
	        value: function activate() {
	            //activate this nav item, show the nav item content
	            this.$me.addClass(activeNavItemClass);
	            console.log('ActivateThisTab, title, id:', this.Title, this.ID);
	            this.$Content.removeClass('ui-tabs-hide');
	        }
	    }, {
	        key: 'deactivate',
	        value: function deactivate() {
	            //deactivate this nav item, hide the nav item content
	            this.$me.removeClass(activeNavItemClass);
	            console.log('DeactivateThisTab, title, id:', this.Title, this.ID);
	            if (this.Title != 'Home') {
	                this.$Content.removeAttr('style');
	            }
	            this.$Content.addClass('ui-tabs-hide');
	        }
	    }, {
	        key: 'syncTabToContent',
	        value: function syncTabToContent() {
	            if (this.$Content.inlineStyle('display') === 'block') {
	                this.$me.addClass(activeNavItemClass);
	            } else {
	                if (this.$Content.hasClass('ui-tabs-hide')) {
	                    this.$me.removeClass(activeNavItemClass);
	                } else {
	                    //this.$tab.addClass(activeTabClass)
	                }
	            }
	            console.log('syncTabToContent, title, id:', this.$me, this.Title, this.ID);
	        }
	    }]);

	    return mainNavItem;
	}();

/***/ }),
/* 3 */,
/* 4 */,
/* 5 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// get strata plan number

	var strataPlanPrefix = ['EPS', 'BCS', 'LMS', 'BCP', 'LMP', 'NWS', 'EPP', 'PLAN', 'PL', 'NW'];

	var LegalDescription = function () {
		function LegalDescription(legal) {
			_classCallCheck(this, LegalDescription);

			this.legal = legal.replace(/\./g, ' ');
			this.strataPlan1 = '';
			this.strataPlan2 = '';
			this.strataPlan3 = '';
			this.strataPlan4 = '';
			this.LotNumber = '';
			this.blockNumber = '';
			this.ldNumber = '';
			this.secNumber = '';
			this.rngNumber = '';

			this.getNumbers(this.legal);
		}

		_createClass(LegalDescription, [{
			key: 'getNumbers',
			value: function getNumbers(legal) {

				for (var j = 0; j < strataPlanPrefix.length; j++) {
					var start = legal.indexOf(strataPlanPrefix[j]);
					if (start >= 0) {

						var subPlan = legal.substring(start + strataPlanPrefix[j].length).trim();

						var plan = '';

						for (var i = 0; i < subPlan.length; i++) {

							if (!isNaN(subPlan[i])) {
								plan += subPlan[i];
							} else {
								break;
							}
						}
						this.strataPlan1 = strataPlanPrefix[j] + plan.trim();
						this.strataPlan2 = strataPlanPrefix[j] + plan.trim() + ' ';
						this.strataPlan3 = strataPlanPrefix[j] + ' ' + plan.trim();
						this.strataPlan4 = strataPlanPrefix[j] + ' ' + plan.trim() + ' ';
						return;
					}
				}

				this.strataPlan1 = 'strata plan not found';
			}
		}]);

		return LegalDescription;
	}();

	exports.default = LegalDescription;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// Analyse the address information

	var AddressInfo = function () {
	    function AddressInfo(address, houseType) {
	        _classCallCheck(this, AddressInfo);

	        address = address.replace('.', '');
	        this.streetNumber = this.getStreetNumber(address, houseType);
	        this.streetName = this.getStreetName(address, houseType);
	        this.streetType = this.getStreetType(address, houseType);
	    }

	    _createClass(AddressInfo, [{
	        key: 'getStreetNumber',
	        value: function getStreetNumber(address, houseType) {
	            //split the address
	            var addressParts = address.split(' ');
	            var partIndex = 1;
	            switch (houseType) {
	                case 'Attached':
	                    partIndex = 1;
	                    break;
	                case 'Detached':
	                    partIndex = 0;
	                    break;
	            }
	            return addressParts[partIndex].trim();
	        }
	    }, {
	        key: 'getStreetName',
	        value: function getStreetName(address, houseType) {
	            var addressParts = address.split(' ');
	            var partIndex = 2;
	            switch (houseType) {
	                case 'Attached':
	                    partIndex = 2;
	                    break;
	                case 'Detached':
	                    partIndex = 1;
	                    break;
	            }
	            return addressParts[partIndex].trim();
	        }
	    }, {
	        key: 'getStreetType',
	        value: function getStreetType(address, houseType) {
	            var addressParts = address.split(' ');
	            var addressType = '';
	            var partIndex = 3;
	            switch (houseType) {
	                case 'Attached':
	                    partIndex = 3;
	                    break;
	                case 'Detached':
	                    partIndex = 2;
	                    break;
	            }
	            for (var i = partIndex; i < addressParts.length; i++) {
	                addressType += addressParts[i].trim();
	            }
	            return addressType;
	        }
	    }]);

	    return AddressInfo;
	}();

	;

	exports.default = AddressInfo;

/***/ }),
/* 7 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// UI element: ListingInfo

	var UIListingInfo = function () {
	    function UIListingInfo() {
	        _classCallCheck(this, UIListingInfo);

	        this.UIDiv = $('<div id="uiListingInfo"></div>');
	        this.mlsNo = $('<div>MLS #</div>');
	        //divs for strata & complex info:
	        this.planNo = $('<div id="strataPlan">PlanNo: </div>');
	        this.planLink = $('<a href="https://bcres.paragonrels.com/ParagonLS/Home/Page.mvc#HomeTab" \n                            target="HomeTab" id="strataPlanLink" ></a>');
	        this.formalAddress = $('<div id="formalAddress">adr: </div>');
	        this.complexSummary = $('<div id="complexSummary"></div>');
	        this.complexName = $('<span id="complexName">ComplexName</span>');
	        this.complexListingQuantity = $('<span id="listingQuantity"></span>');
	        this.inputComplexName = $('<input name="inputComplexName" />');
	        this.btnSaveComplexName = $('<button name="saveComplexName" class="btn btn-primary">Save</button>');
	        //divs for BC Assessment:
	        this.landValue = $('<div id="landValue">land value</div>');
	        this.houseValue = $('<div id="houseValue">house value</div>');
	        this.landValuePercent = $('<div>land value percent</div>');
	        this.houseValuePercent = $('<div>house value percent</div>');
	        this.landHouseRatio = $('<div id="land2HouseRatio">land house ratio</div>');
	        this.totalValue = $('<div id="totalValue"></div>');
	        this.valueChange = $('<div id="valueChange"></div>');
	        this.valueChangePercent = $('<div id="valueChangePercent"></div>');
	        this.oldTimerLotValuePerSF = $('<div id="oldTimerLotValuePerSF"></div>');
	        this.marketValuePerSF = $('<div id="marketValuePerSF"></div>');
	        //divs for remarks:
	        this.realtorRemarks = $('<div id="realtorRemarks"></div>');
	        this.publicRemarks = $('<div id="publicRemarks"></div>');
	        //divs for showing info:
	        this.showingInfo = $('<div id="showingInfo">Showing info:</div>');
	        this.inputClientName = $('<input id="clientName" type="text"/>');
	        this.inputShowingRequest = $('<input id ="showingRequest" type="text"/>');
	        this.inputShowingDate = $('<input id="showingDate"/>');
	        this.inputShowingTime = $('<input id="showingTime"/>');
	        this.btnSaveShowing = $('<button id="saveShowing" class="btn btn-success">Save</button>');
	        //assemble the elements:
	        this.buildUI();
	    }

	    _createClass(UIListingInfo, [{
	        key: 'buildUI',
	        value: function buildUI() {
	            var uiDiv = this.UIDiv;
	            uiDiv.append(this.mlsNo);
	            //add strata & complex info
	            this.planLink.appendTo(this.planNo);
	            uiDiv.append(this.planNo);
	            uiDiv.append(this.formalAddress);
	            this.complexName.appendTo(this.complexSummary);
	            this.complexListingQuantity.appendTo(this.complexSummary);
	            uiDiv.append(this.complexSummary);
	            uiDiv.append(this.inputComplexName);
	            uiDiv.append(this.btnSaveComplexName);
	            //add bca info
	            uiDiv.append($('<hr/>'));
	            uiDiv.append(this.landValue);
	            uiDiv.append(this.houseValue);
	            uiDiv.append(this.totalValue);
	            uiDiv.append(this.valueChange);
	            uiDiv.append(this.oldTimerLotValuePerSF);
	            uiDiv.append(this.marketValuePerSF);
	            //add remarks
	            uiDiv.append($('<hr/>'));
	            uiDiv.append(this.realtorRemarks);
	            uiDiv.append(this.publicRemarks);
	            //add showing info
	            uiDiv.append($('<hr/>'));
	            uiDiv.append(this.showingInfo);
	            uiDiv.append(this.inputClientName);
	            uiDiv.append(this.inputShowingRequest);
	            uiDiv.append(this.inputShowingDate);
	            uiDiv.append(this.inputShowingTime);
	            uiDiv.append(this.btnSaveShowing);
	        }
	    }, {
	        key: 'showUI',
	        value: function showUI(container) {
	            this.UIDiv.appendTo(container);
	            this.UIDiv.addClass('uilistinginfo');
	            //change inputbox width:
	            this.UIDiv.children('input').addClass('inputbox');
	            this.realtorRemarks.addClass('bottomline');
	        }
	    }]);

	    return UIListingInfo;
	}();

	exports.default = UIListingInfo;

/***/ })
/******/ ]);