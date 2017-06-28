/*global document, window, alert, console, require*/

// get the url to see if it is on qa for the QA checker dialog
var url = document.location.href;
var isOnQA = false;
var alertMe = false; // run the qaDialog if error found, this is used to alert the qa user the site is not setup right
if ((url.indexOf("idp.chris") > -1 || url.indexOf("idp.qa") > -1)) {
    isOnQA = true;
    var debugit = true; // set to false to hide console
}

//oh the joy of IE8
var ie8 = false;
function isIE() { // is this IE
    var myNav = navigator.userAgent.toLowerCase();
    return (myNav.indexOf('msie') !== -1) ? parseInt(myNav.split('msie')[1]) : false;
}
if (isIE() && isIE() < 9) {var ie8 = true; } /* ie8 colsole log fix */

//core
var requiredKd = "2.2"; // this is what version of madKD file needed to run this
var idpurl = "/idp";
var cdnUrl = "https://cdn.clareitysecurity.net";
var jQueryUiUrl = cdnUrl + "/js/jquery-ui.min.js";
var jQueryUiCssUrl = cdnUrl + "/css/jquery-ui.min.css";
var ie8CssUrl = cdnUrl + "/css/ie.css";
var inputs = "input[type='text'], input[type='password']";
var pleasewait = "Please Wait";
var loginTypeVal = 'not found';
var loginTypeMsg = '<p>Login Type: ' + loginTypeVal + '</p>';
var failureMsgId = '';
var failMsg = '';
var logincssMsg = '';
var logoMsg = '';
var loginbtnMsg = '';
var loginXkdMsg = '';
var loginformMsg = '';

var warnalert = '';


 // the attr on this include link, this is used in the function below to turn on and off functions
if (document.getElementById('loginxkdjs') === null) {
    loginXkdMsg = '<p class="red">loginXkd: Error $("#loginxkdjs") not found</p>';
    alertMe = true;
} else {
    var loginXkdId = $('#loginxkdjs'); /* this is the ID this script include should have*/
    var loginXkdUrl = loginXkdId.attr('src'); /* used to check cdn*/
    var oldbrowserWarnData = loginXkdId.attr('data-old-browser-warn'); //  default on - set to turn off
    var oldbrowserUrlData = loginXkdId.attr('data-old-browser-url'); //  default off - set the url to turn on /idp/outdated-browser.jsp
    var setFocus = loginXkdId.attr('data-setfocus'); // default on add to turn off
    var inputAutoData = loginXkdId.attr('data-autocomplete'); /* default off - add to turn on */
    var disablePageData = loginXkdId.attr('data-disable-page');  /* default on - add to turn off */
    var backSpaceClearData = loginXkdId.attr('data-backspace-clear');  /* default on - add to turn off */
    var savePwdData = loginXkdId.attr('data-save-pwd');  /* default on - add to turn off */
    var fakeSafariPwdData = loginXkdId.attr('data-fake-safari-pwd'); /* default on add to remove */
    var fontIconsData = loginXkdId.attr('data-fontawesome');  /* default on - add data-fontawesome='false' to turn off */
    var redirectUrlData = loginXkdId.attr('data-redirect-url'); /* default /idp/noauthn.jsp */
    var idpTimeoutData = loginXkdId.attr('data-idp-session-timout'); /* default 285 or 4 mins 45 sec mins */
    var secondsLeftData = loginXkdId.attr('data-warn-secs'); /* default 20 */
    var sessionWarnData = loginXkdId.attr('data-session-warn');
    var loadingData = loginXkdId.attr('data-loading');
    var collectorIcon = loginXkdId.attr('data-collector-icon'); // this is to turn on or off the silver lock icon
    var kdIconData = loginXkdId.attr('data-kd-icon'); // this is to turn on or off the gold lock icon
}

/* this is to check for older IE */
var oldie = false;
if (typeof oldbrowserWarnData === "undefined") { oldie = true; }
if (typeof oldbrowserUrlData !== "undefined") { window.location = oldbrowserUrlData; } // used if ie8 and redirects the page

/* Some CDN url checks */
function cdnCheck() {
        if (document.getElementById('loginxkdjs') !== null) {// without this 'loginxkdjs' id set the functions below will NOT work
		if (loginXkdId !== undefined){
	    	if(loginXkdUrl.indexOf('cdn') === -1){
	    		loginXkdMsg = '<p class="red">loginXkd: $("#loginxkdjs") Not on CDN</p>';
	    		alertMe = true;
	    	} else {
	    		loginXkdMsg = '<p class="green">loginXkd: on CDN</p>';
	    	}
		}
	}

	
	if (document.getElementById('logincss') === null){
		logincssMsg = "<p class='red'>$('#logincss') not found</p>";
		alertMe = true;
	} else {
		var logincssId = $('#logincss');
		var logincssUrl = logincssId.attr('src'); // look for <link id='logincss' src=''
		if (logincssUrl !== undefined){
			if(logincssUrl.indexOf('cdn') === -1){
				logincssMsg = '<p class="red">$("#logincss") Not on CDN</p>';
				alertMe = true;
			} else {
				logincssMsg = '<p class="green">$("#logincss") on CDN</p>'; 
			}
		}
	}
	
	// look for the logo id <img id=''
	if (document.getElementById('logo') === null){
		logoMsg = "<p class='yellow'>$('#logo') not found or using a backgound css image</p>";
	} else {
		var logoId = $('#logo');
		var logoUrl = logoId.attr('src');// look for the logo id <img id='logo' src=''
		if (logoUrl !== undefined){
			if(logoUrl.indexOf('cdn') === -1){
				logoMsg = '<p class="red">$("#logo") Not on CDN</p>';
				alertMe = true;
			} else { 
				logoMsg = '<p class="green">$("#logo") on CDN</p>'; 
			}
		}
	}
	
	
	// also check if these id can be found to help warn if missing
	if (document.getElementById('loginbtn') === null){// look for id='loginbtn' for on click for submit
		loginbtnMsg = "<p class='red'>$('#loginbtn') not found</p>";
		alertMe = true;
	} else {
		var loginBtnId = $('#loginbtn');
		loginbtnMsg = "<p class='green'>$('#loginbtn') Found</p>";
	}
	
	// this is used when the wrong info was submitted a error message show on the page
	if (document.getElementById('failuremsg') === null){
		failMsg = "<p class='red'>$('#failuremsg') not found</p>";
		alertMe = true;
	} else {
		var failureMsgId = $('#failuremsg');
		failMsg = "<p class='green'>$('#failuremsg') Found</p>";
	}
	
}

