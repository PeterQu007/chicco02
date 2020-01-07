var leftOffset = 310;

$(function() {
  _isTax = typeof _isTax == "undefined" ? false : _isTax;
  toggleBody(true);
  leftOffset = _isTax ? 0 : leftOffset;
  SetupButtons();

  var resizeEvent = isTabletDevice() ? "orientationchange" : "resize";
  $(window).bind(resizeEvent, function() {
    resizePage();
  });

  $("#chkAll").click(function() {
    var checked = $(this).prop("checked");
    $("#tblListing tr").each(function() {
      if (checked) {
        if (!$(this).hasClass("ui-state-highlight")) {
          $(this).click();
        }
      } else {
        if ($(this).hasClass("ui-state-highlight")) {
          $(this).click();
        }
      }
    });
  });

  $("#tblListing tr").click(function() {
    var cb = $("input", this);
    if (cb.prop("checked")) {
      cb.prop("checked", "");
      cb.change();
    } else {
      cb.prop("checked", "checked");
      cb.change();
    }
    var gridId = $(this)
      .attr("id")
      .split(":");
    var markerIndex =
      $(this)
        .attr("rel")
        .split("_")[2] - 1;
    var geoGood = $(this).data("geocoded");
    var checked = cb.prop("checked");
    doCheckBox(gridId[0], gridId[1], checked);
    $.bkfsMap.removeHighLight();
    if (checked && geoGood && $.bkfsMap.divMap) {
      $.bkfsMap.highlightMapItem($.bkfsMap.allPins[markerIndex]);
    }
  });

  $("#tblListing tr input").click(function(event) {
    var gridId = $(this)
      .parent()
      .parent()
      .attr("id")
      .split(":");
    doCheckBox(gridId[0], gridId[1], $(this).prop("checked"));
    $(this).change();
    event.stopPropagation();
  });

  $("#tblListing .ve-tb-checkbox input").change(function(e) {
    var $targetRow = $(this)
      .parent()
      .parent();
    if ($(this).prop("checked") && !$targetRow.hasClass("ui-state-highlight"))
      $targetRow.addClass("ui-state-highlight");
    else if (
      !$(this).prop("checked") &&
      $targetRow.hasClass("ui-state-highlight")
    )
      $targetRow.removeClass("ui-state-highlight");
  });

  $("#tblListing tr[rel^=ve_tr_]")
    .mouseover(function() {
      var id = $(this).attr("id");
      showPopup(id);
    })
    .mouseout(function() {
      $.bkfsMap.hideInfobox();
    });

  var veStartIdx, veEndIdx;
  $("#tblListing tbody").sortable({
    axis: "y",
    cursor: "move",
    opacity: 0.65,
    tolerance: "pointer",
    handle: ".sort-drag",
    start: function(event, ui) {
      var listItem = document.getElementById(ui.item[0].id);
      if ($(listItem).attr("data-geocoded") == "false") {
        return;
      }
      veStartIdx = getTableVeIndex(ui.item[0].id);
    },
    update: function(event, ui) {
      var id = ui.item[0].id;
      var listItem = document.getElementById(id);
      veEndIdx = getTableVeIndex(ui.item[0].id);
      moveItem(listItem, veStartIdx, veEndIdx);
    }
  });

  $("#selPageSize").change(function() {
    var perPage = $(this).val();
    parent
      .$("#Reports a[viewid=" + vidVirtualEarth + "]")
      .attr("perpage", perPage);
    parent.dataController.CurrentPageSize = parseInt(perPage, 10);
    parent.dataController.UseCompactMapping = false;
    parent.dataController.loadView();
  });

  if (parent.dataController != null)
    $("#selPageSize").val(parent.dataController.CurrentPageSize);

  $(".DefaultLinkDetail").click(function(e) {
    e.preventDefault();
    $.bkfsMap.hideInfobox();
    var $span = $(this)
      .parent()
      .parent()
      .find(".ve-listing-distance");
    $.bkfsMap.centerMap(
      new google.maps.LatLng($span.attr("latitude"), $span.attr("longitude")),
      20
    );
    return false;
  });
});

function moveMapItem(arr, from, to) {
  arr.splice(to, 0, arr.splice(from, 1)[0]);
}

