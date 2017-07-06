//works with Paragon's main window
//the messages are passed between the defaultpage and iframes, all are the contect sripts

//Open frequently used tabs:

$('a[url="/ParagonLS/Search/Tax.mvc?DBid=1&countyID=1"]')[0].click();
$('a[url="/ParagonLS/Search/Property.mvc/LoadSavedSearch"]')[0].click();

var tabsContainer = $('ul#tab-bg');
var tabDivs ;
var tabs = $('ul#tab-bg li');
var tabLinks = $('ul#tab-bg li a');
console.log("default home page read top level tabs: ", tabs);
var curTabLink = $('ul#tab-bg li.ui-tabs-selected.ui-state-active a');
var curTabID = curTabLink.attr('href');

tabsContainer.click(function(){

    tabDivs = $('div.ui-tabs-sub');
    tabDivs.removeAttr('style');
    console.log('get tabs container clicked');

})

chrome.extension.onMessage.addListener(function(request, sender, sendResponse){

    //get Warning message: the search results exceed the limit, ignore it
    if(request.todo == "ignoreWarning"){
        
        //Warning Form is a special page, the buttons are in the div, 
        //the iframe is separate with the buttons
        //this message sent from mls-warning.js
        console.log("Main Home ignore warning message!");
        console.log($('#OK'));

        var countTimer = setInterval (checkCount, 100);

        function checkCount() {
            //#OK button, "Continue", belongs to default page
            if(document.querySelector ("#OK")){

                clearInterval (countTimer);
                var btnOK = $('#OK');
                console.log("OK",btnOK);
                btnOK.click();
            }
        };

    };

    //Logout MLS Windows shows an annoying confirm box, pass it
    //The message sent from logout iframe , the buttons are inside the iframe
    if(request.todo == "logoutMLS"){

        console.log("Main Home got logout message!");
        console.log($('#confirm'));
 
        var countTimer = setInterval (checkCount, 100);

        function checkCount() {
            //the button is inside the iframe, this iframe belongs to default page
            if(document.querySelector ("#confirm")){

                clearInterval (countTimer);
                var btnYes = $('#confirm');
                console.log("confirm",btnYes);
                btnYes.click();
            }
        };

    };

    if(request.todo == "updateTopLevelTabMenuItems"){

        //update tabs
        tabs = $('ul#tab-bg li');
        console.log("default home page update top level tabs: ", tabs)

        var curTabLink = $('ul#tab-bg li.ui-tabs-selected.ui-state-active a');
        var curTabID = curTabLink.attr('href');

        chrome.storage.sync.set({curTabID : curTabID});

    }

    if(request.todo == "readCurTabID"){

        //read cur tabID
        tabs = $('ul#tab-bg li');


        console.log("default home page read top level tabs: ", tabs)

        var curTabLink = $('ul#tab-bg li.ui-tabs-selected.ui-state-active a');
        var curTabID = curTabLink.attr('href');

        console.log("current Tab ID is: ", curTabID);

        //save the curTabID
        chrome.storage.sync.set({curTabID : curTabID}, function(){

            console.log('curTabID has been save to storage.');
        });

    }

});