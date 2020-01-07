console.log(">>>>>>>mapview js injected!!<<<<<<<<<???????");
var options = {
  divMap: null,
  iconBasePath: null,
  mapTypeId: null,
  region: "",
  mapBoundaryMovementCount: 0,
  isFromSearch: false,
  addressOptions: [],
  infoWindow: null,
  mapDiv: null,
  resizeMapItem: function() {},
  addressInfo: { address: "", city: "", state: "", zip: "" },
  afterFindAddress: function() {},
  showLocator: false,
  locatorDraggable: false,
  pushpinMoved: function() {},
  showCenterImage: true,
  zoomChg: null,
  dragEnd: null,
  mapTypeChanged: null
};

let countTimer = setInterval(checkComplete, 100);
let loginCount = 0;

function zoomOutToRoadMap() {
  $.bkfsMap.divMap.setZoom(15);
  $.bkfsMap.divMap.setMapTypeId("roadmap");
}

function checkComplete() {
  console.log("Check bkfsMap:");
  console.log($.bkfsMap);

  loginCount++;
  if (
    $("#jqMpCntlTopMenuList").children("li.jqMpCntlTopMenListItm").length ==
      11 ||
    $("#jqMpCntlTopMenuList").children("li.jqMpCntlTopMenListItm").length == 9
  ) {
    if ($("li.zoomInChange").length == 0) {
      //check the new item exists or not
      console.log($("#jqMpCntlTopMenuList"));
      var menu = $("#jqMpCntlTopMenuList");
      var newItem = $(`<li class="jqMpCntlTopMenListItm"><div class="jqMpCntlTopMenuDivider"></div></li>
                    <li class="jqMpCntlTopMenListItm zoomInChange", id="jqMpCntlTopMenuActionLayers">
                    <div class="jqMpCntlTopMenuBtn zoomInChange" onclick="$.bkfsMap.divMap.setZoom(18)" 
                    data-tooltip="Change Map Zoom"></div>
                    </li>`);
      newItem.appendTo(menu);
    } else if ($("li.zoomOutChange").length == 0) {
      console.log($("#jqMpCntlTopMenuList"));
      var menu = $("#jqMpCntlTopMenuList");
      var newItem = $(`<li class="jqMpCntlTopMenListItm"><div class="jqMpCntlTopMenuDivider"></div></li>
                    <li class="jqMpCntlTopMenListItm zoomOutChange", id="jqMpCntlTopMenuActionLegends">
                    <div class="jqMpCntlTopMenuBtn zoomOutChange" onclick="$.bkfsMap.divMap.setZoom(15)" 
                    data-tooltip="Change Map Zoom"></div>
                    </li>`);
      newItem.appendTo(menu);
      var newMapTypeItem = $(`<li class="jqMpCntlTopMenListItm"><div class="jqMpCntlTopMenuDivider"></div></li>
                    <li class="jqMpCntlTopMenListItm">
                    <div class="jqMpCntlTopMenuBtn jqMpCntlSubMenuImg jqMpCntlSubMenuMpTypeRoad roadMapType" onclick="$.bkfsMap.divMap.setMapTypeId('roadmap')" 
                    data-tooltip="Change Map Zoom"></div>
                    </li>`);
      newMapTypeItem.appendTo(menu);
      var newMapType2Item = $(`<li class="jqMpCntlTopMenListItm"><div class="jqMpCntlTopMenuDivider"></div></li>
                    <li class="jqMpCntlTopMenListItm">
                    <div class="jqMpCntlTopMenuBtn jqMpCntlSubMenuImg jqMpCntlSubMenuMpTypeAerial aerialMapType" onclick="$.bkfsMap.divMap.setMapTypeId('satellite')" 
                    data-tooltip="Change Map Zoom"></div>
                    </li>`);
      newMapType2Item.appendTo(menu);

      var y = $("div.jqMpCntlTopMenuBtn.zoomInChange");
      y.click();
      var x = $("div.jqMpCntlSubMenuImg.jqMpCntlSubMenuMpTypeAerial");
      x.click();
      // var z = $("div.jqMpCntlTopMenuBtn.zoomOutChange");
      // //  onclick="$.bkfsMap.divMap.setZoom(15).setMapTypeId('roadmap'
      // z.bind("click", function() {
      //   $.bkfsMap.divMap.setZoom(15);
      //   $.bkfsMap.divMap.setMapTypeId("roadmap");
      // });
    }
  }
  if (loginCount > 25) {
    clearInterval(countTimer);
    console.log("Map Failed");
  } else if ($.bkfsMap.divMap != undefined) {
    console.log($.bkfsMap.divMap);
    $.bkfsMap.divMap.setZoom(18);
  }
}
