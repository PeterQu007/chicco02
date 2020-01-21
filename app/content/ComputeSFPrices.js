//ML Default Spreadsheet View Page

import uiSummaryTable from "../assets/scripts/ui/uiSummaryTable.js";
import * as math from "../assets/lib/mathjs/math.min.js";

var $fx = L$();

var computeSFPrices = {
  init: function() {
    console.clear();
    console.log("Compute Square Feet Price- Document URL: ", document.URL);
    //link to iframe's tabID
    this.tabID = $fx.getTabID(window.frameElement.src); //prefixed with # id-sign
    this.$tabContentContainer = $("div" + this.tabID, top.document);
    //this.onMessage();
    this.tabTitle = this.getTabTitle(this.tabID);
    console.warn("tabID, tabTitle", this.tabID, this.tabTitle);
    this.OnTabTitle();
    this.$spreadSheet = $("#ifSpreadsheet");
    this.$grid = $("#grid");

    this.recordCount = $fx.getRecordCount(parent.document.URL); // recordCount is embedded in the URL
    console.log("record Count: ", this.recordCount);
    //this.uiTable.showUI(x);
    //this.uiTable.setHighPSF(250);

    this.onMutation();
  },

  tabID: null,
  tabTitle: null,
  uiTable: new uiSummaryTable(),
  $spreadSheet: null,
  $grid: null,
  $mutationObserver: null,
  recordCount: 0,

  onMutation() {
    var self = this;
    var loading = document.querySelector("#grid tbody");
    var $mutationObserver = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        //console.warn('document state:',document.readyState);
        console.log("mutation Target: ", mutation.target);
        // (mutation.target.)
        var name = mutation.attributeName;
        var value = mutation.target.getAttribute(name);
        console.log("attriName:", name, " Value: ", value);

        var x = $("table#grid tbody");
        var rows = x.children("tr");

        console.log(
          "Table Rows currently is: ",
          x.children("tr").length,
          "RecordCount: ",
          self.recordCount
        );
        if (x.children("tr").length - 1 == self.recordCount) {
          console.log("reach the bottom of the TABLE");
        }
        var x0 = $("div#dialogStats", parent.document);
        self.uiTable.showUI(x0);
        //self.uiTable.setHighPSF(250);
        var i;
        var col14 = []; //List Price
        var col22 = []; //FloorArea
        var col23 = []; //Listed / asking Price per SqFt
        var col24 = []; //Sold Price Per SqFt
        var listPricePSF = []; //for listPrice Per Square Feet
        var sumPSFListedPrice = 0; //keep the sum of listing price per sf
        var sumPSFSoldPrice = 0; //keep the sum of sold price per sf
        var countSoldListing = 0; //keep the count of sold listings
        var soldPricePSF; //keep the sold price per square feet
        var ListingPricePSF; //keep the listing price per square feet
        for (i = 1; i < rows.length; i++) {
          //console.log(rows[i], $(rows[i]).children('td')[24]);
          col14.push(
            $fx.convertStringToDecimal(
              $(rows[i]).children("td")[14].textContent
            )
          );
          col22.push(
            $fx.convertStringToDecimal(
              $(rows[i]).children("td")[22].textContent
            )
          );
          ListingPricePSF = Number(
            Number(col14[col14.length - 1] / col22[col22.length - 1]).toFixed(2)
          );
          sumPSFListedPrice += ListingPricePSF;
          listPricePSF.push(ListingPricePSF);
          col23.push(
            $fx.convertStringToDecimal(
              $(rows[i]).children("td")[23].textContent,
              true
            )
          );
          soldPricePSF = $fx.convertStringToDecimal(
            $(rows[i]).children("td")[24].textContent
          );
          if (soldPricePSF > 0) {
            countSoldListing++;
            col24.push(soldPricePSF);
            sumPSFSoldPrice += soldPricePSF;
          }
        }
        var avgListedSFP = (sumPSFListedPrice / self.recordCount).toFixed(0);
        var avgSoldSFP = (sumPSFSoldPrice / countSoldListing).toFixed(0);
        console.log(
          col14,
          col22,
          col23,
          listPricePSF,
          col24,
          avgListedSFP,
          avgSoldSFP
        );
        self.uiTable.setHighListedSFP(Math.max(...col23).toFixed(0));
        self.uiTable.setHighSoldSFP(Math.max(...col24).toFixed(0));
        self.uiTable.setLowListedSFP(Math.min(...col23).toFixed(0));
        self.uiTable.setLowSoldSFP(Math.min(...col24).toFixed(0));
        self.uiTable.setAvgListedSFP(avgListedSFP);
        self.uiTable.setAvgSoldSFP(avgSoldSFP);
        self.uiTable.setMedianListedSFP(
          math
            .chain(col23)
            .median()
            .round(0)
            .done()
        );
        self.uiTable.setMedianSoldSFP(
          math
            .chain(col24)
            .median()
            .round(0)
            .done()
        );
      });
    });

    $mutationObserver.observe(loading, {
      attributes: true,
      characterData: true,
      childList: false,
      subtree: true,
      attributeOldValue: true,
      characterDataOldValue: true
    });
  },

  highLightCol25() {
    var xTable = $("#grid");
    var rows = xTable.children("tr");
    var i;
    for (i = 1; i < rows.length; i++) {
      console.log(rows[i].nth - child(25));
    }
  },

  OnTabTitle: function() {
    let self = this;
    chrome.storage.onChanged.addListener(function(changes, area) {
      if (area == "local" && "todo" in changes) {
        if (changes.todo.newValue.indexOf("getTabTitle") > -1) {
          console.log("command::getTabTitle:", changes.todo.newValue);
          chrome.storage.local.get(
            ["getTabTitle", "from", "showTabQuickSearch"],
            function(result) {
              self.tabTitle = result.getTabTitle;
              console.log("OnTabTitle.getTabTitle:", result);
              //showQuickSearchTab
              if (
                !result.showTabQuickSearch &&
                result.getTabTitle.trim() == "Quick Search"
              ) {
                chrome.storage.local.set({
                  from: "QuickSearch",
                  todo: "hideQuickSearch" + Math.random().toFixed(8),
                  tabID: self.tabID
                });
              }
            }
          );
        }
      }
    });
  },

  getTabTitle: function(tabID) {
    chrome.runtime.sendMessage(
      {
        todo: "getTabTitle",
        from: "quickSearch",
        tabID: tabID
      },
      function(response) {
        //self.tabTitle = response.tabTitle;
        //self.updateQuickSearchTabStatus();
        console.warn("QuickSearch.getTabTitle::", response);
        return response;
      }
    );
  },

  getTabStatus: function() {
    let self = this;
    chrome.storage.local.get("showTabQuickSearch", function(result) {
      if (result.showTabQuickSearch) {
        self.showQuickSearch();
      } else {
        self.hideQuickSearch();
      }
    });
  },

  showQuickSearch: function() {
    chrome.runtime.sendMessage({
      from: "QuickSearch",
      todo: "showQuickSearch",
      tabID: this.tabID
    });
  },

  hideQuickSearch: function() {
    chrome.runtime.sendMessage({
      from: "QuickSearch",
      todo: "hideQuickSearch",
      tabID: this.tabID
    });
  }
};

//entry point:
$(function() {
  console.log("Spreadsheet Document State:", document.readyState);
  var $loadingNotice = document.querySelector("#load_grid");
  console.log($loadingNotice);
  computeSFPrices.init();
});

//
