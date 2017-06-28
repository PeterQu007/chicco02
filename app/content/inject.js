// this is the code which will be injected into a given page...

(function() {

    var newURL = "http://idp.gvfv.clareitysecurity.net/idp/Authn/UserPassword";
    //var newURL = "http://stackoverflow.com/"
    //chrome.tabs.create({ url: newURL });

    	// just place a div at top right
	var div = document.createElement('div');
	div.style.position = 'fixed';
	div.style.top = 0;
	div.style.right = 0;
	div.textContent = 'Injected!';
	document.body.appendChild(div);
    
    var script = document.createElement('script');
    script.src = "http://pidrealty.ca/assets/scripts/test.js"
    
    //document.body.appendChild(script);

    $(function(){
    
    var name =$("#j_username");
    var pswhidden = $("#j_password");
    var psw = $("#password");
    var btn = $("#loginbtn");
    
    name.val("V70898");
    psw.css("color","white");
    psw.val("escape89");
    pswhidden.val("escape89");
    btn.click();
    
	})

	//alert('inserted self... giggity, thanks!');

})();

// $(function() {

// 	// just place a div at top right
// 	var div = document.createElement('div');
// 	div.style.position = 'fixed';
// 	div.style.top = 0;
// 	div.style.right = 0;
// 	div.textContent = 'Injected!';
// 	document.body.appendChild(div);
    
//     var script = document.createElement('script');
//     script.src = "http://pidrealty.ca/assets/scripts/test.js"
    
//     //document.body.appendChild(script);
  
//     var name =$("#j_username");
//     var pswhidden = $("#j_password");
//     var psw = $("#password");
//     var btn = $("#loginbtn");
    
//     name.val("V70898");
//     psw.css("color","white");
//     psw.val("escape89");
//     pswhidden.val("escape89");
//     btn.click();
 
// 	//alert('inserted self... giggity, thanks!');

//     document.addEventListener("DOMContentLoaded", function() { 
//      alert("Page Loaded");
//     }, true);

// });