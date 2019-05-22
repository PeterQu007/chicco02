/******/ (function(modules) {
  // webpackBootstrap
  /******/ // The module cache
  /******/ var installedModules = {}; // The require function

  /******/ /******/ function __webpack_require__(moduleId) {
    /******/ // Check if module is in cache
    /******/ if (installedModules[moduleId])
      /******/ return installedModules[moduleId].exports; // Create a new module (and put it into the cache)

    /******/ /******/ var module = (installedModules[moduleId] = {
      /******/ exports: {},
      /******/ id: moduleId,
      /******/ loaded: false
      /******/
    }); // Execute the module function

    /******/ /******/ modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    ); // Flag the module as loaded

    /******/ /******/ module.loaded = true; // Return the exports of the module

    /******/ /******/ return module.exports;
    /******/
  } // expose the modules object (__webpack_modules__)

  /******/ /******/ __webpack_require__.m = modules; // expose the module cache

  /******/ /******/ __webpack_require__.c = installedModules; // __webpack_public_path__

  /******/ /******/ __webpack_require__.p = ""; // Load entry module and return exports

  /******/ /******/ return __webpack_require__(0);
  /******/
})(
  /************************************************************************/
  /******/ [
    /* 0 */
    /***/ function(module, exports, __webpack_require__) {
      "use strict";

      var _mlsTabs = __webpack_require__(1);

      var _mlsTabs2 = _interopRequireDefault(_mlsTabs);

      var _MainNavBar = __webpack_require__(2);

      var _MainNavBar2 = _interopRequireDefault(_MainNavBar);

      var _MainMenu = __webpack_require__(3);

      var _MainMenu2 = _interopRequireDefault(_MainMenu);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      (function($) {
        $.fn.inlineStyle = function(prop) {
          return this.prop("style")[$.camelCase(prop)];
        };
      })(jQuery); // works with Paragon's main window
      // inject to Paragon's Url: http://bcres.paragonrels.com/ParagonLS/Default.mvc*
      // the messages are passed between the defaultpage and iframes, all are the content scripts

      var DefaultPage = {
        init: function init() {
          // Open frequently used tabs:
          this.mainMenu.openTaxSearch();
          this.mainMenu.openSavedSearches();
          this.mainNavBar = new _MainNavBar2.default();
          //console.log(this.topTabs);
          this.onMessage();
          this.onChanged();
        },

        mainMenu: new _MainMenu2.default(),
        tabs: new _mlsTabs2.default(),
        mainNavBar: null,

        onMessage: function onMessage() {
          (function(self) {
            chrome.runtime.onMessage.addListener(function(
              request,
              sender,
              sendResponse
            ) {
              // get Warning message: the search results exceed the limit, ignore it
              if (request.todo == "ignoreWarning") {
                var checkCount = function checkCount() {
                  // #OK button, "Continue", belongs to default page
                  if (document.querySelector("#OK")) {
                    clearInterval(countTimer);
                    var btnOK = $("#OK");
                    //console.log('OK', btnOK);
                    btnOK.click();
                  }
                };

                // Warning Form is a special page, the buttons are in the div,
                // the iframe is separate with the buttons
                // this message sent from mls-warning.js
                //console.log('Main Home ignore warning message!', $('#OK'));
                var countTimer = setInterval(checkCount, 100);
              }

              // Logout MLS Windows shows an annoying confirm box, pass it
              // The message sent from logout iframe , the buttons are inside the iframe
              if (request.todo == "logoutMLS") {
                var _checkCount = function _checkCount() {
                  // the button is inside the iframe, this iframe belongs to default page
                  if (document.querySelector("#confirm")) {
                    clearInterval(countTimer);
                    var btnYes = $("#confirm");
                    //console.log('confirm', btnYes);
                    btnYes.click();
                  }
                };

                //console.log('Main Home got logout message!');
                //console.log($('#confirm'));
                var countTimer = setInterval(_checkCount, 100);
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
                console.log(
                  "default home page read top level tabs: ",
                  self.tabs
                );
                self.curTabLink = $(
                  "ul#tab-bg li.ui-tabs-selected.ui-state-active a"
                );
                self.curTabID = self.curTabLink.attr("href");
                console.log("current Tab ID is: ", self.curTabID);
                // save the curTabID
                chrome.storage.sync.set(
                  { curTabID: self.curTabID },
                  function() {
                    console.log("curTabID has been save to storage.");
                  }
                );
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
                console.group(
                  "defaultPage.hideQuickSearch.tabID:",
                  request.tabID
                );
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
                    sendResponse({
                      tabID: navItem.ID,
                      tabTitle: navItem.Title
                    });
                  }
                });
                console.groupEnd();
              }

              //close quicksearchTab
              // if (request.todo == 'closeQuickSearchTab') {
              //     console.group('closeQuickSearchTab', request.from);
              //     self.topTabs.closeQuickSearchTab();
              //     console.groupEnd();
              // }
            });
          })(this);
        },
        onChanged: function onChanged() {
          var self = this;
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
        }
      };

      // Start point
      $(function() {
        DefaultPage.init();
      });

      /***/
    },
    /* 1 */
    /***/ function(module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var _createClass = (function() {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }
        return function(Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      })();

      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }

      //Class Tabs for the default main page of Paragon
      //get the tab elements, containers, links
      //keep the state of the current tab
      //to Active the top tab, add classes: ui-tabs-selected ui-state-active
      //to DeActive the top tab, remove the classes: ui-tabs-selected ui-state-active

      var Tabs = (function() {
        function Tabs() {
          _classCallCheck(this, Tabs);

          //get the Top Level tabs Container
          this.topTabsContainer = $("ul#tab-bg");
          //Container for sub tabs under the Top Level Tabs
          this.subTabsContainer = null;
          this.topTabs = $("ul#tab-bg li");
          this.topTabLinks = $("ul#tab-bg li a");
          this.curTopTabLink = $(
            "ul#tab-bg li.ui-tabs-selected.ui-state-active a"
          );
          this.curTopTabID = this.curTopTabLink.attr("href");
          //console.info('New Tabs Class works now...');
          //add event listeners
          this.OnClick_topTabsContainer();
          //this.onMessage();
        }

        _createClass(Tabs, [
          {
            key: "OnClick_topTabsContainer",
            value: function OnClick_topTabsContainer() {
              var self = this;
              this.topTabsContainer.click(function() {
                self.subTabsContainer = $("div.ui-tabs-sub");
                self.subTabsContainer.removeAttr("style");
                console.log("[mlsTab].remove Style Display Attr");
                console.log("Test Break Point");
              });
            }
          }
        ]);

        return Tabs;
      })();

      exports.default = Tabs;

      /***/
    },
    /* 2 */
    /***/ function(module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var _createClass = (function() {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }
        return function(Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      })();

      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }

      //Class Wrapper mainNavBar for Top Level Tabs Container - Main Navigation Bar(mainNav)
      //Top Level Tabs Container(mainNavBar) is an HTML Elements ul Complex inside top level URL:
      //https://bcres.paragonrels.com/ParagonLS/Default.mvc#2
      //mainNavBar contains mainNavItem - individual topTab ui Complexes
      //sub Class Wrapper mainNavItem for topTab ui Complex

      var mainPanelID = "div#app_tab_switcher"; //Top Level Panel Container of TopTab mainNav & subContent Selector ID
      var mainNavBarID = "ul#tab-bg"; //Top Tabs Main Navigation Selector ID
      var newMainNavItemClass = ".ui-corner-top"; //Top Tab li element class
      var mainNavItemClass = "li.ui-state-default.ui-corner-top"; //Top Tab li element class
      var activeNavItemClass = "ui-tabs-selected ui-state-active"; //Current Active Top Tab Selector Class

      //const savedPropertySearches = 'iframe#tab2';

      var MainNavBar = (function() {
        function MainNavBar() {
          _classCallCheck(this, MainNavBar);

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

        _createClass(MainNavBar, [
          {
            key: "onAddNewNavItem",
            value: function onAddNewNavItem() {
              //event will be triggered by adding new tab with class ".ui-corner-top" (mainNavItemClass)
              //goggle: jquery detecting div of certain class has been added to DOM
              var self = this;
              $.initialize(newMainNavItemClass, function() {
                var $navItem = $(this);
                //if added $tab is the top tab item, then update the mainNavItem:
                if (
                  self.enableOnAddNewNavItem &&
                  $navItem.parent().attr("id") == "tab-bg"
                ) {
                  var newNavItemID = $navItem.children("a").attr("href");
                  console.warn(
                    "[Class.TopTabs]onAddNewTab===>New Tab added, newTabID:",
                    newNavItemID,
                    $navItem,
                    $navItem.parent().attr("id")
                  );
                  //self.updateTopTabInfos(newTabID);
                  self.setCurMainNavItem(newNavItemID); //updateTopTabInfos, and set Current tab
                }
              });
            }
          },
          {
            key: "onAddNewNavItemContent",
            value: function onAddNewNavItemContent() {
              //event will be triggered by adding new tab with class ui-corner-top
              //goggle: jquery detecting div of certain class has been added to DOM
              var self = this;
              $.initialize(".ui-tabs-sub", function() {
                var $tabContent = $(this);
                //if added $tab is the top tab, then update the topTabInfos:
                //if(self.EnableOnAddNewTab && $tab.parent().attr('id')=="tab-bg") {
                //console.warn('Class.TopTabs.onAddNewTabContent===>New TabContent added', $tabContent, $tabContent.parent().attr('id'));
                //    self.updateTopTabInfos();
                //}
                chrome.storage.sync.get("showTabQuickSearch", function(result) {
                  //console.log('Class.TopTabs.onAddNewTabContent::get showTabQuickSearch:', result.showTabQuickSearch);
                  self.mainNavItems.forEach(function(mainNavItem) {
                    //console.log('tabInfo.tabTitle:', tabInfo.tabTitle)
                    if (mainNavItem.tabTitle == "Quick Search") {
                      mainNavItem.deactivate();
                    }
                  });
                });
              });
            }
          },
          {
            key: "onClick",
            value: function onClick() {
              var self = this;
              //jquery add click event to a li element
              this.$mainNavItems.each(function(index) {
                $(this).click(function(e) {
                  console.log("top tab clicked", e);
                  self.mainNavItems.forEach(function(navItem) {
                    navItem.deactivate();
                  });
                  var navItem = new mainNavItem($(e.currentTarget));
                  console.log(navItem);
                  navItem.activate();
                });
              });
            }

            //methods:
          },
          {
            key: "update",
            value: function update() {
              var self = this;
              self.mainNavItems.length = 0; //clean up the array of mainNavItem object
              this.$mainNavItems = null; //clean up the $topTabs HTML collection
              this.$mainNavItems = this.$mainNavBar.children(mainNavItemClass); //set of top tab items for navigation
              this.$mainNavItems.each(function(index) {
                var navItem = new mainNavItem($(this)); //convert each top tab element to mainNavItem Class
                self.mainNavItems.push(navItem); //
              });
            }
          },
          {
            key: "setCurMainNavItem",
            value: function setCurMainNavItem(curNavItemID) {
              this.update();
              var i;
              for (i = 0; i < this.mainNavItems.length; i++) {
                var navItem = this.mainNavItems[i];
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
        ]);

        return MainNavBar;
      })();

      exports.default = MainNavBar;

      var mainNavItem = (exports.mainNavItem = (function() {
        //Class Wrapper of a top level tab ui complex, as Main Nav Item inside Main Nav Bar
        //parameter $navItem : Top Level Tab Element of HTML li
        function mainNavItem($navItem) {
          _classCallCheck(this, mainNavItem);

          //$navItem element is a li under ul#tab-bg:
          //populate the properties:
          this.$me = $navItem; //keep the tab li element <li>
          this.$contentLink = this.$me.children("a"); //keep the tab link <a>
          this.ID = this.$contentLink.attr("href"); //keep the tabID, '#tab3', '#' is reserved
          this.contentURL = this.$contentLink.attr("url"); //keep the tab url
          this.$closeLink = this.$me.children("em"); //close the tab
          this.$Title = this.$contentLink.children("span"); //keep the tab title <span>
          this.Title = this.$Title.text().trim(); //keep the tab title text string

          //navItem Content Element: e.g. div#tab2 or iframe#tab2
          this.$Content = $(mainPanelID).children(this.ID); //keep the tab's content <element>

          //events Click:
          this.Clicked = false; //
          this.onClick();
        }

        //events:

        _createClass(mainNavItem, [
          {
            key: "onClick",
            value: function onClick() {
              var self = this;
              //jquery add click event to anchor element a
              this.$contentLink.click(function() {
                console.log("click top tab Link");
                self.Clicked = true;
                if (self.Title != "Home") {
                  self.$Content.removeAttr("style");
                }
                //self.ActiveThisTab();
              });

              this.$Title.click(function() {
                console.log("click tab span-title");
                self.Clicked = true;
                if (self.Title != "Home") {
                  self.$Content.removeAttr("style");
                }
              });

              this.$me.click(function() {
                console.log("click tab li");

                self.$Content.removeAttr("style");
              });
            }

            //methods:
          },
          {
            key: "activate",
            value: function activate() {
              //activate this nav item, show the nav item content
              this.$me.addClass(activeNavItemClass);
              console.log("ActivateThisTab, title, id:", this.Title, this.ID);
              this.$Content.removeClass("ui-tabs-hide");
            }
          },
          {
            key: "deactivate",
            value: function deactivate() {
              //deactivate this nav item, hide the nav item content
              this.$me.removeClass(activeNavItemClass);
              console.log("DeactivateThisTab, title, id:", this.Title, this.ID);
              if (this.Title != "Home") {
                this.$Content.removeAttr("style");
              }
              this.$Content.addClass("ui-tabs-hide");
            }
          },
          {
            key: "syncTabToContent",
            value: function syncTabToContent() {
              if (this.$Content.inlineStyle("display") === "block") {
                this.$me.addClass(activeNavItemClass);
              } else {
                if (this.$Content.hasClass("ui-tabs-hide")) {
                  this.$me.removeClass(activeNavItemClass);
                } else {
                  //this.$tab.addClass(activeTabClass)
                }
              }
              console.log(
                "syncTabToContent, title, id:",
                this.$me,
                this.Title,
                this.ID
              );
            }
          }
        ]);

        return mainNavItem;
      })());

      /***/
    },
    /* 3 */
    /***/ function(module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var _createClass = (function() {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }
        return function(Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      })();

      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }

      //define the paragon mls Main Menu Class
      //store the frequently used menu function links in the class

      var MainMenu = (function() {
        function MainMenu() {
          _classCallCheck(this, MainMenu);

          this.appBanner = $("#app_banner");
          this.appLeftBanner = $("#app_banner_links_left");
          this.appRightBanner = $("#app_banner_links_right");
          this.appMidBanner = $('<div id = "app_banner_mid"></div>');
          this.appMainMenu = $("#app_banner_menu");
          this.chkLanguage = $(
            `<div class="languagebox"><div id="reportlanguage"><label>cn</label><input type="checkbox" name="checkbox" style="width: 14px!important" /></div></div>`
          );
          this.chkLanguage.insertAfter(this.appLeftBanner);
          this.chkStopSearch = $(
            `<div class="languagebox"><div id="stopsearch"><label>stop</label><input type="checkbox" name="checkbox" style="width: 14px!important" /></div></div>`
          );
          this.chkStopSearch.insertAfter(this.appLeftBanner);
          this.taxSearch = $(
            'a[url="/ParagonLS/Search/Tax.mvc?DBid=1&countyID=1"]'
          );
          this.savedSearches = $(
            'a[url="/ParagonLS/Search/Property.mvc/LoadSavedSearch"]'
          );
          //console.info('New Main Menu Class works!');

          //add the tabs object to Main Menu.
          //this.tabs = new Tabs();
        }

        _createClass(MainMenu, [
          {
            key: "openTaxSearch",
            value: function openTaxSearch() {
              this.taxSearch[0].click();
            }
          },
          {
            key: "openSavedSearches",
            value: function openSavedSearches() {
              this.savedSearches[0].click();
            }
          }
        ]);

        return MainMenu;
      })();

      exports.default = MainMenu;

      /***/
    }
    /******/
  ]
);
