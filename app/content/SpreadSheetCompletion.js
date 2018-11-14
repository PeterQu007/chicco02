//ML Default Spreadsheet View Page
//Complete the information in the spread sheet table
//check complex, land tax, improve tax, total tax
//compute price change vs tax assessment
//complete strata plan column

//Residential Attached, Detached & Land Listing Search Results Page (Tab3/4/5_?_2), 
//Target: SubPage iframe #ifSpreadsheet : Listing Results Spreadsheet Table
//Function: Computing Square Feet Price Summary From the Spreadsheet Table

import uiSummaryTable from '../assets/scripts/ui/uiSummaryTable.js';
import * as math from '../assets/lib/mathjs/math.min.js';

var $fx = L$(); //add library module

var computeSFPrices = {

    init: function () {
        //console.clear();
        console.log("Spreadsheet Document URL: ", document.URL)
        //link to iframe's tabID
        this.tabID = $fx.getTabID(document.URL); //prefixed with # id-sign
        this.tabNo = parseInt(this.tabID.replace('#tab',''));
        var x = $('ul#tab-bg', top.document); //find the top tab panel
        var y = x.children('li')[this.tabNo];
        this.tabTitle = $(y).children().find('span').text().trim();
        console.warn('tabID, tabNo, tabTitle', this.tabID, this.tabNo, this.tabTitle);
        this.setCols(this.tabTitle);
        this.uiTable.tabTitle = this.tabTitle;
        //tax search result also use spreadsheet, does not apply here
        if (this.tabID >= '#tab2'){
            //this.lockVisibility();
            this.addLock(this.tabID);
            this.$tabContentContainer = $('div' + this.tabID, top.document)
            //this.onMessage();
                //this.tabTitle = this.getTabTitle(this.tabID);
                //console.warn('tabID, tabTitle', this.tabID, this.tabTitle);
                //this.OnTabTitle();
            this.$spreadSheet = $('#ifSpreadsheet');
            this.$searchCount = $('#SearchCount', parent.document);
            this.$grid = $('#grid');
            
            this.recordCount = $fx.getRecordCount(parent.document.URL); // recordCount is embedded in the URL 
            if (this.recordCount == 0){
                this.recordCount = parseInt(this.$searchCount.text());
            }
            console.log("record Count: ", this.recordCount);
           
            //Hook up events:
            this.OnTaxSearch();
            this.onMutation();

        }else{
            console.warn('tabID is wrong for this module: ', this.tabID);
        }
    
    },

    tabID: null,
    tabNo: 0,
    tabTitle: null,
    uiTable: new uiSummaryTable(),
    $spreadSheet: null,
    $searchCount: null,
    $grid: null,
    $mutationObserver: null,
    recordCount: 0,
    recordPointer: 0,
    table: [],
    cols: null,

    onMutation(){
        var self = this;
        var loading = document.querySelector('#grid tbody'); //monitor the #grid tbody, check the listing records
        var $mutationObserver = new MutationObserver(function(mutations) {
            
            mutations.forEach(function(mutation) {
                
                //console.warn('document state:',document.readyState);
                console.log("mutation Target: ", mutation.target);
                // (mutation.target.)
                var name = mutation.attributeName;
                var value = mutation.target.getAttribute(name);
                console.log('attriName:', name, ' Value: ', value);
              
                var x = $('table#grid tbody');
                var rows = x.children('tr');
                //self.recordCount = parseInt(self.$searchCount.text());
          
                if (x.children('tr').length-1 == self.recordCount){ //reach the bottom of the listing table

                    console.log("reach the bottom of the TABLE");
                    self.recordCount = parseInt(self.$searchCount.text());
                    console.log("Table Rows currently is: ", x.children('tr').length, "RecordCount: ", self.recordCount);
                    var x0 = $("div#dialogStats", parent.document); // for adding the summary box
                    self.uiTable.showUI(x0);

                    var i;
                    var row = []; //current row
                    var col14_ListPrice = []; //List Price
                    var col22_FloorArea = []; //FloorArea
                    var col23_ListingPrice = []; //Listed / asking Price per SqFt
                    var col24_SoldPrice = []; //Sold Price Per SqFt
                    var col31_PID = []; //PID Column
                    var col32_LandValue = []; //Land Value Colum
                    var col33_ImprovementValue =[]; // Improvement Value 
                    var col34_TotalAssess = []; // Total Assessment Value
                    var col35_ValueChange = []; // Computed column for total value change percentage
                    var col36_PlanNum = []; // Strata Plan Number
                    var colxx_LotSize = []; // lot size in square feet
                    var listPricePSF = []; //for listPrice Per Square Feet
                    var sumPSFListedPrice = 0; //keep the sum of listing price per sf
                    var sumPSFSoldPrice = 0; //keep the sum of sold price per sf
                    var countSoldListing = 0; //keep the count of sold listings
                    var soldPricePSF; //keep the sold price per square feet
                    var ListingPricePSF; //keep the listing price per square feet
                    for (i=1; i<rows.length; i++){ ////i=1; i<rows.length; i++
                        //console.log(rows[i], $(rows[i]).children('td')[24]);
                        row.push(i); //col 0
                        var listPrice = $fx.convertStringToDecimal($(rows[i]).children('td')[self.cols.ListPrice].textContent); 
                        col14_ListPrice.push(listPrice);
                        row.push(listPrice);//col 1
                        var floorArea = $fx.convertStringToDecimal($(rows[i]).children('td')[self.cols.TotalFloorArea].textContent); 
                        col22_FloorArea.push(floorArea);
                        row.push(floorArea);//col 2
                        if(self.tabTitle == 'Residential Attached'){
                            var lotSize = $fx.convertStringToDecimal($(rows[i]).children('td')[self.cols.lotSize].textContent); 
                        }else{
                            var lotSize = $fx.convertStringToDecimal($(rows[i]).children('td')[self.cols.lotSize].textContent); 
                        }
                        
                        colxx_LotSize.push(lotSize);

                        ListingPricePSF = Number(Number(col14_ListPrice[col14_ListPrice.length-1]/col22_FloorArea[col22_FloorArea.length-1]).toFixed(2));
                        sumPSFListedPrice += ListingPricePSF;
                        listPricePSF.push(ListingPricePSF);

                        var listingAskingPricePSF = $fx.convertStringToDecimal($(rows[i]).children('td')[self.cols.PricePSF].textContent, true);
                        col23_ListingPrice.push(listingAskingPricePSF);
                        row.push(listingAskingPricePSF);//col 3

                        soldPricePSF = $fx.convertStringToDecimal($(rows[i]).children('td')[self.cols.SoldPricePSF].textContent);
                        if (soldPricePSF>0){
                            countSoldListing++;
                            col24_SoldPrice.push(soldPricePSF);
                            sumPSFSoldPrice += soldPricePSF;
                        } 
                        //Search PID for tax info
                        self.recordPointer = i-1;
                        var pid = $(rows[i]).children('td')[self.cols.PID].textContent;
                        col31_PID.push(pid);
                        row.push(pid); //col 4
                        col32_LandValue.push(0);
                        row.push(0);////col 5
                        col33_ImprovementValue.push(0);
                        row.push(0); //col 6
                        col34_TotalAssess.push(0);
                        row.push(0); //col 7
                        col35_ValueChange.push(0);
                        row.push(0); //col 8
                        col36_PlanNum.push('');
                        row.push(0); //col 9
                        row.push(false); //col 10
                        row.push(lotSize); // add lotSize for single house or land
                        self.table.push(row);
                        row = [];
                    }
                    var avgListedSFP = (sumPSFListedPrice / self.recordCount).toFixed(0);
                    var avgSoldSFP = (sumPSFSoldPrice / countSoldListing).toFixed(0);
                    //console.log(col14, col22, col23, listPricePSF, col24, avgListedSFP, avgSoldSFP);
                    console.log("SpreadSheet Table is: ",self.table);
                    self.uiTable.setHighListedSFP(Math.max(...col23_ListingPrice).toFixed(0));
                    self.uiTable.setHighSoldSFP(Math.max(...col24_SoldPrice).toFixed(0));
                    self.uiTable.setLowListedSFP(Math.min(...col23_ListingPrice).toFixed(0));
                    self.uiTable.setLowSoldSFP(Math.min(...col24_SoldPrice).toFixed(0));
                    self.uiTable.setAvgListedSFP(avgListedSFP);
                    self.uiTable.setAvgSoldSFP(avgSoldSFP);
                    self.uiTable.setMedianListedSFP(math.chain(col23_ListingPrice).median().round(0).done());
                    if (col24_SoldPrice.length ==0){
                        col24_SoldPrice.push(0);
                    }
                    self.uiTable.setMedianSoldSFP(math.chain(col24_SoldPrice).median().round(0).done());
                    self.searchTax();
                }
    
            });
        });

        $mutationObserver.observe(loading, {
            attributes: true,
            characterData: true,
            childList: false,
            subtree: false,
            attributeOldValue: true,
            characterDataOldValue: true
        });
    },

    highLightCol25(){
        var xTable = $('#grid');
        var rows = xTable.children('tr');
        var i;
        for (i=1; i<rows.length; i++){
            console.log(rows[i].nth-child(25));
        }
    },

    // OnTabTitle: function () {
    //     let self = this;
    //     chrome.storage.onChanged.addListener(function (changes, area) {
            
    //         if (area == "sync" && "todo" in changes) {
    //             if (changes.todo.newValue.indexOf('getTabTitle') > -1) {
    //                 console.log("command::getTabTitle:", changes.todo.newValue);
    //                 chrome.storage.sync.get(['getTabTitle','from', 'showTabQuickSearch'], function (result) {
    //                     self.tabTitle = result.getTabTitle;
    //                     console.log("OnTabTitle.getTabTitle:", result);
    //                     //showQuickSearchTab
    //                     if (!result.showTabQuickSearch && result.getTabTitle.trim()=="Quick Search") {
    //                         chrome.storage.sync.set(
    //                             {
    //                                 from: 'QuickSearch' ,
    //                                 todo: 'hideQuickSearch'+ Math.random().toFixed(8),
    //                                 tabID: self.tabID
    //                             }
    //                         )
    //                     }
    //                 })
    //             };
    //         }
    //     })
    // },

    OnTaxSearch: function () {

		(function onEvents(self) {

			chrome.storage.onChanged.addListener(function (changes, area) {
                console.log("====>Spreadsheet : got a message: !", changes);
                if(self.$spreadSheet.css('display') == 'none'){
                    return;
                }
				if (area == "sync" && "from" in changes) {
					if (changes.from.newValue.indexOf('assess') > -1 && changes.from.newValue.indexOf('ForSpreadSheet') > -1) {
                        if(changes.from.newValue.indexOf('-TaxSearchFailed')>-1){
                            self.updateAssessWhenTaxSearchFailed();
                        }else{
                            self.updateAssess();
                        }
                        
                        //do next tax search:
                        //self.sleep(2000); // 90 listing records cost 7 minutes
                        //self.sleep(1000); // 90 listing records cost 3.5 minutes
                        //self.sleep(500); //Trigger error: Unchecked runtime.lastError: This request exceeds the MAX_WRITE_OPERATIONS_PER_HOUR quota.
                                            //chrome-extension://lgbkgggiieaokaancjejpfbagjalaoil/_generated_background_page.html
                        //self.sleep(800);//not work, trigger error at record No 51
                        setTimeout(function(){
                            this.searchTax();
                        }.bind(self), 1000);
                        
					};
					if (changes.from.newValue.indexOf('strataPlanSummary') > -1) {
						self.updateComplexListingQuan(changes);
					}
					if (changes.from.newValue.indexOf('complex') > -1) {
						self.updateComplexInfo();
					}
					
				}

			});
		})(this);
    },

    // sleep: function(milliseconds) {
    //     var start = new Date().getTime();
    //     for (var i = 0; i < 1e7; i++) {
    //       if ((new Date().getTime() - start) > milliseconds){
    //         break;
    //       }
    //     }
    // },
    
    searchTax: function () {
		
        var self = this;
        var i = 0;
        var unTaxed = 0;
        for (i=0; i<self.table.length; i++)
            {
                if (!self.table[i][10]){ //if not yet done tax search

                    unTaxed = i;
                    var pid  = self.table[unTaxed][4];
                    if (!pid) { return; };
                    chrome.storage.sync.set({ 'PID': pid });
                    chrome.storage.sync.get('PID', function (result) {
                        //console.log(">>>PID saved for tax search: ", result.PID);
                        chrome.runtime.sendMessage(
                            { from: 'SpreadSheet', todo: 'taxSearch' },
                            function (response) {
                                console.log('SpreadSheet got tax response:', response);
                                self.table[unTaxed][10]=true;
                            }
                        )
                    });
                    break;
                }
                    
            }
		
    },
    
    lockVisibility: function () {
		var divTab = $('div' + this.tabID, top.document);
		var divTaxSearch = $('div#tab1', top.document);
		this.tabContentContainer = divTab;
		//console.log(divTab);
		divTab.attr("style", "display: block!important");
		divTaxSearch.attr("style", "display: none!important");
		chrome.storage.sync.set({curTabID: this.tabID});
    },
    
    addLock: function(tabID) {
        
        chrome.runtime.sendMessage(
            { from: 'SpreadSheet', todo: 'addLock', tabID, tabID },
            function (response) {
                console.log('SpreadSheet got tax response:', response);
        
            }
        )
    },

    // getTabTitle: function (tabID) {
    //     chrome.runtime.sendMessage({
    //         todo: 'getTabTitle',
    //         from: 'quickSearch',
    //         tabID: tabID
    //     }, function (response) {
    //         //self.tabTitle = response.tabTitle;
    //         //self.updateQuickSearchTabStatus();
    //         console.warn('QuickSearch.getTabTitle::', response);
    //         return response;
    //     })
    // },

    // getTabStatus: function () {
    //     let self = this;
    //     chrome.storage.sync.get('showTabQuickSearch', function (result) {

    //         if (result.showTabQuickSearch) {
    //             self.showQuickSearch();
    //         } else {
    //             self.hideQuickSearch();
    //         }
    //     })
    // },

    // showQuickSearch: function () {
    //     chrome.runtime.sendMessage({
    //         from: 'QuickSearch',
    //         todo: 'showQuickSearch',
    //         tabID: this.tabID
    //     })
    // },

    // hideQuickSearch: function () {
    //     chrome.runtime.sendMessage({
    //         from: 'QuickSearch',
    //         todo: 'hideQuickSearch',
    //         tabID: this.tabID
    //     })
    // },

    updateAssess: function () {
		var self = this;
		// var listPrice = $fx.convertStringToDecimal(self.lp.text());
		// var soldPrice = $fx.convertStringToDecimal(self.sp.text());
		chrome.storage.sync.get(['PID','totalValue', 'improvementValue', 'landValue', 'lotSize', 'address', 'bcaDataUpdateDate', 'dataFromDB'], function (result) {
            var pid = result.PID;
            var totalValue = result.totalValue;
			var improvementValue = result.improvementValue;
			var landValue = result.landValue;
			var lotSize = result.lotSize;
			var lotArea = $fx.convertStringToDecimal(lotSize, true);
			var lotAreaInSquareFeet = (lotArea < 500 ? (lotArea * 43560).toFixed(0) : $fx.numberWithCommas($fx.removeDecimalFraction(lotArea)));
			var formalAddress = result.address.trim();
			//var finishedFloorArea = $fx.convertStringToDecimal(self.finishedFloorArea.text());
			var intTotalValue = $fx.convertStringToDecimal(totalValue);
			var intImprovementValue = $fx.convertStringToDecimal(improvementValue);
			var intLandValue = $fx.convertStringToDecimal(landValue);
			var land2TotalRatio = (intLandValue / intTotalValue * 100).toFixed(1);
			var house2TotalRatio = (intImprovementValue / intTotalValue * 100).toFixed(1);
			var land2HouseRatio = (intLandValue / intImprovementValue).toFixed(1);
			var landValuePerSF = '';
			var houseValuePerSF = '';
			var olderTimerLotValuePerSF = '';
			var marketLotValuePerSF = '';
			var marketHouseValuePerSF = '';
			var marketValuePerSF = '';
			//var houseType = self.houseListingType;
			var dataFromDB = result.dataFromDB;
		            
            var i = 0;
            var price = 0;
            var rowNumber = [];
            for (i=0; i<self.table.length; i++){
                if (pid == self.table[i][4]){
                    self.table[i][5] = landValue;
                    self.table[i][6] = improvementValue;
                    self.table[i][7] = totalValue;
                    self.table[i][10] = true; // tax done
                    price = parseInt(self.table[i][1]);
                    rowNumber.push(self.table[i][0]) ;
                    if (totalValue != 0) {
                       
                        var changeValue = price - intTotalValue;
                        var changeValuePercent = (changeValue / intTotalValue * 100).toFixed(0);
                        self.table[i][8] = changeValuePercent;
                        
                    }
                }
            }

            console.log('SpreadSheet: table & landValue=> ', /*self.table,*/ landValue, rowNumber);

            var x = $('table#grid tbody');
            var rows = x.children('tr');

            var i ;
            for (i=0; i<rowNumber.length; i++){
                var j = rowNumber[i];
                if(self.table[j-1][10]){
                    $($(rows[j]).children('td')[self.cols.LandValue]).text(self.table[j-1][5]);
                    $($(rows[j]).children('td')[self.cols.improvementValue]).text(self.table[j-1][6]);
                    $($(rows[j]).children('td')[self.cols.totalValue]).text(self.table[j-1][7]);
                    $($(rows[j]).children('td')[self.cols.changeValuePercent]).text(self.table[j-1][8]+'%');
                }
                
            }

		
		})
    },

    updateAssessWhenTaxSearchFailed: function () {
		var self = this;
		// var listPrice = $fx.convertStringToDecimal(self.lp.text());
		// var soldPrice = $fx.convertStringToDecimal(self.sp.text());
		chrome.storage.sync.get(['PID','totalValue', 'improvementValue', 'landValue', 'dataFromDB'], function (result) {
            var pid = result.PID;
            var totalValue = result.totalValue;
			var improvementValue = result.improvementValue;
			var landValue = result.landValue;
		
			var dataFromDB = result.dataFromDB;
		            
            var i = 0;
            var price = 0;
            var rowNumber = [];
            for (i=0; i<self.table.length; i++){
                if (pid == self.table[i][4]){
                    self.table[i][5] = landValue;
                    self.table[i][6] = improvementValue;
                    self.table[i][7] = totalValue;
                    self.table[i][10] = true; // tax done
                    
                    rowNumber.push(self.table[i][0]) ;
                    
                    var changeValue = 0;
                    var changeValuePercent = 0;
                    self.table[i][8] = changeValuePercent;
                        
                    
                }
            }

            console.log('SpreadSheet: table & landValue FAILED=> ', /*self.table,*/ landValue, rowNumber);

            var x = $('table#grid tbody');
            var rows = x.children('tr');

            var i ;
            for (i=0; i<rowNumber.length; i++){
                var j = rowNumber[i];
                if(self.table[j-1][10]){
                    $($(rows[j]).children('td')[self.cols.LandValue]).text(self.table[j-1][5]);
                    $($(rows[j]).children('td')[self.cols.improvementValue]).text(self.table[j-1][6]);
                    $($(rows[j]).children('td')[self.cols.totalValue]).text(self.table[j-1][7]);
                    $($(rows[j]).children('td')[self.cols.changeValuePercent]).text(self.table[j-1][8]+'%');
                }
                
            }

		
		})
    },
    
    setCols: function(tabTitle){
        //set Spreadsheet column position by numbers
        this.cols=null;
        var cols = null;
        switch(tabTitle){
            case 'Quick Search':
            case 'Listing Carts':
                cols = {
                    Status: 8,
                    ListPrice: 12,
                    Price: 13,
                    SoldPrice: 14,
                    TotalFloorArea: 15,
                    PricePSF: 16,
                    SoldPricePSF: 17,
                    PID: 22,
                    LandValue: 23,
                    improvementValue: 24,
                    totalValue: 25,
                    changeValuePercent: 26,
                    lotSize: 27,
                    strataPlan: 28
                }
                break;
            case 'Residential Attached':
                cols = {
                    Status: 8,
                    Price: 12,
                    ListPrice: 14,
                    SoldPrice: 18,
                    TotalFloorArea: 22,
                    PricePSF: 23,
                    SoldPricePSF: 24,
                    lotSize: 28,
                    PID: 31,
                    LandValue: 32,
                    improvementValue: 33,
                    totalValue: 34,
                    changeValuePercent: 35,
                    strataPlan: 36
                }
                break;
            case 'Residential Detached':
                cols = {
                    Status: 8,
                    Price: 12,
                    ListPrice: 12,
                    SoldPrice: 36, //
                    TotalFloorArea: 17,
                    PricePSF: 22,
                    SoldPricePSF: 23,
                    PID: 24,
                    LandValue: 25,
                    improvementValue: 26,
                    totalValue: 27,
                    changeValuePercent: 28,
                    strataPlan: 30,
                    lotSize: 20
                }
                break;
            default:
                cols = {
                    Status: 8,
                    Price: 12,
                    ListPrice: 14,
                    SoldPrice: 18,
                    TotalFloorArea: 22,
                    PricePSF: 23,
                    SoldPricePSF: 24,
                    PID: 31,
                    LandValue: 32,
                    improvementValue: 33,
                    totalValue: 34,
                    changeValuePercent: 35,
                    strataPlan: 36
                }
                break;
        }
        this.cols = cols;
        
    }
}

//entry point:
$(function () {
    console.log('Spreadsheet Document State:', document.readyState);
    var $loadingNotice = document.querySelector('#load_grid');
    console.log($loadingNotice);
    computeSFPrices.init();
})

//