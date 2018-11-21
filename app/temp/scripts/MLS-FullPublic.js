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
/******/ ({

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _fullpublic;

	var _LegalDescription = __webpack_require__(10);

	var _LegalDescription2 = _interopRequireDefault(_LegalDescription);

	var _AddressInfo = __webpack_require__(9);

	var _AddressInfo2 = _interopRequireDefault(_AddressInfo);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } //custom full public report

	//console.log("full public script activated now: ");
	var $fx = L$();

	var fullpublic = (_fullpublic = {

		init: function init() {
			console.log("full public script loaded!");
			console.log(this.lp, this.sp);
			this.events();
			this.getMorePropertyInfo();
			this.bcAssess.addClass(this.lp.attr('class'));
			var divBC = $('<div style="top:111px;left:703px;width:53px;height:14px;text-align: left;">(BCA\'16)</div>');
			var banner = $('<div id="peterqu" style="z-index: 999; height:88px; position:absolute; top: 2px; padding-right:0px; padding-left:0px; padding-top:0px; padding-bottom:0px; left:0px; width: 766px"></div>');
			divBC.addClass(this.lpSuffix.attr('class'));
			divBC.insertAfter(this.bcAssess);
			this.bcAssess.animate({ left: '575px', width: '127px' }).css("text-align", "left");
			this.addBanner(banner);
			if (this.language.is(':checked')) {
				this.translate();
			};
			this.calculateSFPrice();
			this.addComplexInfo();
			this.searchTax();
		},

		calculateSFPrice: function calculateSFPrice() {

			console.log(this.lp.text(), this.sp.text(), this.finishedFloorArea.text());
			var listPrice = $fx.convertStringToDecimal(this.lp.text());
			var soldPrice = $fx.convertStringToDecimal(this.sp.text());
			var FinishedFloorArea = $fx.convertStringToDecimal(this.finishedFloorArea.text());
			var sfPriceList = listPrice / FinishedFloorArea;
			var sfPriceSold = soldPrice / FinishedFloorArea;

			this.lp.animate({ left: '575px', width: '127px' }).css("text-align", "left");;
			this.lp.text(this.lp.text() + ' [$' + sfPriceList.toFixed(0) + '/sf]');
			if (sfPriceSold > 0) {
				this.sp.animate({ left: '575px', width: '127px' }).css("text-align", "left");;
				this.sp.text(this.sp.text() + ' [$' + sfPriceSold.toFixed(0) + '/sf]');
			}
		},

		getMorePropertyInfo: function getMorePropertyInfo() {
			var self = this;
			var listingHouseType = self.listingHouseType = self.houseType.text().replace(' ', '');
			switch (listingHouseType) {
				case 'ResidentialAttached':
					self.pid = $('div[style="top:283px;left:637px;width:82px;height:15px;"]');
					self.lotArea = $('div[style="top:214px;left:376px;width:67px;height:13px;"]');
					self.complex = $('div[style="top:341px;left:393px;width:369px;height:13px;"]');
					self.devUnits = $('div[style="top:432px;left:470px;width:76px;height:14px;"]');
					self.totalUnits = $('div[style="top:432px;left:658px;width:103px;height:15px;"]');
					break;
				case 'ResidentialDetached':
					self.pid = $('div[style="top:283px;left:636px;width:82px;height:15px;"]');
					self.lotArea = $('div[style="top:219px;left:376px;width:79px;height:14px;"]');
					self.complex = $('div[style="top:335px;left:393px;width:369px;height:13px;"]');
					self.devUnits = $('<div>1</div>');
					self.totalUnits = $('<div>1</div>');
					self.cnSoldDate = $('div[style="top:171px;left:290px;width:57px;height:15px;"]');
					self.cnMeasType = $('div[style="top:187px;left:290px;width:73px;height:15px;"]');
					self.cnLotArea = $('div[style="top:219px;left:290px;width:88px;height:17px;"]');
					self.cnDepth = $('div[style="top:203px;left:290px;width:89px;height:13px;"]');
					self.cnFloodPlain = $('div[style="top:235px;left:290px;width:79px;height:13px;"]');
					self.cnExposure = $('div[style="top:251px;left:290px;width:79px;height:15px;"]');
					self.cnApprovalReq = $('div[style="top:267px;left:290px;width:80px;height:16px;"]');
					self.cnNewGST = $('div[style="top:283px;left:290px;width:110px;height:17px;"]');
					self.cnView = $('div[style="top:319px;left:290px;width:77px;height:13px;"]');
					self.cnComplex = $('div[style="top:335px;left:289px;width:93px;height:14px;"]');
					self.cnServiceConnected = $('div[style="top:352px;left:289px;width:100px;height:15px;"]');
					self.cnFrontageFeet = $('div[style="top:171px;left:459px;width:87px;height:13px;"]');
					self.cnBedrooms = $('div[style="top:187px;left:459px;width:91px;height:15px;"]');
					self.cnBathrooms = $('div[style="top:203px;left:459px;width:87px;height:15px;"]');
					self.cnFullBaths = $('div[style="top:219px;left:459px;width:55px;height:15px;"]');
					self.cnHalfBaths = $('div[style="top:235px;left:459px;width:55px;height:13px;"]');
					self.cnOriginalPrice = $('div[style="top:171px;left:603px;width:75px;height:14px;"]');
					self.cnYearBuilt = $('div[style="top:187px;left:603px;width:101px;height:14px;"]');
					self.cnGrossTaxes = $('div[style="top:235px;left:603px;width:68px;height:13px;"]');
					self.cnRenoYear = $('div[style="top:432px;left:220px;width:60px;height:12px;"]');
					self.cnRIPlumbing = $('div[style="top:444px;left:220px;width:65px;height:12px;"]');
					self.cnRIFireplaces = $('div[style="top:456px;left:220px;width:71px;height:13px;"]');
					self.cnWaterSupply = $('div[style="top:480px;left:3px;width:72px;height:14px;"]');
					self.cnNumOfFirePlaces = $('div[style="top:456px;left:3px;width:73px;height:13px;"]');
					self.cnFuelHeating = $('div[style="top:492px;left:3px;width:61px;height:12px;"]');
					self.cnOutdoorArea = $('div[style="top:504px;left:3px;width:70px;height:13px;"]');
					self.cnTypeOfRoof = $('div[style="top:516px;left:3px;width:64px;height:12px;"]');
					self.cnTitleToLand = $('div[style="top:432px;left:367px;width:63px;height:12px;"]');
					self.cnPropertyDisc = $('div[style="top:456px;left:367px;width:70px;height:15px;"]');
					self.cnFixturesRmvd = $('div[style="top:492px;left:367px;width:70px;height:15px;"]');
					self.cnPADRental = $('div[style="top:468px;left:367px;width:62px;height:16px;"]');
					self.cnFeatures = $('div[style="top:592px;left:3px;width:46px;height:12px;"]');
					self.cnKitchens = $('div[style="top:768px;left:210px;width:66px;height:16px;"]');
					self.cnLevels = $('div[style="top:780px;left:210px;width:56px;height:12px;"]');
					self.cnCrawlHeight = $('div[style="top:804px;left:210px;width:92px;height:15px;"]');
					self.cnSuite = $('div[style="top:792px;left:210px;width:60px;height:14px;"]');
					self.cnBasement = $('div[style="top:828px;left:210px;width:52px;height:13px;"]');
					self.cnBedsInBasement = $('div[style="top:816px;left:210px;width:87px;height:14px;"]');
					self.cnBedNotInBasement = $('div[style="top:816px;left:330px;width:102px;height:13px;"]');
					self.cnDimensions = $('div[style="top:616px;left:182px;width:60px;height:15px;"]');
					self.cnDimensions3 = $('div[style="top:616px;left:695px;width:59px;height:14px;"]');
					break;
			}
		},

		searchTax: function searchTax() {

			var PID = this.pid.text();
			if (!PID) {
				return;
			};
			chrome.storage.sync.set({ 'PID': PID });
			chrome.storage.sync.get('PID', function (result) {
				console.log(result.PID);
				chrome.runtime.sendMessage({ from: 'ListingReport', todo: 'taxSearch' }, function (response) {
					console.log('mls-fullpublic got response:', response);
				});
			});
		},

		addComplexInfo: function addComplexInfo() {
			var self = this;
			var legal = self.legal.text(); //get legal description from the Report
			var legalDesc = self.legalDesc = new _LegalDescription2.default(legal);
			var complexName = self.complex.text().trim();

			var subArea = self.subArea.text();
			var neighborhood = self.neighborhood.text();
			var postcode = self.postcode.text();
			var dwellingType = self.dwellingType.text();
			var address = new _AddressInfo2.default(self.address.text()); //todo list...
			var strataPlan = legalDesc.strataPlan1;
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
				todo: 'searchComplex'

			};
			if (complexName.length > 0) {
				complexInfo.todo = 'saveComplex';
				chrome.runtime.send;
			};
			chrome.runtime.sendMessage(complexInfo, function (response) {
				if (response) {
					self.complex.text(response);
					self.complexSummary.text(response);
				}
			});
		},

		addBanner: function addBanner(banner) {

			var img = $('<img src="http://localhost/chromex/mlshelper/app/assets/images/banner4.jpg">');
			img.appendTo(banner);
			banner.appendTo($('div#divHtmlReport'));
		},

		events: function events() {

			(function onEvents(self) {

				chrome.storage.onChanged.addListener(function (changes, area) {

					if (area == "sync" && "from" in changes) {

						if (changes.from.newValue.indexOf('assess') > -1) {
							self.updateAssess();
						};

						if (changes.from.newValue.indexOf('complex') > -1) {
							self.updateComplexInfo();
						}
						console.log("this: ", self);
					};

					if (area == "sync" && "curTabID" in changes) {

						if (changes.curTabID.newValue) {

							if (changes.curTabID.oldValue) {
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

							divTab.attr("style", "display: block!important");
							divTab1.attr("style", "display: none!important");
						}
					}
				});
			})(this);
		},

		updateAssess: function updateAssess() {

			var self = this;
			var listPrice = $fx.convertStringToDecimal(self.lp.text());
			var soldPrice = $fx.convertStringToDecimal(self.sp.text());

			chrome.storage.sync.get(['totalValue', 'improvementValue', 'landValue', 'lotSize'], function (result) {
				var totalValue = result.totalValue;
				var improvementValue = result.improvementValue;
				var landValue = result.landValue;
				var lotArea = result.lotSize;
				console.log("mls-fullpublic got total bc assessment: ", landValue, improvementValue, totalValue);
				self.bcAssess.text(totalValue);
				if (totalValue != 0) {

					if (soldPrice > 0) {

						var intTotalValue = $fx.convertStringToDecimal(totalValue);
						var changeValue = soldPrice - intTotalValue;
						var changeValuePercent = changeValue / intTotalValue * 100;
					} else {
						var intTotalValue = $fx.convertStringToDecimal(totalValue);
						var changeValue = listPrice - intTotalValue;
						var changeValuePercent = changeValue / intTotalValue * 100;
					}
				}
				self.bcAssess.text($fx.removeDecimalFraction(self.bcAssess.text()) + " [ " + changeValuePercent.toFixed(0).toString() + '% ]   ');
				self.lotArea.text($fx.numberWithCommas($fx.convertStringToDecimal(lotArea)));
			});
		},

		updateComplexInfo: function updateComplexInfo() {
			var self = this;
			console.log('update Complex info:');
			chrome.storage.sync.get(['complexName', 'count'], function (result) {
				self.complex.text(result.complexName + '[ ' + result.count.toString() + ' ]');
			});
		},

		houseType: $('div[style="top:111px;left:578px;width:147px;height:16px;"]'),
		listingHouseType: null,
		lp: $('div[style="top:129px;left:555px;width:147px;height:13px;"]'),
		sp: $('div[style="top:147px;left:555px;width:147px;height:15px;"]'),
		lpSuffix: $('div[style="top:129px;left:703px;width:23px;height:14px;"]'),
		bcAssess: $('div[style="top:111px;left:578px;width:147px;height:16px;"]'),
		finishedFloorArea: $('div[style="top:804px;left:120px;width:50px;height:16px;"]'),
		totalFinishedFloorArea: $('div[style="top:840px;left:120px;width:50px;height:12px;"]'),
		pid: null,
		complex: null,
		lotArea: null,
		devUnits: null,
		totalUnits: null,
		strataFee: $('div[style="top:267px;left:530px;width:67px;height:13px;"]'),
		exposure: $('div[style="top:261px;left:376px;width:68px;height:13px;"]'),
		age: $('div[style="top:203px;left:698px;width:65px;height:13px;"]'),
		year: $('div[style="top:187px;left:698px;width:39px;height:13px;"]'),
		tax: $('div[style="top:235px;left:698px;width:65px;height:13px;"]'),
		title: $('div[style="top:444px;left:440px;width:321px;height:13px;"]'),
		keyword: $('div#app_banner_links_left input.select2-search__field', top.document),
		language: $('div#reportlanguage input', top.document),

		//complex info:
		legal: $('div[style="top:532px;left:75px;width:688px;height:24px;"'),
		address: $('div[style="top:110px;left:134px;width:481px;height:17px;"]'),
		subArea: $('div[style="top:126px;left:134px;width:480px;height:13px;"]'),
		neighborhood: $('div[style="top:139px;left:134px;width:479px;height:13px;"]'),
		postcode: $('div[style="top:152px;left:132px;width:484px;height:13px;"]'),
		dwellingType: $('div[style="top:151px;left:4px;width:137px;height:15px;"]')
	}, _defineProperty(_fullpublic, 'totalUnits', $('div[style="top:432px;left:658px;width:103px;height:15px;"')), _defineProperty(_fullpublic, 'devUnits', $('div[style="top:432px;left:470px;width:76px;height:14px;"')), _defineProperty(_fullpublic, 'cnSoldDate', $('div[style="top:170px;left:289px;width:59px;height:16px;"]')), _defineProperty(_fullpublic, 'cnFrontageFeet', $('div[style="top:171px;left:451px;width:87px;height:13px;"]')), _defineProperty(_fullpublic, 'cnFrontageMeters', $('div[style="top:187px;left:451px;width:98px;height:16px;"]')), _defineProperty(_fullpublic, 'cnDepth', $('div[style="top:199px;left:289px;width:89px;height:13px;"]')), _defineProperty(_fullpublic, 'cnLotArea', $('div[style="top:214px;left:289px;width:88px;height:17px;"]')), _defineProperty(_fullpublic, 'cnFloodPlain', $('div[style="top:230px;left:289px;width:79px;height:13px;"]')), _defineProperty(_fullpublic, 'cnApprovalReq', $('div[style="top:246px;left:289px;width:77px;height:16px;"]')), _defineProperty(_fullpublic, 'cnNewGST', $('div[style="top:277px;left:289px;width:110px;height:14px;"]')), _defineProperty(_fullpublic, 'cnTaxIncUtilities', $('div[style="top:267px;left:603px;width:90px;height:14px;"]')), _defineProperty(_fullpublic, 'cnZoning', $('div[style="top:219px;left:603px;width:43px;height:15px;"]')), _defineProperty(_fullpublic, 'cnServiceConnected', $('div[style="top:357px;left:289px;width:105px;height:15px;"]')), _defineProperty(_fullpublic, 'cnMeasType', $('div[style="top:184px;left:289px;width:76px;height:15px;"]')), _defineProperty(_fullpublic, 'cnStrataFee', $('div[style="top:267px;left:451px;width:61px;height:14px;"]')), _defineProperty(_fullpublic, 'cnGrossTaxes', $('div[style="top:235px;left:603px;width:71px;height:13px;"]')), _defineProperty(_fullpublic, 'cnFinishedFloor', $('div[style="top:804px;left:3px;width:111px;height:16px;"]')), _defineProperty(_fullpublic, 'cnTotalFinishedFloor', $('div[style="top:840px;left:3px;width:112px;height:12px;"]')), _defineProperty(_fullpublic, 'cnRestrictedAge', $('div[style="top:780px;left:210px;width:74px;height:12px;"]')), _defineProperty(_fullpublic, 'cnForTaxYear', $('div[style="top:251px;left:603px;width:81px;height:15px;"]')), _defineProperty(_fullpublic, 'cnAge', $('div[style="top:203px;left:603px;width:27px;height:14px;"]')), _defineProperty(_fullpublic, 'cnYearBuilt', $('div[style="top:187px;left:603px;width:97px;height:15px;"]')), _defineProperty(_fullpublic, 'cnOriginalPrice', $('div[style="top:171px;left:603px;width:76px;height:15px;"]')), _defineProperty(_fullpublic, 'cnBedrooms', $('div[style="top:203px;left:451px;width:75px;height:16px;"]')), _defineProperty(_fullpublic, 'cnBathrooms', $('div[style="top:219px;left:451px;width:77px;height:15px;"]')), _defineProperty(_fullpublic, 'cnFullBaths', $('div[style="top:235px;left:451px;width:55px;height:15px;"]')), _defineProperty(_fullpublic, 'cnHalfBaths', $('div[style="top:251px;left:451px;width:55px;height:13px;"]')), _defineProperty(_fullpublic, 'cnExposure', $('div[style="top:261px;left:289px;width:79px;height:15px;"]')), _defineProperty(_fullpublic, 'cnComplex', $('div[style="top:341px;left:289px;width:93px;height:14px;"]')), _defineProperty(_fullpublic, 'cnMgmtName', $('div[style="top:293px;left:289px;width:96px;height:17px;"]')), _defineProperty(_fullpublic, 'cnMgmtPhone', $('div[style="top:309px;left:289px;width:95px;height:17px;"]')), _defineProperty(_fullpublic, 'cnView', $('div[style="top:325px;left:289px;width:77px;height:13px;"]')), _defineProperty(_fullpublic, 'cnTotalParking', $('div[style="top:384px;left:367px;width:73px;height:12px;"]')), _defineProperty(_fullpublic, 'cnParking', $('div[style="top:396px;left:367px;width:43px;height:12px;"]')), _defineProperty(_fullpublic, 'cnCoveredParking', $('div[style="top:384px;left:458px;width:82px;height:16px;"]')), _defineProperty(_fullpublic, 'cnParkingAccess', $('div[style="top:384px;left:565px;width:76px;height:15px;"]')), _defineProperty(_fullpublic, 'cnDistToPublicTransit', $('div[style="top:420px;left:367px;width:99px;height:12px;"]')), _defineProperty(_fullpublic, 'cnDistToSchoolBus', $('div[style="top:420px;left:565px;width:89px;height:14px;"]')), _defineProperty(_fullpublic, 'cnUnitInDevelopment', $('div[style="top:432px;left:367px;width:101px;height:15px;"]')), _defineProperty(_fullpublic, 'cnTotalUnitsInStrata', $('div[style="top:432px;left:565px;width:96px;height:15px;"]')), _defineProperty(_fullpublic, 'cnLocker', $('div[style="top:408px;left:565px;width:40px;height:12px;"]')), _defineProperty(_fullpublic, 'cnTitleToLand', $('div[style="top:444px;left:367px;width:63px;height:12px;"]')), _defineProperty(_fullpublic, 'cnPropertyDisc', $('div[style="top:468px;left:367px;width:72px;height:14px;"]')), _defineProperty(_fullpublic, 'cnFixturesLeased', $('div[style="top:480px;left:367px;width:74px;height:15px;"]')), _defineProperty(_fullpublic, 'cnFixturesRmvd', $('div[style="top:492px;left:367px;width:72px;height:13px;"]')), _defineProperty(_fullpublic, 'cnFloorFinish', $('div[style="top:504px;left:367px;width:61px;height:14px;"]')), _defineProperty(_fullpublic, 'cnRooms', $('div[style="top:756px;left:210px;width:60px;height:12px;"]')), _defineProperty(_fullpublic, 'cnKitchens', $('div[style="top:756px;left:293px;width:66px;height:16px;"]')), _defineProperty(_fullpublic, 'cnLevels', $('div[style="top:756px;left:386px;width:56px;height:12px;"]')), _defineProperty(_fullpublic, 'cnPets', $('div[style="top:792px;left:210px;width:51px;height:14px;"]')), _defineProperty(_fullpublic, 'cnCats', $('div[style="top:792px;left:299px;width:30px;height:13px;"]')), _defineProperty(_fullpublic, 'cnDogs', $('div[style="top:792px;left:366px;width:42px;height:13px;"]')), _defineProperty(_fullpublic, 'cnBylawRestric', $('div[style="top:816px;left:210px;width:65px;height:13px;"]')), _defineProperty(_fullpublic, 'cnRentalsAllowed', $('div[style="top:804px;left:210px;width:125px;height:14px;"]')), _defineProperty(_fullpublic, 'cnCrawlHeight', $('div[style="top:768px;left:210px;width:92px;height:15px;"]')), _defineProperty(_fullpublic, 'cnBasement', $('div[style="top:840px;left:210px;width:57px;height:14px;"]')), _defineProperty(_fullpublic, 'cnMaintFeeInc', $('div[style="top:520px;left:3px;width:74px;height:14px;"]')), _defineProperty(_fullpublic, 'cnLegal', $('div[style="top:532px;left:3px;width:33px;height:16px;"]')), _defineProperty(_fullpublic, 'cnAmenities', $('div[style="top:556px;left:3px;width:53px;height:15px;"]')), _defineProperty(_fullpublic, 'cnSiteInfluences', $('div[style="top:580px;left:3px;width:71px;height:14px;"]')), _defineProperty(_fullpublic, 'cnFeatures', $('div[style="top:591px;left:3px;width:46px;height:12px;"]')), _defineProperty(_fullpublic, 'cnStyleOfHome', $('div[style="top:384px;left:3px;width:69px;height:13px;"]')), _defineProperty(_fullpublic, 'cnConstruction', $('div[style="top:396px;left:3px;width:62px;height:12px;"]')), _defineProperty(_fullpublic, 'cnExterior', $('div[style="top:408px;left:3px;width:43px;height:12px;"]')), _defineProperty(_fullpublic, 'cnFoundation', $('div[style="top:420px;left:3px;width:64px;height:14px;"]')), _defineProperty(_fullpublic, 'cnRainScreen', $('div[style="top:432px;left:3px;width:59px;height:12px;"]')), _defineProperty(_fullpublic, 'cnRenovation', $('div[style="top:444px;left:3px;width:60px;height:12px;"]')), _defineProperty(_fullpublic, 'cnWaterSupply', $('div[style="top:456px;left:3px;width:72px;height:14px;"]')), _defineProperty(_fullpublic, 'cnFirePlaceFuel', $('div[style="top:468px;left:3px;width:69px;height:13px;"]')), _defineProperty(_fullpublic, 'cnFuelHeating', $('div[style="top:480px;left:3px;width:61px;height:12px;"]')), _defineProperty(_fullpublic, 'cnOutdoorArea', $('div[style="top:492px;left:3px;width:70px;height:13px;"]')), _defineProperty(_fullpublic, 'cnTypeOfRoof', $('div[style="top:504px;left:3px;width:64px;height:12px;"]')), _defineProperty(_fullpublic, 'cnRenoYear', $('div[style="top:420px;left:259px;width:60px;height:12px;"]')), _defineProperty(_fullpublic, 'cnRIPlumbing', $('div[style="top:432px;left:259px;width:65px;height:12px;"]')), _defineProperty(_fullpublic, 'cnRIFireplaces', $('div[style="top:444px;left:259px;width:71px;height:12px;"]')), _defineProperty(_fullpublic, 'cnNumOfFirePlaces', $('div[style="top:456px;left:259px;width:70px;height:13px;"]')), _defineProperty(_fullpublic, 'cnFloor', $('div[style="top:616px;left:3px;width:28px;height:15px;"]')), _defineProperty(_fullpublic, 'cnType', $('div[style="top:616px;left:65px;width:32px;height:15px;"]')), _defineProperty(_fullpublic, 'cnDimensions', $('div[style="top:616px;left:182px;width:58px;height:16px;"]')), _defineProperty(_fullpublic, 'cnFloor2', $('div[style="top:616px;left:250px;width:39px;height:15px;"]')), _defineProperty(_fullpublic, 'cnType2', $('div[style="top:616px;left:328px;width:28px;height:15px;"]')), _defineProperty(_fullpublic, 'cnDimensions2', $('div[style="top:616px;left:435px;width:64px;height:17px;"]')), _defineProperty(_fullpublic, 'cnFloor3', $('div[style="top:616px;left:510px;width:37px;height:16px;"]')), _defineProperty(_fullpublic, 'cnType3', $('div[style="top:616px;left:577px;width:40px;height:19px;"]')), _defineProperty(_fullpublic, 'cnDimensions3', $('div[style="top:616px;left:695px;width:58px;height:17px;"]')), _defineProperty(_fullpublic, 'cnBath', $('div[style="top:754px;left:470px;width:30px;height:15px;"]')), _defineProperty(_fullpublic, 'cnFloor4', $('div[style="top:754px;left:509px;width:25px;height:15px;"]')), _defineProperty(_fullpublic, 'cnNumOfPieces', $('div[style="top:754px;left:543px;width:54px;height:13px;"]')), _defineProperty(_fullpublic, 'cnEnsuite', $('div[style="top:754px;left:603px;width:40px;height:16px;"]')), _defineProperty(_fullpublic, 'cnFinishedFloorMain', $('div[style="top:756px;left:3px;width:105px;height:14px;"]')), _defineProperty(_fullpublic, 'cnFinishedFloorAbove', $('div[style="top:768px;left:3px;width:115px;height:13px;"]')), _defineProperty(_fullpublic, 'cnFinishedFloorBelow', $('div[style="top:780px;left:3px;width:112px;height:16px;"]')), _defineProperty(_fullpublic, 'cnFinishedFloorBasement', $('div[style="top:792px;left:3px;width:125px;height:15px;"]')), _defineProperty(_fullpublic, 'cnUnfinishedFloor', $('div[style="top:828px;left:3px;width:109px;height:14px;"]')), _defineProperty(_fullpublic, 'cnBCAssess', $('<div id="lblBCAssess" style="top: 111px; left: 525px; width: 50px; height: 16px; text-align: left;">政府估價:</div>')), _defineProperty(_fullpublic, 'cnListingPrice', $('<div id="lblBCAssess" style="top: 129px; left: 525px; width: 50px; height: 16px; text-align: left;">挂牌價格:</div>')), _defineProperty(_fullpublic, 'cnSoldPrice', $('<div id="lblBCAssess" style="top: 147px; left: 525px; width: 50px; height: 16px; text-align: left;">成交價格:</div>')), _defineProperty(_fullpublic, 'translate', function translate() {

		this.cnStrataFee.css("text-decoration", "underline").text('月管理費：');
		this.cnGrossTaxes.css("text-decoration", "underline").text('地稅金額：');
		var squareMeters = $fx.convertUnit(this.finishedFloorArea.text());
		var totalSquareMeters = $fx.convertUnit(this.totalFinishedFloorArea.text());

		this.cnFinishedFloor.text('室内面積：(' + squareMeters.toString() + ' M2)').css("text-decoration: underline");
		this.cnTotalFinishedFloor.text('縂面積：(' + totalSquareMeters.toString() + ' M2)').css("text-decoration: underline");

		this.cnFinishedFloor.addClass(this.finishedFloorArea.attr('class'));
		this.cnTotalFinishedFloor.addClass(this.totalFinishedFloorArea.attr('class'));

		this.cnRestrictedAge.css("text-decoration", "underline").text('年齡限制：');
		this.cnSoldDate.text('銷售日期:');
		this.cnFrontageFeet.text('面寬(尺):');
		this.cnFrontageMeters.text('面寬(米):');
		this.cnDepth.text('進深:');
		this.cnLotArea.text('宅地面積:');
		this.cnFloodPlain.text('是否泄洪區:');
		this.cnApprovalReq.text('是否審批:');
		this.cnNewGST.text('是否含稅:');
		this.cnTaxIncUtilities.text('地稅是否含水費:');
		this.cnZoning.text('規劃碼:');
		this.cnServiceConnected.text('公用服務:');
		this.cnMeasType.text('測量單位:');
		this.cnForTaxYear.text('納稅年度：');
		this.cnAge.css("text-decoration", "underline").text('樓齡: ');
		this.cnYearBuilt.text('建造年份：');
		this.cnOriginalPrice.text('挂牌價格：');
		this.cnBedrooms.css("text-decoration", "underline").text('臥室數：');
		this.cnBathrooms.text('衛生間：');
		this.cnFullBaths.css("text-decoration", "underline").text('全衛：');
		this.cnHalfBaths.text('半衛：');
		this.cnExposure.css("text-decoration", "underline").text('朝向：');
		this.cnComplex.text('小區名稱：');
		this.cnMgmtName.text('管理公司名稱：');
		this.cnMgmtPhone.text('管理公司電話：');
		this.cnView.text('是否有風景：');

		this.cnTotalParking.css("text-decoration", "underline").text('停車位:').css("text-decoration", "underline!important");
		this.cnParking.text('停車場:').css("text-decoration: underline");
		this.cnCoveredParking.css("text-decoration", "underline").text('室内停車位:');
		this.cnParkingAccess.text('停車場入口:');
		this.cnDistToPublicTransit.text('公交距離:');
		this.cnDistToSchoolBus.text('校車距離:');
		this.cnUnitInDevelopment.text('本期開發數量:');
		this.cnTotalUnitsInStrata.text('小區單位數量:');
		this.cnPropertyDisc.text('物業披露書:');
		this.cnFixturesLeased.text('租賃設備:');
		this.cnFixturesRmvd.text('拆卸設備:');
		this.cnFloorFinish.text('地板材料:');
		this.cnLocker.text('儲物間:').css("text-decoration: underline");
		this.cnTitleToLand.css("text-decoration", "underline").text('物業產權:').css("text-decoration: underline");

		this.cnRooms.text('房間數:');
		this.cnKitchens.text('厨房數:');
		this.cnLevels.text('樓層數:');
		this.cnCrawlHeight.text('地下室高度:');
		this.cnPets.text('寵物數:');
		this.cnCats.text('貓:');
		this.cnDogs.text('狗:');
		this.cnBylawRestric.text('物管限制:');
		this.cnRentalsAllowed.text('出租單位數量/比例:');
		this.cnBasement.text('地下室: ');

		this.cnMaintFeeInc.text('管理費包含：');
		this.cnLegal.text('法編: ');
		this.cnAmenities.text('附屬設施: ');
		this.cnSiteInfluences.text('位置特點: ');
		this.cnFeatures.text('室内設施: ');

		this.cnStyleOfHome.text('建築風格:');
		this.cnConstruction.text('建築結構:');
		this.cnExterior.text('外墻: ');
		this.cnFoundation.text('基礎: ');
		this.cnRainScreen.text('隔雨層:');
		this.cnRenovation.text('新裝修項目:');
		this.cnWaterSupply.text('供水系統:');
		this.cnFirePlaceFuel.text('壁爐熱源:');
		this.cnFuelHeating.text('供暖系統:');
		this.cnOutdoorArea.text('室外區域:');
		this.cnTypeOfRoof.text('屋頂材料:');
		this.cnRenoYear.text('裝修年份:');
		this.cnRIFireplaces.text('壁爐預設:');
		this.cnRIPlumbing.text('管道預設:');
		this.cnNumOfFirePlaces.text('壁爐數量:');

		this.cnFloor.text('樓層');
		this.cnFloor2.text('樓層');
		this.cnFloor3.text('樓層');
		this.cnFloor4.text('樓層');
		this.cnType.animate({ width: '60px' }).text('房間類別');
		this.cnType2.animate({ width: '60px' }).text('房間類別');
		this.cnType3.animate({ width: '60px' }).text('房間類別');
		this.cnDimensions.text('房間大小');
		this.cnDimensions2.text('房間大小');
		this.cnDimensions3.text('房間大小');
		this.cnBath.text('衛生間');
		this.cnNumOfPieces.text('套件數');
		this.cnEnsuite.text('套房？');

		this.cnFinishedFloorMain.text('裝修面積（主層）: ');
		this.cnFinishedFloorAbove.text('裝修面積（二樓）:');
		this.cnFinishedFloorBelow.text('裝修面積（一樓）:');
		this.cnFinishedFloorBasement.text('裝修面積（地下室）:');
		this.cnUnfinishedFloor.text('未裝修面積: ');

		if (this.listingHouseType == 'ResidentialDetached') {
			this.cnSuite.text('套間:');
			this.cnBedNotInBasement.text('主層臥室數:');
			this.cnBedsInBasement.text('地下室臥室數:');
		}

		this.cnBCAssess.addClass(this.bcAssess.attr('class')).insertBefore(this.bcAssess);
		this.cnListingPrice.addClass(this.lp.attr('class')).insertBefore(this.lp);
		this.cnSoldPrice.addClass(this.sp.attr('class')).insertBefore(this.sp);
	}), _fullpublic);

	//fullpublic startpoint
	$(function () {
		fullpublic.init();
	});

/***/ }),

/***/ 9:
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
	    this.streetAddress = this.streetNumber + ' ' + this.streetName.replace('-', ' ') + ' ' + this.streetType;
	    this.googleSearchLink = "http://www.google.com/search?q=" + this.streetAddress.split(' ').join('+');
	};

	;

	exports.default = AddressInfo;

/***/ }),

/***/ 10:
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

/***/ })

/******/ });