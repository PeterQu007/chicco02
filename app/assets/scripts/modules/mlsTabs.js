//Class Tabs for the default main page of Paragon
//get the tab elements, containers, links
//keep the state of the current tab
//to Active the top tab, add classes: ui-tabs-selected ui-state-active
//to DeActive the top tab, remove the classes: ui-tabs-selected ui-state-active


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
        //console.info('New Tabs Class works now...');
        //add event listeners
        this.OnClick_topTabsContainer();
        //this.onMessage();
    }

    OnClick_topTabsContainer() {
        var self = this;
        this.topTabsContainer.click(function () {
            self.subTabsContainer = $('div.ui-tabs-sub');
            self.subTabsContainer.removeAttr('style');
            console.log('[mlsTab].remove Style Display Attr');
            console.log('Test Break Point');
        });
    }

    
}