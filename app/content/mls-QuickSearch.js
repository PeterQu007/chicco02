//QuickSearch Page
//show / hide as per needed
var $fx = L$();

var quickSearch = {

    init: function () {
        //link to iframe's tabID
        this.tabID = $fx.getTabID(window.frameElement.src); //prefixed with # id-sign
        this.$tabContentContainer = $('div' + this.tabID, top.document)
        //this.onMessage();
        this.tabTitle = this.getTabTitle(this.tabID);
        console.warn('tabID, tabTitle', this.tabID, this.tabTitle);
        this.OnTabTitle();
    },

    tabID: null,
    tabTitle: null,

    OnTabTitle: function () {
        let self = this;
        chrome.storage.onChanged.addListener(function (changes, area) {
            
            if (area == "sync" && "todo" in changes) {
                if (changes.todo.newValue.indexOf('getTabTitle') > -1) {
                    console.log("command::getTabTitle:", changes.todo.newValue);
                    chrome.storage.sync.get(['getTabTitle','from', 'showTabQuickSearch'], function (result) {
                        self.tabTitle = result.getTabTitle;
                        console.log("OnTabTitle.getTabTitle:", result);
                        //showQuickSearchTab
                        if (!result.showTabQuickSearch && result.getTabTitle.trim()=="Quick Search") {
                            chrome.storage.sync.set(
                                {
                                    from: 'QuickSearch' ,
                                    todo: 'hideQuickSearch'+ Math.random().toFixed(8),
                                    tabID: self.tabID
                                }
                            )
                        }
                    })
                };
            }
        })
    },

    getTabTitle: function (tabID) {
        chrome.runtime.sendMessage({
            todo: 'getTabTitle',
            from: 'quickSearch',
            tabID: tabID
        }, function (response) {
            //self.tabTitle = response.tabTitle;
            //self.updateQuickSearchTabStatus();
            console.warn('QuickSearch.getTabTitle::', response);
            return response;
        })
    },

    getTabStatus: function () {
        let self = this;
        chrome.storage.sync.get('showTabQuickSearch', function (result) {

            if (result.showTabQuickSearch) {
                self.showQuickSearch();
            } else {
                self.hideQuickSearch();
            }
        })
    },

    showQuickSearch: function () {
        chrome.runtime.sendMessage({
            from: 'QuickSearch',
            todo: 'showQuickSearch',
            tabID: this.tabID
        })
    },

    hideQuickSearch: function () {
        chrome.runtime.sendMessage({
            from: 'QuickSearch',
            todo: 'hideQuickSearch',
            tabID: this.tabID
        })
    }
}

//entry point:
$(function () {
    quickSearch.init();
})

//