/* look for google tracking if found if shows the # in the qa dialog */	
var googleTrackMsg = '<p class="yellow">Google Tracking: Error</p>';
var googleJsUrlMsg = '<p class="yellow">Google Tracking Url: Error</p>';
var googleJsUrlCdnMsg = '';
var mlsgooglecode = 'not set or blocked';
var trackit = false;
	function googleCheck(){
		if (document.getElementById('googletrack') !== null){
			googleTrackMsg = '<p class="green">Google Tracking: <a href="https://www.google.com/analytics/web/" target="_blank">'+mlsgooglecode+'</a></p>';
			trackit = true;
		} else {
			googleTrackMsg = '<p class="red">Google Tracking: Script ID not found $("#googletrack")</p>';
			warnalert = warnalert + "<p>$('#googletrack') not found</p>";
		}
		var googleTrackID = $('#googletrack');
		var googleJsUrl = googleTrackID.attr('src');
		 
		if (googleJsUrl !== undefined){
			if(googleJsUrl.indexOf('cdn') === -1){
				googleJsUrlMsg = '<p class="red">Google Tracking Url: $("#googletrack") Not on CDN <br/>'+googleJsUrl+'</p>';
				alertMe = true;
			} else {
				googleJsUrlMsg = '<p class="green">Google Tracking Url: On CDN <br/>'+googleJsUrl+'</p>'; 
			}
		}
	}

/* look for the forgot/change password links if found show the link in qa dialog */
var forgotPwdUrlMsg = '<p class="red">forgotPwd: Error</p>';
var changePwdUrlMsg = '<p class="red">changePwd: Error</p>';
	function passLinks(){
		
		if (document.getElementById('forgotpwd') == null){
			forgotPwdUrlMsg = '<p class="yellow">forgotPwd: Id Not found $("#forgotpwd")</p>';
		} else {
			var forgotpwdAttrHref = $('#forgotpwd').attr('href');
			forgotPwdUrlMsg = '<p class="green">forgotPwd: <a href="'+forgotpwdAttrHref+'">'+forgotpwdAttrHref+'</a></p>';

				$(document).ready(function() {
					$("a#forgotpwd").each(function() {
						var href = $(this).attr("href");
						var target = $(this).attr("target");
						var text = $(this).text();
						$(this).click(function(event) { // when someone clicks these links
							event.preventDefault(); // don't open the link yet
							if (window.ga) {ga("send", "Forgot Password", "Clicked", href); } // create a custom event
							setTimeout(function() { // now wait 300 milliseconds...
								window.open(href,(!target?"_self":target)); // ...and open the link as usual
							},300);
						});
					});
				});

		}
		if (document.getElementById('changepwd') == null){	
			changePwdUrlMsg = '<p class="yellow">changePwd: Id Not found $("#changepwd")</p>';
		} else {
			var changepwdAttrHref = $('#changepwd').attr('href');
			changePwdUrlMsg = '<p class="green">changePwd: <a href="'+changepwdAttrHref+'">'+changepwdAttrHref+'</a></p>';

				$(document).ready(function() {
					$("a#changepwd").each(function() {
						var href = $(this).attr("href");
						var target = $(this).attr("target");
						var text = $(this).text();
						$(this).click(function(event) { // when someone clicks these links
							event.preventDefault(); // don't open the link yet
							if (window.ga) { ga("send", "Change Password", "Clicked", href); } // create a custom event
							setTimeout(function() { // now wait 300 milliseconds...
								window.open(href,(!target?"_self":target)); // ...and open the link as usual
							},300);
						});
					});
				});

		}
	}

/* Set focus function due to the geolocation stealing it */
var setFocusMsg = '<p class="blue">setFocusMsg: Off with data-setfocus</p>';
var focus = false;
var usernameInput = $("#j_username");
	if (typeof setFocus === "undefined" ) { focus = true; setFocusMsg = '<p class="green">setFocusMsg: On</p>'; } 
	function setInputFocus(){
		var inputHasFocus = false;
		if (document.getElementById('j_username') == null) {
			warnalert = warnalert + "<p class='red'>$('#j_username') not set</p>";
			alertMe = true;
		}
		
	    $(inputs).focus(function () {
	        $(this).val(''); 
	        inputHasFocus = true; 
	        $(this).addClass('focused');
	    }).blur(function () {
	        inputHasFocus = false; 
	        $(this).removeClass('focused');
	    });
	    if (!inputHasFocus) {
	        $("#j_username").focus();
	        setTimeout(function () {
	            $("#j_username").focus();
	        }, 10);
	    }
	}

