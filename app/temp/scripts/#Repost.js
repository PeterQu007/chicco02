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

	var _Pages = __webpack_require__(6);

	var _Pages2 = _interopRequireDefault(_Pages);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var _$ = console.log;

	$(function () {

		console.log('=====================================REPOST A LISTING');

		setTimeout(move, 1000);

		function move() {

			if (document.location.href.indexOf('edit') > -1) {

				chrome.storage.sync.get(['postMenuStatus'], function (status) {

					_$("repost.js.1.0.get storage postMenuStatus: ", status.postMenuStatus);

					switch (status.postMenuStatus) {

						case 'repost':
							$('#postingForm').submit();
							break;
						case 'edit':
							//wait for edit the page
							_$("repost.js.1.0.start to edit listing: ");
							chrome.storage.sync.set({ 'postMenuStatus': 'edit' });
						case 'new':
							_$("repost.js.1.0.start to add new listing: ");
						default:
							break;
					}
				});
			}

			if (document.location.href.indexOf('preview') > -1) {

				chrome.storage.sync.get(['postMenuStatus'], function (status) {

					_$("repost.js.2.0.get storage postMenuStatus: ", status);

					if (pageStatus.postMenuStatus == 'repost') {

						$('#publish_top').submit();
					} else {
						//wait for edit the page
						_$("repost.js.2.1.start to edit listing: ");
						$('div.preview-edit-buttons form:first').submit();
						chrome.storage.sync.set({ 'postMenuStatus': 'editpost' });
					}
				});
			}

			if (document.location.href.indexOf('redirect') > -1) {
				//get previous page number
				_$("respost.redirect.1.0: ");
				var msg = { from: "repost", subject: "fetchBackupCurrentPage" };

				chrome.runtime.sendMessage(msg, function (response) {
					_$('redirect.get response of fetchbackupCurrentPage: ', response);
					var previousPage = response.backupCurrentPage.toString().trim();
					var cgRedirectPage = _Pages2.default.cgRedirect.replace("filter_page=2", "filter_page=" + previousPage);
					_$("repost.1.2.show the cgRedirectPage href: ", cgRedirectPage);
					$($('section.body ul.ul li a')[2]).attr('href', cgRedirectPage);
					$('section.body ul.ul li a')[2].click();
				}
				//compose the redirect link
				//change or add a link in the page
				//click the new link , back to previous page
				//$('section.body ul.ul li a')[2].click();
				);
			}
		}
	}());

/***/ }),

/***/ 6:
/***/ (function(module, exports) {

	"use strict";

	//define the pages 

	var cgWebPages = {

		"cgHomePage": "https://accounts.craigslist.org/login?lang=en&cc=us&rt=L&rp=%2Flogin%2Fhome%3Flang%3Den%26cc%3Dus",
		"cgLoginPage": "",
		"cgRepostPage": "",
		"cgEditPage": "",
		"cgUndeletePage": "",
		"cgDeletePage": "",
		"cgRenewPage": "",
		"cgRedirect": "https://accounts.craigslist.org/login/home?filter_page=2&filter_cat=0&filter_date=0&filter_active=0&show_tab=postings"

	};

	module.exports = cgWebPages;

/***/ })

/******/ });