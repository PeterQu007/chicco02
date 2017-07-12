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

	"use strict";

	var _Database = __webpack_require__(1);

	var _Database2 = _interopRequireDefault(_Database);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var db = new _Database2.default(); //background script, event mode
	//message passed between background - defaultpage - iframes


	(function () {

		//console.log("Hello!-1");

		chrome.storage.sync.set({ landValue: 0, improvementValue: 0, totalValue: 0, curTabID: null });

		chrome.browserAction.onClicked.addListener(function (activeTab) {

			//open a link
			var newURL = "http://idp.gvfv.clareitysecurity.net/idp/Authn/UserPassword";
			//var newURL = "http://stackoverflow.com/"
			chrome.tabs.create({ url: newURL });

			//console.log("Hello!");

			//alert("hello");
		});

		chrome.webNavigation.onCompleted.addListener(function (details) {
			console.log("Completed!");
			//alert("Completed!");
		}, {
			url: [{ hostContains: '.paragonrels.com' }]
		});

		//receive message from iframes, then transfer the message to Main Page content script
		chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

			console.log("eventPage got a message", request);

			//message from Warning iframe
			if (request.todo == "warningMessage") {

				console.log("I got the warning message!");
				//pass the message to defaultpage(Main Home Page)
				chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
					chrome.tabs.sendMessage(tabs[0].id, { todo: "ignoreWarning" });
				});
			}

			//message from Logout iframe
			if (request.todo == "logoutMessage") {

				console.log("I got logout message!");
				//pass the message to defaultpage(Main Home Page)
				chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
					chrome.tabs.sendMessage(tabs[0].id, { todo: "logoutMLS" });
				});
			}

			if (request.todo == "switchTab") {

				console.log("I got switch Tab message!");
				//pass the message to defaultpage(Main Home Page)
				chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
					chrome.tabs.sendMessage(tabs[0].id, { todo: "switchTab" });
				});

				sendResponse("switchTab done!!!");
			}

			if (request.todo == "taxSearch") {
				//get request to search tax info of Property with PID saved to storage
				console.log(">>>I got tax search command!");

				chrome.storage.sync.get('PID', function (result) {
					//check database, if assess exist, send it back
					console.log(">>>PID is: ", result.PID);
					db.read(result.PID, function (assess) {

						console.log(">>>read from db, assess is: ", assess);
						if (assess) {} else {
							//other wise , send out tax research command:
							chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
								chrome.tabs.sendMessage(tabs[0].id, { todo: "taxSearch" });
							});
						}
					});
				});

				sendResponse(">>>tax search has been processed in evenpage: ");
			}

			if (request.todo == "saveTax") {

				console.log(">>>I got save tax info: ");

				// var assess = {

				// 	"_id": request._id,
				// 	"landValue": request.landValue,
				// 	"improvementValue": request.improvementValue,
				// 	"totalValue": request.totalValue,
				// 	"changeValue": request.valueChange,
				// 	"changeValuePercent": request.valueChangePercent

				// }

				var assess = request.taxData;

				db.write(assess);

				sendResponse(assess);
			}

			if (request.todo == "updateTopLevelTabMenuItems") {

				console.log("I got Update Top Level Tab Menu Items Command!");

				chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
					chrome.tabs.sendMessage(tabs[0].id, { todo: "updateTopLevelTabMenuItems" });
				});

				sendResponse("Update Top Level Tab Menu Items Command sent out!");
			}

			if (request.todo == "readCurTabID") {

				console.log("New Command: readCurTabID");

				chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
					chrome.tabs.sendMessage(tabs[0].id, { todo: "readCurTabID" });
				});

				sendResponse("readCurTabID Command sent out!");
			}
		});

		//End of Main Function
	})();

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	//Create, Read, Write, Query Database

	var Database = function () {
		function Database() {
			_classCallCheck(this, Database);

			this.db = new PouchDB('http://localhost:5984/bcassessment');
			this.db.info().then(function (info) {
				console.log(info);
			});
			this.assess = null;
		}

		_createClass(Database, [{
			key: "read",
			value: function read(PID, callback) {

				console.log(">>>this in Database is: ", this);
				var self = this;

				self.db.get(PID).then(function (doc) {

					self.assess = doc;
					console.log(">>>read the tax info in database is: ", self.assess);

					chrome.storage.sync.set({ landValue: doc.landValue,
						improvementValue: doc.improvementValue,
						totalValue: doc.totalValue
					});
					callback(self.assess);
				}).catch(function (err) {
					console.log(">>>read database error: ", err);

					// chrome.runtime.sendMessage(

					//    		{from: 'ListingReport', todo: 'taxSearch'},

					//    		function(response){

					//    			console.log('>>>mls-fullpublic got response:', response);

					//    		}
					// )

					self.assess = null;
					callback(self.assess);
				});
			}
		}, {
			key: "write",
			value: function write(assess) {

				var PID = assess._id;
				var self = this;

				self.db.put(assess).then(function () {
					return self.db.get(PID);
				}).then(function (doc) {
					console.log(">>>bc assessment has been saved to db: ", doc);
				}).catch(function (err) {
					console.log(">>>save bc assessment error: ", err);
					self.db.get(PID).then(function (doc) {
						return self.db.remove(doc);
					}).catch(function (err) {
						console.log(">>>remove bc assess error: ", err);
					});
				});
			}
		}]);

		return Database;
	}();

	exports.default = Database;

/***/ })
/******/ ]);