function moveItem(listItem, startIdx, endIdx) {
  //reset row odd/even classes and rel attribute
  var i = 0;
  var veIdx = 0;
  $("#tblListing tr").each(function(idx, val) {
    if ($(val).attr("data-geocoded") == "true") {
      veIdx++;
    }
    $(val).attr(
      "rel",
      "ve_tr_" + ($(val).attr("data-geocoded") == "true" ? veIdx : 0)
    );
    $(val).removeClass("ve-tr-odd ve-tr-even");
    if (i % 2 == 0) {
      $(val).addClass("ve-tr-even");
    } else {
      $(val).addClass("ve-tr-odd");
    }
    i++;
  });
  //Update datacontroller
  var aIDs = [];
  $("#tblListing tr").each(function(idx, val) {
    aIDs.push(val.id);
  });
  var newCurrentId = parent.dataController.getIdSplit(aIDs[0]);
  parent.dataController.CurrentID = newCurrentId[0];
  parent.dataController.CurrentUniqueID = newCurrentId[1];
  parent.dataController.addArrangedIDs(aIDs);
  parent.dataController.addIDs(
    aIDs,
    parent.dataController.CurrentPage,
    parent.dataController.CurrentPageSize
  );

  //Resort spreadsheet grid
  var gridFrame =
    parent.document.getElementById("ifSpreadsheet") != null
      ? parent.document.getElementById("ifSpreadsheet").contentWindow
      : null;
  if (gridFrame && gridFrame.$) {
    var grid = gridFrame.$("#grid");
    if (grid) {
      var rowIds = grid.getDataIDs();
      var currentPage = parent.dataController.CurrentPage;
      var viewId = parent.dataController.CurrentViewID;
      if (
        parent.dataController.ArrangedIDs[viewId] != null &&
        parent.dataController.ArrangedIDs[viewId][currentPage] != null
      ) {
        gridFrame.syncRows(grid, viewId, currentPage, rowIds);
        //sync our spreadsheet arranged ids
        var lastSSViewId = parseInt(
          parent.dataController.LastViewedSpreadsheetID,
          10
        );
        parent.dataController.ArrangedIDs[lastSSViewId] =
          parent.dataController.ArrangedIDs[viewId];
        gridFrame.$("td.jqgrid-rownum", grid.rows).each(function(i) {
          $(this).html(
            i + 1 + (currentPage - 1) * parent.dataController.CurrentPageSize
          );
        });
      }
    }
  }

  //if they moved a non geocoded row, should be able to just exit
  if ($(listItem).attr("data-geocoded") == "false") {
    return;
  }

  //exit if index didn't change
  if (startIdx == endIdx) {
    return;
  }

  //need to loop from start to end index, redrawing map, pin color, row background
  moveMapItem(virtualEarthData.rows, startIdx, endIdx);
  var counter = 0;
  $.each(virtualEarthData.rows, function(idx, val) {
    counter++;
    val.pinText = counter.toString();
  });

  $.bkfsMap.redrawPins(virtualEarthData.rows);

  //relabel pins on table list
  var labelIdx = 0;
  $("#tblListing tr").each(function(idx, val) {
    if ($(val).attr("data-geocoded") == "true") {
      labelIdx++;
      $(val)
        .find("div.ve-cellPushPin")
        .html(labelIdx);
    }
  });
}

function getTableVeIndex(id) {
  var retIdx = 0;
  var i = 0;
  var trGeocoded = $("#tblListing tr[data-geocoded='true']");
  $.each(trGeocoded, function(idx, val) {
    if (val.id == id) {
      retIdx = i;
    }
    i++;
  });
  return retIdx;
}

function SetupButtons() {
  //this should get the map skittle to work everywhere.
  if (parent.$("#Minimize").length > 0) {
    parent.$("#Minimize").click(function() {
      parent.$.fn.colorbox.close();
    });
    parent.$("#Close").click(function() {
      parent.$.fn.minbox.close("Map");
    });
  } else if (parent.$("#Close").lenght > 0) {
    parent.$("#Close").click(function() {
      parent.$.fn.colorbox.close();
    });
  }
}

function sizeMapDiv() {
  $("#jqMpCntlMap,#divMap").css({
    width: $(window).width() - leftOffset + "px",
    height: $(window).height()
  });
  return $("#divMap");
}

function resizePage() {
  if ($.bkfsMap != null) {
    sizeMapDiv();
  }
  var docHeight = $(window).height();
  $("#divListings").height(docHeight - 65 + "px");
}

function addLocations() {
  if (locations && $.bkfsMap != null) {
    if ($.bkfsMap.docHeight < 200) {
      setTimeout(addLocations, 400); //make sure window is completely loaded.
      return false;
    }
    $.bkfsMap.doBestFit(locations);
    $.bkfsMap.addPins(locations, "Results");
  }
  return true;
}

function addShapes() {
  if (shapes) $.bkfsMap.drawShapes(shapes);
}

function getId(items) {
  return items.id;
}

function hideLoading() {
  var loading = $("div#divLoading");
  if (loading.length > 0) loading.hide();
}

function selectListings() {
  if (parent.dataController != null) {
    var selectedIDs = parent.dataController.SelectedIDs;
    if (
      selectedIDs.length > 0 &&
      document.getElementById("tblListing") != null
    ) {
      var rowIDs = document.getElementById("tblListing").rows;
      for (var i = 0; i < rowIDs.length; i++) {
        for (var j = 0; j < selectedIDs.length; j++) {
          if (
            rowIDs[i].id ==
            selectedIDs[j].ID + ":" + selectedIDs[j].UniqueID
          ) {
            $(rowIDs[i]).click();
          }
        }
      }
    }
  }
}

