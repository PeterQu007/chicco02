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

	var _Database = __webpack_require__(1);

	var _Database2 = _interopRequireDefault(_Database);

	var _util = __webpack_require__(2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	//background script, event mode
	//message passed between background - defaultpage - iframes

	var db = new _Database2.default();
	var $fx = L$();
	var newTaxYear = false;
	var d = new Date();
	var taxYear = d.getFullYear();
	taxYear = newTaxYear ? taxYear : taxYear - 1;
	var complexInfoSearchResult = null;

	console.clear();

	(function () {

		//console.log("Hello!-1");

		chrome.storage.sync.set({ landValue: 0, improvementValue: 0, totalValue: 0, curTabID: null, taxYear: taxYear });

		chrome.browserAction.onClicked.addListener(function (activeTab) {

			//open a link
			var newURL = "http://idp.gvfv.clareitysecurity.net/idp/Authn/UserPassword";
			//var newURL = "http://stackoverflow.com/"
			chrome.tabs.create({ url: newURL });
		});

		chrome.webNavigation.onCompleted.addListener(function (details) {
			//console.log("Completed!");
			//alert("Completed!");

		}, {
			url: [{ hostContains: '.paragonrels.com' }]
		});

		//receive message from iframes, then transfer the message to Main Page content script
		chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

			//console.log("onMessage.eventPage got a message", request);

			//message from Warning iframe
			if (request.todo == "warningMessage") {

				//console.log("I got the warning message!");
				//pass the message to defaultpage(Main Home Page)
				chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
					chrome.tabs.sendMessage(tabs[0].id, { todo: "ignoreWarning" });
				});
			}

			//message from Logout iframe
			if (request.todo == "logoutMessage") {

				//console.log("I got logout message!");
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
				//console.log(">>>I got tax search command!");
				try {
					chrome.storage.sync.get('PID', function (result) {
						//check database, if assess exist, send it back
						//console.log(">>>PID is: ", result.PID);
						var taxID = result.PID + '-' + taxYear;
						var requester = request.from;
						db.readAssess(taxID, function (assess) {
							//console.log(">>>read from , assess is: ", assess)
							if (!assess) {
								//other wise , send out tax research command:
								chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
									chrome.tabs.sendMessage(tabs[0].id, { todo: "taxSearchFor" + requester });
								});
							} else {
								if (String(assess.from).indexOf("taxSearchFor" + requester) < 0) {
									assess.from = assess.from + "-taxSearchFor" + requester;
								}
								chrome.storage.sync.set(assess);
							}
						});
					});
					sendResponse(">>>tax search has been processed in EventPage: ");
				} catch (err) {
					sendResponse(">>>tax search gets errors in EventPage: ");
				}
			}

			if (request.todo == "searchStrataPlanSummary") {
				//get request to search tax info of Property with PID saved to storage
				//console.log(">>>I got search StrataPlanSummary command!");

				chrome.storage.sync.get(['strataPlan', 'complexName'], function (result) {
					//check database, if assess exist, send it back
					//console.log(">>>strataPlan is: ", result.strataPlan);
					var strataPlan = result.strataPlan;
					var complexName = result.complexName;
					if (!strataPlan || strataPlan == 'PLAN' || strataPlan == 'PL') {
						return;
					};
					var today = $fx.getToday();
					db.readStrataPlanSummary(strataPlan + '-' + today, function (strataPlanSummaryToday) {
						//console.log(">>>read from , strataPlanSummary is: ", strataPlanSummaryToday)
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
				var requestFrom = request.from;
				delete request.from;
				var complexInfo = request;

				db.readComplex(complexInfo, function (cInfo) {
					//console.log('>>>read the complex info from database:', complexInfo);
					if (cInfo && cInfo.name.length > 0) {
						cInfo.from += '-' + requestFrom;
						cInfo.complexName = cInfo.name;
						chrome.storage.sync.set(cInfo, function () {
							console.log('complexInfo is: ', cInfo);
						});
						/////////////////////////////////////
						// if(requestFrom != "spreadSheetCompletion"){
						// 	chrome.storage.sync.set(cInfo, function(){
						// 		//console.log('complexInfo has been updated to storage for report listeners');
						// 	})
						// }else{
						// 	complexInfoSearchResult = Object.assign({ }, cInfo) ;
						// }
						/////////////////////////////////////////
					} else {
							//error for complexInfo
						}
				});
				//sendResponse(complexInfoSearchResult);
			}

			if (request.todo == 'saveComplex') {
				var complexID = request._id;
				db.writeComplex(request);
			}

			if (request.todo == "saveTax") {

				//console.log(">>>I got save tax info: ");
				var assess = request.taxData;
				assess._id = assess.PID + '-' + taxYear;
				db.writeAssess(assess);
				sendResponse(assess);
			}

			if (request.todo == "saveStrataPlanSummary") {

				//console.log(">>>I got save Complex info: ");
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

			if (request.todo == "syncTabToContent") {
				console.log("New Command: syncTabToContent");

				chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
					chrome.tabs.sendMessage(tabs[0].id, { todo: "syncTabToContent" });
				});
			}

			if (request.todo == "hideQuickSearch") {
				console.log("New Command: showQuickSearch");

				chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
					chrome.tabs.sendMessage(tabs[0].id, { todo: "hideQuickSearch", tabID: request.tabID });
				});
			}

			if (request.todo == "getTabTitle") {
				console.log("Command: ", request.todo, request.from);
				var result = null;
				chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
					chrome.tabs.sendMessage(tabs[0].id, { todo: "getTabTitle", tabID: request.tabID }, function (response) {
						result = response;
						console.log("getTabTitle response:", response);
						chrome.storage.sync.set({ getTabID: result.tabID,
							getTabTitle: result.tabTitle,
							todo: 'getTabTitle' + Math.random().toFixed(8),
							from: 'EventPage.getTabTitle' });
						sendResponse(response);
					});
				});
				//check(result); //wait for 1 sec, stop eventPage hit the exit point, send out null response
			}

			if (request.todo == "addLock") {
				//get command from sub content script to add lock to the sub content panel
				console.log("Command: ", request.todo, request.from, request.tabID);
				var _result = null;
				chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
					chrome.tabs.sendMessage(tabs[0].id, { todo: "addLock", tabID: request.tabID }, function (response) {
						_result = response;
						console.log("addLock response:", response);
						// chrome.storage.sync.set(
						// 	{getTabID:result.tabID, 
						// 	getTabTitle:result.tabTitle,
						// 	todo: 'getTabTitle'+Math.random().toFixed(8),
						// 	from: 'EventPage.getTabTitle'});
						sendResponse(response);
					});
				});
			}
		});

		//End of Main Function
	})();