/* some browser honer this attr some don't  */
var inputAutoMsg = '<p class="red">inputAuto: Error</p>';
var autocomp = true;
	function autoComplete() {
		if (typeof inputAutoData === "undefined" ) { // set to off by default
			autocomp = false; 
			$(inputs).attr('autocomplete', 'off'); 
			$(inputs).attr('autocapitalize', 'off'); 
			inputAutoMsg = '<p class="green">inputAuto: autocomplete = Off</p>'; 	
		} else {
			autocomp = true;
			$(inputs).attr('autocomplete', 'on'); 
			$(inputs).attr('autocapitalize', 'on');  
			inputAutoMsg = '<p class="blue">inputAuto: autocomplete = On with data-autocomplete</p>';
		}
	}

/* This is used on submit to add a div over the page to disable it with a please wait message */	
var disablePageMsg = '<p class="blue">disablePage: Off by data-disable-page</p>';
var disablePageDiv = '<div id="disable-page-overlay"><div id="page-overlay"><img src="'+cdnUrl+'/images/ajax-e-loading.gif" /><p>'+pleasewait+'..</p></div></div>';
var disablepage = false;
	if (typeof disablePageData === "undefined" ) { 
		disablepage = true; 
		disablePageMsg = '<p class="green">disablePage: On</p>'; 
		$('body').append(disablePageDiv);
	}
	
/* This is a function to clear the input if the backspace button is push while the input has focus */
var backSpaceClearMsg ='<p class="blue">backSpaceClear: Off by data-backspace-clear</p>';
var backspace = false;
	if (typeof backSpaceClearData === "undefined" ) { 
		backspace = true; 
		backSpaceClearMsg ='<p class="green">backSpaceClear: On</p>'; 
	}  
	function backspaceClear(){
		$(inputs).keyup(function (b) {
		    if (b.which == 8) { 
		    	if (window.ga) { ga('send', 'event', 'Backspace Button', 'Triggered'); }
		    	$(this).val(""); 
		    }
		}); 
	}

/* copy what's in password to j_password */
var savePwdMsg = '<p class="blue">savePwd: On by data-save-pwd</p>';
var savepassword = false;
	if (typeof savePwdData === "undefined" ) {
		savepassword = true; 
		savePwdMsg = '<p class="green">savePwd: Off</p>';
	} 

/* used to help stop the browser from saving the password */	
var fakeSafariPwdMsg = '<p class="blue">fakeSafariPwd: Off with data-fake-safari-pwd</p>';
var fakepwdadded = false;
var fakepwd = false;
	if (typeof fakeSafariPwdData === "undefined" ) { fakepwd = true; fakeSafariPwdMsg = '<p class="green">fakeSafariPwd: On</p>';}
	function fakeSafariPwd(){ // added an input to fake safari from saving the pwd
		if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) { // only add to safari
			fakepwdadded = true; 
			$("#loginform").append('<input id="fakesafaripwd" type="password" value="fake safari pass" style="display:none"/>');
		} 
	} 

/* used for Icons if needed */
var fontIconsUrl = cdnUrl+"/css/font-awesome-4.5.0.min.css";
var fontIconsMsg = '<p class="blue">fontIcons: On with data-fontawesome</p>';
var fontawesome = true;
	if (typeof fontIconsData === "undefined" ) { fontawesome = false; fontIconsMsg = '<p class="green">fontIcons: Off or not needed</p>';} 
	function iconsFonts(){ // add font awesome when needed
		$("head").append('<link id="fontawesome" rel="stylesheet" type="text/css" href="'+fontIconsUrl+'">'); 
	}

/* this is for the Session timeout warning, once popped up it shows a dialog and the continue btn uses this url */
var	redirectUrl = "not set";
var redirectUrlMsg = '<p class="red">redirectUrl: Not Set</p>';
	if (typeof redirectUrlData !== "undefined" ) { // the default is on
		redirectUrl = redirectUrlData; 
		redirectUrlMsg = '<p class="blue">redirectUrl: set with data-redirect-url '+redirectUrl+'</p>';
	} else {
		redirectUrl = "/idp/noauthn.jsp";
		redirectUrlMsg = '<p class="green">redirectUrl: '+redirectUrl+'</p>';
	}
	

/* this is for how long to delay before session times out based on the config setup of idp */
var idpTimeout = 0;
var idpTimeoutMsg = '<p class="red">idpTimeout: Not Set</p>';
	if (typeof idpTimeoutData !== "undefined" ) { // the default is on
		idpTimeout = idpTimeoutData; 
		idpTimeoutMsg = '<p class="blue">idpTimeout: '+idpTimeoutData+' set with data-idp-session-timout</p>';
	} else {
		idpTimeout = 285;
		idpTimeoutMsg = '<p class="green">idpTimeout: default 285 or 4 mins 45 sec mins</p>';
	}
	
	
/* this is used to show the session timeout dialog to give link to redirect url before they try and login after it times out */
var secondsLeft = 0;
var secondsLeftMsg = '<p class="error">secondsLeft: Not Set</p>';
	if (typeof secondsLeftData !== "undefined" ) { // the default is on
		secondsLeft = secondsLeftData; 
		secondsLeftMsg = '<p class="blue">secondsLeft: '+secondsLeftData+' set with data-warn-secs</p>';
	} else {
		secondsLeft = 20;
		secondsLeftMsg = '<p class="green">secondsLeft: '+secondsLeft+'</p>';
	}
	
