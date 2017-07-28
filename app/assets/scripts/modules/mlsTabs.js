//Class Tabs for the default main page of Paragon
//get the tab elements, containers, links
//keep the state of the current tab

export default class Tabs {
    constructor() {
        //get the Top Level tabs Container
        this.topTabsContainer = $('ul#tab-bg');
        //Container for sub tabs under the Top Level Tabs
        this.subTabsContainer = null;
        this.topTabs = $('ul#tab-bg li');
        this.topTabLinks = $('ul#tab-bg li a');
        this.curTopTabLink = $('ul#tab-bg li.ui-tabs-selected.ui-state-active a');
        this.curTopTabID = this.curTopTabLink.attr('href');;
        console.info('New Tabs Class works now...');
        //add event listeners
        this.OnClick_topTabsContainer();
        this.onMessage();
    }

    OnClick_topTabsContainer() {
        var self = this;
        this.topTabsContainer.click(function () {
            self.subTabsContainer = $('div.ui-tabs-sub');
            self.subTabsContainer.removeAttr('style');
            console.info('get top tabs container clicked');
        });
    }

    onMessage() {
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

                //Top Level Tabs Changed
                if (request.todo == 'updateTopLevelTabMenuItems') {
                    // update tabs
                    self.tabs = $('ul#tab-bg li');
                    console.log('default home page update top level tabs: ', tabs);
                    self.curTabLink = $('ul#tab-bg li.ui-tabs-selected.ui-state-active a');
                    self.curTabID = curTabLink.attr('href');
                    chrome.storage.sync.set({ curTabID: self.curTabID });
                }

                //Read the Current TabID
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
    }
}