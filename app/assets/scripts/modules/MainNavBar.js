//Class Wrapper mainNavBar for Top Level Tabs Container - Main Navigation Bar(mainNav)
//Top Level Tabs Container(mainNavBar) is an HTML Elements ul Complex inside top level URL:
//https://bcres.paragonrels.com/ParagonLS/Default.mvc#2
//mainNavBar contains mainNavItem - individual topTab ui Complexes
//sub Class Wrapper mainNavItem for topTab ui Complex

const mainPanelID = 'div#app_tab_switcher'; //Top Level Panel Container of TopTab mainNav & subContent Selector ID
const mainNavBarID = 'ul#tab-bg'; //Top Tabs Main Navigation Selector ID
const newMainNavItemClass ='.ui-corner-top'; //Top Tab li element class
const mainNavItemClass = 'li.ui-state-default.ui-corner-top'; //Top Tab li element class
const activeNavItemClass = 'ui-tabs-selected ui-state-active'; //Current Active Top Tab Selector Class

//const savedPropertySearches = 'iframe#tab2';

export default class MainNavBar {
    constructor() {
        this.$mainNavBar = $(mainNavBarID);
        this.$mainNavItems = null; //set of top tap ui HTML elements
        this.mainNavItems = []; //set of class of mainNavItems
        this.curNavItem = null;
        this.enableOnAddNewNavItem = false; //disable onAddNewTab event in the init
        this.onAddNewNavItem();
        this.onAddNewNavItemContent();
        this.update();
        this.onClick();
        this.enableOnAddNewNavItem = true; //enable onAddNewTab event after the init
    }
    //events:
    onAddNewNavItem() {
        //event will be triggered by adding new tab with class ".ui-corner-top" (mainNavItemClass)
        //goggle: jquery detecting div of certain class has been added to DOM
        let self = this;
        $.initialize(newMainNavItemClass, function () {
            let $navItem = $(this);
            //if added $tab is the top tab item, then update the mainNavItem:
            if(self.enableOnAddNewNavItem && $navItem.parent().attr('id')=="tab-bg") {
                
                let newNavItemID = $navItem.children('a').attr('href');
                console.warn('[Class.TopTabs]onAddNewTab===>New Tab added, newTabID:', newNavItemID, $navItem, $navItem.parent().attr('id'));
                //self.updateTopTabInfos(newTabID);
                self.setCurMainNavItem(newNavItemID); //updateTopTabInfos, and set Current tab
            }
        });
    }

    onAddNewNavItemContent() {
        //event will be triggered by adding new tab with class ui-corner-top
        //goggle: jquery detecting div of certain class has been added to DOM
        let self = this;
        $.initialize(".ui-tabs-sub", function () {
            let $tabContent = $(this);
            //if added $tab is the top tab, then update the topTabInfos:
            //if(self.EnableOnAddNewTab && $tab.parent().attr('id')=="tab-bg") {
            //console.warn('Class.TopTabs.onAddNewTabContent===>New TabContent added', $tabContent, $tabContent.parent().attr('id'));
            //    self.updateTopTabInfos();
            //}
            chrome.storage.sync.get('showTabQuickSearch',function(result){
                //console.log('Class.TopTabs.onAddNewTabContent::get showTabQuickSearch:', result.showTabQuickSearch);
                self.mainNavItems.forEach(function(mainNavItem){
                    //console.log('tabInfo.tabTitle:', tabInfo.tabTitle)
                    if(mainNavItem.tabTitle == 'Quick Search'){
                        mainNavItem.deactivate();
                    }
                })
            })
        });
    }

    onClick() {
        let self = this;
        //jquery add click event to a li element
        this.$mainNavItems.each(function (index) {
            $(this).click(function (e) {
                console.log('top tab clicked', e);
                self.mainNavItems.forEach(function (navItem) {
                    navItem.deactivate();
                })
                let navItem = new mainNavItem($(e.currentTarget));
                console.log(navItem);
                navItem.activate();
            })
        })
    }