/* this is to help prevent the user from trying to login after the idp session has timed out */
var sessionWarnMsg = '<p class="red">sessionWarn: Error</p>';
var sessionWarnMe = false;
var sessionDialogHtml = '<p class="red">sessionDialogHtml: Error</p>';
	if (typeof sessionWarnData !== "undefined" ) { // the default is on
		sessionWarnMe = false;
		sessionWarnMsg = '<p class="blue">sessionWarn: Off with data-session-warn </p>';
	} else { 
		sessionWarnMe = true; 
		sessionWarnMsg = '<p class="green">sessionWarn: On, <a onClick="runSessionDialog()">Click to test</a> - '+redirectUrl+'</p>';
	} 
	function sessionPop(){ // session timeout dialog popup
		if(useboostrap === true){
			sessionDialogHtml = '<div id="session-dialog" style="display:none" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="qaDialogModal">'+
			'<div class="modal-dialog" role="document">'+
			   '<div class="modal-content">'+
			      '<div class="modal-header">'+
			        '<h4 class="modal-title" id="qaDialogModal">Login Request Expiration Warning</h4>'+
			      '</div>'+
			      '<div class="modal-body">'+
			      	'<p class="alert alert-warning" role="alert">Your request to login has expired due to inactivity.</p><p>Please click the continue button to initiate the login process again.</p>'+
				  '</div>'+
				  '<div class="modal-footer">'+
					'<a id="modal-session-continue" href="'+redirectUrl+'" class="btn btn-default">Continue</a>'+
				  '</div>'+
			    '</div>'+
			  '</div>'+
			'</div>';
				
		} else {
			sessionDialogHtml = '<div id="session-dialog" style="display:none"><p class="info yellow">Your request to login has expired due to inactivity.</p><p>Please click the continue button to initiate the login process again.</p></div>';
		}
		$("body").append(sessionDialogHtml);
		
		count();
		function count(){ setTimeout(count, 1000);
			--idpTimeout;
			if (idpTimeout == secondsLeft){
				runSessionDialog();
			}	
		}
	}
	function runSessionDialog(){

		if (window.ga) { ga('send', 'event', 'Session Dialog', 'Triggered', 'Idp timed out'); } // I'd like to see how many times this dialog is fired

		if(useboostrap === true){
			$('#session-dialog').modal();
		}else{
			$("#session-dialog").dialog({title:"Login Request Expiration Warning",width:400,modal:true,draggable:false,resizable:false,buttons:{Continue: function() {$(this).dialog("close");window.location = redirectUrl;}}});
		}
	}
	
var assocDropdownId = $('#assoc');/* loginXkdId.attr('data-assoc-dropdown');  default false */ 
var assocDropdownRememberJsId = $('#rememberjs');
var assocDropdownRememberJsUrl = $('#rememberjs').attr('src');
var assocDropdownRememberJsMsg = '<p class="yellow">assocDropdownRemember: Off remember.min.js Not Found </p>';
var assocDropdownMsg = '<p class="yellow">assocDropdown: Off $("#assoc") not on page</p>';
var assocDropdownCookieMsg = '<p class="yellow">assocDropdownCookie: null no cookie found</p>';
var assocDrop = false;
var assocDropdownCookie = null;
	function checkDropDown() {
		if (document.getElementById('assoc') != null){// this checks for a assoc dropdown and sets a true false for other functions
			assocDrop = true; 
			assocDropdownMsg = '<p class="green">assocDropdown: On Found $("#assoc")</p>';
			
			if (document.getElementById('rememberjs') == null){
				assocDropdownRememberJsMsg = '<p class="yellow">$("#rememberjs") not found</p>';
			}
		} 
	}
	function setDropDown() {
		if (document.getElementById('assoc') != null) {
			if( $('#rememberjs').attr('src').indexOf('cdn') === -1){
				assocDropdownRememberJsMsg = '<p class="yellow">assocDropdownRemember: remember.min.js Not on CDN</p>';
				alertMe = true;
			} else {
				assocDropdownRememberJsMsg = '<p class="green">assocDropdownRemember: On CDN remember.min.js Found</p>';
			}
		} else {
			assocDropdownRememberJsMsg = '<p class="red">assocDropdownRemember: remember.min.js Not Found on the page</p>';
		}
	   assocDropdownCookie = getCookie("associationlogin");
	   if (assocDropdownCookie != null) {
		   assocDropdownCookieMsg = '<p class="green">assocDropdownCookie: '+assocDropdownCookie+'</p>';
		   var list = document.getElementById("assoc");
		   for (i = 0; i < list.length; i++) {
			   if (list.options[i].value == assocDropdownCookie) {
				   list.selectedIndex = i;
				   break;
			   }
		   }
	   }
	}
	function saveDropdown(){
		var list = document.getElementById("assoc");
		setCookie("associationlogin", list.options[list.selectedIndex].value, 30);
	}
	
