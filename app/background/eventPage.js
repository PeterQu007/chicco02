//background script, event mode
//message passed between background - defaultpage - iframes

import database from "../assets/scripts/modules/Database";
import { callbackify } from "util";

var db = new database();
var $fx = L$();
var newTaxYear = false; //beginning of new year, MLS tax db has not been updated, still use last year's assess. set newTaxYear to false
var d = new Date();
var taxYear = d.getFullYear();
taxYear = newTaxYear ? taxYear : taxYear - 1;
var complexInfoSearchResult = null;

console.clear();

(function() {
  //console.log("Hello!-1");

  chrome.storage.sync.set({
    landValue: 0,
    improvementValue: 0,
    totalValue: 0,
    curTabID: null,
    taxYear: taxYear
  });

  chrome.browserAction.onClicked.addListener(function(activeTab) {
    //open a link
    var newURL = "http://idp.gvfv.clareitysecurity.net/idp/Authn/UserPassword";
    //var newURL = "http://stackoverflow.com/"
    chrome.tabs.create({ url: newURL });
  });

  chrome.webNavigation.onCompleted.addListener(
    function(details) {
      //console.log("Completed!");
      //alert("Completed!");
    },
    {
      url: [{ hostContains: ".paragonrels.com" }]
    }
  );

  //receive message from iframes, then transfer the message to Main Page content script
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log("onMessage.eventPage got a message", request);

    //message from Warning iframe
    if (request.todo == "warningMessage") {
      //console.log("I got the warning message!");
      //pass the message to defaultpage(Main Home Page)
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { todo: "ignoreWarning" });
      });
    }

    //message from Logout iframe
    if (request.todo == "logoutMessage") {
      //console.log("I got logout message!");
      //pass the message to defaultpage(Main Home Page)
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { todo: "logoutMLS" });
      });
    }

    if (request.todo == "switchTab") {
      console.log("I got switch Tab message!");
      //pass the message to defaultpage(Main Home Page)
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          todo: "switchTab",
          showResult: request.showResult,
          saveResult: request.saveResult
        });
      });

      sendResponse("switchTab done!!!");
    }

    if (request.todo == "taxSearch") {
      //get request to search tax info of Property with PID saved to storage
      //console.log(">>>I got tax search command!");
      try {
        chrome.storage.sync.get("PID", function(result) {
          //check database, if assess exist, send it back
          //console.log(">>>PID is: ", result.PID);
          var taxID = result.PID + "-" + taxYear;
          var requester = request.from;
          db.readAssess(taxID, function(assess) {
            //console.log(">>>read from , assess is: ", assess)
            if (!assess) {
              //other wise , send out tax research command:
              try {
                chrome.tabs.query(
                  { active: true, currentWindow: true },
                  function(tabs) {
                    try {
                      chrome.tabs.sendMessage(tabs[0].id, {
                        todo: "taxSearchFor" + requester
                      });
                    } catch (err) {
                      console.error("taxSearch Errors in Background: ", err);
                    }
                  }
                );
              } catch (err) {
                console.error("taxSearch Errors: ", err);
              }
            } else {
              if (String(assess.from).indexOf("taxSearchFor" + requester) < 0) {
                assess.from = assess.from + "-taxSearchFor" + requester;
              }
              chrome.storage.sync.set(assess);
            }
          });
        });
        sendResponse(">>>tax search has been processed in EventPage: ");
      } catch (err) {
        sendResponse(">>>tax search gets errors in EventPage: ");
      }
    }

    if (request.todo == "searchStrataPlanSummary") {
      //get request to search tax info of Property with PID saved to storage
      //console.log(">>>I got search StrataPlanSummary command!");

      chrome.storage.sync.get(["strataPlan", "complexName"], function(result) {
        //check database, if assess exist, send it back
        //console.log(">>>strataPlan is: ", result.strataPlan);
        var strataPlan = result.strataPlan;
        var complexName = result.complexName;
        if (!strataPlan || strataPlan == "PLAN" || strataPlan == "PL") {
          return;
        }
        var today = $fx.getToday();
        db.readStrataPlanSummary(strataPlan + "-" + today, function(
          strataPlanSummaryToday
        ) {
          //console.log(">>>read from , strataPlanSummary is: ", strataPlanSummaryToday)
          if (!strataPlanSummaryToday) {
            //other wise , send out tax research command:
            chrome.tabs.query({ active: true, currentWindow: true }, function(
              tabs
            ) {
              chrome.tabs.sendMessage(tabs[0].id, {
                todo: "searchComplex",
                showResult: true,
                saveResult: true,
                strataPlan: strataPlan,
                complexName: complexName
              });
            });
          }
        });
      });
      sendResponse(">>>complex search has been processed in eventpage: ");
    }

    if (request.todo == "searchComplex") {
      var complexID = request._id;
      var requestFrom = request.from;
      delete request.from;
      var complexInfo = request;

      db.readComplex(complexInfo, function(cInfo) {
        //console.log('>>>read the complex info from database:', complexInfo);
        if (cInfo) {
          if (cInfo.name.length > 0) {
            cInfo.from += "-" + requestFrom;
            cInfo.complexName = cInfo.name;
          } else {
            cInfo.from += "-" + requestFrom;
            cInfo.complexName = "";
          }

          chrome.storage.sync.set(cInfo, function() {
            console.log("complexInfo is: ", cInfo);
          });
        } else {
          //error for complexInfo
          console.log("Complex Name does not exist in Database");
        }
      });
    }

    if (request.todo == "saveComplex") {
      var complexID = request._id;
      if (request.complexName.trim().length > 0) {
        db.writeComplex(request);
      }
    }

    if (request.todo == "searchExposure") {
      var requestFrom = request.from;
      delete request.from;
      var exposureInfo = request;

      db.readExposure(exposureInfo, function(cInfo) {
        console.log(">>>read the exposure info from database:", exposureInfo);
        if (cInfo) {
          if (cInfo.name.length > 0) {
            cInfo.from += "-" + requestFrom;
            cInfo.exposureName = cInfo.name;
          } else {
            cInfo.from += "-" + requestFrom;
            cInfo.exposureName = "";
          }

          chrome.storage.sync.set(cInfo, function() {
            console.log("exposureInfo is: ", cInfo);
          });
        } else {
          //error for exposureInfo
          console.log("Exposure Name does not exist in Database");
        }
      });
    }

    if (request.todo == "saveExposure") {
      console.log("write exposure info");
      var exposureID = request._id;
      if (request.exposureName.trim().length > 0) {
        db.writeExposure(request);
      }
    }

    // Listing
    if (request.todo == "searchListing") {
      var requestFrom = request.from;
      delete request.from;
      var listingInfo = request;

      db.readListing(listingInfo, function(cInfo) {
        console.log(">>>read the listing info from database:", listingInfo);
        if (cInfo) {
          if (cInfo.name.length > 0) {
            cInfo.from += "-" + requestFrom;
            cInfo.listingName = cInfo.name;
          } else {
            cInfo.from += "-" + requestFrom;
            cInfo.listingName = "";
          }

          chrome.storage.sync.set(cInfo, function() {
            console.log("listingInfo is: ", cInfo);
          });
        } else {
          //error for listingInfo
          console.log("Listing Name does not exist in Database");
        }
      });
    }

    if (request.todo == "saveListing") {
      console.log("write listing info");
      var listingID = request._id;
      if (request.listingName.trim().length > 0) {
        db.writeListing(request);
      }
    }

    // Showing Info
    if (request.todo == "searchShowing") {
      var requestFrom = request.from;
      delete request.from;
      var showingInfo = request;

      db.readShowing(showingInfo, function(cInfo) {
        console.log(">>>read the showing info from database:", showingInfo);
        if (cInfo) {
          if (cInfo.name.length > 0) {
            cInfo.from += "-" + requestFrom;
            cInfo.name = cInfo.name;
          } else {
            cInfo.from += "-" + requestFrom;
            cInfo.name = "";
          }

          chrome.storage.sync.set(cInfo, function() {
            console.log("showingInfo is: ", cInfo);
          });
        } else {
          //error for listingInfo
          console.log("Showing Name does not exist in Database");
        }
      });
    }

    if (request.todo == "saveShowing") {
      console.log("write showing info");
      var showingID = request._id;
      if (request.name.trim().length > 0) {
        db.writeShowing(request);
      }
    }

    //

    if (request.todo == "saveTax") {
      //console.log(">>>I got save tax info: ");
      var assess = request.taxData;
      assess._id = assess.PID + "-" + taxYear;
      db.writeAssess(assess);
      sendResponse(assess);
    }

    if (request.todo == "saveStrataPlanSummary") {
      //console.log(">>>I got save Complex info: ");
      var spSummary = request.spSummaryData;
      db.writeStrataPlanSummary(spSummary);
      sendResponse(spSummary);
    }

    if (request.todo == "updateTopLevelTabMenuItems") {
      console.log("I got Update Top Level Tab Menu Items Command!");

      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          todo: "updateTopLevelTabMenuItems"
        });
      });

      sendResponse("Update Top Level Tab Menu Items Command sent out!");
    }

    if (request.todo == "readCurTabID") {
      console.log("New Command: readCurTabID");

      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { todo: "readCurTabID" });
      });

      sendResponse("readCurTabID Command sent out!");
    }

    if (request.todo == "syncTabToContent") {
      console.log("New Command: syncTabToContent");

      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { todo: "syncTabToContent" });
      });
    }

    if (request.todo == "hideQuickSearch") {
      console.log("New Command: showQuickSearch");

      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          todo: "hideQuickSearch",
          tabID: request.tabID
        });
      });
    }

    if (request.todo == "getTabTitle") {
      console.log("Command: ", request.todo, request.from);
      let result = null;
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { todo: "getTabTitle", tabID: request.tabID },
          function(response) {
            result = response;
            console.log("getTabTitle response:", response);
            chrome.storage.sync.set({
              getTabID: result.tabID,
              getTabTitle: result.tabTitle,
              todo: "getTabTitle" + Math.random().toFixed(8),
              from: "EventPage.getTabTitle"
            });
            sendResponse(response);
          }
        );
      });
      //check(result); //wait for 1 sec, stop eventPage hit the exit point, send out null response
    }

    if (request.todo == "addLock") {
      //get command from sub content script to add lock to the sub content panel
      console.log("Command: ", request.todo, request.from, request.tabID);
      let result = null;
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { todo: "addLock", tabID: request.tabID },
          function(response) {
            result = response;
            console.log("addLock response:", response);
            // chrome.storage.sync.set(
            // 	{getTabID:result.tabID,
            // 	getTabTitle:result.tabTitle,
            // 	todo: 'getTabTitle'+Math.random().toFixed(8),
            // 	from: 'EventPage.getTabTitle'});
            sendResponse(response);
          }
        );
      });
    }
  });

  //End of Main Function
})();
