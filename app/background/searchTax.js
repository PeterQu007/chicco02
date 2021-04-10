var newTaxYear = true; //beginning of new year, MLS tax db has not been updated, still use last year's assess. set newTaxYear to false
var d = new Date();
var taxYear = d.getFullYear();
taxYear = newTaxYear ? taxYear : taxYear - 1;

export default function taxSearch(request, sendResponse, db) {
  if (request.todo == "taxSearch") {
    //get request to search tax info of Property with PID saved to storage
    //console.log(">>>I got tax search command!");
    try {
      chrome.storage.local.get("PID", function (result) {
        //check database, if assess exist, send it back
        //console.log(">>>PID is: ", result.PID);
        var taxID = result.PID + "-" + taxYear;
        var requester = request.from;
        db.readAssess(taxID, function (assess) {
          //console.log(">>>read from , assess is: ", assess)
          if (!assess._id) {
            //other wise , send out tax research command:
            try {
              // console.info("Chrome Tab ID is: ", chromeTabID);
              chrome.tabs.query(
                {
                  active: true,
                  currentWindow: true,
                },
                function (tabs) {
                  console.warn("taxSearch get chrome tabs:", tabs);
                  if (tabs.length > 0) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                      todo: "taxSearchFor" + requester,
                    });
                  } else {
                    if (
                      String(assess.from).indexOf("taxSearchFor" + requester) <
                      0
                    ) {
                      assess.from = assess.from + "-taxSearchFor" + requester;
                    }
                    assess.from += "-TaxSearchFailed";
                    chrome.storage.local.set(assess);
                  }
                }
              );
            } catch (err) {
              console.error("taxSearch Errors: ", err);
            }
          } else {
            if (String(assess.bcaSearch).indexOf("failed") > -1) {
              if (String(assess.addedDate).indexOf($today) > -1) {
                assess.from =
                  assess.from + "-TaxSearchFailed-taxSearchFor" + requester;
              } else {
                //Re-Search the tax Data EveryDay
                try {
                  console.info("Chrome Tab ID is: ", chromeTabID);
                  chrome.tabs.query(
                    {
                      active: true,
                      currentWindow: true,
                    },
                    function (tabs) {
                      console.warn("taxSearch get chrome tabs:", tabs);
                      if (tabs.length > 0) {
                        chrome.tabs.sendMessage(tabs[0].id, {
                          todo: "taxSearchFor" + requester,
                        });
                      } else {
                        if (
                          String(assess.from).indexOf(
                            "taxSearchFor" + requester
                          ) < 0
                        ) {
                          assess.from =
                            assess.from + "-taxSearchFor" + requester;
                        }
                        assess.from += "-TaxSearchFailed";
                        chrome.storage.local.set(assess);
                      }
                    }
                  );
                } catch (err) {
                  console.error("taxSearch Errors: ", err);
                }
              }
            } else if (
              String(assess.from).indexOf("taxSearchFor" + requester) < 0
            ) {
              assess.from = assess.from + "-taxSearchFor" + requester;
            }
            chrome.storage.local.set(assess);
          }
        });
      });
      sendResponse(">>>tax search has been processed in EventPage: ");
    } catch (err) {
      sendResponse(">>>tax search gets errors in EventPage: ");
    }
  }
}