// form functions
function inputCheck(submitOnSuccess) {
	var isValid = true;
	
	if (ie8 === true){
		var username = document.getElementById('j_username');
		var password = document.getElementById('j_password');
		
		if (document.getElementById('password') != null) {
		 	password = document.getElementById('password');
		 	password.style.display = 'block';
		} 	
			
		if (username.value == '') {
			username.className = username.className + " empty";
			isValid = false;
		}
		if (password.value == '') {
			password.className = password.className + " empty";
			isValid = false;
		}
		
		if (assocDrop === true) { // check for the assoc select id
			var assocID = document.getElementById('assoc');
			
			if (document.getElementById("assoc").selectedIndex < 1) {
				assocID.className = assocID.className + " empty";
				isValid = false;
			} 
			if($("#assoc").val() == 'none'){
				assocID.className = assocID.className + " empty"; 
				isValid = false;
			} 
			
			if(isValid === true) {
				saveDropdown();
			}
		}

	} else {
		$(inputs).each(function () { // check each input to see if it is empty
	        if ($.trim($(this).val()) == '') {
	            $(this).addClass("empty"); 
	            $("input.empty:first").focus();
	            $('#disable-page-overlay').hide();
	            isValid = false;
	        } 
	    }); 
	    
		if (assocDrop) { // check for the assoc select id
			if (document.getElementById("assoc").selectedIndex < 1) { // check to see if they selected an assoc
			 	$("#assoc").addClass("empty"); 
			 	$('#disable-page-overlay').hide();
			 	isValid = false;
			} 
			if($("#assoc").val() == 'none'){
			    $("#assoc").addClass("empty"); 
			    $('#disable-page-overlay').hide();
			    isValid = false; 
			} 
			if (assocDrop === true) {
				if(isValid === true) {
					saveDropdown();
				}
			}
		}
	}
	
	// check fr the KD submitOnSuccess function if undefined set true 
	submitOnSuccess = (typeof submitOnSuccess == 'undefined') ? true : submitOnSuccess;
	
	if (isValid == true && submitOnSuccess) {
		submitLoginForm();
	}
	return isValid;
}

var loadingId = $("#loading");
var loadingMsg = '<p class="green">Loding Div: On</p>';
var loginFormId = $("#loginform");
var loginFormMsg = '<p class="green">loginFormId: Found $("#loginform")</p>';
function showInputs() { // the input should be set to display none this turns them back on
	var loading = true;
	if (document.getElementById('loading') == null){
		loadingMsg = '<p class="yellow">Loding Div: Off cant find $("#loading")</p>';
		loading = false;
	}
	if (typeof loadingData !== "undefined" ) {
		loadingMsg = '<p class="blue">Loding Div: Off by data-loading</p>';
		loading = false;
	}
	
	if (document.getElementById('loginform') == null) {
		loginFormMsg = '<p class="red">loginFormId: cant find $("#loginform")</p>';
		
	} else {
		loginFormMsg = '<p class="green">loginFormId: Found $("#loginform")</p>';
		
		    if (ie8 === true){
				if (document.getElementById('loading') == null){
					document.getElementById('loading').style.display = 'none';
				}
				document.getElementById('loginform').style.display = 'block';
				document.getElementById('j_username').style.display = 'block';
				document.getElementById('password').style.display = 'block';
				document.getElementById('password').setAttribute("type", "password");
				if (assocDrop) {
					document.getElementById('assoc').style.display = 'block';
				}
				document.getElementById('password').value = "";
				document.getElementById('j_username').focus();
				
			} else {
				$("#loading").hide();
			    $("#loginform,#j_username,#password,#assoc").show();
			    $("#password").val('');
			    if (focus === true) {
			    	setTimeout(function () {
			    		setInputFocus();
			    	}, 10);
			    }
			}

			if (fakepwd === true){fakeSafariPwd()}
			if (autocomp === true) {autoComplete()}
			if (assocDrop === true) {setDropDown()}
			if (backspace === true) {backspaceClear()}
			if (disablepage === true) {$('#disable-page-overlay').hide();} 
			if (assocDrop === true) {
				$('#assoc').change(function(){
			    	if($(this).val() != 'none'){
			    		$(this).removeClass("empty");
			    	}
				});
			}
			$(inputs).keypress(function () {
		        $(this).removeClass("empty"); 
		    });
	}
}

/* if bootstrap is loaded change from using jquery dialog to use bootstrap model*/ 
var checkBootStrapMsg = '<p class="yellow">Not using bootstrap</p>';
var useboostrap = false;
function checkBootStrap(){
	if (document.getElementById('bootstrapjs') === null){
		useboostrap = false;
		if (!jQuery.ui) { // check to see if jquery ui is available for dialogs, load it if not
			$("head").append('<script id="jqueryui" type="text/javascript" src="https://cdn.clareitysecurity.net/js/jquery-ui.min.js"></scr'+'ipt>');
			$("head").append('<link id="jqueryuicss" rel="stylesheet" type="text/css" href="https://cdn.clareitysecurity.net/css/jquery-ui.min.css">');	 	
			checkBootStrapMsg = '<p class="green">Not using bootstrap or id="bootstrapjs" not found, load jquery for dialogs</p>';
		} else {
			warnalert = warnalert + '<p class="red">checkBootStrap() Failed</p>';
		}
	} else { // if not using bootstrap add jquery for dialog
		useboostrap = true;
		checkBootStrapMsg = '<p class="green">Bootstrap: Found, dialogs changes to models</p>';
	}
}

