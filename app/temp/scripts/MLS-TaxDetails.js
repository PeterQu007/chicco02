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

	//read tax details report, save the data

	var taxDetails = {

			pid: $('div[style="top:113px;left:150px;width:221px;height:14px;"]').text(),
			landValue: $('div[style="top:643px;left:0px;width:246px;height:14px;"]').text(),
			improvementValue: $('div[style="top:643px;left:250px;width:246px;height:14px;"]').text(),
			totalValue: $('div[style="top:643px;left:500px;width:246px;height:14px;"]').text(),
			taxYear: $('div[style="top:176px;left:150px;width:221px;height:14px;"]').text(),
			taxRollNumber: $('div[style="top:162px;left:150px;width:221px;height:14px;"]').text(),
			grossTaxes: $('div[style="top:162px;left:525px;width:221px;height:14px;"]').text(),
			planNum: $('div[style="top:356px;left:0px;width:79px;height:14px;"]').text(),
			reportLink: null,

			init: function init() {

					var self = this;

					var assess = {

							_id: this.pid,
							landValue: this.landValue,
							improvementValue: this.improvementValue,
							totalValue: this.totalValue,
							taxYear: this.taxYear,
							taxRollNumber: this.taxRollNumber,
							grossTaxes: this.grossTaxes,
							planNum: this.planNum
					};

					chrome.storage.sync.set(assess, function () {

							console.log("TaxDetails.bcAssessment is...", assess);
							self.getReportLink(function () {

									self.reportLink[0].click();
							});
					});

					chrome.runtime.sendMessage({ todo: 'saveTax',
							taxData: assess }, function (response) {

							console.log("tax Data has been save to the database!");
					});
			},

			getReportLink: function getReportLink(callback) {

					var self = this;

					chrome.storage.sync.get('curTabID', function (result) {

							self.reportLink = $('div#app_tab_switcher a[href="' + result.curTabID + '"]', top.document);
							callback();
					});
			}

	};

	//start point:

	$(function () {

			console.log("mls-taxdetails iFrame: ");

			taxDetails.init();
	});

	// var landValue=$('div[style="top:643px;left:0px;width:246px;height:14px;"]').text();
	// var improvementValue=$('div[style="top:643px;left:250px;width:246px;height:14px;"]').text();
	// var totalValue=$('div[style="top:643px;left:500px;width:246px;height:14px;"]').text();
	// var taxYear = $('div[style="top:176px;left:150px;width:221px;height:14px;"]').text();
	// var taxRollNumber = $('div[style="top:162px;left:150px;width:221px;height:14px;"]').text();
	// var grossTaxes = $('div[style="top:162px;left:525px;width:221px;height:14px;"]').text();
	// var planNum = $('div[style="top:356px;left:0px;width:79px;height:14px;"]').text();


	// chrome.storage.sync.set({landValue:landValue, improvementValue:improvementValue, totalValue:totalValue});

	// chrome.storage.sync.get(['landValue','improvementValue','totalValue', 'curTabID'], function(result){


	// 	console.log("bcAssessment is: ", result);

	// 	var reportLink = $('div#app_tab_switcher a[href="'+ result.curTabID +'"]', top.document);
	// 	console.log("reportLink is: ", reportLink);
	// 	reportLink[0].click();

	// })

/***/ })
/******/ ]);