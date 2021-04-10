//background script, event mode
//message passed between background - defaultpage - iframes
// import regeneratorRuntime from "regenerator-runtime";
import database from "../assets/scripts/modules/Database";
import dbOffline from "../assets/scripts/modules/Database Offline";
import { callbackify } from "util";
import searchTax from "./searchTax";
require("chrome-extension-async");

var db = new database();
var dbo = new dbOffline();
var $fx = L$();
var newTaxYear = true; //beginning of new year, MLS tax db has not been updated, still use last year's assess. set newTaxYear to false
var d = new Date();
var taxYear = d.getFullYear();
taxYear = newTaxYear ? taxYear : taxYear - 1;
var complexInfoSearchResult = null;
var chromeTabID;
var $today = d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate();
var mlsTable = [];

console.clear();

chrome.tabs.query({ title: "Paragon 5" }, function (tabs) {
  chromeTabID = tabs[0].id;
  console.warn("background events page chromeTabID is: ", chromeTabID);
});

tabQ();

checkUpdate();
readStoragePID();

(function () {
  initBackground().then((res) => {
    console.log(res);
  });

  chrome.browserAction.onClicked.addListener(function (activeTab) {
    //open a PARAGON PAGE IN A NEW TAB
    // var newURL = "http://idp.gvfv.clareitysecurity.net/idp/Authn/UserPassword"; //OBSOLETE PARAGON LOGIN LINK
    let newURL = "https://gvfv.clareityiam.net/idp/login";
    chrome.tabs.create({
      url: newURL,
    });
  });

  chrome.webNavigation.onCompleted.addListener(
    function (details) {
      //console.log("Completed!");
      //alert("Completed!");
    },
    {
      url: [{ hostContains: ".paragonrels.com" }],
    }
  );

  //receive message from iframes, then transfer the message to Main Page content script
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    console.log(
      `onMessage.eventPage got a message from ${sender} with ${request.from}`
    );

    //message from Warning iframe
    if (request.todo == "warningMessage") {
      //console.log("I got the warning message!");
      //pass the message to defaultpage(Main Home Page)
      console.info("Chrome Tab ID is: ", chromeTabID);
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true,
        },
        function (tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {
            todo: "ignoreWarning",
          });
        }
      );
    }

    //message from Logout iframe
    if (request.todo == "logoutMessage") {
      logOut(request);
    }

    if (request.todo == "switchTab") {
      console.log("I got switch Tab message!");
      //pass the message to defaultpage(Main Home Page)
      console.info("Chrome Tab ID is: ", chromeTabID);
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true,
        },
        function (tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {
            todo: "switchTab",
            showResult: request.showResult,
            saveResult: request.saveResult,
          });
        }
      );

      sendResponse("switchTab done!!!");
    }

    if (request.todo == "taxSearch") {
      searchTax(request, sendResponse, db);
      // taxSearch(request)
      //   .then((res) => sendResponse(res))
      //   .catch((err) => sendResponse(err));
    }

    if (request.todo == "searchStrataPlanSummary") {
      //console.log(">>>I got search StrataPlanSummary command!");

      searchStrataPlanSummary(request)
        .then((res) => sendResponse(res))
        .catch((err) => sendResponse(err));
    }

    if (request.todo == "searchComplexInfo") {
      searchComplexInfo(request)
        .then((cInfo) => console.log(cInfo))
        .catch((err) => console.log(err));
    }

    if (request.todo == "saveComplexInfo") {
      var complexID = request._id;
      if (request.complexName.trim().length > 0) {
        db.writeComplex(request);
      }
    }

    if (request.todo == "searchExposure") {
      var requestFrom = request.from;
      delete request.from;
      var exposureInfo = request;

      db.readExposure(exposureInfo, function (cInfo) {
        console.log(">>>read the exposure info from database:", exposureInfo);
        if (cInfo) {
          if (cInfo.name.length > 0) {
            cInfo.from += "-" + requestFrom;
            cInfo.exposureName = cInfo.name;
          } else {
            cInfo.from += "-" + requestFrom;
            cInfo.exposureName = "";
          }

          chrome.storage.local.set(cInfo, function () {
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

      db.readListing(listingInfo, function (cInfo) {
        console.log(">>>read the listing info from database:", listingInfo);
        if (cInfo) {
          if (cInfo.name.length > 0) {
            cInfo.from += "-" + requestFrom;
            cInfo.listingName = cInfo.name;
          } else {
            cInfo.from += "-" + requestFrom;
            cInfo.listingName = "";
          }

          chrome.storage.local.set(cInfo, function () {
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

      db.readShowing(showingInfo, function (cInfo) {
        console.log(">>>read the showing info from database:", showingInfo);
        if (cInfo) {
          if (cInfo.name.length > 0) {
            cInfo.from += "-" + requestFrom;
            cInfo.name = cInfo.name;
          } else {
            cInfo.from += "-" + requestFrom;
            cInfo.name = "";
          }

          chrome.storage.local.set(cInfo, function () {
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
      console.info("Chrome Tab ID is: ", chromeTabID);
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true,
        },
        function (tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {
            todo: "updateTopLevelTabMenuItems",
          });
        }
      );

      sendResponse("Update Top Level Tab Menu Items Command sent out!");
    }

    if (request.todo == "readCurTabID") {
      console.log("New Command: readCurTabID");
      console.info("Chrome Tab ID is: ", chromeTabID);
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true,
        },
        function (tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {
            todo: "readCurTabID",
          });
        }
      );

      sendResponse("readCurTabID Command sent out!");
    }

    if (request.todo == "syncTabToContent") {
      console.log("New Command: syncTabToContent");
      console.info("Chrome Tab ID is: ", chromeTabID);
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true,
        },
        function (tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {
            todo: "syncTabToContent",
          });
        }
      );
    }

    if (request.todo == "hideQuickSearch") {
      console.log("New Command: showQuickSearch");
      console.info("Chrome Tab ID is: ", chromeTabID);
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true,
        },
        function (tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {
            todo: "hideQuickSearch",
            tabID: request.tabID,
          });
        }
      );
    }

    if (request.todo == "getTabTitle") {
      console.log("Command: ", request.todo, request.from);
      let result = null;
      console.info("Chrome Tab ID is: ", chromeTabID);
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true,
        },
        function (tabs) {
          chrome.tabs.sendMessage(
            tabs[0].id,
            {
              todo: "getTabTitle",
              tabID: request.tabID,
            },
            function (response) {
              result = response;
              console.log("getTabTitle response:", response);
              chrome.storage.local.set({
                getTabID: result.tabID,
                getTabTitle: result.tabTitle,
                todo: "getTabTitle" + Math.random().toFixed(8),
                from: "EventPage.getTabTitle",
              });
              sendResponse(response);
            }
          );
        }
      );
      //check(result); //wait for 1 sec, stop eventPage hit the exit point, send out null response
    }

    if (request.todo == "addLock") {
      //get command from sub content script to add lock to the sub content panel
      console.log("Command: ", request.todo, request.from, request.tabID);
      let result = null;
      console.info("Chrome Tab ID is: ", chromeTabID);
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true,
        },
        function (tabs) {
          chrome.tabs.sendMessage(
            tabs[0].id,
            {
              todo: "addLock",
              tabID: request.tabID,
            },
            function (response) {
              result = response;
              console.log("addLock response:", response);
              // chrome.storage.local.set(
              // 	{getTabID:result.tabID,
              // 	getTabTitle:result.tabTitle,
              // 	todo: 'getTabTitle'+Math.random().toFixed(8),
              // 	from: 'EventPage.getTabTitle'});
              sendResponse(response);
            }
          );
        }
      );
    }
    // "https://pidrealty.local/wp-content/themes/pidHomes-PhaseI/db/dbAddSubjectProperty.php"
    if (request.todo == "saveSubjectInfo") {
      var subjectInfo = request;
      let ajax_url = request.ajax_url;
      $.ajax({
        url: ajax_url,
        method: "post",
        data: subjectInfo,
        success: function (res) {
          console.log("res::", JSON.stringify(res));
        },
      });
    }

    if (request.todo == "saveCMAInfo") {
      var cmaInfo = request;
      let ajax_url = request.ajax_url;
      $.ajax({
        url: ajax_url,
        method: "post",
        data: cmaInfo,
        success: function (res) {
          console.log("res::", JSON.stringify(res));
        },
      });
    }

    // sync community names to pidhomes.ca & cn.pidhomes.ca
    if (request.todo == "UpdateCommunityInfoToWP") {
      var listingInfo = { listingInfo: JSON.stringify(request.listings) };
      let ajax_url = request.ajax_url;
      $.ajax({
        url: ajax_url,
        method: "post",
        data: listingInfo,
        success: function (res) {
          console.log("res::", JSON.stringify(res));
          if (res.indexOf("sync RPS community names done:") > -1) {
            sendResponse("Page Update Done");
          } else {
            sendResponse("Page Update Failed");
          }
        },
      });
    }

    if (request.todo == "saveTableInfo") {
      mlsTable = JSON.parse(request.table);
      sendResponse("Table Saved!");
    }

    if (request.todo == "readMLSTableInfo") {
      // sendResponse(mlsTable);
      let mlsNo = request.mlsNo;
      let listingInfo = [];
      // search tax value
      mlsTable.forEach((row) => {
        if (row["ML #"] == mlsNo) {
          listingInfo = row;
        }
      });
      sendResponse(listingInfo);
    }

    return true;
  });

  //End of Main Function
})();

