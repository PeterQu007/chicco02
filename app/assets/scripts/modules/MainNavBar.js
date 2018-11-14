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
const subContentPanelClass = '.ui-tabs-panel'; //tab content panel class

//const savedPropertySearches = 'iframe#tab2';

// export class MainTabSwitcher {
//     constructor(){
//         this.$mainTabSwitcher = $(mainPanelID);
//         this.$mainNavBar = $(mainNavBarID);
        
//     }
// }

export default class MainNavBar {
    constructor() {
        this.$mainNavBar = $(mainNavBarID);
        this.$mainNavItems = this.$mainNavBar.children(mainNavItemClass); //set of top tap ui HTML elements
        this.$subContentPanels = $(mainPanelID).children(subContentPanelClass);
        this.mainNavItems = []; //set of class of mainNavItems
        this.curNavItem = null; //current active tab(NavItem)
        this.lockedNavItem = null; //current locked tab(NavItem)
        this.init(); //update the NavItems

        this.enableOnAddNewNavItem = false; //disable onAddNewTab event in the init
        this.onAddNewNavItem();
        //this.onRemoveNavItem();
        //this.onAddNewSubContentPanel();
        // this.update();
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
                
                let newNavItemID = $navItem.children('a').attr('href'); //get tabID
                let newNavItem = new mainNavItem($navItem);
                newNavItem.parent = self;
                console.warn('[Class.TopTabs]onAddNewTab===>New Tab added, newTabID:', newNavItemID, $navItem, $navItem.parent().attr('id'));
                //self.updateTopTabInfos(newTabID);
                //self.setCurMainNavItem(newNavItemID); //updateTopTabInfos, and set Current tab
                self.$mainNavItems.push($navItem);
                self.mainNavItems.push(newNavItem);
                self.update();
            }
        });
    }

    onAddNewSubContentPanel() {
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
            if(self.enableOnAddNewNavItem && $tabContent.parent().attr('id')=='app_tab_switcher') {
                self.$subContentPanels.push(this);
            }
            // chrome.storage.sync.get('showTabQuickSearch',function(result){
            //     //console.log('Class.TopTabs.onAddNewTabContent::get showTabQuickSearch:', result.showTabQuickSearch);
            //     self.mainNavItems.forEach(function(mainNavItem){
            //         //console.log('tabInfo.tabTitle:', tabInfo.tabTitle)
            //         if(mainNavItem.tabTitle == 'Quick Search'){
            //             mainNavItem.deactivate();
            //         }
            //     })
            // })
        });
    }

    onClick() {
        //mainNavBar Click event
        let self = this;
        this.$mainNavBar.click(function(){
            self.update();
        })
    }

    //methods:
    init() {
        let self = this;
        this.mainNavItems.length = 0; //clean up the array of mainNavItem object
        this.curNavItem = null;
        this.lockedNavItem = $(null);
        this.$mainNavItems = null; //clean up the $topTabs HTML collection
        this.$mainNavItems = this.$mainNavBar.children(mainNavItemClass); //set of top tab items for navigation
        //populate the mainNavItems
        this.$mainNavItems.each(function (index) {
            let navItem = new mainNavItem($(this)); //convert each top tab element to mainNavItem Class
            navItem.parent = self;
            self.mainNavItems.push(navItem); //
            if(navItem.active){
                self.curNavItem = navItem;
            }
            if(navItem.locked){
                self.lockedNavItem = navItem;
            }
        })
    }

    update(removeSubPanelStyle) {
        let self = this;
        
        this.curNavItem = null;
        this.lockedNavItem = $(null);

        if(removeSubPanelStyle){
            // self.$subContentPanels.each(function(){
            //     if (this.id !='HomeTab'){  //do not change Home Tab
            //         this.removeAttribute('style');
            //     }
            // });
            self.mainNavItems.forEach(function(item,index){
                if(item.tabID != '#HomeTab'){
                    item.$tabContent.removeAttr('style');
                }
            })
        }
       
        this.mainNavItems.forEach(function (item) {
            if(item.$me.hasClass('ui-tabs-selected') && item.$me.hasClass('ui-state-active')){
                item.active = true;
            }else{
                item.active = false;
            }
           
            if(item.active){
                self.curNavItem = item;
            }
            if(item.locked){
                self.lockedNavItem = item;
            }
        })

        console.log("main Nav Bar updated!");
        console.log("active nav item is: ", self.curNavItem.Title);
        console.log("locked Nav Item is: ", self.lockedNavItem.Title);
    }

    removeNavItem(tabID){
        
        var self = this;
        var $removeItem = null;
        var $removeContent = null;
        var removeItemPosition = 0;

        this.mainNavItems.forEach(function(item,index){
            if(item.tabID == tabID){
                $removeItem = item.$me;
                $removeContent = item.$tabContent;
                removeItemPosition = index;
                self.mainNavItems.splice(index,1);
            }
            if(item.tabID != '#HomeTab'){
                item.$tabContent.removeAttr('style');
            }
        })
        this.$mainNavItems.splice(removeItemPosition,1);
        // this.$subContentPanels.splice(removeItemPosition,1);
    }

    addLock(tabID){
        
        var self = this;
        this.removeLock();

        this.mainNavItems.forEach(function(item){
            if(item.tabID == tabID){
                item.$tabContent.attr("style","display: block!important");
                self.lockedNavItem = item;
            }else{
                if(item.tabID != '#HomeTab'){
                    item.$tabContent.attr("style","display: none!important");
                }
            }
        })

    }

    removeLock(){
        //remove lock to the tab's content panel
        //var $navBar = $(mainPanelID).children('mainNavBarID');
        var $contents = $(mainPanelID).children('subContentPanelClass');
        $contents.each(function(){
            if ($contents.id != 'HomeTab'){
                this.removeAttribute('style');
            }
        })
        // $contents.removeAttr("style","display: block!important"); //unlock all tab contents
        // $contents.removeAttr("style","display: none!important"); //remove added attrs
        this.lockedNavItem = $(null);
    }
   
}

