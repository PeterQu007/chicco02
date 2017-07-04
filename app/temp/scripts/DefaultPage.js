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

	//works with Paragon's main window
	//the messages are passed between the defaultpage and iframes, all are the contect sripts

	//Open frequently used tabs:

	$('a[url="/ParagonLS/Search/Tax.mvc?DBid=1&countyID=1"]')[0].click();
	$('a[url="/ParagonLS/Search/Property.mvc/LoadSavedSearch"]')[0].click();

	chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {

	    //get Warning message: the search results exceed the limit, ignore it
	    if (request.todo == "ignoreWarning") {
	        var checkCount = function checkCount() {
	            //#OK button, "Continue", belongs to default page
	            if (document.querySelector("#OK")) {

	                clearInterval(countTimer);
	                var btnOK = $('#OK');
	                console.log("OK", btnOK);
	                btnOK.click();
	            }
	        };

	        //Warning Form is a special page, the buttons are in the div, 
	        //the iframe is separate with the buttons
	        //this message sent from mls-warning.js
	        console.log("Main Home ignore warning message!");
	        console.log($('#OK'));

	        var countTimer = setInterval(checkCount, 100);

	        ;
	    };

	    //Logout MLS Windows shows an annoying confirm box, pass it
	    //The message sent from logout iframe , the buttons are inside the iframe
	    if (request.todo == "logoutMLS") {
	        var _checkCount = function _checkCount() {
	            //the button is inside the iframe, this iframe belongs to default page
	            if (document.querySelector("#confirm")) {

	                clearInterval(countTimer);
	                var btnYes = $('#confirm');
	                console.log("confirm", btnYes);
	                btnYes.click();
	            }
	        };

	        console.log("Main Home got logout message!");
	        console.log($('#confirm'));

	        var countTimer = setInterval(_checkCount, 100);

	        ;
	    };
	});

/***/ })
/******/ ]);