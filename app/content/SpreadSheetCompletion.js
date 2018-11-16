//ML Default Spreadsheet View Page
//Complete the information in the spread sheet table
//check complex, land tax, improve tax, total tax
//compute price change vs tax assessment
//complete strata plan column

//Residential Attached, Detached & Land Listing Search Results Page (Tab3/4/5_?_2), 
//Target: SubPage iframe #ifSpreadsheet : Listing Results Spreadsheet Table
//Function: Computing Square Feet Price Summary From the Spreadsheet Table

import uiSummaryTable from '../assets/scripts/ui/uiSummaryTable.js';
import addressInfo from '../assets/scripts/modules/AddressInfo';
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
            this.onTaxSearch();
            this.onMutation();
            this.onComplexSearch();

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
    table: [], //for assessment search
    rowNumber: [], //for table col 0 , keep the listing row number of spreadsheet
    tableComplex: [], //for complexName search
    cols: null,

    onMutation(){
        //populate the table / tableComplex
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
                self.table.length = 0; //init table
                self.rowNumber.length =0; //init rowNumber

                if (x.children('tr').length-1 == self.recordCount){ //reach the bottom of the listing table

                    console.log("reach the bottom of the TABLE");
                    self.recordCount = parseInt(self.$searchCount.text());
                    console.log("Table Rows currently is: ", x.children('tr').length, "RecordCount: ", self.recordCount);
                    var x0 = $("div#dialogStats", parent.document); // for adding the summary box
                    self.uiTable.showUI(x0);
                    self.table.length = 0;

                    var i;
                    var row = []; //current row
                    var col14_Price = []; //List Price
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
                        var price = $fx.convertStringToDecimal($(rows[i]).children('td')[self.cols.Price].textContent); 
                        col14_Price.push(price);
                        row.push(price);//col 1
                        var floorArea = $fx.convertStringToDecimal($(rows[i]).children('td')[self.cols.TotalFloorArea].textContent); 
                        col22_FloorArea.push(floorArea);
                        row.push(floorArea);//col 2
                        if(self.tabTitle == 'Residential Attached'){
                            var lotSize = $fx.convertStringToDecimal($(rows[i]).children('td')[self.cols.lotSize].textContent); 
                        }else{
                            var lotSize = $fx.convertStringToDecimal($(rows[i]).children('td')[self.cols.lotSize].textContent); 
                        }
                        
                        colxx_LotSize.push(lotSize);

                        ListingPricePSF = Number(Number(col14_Price[col14_Price.length-1]/col22_FloorArea[col22_FloorArea.length-1]).toFixed(2));
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
                        var complexName = $(rows[i]).children('td')[self.cols.complexName].textContent;
                        var address = $(rows[i]).children('td')[self.cols.address].textContent;
                        var houseType = $(rows[i]).children('td')[self.cols.houseType].textContent;
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
                        row.push(""); //col 9 for PlanNum
                        row.push(false); //col 10 : taxSearch Sign
                        row.push(lotSize); // col 11 : add lotSize for single house or land
                        row.push(complexName); //col 12: for complex Name
                        row.push(address); //col 13: for address
                        row.push(houseType); //col 14: for houseType
                        row.push(false); //col 15: complexSearch Sign
                        row.push(''); //col 16: placeholder for complexID
                        self.table.push(row);
                        row = [];
                    }
                    var avgListedSFP = (sumPSFListedPrice / self.recordCount).toFixed(0);
                    var avgSoldSFP = (sumPSFSoldPrice / countSoldListing).toFixed(0);
                    //console.log(col14, col22, col23, listPricePSF, col24, avgListedSFP, avgSoldSFP);
                    console.log("SpreadSheet Table is: ",self.table);
                    //set up the additional summary box 
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

    //////////////////////////////////////////////////////////////////////////////
    ///////////////////          Assessment Search Code              /////////////    
    //////////////////////////////////////////////////////////////////////////////
    onTaxSearch: function () {

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
                
                        setTimeout(function(){
                            //go to next listing for assess date
                            this.searchTax();
                        }.bind(self), 1000);
                        
					};
				
				
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
            if (!self.table[i][10]){ //if not yet done tax search

                unTaxed = i;
                var pid  = self.table[unTaxed][4];
                var c = '';
                var newPID ='';
                //only keep numbers and dash character
                for(var n =0 ; n<pid.length; n++){
                    c=pid[n];
                    if ( c == '-' ) { 
                        newPID += c;
                        continue; };
                    if (parseInt(c)>=0 && parseInt(c)<=9){ newPID +=c };
                }
                pid = newPID;
                if (!pid) { return; };
                chrome.storage.sync.set({ 'PID': pid });
                chrome.storage.sync.get('PID', function (result) {
                    //console.log(">>>PID saved for tax search: ", result.PID);
                    //////////////////////////////////////////////////////////
                    //SEND OUT SEARCH TAX COMMAND
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
            if (i == self.table.length-1) {
                console.log('taxSearch done!');
                //Begin to search complex
                //planNum, address, complex, houseType
                self.searchComplex();
                
            }
        }
		
    },

    updateAssess: function () {
		var self = this;
	
		chrome.storage.sync.get(['PID','totalValue', 'improvementValue', 'landValue', 'lotSize', 'address', 'bcaDataUpdateDate', 'planNum','dataFromDB'], function (result) {
            var pid = result.PID;
            var totalValue = result.totalValue;
			var improvementValue = result.improvementValue;
			var landValue = result.landValue;
            var lotSize = result.lotSize;
            var planNum = result.planNum;
            var formalAddress = result.address.trim();
            var aInfo = null;
            var houseType = null;
			var intTotalValue = $fx.convertStringToDecimal(totalValue);
        
            var i = 0;
            var price = 0;
            var rowNumber = self.rowNumber;
  
            for (i=0; i<self.table.length; i++){
                var checkPID = self.table[i][4];
                var c = '';
                var newPID ='';
                //only keep numbers and dash character
                for(var n =0 ; n<checkPID.length; n++){
                    c=checkPID[n];
                    if ( c == '-' ) { 
                        newPID += c;
                        continue; };
                    if (parseInt(c)>=0 && parseInt(c)<=9){ newPID +=c };
                }
                if (pid == newPID){
                    self.table[i][5] = landValue;
                    self.table[i][6] = improvementValue;
                    self.table[i][7] = totalValue;
                    self.table[i][9] = planNum;
                    self.table[i][10] = true; // tax done, toggle the row's tax search sign
                    self.table[i][13] = formalAddress; // formal address from tax search
                    houseType = self.table[i][14] ; //fetch houseType
                    aInfo = new addressInfo(formalAddress, houseType, true);
                    self.table[i][16] = planNum + aInfo.addressID; //complexID
                    price = parseInt(self.table[i][1]);
                    rowNumber.push(self.table[i][0]) ;
                    if (totalValue != 0) {
                        //calculate the price change percentage
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
                    $($(rows[j]).children('td')[self.cols.landValue]).text(self.table[j-1][5]);
                    $($(rows[j]).children('td')[self.cols.improvementValue]).text(self.table[j-1][6]);
                    $($(rows[j]).children('td')[self.cols.totalValue]).text(self.table[j-1][7]);
                    $($(rows[j]).children('td')[self.cols.changeValuePercent]).text(self.table[j-1][8]+'%');
                    $($(rows[j]).children('td')[self.cols.strataPlan]).text(self.table[j-1][9]); //Show Plan Num in the table
                    $($(rows[j]).children('td')[self.cols.address]).text(self.table[j-1][13]); //Show formal address on the table
                    //Complex Name will be udpated after all tax search done
                }
                
            }

		
		})
    },

    updateAssessWhenTaxSearchFailed: function () {
		var self = this;
	
		chrome.storage.sync.get(['PID','totalValue', 'improvementValue', 'landValue', 'address', 'planNum', 'dataFromDB'], function (result) {
            var pid = result.PID;
            var totalValue = result.totalValue;
			var improvementValue = result.improvementValue;
			var landValue = result.landValue;
            var planNum = result.planNum;
            var formalAddress = result.address.trim();
            var houseType = '';
            var aInfo = null;
			var dataFromDB = result.dataFromDB;
		            
            var i = 0;
            var price = 0;
            var rowNumber = self.rowNumber;
            for (i=0; i<self.table.length; i++){
                if (pid == self.table[i][4]){
                    self.table[i][5] = landValue;
                    self.table[i][6] = improvementValue;
                    self.table[i][7] = totalValue;
                    self.table[i][9] = planNum;
                    self.table[i][10] = true; // tax done
                    houseType = self.table[i][14] ; //fetch houseType
                   
                   if(planNum) {
                        aInfo = new addressInfo(formalAddress, houseType, true);
                        self.table[i][16] = planNum + aInfo.addressID; //complexID
                    }else{
                        //format the address of table col 13:
                        aInfo = new addressInfo(/*address col 13 */self.table[i][13], /*houseType col 14*/self.table[i][14]); 
                        formalAddress = aInfo.formalAddress;
                        planNum = 'NO-Plan-Number';
                        self.table[i][16] = /*planNum need to get from legalDescription */planNum + aInfo.addressID; //complexID
                    }
                    
                    self.table[i][13] = formalAddress; // formal address from tax search
                    price = parseInt(self.table[i][1]);

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
                    $($(rows[j]).children('td')[self.cols.landValue]).text(self.table[j-1][5]);
                    $($(rows[j]).children('td')[self.cols.improvementValue]).text(self.table[j-1][6]);
                    $($(rows[j]).children('td')[self.cols.totalValue]).text(self.table[j-1][7]);
                    $($(rows[j]).children('td')[self.cols.changeValuePercent]).text(self.table[j-1][8]+'%');
                    $($(rows[j]).children('td')[self.cols.strataPlan]).text(self.table[j-1][9]);
                    $($(rows[j]).children('td')[self.cols.address]).text(self.table[j-1][13]); //Show formal address on the table
                }
            }
		})
    },

    //////////////////////////////////////////////////////////////////////////////
    ///////////////////             Complex Search Code              /////////////    
    //////////////////////////////////////////////////////////////////////////////
    onComplexSearch: function () {

		(function onEvents(self) {

			chrome.storage.onChanged.addListener(function (changes, area) {
                console.log("====>Spreadsheet : got a message: !", changes);
                if(self.$spreadSheet.css('display') == 'none'){
                    return;
                }
				if (area == "sync" && "from" in changes) {
					if (changes.from.newValue.indexOf('complex') > -1 && changes.from.newValue.indexOf('spreadSheetCompletion') > -1) {
                       
                        self.updateComplex();
             
                        setTimeout(function(){
                            //go to next listing for assess date
                            this.searchComplex();
                        }.bind(self), 1000);
                        
					};
	
				}
			});
		})(this);
    },

    searchComplex: function (planNum, address, complexName, houseType ) {
        var self = this;
        var i = 0;
        var unSearchComplex = 0;
        var planNum = '';
        var address = '';
        var complexName = '';
        var houseType = '';
        var complexID = '';

        for (i=0; i<self.table.length; i++)
        {
            if (!self.table[i][15]){ //if not yet done tax search
                unSearchComplex = i;
                complexID = self.table[i][16];
                //planNum, address, complex, houseType
                planNum = self.table[i][9];
                address = self.table[i][13];
                complexName = self.table[i][12];
                houseType = self.table[i][14];
                if(houseType == 'HOUSE'){
                    //Detached Property no need to do complex Search
                    self.table[i][15] = true;
                    continue;
                }
                if(!complexID){
                    // re do complexID
                    var isFormal = true; // this is formal address from tax search
                    var aInfo = new addressInfo(address, houseType, isFormal); //todo list...
                    complexID = planNum + aInfo.addressID;
                };
                ////////////////////////////////////////////
                var complexInfo = {
                    _id: complexID,
                    name: complexName,
                    todo: 'searchComplex',
                    from: "spreadSheetCompletion"
                };

                chrome.runtime.sendMessage(
                    complexInfo, function (response) {
                    }
                )
                ////////////////////////////////////////
                break;
            }
            if (i == self.table.length-1) {
                console.log('complexSearch done!');
            }
        }
    },

    updateComplex: function () {
        var self = this;

        chrome.storage.sync.get(['_id','name'], function (result) {
            var complexID = result._id;
            var complexName = result.name;
		
            var i = 0;
            var rowNumber = self.rowNumber;
            for (i=0; i<self.table.length; i++){
                if (complexID == self.table[i][16]){
                    self.table[i][12] = complexName;
                    self.table[i][15] = true; // toggle the row's complex search sign
                }
            }

            var x = $('table#grid tbody');
            var rows = x.children('tr');

            i = 0 ;
            for (i=0; i<rowNumber.length; i++){
                var j = rowNumber[i];
                if(self.table[j-1][15]){
                
                    $($(rows[j]).children('td')[self.cols.complexName]).text(self.table[j-1][12]); //Show formal address on the table
         
                }
            }
		})
    },
    /////////////////////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////////////////////
    setCols: function(tabTitle){
        //set Spreadsheet column position by numbers
        this.cols=null;
        var cols = null;
        switch(tabTitle){
            case 'Quick Search':
            case 'Listing Carts':
                cols = {
                    RecordNo: 0, //index 0
                    Status: 8,
                    address: 9,
                    complexName: 11,
                    ListPrice: 12,
                    Price: 13,
                    SoldPrice: 14,
                    TotalFloorArea: 15,
                    PricePSF: 16,
                    SoldPricePSF: 17,
                    PID: 22,
                    landValue: 23,
                    improvementValue: 24,
                    totalValue: 25,
                    changeValuePercent: 26,
                    lotSize: 27,
                    strataPlan: 28,
                    houseType: 29
                }
                break;
            case 'Residential Attached':
                cols = {
                    RecordNo: 0, //index 0
                    Status: 8,
                    address: 9,
                    complexName: 11,
                    Price: 12,
                    ListPrice: 14,
                    SoldPrice: 18,
                    TotalFloorArea: 22,
                    PricePSF: 23,
                    SoldPricePSF: 24,
                    lotSize: 28,
                    PID: 31,
                    landValue: 32,
                    improvementValue: 33,
                    totalValue: 34,
                    changeValuePercent: 35,
                    strataPlan: 36,
                    houseType: 42
                }
                break;
            case 'Residential Detached':
                cols = {
                    RecordNo: 0, //index 0
                    Status: 8,
                    address: 9,
                    complexName: 11,
                    Price: 12,
                    ListPrice: 12,
                    SoldPrice: 36, //
                    TotalFloorArea: 17,
                    PricePSF: 22,
                    SoldPricePSF: 23,
                    PID: 24,
                    landValue: 25,
                    improvementValue: 26,
                    totalValue: 27,
                    changeValuePercent: 28,
                    strataPlan: 33,
                    lotSize: 20,
                    houseType: 30
                }
                break;
                case 'Tour and Open House':
                cols = {
                    RecordNo: 0, //index 0
                    Status: 20,
                    Price: 11,
                    ListPrice: 11,
                    address: 13,
                    complexName: 14,
                    SoldPrice: 39, //No use for open house
                    TotalFloorArea: 32,
                    PricePSF: 22,
                    SoldPricePSF: 39,
                    PID: 21,
                    landValue: 22,
                    improvementValue: 23,
                    totalValue: 24,
                    changeValuePercent: 25,
                    strataPlan: 34,
                    lotSize: 33,
                    houseType: 9
                }
                break;
            default:
                cols = {
                    RecordNo: 0, //index 0
                    Status: 8,
                    Price: 12,
                    ListPrice: 14,
                    SoldPrice: 18,
                    TotalFloorArea: 22,
                    PricePSF: 23,
                    SoldPricePSF: 24,
                    PID: 31,
                    landValue: 32,
                    improvementValue: 33,
                    totalValue: 34,
                    changeValuePercent: 35,
                    strataPlan: 36
                }
                break;
        }
        this.cols = cols;
        
    },

    addLock: function(tabID) {
        
        chrome.runtime.sendMessage(
            { from: 'SpreadSheet', todo: 'addLock', tabID, tabID },
            function (response) {
                console.log('SpreadSheet got tax response:', response);
        
            }
        )
    },

}

//entry point:
$(function () {
    console.log('Spreadsheet Document State:', document.readyState);
    var $loadingNotice = document.querySelector('#load_grid');
    console.log($loadingNotice);
    computeSFPrices.init();
})

//////////////////////////////////////////////////////////////////////////////
//////////////                  Recycle Code            //////////////////////
/////////////////////////////////////////////////////////////////////////////
// addComplexInfo: function (planNum, address, complex, tableRowIndex ) {
//     var self = this;

//     var complexName = complex; //build complexName
//     var isFormal = true; // this is formal address from tax search
//     var houseType = (address.indexOf('UNIT#')>-1? "Attached" : "Detached");
//     var address = new addressInfo(address, houseType, isFormal); //todo list...
//     var strataPlan = planNum;

//     var complexInfo = {
//         _id: strataPlan + '-' + address.streetNumber + '-' + address.streetName + '-' + address.streetType,
//         name: complexName,
//         todo: 'searchComplex',
//         from: "spreadSheetCompletion"
//     };

//     //console.log('===>add ComplexInfo: ', complexInfo);
//     chrome.runtime.sendMessage(
//         complexInfo,
//         function (response) {
//             if (response) {
//                 self.table[tableRowIndex][12] = response.name;
//             }
//         }
//     )
// },

// updateComplexInfo: function () {
//     var self = this;

//     var x = $('table#grid tbody');
//     var rows = x.children('tr');
//     var rowNumber = self.rowNumber; //array for rowNumbers
//     var planNum = '';
//     var formalAddress = '';
//     var complexName = '';
//      // 1) Update Address
//     var i ;
   
//     for (i=0; i<rowNumber.length; i++){
//         var j = rowNumber[i];
        
//         if(self.table[j-1][10]){
    
//             $($(rows[j]).children('td')[self.cols.address]).text(self.table[j-1][13]); //standardize address to formal format
//         }
        
//     }
    
//     // 2) Search Complex Name
//     var isFormal = true;
//     var houseType = '';
//     var address = null;
//     var complexInfo = null;
//     for(i = 0; i<rowNumber.length; i++){
//         planNum = self.table[i][9]; //table col 9 is planNum
//         formalAddress = self.table[i][13];
//         complexName = self.table[i][12];
//         houseType = self.table[i][14];
//         address = new addressInfo(formalAddress, houseType, isFormal); //
//         if(planNum){
//             //self.addComplexInfo(planNum, formalAddress, complexName, i); //col 12 complex name
        
//             complexInfo = {
//                 _id: planNum + '-' + address.streetNumber + '-' + address.streetName + '-' + address.streetType,
//                 name: complexName,
//                 todo: 'searchComplex',
//                 from: "spreadSheetCompletion"
//             };
    
//             chrome.runtime.sendMessage(
//                 complexInfo,
//                 function (response) {
//                     if (response) {
//                         self.table[i][12] = response.name;
//                     }
//                 }
//             )                
//         } 
//     }
    
    
    
    
//     //Update Complex Name

//     for (i=0; i<rowNumber.length; i++){
//         var j = rowNumber[i];
//         if(self.table[j-1][10]){
//             $($(rows[j]).children('td')[self.cols.complexName]).text(self.table[j-1][12]); //Show Complex name
            
//         }
        
//     }
// },

//////////////////////////////////////////////////////////////////////////////