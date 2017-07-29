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

	var _Database = __webpack_require__(3);

	var _Database2 = _interopRequireDefault(_Database);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var db = new _Database2.default(); //background script, event mode
	//message passed between background - defaultpage - iframes

	var $fx = L$();

	// function getToday() {
	// 	var today = new Date();
	// 	var dd = today.getDate();
	// 	var mm = today.getMonth() + 1; //January is 0!
	// 	var yyyy = today.getFullYear();

	// 	if (dd < 10) {
	// 		dd = '0' + dd
	// 	}

	// 	if (mm < 10) {
	// 		mm = '0' + mm
	// 	}

	// 	today = yyyy + mm + dd;
	// 	return today;
	// };

	(function () {

		//console.log("Hello!-1");

		chrome.storage.sync.set({ landValue: 0, improvementValue: 0, totalValue: 0, curTabID: null });

		chrome.browserAction.onClicked.addListener(function (activeTab) {

			//open a link
			var newURL = "http://idp.gvfv.clareitysecurity.net/idp/Authn/UserPassword";
			//var newURL = "http://stackoverflow.com/"
			chrome.tabs.create({ url: newURL });
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
					chrome.tabs.sendMessage(tabs[0].id, { todo: "switchTab", showResult: request.showResult, saveResult: request.saveResult });
				});

				sendResponse("switchTab done!!!");
			}

			if (request.todo == "taxSearch") {
				//get request to search tax info of Property with PID saved to storage
				console.log(">>>I got tax search command!");

				chrome.storage.sync.get('PID', function (result) {
					//check database, if assess exist, send it back
					console.log(">>>PID is: ", result.PID);
					db.readAssess(result.PID, function (assess) {
						console.log(">>>read from , assess is: ", assess);
						if (!assess) {
							//other wise , send out tax research command:
							chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
								chrome.tabs.sendMessage(tabs[0].id, { todo: "taxSearch" });
							});
						}
					});
				});
				sendResponse(">>>tax search has been processed in eventpage: ");
			}

			if (request.todo == "searchStrataPlanSummary") {
				//get request to search tax info of Property with PID saved to storage
				console.log(">>>I got search StrataPlanSummary command!");

				chrome.storage.sync.get(['strataPlan', 'complexName'], function (result) {
					//check database, if assess exist, send it back
					console.log(">>>strataPlan is: ", result.strataPlan);
					var strataPlan = result.strataPlan;
					var complexName = result.complexName;
					if (!strataPlan || strataPlan == 'PLAN' || strataPlan == 'PL') {
						return;
					};
					var today = $fx.getToday();
					db.readStrataPlanSummary(strataPlan + '-' + today, function (strataPlanSummaryToday) {
						console.log(">>>read from , strataPlanSummary is: ", strataPlanSummaryToday);
						if (!strataPlanSummaryToday) {
							//other wise , send out tax research command:
							chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
								chrome.tabs.sendMessage(tabs[0].id, {
									todo: "searchComplex",
									showResult: true, saveResult: true,
									strataPlan: strataPlan, complexName: complexName
								});
							});
						}
					});
				});
				sendResponse(">>>complex search has been processed in eventpage: ");
			}

			if (request.todo == 'searchComplex') {
				var complexID = request._id;
				db.readComplex(complexID, function (complexInfo) {
					console.log('>>>read the complex info from database:', complexInfo);
					if (complexInfo && complexInfo.complexName.length > 0) {
						chrome.storage.sync.set(complexInfo, function () {
							console.log('complexInfo has been updated to storage for report listeners');
						});
					}
				});
			}

			if (request.todo == 'saveComplex') {
				var complexID = request._id;
				db.writeComplex(request);
			}

			if (request.todo == "saveTax") {

				console.log(">>>I got save tax info: ");
				var assess = request.taxData;
				db.writeAssess(assess);
				sendResponse(assess);
			}

			if (request.todo == "saveStrataPlanSummary") {

				console.log(">>>I got save Complex info: ");
				var spSummary = request.spSummaryData;
				db.writeStrataPlanSummary(spSummary);
				sendResponse(spSummary);
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
/* 1 */,
/* 2 */,
/* 3 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	//Create, Read, Write, Query Database

	var Database = function () {
		function Database() {
			_classCallCheck(this, Database);

			console.group('database constructor');
			this.dbAssess = new PouchDB('http://localhost:5984/bcassessment');
			this.dbComplex = new PouchDB('http://localhost:5984/complex');
			this.dbStrataPlanSummary = new PouchDB('http://localhost:5984/strataplansummary');
			this.dbShowing = new PouchDB('http://localhost:5984/showing');
			this.dbAssess.info().then(function (info) {
				console.log(info);
			});
			this.dbComplex.info().then(function (info) {
				console.log(info);
			});
			this.dbStrataPlanSummary.info().then(function (info) {
				console.log(info);
			});
			this.dbShowing.info().then(function (info) {
				console.log(info);
			});
			this.assess = null;
			this.complex = null;
			this.strataPlan = null;
			this.showing = null;
			console.groupEnd('database constructor');
		}

		_createClass(Database, [{
			key: 'readAssess',
			value: function readAssess(PID, callback) {
				console.group(">>>readAssess");
				var self = this;
				self.dbAssess.get(PID).then(function (doc) {
					var assess = self.assess = doc;
					console.log(">>>read the tax info in database is: ", assess);
					assess.from = 'assess' + Math.random().toFixed(8);
					chrome.storage.sync.set(
					// {
					// 	landValue: doc.landValue,
					// 	improvementValue: doc.improvementValue,
					// 	totalValue: doc.totalValue,
					// 	_id: doc._id,
					// 	from: 'assess' + Math.random().toFixed(8)
					// }
					assess);
					callback(self.assess);
				}).catch(function (err) {
					console.log(">>>read database error: ", err);
					self.assess = null;
					callback(self.assess);
				});
				console.groupEnd(">>>readAssess");
			}
		}, {
			key: 'writeAssess',
			value: function writeAssess(assess) {
				console.group('writeAssess');
				var PID = assess._id;
				var self = this;
				self.dbAssess.put(assess).then(function () {
					return self.dbAssess.get(PID);
				}).then(function (doc) {
					console.log(">>>bc assessment has been saved to db: ", doc);
				}).catch(function (err) {
					console.log(">>>save bc assessment error: ", err);
					self.dbAssess.get(PID).then(function (doc) {
						return self.dbAssess.remove(doc);
					}).catch(function (err) {
						console.log(">>>remove bc assess error: ", err);
					});
				});
				console.groupEnd('writeAssess');
			}
		}, {
			key: 'readStrataPlanSummary',
			value: function readStrataPlanSummary(strataPlan, callback) {
				console.group('readStrataPlanSummary');
				console.log(">>>this in Database is: ", this);
				var self = this;
				self.dbStrataPlanSummary.get(strataPlan).then(function (doc) {
					self.strataPlan = doc;
					console.log(">>>read the strataPlanSummary in database is: ", self.strataPlan);
					chrome.storage.sync.set({
						active: doc.active,
						sold: doc.sold,
						count: doc.count,
						searchDate: doc.searchDate,
						complex: doc.complex,
						strataPlan: doc._id,
						from: 'strataPlanSummary' + Math.random().toFixed(8)
					});
					callback(self.strataPlan);
				}).catch(function (err) {
					console.log(">>>read database strataPlanSummary error: ", err);
					self.strataPlan = null;
					callback(self.strataPlan);
				});
				console.groupEnd('readStrataPlanSummary');
			}
		}, {
			key: 'writeStrataPlanSummary',
			value: function writeStrataPlanSummary(strataplan) {
				console.group('writeStrataPlanSummary');
				var strataPlan = strataplan._id;
				var self = this;
				self.dbStrataPlanSummary.put(strataplan).then(function () {
					return self.dbStrataPlanSummary.get(strataPlan);
				}).then(function (doc) {
					console.log(">>>StrataPlan Summary has been saved to dbComplex: ", doc);
				}).catch(function (err) {
					console.log(">>>save StrataPlan Summary error: ", err);
					self.dbStrataPlanSummary.get(strataPlan).then(function (doc) {
						return self.dbStrataPlanSummary.remove(doc);
					}).catch(function (err) {
						console.log(">>>remove StrataPlan Summary error: ", err);
					});
				});
				console.groupEnd('writeStrataPlanSummary');
			}
		}, {
			key: 'readComplex',
			value: function readComplex(complexID, callback) {
				console.group(">>>readComplex");
				var self = this;
				self.dbComplex.get(complexID).then(function (doc) {
					self.complex = doc;
					console.log(">>>read the Complex info in database is: ", self.complex);
					chrome.storage.sync.set({
						complexID: doc._id,
						complexName: doc.name + '*',
						strataPlan: doc.strataPlan,
						addDate: doc.addDate,
						subArea: doc.subArea,
						neighborhood: doc.neighborhood,
						postcode: doc.postcode,
						streetName: doc.streetName,
						streetNumber: doc.streetNumber,
						dwellingType: doc.dwellingType,
						totalUnits: doc.totalUnits,
						devUnits: doc.devUnits,
						from: 'complex' + Math.random().toFixed(8)
					});
					callback(self.complex);
				}).catch(function (err) {
					console.log(">>>read database Complex error: ", err);
					self.complex = null;
					callback(self.complex);
				});
				console.groupEnd(">>>readComplex");
			}
		}, {
			key: 'writeComplex',
			value: function writeComplex(complex) {
				console.group('>>>writeComplex');
				var complexID = complex._id;
				var self = this;
				self.dbComplex.get(complexID).then(function (doc) {
					console.log('writeComplex...the complex EXISTS, pass writing');
				}).catch(function (err) {
					self.dbComplex.put(complex).then(function () {
						console.log('SAVED the complex info to database:', complex.name);
						return self.dbComplex.get(complexID);
					}).then(function (doc) {
						console.log(">>>Complex Info has been saved to dbComplex: ", doc);
					}).catch(function (err) {
						console.log(">>>save Complex info error: ", err);
					});
				});
				console.groupEnd('>>>writeComplex');
			}
		}, {
			key: 'readShowing',
			value: function readShowing(showingID, callback) {
				console.group(">>>readShowing");
				var self = this;
				self.dbShowing.get(showingID).then(function (doc) {
					self.showing = doc;
					console.log(">>>read the showing Info in database is: ", self.showing);
					chrome.storage.sync.set({
						showingID: doc._id,
						mlsNo: doc.mls,
						clientName: doc.clientName,
						requestMethod: doc.requestMethod,
						showingDate: doc.showingDate,
						showingTime: doc.showingTime,
						complexName: doc.name,
						strataPlan: doc.strataPlan,
						addDate: doc.addDate,
						subArea: doc.subArea,
						neighborhood: doc.neighborhood,
						postcode: doc.postcode,
						streetName: doc.streetName,
						streetNumber: doc.streetNumber,
						from: 'showing' + Math.random().toFixed(8)
					});
					callback(self.showing);
				}).catch(function (err) {
					console.log(">>>read database showing error: ", err);
					self.showing = null;
					callback(self.showing);
				});
				console.groupEnd(">>>readShowing");
			}
		}, {
			key: 'writeShowing',
			value: function writeShowing(showing) {
				var showingID = showing._id;
				var self = this;
				console.group('>>>writeShowing');
				self.dbShowing.get(showingID).then(function (doc) {
					console.log('writeShowing...the showing info EXISTS, pass writing!');
				}).catch(function (err) {

					self.dbShowing.put(showing).then(function () {
						console.log('SAVED the showing info to database:', showing.clientName);
						return self.dbShowing.get(showingID);
					}).then(function (doc) {
						console.log(">>>Showing Info has been saved to dbShowing: ", doc);
					}).catch(function (err) {
						console.log(">>>save showing info error: ", err);
					});
				});
				console.groupEnd('>>>writeShowing');
			}
		}]);

		return Database;
	}();

	exports.default = Database;

/***/ })
/******/ ]);