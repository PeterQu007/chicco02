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

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Person2 = __webpack_require__(1);

	var _Person3 = _interopRequireDefault(_Person2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	//import Pages from './modules/Pages';

	//console.log('Hello:', Pages.cgHomePage);

	var p = new _Person3.default("Peter", "red");

	var adult = function (_Person) {
		_inherits(adult, _Person);

		function adult() {
			_classCallCheck(this, adult);

			return _possibleConstructorReturn(this, (adult.__proto__ || Object.getPrototypeOf(adult)).apply(this, arguments));
		}

		_createClass(adult, [{
			key: "paytax",
			value: function paytax() {
				console.log("paid tax!");
			}
		}]);

		return adult;
	}(_Person3.default);

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	//ES5 syntax
	/*
	function Person(fullName, favColor){
		this.name = fullName;
		this.favoriteColor = favColor;
		this.greet=function(){
		console.log("hello object, my name is " + this.name + "and my color is " + this.favoriteColor);
	}

	}
	*/
	//import $ from 'jquery';

	//ES6 syntax
	var Person = function () {
		function Person(fullName, favColor) {
			_classCallCheck(this, Person);

			this.name = fullName;
			this.favoriteColor = favColor;
			this.checkbox = $('input[type=checkbox]');
			this.events();
		}

		_createClass(Person, [{
			key: 'events',
			value: function events() {
				//var self = this;
				//self.checkbox.on("click",console.log("hello checkbox!"));

				$('input[type="checkbox"]').change(function () {
					var id = $(this).attr('id');
					var something = $(this).attr('data-something');
					var value = $(this).val();
					if ($(this).prop('checked')) {
						// do something
						alert('id:' + id + ' something:' + something + ' value:' + value);
					}
				});
			}
		}, {
			key: 'greet',
			value: function greet() {
				console.log("hello object, my name is " + this.name + "and my color is " + this.favoriteColor);
			}
		}]);

		return Person;
	}();

	module.exports = Person;

/***/ })
/******/ ]);