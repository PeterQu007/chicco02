//Auto Login Page
//

import Login from '../assets/scripts/modules/Login';

var loginCL = new Login(console,0);

loginCL.submit();

//loginCL.submit();

// (function(log){

//     //var newURL = "https://accounts.craigslist.org/login?lang=en&cc=us&rt=L&rp=%2Flogin%2Fhome%3Flang%3Den%26cc%3Dus";

//     var countTimer = setInterval (checkComplete, 100);

//     var _$ = log;

//     .log("I am in Content login.js now! ");

//     function checkComplete(){

//     	_$("complete run!");
//     	_$(document.querySelector('button.accountform-btn'));


//         if (document.querySelector('button.accountform-btn')){

//         	_$(document.getElementById('inputEmailHandle').value);
//             clearInterval (countTimer);
//             document.getElementById('inputEmailHandle').value="peterqu007@gmail.com";
//             document.getElementById('inputPassword').value="inform69";
//             document.forms[0].submit();
//         }
//     };

//     // setTimeout(function(){
//     // 	document.forms[0].submit();
//     // }, 3000)
    

// }(console ? console : function(){}));