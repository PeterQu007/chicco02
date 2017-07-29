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

	// mls-data.js : try to read the MLS data day by day
	// download limit: <1500 records / time
	// quick search feature is a iframe page

	$(function () {
	    console.groupCollapsed('mls-data');
	    var strataPlanNumber, complexName, countResult;
	    var $fx = L$();
	    // iframe loaded, trigger search event
	    window.addEventListener('load', myMain, false);

	    function myMain(evt) {
	        var checkTimer = setInterval(checkForSearchFinish, 100);
	        function checkForSearchFinish() {
	            if (document.querySelector('#CountResult')) {
	                clearInterval(checkTimer);
	                // DO YOUR STUFF HERE.
	                $(function () {
	                    var mlsDateLow = $('#f_33_Low__1-2-3-4');
	                    var mlsDateHigh = $('#f_33_High__1-2-3-4');
	                    // function .blur() is used to trigger PARAGON to split the mls#s
	                    mlsDateLow.focus().val($fx.today).blur();
	                    mlsDateHigh.focus().val($fx.today).blur();
	                });
	                //do not show search results, do not save results
	                getCountResult(false, false);
	            }
	        };
	    };

	    // waiting the search result from Quick Search box
	    function getCountResult(showResult, saveResult) {
	        console.groupCollapsed('getCountResult');
	        var checkTimer = setInterval(checkSearchResult, 100);
	        var counter = 1;
	        function checkSearchResult() {
	            // result is a text with commas, remove the commas
	            var mlsCountResult = $('#CountResult').val().replace(',', '');
	            if ($fx.isInt(mlsCountResult)) {
	                clearInterval(checkTimer);
	                countResult = mlsCountResult;
	                var btnSearch = $('#Search');
	                console.log('mls Quick Search Done: ', mlsCountResult);
	                console.log($('#CountResult').val());
	                console.groupEnd();
	                if (saveResult) {
	                    saveCountResult();
	                }
	                // jump to detailed page view of the search results
	                if (showResult) {
	                    btnSearch.click();
	                }
	            } else {
	                console.log('mls data searching ...', checkTimer);
	                if (counter++ > 300) {
	                    clearInterval(checkTimer);
	                    console.warn('overtimed, stop checking result', counter);
	                    console.groupEnd();
	                }
	            }
	        }
	    };

	    //save count result
	    function saveCountResult() {
	        var spSummary = {
	            _id: strataPlanNumber + '-' + $fx.getToday(),
	            strataPlan: strataPlanNumber,
	            name: complexName,
	            searchDate: $fx.getToday(),
	            count: countResult,
	            active: 'todo',
	            sold: 'todo',
	            from: 'strataPlanSummary' + Math.random().toFixed(8)
	            //save results to storage:
	        };chrome.storage.sync.set(spSummary);
	        console.log('mls-data wrap up the complex data: ', spSummary);
	        chrome.runtime.sendMessage({ 'todo': 'saveStrataPlanSummary', 'spSummaryData': spSummary });
	    }

	    chrome.runtime.onMessage.addListener(function (msg, sender, response) {
	        console.log('mls-data got message: ', msg);
	        if (msg.todo != 'switchTab' && msg.todo != 'searchComplex') {
	            return;
	        };
	        response('mls-data got a message');

	        var mlsDateLow = $('#f_33_Low__1-2-3-4');
	        var mlsDateHigh = $('#f_33_High__1-2-3-4');
	        var strataPlan = $('#f_41__1-2-3-4');
	        var strataPlanHidden = $('#hdnf_41__1-2-3-4');
	        var liStrataPlan = $('div[rel="f_41__1-2-3-4"] ul li.acfb-data');
	        var today = new Date();
	        var day60 = new Date();
	        day60.setDate(today.getDate() - 60);

	        // function .blur() is used to trigger PARAGON to split the mls#s
	        liStrataPlan.remove();
	        strataPlanHidden.val('');
	        mlsDateLow.focus().val('').blur();
	        mlsDateHigh.focus().val('').blur();
	        strataPlan.focus().val('').blur();

	        chrome.storage.sync.get(['strataPlan1', 'strataPlan2', 'strataPlan3', 'strataPlan4', 'complexName'], function (listing) {
	            mlsDateLow.focus().val($fx.formatDate(day60)).blur();
	            mlsDateHigh.focus().val($fx.formatDate(today)).blur();
	            var strataPlans = listing.strataPlan1 + ',' + listing.strataPlan2 + ',' + listing.strataPlan3 + ',' + listing.strataPlan4 + ',';
	            strataPlan.focus().val(strataPlans).blur();
	            strataPlanNumber = listing.strataPlan1;
	            complexName = listing.complexName;
	            getCountResult(msg.showResult, msg.saveResult);
	        });
	    });
	    console.groupEnd();
	});

/***/ })
/******/ ]);