var ssoTypeMsg = '<p class="red">ssoType: Error</p>';
function ssoType(){
	if (document.getElementById('j_logintype') == null){
		warnalert = warnalert + "<p>$('#j_logintype') not found</p>";
	}
	
	loginTypeVal = $("#j_logintype").val(); // get the login type
	
	/* This looks for the xkd() function on madKD once loaded */
	if (typeof window.xkd === 'function') {// if no kd script on the page do a basic login
		if ((loginTypeVal == 'mobile') || (loginTypeVal == 'tablet')) { // if mobile collector only
			ssoTypeMsg = '<p class="yellow">ssoType: '+loginTypeVal+' Mobile/Tablet using collector</p>';
			setTimeout(function () {
				checkCollector(); // if mobile device load collector instead of KD
			}, 600); 
		} else {
			ssoTypeMsg = '<p class="green">ssoType: '+loginTypeVal+' KD Collector</p>';
		} 
	} else {
		ssoTypeMsg = '<p class="green">ssoType: '+loginTypeVal+' Collector or Basic</p>';
		setTimeout(function () {
			checkCollector(); // if xkd function from madKD not found run collector
		}, 600);
	}
	
}
//No collector, KD or it falls back on failures 
function basicLogin(){
	showInputs();
}
function doLogin(e) {
	var valid = inputCheck(false);
	if(valid === true) {
		if (didkdload === true) { // if KD or collector
    		e.preventDefault();
    		return false;
    	} else {
    		submitLoginForm();
    	}
	} 	
}

// enter key check
document.onkeypress = keyPress;

function keyPress(e){
  var x = e || window.event;
  var key = (x.keyCode || x.which);
    if(key == 13 || key == 3){
    	doLogin(e);
    	if (window.ga) { ga('send', 'event', 'Login Button', 'Enter Key'); }
    }
}

// login button click check
$(document).on('click', '#loginbtn', function(e){
	doLogin(e);
	if (window.ga) { ga('send', 'event', 'Login Button', 'Click'); }
});


/* this function is used in the collector and basic login functions */
function submitLoginForm(){
	if (disablepage === true) {
		$('#disable-page-overlay').show(); 
	}
	if (assocDrop === true) {// check for the assoc select id
		saveDropdown();
	}
	
	if (document.getElementById('loginbtn') != null) {
		document.getElementById("loginbtn").disabled = true;
		document.getElementById("loginbtn").value = pleasewait;
	}
	
	if (didkdload === false) {
		// copy what was typed
		document.getElementById('j_password').value = document.getElementById('password').value;
	
		if (document.getElementById('loginform') != null) {
	    	document.forms["loginform"].submit();
	    } 
	}
}

/* This is used to check if collector loaded */
var collectIframe = $('#collectoriframe');
var collectorMsg = '<p class="red">collectIframe: Not Set</p>';
var collectorIconMsg = '<p class="red">collectorIcon: Not Set</p>';
var collectorchecker = false;

function checkCollector() {// check for collector iframe/function and ie8 

	if (typeof collectIframe === "undefined"){
		basicLogin(); // collector iframe not found
		ssoTypeMsg = '<p>ssoType: Collector Login: Changed to Basic, cant find the collector iframe</p>';
		collectorMsg = '<p class="yellow">Collector iframe: Not Found $("#collectoriframe")</p>';
		collectorIconMsg = '<p class="yellow">Collector Icon: Off - Collector iframe: Not Found</p>';
		//if (window.ga) { ga('send', 'event', 'Collector Iframe', 'Failed'); }
	} else {
			
		if (typeof window.xkd === 'function') { // check for kd function to remove silver icon
			$("#loginbtn").removeClass("collectorbtn");
			collectorIconMsg = '<p class="green">Collector Icon: Off for KD Icon</p>';
			//if (window.ga) {ga('send', 'event', 'Collector Iframe', 'Loaded with KD');}
		} else {
			//if (window.ga) {ga('send', 'event', 'Collector Iframe', 'Loaded no KD');}
			if (typeof collectorIcon !== "undefined" ) { // default silver icon turned off
				collectorIconMsg = '<p class="blue">Collector Icon: Off with data-collector-icon = '+collectorIcon+'</p>';
				$("#loginbtn").removeClass("collectorbtn");
			} else{ // default silver icon turned on
				collectorIconMsg = '<p class="green">Collector Icon: On</p>';
				$("#loginbtn").addClass("collectorbtn");
			}
		}
		
		if(didkdload === false){// only run if no KD, the loginKD() does this iframe object check too
			collecterSet(); // iframe found now see if it loaded, if failed do basic login
		}
	}
	
	if (ie8 === true){ /* if IE do basic login */
		basicLogin(); 
		ssoTypeMsg = '<p>ssoType: Collector Login: Changed to Basic for ie8</p>';
		collectorMsg = '<p class="yellow">Collector iframe: Changed to use Basic for ie8</p>';
		collectorIconMsg = '<p class="yellow">Collector Icon: Off for ie8</p>';
	}
}

/* This is used to check if the collector iframe loaded then checks to see if it can add the silver icon and default to basic if iframe failed to load */
function collecterSet(){
	if (typeof document.getElementById('collectoriframe').contentWindow['CLAREITY_FP'] == 'object'){// object found in iframe
		ssoTypeMsg = '<p class="green">ssoType: Collector Login Function: On</p>'; 
		collectorMsg = '<p class="green">Collector iframe: Found and Loaded</p>';

		showInputs(); //show inputs hide loading div

		// look for and set the input type to password if not using KD, the KD code does this if it load
		var passwordIdAttr = $('#password').attr('type');
		if (typeof passwordIdAttr === "text" ) {
			$('#password').prop('type', 'password');// reset any password input type from text to password
		}
		$(document).on('input', '#password', function (e) { 
			if (savepassword === true){
				if (typeof window.xkd !== 'function') {// NOTE: KD does this and converts to *, cant use this on KD code
	   	 			document.getElementById('j_password').value = this.value;
				}
			}
		});
		collectorchecker = true;
	} else {
		// the collector iframe was found but didn't load
		basicLogin();
		ssoTypeMsg = '<p class="red">ssoType: Collector Login: Changed to Basic - checkCollector() Failed</p>';
		collectorMsg = '<p class="red">Collector iframe: Loaded but Failed</p>';
		collectorIconMsg = '<p class="red">Collector Icon: Off Changed to Basic</p>';
		collectorchecker = false;
	}
}
var docollect = false;
function collectObjectCheck(){
	if (typeof document.getElementById('collectoriframe').contentWindow['CLAREITY_FP'] == 'object'){
		collectorMsg = '<p class="green">Collector iframe: Found and Loaded</p>';
		if (didkdload === true){
			kdCollecterMsg = '<p class="green">KD & Collector Script Found </p>';
		} 
		docollect = true;
	} else {
		kdCollecterMsg = '<p class="red">KD Found but Collector Script Not Found </p>';
		if (window.ga) { ga('send', 'event', 'Collector Script', 'Failed'); }
		docollect = false;
	}
	return docollect;
}

