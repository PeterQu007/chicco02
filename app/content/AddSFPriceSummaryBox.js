//SpreadSheet Summary Page
//show / hide as per needed

import uiSummaryTable from '../assets/scripts/ui/uiSummaryTable.js';
var $fx = L$();

var spreadSheetSummary = {

    init: function () {
        //link to iframe's tabID
        //this.tabID = $fx.getTabID(window.frameElement.src); //prefixed with # id-sign
        //this.$tabContentContainer = $('div' + this.tabID, top.document)
        //this.onMessage();
        //this.tabTitle = this.getTabTitle(this.tabID);
        //console.warn('tabID, tabTitle', this.tabID, this.tabTitle);
        //this.OnTabTitle();
        console.log("Add Square Feet Price SummaryBox- document url:", document.URL);
        this.$SummaryBox = $('div#dialogStats');
        console.warn('Summary box: ', this.$SummaryBox);
        //this.$table = new uiSummaryTable();
        //this.$table.showUI(this.$SummaryBox);
        //this.$loadingNotice = document.querySelector('#load_grid');
        this.$mutationObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
              console.log(mutation);
            });
          });
        this.$mutationObserver.observe(document.documentElement, {
            attributes: true,
            characterData: true,
            childList: false,
            subtree: true,
            attributeOldValue: true,
            characterDataOldValue: true
          });
    },

    tabID: null,
    tabTitle: null,
    $SummaryBox: null,
    $table: null,
    $mutationObserver: null,
    //$loadingNotice: null,

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
// $(function () {
//     spreadSheetSummary.init();
// })

//Try window.on(load)
$(window).on('load',function(){
    this.console.log('document ready state:', document.readyState);
    spreadSheetSummary.init();
})