/***/ }),
/* 1 */
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

			//console.group('database constructor');
			this.dbAssess = new PouchDB('http://localhost:5984/bcassessment');
			this.dbComplex = new PouchDB('http://localhost:5984/complex');
			this.dbStrataPlanSummary = new PouchDB('http://localhost:5984/strataplansummary');
			this.dbShowing = new PouchDB('http://localhost:5984/showing');
			this.dbAssess.info().then(function (info) {
				//console.log(info);
			});
			this.dbComplex.info().then(function (info) {
				//console.log(info);
			});
			this.dbStrataPlanSummary.info().then(function (info) {
				//console.log(info);
			});
			this.dbShowing.info().then(function (info) {
				//console.log(info);
			});
			this.assess = null;
			this.complex = null;
			this.strataPlan = null;
			this.showing = null;
			//console.groupEnd('database constructor');
		}

		_createClass(Database, [{
			key: 'readAssess',
			value: function readAssess(taxID, callback) {
				//console.group(">>>readAssess");
				var self = this;
				self.dbAssess.get(taxID).then(function (doc) {
					var assess = self.assess = doc;
					//console.log(">>>read the tax info in database is: ", assess);
					assess.from = 'assess-' + Math.random().toFixed(8);
					assess.dataFromDB = true;
					// chrome.storage.sync.set(
					// 	// {
					// 	// 	landValue: doc.landValue,
					// 	// 	improvementValue: doc.improvementValue,
					// 	// 	totalValue: doc.totalValue,
					// 	// 	_id: doc._id,
					// 	// 	from: 'assess' + Math.random().toFixed(8)
					// 	// }
					// 	assess
					// );
					callback(self.assess);
				}).catch(function (err) {
					//console.log(">>>read database error: ", err);
					self.assess = null;
					callback(self.assess);
				});
				//console.groupEnd(">>>readAssess");
			}
		}, {
			key: 'writeAssess',
			value: function writeAssess(assess) {
				//console.group('writeAssess');
				var taxID = assess._id;
				var self = this;
				assess.dataFromDB = true;
				self.dbAssess.put(assess).then(function () {
					return self.dbAssess.get(taxID);
				}).then(function (doc) {
					//console.log(">>>bc assessment has been saved to db: ", doc);
				}).catch(function (err) {
					//console.log(">>>save bc assessment error: ", err);
					self.dbAssess.get(taxID).then(function (doc) {
						return self.dbAssess.remove(doc);
					}).catch(function (err) {
						//console.log(">>>remove bc assess error: ", err);
					});
				});
				//console.groupEnd('writeAssess');
			}
		}, {
			key: 'readStrataPlanSummary',
			value: function readStrataPlanSummary(strataPlan, callback) {
				//console.group('readStrataPlanSummary');
				//console.log(">>>this in Database is: ", this);
				var self = this;
				self.dbStrataPlanSummary.get(strataPlan).then(function (doc) {
					self.strataPlan = doc;
					//console.log(">>>read the strataPlanSummary in database is: ", self.strataPlan);
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
					//console.log(">>>read database strataPlanSummary error: ", err);
					self.strataPlan = null;
					callback(self.strataPlan);
				});
				//console.groupEnd('readStrataPlanSummary');
			}
		}, {
			key: 'writeStrataPlanSummary',
			value: function writeStrataPlanSummary(strataplan) {
				//console.group('writeStrataPlanSummary');
				var strataPlan = strataplan._id;
				var self = this;
				self.dbStrataPlanSummary.put(strataplan).then(function () {
					return self.dbStrataPlanSummary.get(strataPlan);
				}).then(function (doc) {
					//console.log(">>>StrataPlan Summary has been saved to dbComplex: ", doc);
				}).catch(function (err) {
					//console.log(">>>save StrataPlan Summary error: ", err);
					self.dbStrataPlanSummary.get(strataPlan).then(function (doc) {
						return self.dbStrataPlanSummary.remove(doc);
					}).catch(function (err) {
						//console.log(">>>remove StrataPlan Summary error: ", err);
					});
				});
				//console.groupEnd('writeStrataPlanSummary');
			}
		}, {
			key: 'readComplex',
			value: function readComplex(complexInfo, callback) {
				//console.group(">>>readComplex");
				var self = this;
				self.complex = complexInfo;

				self.dbComplex.get(complexInfo._id, function (err, doc) {
					if (err) {
						self.writeComplex(self.complex);
						self.complex.from = 'complex-saved to db-' + Math.random().toFixed(8);;
						callback(self.complex);
					} else {
						self.complex = doc;
						self.complex.from = 'complex' + Math.random().toFixed(8);
						callback(self.complex);
					}
				});

				// self.dbComplex.get(complexInfo._id).then(function (doc) {
				// 	self.complex = doc;
				// 	//console.log(">>>read the Complex info in database is: ", self.complex);
				// 	// chrome.storage.sync.set({
				// 	// 	complexID: doc._id,
				// 	// 	complexName: doc.name+'*',
				// 	// 	strataPlan: doc.strataPlan,
				// 	// 	addDate: doc.addDate,
				// 	// 	subArea: doc.subArea,
				// 	// 	neighborhood: doc.neighborhood,
				// 	// 	postcode: doc.postcode,
				// 	// 	streetName: doc.streetName,
				// 	// 	streetNumber: doc.streetNumber,
				// 	// 	dwellingType: doc.dwellingType,
				// 	// 	totalUnits: doc.totalUnits,
				// 	// 	devUnits: doc.devUnits,
				// 	// 	from: 'complex' + Math.random().toFixed(8)
				// 	// });
				// 	self.complex.from = 'complex' + Math.random().toFixed(8);
				// 	callback(self.complex);
				// }).catch(function (err) {
				// 	//console.log(">>>read database Complex error: ", err);
				// 	//self.complex = null;
				// 	self.writeComplex(self.complex);
				// 	self.complex.from = 'complex-saved to db-' + Math.random().toFixed(8);;
				// 	callback(self.complex);
				// })
				// //console.groupEnd(">>>readComplex");
			}
		}, {
			key: 'writeComplex',
			value: function writeComplex(complex) {
				//console.group('>>>writeComplex');
				var complexID = complex._id;
				var self = this;
				var complexName = complex.name;
				self.dbComplex.get(complexID).then(function (doc) {
					//console.log('writeComplex...the complex EXISTS, pass writing');
					doc['name'] = complexName;
					self.dbComplex.put(doc);
					return [doc, 'complex updated!'];
				}).catch(function (err) {
					self.dbComplex.put(complex).then(function () {
						//console.log('SAVED the complex info to database:', complex.name);
						return self.dbComplex.get(complexID);
					}).then(function (doc) {
						//console.log(">>>Complex Info has been saved to dbComplex: ", doc);
					}).catch(function (err) {
						//console.log(">>>save Complex info error: ", err);
					});
				});
				//console.groupEnd('>>>writeComplex');
			}
		}, {
			key: 'readShowing',
			value: function readShowing(showingID, callback) {
				//console.group(">>>readShowing");
				var self = this;
				self.dbShowing.get(showingID).then(function (doc) {
					self.showing = doc;
					//console.log(">>>read the showing Info in database is: ", self.showing);
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
					//console.log(">>>read database showing error: ", err);
					self.showing = null;
					callback(self.showing);
				});
				//console.groupEnd(">>>readShowing");
			}
		}, {
			key: 'writeShowing',
			value: function writeShowing(showing) {
				var showingID = showing._id;
				var self = this;
				//console.group('>>>writeShowing');
				self.dbShowing.get(showingID).then(function (doc) {
					//console.log('writeShowing...the showing info EXISTS, pass writing!');
				}).catch(function (err) {

					self.dbShowing.put(showing).then(function () {
						//console.log('SAVED the showing info to database:', showing.clientName);
						return self.dbShowing.get(showingID);
					}).then(function (doc) {
						//console.log(">>>Showing Info has been saved to dbShowing: ", doc);
					}).catch(function (err) {
						//console.log(">>>save showing info error: ", err);
					});
				});
				//console.groupEnd('>>>writeShowing');
			}
		}]);

		return Database;
	}();

	exports.default = Database;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	var formatRegExp = /%[sdj%]/g;
	exports.format = function(f) {
	  if (!isString(f)) {
	    var objects = [];
	    for (var i = 0; i < arguments.length; i++) {
	      objects.push(inspect(arguments[i]));
	    }
	    return objects.join(' ');
	  }

	  var i = 1;
	  var args = arguments;
	  var len = args.length;
	  var str = String(f).replace(formatRegExp, function(x) {
	    if (x === '%%') return '%';
	    if (i >= len) return x;
	    switch (x) {
	      case '%s': return String(args[i++]);
	      case '%d': return Number(args[i++]);
	      case '%j':
	        try {
	          return JSON.stringify(args[i++]);
	        } catch (_) {
	          return '[Circular]';
	        }
	      default:
	        return x;
	    }
	  });
	  for (var x = args[i]; i < len; x = args[++i]) {
	    if (isNull(x) || !isObject(x)) {
	      str += ' ' + x;
	    } else {
	      str += ' ' + inspect(x);
	    }
	  }
	  return str;
	};


	// Mark that a method should not be used.
	// Returns a modified function which warns once by default.
	// If --no-deprecation is set, then it is a no-op.
	exports.deprecate = function(fn, msg) {
	  // Allow for deprecating things in the process of starting up.
	  if (isUndefined(global.process)) {
	    return function() {
	      return exports.deprecate(fn, msg).apply(this, arguments);
	    };
	  }

	  if (process.noDeprecation === true) {
	    return fn;
	  }

	  var warned = false;
	  function deprecated() {
	    if (!warned) {
	      if (process.throwDeprecation) {
	        throw new Error(msg);
	      } else if (process.traceDeprecation) {
	        console.trace(msg);
	      } else {
	        console.error(msg);
	      }
	      warned = true;
	    }
	    return fn.apply(this, arguments);
	  }

	  return deprecated;
	};


	var debugs = {};
	var debugEnviron;
	exports.debuglog = function(set) {
	  if (isUndefined(debugEnviron))
	    debugEnviron = process.env.NODE_DEBUG || '';
	  set = set.toUpperCase();
	  if (!debugs[set]) {
	    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
	      var pid = process.pid;
	      debugs[set] = function() {
	        var msg = exports.format.apply(exports, arguments);
	        console.error('%s %d: %s', set, pid, msg);
	      };
	    } else {
	      debugs[set] = function() {};
	    }
	  }
	  return debugs[set];
	};


	/**
	 * Echos the value of a value. Trys to print the value out
	 * in the best way possible given the different types.
	 *
	 * @param {Object} obj The object to print out.
	 * @param {Object} opts Optional options object that alters the output.
	 */
	/* legacy: obj, showHidden, depth, colors*/
	function inspect(obj, opts) {
	  // default options
	  var ctx = {
	    seen: [],
	    stylize: stylizeNoColor
	  };
	  // legacy...
	  if (arguments.length >= 3) ctx.depth = arguments[2];
	  if (arguments.length >= 4) ctx.colors = arguments[3];
	  if (isBoolean(opts)) {
	    // legacy...
	    ctx.showHidden = opts;
	  } else if (opts) {
	    // got an "options" object
	    exports._extend(ctx, opts);
	  }
	  // set default options
	  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
	  if (isUndefined(ctx.depth)) ctx.depth = 2;
	  if (isUndefined(ctx.colors)) ctx.colors = false;
	  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
	  if (ctx.colors) ctx.stylize = stylizeWithColor;
	  return formatValue(ctx, obj, ctx.depth);
	}
	exports.inspect = inspect;


	// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
	inspect.colors = {
	  'bold' : [1, 22],
	  'italic' : [3, 23],
	  'underline' : [4, 24],
	  'inverse' : [7, 27],
	  'white' : [37, 39],
	  'grey' : [90, 39],
	  'black' : [30, 39],
	  'blue' : [34, 39],
	  'cyan' : [36, 39],
	  'green' : [32, 39],
	  'magenta' : [35, 39],
	  'red' : [31, 39],
	  'yellow' : [33, 39]
	};

	// Don't use 'blue' not visible on cmd.exe
	inspect.styles = {
	  'special': 'cyan',
	  'number': 'yellow',
	  'boolean': 'yellow',
	  'undefined': 'grey',
	  'null': 'bold',
	  'string': 'green',
	  'date': 'magenta',
	  // "name": intentionally not styling
	  'regexp': 'red'
	};


	function stylizeWithColor(str, styleType) {
	  var style = inspect.styles[styleType];

	  if (style) {
	    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
	           '\u001b[' + inspect.colors[style][1] + 'm';
	  } else {
	    return str;
	  }
	}


	function stylizeNoColor(str, styleType) {
	  return str;
	}


	function arrayToHash(array) {
	  var hash = {};

	  array.forEach(function(val, idx) {
	    hash[val] = true;
	  });

	  return hash;
	}


	function formatValue(ctx, value, recurseTimes) {
	  // Provide a hook for user-specified inspect functions.
	  // Check that value is an object with an inspect function on it
	  if (ctx.customInspect &&
	      value &&
	      isFunction(value.inspect) &&
	      // Filter out the util module, it's inspect function is special
	      value.inspect !== exports.inspect &&
	      // Also filter out any prototype objects using the circular check.
	      !(value.constructor && value.constructor.prototype === value)) {
	    var ret = value.inspect(recurseTimes, ctx);
	    if (!isString(ret)) {
	      ret = formatValue(ctx, ret, recurseTimes);
	    }
	    return ret;
	  }

	  // Primitive types cannot have properties
	  var primitive = formatPrimitive(ctx, value);
	  if (primitive) {
	    return primitive;
	  }

	  // Look up the keys of the object.
	  var keys = Object.keys(value);
	  var visibleKeys = arrayToHash(keys);

	  if (ctx.showHidden) {
	    keys = Object.getOwnPropertyNames(value);
	  }

	  // IE doesn't make error fields non-enumerable
	  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
	  if (isError(value)
	      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
	    return formatError(value);
	  }

	  // Some type of object without properties can be shortcutted.
	  if (keys.length === 0) {
	    if (isFunction(value)) {
	      var name = value.name ? ': ' + value.name : '';
	      return ctx.stylize('[Function' + name + ']', 'special');
	    }
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    }
	    if (isDate(value)) {
	      return ctx.stylize(Date.prototype.toString.call(value), 'date');
	    }
	    if (isError(value)) {
	      return formatError(value);
	    }
	  }

	  var base = '', array = false, braces = ['{', '}'];

	  // Make Array say that they are Array
	  if (isArray(value)) {
	    array = true;
	    braces = ['[', ']'];
	  }

	  // Make functions say that they are functions
	  if (isFunction(value)) {
	    var n = value.name ? ': ' + value.name : '';
	    base = ' [Function' + n + ']';
	  }

	  // Make RegExps say that they are RegExps
	  if (isRegExp(value)) {
	    base = ' ' + RegExp.prototype.toString.call(value);
	  }

	  // Make dates with properties first say the date
	  if (isDate(value)) {
	    base = ' ' + Date.prototype.toUTCString.call(value);
	  }

	  // Make error with message first say the error
	  if (isError(value)) {
	    base = ' ' + formatError(value);
	  }

	  if (keys.length === 0 && (!array || value.length == 0)) {
	    return braces[0] + base + braces[1];
	  }

	  if (recurseTimes < 0) {
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    } else {
	      return ctx.stylize('[Object]', 'special');
	    }
	  }

	  ctx.seen.push(value);

	  var output;
	  if (array) {
	    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
	  } else {
	    output = keys.map(function(key) {
	      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
	    });
	  }

	  ctx.seen.pop();

	  return reduceToSingleString(output, base, braces);
	}


	function formatPrimitive(ctx, value) {
	  if (isUndefined(value))
	    return ctx.stylize('undefined', 'undefined');
	  if (isString(value)) {
	    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
	                                             .replace(/'/g, "\\'")
	                                             .replace(/\\"/g, '"') + '\'';
	    return ctx.stylize(simple, 'string');
	  }
	  if (isNumber(value))
	    return ctx.stylize('' + value, 'number');
	  if (isBoolean(value))
	    return ctx.stylize('' + value, 'boolean');
	  // For some reason typeof null is "object", so special case here.
	  if (isNull(value))
	    return ctx.stylize('null', 'null');
	}


	function formatError(value) {
	  return '[' + Error.prototype.toString.call(value) + ']';
	}


	function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
	  var output = [];
	  for (var i = 0, l = value.length; i < l; ++i) {
	    if (hasOwnProperty(value, String(i))) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          String(i), true));
	    } else {
	      output.push('');
	    }
	  }
	  keys.forEach(function(key) {
	    if (!key.match(/^\d+$/)) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          key, true));
	    }
	  });
	  return output;
	}


	function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
	  var name, str, desc;
	  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
	  if (desc.get) {
	    if (desc.set) {
	      str = ctx.stylize('[Getter/Setter]', 'special');
	    } else {
	      str = ctx.stylize('[Getter]', 'special');
	    }
	  } else {
	    if (desc.set) {
	      str = ctx.stylize('[Setter]', 'special');
	    }
	  }
	  if (!hasOwnProperty(visibleKeys, key)) {
	    name = '[' + key + ']';
	  }
	  if (!str) {
	    if (ctx.seen.indexOf(desc.value) < 0) {
	      if (isNull(recurseTimes)) {
	        str = formatValue(ctx, desc.value, null);
	      } else {
	        str = formatValue(ctx, desc.value, recurseTimes - 1);
	      }
	      if (str.indexOf('\n') > -1) {
	        if (array) {
	          str = str.split('\n').map(function(line) {
	            return '  ' + line;
	          }).join('\n').substr(2);
	        } else {
	          str = '\n' + str.split('\n').map(function(line) {
	            return '   ' + line;
	          }).join('\n');
	        }
	      }
	    } else {
	      str = ctx.stylize('[Circular]', 'special');
	    }
	  }
	  if (isUndefined(name)) {
	    if (array && key.match(/^\d+$/)) {
	      return str;
	    }
	    name = JSON.stringify('' + key);
	    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
	      name = name.substr(1, name.length - 2);
	      name = ctx.stylize(name, 'name');
	    } else {
	      name = name.replace(/'/g, "\\'")
	                 .replace(/\\"/g, '"')
	                 .replace(/(^"|"$)/g, "'");
	      name = ctx.stylize(name, 'string');
	    }
	  }

	  return name + ': ' + str;
	}


	function reduceToSingleString(output, base, braces) {
	  var numLinesEst = 0;
	  var length = output.reduce(function(prev, cur) {
	    numLinesEst++;
	    if (cur.indexOf('\n') >= 0) numLinesEst++;
	    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
	  }, 0);

	  if (length > 60) {
	    return braces[0] +
	           (base === '' ? '' : base + '\n ') +
	           ' ' +
	           output.join(',\n  ') +
	           ' ' +
	           braces[1];
	  }

	  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
	}


	// NOTE: These type checking functions intentionally don't use `instanceof`
	// because it is fragile and can be easily faked with `Object.create()`.
	function isArray(ar) {
	  return Array.isArray(ar);
	}
	exports.isArray = isArray;

	function isBoolean(arg) {
	  return typeof arg === 'boolean';
	}
	exports.isBoolean = isBoolean;

	function isNull(arg) {
	  return arg === null;
	}
	exports.isNull = isNull;

	function isNullOrUndefined(arg) {
	  return arg == null;
	}
	exports.isNullOrUndefined = isNullOrUndefined;

	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	exports.isNumber = isNumber;

	function isString(arg) {
	  return typeof arg === 'string';
	}
	exports.isString = isString;

	function isSymbol(arg) {
	  return typeof arg === 'symbol';
	}
	exports.isSymbol = isSymbol;

	function isUndefined(arg) {
	  return arg === void 0;
	}
	exports.isUndefined = isUndefined;

	function isRegExp(re) {
	  return isObject(re) && objectToString(re) === '[object RegExp]';
	}
	exports.isRegExp = isRegExp;

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}
	exports.isObject = isObject;

	function isDate(d) {
	  return isObject(d) && objectToString(d) === '[object Date]';
	}
	exports.isDate = isDate;

	function isError(e) {
	  return isObject(e) &&
	      (objectToString(e) === '[object Error]' || e instanceof Error);
	}
	exports.isError = isError;

	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	exports.isFunction = isFunction;

	function isPrimitive(arg) {
	  return arg === null ||
	         typeof arg === 'boolean' ||
	         typeof arg === 'number' ||
	         typeof arg === 'string' ||
	         typeof arg === 'symbol' ||  // ES6 symbol
	         typeof arg === 'undefined';
	}
	exports.isPrimitive = isPrimitive;

	exports.isBuffer = __webpack_require__(4);

	function objectToString(o) {
	  return Object.prototype.toString.call(o);
	}


	function pad(n) {
	  return n < 10 ? '0' + n.toString(10) : n.toString(10);
	}


	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
	              'Oct', 'Nov', 'Dec'];

	// 26 Feb 16:19:34
	function timestamp() {
	  var d = new Date();
	  var time = [pad(d.getHours()),
	              pad(d.getMinutes()),
	              pad(d.getSeconds())].join(':');
	  return [d.getDate(), months[d.getMonth()], time].join(' ');
	}


	// log is just a thin wrapper to console.log that prepends a timestamp
	exports.log = function() {
	  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
	};


	/**
	 * Inherit the prototype methods from one constructor into another.
	 *
	 * The Function.prototype.inherits from lang.js rewritten as a standalone
	 * function (not on Function.prototype). NOTE: If this file is to be loaded
	 * during bootstrapping this function needs to be rewritten using some native
	 * functions as prototype setup using normal JavaScript does not work as
	 * expected during bootstrapping (see mirror.js in r114903).
	 *
	 * @param {function} ctor Constructor function which needs to inherit the
	 *     prototype.
	 * @param {function} superCtor Constructor function to inherit prototype from.
	 */
	exports.inherits = __webpack_require__(5);

	exports._extend = function(origin, add) {
	  // Don't do anything if add isn't an object
	  if (!add || !isObject(add)) return origin;

	  var keys = Object.keys(add);
	  var i = keys.length;
	  while (i--) {
	    origin[keys[i]] = add[keys[i]];
	  }
	  return origin;
	};

	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(3)))

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	process.prependListener = noop;
	process.prependOnceListener = noop;

	process.listeners = function (name) { return [] }

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ }),
/* 4 */
/***/ (function(module, exports) {

	module.exports = function isBuffer(arg) {
	  return arg && typeof arg === 'object'
	    && typeof arg.copy === 'function'
	    && typeof arg.fill === 'function'
	    && typeof arg.readUInt8 === 'function';
	}

/***/ }),
/* 5 */
/***/ (function(module, exports) {

	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    var TempCtor = function () {}
	    TempCtor.prototype = superCtor.prototype
	    ctor.prototype = new TempCtor()
	    ctor.prototype.constructor = ctor
	  }
	}


/***/ })
/******/ ]);