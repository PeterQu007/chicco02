////CONTENT.SCRIPT TARGET PARAGON.MLS.DEFAULT.SPREADSHEET.VIEW.PAGE
////COMPLETE THE INFORMATION IN THE SPREADSHEET.TABLE BY ADDING BCA.TAX.INFORMATION
////LOOK FOR COMPLEX.NAME, LAND.TAX.VALUE, IMPROVEMENT.TAX.VALUE, TOTAL.TAX.VALUE
////COMPUTE PRICE.CHANGE.PERCENTAGE VS TOTAL.TAX.VALUE
////ADD STRATA.PLAN.COLUMN
////NORMALIZE CIVIC.ADDRESS, COMPLEX.NAME

//Residential Attached, Detached & Land Listing Search Results Page (Tab3/4/5_?_2),
//Target: SubPage iframe #ifSpreadsheet : Listing Results Spreadsheet Table
//Function: Computing Square Feet Price Summary From the Spreadsheet Table

import uiSummaryTable from "../assets/scripts/ui/uiSummaryTable.js";
import addressInfo from "../assets/scripts/modules/AddressInfo";
//import * as math from "../assets/lib/mathjs/math.min.js";

var $fx = L$(); //add library module

var computeSFPrices = {
  init: function() {
    console.log("Spreadsheet Document URL: ", document.URL); ////THIS URL CONTAINS TAB.ID

    this.tabID = $fx.getTabID(document.URL); ////LOOK FOR TAB.ID PREFIXED WITH # ID.SIGN
    this.tabNo = parseInt(this.tabID.replace("#tab", "")); ////LOOK FOR TAB.NO
    var x = $("ul#tab-bg", top.document); ////find the top tab panel
    var y = x.children("li")[this.tabNo];
    this.tabTitle = $(y)
      .children()
      .find("span")
      .text()
      .trim(); ////LOOK FOR TAB.TITLE
    console.warn(
      "tabID, tabNo, tabTitle",
      this.tabID,
      this.tabNo,
      this.tabTitle
    );
    //this.setCols(this.tabTitle); ////COLUMNS FROM DIFFERENT SPREADSHEET.TABLES
    this.cols = $fx.setCols(this.tabTitle);
    this.uiTable.tabTitle = this.tabTitle; ////SUMMARY.TABLE FOR AVERAGE SQUARE.FEET.PRICES
    ////BC.TAX.SEARCH IS SET TO TAB1, ITS SEARCH.RESULT ALSO USE SPREADSHEET.VIEW, SHOULD NOT BE INCLUDED HERE
    if (this.tabID >= "#tab2") {
      ////EXCLUDE #TAB1: BC.TAX.SEARCH.RESULTS
      this.addLock(this.tabID);
      this.$tabContentContainer = $("div" + this.tabID, top.document);

      this.$spreadSheet = $("#ifSpreadsheet");
      this.$searchCount = $("#SearchCount", parent.document);
      this.$grid = $("#grid");

      this.recordCount = $fx.getRecordCount(parent.document.URL); ////RECORD.COUNT IS EMBEDDED IN THE URL FOR MANY IFRAME PAGES
      if (this.recordCount == 0) {
        this.recordCount = parseInt(this.$searchCount.text()); ////SAME RECORD.COUNT SHOWS IN THE TOP.SECTION
      }
      console.log("[SPREADSHEET] Record Count: ", this.recordCount);

      ////HOOK UP EVENTS:
      this.onTaxSearch(); ////TAX.SEARCH EVENT
      this.onMutation(); ////SPREADSHEET.TABLE READY EVENT
      this.onComplexSearch(); ////COMPLEX.NAME.SEARCH EVENT
    } else {
      console.warn(
        "THIS MODULE DOES NOT APPLY TO THIS TAB.ID: ",
        this.tabID,
        "TAB.TITLE: ",
        this.tabTitle
      );
    }
    this.uiTable.parent = this;
  },
  ////PROPERTIES:
  tabID: null,
  tabNo: 0,
  tabTitle: null,
  uiTable: new uiSummaryTable(this),
  $spreadSheet: null,
  $searchCount: null,
  $grid: null,
  $mutationObserver: null,
  recordCount: 0,
  //recordPointer: 0,
  table: [], //for assessment search
  rowNumber: [], //for table col 0 , keep the listing row number of spreadsheet
  tableComplex: [], //for complexName search
  cols: null,
  keyword: $(
    "div#app_banner_links_left input.select2-search__field",
    top.document
  ),
  ////EVENTS:
  onMutation() {
    ////AFTER THE SPREADSHEET.TABLE HAS BEEN FULLY LOADED TO THE FRONT.END
    ////POPULATE this.table AND this.tableComplex
    var self = this;
    var tableLoading = document.querySelector("#grid tbody"); ////MONITOR THE #grid.tbody, CHECK THE LISTING RECORDS

    var $mutationObserver = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        var x = $("table#grid tbody");
        var rows = x.children("tr");

        var name = mutation.attributeName;
        var value = mutation.target.getAttribute(name);
        if (
          mutation.type == "childList" &&
          mutation.target.tagName == "TBODY"
        ) {
          if (mutation.addedNodes.length != rows.length - 1) {
            return;
          } else {
            self.recordCount = mutation.addedNodes.length;
          }
        } else {
          return;
        }

        self.table.length = 0; ////INIT THIS.table
        self.rowNumber.length = 0; ////INIT THIS.rowNumber

        if (
          x.children("tr").length - 1 == self.recordCount ||
          x.children("tr").length - 1 == 250
        ) {
          ////THE TABLE #grid HAS BEEN FULLY LOADED TO THE FRONT.ENT

          //console.log("reach the bottom of the TABLE");
          self.recordCount = parseInt(self.$searchCount.text());
          console.log(
            "Table Rows currently is: ",
            x.children("tr").length,
            "RecordCount: ",
            self.recordCount
          );
          var x0 = $("div#dialogStats", parent.document); ////LOOK FOR THE SUMMARY.SECTION FOR ADDING EXTRA THIS.uiTable
          self.uiTable.showUI(x0);
          self.table.length = 0;

          var i;
          var row = []; //current row
          var col14_Price = []; //List Price
          var col22_FloorArea = []; //FloorArea
          var col23_ActivePricePSF = []; //Listed / asking Price per SqFt
          var col24_SoldPricePSF = []; //Sold Price Per SqFt
          var col31_PID = []; //PID Column
          var col32_LandValue = []; //Land Value Colum
          var col33_ImprovementValue = []; // Improvement Value
          var col34_TotalAssess = []; // Total Assessment Value
          var col35_ValueChange = []; // Computed column for total value change percentage
          var col36_PlanNum = []; // Strata Plan Number
          var col_LotSize = []; // lot size in square feet
          var listPricePSF = []; //for listPrice Per Square Feet
          var sumPSFListedPrice = 0;
          var sumPSFActivePrice = 0; //keep the sum of listing price per sf
          var sumPSFSoldPrice = 0; //keep the sum of sold price per sf
          var countSoldListing = 0; //keep the count of sold listings
          var countActiveListing = 0; ////KEEP THE COUNT OF ACTIVE LISTINGS
          var soldPricePSF; //keep the sold price per square feet
          var listingPricePSF; //keep the listing price per square feet
          var status; ////KEEP THE LISTING STATUS
          for (i = 1; i < rows.length; i++) {
            ////i=1; i<rows.length; i++
            //console.log(rows[i], $(rows[i]).children('td')[24]);
            row.push(i); ////COL 0: ROW.NO
            status = $(rows[i]).children("td")[self.cols.status].textContent;
            var price = $fx.convertStringToDecimal(
              $(rows[i]).children("td")[self.cols.Price].textContent
            );
            col14_Price.push(price);
            row.push(price); ////COL 1: PRICE
            var floorArea = $fx.convertStringToDecimal(
              $(rows[i]).children("td")[self.cols.TotalFloorArea].textContent
            );
            col22_FloorArea.push(floorArea);
            row.push(floorArea); ////COL 2: FLOOR.AREA
            if (self.tabTitle == "Residential Attached") {
              var lotSize = $fx.convertStringToDecimal(
                $(rows[i]).children("td")[self.cols.lotSize].textContent
              );
            } else {
              var lotSize = $fx.convertStringToDecimal(
                $(rows[i]).children("td")[self.cols.lotSize].textContent
              );
            }
            col_LotSize.push(lotSize);
            listingPricePSF = Number(
              Number(
                col14_Price[col14_Price.length - 1] /
                  col22_FloorArea[col22_FloorArea.length - 1]
              ).toFixed(2)
            );
            sumPSFListedPrice += listingPricePSF;
            listPricePSF.push(listingPricePSF);
            row.push(listingPricePSF); ////COL 3: LISTING.ASKING.PRICE.PER.SQUARE.FEET?????????????????
            ////ACTIVE LISTING VS SOLD LISTING
            switch (status) {
              case "A":
                ////Added Status Control: Only Select Active Listing for ListingPrice
                var activePricePSF = $fx.convertStringToDecimal(
                  $(rows[i]).children("td")[self.cols.PricePSF].textContent,
                  true
                );
                if (activePricePSF > 0) {
                  countActiveListing++;
                  col23_ActivePricePSF.push(activePricePSF);
                  sumPSFActivePrice += activePricePSF;
                }
                break;
              case "S":
                soldPricePSF = $fx.convertStringToDecimal(
                  $(rows[i]).children("td")[self.cols.SoldPricePSF].textContent
                );
                if (soldPricePSF > 0) {
                  countSoldListing++;
                  col24_SoldPricePSF.push(soldPricePSF); ////SOLD.PRICE.PER.SQUARE.FEET
                  sumPSFSoldPrice += soldPricePSF; ////TOTAL.SOLD.PRICE.PER.SQUARE.FEET
                }
                break;
            }

            ////LOOK FOR PID FOR TAX.SEARCH
            //self.recordPointer = i-1;
            var pid = $(rows[i]).children("td")[self.cols.PID].textContent;
            var complexName = $(rows[i]).children("td")[self.cols.complexName]
              .textContent;
            var address = $(rows[i]).children("td")[self.cols.address]
              .textContent;
            var houseType = $(rows[i]).children("td")[self.cols.houseType]
              .textContent;
            var streetAddress = $(rows[i]).children("td")[self.cols.address]
              .textContent;
            var unitNo = "";
            var city = "";
            col31_PID.push(pid);
            row.push(pid); ////COL 4: PID
            col32_LandValue.push(0);
            row.push(0); ////COL 5: LAND.VALUE
            col33_ImprovementValue.push(0);
            row.push(0); ////COL 6: IMPROVEMENT.VALUE
            col34_TotalAssess.push(0);
            row.push(0); ////COL 7: TOTAL.ASSESS
            col35_ValueChange.push(0);
            row.push(0); ////COL8: VALUE.CHANGE
            col36_PlanNum.push("");
            row.push(""); ////COL9: PLAN.NUM
            row.push(false); //col 10 : taxSearch Sign
            row.push(lotSize); // col 11 : add lotSize for single house or land
            row.push(complexName); //col 12: for complex Name
            row.push(address); //col 13: for address
            row.push(houseType); //col 14: for houseType
            row.push(false); //col 15: complexSearch Sign
            row.push(""); //col 16: placeholder for complexID
            row.push(streetAddress); ////COL 17: STREET ADDRESS
            row.push(unitNo); ////  COL 18: UNIT NO FOR STRATA UNIT
            city = $(rows[i]).children("td")[self.cols.city].textContent;
            row.push(city); //// COL 19: CITY OF GREAT VANCOUVER
            row.push(status); ////COL 20: LISTING STATUS
            self.table.push(row); ////ADD THE ROW TO THE TABLE
            row = []; ////INIT THE ROW
          }
          // var avgListedSFP = (sumPSFListedPrice / self.recordCount).toFixed(0);
          // var avgSoldSFP = (sumPSFSoldPrice / countSoldListing).toFixed(0);
          self.uiTable.setSumValues(
            /*id for panel 1*/ 1,
            col23_ActivePricePSF,
            countActiveListing,
            "$"
          );
          self.uiTable.setSumValues(
            /*id for panel 2*/ 2,
            col24_SoldPricePSF,
            countSoldListing,
            "$"
          );
          self.uiTable.render(1);

          for (var i = 0; i < self.table.length; i++) {
            if (!$fx.inGreatVanArea(self.table[i][19])) {
              ////IF IS NOT GREAT VAN CITIES, PASSED TAX SEARCH
              console.log("[SP]==>BYPASS THE NON GV CITIES!", i);
              $(rows[i + 1]).children("td")[self.cols.address].textContent +=
                "^";
              self.table[i][10] = true;
              self.table[i][15] = true;
              continue;
            }
          }

          self.searchTax();
        }
      });
    });

    $mutationObserver.observe(tableLoading, {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: false,
      attributeOldValue: true,
      characterDataOldValue: true
    });
  },

  //////////////////////////////////////////////////////////////////////////////
  ///////////////////          Assessment Search Code              /////////////
  //////////////////////////////////////////////////////////////////////////////
  onTaxSearch: function() {
    ////DEFINE THE TAX.SEARCH EVENT
    (function onEvents(self) {
      chrome.storage.onChanged.addListener(function(changes, area) {
        if (self.$spreadSheet.css("display") == "none") {
          return;
        }
        if (area == "sync" && "from" in changes) {
          if (
            changes.from.newValue.indexOf("assess") > -1 &&
            changes.from.newValue.indexOf("ForSpreadSheet") > -1
          ) {
            console.log(
              "==>Spreadsheet - TAX SEARCH EVENT: ",
              changes.from.newValue
            );
            if (changes.from.newValue.indexOf("-TaxSearchFailed") > -1) {
              self.updateAssessWhenTaxSearchFailed();
            } else {
              self.updateAssess();
            }
            setTimeout(
              function() {
                ////LOOP THE TAX.SEARCH IN THE SPREADSHEET.TABLE
                this.searchTax();
              }.bind(self),
              1000
            );
          }
        }
      });
    })(this);
  },

  searchTax: function() {
    ////SEARCH PROPERTY.TAX BY PID THRU BC.TAX.SEARCH #TAB1
    var self = this;
    var i = 0;
    var unTaxed = 0;
    for (i = 0; i < self.table.length; i++) {
      if (!self.table[i][10]) {
        ////FETCH A TABLE.ROW HAS NOT YET DONE TAX SEARCH
        unTaxed = i;
        var pid = self.table[unTaxed][4];
        var c = "";
        var newPID = "";
        ////STANDARDIZE PID, ONLY KEEP NUMBERS AND DASH CHARACTER
        for (var n = 0; n < pid.length; n++) {
          c = pid[n];
          if (c == "-") {
            newPID += c;
            continue;
          }
          if (parseInt(c) >= 0 && parseInt(c) <= 9) {
            newPID += c;
          }
        }
        pid = newPID;
        if (!pid) {
          return;
        }
        ////SEND TAX SEARCH COMMAND TO BACKGROUND SCRIPT
        chrome.storage.sync.set({ PID: pid });
        chrome.storage.sync.get("PID", function(result) {
          //console.log(">>>PID saved for tax search: ", result.PID);
          //////////////////////////////////////////////////////////
          //SEND OUT SEARCH TAX COMMAND
          chrome.runtime.sendMessage(
            { from: "SpreadSheet", todo: "taxSearch" },
            function(response) {
              console.log("SpreadSheet got tax response:", response);
              self.table[unTaxed][10] = true; ////SET UP THE ROW.SEARCHED TO TRUE
            }
          );
        });
        break;
      }
      if (i == self.table.length - 1) {
        console.log("taxSearch done!");
        ////START TO SEARCH COMPLEX.NAME
        var i = 0;
        for (i = 0; i < self.table.length; i++) {
          var planNum = self.table[i][9];
          if (!planNum.trim()) {
            self.table[i][15] = true; ////BECAUSE OF PLAN.NUMBER ERROR, PASSED THIS RECORD
          }
        }
        self.searchComplex();
      }
    }
  },

  updateAssess: function() {
    ////ON TAX.SEARCH EVENT, CHROME.STORAGE GET A NEW.VALUE CONTAINS 'assess' AND 'ForSpreadSheet'
    var self = this;
    var aInfo = null;

    chrome.storage.sync.get(
      [
        "PID",
        "totalValue",
        "improvementValue",
        "landValue",
        "lotSize",
        "address",
        "bcaDataUpdateDate",
        "planNum",
        "dataFromDB"
      ],
      function(result) {
        var pid = result.PID;
        var totalValue = result.totalValue;
        var improvementValue = result.improvementValue;
        var landValue = result.landValue;
        var lotSize = result.lotSize;
        var planNum = result.planNum;
        var formalAddress = "";
        var isFormalAddress = false;
        if (
          typeof result.address == "string" &&
          result.address.trim().length > 0
        ) {
          formalAddress = result.address.trim();
        } else {
          formalAddress = "";
        }

        var houseType = null;
        var intTotalValue = $fx.convertStringToDecimal(totalValue);

        var i = 0;
        var price = 0;
        var rowNumber = self.rowNumber;

        for (i = 0; i < self.table.length; i++) {
          var checkPID = self.table[i][4];
          var c = "";
          var newPID = "";
          //only keep numbers and dash character
          for (var n = 0; n < checkPID.length; n++) {
            c = checkPID[n];
            if (c == "-") {
              newPID += c;
              continue;
            }
            if (parseInt(c) >= 0 && parseInt(c) <= 9) {
              newPID += c;
            }
          }
          if (pid == newPID) {
            self.table[i][5] = landValue;
            self.table[i][6] = improvementValue;
            self.table[i][7] = totalValue;
            self.table[i][9] = planNum;
            self.table[i][10] = true; ////TOGGLE THE ROW'S TAX.SEARCH.SING TO TRUE: TAX.SEARCH.DONE
            if (
              typeof formalAddress == "string" &&
              formalAddress.trim().length > 0
            ) {
              self.table[i][13] = formalAddress; ////SET FORMAL ADDRESS TO THE ONE FROM TAX SEARCH
              isFormalAddress = true;
            } else {
              self.table[i][13] = self.table[i][13].trim();
              isFormalAddress = false;
            }
            var tempAddress = self.table[i][13]; ////SET TEMP ADDRESS FOR FUNCTION BELOW:
            houseType = self.table[i][14]; //fetch houseType
            aInfo = new addressInfo(tempAddress, houseType, isFormalAddress);
            self.table[i][14] = aInfo.houseType;
            houseType = aInfo.houseType;
            self.table[i][17] = aInfo.streetAddress;
            self.table[i][18] = aInfo.UnitNo;
            self.table[i][16] = planNum + aInfo.addressID; //complexID
            price = parseInt(self.table[i][1]);
            rowNumber.push(self.table[i][0]);
            if (totalValue != 0) {
              //calculate the price change percentage
              var changeValue = price - intTotalValue;
              var changeValuePercent = (
                (changeValue / intTotalValue) *
                100
              ).toFixed(0);
              self.table[i][8] = changeValuePercent;
            }
          }
        }

        console.log(
          "SpreadSheet - ASSESS SEARCHing LandValue: ",
          /*self.table,*/ landValue,
          rowNumber.length,
          "/",
          i
        );

        var x = $("table#grid tbody");
        var rows = x.children("tr");
        var rowNo = self.rowNumber[self.rowNumber.length - 1];
        $($(rows[rowNo]).children("td")[self.cols.address]).text(
          self.table[rowNo - 1][13] + "**"
        );
      }
    );
  },

  updateAssessWhenTaxSearchFailed: function() {
    ////FOR NO BC.TAX.RECORD
    ////BC.TAX.RECORD SHOWS TAX.VALUE = 0
    var self = this;

    chrome.storage.sync.get(
      [
        "PID",
        "totalValue",
        "improvementValue",
        "landValue",
        "address",
        "planNum",
        "dataFromDB"
      ],
      function(result) {
        var pid = result.PID;
        var totalValue = result.totalValue;
        var improvementValue = result.improvementValue;
        var landValue = result.landValue;
        var planNum = result.planNum.trim();
        var formalAddress = result.address.trim();
        var houseType = "";
        var aInfo = null;
        var dataFromDB = result.dataFromDB;

        var i = 0;
        var price = 0;
        var rowNumber = self.rowNumber;
        for (i = 0; i < self.table.length; i++) {
          if (pid == self.table[i][4]) {
            self.table[i][5] = landValue;
            self.table[i][6] = improvementValue;
            self.table[i][7] = totalValue;
            self.table[i][9] = planNum;
            self.table[i][10] = true; // tax done
            houseType = self.table[i][14]; //fetch houseType

            if (planNum) {
              aInfo = new addressInfo(formalAddress, houseType, true);
              self.table[i][16] = planNum + aInfo.addressID; ////complexID
            } else {
              //format the address of table col 13:
              aInfo = new addressInfo(
                /*address col 13 */ self.table[i][13],
                /*houseType col 14*/ self.table[i][14]
              );
              formalAddress = aInfo.formalAddress;
              planNum = "NPN"; ////NPN STANDS FOR NO.PLAN.NUMBER
              self.table[i][9] = "NPN"; ////UPDATE THE TABLE CELL FOR PLAN.NUMBER
              self.table[i][16] =
                /*planNum need to get from legalDescription */ planNum +
                aInfo.addressID; //complexID
            }

            self.table[i][14] = aInfo.houseType;
            self.table[i][17] = aInfo.streetAddress;
            self.table[i][18] = aInfo.UnitNo;

            self.table[i][13] = formalAddress; // formal address from tax search
            price = parseInt(self.table[i][1]);

            rowNumber.push(self.table[i][0]);

            var changeValue = 0;
            var changeValuePercent = 0;
            self.table[i][8] = changeValuePercent;
          }
        }

        console.log(
          "SpreadSheet: table & landValue FAILED=> ",
          /*self.table,*/ landValue,
          rowNumber.length
        );
        var x = $("table#grid tbody");
        var rows = x.children("tr");
        var rowNo = self.rowNumber[self.rowNumber.length - 1];
        $($(rows[rowNo]).children("td")[self.cols.address]).text(
          self.table[rowNo - 1][13] + "^"
        );
      }
    );
  },

  //////////////////////////////////////////////////////////////////////////////
  ///////////////////             Complex Search Code              /////////////
  //////////////////////////////////////////////////////////////////////////////
  onComplexSearch: function() {
    (function onEvents(self) {
      chrome.storage.onChanged.addListener(function(changes, area) {
        if (self.$spreadSheet.css("display") == "none") {
          return;
        }
        if (area == "sync" && "from" in changes) {
          if (
            changes.from.newValue.indexOf("complex") > -1 &&
            changes.from.newValue.indexOf("spreadSheetCompletion") > -1
          ) {
            console.log("====>Spreadsheet : COMPLEX SEARCH EVENT", changes);
            self.updateComplex();

            setTimeout(
              function() {
                //go to next listing for assess date
                this.searchComplex();
              }.bind(self),
              1000
            );
          }
        }
      });
    })(this);
  },

  searchComplex: function() {
    var self = this;
    var i = 0;
    var unSearchComplex = 0;
    var planNum = "";
    var address = "";
    var complexName = "";
    var houseType = "";
    var complexID = "";

    for (i = 0; i < self.table.length; i++) {
      try {
        if (!self.table[i][15]) {
          ////IF NOT YET DONE COMPLEX SEARCH BY CHECKING COMPLEX SEARCH TAG
          unSearchComplex = i;
          complexID = self.table[i][16];
          ////planNum, address, complex, houseType
          planNum = self.table[i][9];
          address = self.table[i][13];
          complexName = $fx.normalizeComplexName(self.table[i][12]);
          houseType = self.table[i][14].toUpperCase();
          if (houseType == "HOUSE" || houseType == "DETACHED") {
            ////DETACHED PROPERTY NO NEED TO DO COMPLEX SEARCH
            self.table[i][12] = self.table[i][9];
            self.table[i][15] = true;
            if (i == self.table.length - 1) {
              console.log("Single House ComplexSearch Done!");
              self.updateSpreadsheet();
            }
            continue;
          }
          if (!complexID) {
            // re do complexID
            var isFormal = true; // this is formal address from tax search
            var aInfo = new addressInfo(address, houseType, isFormal); //todo list...
            complexID = planNum + aInfo.addressID;
          }
          ////////////////////////////////////////////
          var complexInfo = {
            _id: complexID,
            name: complexName,
            todo: "searchComplex",
            from: "spreadSheetCompletion"
          };

          chrome.runtime.sendMessage(complexInfo, function(response) {});
          ////////////////////////////////////////
          break;
        }
      } catch (error) {
        console.error(error);
        continue;
      }

      if (i == self.table.length - 1) {
        console.log("complexSearch done!");
        self.updateSpreadsheet();
      }
    }
  },

  updateComplex: function() {
    var self = this;

    chrome.storage.sync.get(["_id", "name"], function(result) {
      var complexID = result._id;
      var complexName = result.name;
      complexName = $fx.normalizeComplexName(complexName);
      var i = 0;
      for (i = 0; i < self.table.length; i++) {
        if (complexID == self.table[i][16]) {
          console.log("====>Spreadsheet-Complex Updated: ", i);
          self.table[i][12] = complexName;
          self.table[i][15] = true; ////SETUP THE ROW'S COMPLEX SEARCH SIGN
        }
      }
    });
  },

  updateSpreadsheet: function() {
    var self = this;

    var x = $("table#grid tbody");
    var rows = x.children("tr");
    var rowNumber = self.rowNumber;
    var assessSold = [];
    var assessChangeSold = [];
    var assessActive = [];
    var assessChangeActive = [];
    var countActiveListing = 0;
    var countSoldListing = 0;
    var aInfo = null;
    var addressLink = $(
      '<a id="addressLink" target="_blank" href="https://www.google.com/search?q=Google+tutorial+create+link">' +
        "Google tutorial create link" +
        "</a> "
    );
    var addressText = "";
    var i;
    for (i = 0; i < rowNumber.length; i++) {
      var j = rowNumber[i];
      var t = $fx.convertStringToDecimal(self.table[j - 1][7]);
      const status = self.table[j - 1][20];
      if (t > 0) {
        $($(rows[j]).children("td")[self.cols.landValue]).text(
          $fx.removeDecimalFraction(self.table[j - 1][5])
        );
        $($(rows[j]).children("td")[self.cols.improvementValue]).text(
          $fx.removeDecimalFraction(self.table[j - 1][6])
        );
        $($(rows[j]).children("td")[self.cols.totalValue]).text(
          $fx.removeDecimalFraction(self.table[j - 1][7])
        );
        $($(rows[j]).children("td")[self.cols.changeValuePercent]).text(
          self.table[j - 1][8] + "%"
        );

        switch (status) {
          case "A":
            assessActive.push($fx.convertStringToDecimal(self.table[j - 1][7]));
            assessChangeActive.push(
              $fx.convertStringToDecimal(self.table[j - 1][8])
            );
            countActiveListing++;
            break;
          case "S":
            assessSold.push($fx.convertStringToDecimal(self.table[j - 1][7]));
            assessChangeSold.push(
              $fx.convertStringToDecimal(self.table[j - 1][8])
            );
            countSoldListing++;
            break;
        }
      } else {
        ////IF TOTAL.VALUE == 0, THEN DO NOT SHOW ANY NUMBER
        $($(rows[j]).children("td")[self.cols.landValue]).text("");
        $($(rows[j]).children("td")[self.cols.improvementValue]).text("");
        $($(rows[j]).children("td")[self.cols.totalValue]).text("");
        $($(rows[j]).children("td")[self.cols.changeValuePercent]).text("");
        switch (status) {
          case "A":
            assessActive.push(null);
            assessChangeActive.push(null);
            countActiveListing++;
            break;
          case "S":
            assessSold.push(null);
            assessChangeSold.push(null);
            countSoldListing++;
            break;
        }
      }

      $($(rows[j]).children("td")[self.cols.strataPlan]).text(
        self.table[j - 1][9]
      ); //Show Plan Num in the table
      $($(rows[j]).children("td")[self.cols.address]).text("");
      addressText = self.table[j - 1][13];
      aInfo = new addressInfo(
        addressText,
        $($(rows[j]).children("td")[self.cols.houseType]).text(),
        true
      );
      var addressLink = $(
        '<a id="addressLink" target="_blank" href="https://www.google.com/search?q=Google+tutorial+create+link">' +
          "Google tutorial create link" +
          "</a> "
      );
      addressLink.attr("href", aInfo.googleSearchLink);
      addressLink.text(aInfo.formalAddress);
      addressLink.appendTo($($(rows[j]).children("td")[self.cols.address])); ////ADD A GOOGLE ADDRESS SEARCH ANCHOR
      $($(rows[j]).children("td")[self.cols.streetAddress]).text(
        self.table[j - 1][17]
      ); ////SHOW THE STREET ADDRESS WITHOUT UNIT#
      $($(rows[j]).children("td")[self.cols.unitNo]).text(
        self.table[j - 1][18]
      ); ////SHOW THE UNIT NO SEPARATELY
      if (self.table[j - 1][12].trim()) {
        $($(rows[j]).children("td")[self.cols.complexName]).text(
          self.table[j - 1][12]
        ); ////SHOW NORMALIZED COMPLEX NAME
      }
    }

    var maxChange = Math.max(...assessChangeActive);
    var minChange = Math.min(...assessChangeActive);
    for (var i = 0; i < self.table.length; i++) {
      if (self.table[i][8] == maxChange) {
        $(rows[i + 1]).css("color", "red");
      }
      if (self.table[i][8] == minChange) {
        $(rows[i + 1]).css("color", "blue");
      }
    }

    maxChange = Math.max(...assessChangeSold);
    minChange = Math.min(...assessChangeSold);
    for (var i = 0; i < self.table.length; i++) {
      if (self.table[i][8] == maxChange) {
        $(rows[i + 1]).css("color", "red");
      }
      if (self.table[i][8] == minChange) {
        $(rows[i + 1]).css("color", "blue");
      }
    }

    self.uiTable.setSumValues(
      /*id for panel 1*/ 1,
      assessChangeActive,
      countActiveListing,
      "%"
    );
    self.uiTable.setSumValues(
      /*id for panel 2*/ 2,
      assessChangeSold,
      countSoldListing,
      "%"
    );
    self.uiTable.render(2);

    self.uiTable.setSumValues(
      /*id for panel 1*/ 1,
      assessActive,
      countActiveListing,
      "$"
    );
    self.uiTable.setSumValues(
      /*id for panel 2*/ 2,
      assessSold,
      countSoldListing,
      "$"
    );
    self.uiTable.render(3);
  },
  /////////////////////////////////////////////////////////////////////////////

  /////////////////////////////////////////////////////////////////////////////

  addLock: function(tabID) {
    chrome.runtime.sendMessage(
      { from: "SpreadSheet", todo: "addLock", tabID, tabID },
      function(response) {
        console.log("SpreadSheet got tax response:", response);
      }
    );
  }
  // setCols: function(tabTitle) {
  //   //set Spreadsheet column position by numbers
  //   this.cols = null;
  //   var cols = null;
  //   switch (tabTitle) {
  //     case "Quick Search":
  //     case "Listing Carts":
  //     case "Market Monitor":
  //       cols = {
  //         RecordNo: 0, //index 0
  //         Status: 8,
  //         address: 9,
  //         complexName: 11,
  //         ListPrice: 12,
  //         Price: 13,
  //         SoldPrice: 14,
  //         TotalFloorArea: 15,
  //         PricePSF: 16,
  //         SoldPricePSF: 17,
  //         PID: 22,
  //         landValue: 23,
  //         improvementValue: 24,
  //         totalValue: 25,
  //         changeValuePercent: 26,
  //         lotSize: 27,
  //         strataPlan: 28,
  //         houseType: 30,
  //         prevPrice: 31,
  //         city: 32
  //       };
  //       break;
  //     case "Residential Attached":
  //       cols = {
  //         RecordNo: 0, //index 0
  //         Status: 8,
  //         address: 9,
  //         complexName: 11,
  //         Price: 12,
  //         ListPrice: 14,
  //         SoldPrice: 18,
  //         TotalFloorArea: 22,
  //         PricePSF: 23,
  //         SoldPricePSF: 24,
  //         lotSize: 28,
  //         PID: 31,
  //         landValue: 32,
  //         improvementValue: 33,
  //         totalValue: 34,
  //         changeValuePercent: 35,
  //         strataPlan: 36,
  //         streetAddress: 37,
  //         unitNo: 38,
  //         houseType: 42,
  //         city: 43
  //       };
  //       break;
  //     case "Residential Detached":
  //       cols = {
  //         RecordNo: 0, //index 0
  //         Status: 8,
  //         address: 9,
  //         complexName: 31,
  //         Price: 12,
  //         ListPrice: 12,
  //         SoldPrice: 36, //
  //         TotalFloorArea: 17,
  //         PricePSF: 22,
  //         SoldPricePSF: 23,
  //         PID: 24,
  //         landValue: 25,
  //         improvementValue: 26,
  //         totalValue: 27,
  //         changeValuePercent: 28,
  //         strataPlan: 33,
  //         lotSize: 20,
  //         city: 29,
  //         houseType: 30
  //       };
  //       break;
  //     case "Tour and Open House":
  //       cols = {
  //         RecordNo: 0, //index 0
  //         Status: 20,
  //         Price: 11,
  //         ListPrice: 11,
  //         PricePSF: 12,
  //         address: 13,
  //         complexName: 14,
  //         city: 16,
  //         SoldPrice: 39, //No use for open house
  //         TotalFloorArea: 32,
  //         SoldPricePSF: 39,
  //         PID: 21,
  //         landValue: 22,
  //         improvementValue: 23,
  //         totalValue: 24,
  //         changeValuePercent: 25,
  //         strataPlan: 34,
  //         lotSize: 33,
  //         houseType: 9
  //       };
  //       break;
  //     default:
  //       cols = {
  //         RecordNo: 0, //index 0
  //         Status: 8,
  //         Price: 12,
  //         ListPrice: 14,
  //         SoldPrice: 18,
  //         TotalFloorArea: 22,
  //         PricePSF: 23,
  //         SoldPricePSF: 24,
  //         PID: 31,
  //         landValue: 32,
  //         improvementValue: 33,
  //         totalValue: 34,
  //         changeValuePercent: 35,
  //         strataPlan: 36
  //       };
  //       break;
  //   }
  //   this.cols = cols;
  // },
};

