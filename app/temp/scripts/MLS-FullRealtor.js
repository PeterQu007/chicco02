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

	'use strict';

	var _LegalDescription = __webpack_require__(1);

	var _LegalDescription2 = _interopRequireDefault(_LegalDescription);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var averagePrice = $('<div style="top:7px;left:471px;width:147px;height:13px;" id="averagePrice" class="mls18"></div>'); // add average sf price to the form

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
	var sfPrice = LP / FinishedFloorArea;

	//averagePrice.text('$' + sfPrice.toFixed(0) + '(/SF)');

	divLP.text(divLP.text() + ' [$' + sfPrice.toFixed(0) + '/sf]');

	var divMLS = $('<div style="position: absolute; top:7px;left:771px;width:147px;height:13px;">MLS #</div>');
	divMLS.appendTo(divReport);

	var mlsNO = $('div[style="top:18px;left:4px;width:123px;height:13px;"] a').text();

	divMLS.text(mlsNO);

	//process legal description, get strata plan

	var divLegal = $('div[style="top:426px;left:75px;width:593px;height:24px;"]');
	var legal = divLegal.text();
	var legalDesc = new _LegalDescription2.default(legal);

	var divStrPlan = $('<div style="position: absolute; top:21px;left:771px;width:147px;height:13px;"></div>');
	var strPlanLink = $('<a href="http://bcres.paragonrels.com/ParagonLS/Home/Page.mvc#HomeTab" target="HomeTab" id="strataPlanLink" ></a>');
	strPlanLink.text(legalDesc.strataPlan);
	strPlanLink.appendTo(divStrPlan);
	divStrPlan.appendTo(divReport);

	var strataPlanLink = $('#strataPlanLink');

	chrome.storage.sync.set({ strataPlan: legalDesc.strataPlan });

	//get realtor remarks
	var divRealtorRemarks = $('div[style="top:860px;left:53px;width:710px;height:35px;"]');
	var realtorRemarks = divRealtorRemarks.text();
	var divNewRealtorRemarks = $('<div style = "position: absolute; top:34px;left:771px;width:147px;height:60px;"></div>');
	divNewRealtorRemarks.text(realtorRemarks);
	divNewRealtorRemarks.appendTo(divReport);

	function getDecimalNumber(strNum) {

				var result = 0,
				    numbers = '';

				strNum = strNum.replace(/,/g, '');
				for (var i = 0, len = strNum.length; i < len; ++i) {

							if (!isNaN(strNum[i])) {
										numbers += strNum[i];
							}
				}

				result = Number(numbers);
				return result.toFixed(0);
	}

	strataPlanLink.click(function (e) {

				e.preventDefault();
				var homeTab = $('#HomeTabLink', top.document);

				homeTab[0].click();
				console.log("hello iframe2");

				var mlsDateLow = $("#f_33_Low__1-2-3-4");
				var mlsDateHigh = $("#f_33_High__1-2-3-4");

				chrome.runtime.sendMessage({ from: 'ListingReport', todo: 'switchTab' }, function (response) {

							console.log('mls-fullrealtor got response', response);
				});
	});

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// get strata plan number

	var strataPlanPrefix = ['EPS', 'BCS', 'LMS', 'BCP', 'LMP', 'PLAN', 'PL'];

	var LegalDescription = function () {
		function LegalDescription(legal) {
			_classCallCheck(this, LegalDescription);

			this.legal = legal.replace(/\./g, ' ');
			this.strataPlan = '';
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
						this.strataPlan = strataPlanPrefix[j] + plan.trim();
						return;
					}
				}

				this.strataPlan = 'strata plan not found';
			}
		}]);

		return LegalDescription;
	}();

	exports.default = LegalDescription;

/***/ })
/******/ ]);