function initBackground() {
  return new Promise((res, rej) => {
    chrome.storage.local.set(
      {
        landValue: 0,
        improvementValue: 0,
        totalValue: 0,
        curTabID: null,
        taxYear: taxYear,
      },
      () => {
        if (chrome.runtime.lastError) {
          rej(chrome.runtime.lastError.message);
        } else {
          res("Background Evenpage Init Done!");
        }
      }
    );
  });
}

async function checkUpdate() {
  try {
    // API is chrome.runtime.requestUpdateCheck(function (status, details) { ... });
    // Instead we use deconstruction-assignment and await
    const { status, details } = await chrome.runtime.requestUpdateCheck();
    //alert(`Status: ${status}\nDetails: ${JSON.stringify(details)}`);
  } catch (err) {
    // Handle errors from chrome.runtime.requestUpdateCheck or my code
  }
}

async function readStoragePID() {
  try {
    //
    const currentPID = await chrome.storage.local.get("PID");
    console.log(currentPID);
  } catch (err) {
    // Handle errors
  }
}

async function tabQ() {
  try {
    const tabs = await chrome.tabs.query({ title: "Paragon 5" });
    const activeTabID = tabs[0].id;
    console.log(activeTabID);
  } catch (err) {
    // Handle errors
  }
}

async function warningMessage(request) {
  if (request.todo == "warningMessage") {
    //console.log("I got the warning message!");
    //pass the message to defaultpage(Main Home Page)
    console.info("Chrome Tab ID is: ", chromeTabID);
    const tabs = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    const ignoreWarning = await chrome.tabs.sendMessage(tabs[0].id, {
      todo: "ignoreWarning",
    });
  }
}

