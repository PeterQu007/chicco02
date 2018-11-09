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
        console.log("Compute Square Feet Price- Document URL: ",document.URL)
        //link to iframe's tabID
        this.tabID = $fx.getTabID(document.URL); //prefixed with # id-sign
    
        //tax search result also use spreadsheet, does not apply here
        if (this.tabID != '#tab1'){
            this.lockVisibility();
            this.$tabContentContainer = $('div' + this.tabID, top.document)
            //this.onMessage();
            this.tabTitle = this.getTabTitle(this.tabID);
            console.warn('tabID, tabTitle', this.tabID, this.tabTitle);
            this.OnTabTitle();
            this.$spreadSheet = $('#ifSpreadsheet');
            this.$searchCount = $('#SearchCount', parent.document);
            this.$grid = $('#grid');
            
            //this.recordCount = $fx.getRecordCount(parent.document.URL); // recordCount is embedded in the URL 
            this.recordCount = parseInt(this.$searchCount.text());
            console.log("record Count: ", this.recordCount);
           
            //Hook up events:
            this.OnTaxSearch();
            this.onMutation();

        }else{
            console.warn('tabID is wrong for this module: ', this.tabID);
        }
    
    },

    tabID: null,
    tabTitle: null,
    uiTable: new uiSummaryTable(),
    $spreadSheet: null,
    $searchCount: null,
    $grid: null,
    $mutationObserver: null,
    recordCount: 0,
    recordPointer: 0,
    table: [],

    onMutation(){
        var self = this;
        var loading = document.querySelector('#grid tbody');
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
                self.recordCount = parseInt(self.$searchCount.text());

                console.log("Table Rows currently is: ", x.children('tr').length, "RecordCount: ", self.recordCount);
                if (x.children('tr').length-1 == self.recordCount){

                    console.log("reach the bottom of the TABLE");
                }
                var x0 = $("div#dialogStats", parent.document);
                
                self.uiTable.showUI(x0);
                //self.uiTable.setHighPSF(250);
                var i;
                var row = []; //current row
                var col14 = []; //List Price
                var col22 = []; //FloorArea
                var col23 = []; //Listed / asking Price per SqFt
                var col24 = []; //Sold Price Per SqFt
                var col31_PID = []; //PID Column
                var col32_LandValue = []; //Land Value Colum
                var col33_ImprovementValue =[]; // Improvement Value 
                var col34_TotalAssess = []; // Total Assessment Value
                var col35_ValueChange = []; // Computed column for total value change percentage
                var col36_PlanNum = []; // Strata Plan Number
                var listPricePSF = []; //for listPrice Per Square Feet
                var sumPSFListedPrice = 0; //keep the sum of listing price per sf
                var sumPSFSoldPrice = 0; //keep the sum of sold price per sf
                var countSoldListing = 0; //keep the count of sold listings
                var soldPricePSF; //keep the sold price per square feet
                var ListingPricePSF; //keep the listing price per square feet
                for (i=1; i<rows.length; i++){ ////i=1; i<rows.length; i++
                    //console.log(rows[i], $(rows[i]).children('td')[24]);
                    row.push(i);
                    var listPrice = $fx.convertStringToDecimal($(rows[i]).children('td')[14].textContent); 
                    col14.push(listPrice);
                    row.push(listPrice);
                    var floorArea = $fx.convertStringToDecimal($(rows[i]).children('td')[22].textContent); 
                    col22.push(floorArea);
                    row.push(floorArea);
                    
                    ListingPricePSF = Number(Number(col14[col14.length-1]/col22[col22.length-1]).toFixed(2));
                    sumPSFListedPrice += ListingPricePSF;
                    listPricePSF.push(ListingPricePSF);

                    var listingAskingPricePSF = $fx.convertStringToDecimal($(rows[i]).children('td')[23].textContent, true);
                    col23.push(listingAskingPricePSF);
                    row.push(listingAskingPricePSF);

                    soldPricePSF = $fx.convertStringToDecimal($(rows[i]).children('td')[24].textContent);
                    if (soldPricePSF>0){
                        countSoldListing++;
                        col24.push(soldPricePSF);
                        sumPSFSoldPrice += soldPricePSF;
                    } 
                    //Search PID for tax info
                    self.recordPointer = i-1;
                    var pid = $(rows[i]).children('td')[31].textContent;
                    col31_PID.push(pid);
                    row.push(pid);
                    col32_LandValue.push(0);
                    row.push(0);
                    col33_ImprovementValue.push(0);
                    row.push(0);
                    col34_TotalAssess.push(0);
                    row.push(0);
                    col35_ValueChange.push(0);
                    row.push(0);
                    col36_PlanNum.push('');
                    row.push(0);
                    row.push(false);
                    self.table.push(row);
                    row = [];
                }
                var avgListedSFP = (sumPSFListedPrice / self.recordCount).toFixed(0);
                var avgSoldSFP = (sumPSFSoldPrice / countSoldListing).toFixed(0);
                //console.log(col14, col22, col23, listPricePSF, col24, avgListedSFP, avgSoldSFP);
                console.log("SpreadSheet Table is: ",self.table);
                self.uiTable.setHighListedSFP(Math.max(...col23).toFixed(0));
                self.uiTable.setHighSoldSFP(Math.max(...col24).toFixed(0));
                self.uiTable.setLowListedSFP(Math.min(...col23).toFixed(0));
                self.uiTable.setLowSoldSFP(Math.min(...col24).toFixed(0));
                self.uiTable.setAvgListedSFP(avgListedSFP);
                self.uiTable.setAvgSoldSFP(avgSoldSFP);
                self.uiTable.setMedianListedSFP(math.chain(col23).median().round(0).done());
                if (col24.length ==0){
                    col24.push(0);
                }
                self.uiTable.setMedianSoldSFP(math.chain(col24).median().round(0).done());
                self.searchTax();
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

    OnTabTitle: function () {
        let self = this;
        chrome.storage.onChanged.addListener(function (changes, area) {
            
            if (area == "sync" && "todo" in changes) {
                if (changes.todo.newValue.indexOf('getTabTitle') > -1) {
                    console.log("command::getTabTitle:", changes.todo.newValue);
                    chrome.storage.sync.get(['getTabTitle','from', 'showTabQuickSearch'], function (result) {
                        self.tabTitle = result.getTabTitle;
                        console.log("OnTabTitle.getTabTitle:", result);
                        //showQuickSearchTab
                        if (!result.showTabQuickSearch && result.getTabTitle.trim()=="Quick Search") {
                            chrome.storage.sync.set(
                                {
                                    from: 'QuickSearch' ,
                                    todo: 'hideQuickSearch'+ Math.random().toFixed(8),
                                    tabID: self.tabID
                                }
                            )
                        }
                    })
                };
            }
        })
    },

    OnTaxSearch: function () {

		(function onEvents(self) {

			chrome.storage.onChanged.addListener(function (changes, area) {
				console.log("====>Spreadsheet : got a message: !", changes);
				if (area == "sync" && "from" in changes) {
					if (changes.from.newValue.indexOf('assess') > -1 && changes.from.newValue.indexOf('ForSpreadSheet') > -1) {
                        self.updateAssess();
                        //do next tax search:
                        self.searchTax();
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
    
    searchTax: function () {
		
        var self = this;
        var i = 0;
        var unTaxed = 0;
        for (i=0; i<self.table.length; i++)
            {
                if (!self.table[i][10]){

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

    getTabTitle: function (tabID) {
        chrome.runtime.sendMessage({
            todo: 'getTabTitle',
            from: 'quickSearch',
            tabID: tabID
        }, function (response) {
            //self.tabTitle = response.tabTitle;
            //self.updateQuickSearchTabStatus();
            console.warn('QuickSearch.getTabTitle::', response);
            return response;
        })
    },

    getTabStatus: function () {
        let self = this;
        chrome.storage.sync.get('showTabQuickSearch', function (result) {

            if (result.showTabQuickSearch) {
                self.showQuickSearch();
            } else {
                self.hideQuickSearch();
            }
        })
    },

    showQuickSearch: function () {
        chrome.runtime.sendMessage({
            from: 'QuickSearch',
            todo: 'showQuickSearch',
            tabID: this.tabID
        })
    },

    hideQuickSearch: function () {
        chrome.runtime.sendMessage({
            from: 'QuickSearch',
            todo: 'hideQuickSearch',
            tabID: this.tabID
        })
    },

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
			//console.log("mls-fullpublic got total bc assessment: ", landValue, improvementValue, totalValue, lotArea);
			// if (totalValue != 0) {
			// 	if (soldPrice > 0) {
			// 		var changeValue = soldPrice - intTotalValue;
			// 		var changeValuePercent = changeValue / intTotalValue * 100;
			// 		marketLotValuePerSF = (soldPrice * land2TotalRatio / 100 / lotAreaInSquareFeet).toFixed(0);
			// 		marketHouseValuePerSF = (soldPrice * house2TotalRatio / 100 / finishedFloorArea).toFixed(0);
			// 	} else {
			// 		var changeValue = listPrice - intTotalValue;
			// 		var changeValuePercent = changeValue / intTotalValue * 100;
			// 		marketLotValuePerSF = (listPrice * land2TotalRatio / 100 / lotAreaInSquareFeet).toFixed(0);
			// 		marketHouseValuePerSF = (listPrice * house2TotalRatio / 100 / finishedFloorArea).toFixed(0);
			// 	}
			// }
			// if (houseType == 'Detached') {
			// 	var bcaLandValuePerSF = (intLandValue / lotAreaInSquareFeet).toFixed(0);
			// 	var bcaHouseValuePerSF = (intImprovementValue / finishedFloorArea).toFixed(0);
			// 	landValuePerSF = '[ $' + bcaLandValuePerSF.toString() + '/sf ]';
			// 	//console.log('landValue / lotArea', intLandValue, lotAreaInSquareFeet);
			// 	houseValuePerSF = '[ $' + bcaHouseValuePerSF.toString() + '/sf ]';
			// 	//console.log('houseValue / finishedArea', intImprovementValue, finishedFloorArea);
			// 	if (soldPrice > 0) {
			// 		var soldOldTimerPerSF = (soldPrice / lotAreaInSquareFeet).toFixed(0).toString();
			// 		olderTimerLotValuePerSF = 'OT Lot/SF sold$' + soldOldTimerPerSF + ' /bca$' + (intTotalValue / lotAreaInSquareFeet).toFixed(0).toString();
			// 	} else {
			// 		var listOldTimerPerSF = (listPrice / lotAreaInSquareFeet).toFixed(0).toString();
			// 		olderTimerLotValuePerSF = 'OT Lot/SF list$' + listOldTimerPerSF + ' /bca$' + (intTotalValue / lotAreaInSquareFeet).toFixed(0).toString();
			// 	}
            // }
            
            var i = 0;
            var price = 0;
            for (i=0; i<self.table.length; i++){
                if (pid == self.table[i][4]){
                    self.table[i][5] = landValue;
                    self.table[i][6] = improvementValue;
                    self.table[i][7] = totalValue;
                    self.table[i][10] = true; // tax done
                    price = parseInt(self.table[i][1]);

                    if (totalValue != 0) {
                       
                        var changeValue = price - intTotalValue;
                        var changeValuePercent = (changeValue / intTotalValue * 100).toFixed(0);
                        self.table[i][8] = changeValuePercent;
                        
                    }
                }
            }

            console.log('SpreadSheet: table & landValue=> ', self.table, landValue);

            var x = $('table#grid tbody');
            var rows = x.children('tr');

            var i ;
            for (i=1; i<rows.length; i++){
                $($(rows[i]).children('td')[32]).text(self.table[i-1][5]);
                $($(rows[i]).children('td')[33]).text(self.table[i-1][6]);
                $($(rows[i]).children('td')[34]).text(self.table[i-1][7]);
                $($(rows[i]).children('td')[35]).text(self.table[i-1][8]+'%');
            }

			// self.bcAssess.text((dataFromDB ? 'total:  ' : 'total*:  ') + $fx.removeDecimalFraction(totalValue));
			// self.bcLand.text('land:  ' + $fx.removeDecimalFraction(landValue) + landValuePerSF);
			// self.bcImprovement.text('house:' + $fx.removeDecimalFraction(improvementValue) + houseValuePerSF);
			// self.bcLand2ImprovementRatio.text(land2TotalRatio.toString() + '%L-T ' + house2TotalRatio.toString() + '%H-T ' + land2HouseRatio.toString() + 'L-H');
			// self.valueChange.text("$" + $fx.numberWithCommas(changeValue.toFixed(0)) + " [ " + changeValuePercent.toFixed(0).toString() + '% ]   ');
			// self.oldTimerLotValuePerSF.text(olderTimerLotValuePerSF);
			// self.marketValuePerSF.text('Lot:$' + marketLotValuePerSF.toString() + '/SF' + ' | Impv:$' + marketHouseValuePerSF.toString() + '/SF')
			// self.lotArea.text($fx.numberWithCommas($fx.convertStringToDecimal(lotAreaInSquareFeet, true)));
			// self.formalAddress.text(formalAddress);
		})
	},
}

//entry point:
$(function () {
    console.log('Spreadsheet Document State:', document.readyState);
    var $loadingNotice = document.querySelector('#load_grid');
    console.log($loadingNotice);
    computeSFPrices.init();
})

//