var kdCollecterId = $('#kdcollector'); // this is the kd script code include
var kdCollecterMsg = '<p class="yellow">KD: No script is not on the page $("#kdcollector")</p>';
var kdIconMsg = '<p class="yellow">KD Lock Icon: Off</p>';
var didkdload = false;
function loginKd(){ // 
	collectorMsg = '<p class="yellow">Collector iframe: Using KD</p>';
	collectObjectCheck();
	
	if (typeof kdCollecterId !== "undefined"){// if the script if found on the page
		kdCollecterMsg = '<p class="green">KD Script Found </p>';
		if (typeof kdIconData === "undefined" ) { 
			$('#loginbtn').addClass('kdbtn'); // add the gold lock icon to the login button	
			$("#loginbtn").removeClass("collectorbtn"); // remove the silver icon
			kdIconMsg = '<p class="green">KD Lock Icon: On</p>';
			collectorIconMsg = '<p class="green">Collector Icon: Off for KD Icon</p>';
		} else {
			$('#loginbtn').removeClass('kdbtn');
			kdIconMsg = '<p class="blue">KD Lock Icon: turned off with data-kd-icon='+kdIconData+'</p>';
		}
	} else {
		kdCollecterMsg = '<p class="yellow">KD: Off or the script is not on the page</p>';
	}
	
	/* Check to make sure the server side is setup and loading the right madKD file */
	if ((typeof(madKD_getVersion)=='undefined')) {
		ssoTypeMsg = '<p class="red">ssoType: KD Login, not Running KD <strong>madKD2.2.min.js</strong> or grater</p>';
		didkdload = false;
		if (window.ga) { ga('send', 'event', 'KD Script', 'Failed'); }
	} else if ((typeof(madKD_getVersion)=='undefined') || (madKD_getVersion() != requiredKd)) { /* A version was found but didnt match the required madkd  */
		ssoTypeMsg = '<p class="yellow">ssoType: Sorry, your KD configuration version is wrong.</p><p class="red">KD Login Error, Requires: <strong>maxKD'+requiredKd+'.min.js</strong></p>';
		didkdload = false;
		alertMe = true; // run the qaDialog
		if (window.ga) { ga('send', 'event', 'KD Script', 'Failed', 'maxKD'+madKD_getVersion()+'.min.js'); }
	} else{ // all good
		ssoTypeMsg = '<p class="green">ssoType: KD Version = <strong>maxKD'+madKD_getVersion()+'.min.js</strong></p>';
		didkdload = true;
		if (window.ga) { ga('send', 'event', 'KD Script', 'Loaded', 'maxKD'+madKD_getVersion()+'.min.js'); }
	}	

	showInputs();	//show inputs hide loading div
}

/* Kd Functions */	
/*called on KD init*/
window["initCallback_3xkd"] = function(){
	if (ie8 === true){
		basicLogin(); // if IE do basic login
		ssoTypeMsg = '<p class="yellow">ssoType: KD Login: changed to Basic for ie8</p>';
	} else {
		// continue with loginKd() from ssoType()
		 // delay wait for collector to load
		/* Check for the collector Iframe */
		if (typeof collectIframe === "undefined"){ // no collector iframe found
			ssoTypeMsg = '<p class="red">ssoType: Collector Iframe: Not found, while trying to run KD</p>';
			collectorMsg = '<p class="red">Collector iframe: Not found, while trying to run KD</p>';
			loginKd();
		} else { // iframe found, now check for the collector object
			setTimeout(function () {loginKd(); }, 500);	//show inputs hide loading div
		}
	}
}

/*called before form submit*/
window["validCallback_3xkd"] = function(){
	var valid = inputCheck(false);
	if(valid === true) {
		if (disablepage === true) {
			$('#disable-page-overlay').show();// z-index a div over the page to disable it while submitting
		}
		$("#loginbtn").prop("disabled", true).text(pleasewait);
	}
	return valid; 
}

/*called on KD error*/
window["kdFailed_3xkd"] = function(msg){
	$(".kdbutton").removeClass("kdbtn");
	setTimeout(function () {checkCollector(); }, 500); // wait for iframe to load to check it
	kdIconMsg = '<p class="red">KD Lock Icon: Removed kdFailed Callback Error</p>';
	ssoTypeMsg = '<p class="red">ssoType: KD Login, kdFailed Callback Error</p>'; 
} 

