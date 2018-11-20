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

	//manifest matches: "https://bcres.paragonrels.com/ParagonLS/Reports/Report.mvc?listingIDs=*viewID=c65*"
	//production file name: MLS-FullRealtor.js

	'use strict';

	var _LegalDescription = __webpack_require__(9);

	var _LegalDescription2 = _interopRequireDefault(_LegalDescription);

	var _AddressInfo = __webpack_require__(10);

	var _AddressInfo2 = _interopRequireDefault(_AddressInfo);

	var _uiListingInfo = __webpack_require__(11);

	var _uiListingInfo2 = _interopRequireDefault(_uiListingInfo);

	var _MainNavBar = __webpack_require__(6);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	//var curTabID = null;
	var $fx = L$();

	var fullRealtor = {

		init: function init() {
			//console.clear();
			//read full realtor report, get listing data
			//$fx.getCurrentTab(curTabID);
			//link to iframe's tabID
			this.tabID = $fx.getTabID(window.frameElement.src);

			this.tabNo = parseInt(this.tabID.replace('#tab', ''));
			var x = $('ul#tab-bg', top.document); //find the top tab panel
			var y = x.children('li')[this.tabNo];
			this.tabTitle = $(y).children().find('span').text().trim();
			console.warn('[FR]===>tabID, tabNo, tabTitle', this.tabID, this.tabNo, this.tabTitle);
			console.warn('[FR]===>window.frameElement.id', this.tabID);
			chrome.storage.sync.set({ curTabID: this.tabID });
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

		lockVisibility: function lockVisibility() {
			var divTab = $('div' + this.tabID, top.document);
			var divTaxSearch = $('div#tab1', top.document);
			this.tabContentContainer = divTab;
			//console.log(divTab);
			divTab.attr("style", "display: block!important");
			divTaxSearch.attr("style", "display: none!important");
			chrome.storage.sync.set({ curTabID: this.tabID });
		},

		addLock: function addLock(tabID) {

			chrome.runtime.sendMessage(_defineProperty({ from: 'FullRealtorReport', todo: 'addLock', tabID: tabID }, 'tabID', tabID), function (response) {
				console.log('FullRealtorReport got tax response:', response);
			});
		},

		getMorePropertyInfo: function getMorePropertyInfo() {
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
					if (self.lotArea.text() == '0.00') {
						var x = $lotAreaAcres.text();
						var lotAreaAcres = $fx.convertStringToDecimal(x, true);
						var lotAreaInSquareFeet = lotAreaAcres * 43560;
						var lotAreaInSquareMeters = lotAreaInSquareFeet / 10.76;

						self.lotArea.text($fx.numberWithCommas(lotAreaInSquareFeet.toFixed(0)));
						$lotAreaSqM.text($fx.numberWithCommas(lotAreaInSquareMeters.toFixed(0)));
					}

					self.devUnits = $('<div>1</div>'); // N/A for Land Only
					self.totalUnits = $('<div>1</div>'); // N/A for Land Only
					self.finishedFloorArea = $('<div>1</div>'); // N/A for Land Only
					break;
			}
		},

		calculateSFPrice: function calculateSFPrice() {
			//console.log(this.lp.text(), this.sp.text(), this.finishedFloorArea.text());
			var listPrice = $fx.convertStringToDecimal(this.lp.text());
			var soldPrice = $fx.convertStringToDecimal(this.sp.text());
			var baseArea;
			if (this.houseListingType != 'Land Only') {
				baseArea = $fx.convertStringToDecimal(this.finishedFloorArea.text());
			} else {
				baseArea = $fx.convertStringToDecimal(this.lotArea.text());
			}
			var sfPriceList = listPrice / baseArea;
			var sfPriceSold = soldPrice / baseArea;

			this.lp.text(this.lp.text() + ' [$' + sfPriceList.toFixed(0) + '/sf]');
			if (sfPriceSold > 0) {
				this.sp.text(this.sp.text() + ' [$' + sfPriceSold.toFixed(0) + '/sf]');
			}
		},

		populateUiListing: function populateUiListing() {
			this.addMLSNo();
			this.addStrataPlan(); //move this operation inside updateAssessment

			this.addBCAssessment();

			this.addRemarks();
		},

		addMLSNo: function addMLSNo() {
			var mlsNO = this.mlsNo.text();
			this.uiListingInfo.mlsNo.text(mlsNO);
		},

		addStrataPlan: function addStrataPlan(planNum) {

			var legal = "";

			if (planNum == undefined) {
				legal = this.legal.text(); //get legal description from the Report
			} else {
				legal = planNum.toString();
			}

			var legalDesc = this.legalDesc = new _LegalDescription2.default(legal);
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

			if (planNum != undefined) {
				//Start PlanNum Search:
				chrome.storage.sync.set({
					strataPlan1: legalDesc.strataPlan1,
					strataPlan2: legalDesc.strataPlan2,
					strataPlan3: legalDesc.strataPlan3,
					strataPlan4: legalDesc.strataPlan4
				});
			}
		},

		addComplexInfo: function addComplexInfo(complex) {
			var self = this;
			var subArea = self.subArea.text();
			var neighborhood = self.neighborhood.text();
			var postcode = self.postcode.text();
			var dwellingType = self.dwellingType.text();
			var complexName = complex || self.complexOrSubdivision.text().trim();
			complexName = $fx.normalizeComplexName(complexName);
			if (typeof complexName != 'string' && complexName.length <= 0) {
				console.log("ComplexName does not existed"); ////exit
				return;
			}
			var addressSelect = '';
			var isFormalAddress = true;
			if (typeof self.formalAddress.text() == "string" && self.formalAddress.text().length > 0) {
				addressSelect = self.formalAddress.text();
			} else {
				addressSelect = self.address.text();
				isFormalAddress = false;
			}
			var address = new _AddressInfo2.default(addressSelect, this.houseListingType, isFormalAddress); //todo list...
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
			chrome.runtime.sendMessage(complexInfo, function (response) {
				if (response) {
					self.complexName.text(response.name);
					self.complexOrSubdivision.text(response.name);
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

			var strataPlan = this.legalDesc.strataPlan1;
			var complexName = this.complexOrSubdivision.text();
			complexName = $fx.normalizeComplexName(complexName); ////NORMALIZE THE COMPLEX NAME FROM THE REPORT
			chrome.storage.sync.set({ 'strataPlan': strataPlan, 'complexName': complexName }, function (e) {

				chrome.runtime.sendMessage({
					from: 'ListingReport',
					todo: 'searchStrataPlanSummary',
					showResult: true,
					saveResult: true
				}, function (response) {});
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
				var strataPlan_i = "";
				var streetAddress_i = "";
				var cells_i = null;
				var complexCell_i = null;
				for (var i = 1; i < recordRows.length; i++) {
					recordRow_i = $(recordRows[i]);
					cells_i = recordRow_i.children();
					complexCell_i = cells_i[cols.complexName];
					strataPlan_i = cells_i[cols.strataPlan].textContent;
					streetAddress_i = cells_i[cols.streetAddress].textContent;
					if (strataPlan == strataPlan_i && streetAddress == streetAddress_i) {
						complexCell_i.textContent = inputName;
					}
				};
			};
		},

		addDataEvents: function addDataEvents() {

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
						if (changes.from.newValue.indexOf('complex') > -1 && changes.from.newValue.indexOf('fullRealtorReport') > -1) {
							self.updateComplexInfo();
						}
						console.log("this: ", self);
					}
				});
			})(this);
		},

		updateAssess: function updateAssess() {
			var self = this;
			var listPrice = $fx.convertStringToDecimal(self.lp.text());
			var soldPrice = $fx.convertStringToDecimal(self.sp.text());
			chrome.storage.sync.get(['totalValue', 'improvementValue', 'landValue', 'lotSize', 'address', 'bcaDataUpdateDate', 'planNum', 'dataFromDB'], function (result) {
				var totalValue = result.totalValue;
				var formalAddress = result.address.trim();
				if (totalValue == 0) {
					console.log("No BCA Assess Published Yet");
					//Update PlanNum and formal Address:
					if (result.planNum) {
						self.addStrataPlan(result.planNum);
						//self.uiListingInfo.planNo.text('Plan Num: ' + result.planNum + '*'); //Update the strataNum
					}

					self.formalAddress.text(formalAddress);
					if (formalAddress) {
						self.addComplexInfo(); //Search Complex Name
					}
					return;
				}
				var improvementValue = result.improvementValue;
				var landValue = result.landValue;
				var lotSize = result.lotSize;
				var lotArea = $fx.convertStringToDecimal(lotSize, true);
				var lotAreaInSquareFeet = lotArea < 500 ? (lotArea * 43560).toFixed(0) : $fx.numberWithCommas($fx.removeDecimalFraction(lotArea));

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
				if (result.planNum) {
					self.addStrataPlan(result.planNum);
					//self.uiListingInfo.planNo.text('Plan Num: ' + result.planNum + '*'); //Update the strataNum
				}

				self.formalAddress.text(formalAddress);
				if (formalAddress) {
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
				self.marketValuePerSF.text('Lot:$' + marketLotValuePerSF.toString() + '/SF' + ' | Impv:$' + marketHouseValuePerSF.toString() + '/SF');
				self.lotArea.text($fx.numberWithCommas($fx.convertStringToDecimal(lotAreaInSquareFeet, true)));
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
			var $inputName = $('#inputComplexName');
			var compName = "";

			chrome.storage.sync.get('complexName', function (result) {
				compName = $fx.normalizeComplexName(result.complexName);
				self.complexName.text(compName);
				self.complexOrSubdivision.text(compName);
				$inputName.val(compName);
			});
		}

		//star the app
	};$(function () {
		fullRealtor.init();
	});

/***/ }),
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */
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
	var subContentPanelClass = '.ui-tabs-panel'; //tab content panel class

	//const savedPropertySearches = 'iframe#tab2';

	// export class MainTabSwitcher {
	//     constructor(){
	//         this.$mainTabSwitcher = $(mainPanelID);
	//         this.$mainNavBar = $(mainNavBarID);

	//     }
	// }

	var MainNavBar = function () {
	    function MainNavBar() {
	        _classCallCheck(this, MainNavBar);

	        this.$mainNavBar = $(mainNavBarID);
	        this.$mainNavItems = this.$mainNavBar.children(mainNavItemClass); //set of top tap ui HTML elements
	        this.$subContentPanels = $(mainPanelID).children(subContentPanelClass);
	        this.mainNavItems = []; //set of class of mainNavItems
	        this.curNavItem = null; //current active tab(NavItem)
	        this.lockedNavItem = null; //current locked tab(NavItem)
	        this.init(); //update the NavItems

	        this.enableOnAddNewNavItem = false; //disable onAddNewTab event in the init
	        this.onAddNewNavItem();
	        //this.onRemoveNavItem();
	        //this.onAddNewSubContentPanel();
	        // this.update();
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

	                    var newNavItemID = $navItem.children('a').attr('href'); //get tabID
	                    var newNavItem = new mainNavItem($navItem);
	                    newNavItem.parent = self;
	                    console.warn('[Class.TopTabs]onAddNewTab===>New Tab added, newTabID:', newNavItemID, $navItem, $navItem.parent().attr('id'));
	                    //self.updateTopTabInfos(newTabID);
	                    //self.setCurMainNavItem(newNavItemID); //updateTopTabInfos, and set Current tab
	                    self.$mainNavItems.push($navItem);
	                    self.mainNavItems.push(newNavItem);
	                    self.update();
	                }
	            });
	        }
	    }, {
	        key: 'onAddNewSubContentPanel',
	        value: function onAddNewSubContentPanel() {
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
	                if (self.enableOnAddNewNavItem && $tabContent.parent().attr('id') == 'app_tab_switcher') {
	                    self.$subContentPanels.push(this);
	                }
	                // chrome.storage.sync.get('showTabQuickSearch',function(result){
	                //     //console.log('Class.TopTabs.onAddNewTabContent::get showTabQuickSearch:', result.showTabQuickSearch);
	                //     self.mainNavItems.forEach(function(mainNavItem){
	                //         //console.log('tabInfo.tabTitle:', tabInfo.tabTitle)
	                //         if(mainNavItem.tabTitle == 'Quick Search'){
	                //             mainNavItem.deactivate();
	                //         }
	                //     })
	                // })
	            });
	        }
	    }, {
	        key: 'onClick',
	        value: function onClick() {
	            //mainNavBar Click event
	            var self = this;
	            this.$mainNavBar.click(function () {
	                self.update();
	            });
	        }

	        //methods:

	    }, {
	        key: 'init',
	        value: function init() {
	            var self = this;
	            this.mainNavItems.length = 0; //clean up the array of mainNavItem object
	            this.curNavItem = null;
	            this.lockedNavItem = $(null);
	            this.$mainNavItems = null; //clean up the $topTabs HTML collection
	            this.$mainNavItems = this.$mainNavBar.children(mainNavItemClass); //set of top tab items for navigation
	            //populate the mainNavItems
	            this.$mainNavItems.each(function (index) {
	                var navItem = new mainNavItem($(this)); //convert each top tab element to mainNavItem Class
	                navItem.parent = self;
	                self.mainNavItems.push(navItem); //
	                if (navItem.active) {
	                    self.curNavItem = navItem;
	                }
	                if (navItem.locked) {
	                    self.lockedNavItem = navItem;
	                }
	            });
	        }
	    }, {
	        key: 'update',
	        value: function update(removeSubPanelStyle) {
	            var self = this;

	            this.curNavItem = null;
	            this.lockedNavItem = $(null);

	            if (removeSubPanelStyle) {
	                // self.$subContentPanels.each(function(){
	                //     if (this.id !='HomeTab'){  //do not change Home Tab
	                //         this.removeAttribute('style');
	                //     }
	                // });
	                self.mainNavItems.forEach(function (item, index) {
	                    if (item.tabID != '#HomeTab') {
	                        item.$tabContent.removeAttr('style');
	                    }
	                });
	            }

	            this.mainNavItems.forEach(function (item) {
	                if (item.$me.hasClass('ui-tabs-selected') && item.$me.hasClass('ui-state-active')) {
	                    item.active = true;
	                } else {
	                    item.active = false;
	                }

	                if (item.active) {
	                    self.curNavItem = item;
	                }
	                if (item.locked) {
	                    self.lockedNavItem = item;
	                }
	            });

	            console.log("main Nav Bar updated!");
	            console.log("active nav item is: ", self.curNavItem.Title);
	            console.log("locked Nav Item is: ", self.lockedNavItem.Title);
	        }
	    }, {
	        key: 'removeNavItem',
	        value: function removeNavItem(tabID) {

	            var self = this;
	            var $removeItem = null;
	            var $removeContent = null;
	            var removeItemPosition = 0;

	            this.mainNavItems.forEach(function (item, index) {
	                if (item.tabID == tabID) {
	                    $removeItem = item.$me;
	                    $removeContent = item.$tabContent;
	                    removeItemPosition = index;
	                    self.mainNavItems.splice(index, 1);
	                }
	                if (item.tabID != '#HomeTab') {
	                    item.$tabContent.removeAttr('style');
	                }
	            });
	            this.$mainNavItems.splice(removeItemPosition, 1);
	            // this.$subContentPanels.splice(removeItemPosition,1);
	        }
	    }, {
	        key: 'addLock',
	        value: function addLock(tabID) {

	            var self = this;
	            this.removeLock();

	            this.mainNavItems.forEach(function (item) {
	                if (item.tabID == tabID) {
	                    item.$tabContent.attr("style", "display: block!important");
	                    self.lockedNavItem = item;
	                } else {
	                    if (item.tabID != '#HomeTab') {
	                        item.$tabContent.attr("style", "display: none!important");
	                    }
	                }
	            });
	        }
	    }, {
	        key: 'removeLock',
	        value: function removeLock() {
	            //remove lock to the tab's content panel
	            //var $navBar = $(mainPanelID).children('mainNavBarID');
	            var $contents = $(mainPanelID).children('subContentPanelClass');
	            $contents.each(function () {
	                if ($contents.id != 'HomeTab') {
	                    this.removeAttribute('style');
	                }
	            });
	            // $contents.removeAttr("style","display: block!important"); //unlock all tab contents
	            // $contents.removeAttr("style","display: none!important"); //remove added attrs
	            this.lockedNavItem = $(null);
	        }
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
	        this.parent = null; //parent class
	        this.$me = $navItem; //keep the tab li element <li>
	        this.$contentLink = this.$me.children('a'); //keep the tab link <a>
	        this.tabID = this.$contentLink.attr('href'); //keep the tabID, '#tab3', '#' is reserved
	        this.contentURL = this.$contentLink.attr('url'); //keep the tab url
	        this.$closeLink = this.$me.children('em'); //close the tab
	        this.$Title = this.$contentLink.children('span'); //keep the tab title <span>
	        this.Title = this.$Title.text().trim(); //keep the tab title text string
	        //navItem Content Element: e.g. div#tab2 or iframe#tab2
	        this.$tabContent = $(mainPanelID).children(this.tabID); //keep the tab's content <element>

	        //navItem Status: active or inactive?
	        this.active = false;
	        this.locked = false;
	        if (this.$me.hasClass('ui-tabs-selected') && this.$me.hasClass('ui-state-active')) {
	            this.active = true;
	        }
	        //events Click:
	        this.clicked = false; //
	        this.onClick();
	        this.onClose();
	    }

	    //events:


	    _createClass(mainNavItem, [{
	        key: 'onClick',
	        value: function onClick() {
	            var self = this;
	            //jquery add click event to anchor element a
	            this.$contentLink.on('click', function () {
	                console.log('click top tab Link: ', self.Title, ' ', self.tabID);
	                self.clicked = true;

	                if (self.tabID != '#HomeTab') {
	                    self.$tabContent.removeAttr('style');
	                }

	                if (self.$me.hasClass('ui-tabs-selected') && self.$me.hasClass('ui-state-active')) {
	                    self.active = true;
	                    console.log(self.Title, self.tabID, " is active and selected");
	                }
	                var removeSubPanelStyle = true;
	                self.parent.update(removeSubPanelStyle);
	            });
	        }
	    }, {
	        key: 'onClose',
	        value: function onClose() {
	            var self = this;

	            this.$closeLink.on('click', function () {
	                console.log("close a tab", self.tabID);
	                self.parent.removeNavItem(self.tabID);
	                self.parent.update();
	            });
	        }

	        //methods:

	    }, {
	        key: 'addLock',
	        value: function addLock() {
	            //add lock to the tab's content panel
	            var $navBar = $(mainPanelID).children('mainNavBarID');
	            var $contents = $(mainPanelID).children('subContentPanelClass');
	            $contents.removeAttr("style", "display: block!important"); //unlock all tab contents
	            $contents.attr("style", "display: none!important"); //hide all sub panles
	            self.$tabContent.removeAttr("style", "display: none!important"); //show this tab content
	            self.$tabContent.attr("style", "display: block!important"); //lock this tab content
	            chrome.storage.sync.set({ curTabID: this.tabID });
	            self.locked = true;
	        }
	    }, {
	        key: 'removeLock',
	        value: function removeLock() {
	            //remove lock to the tab's content panel
	            var $navBar = $(mainPanelID).children('mainNavBarID');
	            var $contents = $(mainPanelID).children('subContentPanelClass');
	            $contents.removeAttr("style", "display: block!important"); //unlock all tab contents
	            $contents.removeAttr("style", "display: none!important"); //remove added attrs
	            self.locked = false;
	        }
	    }, {
	        key: 'activate',
	        value: function activate() {
	            //activate this nav item, show the nav item content
	            this.$me.addClass(activeNavItemClass);
	            console.log('ActivateThisTab, title, id:', this.Title, this.tabID);
	            this.$tabContent.removeClass('ui-tabs-hide');
	        }
	    }, {
	        key: 'deactivate',
	        value: function deactivate() {
	            //deactivate this nav item, hide the nav item content
	            this.$me.removeClass(activeNavItemClass);
	            console.log('DeactivateThisTab, title, id:', this.Title, this.tabID);
	            if (this.Title != 'Home') {
	                this.$tabContent.removeAttr('style');
	            }
	            this.$tabContent.addClass('ui-tabs-hide');
	        }
	    }]);

	    return mainNavItem;
	}();