async function logOut(request) {
  if (request.todo == "logoutMessage") {
    //console.log("I got logout message!");
    //pass the message to defaultpage(Main Home Page)
    const tabs = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    const logoutMLS = await chrome.tabs.sendMessage(tabs[0].id, {
      todo: "logoutMLS",
    });
    console.log(`logout MLS from Tab ${tabs[0].id}`);
  }
}

async function taxSearch(request, sendResponse) {
  //get request to search tax info of Property with PID saved to storage
  //console.log(">>>I got tax search command!");
  try {
    const currentPID = await chrome.storage.local.get("PID");
    const taxID = currentPID.PID + "-" + taxYear;
    const requester = request.from;
    const taxAssess = await db.readAssess_promise(taxID);
    let tabs = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!taxAssess._id) {
      //if not taxAssess found in db, send out tax search command:
      try {
        if (tabs.length > 0) {
          await chrome.tabs.sendMessage(tabs[0].id, {
            todo: "taxSearchFor" + requester,
          });
        } else {
          if (String(taxAssess.from).indexOf("taxSearchFor" + requester) < 0) {
            taxAssess.from = taxAssess.from + "-taxSearchFor" + requester;
          }
          taxAssess.from += "-TaxSearchFailed";
          await chrome.storage.local.set(taxAssess);
        }
      } catch (err) {
        console.error("taxSearch Errors: ", err);
      }
    } else {
      if (String(taxAssess.bcaSearch).indexOf("failed") > -1) {
        if (String(taxAssess.addedDate).indexOf($today) > -1) {
          taxAssess.from =
            taxAssess.from + "-TaxSearchFailed-taxSearchFor" + requester;
        } else {
          try {
            if (tabs.length > 0) {
              await chrome.tabs.sendMessage(tabs[0].id, {
                todo: "taxSearchFor" + requester,
              });
            } else {
              if (
                String(taxAssess.from).indexOf("taxSearchFor" + requester) < 0
              ) {
                taxAssess.from = taxAssess.from + "-taxSearchFor" + requester;
              }
              taxAssess.from += "-TaxSearchFailed";
              await chrome.storage.local.set(taxAssess);
            }
          } catch (err) {
            console.error("taxSearch Errors: ", err);
          }
        }
      } else if (
        String(taxAssess.from).indexOf("taxSearchFor" + requester) < 0
      ) {
        taxAssess.from = taxAssess.from + "-taxSearchFor" + requester;
      }
      await chrome.storage.local.set(taxAssess);
    }

    return Promise.resolve(">>>tax search has been processed in EventPage: ");
  } catch (err) {
    return Promise.reject(">>>tax search gets errors in EventPage: ");
  }
}

