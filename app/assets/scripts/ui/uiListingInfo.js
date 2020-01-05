// UI element: ListingInfo
// import GoogleMapsApi from "../modules/GoogleMapsApi";
// const gmapApi = new GoogleMapsApi();

export default class UIListingInfo {
  constructor() {
    this.UIDiv = $('<div id="uiListingInfo"></div>');
    this.UIMap = $('<div id="uiListingMap"></div>');
    this.UIPics = $('<div id="uiListingPics"></div>');
    this.listingPic = $('<img src="">');
    this.mapBox = $('<div id="mapBox"></div>');
    this.mapView = $(
      '<iframe id="mapViewFrame" src="https://bcres.paragonrels.com/ParagonLS/Reports/Report.mvc?listingIDs=262360698&amp;screenWidth=1007&amp;uniqueIDs=&amp;viewID=77&amp;classID=1&amp;usePDF=false&amp;ShowAds=false&amp;searchID=tab4_1_2&amp;listingMode=0&amp;compact=true" ></iframe>'
    );
    this.listingID = null;
    this.mapSrc1 = `https://bcres.paragonrels.com/ParagonLS/Reports/Report.mvc?listingIDs=`;
    this.mapSrc2 = `&screenWidth=1007&uniqueIDs=&viewID=77&classID=1&usePDF=false&ShowAds=false&searchID=tab4_1_2&listingMode=0&compact=true`;
    this.mlsNo = $("<div>MLS #</div>");
    //divs for strata & complex info:
    this.planNo = $('<div id="strataPlan">PlanNo: </div>');
    this.planLink = $(`<a href="https://bcres.paragonrels.com/ParagonLS/Home/Page.mvc#HomeTab" 
                            target="HomeTab" id="strataPlanLink" ></a>`);
    this.formalAddress = $('<div id="formalAddress">adr: </div>');
    this.complexSummary = $('<div id="complexSummary"></div>');
    this.complexName = $('<span id="complexName">ComplexName</span>');
    this.complexListingQuantity = $('<span id="listingQuantity"></span>');
    this.inputComplexName = $(
      '<input name="inputComplexName" id="inputComplexName"/>'
    );
    this.btnSaveComplexName = $(
      '<button name="saveComplexName" id="saveComplexName" class="SearchBtn">Save Complex</button>'
    );
    //Exposure
    this.inputExposure = $('<input name="inputExposure" id="inputExposure"/>');
    this.btnSaveExposure = $(
      '<button name="saveExposure" id="saveExposure" class="SearchBtn">Save Exposure</button>'
    );
    //Listing Status
    this.inputListing = $('<input name="inputListing" id="inputListing"/>');
    this.btnSaveListing = $(
      '<button name="saveListing" id="saveListing" class="SearchBtn">Save Status</button>'
    );
    //divs for BC Assessment:
    this.landValue = $('<div id="landValue">land value</div>');
    this.houseValue = $('<div id="houseValue">house value</div>');
    this.landValuePercent = $("<div>land value percent</div>");
    this.houseValuePercent = $("<div>house value percent</div>");
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
    this.inputClientName = $(
      '<span>ClientName:</span><input id="clientName" type="text"/>'
    );
    this.inputShowingNote = $(
      '<span>ShowingNote:</span><input id ="showingNote" type="text"/>'
    );
    this.inputShowingDate = $('<span>Date:</span><input id="showingDate"/>');
    this.inputShowingTime = $('<span>Time:</span><input id="showingTime"/>');
    this.btnSaveShowing = $(
      '<button id="saveShowing" class="SearchBtn">Save</button>'
    );
    //Google Map Apis
    this.map = null;
    this.geocoder = null;

    //assemble the elements:
    this.buildUI();
  }

  buildMapSrc(listingID) {
    let src = this.mapSrc1 + listingID + this.mapSrc2;
    return src;
  }

  buildUI() {
    let uiDiv = this.UIDiv;
    let uiMap = this.UIMap;
    let uiPics = this.UIPics;

    this.mapBox.append(this.mapView);
    uiMap.append(this.mapBox);

    //add images
    var i = 0;
    for (i = 0; i < 20; i++) {
      let imgAnchor = $('<a href=""></a>');
      imgAnchor.attr("id", "imgAnchor" + i);

      let tempPic = $('<img src="">');
      tempPic.attr("id", "img" + i);
      tempPic.addClass("picBox");
      tempPic.appendTo(imgAnchor);
      //uiPics.append(tempPic);
      uiPics.append(imgAnchor);
    }

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
    //add exposure elements:
    uiDiv.append(this.inputExposure);
    uiDiv.append(this.btnSaveExposure);
    //add listing status elements:
    uiDiv.append(this.inputListing);
    uiDiv.append(this.btnSaveListing);
    //add bca info
    uiDiv.append($("<hr/>"));
    uiDiv.append(this.landValue);
    uiDiv.append(this.houseValue);
    uiDiv.append(this.totalValue);
    uiDiv.append(this.valueChange);
    uiDiv.append(this.oldTimerLotValuePerSF);
    uiDiv.append(this.marketValuePerSF);
    //add remarks
    uiDiv.append($("<hr/>"));
    uiDiv.append(this.realtorRemarks);
    uiDiv.append(this.publicRemarks);
    //add showing info
    uiDiv.append($("<hr/>"));
    uiDiv.append(this.showingInfo);
    uiDiv.append(this.inputClientName);
    uiDiv.append(this.inputShowingNote);
    uiDiv.append(this.inputShowingDate);
    uiDiv.append(this.inputShowingTime);
    uiDiv.append(this.btnSaveShowing);
  }

  showUI(container) {
    //map
    this.mapView.attr("src", this.buildMapSrc(this.listingID));
    this.UIMap.appendTo(container);
    this.UIPics.appendTo(container);
    this.UIPics.addClass("picContainer");
    this.UIMap.addClass("mapView");
    this.mapBox.addClass("mapBox");
    this.mapView.addClass("mapBox");
    this.UIDiv.appendTo(container);
    this.UIDiv.addClass("uilistinginfo");
    //change inputbox width:
    this.UIDiv.children("input").addClass("inputbox");
    this.realtorRemarks.addClass("bottomline");
  }
}
