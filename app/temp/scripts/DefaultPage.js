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

	var _mlsTabs = __webpack_require__(1);

	var _mlsTabs2 = _interopRequireDefault(_mlsTabs);

	var _mlsMainMenu = __webpack_require__(2);

	var _mlsMainMenu2 = _interopRequireDefault(_mlsMainMenu);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// works with Paragon's main window
	// inject to Paragon's Url: http://bcres.paragonrels.com/ParagonLS/Default.mvc*
	// the messages are passed between the defaultpage and iframes, all are the content scripts

	var DefaultPage = {

	    init: function init() {
	        // Open frequently used tabs:
	        this.mainMenu.openTaxSearch();
	        this.mainMenu.openSavedSearches();
	    },

	    mainMenu: new _mlsMainMenu2.default(),
	    tabs: new _mlsTabs2.default()

	};

	// Start point
	$(function () {
	    DefaultPage.init();
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

	//Class Tabs for the default main page of Paragon
	//get the tab elements, containers, links
	//keep the state of the current tab

	var Tabs = function () {
	    function Tabs() {
	        _classCallCheck(this, Tabs);

	        //get the Top Level tabs Container
	        this.topTabsContainer = $('ul#tab-bg');
	        //Container for sub tabs under the Top Level Tabs
	        this.subTabsContainer = null;
	        this.topTabs = $('ul#tab-bg li');
	        this.topTabLinks = $('ul#tab-bg li a');
	        this.curTopTabLink = $('ul#tab-bg li.ui-tabs-selected.ui-state-active a');
	        this.curTopTabID = this.curTopTabLink.attr('href');;
	        console.info('New Tabs Class works now...');
	        //add event listeners
	        this.OnClick_topTabsContainer();
	        this.onMessage();
	    }

	    _createClass(Tabs, [{
	        key: 'OnClick_topTabsContainer',
	        value: function OnClick_topTabsContainer() {
	            var self = this;
	            this.topTabsContainer.click(function () {
	                self.subTabsContainer = $('div.ui-tabs-sub');
	                self.subTabsContainer.removeAttr('style');
	                console.info('get top tabs container clicked');
	            });
	        }
	    }, {
	        key: 'onMessage',
	        value: function onMessage() {
	            (function (self) {
	                chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
	                    // get Warning message: the search results exceed the limit, ignore it
	                    if (request.todo == 'ignoreWarning') {
	                        var checkCount = function checkCount() {
	                            // #OK button, "Continue", belongs to default page
	                            if (document.querySelector('#OK')) {
	                                clearInterval(countTimer);
	                                var btnOK = $('#OK');
	                                console.log('OK', btnOK);
	                                btnOK.click();
	                            }
	                        };

	                        // Warning Form is a special page, the buttons are in the div, 
	                        // the iframe is separate with the buttons
	                        // this message sent from mls-warning.js
	                        console.log('Main Home ignore warning message!');
	                        console.log($('#OK'));
	                        var countTimer = setInterval(checkCount, 100);
	                        ;
	                    };

	                    // Logout MLS Windows shows an annoying confirm box, pass it
	                    // The message sent from logout iframe , the buttons are inside the iframe
	                    if (request.todo == 'logoutMLS') {
	                        var _checkCount = function _checkCount() {
	                            // the button is inside the iframe, this iframe belongs to default page
	                            if (document.querySelector('#confirm')) {
	                                clearInterval(countTimer);
	                                var btnYes = $('#confirm');
	                                console.log('confirm', btnYes);
	                                btnYes.click();
	                            }
	                        };

	                        console.log('Main Home got logout message!');
	                        console.log($('#confirm'));
	                        var countTimer = setInterval(_checkCount, 100);
	                        ;
	                    };

	                    //Top Level Tabs Changed
	                    if (request.todo == 'updateTopLevelTabMenuItems') {
	                        // update tabs
	                        self.tabs = $('ul#tab-bg li');
	                        console.log('default home page update top level tabs: ', tabs);
	                        self.curTabLink = $('ul#tab-bg li.ui-tabs-selected.ui-state-active a');
	                        self.curTabID = curTabLink.attr('href');
	                        chrome.storage.sync.set({ curTabID: self.curTabID });
	                    }

	                    //Read the Current TabID
	                    if (request.todo == 'readCurTabID') {
	                        // read cur tabID
	                        self.tabs = $('ul#tab-bg li');
	                        console.log('default home page read top level tabs: ', self.tabs);
	                        self.curTabLink = $('ul#tab-bg li.ui-tabs-selected.ui-state-active a');
	                        self.curTabID = self.curTabLink.attr('href');
	                        console.log('current Tab ID is: ', self.curTabID);
	                        // save the curTabID
	                        chrome.storage.sync.set({ curTabID: self.curTabID }, function () {
	                            console.log('curTabID has been save to storage.');
	                        });
	                    }
	                });
	            })(this);
	        }
	    }]);

	    return Tabs;
	}();

	exports.default = Tabs;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	//define the paragon mls Main Menu Class
	//store the frequently used menu function links in the class

	var MainMenu = function () {
	    function MainMenu() {
	        _classCallCheck(this, MainMenu);

	        this.appBanner = $('#app_banner');
	        this.appLeftBanner = $('#app_banner_links_left');
	        this.appRightBanner = $('app_banner_links_right');
	        this.appMidBanner = $('<div id = "app_banner_mid"></div>');
	        this.appMainMenu = $('#app_banner_menu');
	        this.chkLanguage = $('<div class="languagebox">\n                                <div id="reportlanguage">\n                                    <label>cn</label>\n                                    <input type="checkbox" name="checkbox" style="width: 14px!important" />\n                                </div>\n                            </div>'), this.chkLanguage.insertAfter(this.appLeftBanner);
	        this.taxSearch = $('a[url="/ParagonLS/Search/Tax.mvc?DBid=1&countyID=1"]');
	        this.savedSearches = $('a[url="/ParagonLS/Search/Property.mvc/LoadSavedSearch"]');
	        console.info('New Main Menu Class works!');

	        //add the tabs object to Main Menu.
	        //this.tabs = new Tabs();
	    }

	    _createClass(MainMenu, [{
	        key: 'openTaxSearch',
	        value: function openTaxSearch() {
	            this.taxSearch[0].click();
	        }
	    }, {
	        key: 'openSavedSearches',
	        value: function openSavedSearches() {
	            this.savedSearches[0].click();
	        }
	    }]);

	    return MainMenu;
	}();

	exports.default = MainMenu;

/***/ })
/******/ ]);