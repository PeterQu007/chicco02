//QuickSearch Page
//show / hide as per needed

import uiSummaryTable from '../assets/scripts/ui/uiSummaryTable.js';

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
        this.$spreadSheet = $('#ifSpreadsheet');
        this.$grid = $('#grid');
        var x = $("div#dialogStats", parent.document);
        this.uiTable.showUI(x);
        this.uiTable.setHighPSF(250);
        var loading = document.querySelector('#grid');
        //this.highLightCol25();
        this.$mutationObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                //console.warn('document state:',document.readyState);
                //console.log(mutation.target);
                // (mutation.target.)
                var name = mutation.attributeName;
                var value = mutation.target.getAttribute(name);
                //console.log('attriName, Value: ', name, value);
                // if (value = 'none'){
                //     var xTable = $('table#grid');
                //     var xRows = $('table#grid tr');
                //     console.log("current Table has rows: ", xRows.children.length-1);
                // }
                var x = $('table#grid tbody');
                console.log("Table Rows currently is: ", x.children('tr').length);
            });
          });
        this.$mutationObserver.observe(loading, {
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
    uiTable: new uiSummaryTable(),
    $spreadSheet: null,
    $grid: null,
    $mutationObserver: null,

    highLightCol25(){
        var xTable = $('#grid');
        var rows = xTable.children('tr');
        var i;
        for (i=1; i<rows.length; i++){
            console.log(rows[i].nth-child(25));
        }
    },

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
    console.log('Spreadsheet Document State:', document.readyState);
    var $loadingNotice = document.querySelector('#load_grid');
    console.log($loadingNotice);
    quickSearch.init();
})

//