//entry point:
$(function() {
  console.log("Spreadsheet Document State:", document.readyState);
  var $loadingNotice = document.querySelector("#load_grid");
  console.log($loadingNotice);
  computeSFPrices.init();
});

//////////////////////////////////////////////////////////////////////////////
//////////////                  Recycle Code            //////////////////////
/////////////////////////////////////////////////////////////////////////////

//console.log(col14, col22, col23, listPricePSF, col24, avgListedSFP, avgSoldSFP);
//console.log("SpreadSheet Table is: ",self.table);
////POPULATE THE SQUARE.FEET.PRICE SUMMARY BOX
// self.uiTable.setHighListedSFP(
//   Math.max(...col23_ListingPrice).toFixed(0)
// );
// self.uiTable.setSumValues(
//   1,
//   Math.max(...col23_ListingPrice).toFixed(0),
//   "high"
// );
//self.uiTable.setHighSoldSFP(Math.max(...col24_SoldPrice).toFixed(0));
// self.uiTable.setSumValues(
//   2,
//   Math.max(...col24_SoldPrice).toFixed(0),
//   "high"
// );

// var listArray =
//   col23_ListingPrice.length == 0
//     ? col23_ListingPrice.push(0, 0)
//     : col23_ListingPrice;
// var sumValues = {
//   high: Math.max(...col23_ListingPrice).toFixed(0),
//   low: Math.min(...col23_ListingPrice).toFixed(0),
//   ave: avgListedSFP,
//   // med: math
//   //   .chain(
//   //     col23_ListingPrice.lenght == 0
//   //       ? col23_ListingPrice.push(0)
//   //       : col23_ListingPrice
//   //   )
//   //   .median()
//   //   .round(0)
//   //   .done(),
//   med: $fx.median(listArray),
//   total: 0
// };
// var sumValues = {
//   high: Math.max(...col24_SoldPrice).toFixed(0),
//   low: Math.min(...col24_SoldPrice).toFixed(0),
//   ave: avgSoldSFP,
//   // med: math
//   //   .chain(
//   //     col24_SoldPrice.length == 0
//   //       ? col24_SoldPrice.push(0)
//   //       : col24_SoldPrice
//   //   )
//   //   .median()
//   //   .round(0)
//   //   .done(),
//   med: col24_SoldPrice.length == 0 ? 0 : $fx.median(col24_SoldPrice),
//   total: 0
// };
//var soldArray = col24_SoldPrice
// self.uiTable.setLowListedSFP(
//   Math.min(...col23_ListingPrice).toFixed(0)
// );
// self.uiTable.setLowSoldSFP(Math.min(...col24_SoldPrice).toFixed(0));
// self.uiTable.setAvgListedSFP(avgListedSFP);
// self.uiTable.setAvgSoldSFP(avgSoldSFP);
// self.uiTable.setMedianListedSFP(
//   math
//     .chain(col23_ListingPrice)
//     .median()
//     .round(0)
//     .done()
// );
// if (col24_SoldPrice.length == 0) {
//   col24_SoldPrice.push(0);
// }
// self.uiTable.setMedianSoldSFP(
//   math
//     .chain(col24_SoldPrice)
//     .median()
//     .round(0)
//     .done()
// );
////START TO DO TAX.SEARCH
