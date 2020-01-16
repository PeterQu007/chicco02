// works with Paragon's main window
// inject to Paragon's Url: http://bcres.paragonrels.com/ParagonLS/Default.mvc*
// the messages are passed between the defaultpage and iframes, all are the content scripts

//import Tabs from '../assets/scripts/modules/mlsTabs';
import MainNavBar, { mainNavItem } from "../assets/scripts/modules/MainNavBar";
import MainMenu from "../assets/scripts/modules/MainMenu";

(function($) {
  $.fn.inlineStyle = function(prop) {
    return this.prop("style")[$.camelCase(prop)];
  };
})(jQuery);

let DefaultPage = {
  init: function() {
    // Define Debug
    var DEBUG = false;
    if (!DEBUG) {
      if (!window.console) window.console = {};
      var methods = ["log", "debug", "warn", "info"];
      for (var i = 0; i < methods.length; i++) {
        console[methods[i]] = function() {};
      }
    }
    // Open frequently used tabs:
    this.mainMenu.openTaxSearch();
    this.mainMenu.openListingCarts();
    this.mainMenu.openSavedSearches();

    this.mainNavBar = new MainNavBar();
    //console.log(this.topTabs);
    this.onMessage();
    this.onChanged();
    this.post();
  },

  mainMenu: new MainMenu(),
  //tabs: new Tabs(),
  mainNavBar: null,

  onMessage() {
    (function(self) {
      chrome.runtime.onMessage.addListener(function(
        request,
        sender,
        sendResponse
      ) {
        // get Warning message: the search results exceed the limit, ignore it
        if (request.todo == "ignoreWarning") {
          // Warning Form is a special page, the buttons are in the div,
          // the iframe is separate with the buttons
          // this message sent from mls-warning.js
          //console.log('Main Home ignore warning message!', $('#OK'));
          var countTimer = setInterval(checkCount, 100);
          function checkCount() {
            // #OK button, "Continue", belongs to default page
            if (document.querySelector("#OK")) {
              clearInterval(countTimer);
              let btnOK = $("#OK");
              //console.log('OK', btnOK);
              btnOK.click();
            }
          }
        }

        // Logout MLS Windows shows an annoying confirm box, pass it
        // The message sent from logout iframe , the buttons are inside the iframe
        if (request.todo == "logoutMLS") {
          //console.log('Main Home got logout message!');
          //console.log($('#confirm'));
          var countTimer = setInterval(checkCount, 100);
          function checkCount() {
            // the button is inside the iframe, this iframe belongs to default page
            if (document.querySelector("#confirm")) {
              clearInterval(countTimer);
              let btnYes = $("#confirm");
              //console.log('confirm', btnYes);
              btnYes.click();
            }
          }
        }

        //Top Level Tabs Changed
        if (request.todo == "updateTopLevelTabMenuItems") {
          // update tabs
          self.tabs = $("ul#tab-bg li");
          console.log("default home page update top level tabs: ", tabs);
          self.curTabLink = $(
            "ul#tab-bg li.ui-tabs-selected.ui-state-active a"
          );
          self.curTabID = curTabLink.attr("href");
          chrome.storage.sync.set({ curTabID: self.curTabID });
        }

        //Read the Current TabID
        if (request.todo == "readCurTabID") {
          // read cur tabID
          self.tabs = $("ul#tab-bg li");
          console.log("default home page read top level tabs: ", self.tabs);
          self.curTabLink = $(
            "ul#tab-bg li.ui-tabs-selected.ui-state-active a"
          );
          self.curTabID = self.curTabLink.attr("href");
          console.log("current Tab ID is: ", self.curTabID);
          // save the curTabID
          chrome.storage.sync.set({ curTabID: self.curTabID }, function() {
            console.log("curTabID has been save to storage.");
          });
        }

        //Sync Tab to Content
        if (request.todo == "syncTabToContent") {
          console.group("defaultpage.syncTabToContent");
          self.mainNavBar.topTabInfos.forEach(function(tabInfo) {
            console.info("tab in topTabInfos: ", tabInfo);
            tabInfo.syncTabToContent();
          });
          console.groupEnd();
        }

        //Hide QuickSearch Tab Content
        if (request.todo == "hideQuickSearch") {
          console.group("defaultPage.hideQuickSearch.tabID:", request.tabID);
          self.mainNavBar.topTabInfos.forEach(function(tabInfo) {
            if (tabInfo.tabID == request.tabID) {
              console.info("defaultPage.QuickSearch.tabInfo:", tabInfo);
              tabInfo.DeactivateThisTab();
            }
          });
          console.groupEnd();
        }

        //get TabTitle by TabID
        if (request.todo == "getTabTitle") {
          console.group("getTabTitle", request.tabID);
          self.mainNavBar.mainNavItems.forEach(function(navItem) {
            if (navItem.ID == request.tabID) {
              console.log("find tabTitle:", navItem.ID, navItem.Title);
              sendResponse({ tabID: navItem.ID, tabTitle: navItem.Title });
            }
          });
          console.groupEnd();
        }

        //get TabTitle by TabID
        if (request.todo == "addLock") {
          console.group("addLock", request.tabID);
          // self.mainNavBar.mainNavItems.forEach(function (navItem) {
          //     if (navItem.ID == request.tabID) {
          //         console.log('find tabTitle:', navItem.ID, navItem.Title);
          //         sendResponse({ tabID: navItem.ID, tabTitle: navItem.Title })
          //     }
          // })
          self.mainNavBar.update();
          self.mainNavBar.addLock(request.tabID);
          console.groupEnd();
        }
      });
    })(this);
  },

  onChanged() {
    let self = this;
    //listen the change from QuickSearch
    chrome.storage.onChanged.addListener(function(changes, area) {
      //hide QuickSearchTab & TabContent
      if (
        area == "sync" &&
        "todo" in changes &&
        changes.todo.newValue.indexOf("hideQuickSearch") > -1
      ) {
        console.log("onTabStatusUpdate.command::", changes.todo.newValue);
        self.mainNavBar.topTabInfos.forEach(function(tabInfo) {
          if (tabInfo.tabTitle.trim() == "Quick Search") {
            tabInfo.DeactivateThisTab();
          }
        });
      }
    });
  },

  post() {
    var title = this.mainNavBar.mainNavItems[1].Title;
    var id = this.mainNavBar.mainNavItems[1].tabID;
    console.log({ postTitle: title, postID: id });

    // $.post('http://localhost/ChromeX/MLSHelper/app/test.php', {postTitle: title, postID: id}, function(data){
    //     console.log(data);
    // })

    // http://pidrealty.local/wp-content/themes/realhomes-child/db/data.php

    // $.post(
    //   "http://pidrealty.local/wp-content/themes/realhomes-child/db/data.php",
    //   { postTitle: title, postID: id },
    //   function(data) {
    //     console.log(data);
    //   }
    // );

    $.ajax({
      url:
        "https://pidrealty.local/wp-content/themes/pidHomes-PhaseI/db/data.php",
      method: "post",
      data: { postTitle: title, postID: id },
      success: function(res) {
        console.log(res);
        $('input[name="textbox"]').val(
          JSON.stringify(res) + ":: connect to MySQL successfully!"
        );
      }
    });
  }
};

// Start point
$(function() {
  DefaultPage.init();
});