export class mainNavItem {
    //Class Wrapper of a top level tab ui complex, as Main Nav Item inside Main Nav Bar
    //parameter $navItem : Top Level Tab Element of HTML li
    constructor($navItem) {
        //$navItem element is a li under ul#tab-bg:
        //populate the properties:
        this.parent = null; //parent class
        this.$me = $navItem; //keep the tab li element <li>
        this.$contentLink = this.$me.children('a'); //keep the tab link <a>
        this.tabID = this.$contentLink.attr('href'); //keep the tabID, '#tab3', '#' is reserved
        this.contentURL = this.$contentLink.attr('url'); //keep the tab url
        this.$closeLink = this.$me.children('em'); //close the tab
        this.$Title = this.$contentLink.children('span'); //keep the tab title <span>
        this.Title = this.$Title.text().trim(); //keep the tab title text string
        //navItem Content Element: e.g. div#tab2 or iframe#tab2
        this.$tabContent = $(mainPanelID).children(this.tabID); //keep the tab's content <element>

        //navItem Status: active or inactive?
        this.active = false;
        this.locked = false;
        if(this.$me.hasClass('ui-tabs-selected') && this.$me.hasClass('ui-state-active')){
            this.active = true;
        }
        //events Click:
        this.clicked = false; //
        this.onClick();
        this.onClose();
     }
    
    //events:
    onClick() {
        let self = this;
        //jquery add click event to anchor element a
        this.$contentLink.on('click', function () {
            console.log('click top tab Link: ', self.Title, ' ', self.tabID);
            self.clicked = true;
            
            if(self.tabID != '#HomeTab'){
                self.$tabContent.removeAttr('style');
            }
 
            if(self.$me.hasClass('ui-tabs-selected') && self.$me.hasClass('ui-state-active')){
                self.active = true;
                console.log(self.Title, self.tabID, " is active and selected");
            }
            var removeSubPanelStyle = true;
            self.parent.update(removeSubPanelStyle);
        })
    }

    onClose(){
        let self = this;

        this.$closeLink.on('click', function(){
            console.log("close a tab", self.tabID);
            self.parent.removeNavItem(self.tabID);
            self.parent.update();
        })
    }

    //methods:
    addLock() {
        //add lock to the tab's content panel
        var $navBar = $(mainPanelID).children('mainNavBarID');
        var $contents = $(mainPanelID).children('subContentPanelClass');
        $contents.removeAttr("style","display: block!important"); //unlock all tab contents
        $contents.attr("style", "display: none!important"); //hide all sub panles
        self.$tabContent.removeAttr("style","display: none!important"); //show this tab content
        self.$tabContent.attr("style","display: block!important"); //lock this tab content
        chrome.storage.sync.set({curTabID: this.tabID});
        self.locked = true;
    }

    removeLock(){
        //remove lock to the tab's content panel
        var $navBar = $(mainPanelID).children('mainNavBarID');
        var $contents = $(mainPanelID).children('subContentPanelClass');
        $contents.removeAttr("style","display: block!important"); //unlock all tab contents
        $contents.removeAttr("style","display: none!important"); //remove added attrs
        self.locked = false;
    }

    activate() {
        //activate this nav item, show the nav item content
        this.$me.addClass(activeNavItemClass);
        console.log('ActivateThisTab, title, id:', this.Title, this.tabID)
        this.$tabContent.removeClass('ui-tabs-hide');

    }

    deactivate() {
        //deactivate this nav item, hide the nav item content
        this.$me.removeClass(activeNavItemClass);
        console.log('DeactivateThisTab, title, id:', this.Title, this.tabID);
        if(this.Title != 'Home'){
            this.$tabContent.removeAttr('style');
        }
        this.$tabContent.addClass('ui-tabs-hide');
    }
}