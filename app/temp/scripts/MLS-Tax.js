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

	"use strict";

	//Query tax information

	//console.log("MLS tax search iframe");

	// chrome.storage.sync.get("PID",function(result){

	// 	var inputPID = $('#f_22');
	// 	inputPID.focus().val(result.PID).blur();

	// 	var btnSearch = $('#Search');

	// 	btnSearch.click();

	// })

	chrome.runtime.onMessage.addListener(function (msg, sender, response) {

				if (msg.todo == 'taxSearch') {

							//console.log("I am in mls-tax.js");
							//console.log("mls-tax got msg: ", msg);
							response("mls-tax got a message");

							chrome.storage.sync.get("PID", function (result) {

										var inputPID = $('#f_22');
										var liPID = $('div[rel="f_22"] ul li.acfb-data');
										var inputHidenPID = $('#hdnf_22');
										liPID.remove();
										inputHidenPID.val('');
										inputHidenPID.val("['" + result.PID + "']");

										inputPID.focus().val(result.PID).blur();

										var btnSearch = $('#Search');

										chrome.storage.sync.set({

													totalValue: 0,
													landValue: 0,
													improvementValue: 0
										});

										btnSearch.click();
							});
				}
	});

/***/ })
/******/ ]);