var qaDialogHtml = '';
function runQaDialog(){
	
	if (isOnQA === true){ // if on qa url show the checklist image on the bottom right of the screen 
		$("body").prepend('<div id="qawarn" onclick="qaDialog();"><img width="35" src="http://cdn.clareitysecurity.net/images/qa-checklist-icon.png" alt="Qa Check List" data-toggle="tooltip" data-placement="left" title="Run the Qa Check List Dialog" class="img-thumbnail"></div>');
	}
	/* css used in the dialogs */
	$("#loginxkdjs").prepend('<style id="qastyle">#qa-dialog{display:none;font-size:12px}#qa-dialog p{margin:2px 0; padding:0 3px}#colorinfo span{font-size:10px; padding:3px;}#qa-dialog span{font-size:10px; padding:3px;}#qa-dialog .modal-header span{font-size:21px;}#qa-dialog .red{background:rgba(136,0,0,0.2);color:#933;}#qa-dialog .yellow{background-color:#FEEFB3;color:#9F6000;}#qa-dialog .blue{background-color:#D9EDF7;color:#30708F;}#qa-dialog .green{background:#DFF0D8;color:#3C763D}#qawarn{padding:3px;position:fixed;right:0;bottom:0;width:250px;text-align:right;cursor:pointer;z-index:10}#qawarn p{margin:3px;cursor:pointer}#qawarn .img-thumbnail{background-color: #fff;border-radius: 4px;padding: 4px;cursor:pointer}#qawarn img:hover{cursor:pointer}</style>');
	
	loginTypeMsg = '<p class="green">Login Type: '+loginTypeVal+'</p>';
		
	if(useboostrap === true){ // check for bootstrap
		qaDialogHtml = '<div id="qa-dialog" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="qaDialogModal">'+
		  '<div class="modal-dialog" role="document">'+
		   '<div class="modal-content">'+
		      '<div class="modal-header">'+
		        '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
		        '<h4 class="modal-title" id="qaDialogModal">QA Checker Dialog</h4>'+
		      '</div>'+
		      '<div class="modal-body">'+
		      	'<div class="text-center"><p id="colorinfo"><span class="red">RED Error Or Bad FIX NOW</span><span class="yellow">Yellow Warn, Off or Might be Broke</span><span class="blue">Blue Idp Data Config Setting</span></p>'+
				'<p><strong>Check for CDN Host Entry if Page looks Broke 128.136.41.163 cdn.clareitysecurity.net</strong></p></div>';
	} else { // use jquery
	    qaDialogHtml = '<div id="qa-dialog" style="display:none;" tabindex="-1"><p id="colorinfo"><span class="red">RED Error Or Bad FIX NOW</span><span class="yellow">Yellow Warn, Off or Might be Broke</span><span class="blue">Blue Idp Data Config Setting</span></p><p><strong>Check for CDN Host Entry if Page looks Broke</strong></p>';	
	}
	
	qaDialogHtml = qaDialogHtml + googleTrackMsg+
	loginTypeMsg+
	assocDropdownMsg+
	assocDropdownCookieMsg+
    assocDropdownRememberJsMsg+
	ssoTypeMsg+
	collectorMsg+
	collectorIconMsg+
	kdCollecterMsg+
	kdIconMsg+
	setFocusMsg+
	loginFormMsg+
	inputAutoMsg+
	backSpaceClearMsg+
	savePwdMsg+
	fakeSafariPwdMsg+
	disablePageMsg+
	sessionWarnMsg+
	idpTimeoutMsg+
	secondsLeftMsg+
	redirectUrlMsg+
	forgotPwdUrlMsg+
	changePwdUrlMsg+
	'<div class="warnalerts"><p><strong>Below is for Dev, fix CDN errors before QA</strong></p>'+
	loginXkdMsg+
	googleJsUrlMsg+
	checkBootStrapMsg+
	logincssMsg+
	loadingMsg+
	logoMsg+
	fontIconsMsg+
	warnalert+'</div>';
	
	if(useboostrap === true){ // check for bootstrap
		qaDialogHtml = qaDialogHtml+ '</div>'+
				'<div class="modal-footer">'+
					'<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'+
			    '</div>'+
		      '</div>'+
		    '</div>'+
		'</div>';
	} else {
		qaDialogHtml = qaDialogHtml+ '</div>';
	}
	$("body").append(qaDialogHtml);
}

function qaDialog(){ // this run on click of the check list image or if a function find an error
	if(useboostrap === true){ // check for bootstrap
		$('#qa-dialog').modal();
	} else { // use jquery dialog
		$("#qa-dialog").dialog({title:"QA Checker Dialog",width:480,modal:true,draggable:true,resizable:true,buttons:{Close: function() {$(this).dialog("close");}}});
	}
}
	
$(document).ready(function(){
	if (oldie === true){ // ie8 functions to show a popup or redirect
		$("head").append('<!--[if lt IE 9]><link id="ie8css" rel="stylesheet" type="text/css" href="'+ie8CssUrl+'"><![endif]-->');
		$("body").prepend('<!--[if lt IE 9]><div id="oldbrowser"><div class="note-ie">Your browser is out-of-date. Some functions might not work or display properly. Please Upgrade your Browser to IE9 and above.</div></div><div class="clear"></div><![endif]-->');
	}
	checkBootStrap();
	googleCheck();
	cdnCheck();
	passLinks(); // this check to see if the links were set on page to help with qa
	ssoType();
	checkDropDown();
	if (fontawesome === true) {iconsFonts()} // fontawesome icon to use in the design if needed load it
	if (sessionWarnMe === true) {sessionPop()} // give a way to know the session expired 
	setTimeout(function (){
		runQaDialog();
		
	}, 1000); // wait for all var Msg's to be populated from the functions, the delay is for waiting on kd and collector
});