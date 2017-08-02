//class for top tab container

const topTabContainerID = 'ul#tab-bg';
const tabContentContainerID = 'div#app_tab_switcher';
const activeTabClass = 'ui-tabs-selected ui-state-active';
const savedPropertySearches = 'iframe#tab2';
//jQuery plugin: check inline Style:
//return the style value 
//or return undefined:
// (function ($) {
//     $.fn.inlineStyle = function (prop) {
//         return this.prop("style")[$.camelCase(prop)];
//     };
// }(jQuery));

export class TopTabInfo {
    constructor($tab) {
        //$tab element is a li under ul#tab-bg:
        this.$tab = $tab; //keep the tab li element <li>
        this.$tabLink = $tab.children('a'); //keep the tab link <a>
        this.$tabTitle = this.$tabLink.children('span'); //keep the tab title <span>
        this.tabID = this.$tabLink.attr('href'); //keep the tabID, '#tab3', '#' is reserved
        this.tabTitle = this.$tabTitle.text(); //keep the tab title text string
        this.tabURL = this.$tabLink.attr('url'); //keep the tab url
        this.$subTabsContainer = $(tabContentContainerID).children(this.tabID); //keep the tab's content <element>
        this.tabClicked = false; //
        //find the tab Content of this tab
        console.log('TopTabInfo.tabID:', this.tabID); 
        this.tabContent = new TabContent(this.tabID);
        console.log('TopTabInfo.tabContent:', this.tabContent);
        this.onClick();
    }

    onClick() {
        let self = this;
        //jquery add click event to anchor element a
        this.$tabLink.click(function () {
            console.log('click tab Link');
            self.tabClicked = true;
            //self.ActiveThisTab();
        })

        this.$tabTitle.click(function () {
            console.log('click tab span-title');
        })

        this.$tab.click(function () {
            console.log('click tab li');
        })
    }

    ActivateThisTab() {
        //this.$tab.addClass(activeTabClass);
        this.syncTabToContent();
    }

    DeactivateThisTab() {
        this.$tab.removeClass(activeTabClass);
        this.syncContentToTab();
    }

    syncTabToContent() {
        if (this.tabContent.$tabContainer.inlineStyle('display') === 'block') {
            this.$tab.addClass(activeTabClass)
        } else {
            if (this.tabContent.$tabContainer.hasClass('ui-tabs-hide')) {
                this.$tab.removeClass(activeTabClass)
            }else{
                this.$tab.addClass(activeTabClass)
            }
        }
    }

    syncContentToTab() {
        if(this.tabContent.$tabContainer.inlineStyle('display')==='block'){
            this.tabContent.$tabContainer.removeAttr('display')
        }else{
            if(!this.tabContent.$tabContainer.hasClass('ui-tabs-hide')){
                this.tabContent.$tabContainer.addClass('ui-tabs-hide');
            }
        }
    }
}

class TabContent {
    constructor(tabID) {
        this.$tabContainer = this.getTabContentContainer(tabID);
        console.log("TabContent is: ", this.$tabContainer);
    }

    getTabContentContainer(tabID) {
        
        let $tabContentContainer = $(tabContentContainerID).children(tabID);
        return $tabContentContainer;
    }

    showTabContent() {
        this.$tabContainer.removeClass('ui-tabs-hide');
    }

    hideTabContent() {
        this.$tabContainer.addClass('ui-tabs-hide');
    }
}

export default class TopTabs {
    constructor(tabContainerID) {
        this.$topTabsContainer = $(topTabContainerID);
        this.$topTabs = null;
        this.topTabInfos = [];
        this.curTab = null;
        this.onAddNewTab();
        this.updateTopTabInfos();
        this.onClick();
    }

    onAddNewTab() {
        //event will be triggered by adding new tab with class ui-corner-top
        //goggle: jquery detecting div of certain class has been added to DOM
        let self = this;
        $.initialize(".ui-corner-top", function () {
            console.warn('===>New Tab added');
            console.log($(this));
            self.updateTopTabInfos();
        });
    }

    onClick() {
        let self = this;
        //jquery add click event to a li element
        this.$topTabs.each(function (index) {
            $(this).click(function (e) {
                console.log('top tab clicked', e);
                self.topTabInfos.forEach(function (tab) {
                    tab.DeactivateThisTab();
                })
                let tabInfo = new TopTabInfo($(e.currentTarget));
                console.log(tabInfo);
                tabInfo.ActiveThisTab();
            })
        })
    }

    updateTopTabInfos() {
        let self = this;
        self.topTabInfos.length = 0; //clean up the array
        this.$topTabs = null; //clean up the $topTabs
        this.$topTabs = this.$topTabsContainer.children('li.ui-state-default.ui-corner-top');
        this.$topTabs.each(function (index) {
            let tabInfo = new TopTabInfo($(this));
            self.topTabInfos.push(tabInfo);
        })
    }

    setCurTab(tabID) {
        this.updateTopTabInfos();
        for (i = 0; i < this.topTabInfos.length; i++) {
            let thisTab = this.topTabInfos[i];
            if (thisTab.tabID == tabID) {
                thisTab.ActiveThisTab();
            } else {
                thisTab.DeactivateThisTab();
            }
        }
    }
}