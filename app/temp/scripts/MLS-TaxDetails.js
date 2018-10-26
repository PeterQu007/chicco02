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
/***/ (function(module, exports) {

	'use strict';

	// read tax details report, save the data
	var curTabID = null;

	var taxDetails = {

		pid: $('div[style="top:113px;left:150px;width:221px;height:14px;"]').text(),
		address: $('div[style="top:71px;left:150px;width:221px;height:14px;"]').text(),
		taxYear: $('div[style="top:176px;left:150px;width:221px;height:14px;"]').text(),
		taxRollNumber: $('div[style="top:162px;left:150px;width:221px;height:14px;"]').text(),
		grossTaxes: $('div[style="top:162px;left:525px;width:221px;height:14px;"]').text(),
		legal: $('div[style="top:264px;left:0px;width:746px;height:14px;"]').text(),
		legalFreeFormDescription: $('div[style="top:303px;left:0px;width:746px;height:14px;"]').text(),

		reportTitleClass: $("div[style='top:0px;left:0px;width:746px;height:17px;']").attr('class'), //base class for reading the variable position fields

		landValue: null,
		improvementValue: null,
		totalValue: null,
		bcaDescription: null,
		bcaDataUpdateDate: null,
		lotSize: null,
		planNum: null,
		reportLink: null,
		houseType: null,

		init: function init() {

			var self = this;
			chrome.storage.sync.get('houseType', function (result) {

				self.houseType = result.houseType;
				console.log('houseType is: ', self.houseType);
				console.log('TopPosition: ', self.ActualTotalsTopPosition);

				self.getTaxReportDetails();

				var assess = {
					_id: self.pid,
					landValue: self.landValue,
					improvementValue: self.improvementValue,
					totalValue: self.totalValue,
					taxYear: self.taxYear,
					address: self.address,
					legal: self.legal,
					taxRollNumber: self.taxRollNumber,
					grossTaxes: self.grossTaxes,
					planNum: self.planNum,
					houseType: self.houseType,
					lotSize: self.lotSize,
					bcaDataUpdateDate: self.bcaDataUpdateDate,
					bcaDescription: self.bcaDescription,
					from: 'assess' + Math.random().toFixed(8)
				};
				chrome.storage.sync.set(assess, function () {
					console.log('TaxDetails.bcAssessment is...', assess);
					self.getReportLink(function () {
						self.reportLink[0].click();
						console.log("1 Current Tab When Doing Tax Search is : ", curTabID);
						var curTabContentContainer = $('div' + curTabID, top.document);
						curTabContentContainer.attr("style", "display:block!important");
					});
				});
				chrome.runtime.sendMessage({
					todo: 'saveTax_Pause',
					taxData: assess
				}, function (response) {
					console.log('tax Data has been save to the database!');
				});
			});
		},

		getReportLink: function getReportLink(callback) {
			var self = this;
			chrome.storage.sync.get('curTabID', function (result) {
				console.log("2 Current Tab When Doing Tax Search is : ", result.curTabID);
				self.reportLink = $('div#app_tab_switcher a[href="' + result.curTabID + '"]', top.document);
				console.log(self.reportLink);
				curTabID = result.curTabID;
				callback();
			});
		},

		getAssessClass: function getAssessClass(reportTitleClass) {

			var assessClass = "";
			console.log('reportTitleClass is: ', reportTitleClass);
			assessClass = 'mls' + (Number(reportTitleClass.replace('mls', '')) + 7);

			return assessClass;
		},

		getPlanNumClass: function getPlanNumClass(reportTitleClass) {

			var planNumClass = "";
			console.log('reportTitleClass is: ', reportTitleClass);
			planNumClass = 'mls' + (Number(reportTitleClass.replace('mls', '')) + 5);

			return planNumClass;
		},

		getOtherFieldsClass: function getOtherFieldsClass(reportTitleClass) {

			var otherFieldsClass = "";
			console.log('reportTitleClass is: ', reportTitleClass);
			otherFieldsClass = 'mls' + (Number(reportTitleClass.replace('mls', '')) + 3);

			return otherFieldsClass;
		},

		getTaxReportDetails: function getTaxReportDetails() {
			var self = this;

			var assessClass = self.getAssessClass(self.reportTitleClass);
			var planNumClass = self.getPlanNumClass(self.reportTitleClass);
			var otherFieldsClass = self.getOtherFieldsClass(self.reportTitleClass);

			// got Actual Totals:

			var x1 = $("div." + assessClass);
			self.landValue = x1[0].innerText;
			self.improvementValue = x1[1].innerText;
			self.totalValue = x1[2].innerText;

			// got plan number & other fields:

			var x2 = $("div." + planNumClass);
			self.planNum = x2[1].textContent;

			if (self.landValue != '$0.00') {
				var x3 = $("div." + otherFieldsClass);
				self.lotSize = x3[17].textContent; //lotSize Field Index: 17
				self.bcaDescription = x3[24].textContent; //BCA Description Field Index: 24
				self.bcaDataUpdateDate = x3[28].textContent; //BCAData Update: 28
			} else {
				self.lotSize = '';
				self.bcaDescription = '';
				self.bcaDataUpdateDate = '';
			}
		}
	};

	// start point:
	$(function () {
		console.log('mls-taxdetails iFrame: ');
		taxDetails.init();
	});

/***/ })
/******/ ]);