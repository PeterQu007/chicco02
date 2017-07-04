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

	// (function() {

	//     // just place a div at top right
	// 	var div = document.createElement('div');
	// 	div.style.position = 'fixed';
	// 	div.style.top = 0;
	// 	div.style.right = 0;
	// 	div.textContent = 'Injected!';
	// 	document.body.appendChild(div);

	//     //var script = document.createElement('script');
	//     //script.src = "http://pidrealty.ca/assets/scripts/test.js"
	//     //document.body.appendChild(script);

	//      var countTimer = setInterval (checkComplete, 100);

	//         function checkComplete () {


	//             if (document.querySelector('#loginbtn')){

	//                 clearInterval (countTimer);

	//                 $(function(){

	//                     var name =$("#j_username");
	//                     var pswhidden = $("#j_password");
	//                     var psw = $("#password");
	//                     var btn = $("#loginbtn");

	//                     console.log(btn);

	//                     name.focus().val("V70898").blur();
	//                     psw.css("color","black");
	//                     psw.focus().val("escape89").blur();
	//                     pswhidden.val("escape89").blur();

	//                     btn.click();

	//                 })
	//             }


	//         }

	//  //    $(function(){

	//  //        var name =$("#j_username");
	//  //        var pswhidden = $("#j_password");
	//  //        var psw = $("#password");
	//  //        var btn = $("#loginbtn");

	//  //        name.val("V70898");
	//  //        psw.css("color","white");
	//  //        psw.val("escape89");
	//  //        pswhidden.val("escape89");

	//  //    //btn.click();

	// 	// })

	//     // function onPageLoad(event){
	//     //     alert("Page loaded");
	//     // }

	//     // document.addEventListener("DOMContentLoaded",onPageLoad,true);

	// 	//alert('inserted self... giggity, thanks!');


	// })();

	(function () {

	    var countTimer = setInterval(checkComplete, 100);

	    function checkComplete() {

	        console.log("auto login to server:");

	        if (document.querySelector('#loginbtn')) {

	            clearInterval(countTimer);
	            document.getElementById('j_password').value = "escape90";
	            document.getElementById('j_username').value = "v70898";
	            document.forms["loginform"].submit();
	        }
	    }
	})();

/***/ })
/******/ ]);