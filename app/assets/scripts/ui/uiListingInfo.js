// UI element: ListingInfo

export default class UIListingInfo {
    constructor(){
        this.UIDiv = $('<div id="uiListingInfo"></div>');
        this.mlsNo = $('<div>MLS #</div>');
        //divs for strata & complex info:
        this.planNo = $('<div id="strataPlan">PlanNo: </div>');
        this.planLink = $(`<a href="https://bcres.paragonrels.com/ParagonLS/Home/Page.mvc#HomeTab" 
                            target="HomeTab" id="strataPlanLink" ></a>`);
        this.formalAddress = $('<div id="formalAddress">adr: </div>');
        this.complexSummary = $('<div id="complexSummary"></div>')
        this.complexName = $('<span id="complexName">ComplexName</span>');
        this.complexListingQuantity = $('<span id="listingQuantity"></span>');
        this.inputComplexName = $('<input name="inputComplexName" id="inputComplexName"/>');
        this.btnSaveComplexName = $('<button name="saveComplexName" id="saveComplexName" class="btn btn-primary">Save</button>');
        //divs for BC Assessment:
        this.landValue = $('<div id="landValue">land value</div>');
        this.houseValue = $('<div id="houseValue">house value</div>');
        this.landValuePercent = $('<div>land value percent</div>');
        this.houseValuePercent = $('<div>house value percent</div>');
        this.landHouseRatio = $('<div id="land2HouseRatio">land house ratio</div>');
        this.totalValue = $('<div id="totalValue"></div>');
        this.valueChange = $('<div id="valueChange"></div>');
        this.valueChangePercent = $('<div id="valueChangePercent"></div>');
        this.oldTimerLotValuePerSF = $('<div id="oldTimerLotValuePerSF"></div>');
        this.marketValuePerSF = $('<div id="marketValuePerSF"></div>');
        //divs for remarks:
        this.realtorRemarks = $('<div id="realtorRemarks"></div>');
        this.publicRemarks = $('<div id="publicRemarks"></div>');
        //divs for showing info:
        this.showingInfo = $('<div id="showingInfo">Showing info:</div>');
        this.inputClientName = $('<input id="clientName" type="text"/>');
        this.inputShowingRequest = $('<input id ="showingRequest" type="text"/>');
        this.inputShowingDate = $('<input id="showingDate"/>');
        this.inputShowingTime = $('<input id="showingTime"/>');
        this.btnSaveShowing = $('<button id="saveShowing" class="btn btn-success">Save</button>');
        //assemble the elements:
        this.buildUI();
    }

    buildUI(){
        let uiDiv = this.UIDiv;
        uiDiv.append(this.mlsNo);
        //add strata & complex info
        this.planLink.appendTo(this.planNo);
        uiDiv.append(this.planNo);
        uiDiv.append(this.formalAddress);
        this.complexName.appendTo(this.complexSummary);
        this.complexListingQuantity.appendTo(this.complexSummary);
        uiDiv.append(this.complexSummary);
        uiDiv.append(this.inputComplexName);
        uiDiv.append(this.btnSaveComplexName);
        //add bca info
        uiDiv.append($('<hr/>'));
        uiDiv.append(this.landValue);
        uiDiv.append(this.houseValue);
        uiDiv.append(this.totalValue);
        uiDiv.append(this.valueChange);
        uiDiv.append(this.oldTimerLotValuePerSF);
        uiDiv.append(this.marketValuePerSF);
        //add remarks
        uiDiv.append($('<hr/>'));
        uiDiv.append(this.realtorRemarks);
        uiDiv.append(this.publicRemarks);
        //add showing info
        uiDiv.append($('<hr/>'));
        uiDiv.append(this.showingInfo);
        uiDiv.append(this.inputClientName);
        uiDiv.append(this.inputShowingRequest);
        uiDiv.append(this.inputShowingDate);
        uiDiv.append(this.inputShowingTime);
        uiDiv.append(this.btnSaveShowing);
    }

    showUI(container){
        this.UIDiv.appendTo(container);
        this.UIDiv.addClass('uilistinginfo');
        //change inputbox width:
        this.UIDiv.children('input').addClass('inputbox');
        this.realtorRemarks.addClass('bottomline');
    }
}