    //methods:
    update() {
        let self = this;
        self.mainNavItems.length = 0; //clean up the array of mainNavItem object
        this.$mainNavItems = null; //clean up the $topTabs HTML collection
        this.$mainNavItems = this.$mainNavBar.children(mainNavItemClass); //set of top tab items for navigation
        this.$mainNavItems.each(function (index) {
            let navItem = new mainNavItem($(this)); //convert each top tab element to mainNavItem Class
            self.mainNavItems.push(navItem); //
        })
    }

    setCurMainNavItem(curNavItemID) {
        this.update();
        var i;
        for (i = 0; i < this.mainNavItems.length; i++) {
            let navItem = this.mainNavItems[i];
            if (navItem.ID == curNavItemID) {
                navItem.activate();
            } else {
                navItem.deactivate();
            }
        }
    }

    // closeQuickSearchTab(tabID){
    //     this.topTabInfos.forEach(function(tabInfo){
    //         if(tabInfo.tabTitle.trim()=="Quick Search"){
    //             tabInfo.$tabLink.click();
    //             tabInfo.$tabCloseLink.click();
    //         }
    //     })
    // }
}

export class mainNavItem {
    //Class Wrapper of a top level tab ui complex, as Main Nav Item inside Main Nav Bar
    //parameter $navItem : Top Level Tab Element of HTML li
    constructor($navItem) {
        //$navItem element is a li under ul#tab-bg:
        //populate the properties:
        this.$me = $navItem; //keep the tab li element <li>
        this.$contentLink = this.$me.children('a'); //keep the tab link <a>
        this.ID = this.$contentLink.attr('href'); //keep the tabID, '#tab3', '#' is reserved
        this.contentURL = this.$contentLink.attr('url'); //keep the tab url
        this.$closeLink = this.$me.children('em'); //close the tab
        this.$Title = this.$contentLink.children('span'); //keep the tab title <span>
        this.Title = this.$Title.text().trim(); //keep the tab title text string

        //navItem Content Element: e.g. div#tab2 or iframe#tab2
        this.$Content = $(mainPanelID).children(this.ID); //keep the tab's content <element>

        //events Click:
        this.Clicked = false; //
        this.onClick();
     }
    
    //events:
    onClick() {
        let self = this;
        //jquery add click event to anchor element a
        this.$contentLink.click(function () {
            console.log('click top tab Link');
            self.Clicked = true;
            if(self.Title != 'Home') {
                self.$Content.removeAttr('style');
            }
            //self.ActiveThisTab();
        })

        this.$Title.click(function () {
            console.log('click tab span-title');
            self.Clicked = true;
            if(self.Title!='Home') {
                self.$Content.removeAttr('style');
            }
        })

        this.$me.click(function () {
            console.log('click tab li');

            self.$Content.removeAttr('style');
        })
    }

    //methods:
    activate() {
        //activate this nav item, show the nav item content
        this.$me.addClass(activeNavItemClass);
        console.log('ActivateThisTab, title, id:', this.Title, this.ID)
        this.$Content.removeClass('ui-tabs-hide');

    }

    deactivate() {
        //deactivate this nav item, hide the nav item content
        this.$me.removeClass(activeNavItemClass);
        console.log('DeactivateThisTab, title, id:', this.Title, this.ID);
        if(this.Title != 'Home'){
            this.$Content.removeAttr('style');
        }
        this.$Content.addClass('ui-tabs-hide');
    }

    syncTabToContent() {
        if (this.$Content.inlineStyle('display') === 'block') {
            this.$me.addClass(activeNavItemClass)
        } else {
            if (this.$Content.hasClass('ui-tabs-hide')) {
                this.$me.removeClass(activeNavItemClass)
            } else {
                //this.$tab.addClass(activeTabClass)
            }
        }
        console.log('syncTabToContent, title, id:', this.$me, this.Title, this.ID);
    }
}