async function searchStrataPlanSummary(request) {
  const strataInfo = await chrome.storage.local.get([
    "strataPlan",
    "complexNameForListingCount",
  ]);

  let strataPlan = strataInfo.strataPlan;
  let complexName = strataInfo.complexNameForListingCount;

  if (!strataPlan || strataPlan == "PLAN" || strataPlan == "PL") {
    return Promise.reject("Non Strata Plan!");
  }

  let today = $fx.getToday();
  let strataPlanSummaryToday = await db.readStrataPlanSummary_Promise(
    strataPlan + "-" + today
  );
  if (!strataPlanSummaryToday) {
    const tabs = chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    await chrome.tabs.sendMessage(tabs[0].id, {
      todo: "searchComplexListingCount",
      showResult: true,
      saveResult: true,
      strataPlan: strataPlan,
      complexName: complexName,
    });
  } else {
    return Promise.resolve("Complex Search Has Been Processed in eventpage");
  }
}

async function searchComplexInfo(request) {
  let complexID = request._id;
  let requestFrom = request.from;
  delete request.from;

  let complexInfo = await db.readComplex_Promise(request);
  //console.log('>>>read the complex info from database:', complexInfo);
  if (complexInfo) {
    if (complexInfo.name.length > 0) {
      complexInfo.from += "-" + requestFrom;
      complexInfo.complexName = complexInfo.name;
    } else {
      complexInfo.from += "-" + requestFrom;
      complexInfo.complexName = "::";
    }

    await chrome.storage.local.set(complexInfo);
    console.log("complexInfo is: ", complexInfo);
    return Promise.resolve("Complex Name Found!");
  } else {
    //error for complexInfo
    return Promise.reject("Complex Name does not exist in Database");
  }
}