/***/ }),
/* 7 */,
/* 8 */,
/* 9 */
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
/* 10 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// Analyse the address information

	var AddressInfo = function AddressInfo(address, houseType, formal) {
	    _classCallCheck(this, AddressInfo);

	    address = address.replace('.', '');
	    this.isFormalAddress = formal == undefined ? false : formal;
	    this.houseType = houseType;
	    this.addressParts = address.split(' '); //split the address to parts array
	    //fetch unit no, then remove unit no from the addressParts Array
	    this.UnitNo = '';

	    switch (houseType.toUpperCase()) {
	        case 'TOWNHOUSE':
	        case 'APARTMENT':
	        case 'APARTMENT/CONDO':
	        case 'CONDO':
	        case 'ATTACHED':
	            houseType = 'Attached';
	            break;
	        default:
	            houseType = 'Detached';
	            break;
	    }

	    if (this.isFormalAddress) {
	        if (houseType == 'Attached') {
	            if (this.addressParts.length > 3) {
	                this.UnitNo = this.addressParts.pop();
	                this.addressParts.pop();
	            } else {
	                this.UnitNo = "TBA";
	            }
	        }
	    } else {
	        if (houseType == 'Attached') {
	            this.UnitNo = this.addressParts.shift();
	        }
	    }

	    this.streetNumber = this.addressParts.shift();
	    this.streetType = this.addressParts.pop();
	    this.streetName = this.addressParts.toString().replace(',', '-');
	    var streetType = this.streetType.trim().toString().toUpperCase();
	    //Standard street type:
	    switch (streetType) {
	        case 'AVENUE':
	            streetType = 'AV';
	            break;
	        case 'STREET':
	            streetType = 'ST';
	            break;
	        case 'DRIVE':
	            streetType = 'DR';
	            break;
	        case 'BOULEVARD':
	            streetType = 'BV';
	            break;
	        case 'BYPASS':
	            streetType = 'BP';
	            break;
	        case 'CRESCENT':
	            streetType = "CR";
	            break;
	        default:
	            streetType = streetType;
	            break;
	    }
	    this.streetType = streetType;
	    this.formalAddress = this.streetNumber + " " + this.streetName.replace('-', ' ') + " " + this.streetType;
	    if (this.UnitNo) {
	        this.formalAddress = this.formalAddress + " UNIT# " + this.UnitNo;
	    }
	    this.addressID = '-' + this.streetNumber + '-' + this.streetName + '-' + this.streetType;
	    this.streetAddress = this.streetNumber + ' ' + this.streetName + ' ' + this.streetType;
	};

	;

	exports.default = AddressInfo;

/***/ }),
/* 11 */
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
	        this.inputComplexName = $('<input name="inputComplexName" id="inputComplexName"/>');
	        this.btnSaveComplexName = $('<button name="saveComplexName" id="saveComplexName" class="btn btn-primary">Save</button>');
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