function setDataControllerVars() {
  var tempCenter = $.bkfsMap.divMap.getCenter();
  var center = { latitude: tempCenter.lat(), longitude: tempCenter.lng() };
  if (parent.dataController != null) {
    parent.dataController.setVirtualEarth(
      center.latitude,
      center.longitude,
      $.bkfsMap.divMap.getZoom(),
      $.bkfsMap.getMapType()
    );
  }
  return center;
}

function calcDistances() {
  var center = setDataControllerVars();
  $("span.ve-listing-distance").each(function() {
    var $span = $(this);
    var currentPoint = {
      latitude: $span.attr("Latitude"),
      longitude: $span.attr("Longitude")
    };
    $span.html(
      " | Dist Center: " +
        Math.round(
          $.bkfsMap.getDistance(
            center,
            currentPoint,
            $.bkfsMap.topMenuOptions.distanceMeasurementAbbr == "km"
          ) * 100
        ) /
          100 +
        " " +
        $.bkfsMap.topMenuOptions.distanceMeasurementAbbr
    );
  });
}

function doCheckBox(listingId, uniqueId, checked) {
  parent.dataController.selectID(listingId, uniqueId, checked);
}

function showPopup(id) {
  if ($.bkfsMap) $.bkfsMap.showPushpin(id.replace(":", "_"));
}

function toggleBody(normal) {
  if ($.browser.msie) $("body").attr("scroll", normal ? "no" : "yes");
  $("body").css("overflow", normal ? "hidden" : "auto");
}

function displayDefaultView(listingId, popup) {
  var id = listingId.split("_")[0];
  parent.dataController.ShowAds = false;
  var url = parent.dataController.loadDefaultView(id, "", popup);
  if (popup) {
    $.fn.colorbox({
      href: url,
      open: true,
      iframe: true,
      width: 850,
      height: 500,
      title: "Detail",
      close: '<button id="Close">Cancel</button>',
      onClosed: false
    });
  }
}

function checkDataLayerResultsExist() {
  if (
    parent.parent.$("#app_tab_switcher a[tabdescription='Map Results']")
      .length > 0
  ) {
    window.listingResultsTab = parent.parent
      .$("#app_tab_switcher a[tabdescription='Map Results']")
      .attr("href")
      .replace("#", "");
    window.haveListingResultsTab = true;
  } else {
    window.listingResultsTab = "tab" + window.top.getMaxTab("tab");
    window.haveListingResultsTab = false;
  }
}

function openNewTab(items) {
  var mainFrame = frameElement.id;
  if (mainFrame == "HomeTab") return displayDefaultView(getId(items), false);
  else {
    checkDataLayerResultsExist();

    var query =
      "?searchId=" +
      window.listingResultsTab +
      "_1&viewId=" +
      window.defaultViewId;
    var data = JSON.stringify({ listings: getId(items) });
    var url = window.reportUrl; // window.displayDefaultView( items );
    var descript = "Map Results";
    var action = window.blankDataLayerAction;

    $.ajax({
      contentType: "application/json",
      type: "POST",
      dataType: "json",
      headers: {
        __RequestVerificationToken: $(
          'input[name="__RequestVerificationToken"]'
        ).val()
      },
      data: data,
      url: url + query,
      success: function(data) {
        if (data.status == "ERROR") {
          window.divMap.doAlert({ text: data.message });
        } else {
          if (data.result.length > 0) {
            if (!window.haveListingResultsTab) {
              window.top.loadItemMain(descript, "Loading Map Results", action);
              window.haveListingResultsTab = true;
            }
            if (window.haveListingResultsTab) {
              var tabCount;
              if (window.currentMainTab.length > 0)
                tabCount = parent
                  .$("#" + window.listingResultsTab)
                  .tabs("length");
              else
                tabCount = parent.parent
                  .$("#" + window.listingResultsTab)
                  .tabs("length");
              for (var i = tabCount; i >= 0; i--) {
                if (window.currentMainTab.length > 0)
                  parent.$("#" + window.listingResultsTab).tabs("remove", i);
                else
                  parent.parent
                    .$("#" + window.listingResultsTab)
                    .tabs("remove", i);
              }
              parent.parent
                .$("#app_tab_switcher")
                .tabs("select", "#" + window.listingResultsTab);
            }

            window.top.appendSubTabSingle(
              "Loading Results",
              window.listingResultsTab,
              data.result
            );
          } else {
            window.divMap.doAlert({
              text: "No listing records were found that matched your criteria."
            });
          }
        }
      },
      error: function(xhr) {
        this.ajaxRetryOnError(
          xhr,
          "An error occured while attempting to retreive listing records."
        );
      }
    });

    return "";
  }
}

function updateZoomLevel() {
  parent.dataController.CurrentVirtualEarth.ZoomLevel = $.bkfsMap.divMap.getZoom();
  parent.dataController.CurrentVirtualEarth.MapStyle = $.bkfsMap.getMapType();
}
