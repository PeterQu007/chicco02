// works with Paragon's main window
// the messages are passed between the defaultpage and iframes, all are the contect sripts

// Open frequently used tabs:

let DefaultPage = {

    init: function () {

        this.curTabID = this.curTabLink.attr('href');
        this.language.insertAfter(this.leftBanner);
        this.taxSearch[0].click();
        this.savedSearch[0].click();
        this.tabsContainerClickEvent();
        this.messageEvents();
    },

    taxSearch: $('a[url="/ParagonLS/Search/Tax.mvc?DBid=1&countyID=1"]'),
    savedSearch: $('a[url="/ParagonLS/Search/Property.mvc/LoadSavedSearch"]'),
    tabsContainer: $('ul#tab-bg'),
    tabDivs: null,
    tabs: $('ul#tab-bg li'),
    tabLinks: $('ul#tab-bg li a'),
    curTabLink: $('ul#tab-bg li.ui-tabs-selected.ui-state-active a'),
    curTabID: null,
    leftBanner: $('#app_banner_links_left'),
    language: $('<div class="languagebox"><div id="reportlanguage"><lable><input type="checkbox" name="checkbox" sytle="width: 25px!important">cn</lable></div></div>'),

    tabsContainerClickEvent: function () {

        var self = this;

        this.tabsContainer.click(function () {

            self.tabDivs = $('div.ui-tabs-sub');
            self.tabDivs.removeAttr('style');
            console.log('get tabs container clicked');

        });

    },

    messageEvents: function () {

        (function (self) {

            chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {

                // get Warning message: the search results exceed the limit, ignore it
                if (request.todo == 'ignoreWarning') {

                    // Warning Form is a special page, the buttons are in the div, 
                    // the iframe is separate with the buttons
                    // this message sent from mls-warning.js
                    console.log('Main Home ignore warning message!');
                    console.log($('#OK'));

                    var countTimer = setInterval(checkCount, 100);

                    function checkCount() {
                        // #OK button, "Continue", belongs to default page
                        if (document.querySelector('#OK')) {

                            clearInterval(countTimer);
                            let btnOK = $('#OK');
                            console.log('OK', btnOK);
                            btnOK.click();
                        }
                    };

                };

                // Logout MLS Windows shows an annoying confirm box, pass it
                // The message sent from logout iframe , the buttons are inside the iframe
                if (request.todo == 'logoutMLS') {

                    console.log('Main Home got logout message!');
                    console.log($('#confirm'));

                    var countTimer = setInterval(checkCount, 100);

                    function checkCount() {
                        // the button is inside the iframe, this iframe belongs to default page
                        if (document.querySelector('#confirm')) {

                            clearInterval(countTimer);
                            let btnYes = $('#confirm');
                            console.log('confirm', btnYes);
                            btnYes.click();
                        }
                    };

                };

                if (request.todo == 'updateTopLevelTabMenuItems') {

                    // update tabs
                    self.tabs = $('ul#tab-bg li');
                    console.log('default home page update top level tabs: ', tabs);

                    self.curTabLink = $('ul#tab-bg li.ui-tabs-selected.ui-state-active a');
                    self.curTabID = curTabLink.attr('href');

                    chrome.storage.sync.set({ curTabID: self.curTabID });

                }

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

        }(this));

    },

};

// Start point

$(function () {

    DefaultPage.init();

});

// $('a[url="/ParagonLS/Search/Tax.mvc?DBid=1&countyID=1"]')[0].click();
// $('a[url="/ParagonLS/Search/Property.mvc/LoadSavedSearch"]')[0].click();

// var tabsContainer = $('ul#tab-bg');
// var tabDivs ;
// var tabs = $('ul#tab-bg li');
// var tabLinks = $('ul#tab-bg li a');
// console.log("default home page read top level tabs: ", tabs);
// var curTabLink = $('ul#tab-bg li.ui-tabs-selected.ui-state-active a');
// var curTabID = curTabLink.attr('href');

// tabsContainer.click(function(){

//     tabDivs = $('div.ui-tabs-sub');
//     tabDivs.removeAttr('style');
//     console.log('get tabs container clicked');

// })

// chrome.extension.onMessage.addListener(function(request, sender, sendResponse){

//     //get Warning message: the search results exceed the limit, ignore it
//     if(request.todo == "ignoreWarning"){

//         //Warning Form is a special page, the buttons are in the div, 
//         //the iframe is separate with the buttons
//         //this message sent from mls-warning.js
//         console.log("Main Home ignore warning message!");
//         console.log($('#OK'));

//         var countTimer = setInterval (checkCount, 100);

//         function checkCount() {
//             //#OK button, "Continue", belongs to default page
//             if(document.querySelector ("#OK")){

//                 clearInterval (countTimer);
//                 var btnOK = $('#OK');
//                 console.log("OK",btnOK);
//                 btnOK.click();
//             }
//         };

//     };

//     //Logout MLS Windows shows an annoying confirm box, pass it
//     //The message sent from logout iframe , the buttons are inside the iframe
//     if(request.todo == "logoutMLS"){

//         console.log("Main Home got logout message!");
//         console.log($('#confirm'));

//         var countTimer = setInterval (checkCount, 100);

//         function checkCount() {
//             //the button is inside the iframe, this iframe belongs to default page
//             if(document.querySelector ("#confirm")){

//                 clearInterval (countTimer);
//                 var btnYes = $('#confirm');
//                 console.log("confirm",btnYes);
//                 btnYes.click();
//             }
//         };

//     };

//     if(request.todo == "updateTopLevelTabMenuItems"){

//         //update tabs
//         tabs = $('ul#tab-bg li');
//         console.log("default home page update top level tabs: ", tabs)

//         var curTabLink = $('ul#tab-bg li.ui-tabs-selected.ui-state-active a');
//         var curTabID = curTabLink.attr('href');

//         chrome.storage.sync.set({curTabID : curTabID});

//     }

//     if(request.todo == "readCurTabID"){

//         //read cur tabID
//         tabs = $('ul#tab-bg li');


//         console.log("default home page read top level tabs: ", tabs)

//         var curTabLink = $('ul#tab-bg li.ui-tabs-selected.ui-state-active a');
//         var curTabID = curTabLink.attr('href');

//         console.log("current Tab ID is: ", curTabID);

//         //save the curTabID
//         chrome.storage.sync.set({curTabID : curTabID}, function(){

//             console.log('curTabID has been save to storage.');
//         });

//     }

// });
