(function($) {
  if (!$.bkfsMap) $.bkfsMap = {};

  //-- Define radius function
  if (typeof Number.prototype.toRad === "undefined") {
    Number.prototype.toRad = function() {
      return (this * Math.PI) / 180;
    };
  }
  //-- Define degrees function
  if (typeof Number.prototype.toDeg === "undefined") {
    Number.prototype.toDeg = function() {
      return this * (180 / Math.PI);
    };
  }

  $.extend($.bkfsMap, {
    allPins: [],
    clusterPins: [],
    layerItemIds: [],
    layerCollectionIds: [],
    loadingLayerItemShape: false,
    shapeArray: [],
    measureArray: [],
    clickingCluster: false,
    currentMapBounds: null,
    editedPolygonOrigPaths: null,
    editedPolygonOrigPathsArray: null,
    draggingMeasure: false,
    distanceElements: [],
    polygonInfoBoxes: [],
    layerContextElements: [],
    retrieveListingPinsOnLoad: false,
    isDrawingShape: false,
    markerCluster: null,
    currentIdx: 0,
    drawingManager: null,
    shapeCallback: null,
    criteriaCallback: null,
    onDetailOpen: null,
    mapLocked: false,
    isReportView: false,
    showMapBoundaryMessage: false,
    mapBoundaryZoomToFit: false,
    mapBoundaryShapeId: -1,
    lockMapBoundary: "Lock the map to its current boundaries.",
    lockMapBoundaryActive: "The map boundries are locked.",
    disabledMapBoundary:
      "The map boundary feature is disabled because of included shape(s).",
    shapeCountForMenu: 0,
    layerLineColor: "#ada1ad",
    shapeLineColor: "#07b4d1",
    shapeFillColor: "#034d59",
    layerEditableFillColor: "#a521d1",
    highlightShapeLineColor: "#304000",
    highlightShapeFillColor: "#fff000",
    excludeShapeLineColor: "#ff0000",
    excludeShapeFillColor: "#900000",
    shapeMouseOverLineColor: "#00bfff",
    shapeMouseOverFillColor: "#00ffff",
    farmingLineColor: "#00ff00",
    farmingFillColor: "#7fff00",
    editableFillColor: "#fffc66",
    shapeVisible: true,
    maxNumberShapes: 4,
    createDrawingHiddenElements: false,
    initializeMapBoundary: false,
    showPins: true,
    clustererMaxZoom: 22,
    clusterPinListen: null,
    toolBoxActions: {
      spreadsheet: {
        toolTip: "Spreadsheet View",
        iconClass: "jqMpCntlActionIconSpreadsheet",
        action: function(items) {
          alert(
            "A Spreadsheet View should now open for " +
              (items.length
                ? items.length + " ids"
                : "current item with id " + items.id)
          );
        },
        allow: ["property", "datalayer"],
        used: true,
        index: 0
      },
      propHistory: {
        toolTip: "Property History Report",
        iconClass: "jqMpCntlActionIconHistory",
        action: function(items) {
          alert(
            "A Property History Report would now open for " + items.length + "."
          );
        },
        allow: ["property"], //'parcel'
        used: true,
        index: 1
      },
      detailReport: {
        toolTip: "Default Detail Report",
        iconClass: "jqMpCntlActionIconListing",
        action: function(items) {
          alert(
            "An alternate detailed report would now open for " +
              items.length +
              "."
          );
        },
        allow: ["property"], //'parcel'
        used: true,
        index: 2
      },
      taxReport: {
        toolTip: "Tax Report",
        iconClass: "jqMpCntlActionIconTax",
        action: function(items) {
          alert("A tax report would now open for " + items.length + ".");
        },
        allow: ["property"], //'parcel'
        used: true,
        index: 3
      },
      drivingDir: {
        toolTip: "Driving Directions",
        iconClass: "jqMpCntlActionIconDrive",
        action: function(items) {
          this.addItemToDrivingDirections(items);
        },
        allow: ["property"], //'parcel'
        used: true,
        index: 4
      }
    },
    detailBoxActions: {
      print: {
        toolTip: "Print Detail",
        iconClass: "jqMpCntlIconBarPrintLite",
        action: function() {
          $.bkfsMap.printDetail();
        },
        used: true
      }
    },
    drawInit: function(options) {
      options = $.extend(
        {},
        {
          showDrawingTools: true,
          showPinInfobox: false
        },
        options
      );
      if ($.bkfsMap.topMenuOptions.mapLayerCollectionId > 0) {
        $.bkfsMap.shapeLineColor = $.bkfsMap.layerLineColor;
      }
      $.bkfsMap.maxNumberShapes =
        options.maxNumberShapes || $.bkfsMap.maxNumberShapes;
      $.bkfsMap.retrieveListingPinsOnLoad =
        options.retrieveListingPinsOnLoad ||
        $.bkfsMap.retrieveListingPinsOnLoad;
      $.bkfsMap.isReportView = options.isReportView || $.bkfsMap.isReportView;
      $.bkfsMap.initializeMapBoundary =
        options.initializeMapBoundary || $.bkfsMap.initializeMapBoundary;
      $.bkfsMap.createDrawingHiddenElements =
        options.createDrawingHiddenElements ||
        $.bkfsMap.createDrawingHiddenElements;
      $.bkfsMap.shapeCallback = options.shapeCallback || function() {};
      $.bkfsMap.criteriaCallback = options.criteriaCallback || function() {};
      $.bkfsMap.onDetailOpen = options.onDetailOpen || function() {};
      if (options.showDrawingTools) {
        $.bkfsMap.topMenuOptions.$legacyCount = $("#jqMpCntlLegacyCountBox");

        $.bkfsMap.drawingManager = new google.maps.drawing.DrawingManager({
          drawingControl: false,
          drawingControlOptions: {
            drawingModes: ["circle", "polygon", "rectangle"]
          },
          circleOptions: {
            fillColor: $.bkfsMap.shapeFillColor,
            strokeColor: $.bkfsMap.shapeLineColor
          },
          polygonOptions: {
            fillColor:
              $.bkfsMap.topMenuOptions.mapLayerCollectionId > 0
                ? $.bkfsMap.layerEditableFillColor
                : $.bkfsMap.shapeFillColor,
            strokeColor: $.bkfsMap.shapeLineColor
          },
          rectangleOptions: {
            fillColor: $.bkfsMap.shapeFillColor,
            strokeColor: $.bkfsMap.shapeLineColor
          }
        });
        google.maps.event.addListenerOnce(
          $.bkfsMap.divMap,
          "tilesloaded",
          function() {
            //Set layerCollectionIds to empty since they are just used on initial load of the map to draw layerItems
            $.bkfsMap.layerCollectionIds = [];

            if ($.bkfsMap.retrieveListingPinsOnLoad) {
              if ($.bkfsMap.initializeMapBoundary) {
                $.bkfsMap.showMapBoundaryMessage = true;
                $.bkfsMap.toggleMapLock();
              }
              $.bkfsMap.shapeCallback(true);
            }
          }
        );
        google.maps.event.addListener(
          $.bkfsMap.drawingManager,
          "circlecomplete",
          function(circle) {
            $.bkfsMap.isDrawingShape = false;
            $.bkfsMap.currentShapeId = $.bkfsMap.getNextShapeId();
            $.bkfsMap.addCircleListeners(circle);
            $.bkfsMap.drawingManager.setDrawingMode(null);
            circle.shapeId = $.bkfsMap.currentShapeId;
            $.bkfsMap.shapeArray[$.bkfsMap.currentShapeId] = circle;
            $.bkfsMap.addCircle(
              circle.getRadius(),
              circle.getCenter(),
              $.bkfsMap.currentShapeId
            );
          }
        );
        google.maps.event.addListener(
          $.bkfsMap.drawingManager,
          "rectanglecomplete",
          function(rectangle) {
            $.bkfsMap.isDrawingShape = false;
            $.bkfsMap.currentShapeId = $.bkfsMap.getNextShapeId();
            $.bkfsMap.addRectangleListeners(rectangle);
            $.bkfsMap.drawingManager.setDrawingMode(null);
            rectangle.shapeId = $.bkfsMap.currentShapeId;
            rectangle.shapeTypeId = 2;
            $.bkfsMap.shapeArray[$.bkfsMap.currentShapeId] = rectangle;
            $.bkfsMap.addRectangle(
              rectangle.getBounds(),
              $.bkfsMap.currentShapeId,
              rectangle.shapeTypeId
            );
          }
        );
        google.maps.event.addListener(
          $.bkfsMap.drawingManager,
          "polygoncomplete",
          function(polygon) {
            $.bkfsMap.isDrawingShape = false;
            $.bkfsMap.currentShapeId = $.bkfsMap.getNextShapeId();
            $.bkfsMap.addPolygonListeners(polygon);
            $.bkfsMap.drawingManager.setDrawingMode(null);
            polygon.shapeId = $.bkfsMap.currentShapeId;
            $.bkfsMap.shapeArray[$.bkfsMap.currentShapeId] = polygon;
            $.bkfsMap.addPolygon(polygon.getPaths(), $.bkfsMap.currentShapeId);
            if ($.bkfsMap.topMenuOptions.mapLayerCollectionId > 0) {
              $(".jqMpCntlDrawPolygonLabel").text("Draw Polygon");
              google.maps.event.trigger(polygon, "click");
            }
          }
        );
        $.bkfsMap.drawingManager.setMap($.bkfsMap.divMap);

        $.bkfsMap.addShapes(options.shapes);
      }

      if ($.bkfsMap.showToolboxInfobox && jqMapTemplate_ToolboxInfobox) {
        $.bkfsMap.toolboxInfoBox = jqMapTemplate_ToolboxInfobox;
        $.bkfsMap.toolboxInfoBox.appendTo($("body")).hide();

        // $("#mlsNumLabelText").text(window.top.$.focusFx.mlsNumText || "MLS #");
        $("#mlsNumLabelText").text("MLS #");
        $("#jqMpCntlToolboxInfobox div.actionbar>div.actions").click(
          $.bkfsMap.openToolboxActions
        );
        $.bkfsMap.detailBox = $(
          '<div id="jqMpCntlDetailBox"  class="jqMpCntlToggleOpen" ></div>'
        );
        $('<div class="jqMpCntlDetailBoxIconBar" ></div>')
          .appendTo($.bkfsMap.detailBox)
          .append(
            $('<div class="jqMpCntlDetailTitle" ></div>').append(
              jqMapTemplate_DetailActions
            )
          )
          .append(
            $('<div class="jqMpCntlDetailBoxClose" ></div>').click(function() {
              $.bkfsMap.hideDetailBox();
            })
          );
        $.bkfsMap.detailBox
          .append(
            '<div class="jqMpCntlDetailBoxContent" ><iframe id="jqMpCntDetailFrame" name="jqMpCntDetailFrame" src="about:blank" frameborder="0" ></iframe></div>'
          )
          .appendTo($("body"));
        $.each($.bkfsMap.detailBoxActions, function(key, obj) {
          if (obj.used) {
            $(
              '<li> <div class="' +
                obj.iconClass +
                ' jqMpCntlUseToolTip" data-tooltip="' +
                obj.toolTip +
                'toolTip" /></li>'
            )
              .appendTo("div.jqMpCntlDetailBoxIconBar ul.jqMpCntlUnorderedList")
              .click(function() {
                obj.action();
              });
          }
        });

        $("#jqMpCntlToolboxInfobox div.close").click(function() {
          $("#jqMpCntlToolboxInfobox").hide();
          $.bkfsMap.closeToolboxActions();
        });

        $("div.jqMpCntlInfoboxPager .jqMpCntlPagerPrev").click(function() {
          if ($.bkfsMap.currentIdx > 0) {
            $.bkfsMap.currentIdx = $.bkfsMap.currentIdx - 1;
            var marker =
              $.bkfsMap.clusterPins != null
                ? $.bkfsMap.clusterPins[$.bkfsMap.currentIdx]
                : $.bkfsMap.allPins[$.bkfsMap.currentIdx];
            $.bkfsMap.markerClick(marker);
          }
        });
        $("div.jqMpCntlInfoboxPager .jqMpCntlPagerNext").click(function() {
          if ($.bkfsMap.clusterPins != null) {
            if ($.bkfsMap.currentIdx < $.bkfsMap.clusterPins.length - 1) {
              $.bkfsMap.currentIdx = $.bkfsMap.currentIdx + 1;
              $.bkfsMap.markerClick(
                $.bkfsMap.clusterPins[$.bkfsMap.currentIdx]
              );
            }
          } else {
            if ($.bkfsMap.currentIdx < $.bkfsMap.allPins.length - 1) {
              $.bkfsMap.currentIdx = $.bkfsMap.currentIdx + 1;
              $.bkfsMap.markerClick($.bkfsMap.allPins[$.bkfsMap.currentIdx]);
            }
          }
        });
      }
      if (
        $.bkfsMap.showToolboxInfobox ||
        ($.bkfsMap.toolBoxTabs &&
          ($.bkfsMap.toolBoxTabs.propertyTab.used ||
            $.bkfsMap.toolBoxTabs.parcelTab.used)) ||
        $.bkfsMap.dataLayerHtml
      ) {
        $.bkfsMap.toolBoxActionBar = $(
          '<div class="jqMpCntlToolboxActionMenu" ></div>'
        )
          .css({ left: "300px" })
          .appendTo($("body"))
          .append(jqMapTemplate_ToolboxActions)
          .hide();
        $.each($.bkfsMap.toolBoxActions, function(key, obj) {
          if (obj.used) {
            $(
              '<li> <div class="' +
                obj.iconClass +
                ' jqMpCntlUseToolTip" data-tooltip="' +
                obj.toolTip +
                'toolTip" /></li>'
            )
              .appendTo(
                $("ul.jqMpCntlUnorderedList", $.bkfsMap.toolBoxActionBar)
              )
              .click(function() {
                var pinInfo =
                  $.bkfsMap.clusterPins !== null
                    ? $.bkfsMap.clusterPins[$.bkfsMap.currentIdx].pinInfo
                    : $.bkfsMap.allPins[$.bkfsMap.currentIdx].pinInfo;
                obj.action(pinInfo);
              });
          }
        });
      }
    },
    getFillColor: function(exclude, farming) {
      if (exclude) return $.bkfsMap.excludeShapeFillColor;
      if (farming) return $.bkfsMap.farmingFillColor;
      return $.bkfsMap.shapeFillColor;
    },
    getLineColor: function(exclude, farming) {
      if (exclude) return $.bkfsMap.excludeShapeLineColor;
      if (farming) return $.bkfsMap.farmingLineColor;
      return $.bkfsMap.shapeLineColor;
    },
    addShapes: function(shapes) {
      if (shapes && shapes.length > 0) {
        var hasNonMeasureShape = false;
        $.each(shapes, function(idx, val) {
          var tempShape = null;
          switch (val.shapeType) {
            case 1:
              var convert =
                $.bkfsMap.topMenuOptions.distanceMeasurementAbbr == "km"
                  ? 1
                  : 0.6214;
              var radiusKm = val.radius / convert;
              tempShape = new google.maps.Circle({
                map: $.bkfsMap.divMap,
                center: {
                  lat: val.points[0].latitude,
                  lng: val.points[0].longitude
                },
                radius: radiusKm * 1000,
                fillColor: $.bkfsMap.getFillColor(val.exclude, val.farming),
                strokeColor: $.bkfsMap.getLineColor(val.exclude, val.farming)
              });
              $.bkfsMap.currentShapeId = tempShape.shapeId = $.bkfsMap.getNextShapeId();
              $.bkfsMap.addCircleListeners(tempShape);
              hasNonMeasureShape = true;
              break;
            case 2:
              tempShape = new google.maps.Rectangle({
                map: $.bkfsMap.divMap,
                shapeTypeId: 2,
                bounds: $.bkfsMap.getBoundsFromPoints(val.points),
                fillColor: $.bkfsMap.getFillColor(val.exclude, val.farming),
                strokeColor: $.bkfsMap.getLineColor(val.exclude, val.farming)
              });
              $.bkfsMap.currentShapeId = tempShape.shapeId = $.bkfsMap.getNextShapeId();
              $.bkfsMap.addRectangleListeners(tempShape);
              hasNonMeasureShape = true;
              break;
            case 4:
              var paths = [];
              $.each(val.points, function() {
                paths.push({
                  lat: this.latitude,
                  lng: this.longitude
                });
              });
              tempShape = new google.maps.Polygon({
                map: $.bkfsMap.divMap,
                shapeTypeId: 4,
                paths: paths,
                fillColor: $.bkfsMap.getFillColor(val.exclude, val.farming),
                strokeColor: $.bkfsMap.getLineColor(val.exclude, val.farming)
              });

              $.bkfsMap.currentShapeId = tempShape.shapeId = $.bkfsMap.getNextShapeId();
              if ($.bkfsMap.topMenuOptions.mapLayerCollectionId > 0) {
                tempShape.autocompletedata = val.autocompletedata;
                tempShape.fillColor =
                  typeof val.fillcolor === "undefined" || val.fillcolor == ""
                    ? tempShape.fillColor
                    : val.fillcolor;
                tempShape.description =
                  typeof val.description === "undefined" ||
                  val.description === ""
                    ? ""
                    : val.description;
                tempShape.layerItemId = val.layeritemid;
                $.bkfsMap.addPolygonInfoBox(
                  tempShape,
                  $.bkfsMap.topMenuOptions.mapLayerCollectionId,
                  true
                );
              }

              $.bkfsMap.addPolygonListeners(tempShape);
              hasNonMeasureShape = true;
              break;
            case 5:
              if ($.bkfsMap.isReportView) {
                // Define a symbol using SVG path notation, with an opacity of 1.
                var lineSymbol = {
                  path: "M 0,-1 0,1",
                  strokeOpacity: 1,
                  strokeColor: "#99CC00",
                  scale: 4
                };

                // Create the polyline, passing the symbol in the 'icons' property.
                var line = new google.maps.Polyline({
                  path: [
                    {
                      lat: val.points[0].latitude,
                      lng: val.points[0].longitude
                    },
                    {
                      lat: val.points[1].latitude,
                      lng: val.points[1].longitude
                    }
                  ],
                  strokeOpacity: 0,
                  icons: [
                    {
                      icon: lineSymbol,
                      offset: "0",
                      repeat: "15px"
                    }
                  ],
                  map: $.bkfsMap.divMap
                });
                // Create the polyline, passing the symbol in the 'icons' property.
                line = new google.maps.Polyline({
                  path: [
                    {
                      lat: val.points[2].latitude,
                      lng: val.points[2].longitude
                    },
                    {
                      lat: val.points[3].latitude,
                      lng: val.points[3].longitude
                    }
                  ],
                  strokeOpacity: 0,
                  icons: [
                    {
                      icon: lineSymbol,
                      offset: "0",
                      repeat: "15px"
                    }
                  ],
                  map: $.bkfsMap.divMap
                });

                // Create the polyline, passing the symbol in the 'icons' property.
                line = new google.maps.Polyline({
                  path: [
                    {
                      lat: val.points[1].latitude,
                      lng: val.points[1].longitude
                    },
                    {
                      lat: val.points[2].latitude,
                      lng: val.points[2].longitude
                    }
                  ],
                  strokeOpacity: 0,
                  icons: [
                    {
                      icon: lineSymbol,
                      offset: "0",
                      repeat: "15px"
                    }
                  ],
                  map: $.bkfsMap.divMap
                });

                // Create the polyline, passing the symbol in the 'icons' property.
                line = new google.maps.Polyline({
                  path: [
                    {
                      lat: val.points[3].latitude,
                      lng: val.points[3].longitude
                    },
                    {
                      lat: val.points[4].latitude,
                      lng: val.points[4].longitude
                    }
                  ],
                  strokeOpacity: 0,
                  icons: [
                    {
                      icon: lineSymbol,
                      offset: "0",
                      repeat: "15px"
                    }
                  ],
                  map: $.bkfsMap.divMap
                });
              } else {
                $.bkfsMap.initializeMapBoundary = true;
                var bounds = new google.maps.LatLngBounds();
                $.each(val.points, function(idx, val) {
                  bounds.extend(
                    new google.maps.LatLng(val.latitude, val.longitude)
                  );
                });
                $.bkfsMap.toggleMapLock(true, bounds);
              }
              break;
            case 6:
              var latLng = new google.maps.LatLng(
                val.points[0].latitude,
                val.points[0].longitude
              );
              var latLng2 = new google.maps.LatLng(
                val.points[1].latitude,
                val.points[1].longitude
              );
              $.bkfsMap.measureClickEvent(latLng, latLng2);
              break;
            case 7:
              if ($.bkfsMap.isReportView) {
                var paths = [];
                $.each(val.points, function() {
                  paths.push({
                    lat: this.latitude,
                    lng: this.longitude
                  });
                });
                tempShape = new google.maps.Polygon({
                  map: $.bkfsMap.divMap,
                  shapeTypeId: 4,
                  paths: paths,
                  fillColor: (fillColor =
                    typeof val.fillcolor === "undefined" || val.fillcolor == ""
                      ? $.bkfsMap.getFillColor(val.exclude, val.farming)
                      : val.fillcolor),
                  strokeColor: $.bkfsMap.getLineColor(val.exclude, val.farming)
                });

                $.bkfsMap.currentShapeId = tempShape.shapeId = $.bkfsMap.getNextShapeId();
              } else {
                $.bkfsMap.layerItemIds.push(val.layeritemid);
                if (
                  $.inArray(val.collectionid, $.bkfsMap.layerCollectionIds) ===
                  -1
                ) {
                  $.bkfsMap.layerCollectionIds.push(val.collectionid);
                }
                $.bkfsMap.addLayerShape(
                  val.layeritemid,
                  val.description,
                  val.collectionid,
                  true
                );
                hasNonMeasureShape = true;
              }
              break;
          }
          if (tempShape != null) {
            tempShape.exclude = val.exclude;
            $.bkfsMap.currentShapeId = val.id = tempShape.shapeId = $.bkfsMap.getNextShapeId();
            if (val.shapeType == 5) {
              $.bkfsMap.mapBoundaryShapeId = tempShape.shapeId;
            }
            $.bkfsMap.shapeArray[tempShape.shapeId] = tempShape;
            $.bkfsMap.buildShapeElement(val);
          }
        });
        if ($.bkfsMap.layerCollectionIds.length > 0) {
          $.each($.bkfsMap.layerCollectionIds, function(key, val) {
            var layerOption = $("div.jqMpCntlLayerItem[collid=" + val + "]");
            var checkBox = layerOption.find("div.jqMpCntlLayerCheckBox");
            checkBox.click();
          });
        }

        if (hasNonMeasureShape && !$.bkfsMap.initializeMapBoundary) {
          $.bkfsMap.shapeCallback();
        }
      }
    },
    getBoundsFromPoints: function(points) {
      var bounds = {};
      if (points.length > 0) {
        bounds.north = bounds.south = points[0].latitude;
        bounds.east = bounds.west = points[0].longitude;
        for (var idx = 1; idx < points.length; idx++) {
          bounds.north = Math.max(points[idx].latitude, bounds.north);
          bounds.south = Math.min(points[idx].latitude, bounds.south);
          bounds.west = Math.min(points[idx].longitude, bounds.west);
          bounds.east = Math.max(points[idx].longitude, bounds.east);
        }
      }
      return bounds;
    },
    getNextMeasureShapeId: function() {
      var shapeId = 0;
      if ($.bkfsMap.distanceElements.length > 0) {
        shapeId = $.bkfsMap.distanceElements.length / 4;
      }
      return shapeId;
    },
    getNextShapeId: function() {
      var shapeId = 0;
      for (; shapeId <= $.bkfsMap.shapeArray.length; shapeId++) {
        if (!$.bkfsMap.shapeArray[shapeId]) break;
      }
      return shapeId;
    },
    hasShapeIncluded: function() {
      var isShapeIncluded = false;
      for (var i = 0; i < $.bkfsMap.shapeArray.length; i++) {
        if (
          $.bkfsMap.shapeArray[i] &&
          $.bkfsMap.shapeArray[i].shapeTypeId != 5
        ) {
          isShapeIncluded = !$.bkfsMap.shapeArray[i].exclude;
          if (isShapeIncluded) {
            break;
          }
        }
      }
      return isShapeIncluded;
    },
    getPinData: function(id) {
      $.ajax({
        type: "Post",
        dataType: "json",
        headers: {
          __RequestVerificationToken: $(
            'input[name="__RequestVerificationToken"]'
          ).val()
        },
        data: { id: id },
        url: getPinDataURL,
        success: function(data) {
          if (data.status == "OK") {
            $("#jqMpCntlToolboxInfobox>div.infoBoxTitle").html(
              data.result.InfoBoxTitle + "<br/>" + data.result.CityStateZip
            );
            $("#listingPhoto").attr("src", data.result.InfoImage);
            $("#propertyInfo div.infoboxStatus")
              .removeClass(
                "jqMpCntlPushpinPopupTitle1 jqMpCntlPushpinPopupTitle2 jqMpCntlPushpinPopupTitle3 jqMpCntlPushpinPopupTitle4 jqMpCntlPushpinPopupTitle5 jqMpCntlPushpinPopupTitle6"
              )
              .addClass(
                "infoboxStatus jqMpCntlStatusDiv " +
                  data.result.InfoBoxTitleClass
              )
              .text(data.result.Status);
            $("#propertyInfo a.jqMpCntlInfoxboxLabel>span")
              .text(data.result.Street)
              .unbind("click")
              .click({ markerClicked: this }, function(e) {
                $.bkfsMap.divMap.setCenter(e.data.markerClicked.getPosition());
              });
            $("#formattedPrice").text(data.result.Price);
            $("#propertyInfo  a.jqMpCntlDetailLink")
              .unbind("click")
              .click({ data: data }, function(e) {
                $.bkfsMap.openDetailBox(data.result.Id, e.data.displayId);
              });
            $("#propertyInfo  a.jqMpCntlDetailLink span").text(
              data.result.DisplayId
            );
            $("#infoBoxData div.extraField").remove();
            $("div.integrationLink").remove();
            for (var idx = 0; idx < data.result.InfoBoxData.length; idx++) {
              $(
                '<div class="extraField"><span class="jqMpCntlInfoxboxLabel">' +
                  data.result.InfoBoxLabels[idx] +
                  "</span><span>" +
                  data.result.InfoBoxData[idx] +
                  "</span></div>"
              ).appendTo($("#infoBoxData"));
            }

            //integrations
            var hasIntegrations = data.result.IntegrationLinks.length > 0;
            if (hasIntegrations) {
              $('<div id="divIntegrations"></div>').insertAfter(
                $("#infoBoxData")
              );
            }
            for (
              var idx = 0;
              idx < data.result.IntegrationLinks.length;
              idx++
            ) {
              $("#divIntegrations").append(
                $(
                  '<div class="integrationLink"><span><a href="' +
                    data.result.IntegrationLinks[idx].Url +
                    '" target="_blank"><img src="' +
                    data.result.IntegrationLinks[idx].IconUrl +
                    '"></img></a></span><span class="spanText"><a href="' +
                    data.result.IntegrationLinks[idx].Url +
                    '" target="_blank">' +
                    data.result.IntegrationLinks[idx].Label +
                    "</a></span></div>"
                )
              );
              //.insertAfter($('#infoBoxData'));
            }

            //avm
            if (typeof showAvm != "undefined" && showAvm) {
              var insertAfterEl = hasIntegrations
                ? "#divIntegrations"
                : "#infoBoxData";
              if ($("#divAvm").length == 0) {
                $(
                  '<div id="divAvm"><div><span class="parcelHeader" style="width:100%; height:20px;">Automated Valuations</span></div>' +
                    '<div id="divAvmContent"></div></div>'
                ).insertAfter($(insertAfterEl));
              }

              $("#divAvmContent").html("Loading, please wait...");
              var address =
                data.result.Street + ", " + data.result.CityStateZip;
              $.bkfsMap.getAvmData(address, function(result) {
                if (result != null) {
                  var html = $.bkfsMap.buildAvmHtml(result);
                  $("#divAvmContent").html(html);
                }
              });
            }

            $("#jqMpCntlToolboxInfobox").show();
          } else {
            $.jGrowl(data.result, { header: "ALERT", group: "jgrowl-alert" });
            return false;
          }
        }
      });
    },
    getAvmData: function(address, callback) {
      $.ajax({
        type: "Post",
        dataType: "json",
        headers: window.top._infernoData.getHeaderObj(),
        url: getAvmDataURL + encodeURIComponent(address),
        success: function(data) {
          if (data.isSuccess) {
            callback(data);
          } else {
            $("#divPAvmContent").html(
              "<span class='avmError'>An error occurred retrieving valuations for this property. The address may be invalid.</span>"
            );
            callback(null);
          }
        },
        error: function(xhr, ajaxOptions, thrownError) {
          $("#divPAvmContent").html(
            "<span class='avmError'>An error occurred retrieving valuations for this property. The address may be invalid.</span>"
          );
          console.error(
            "Error retrieving Automated Valuations: " +
              xhr.status +
              "; " +
              thrownError
          );
          callback(null);
        }
      });
    },
    buildAvmHtml: function(avmData) {
      avms = $.bkfsAvm.getAvmArrayWs(
        avmData,
        showAvmBkfs,
        showAvmZillow,
        showAvmRpr,
        avmImagePath
      );
      var context = {
        items: avms
      };
      return avmTemplate(context);
    },
    drawRadius: function(radius) {
      if ($.isNumeric(radius) && $.bkfsMap.shapeMaxCheck()) {
        var location = $.bkfsMap.divMap.getCenter();
        var convert =
          $.bkfsMap.topMenuOptions.distanceMeasurementAbbr == "km" ? 1 : 0.6214;
        var radiusKm = radius / convert;
        $.bkfsMap.currentShapeId = $.bkfsMap.getNextShapeId();
        var circle = new google.maps.Circle({
          map: $.bkfsMap.divMap,
          center: {
            lat: location.lat(),
            lng: location.lng()
          },
          radius: radiusKm * 1000,
          fillColor: $.bkfsMap.shapeFillColor,
          strokeColor: $.bkfsMap.shapeLineColor
        });
        circle.shapeId = $.bkfsMap.currentShapeId;
        $.bkfsMap.addCircleListeners(circle);
        $.bkfsMap.shapeArray[$.bkfsMap.currentShapeId] = circle;
        $.bkfsMap.addCircle(
          radiusKm * 1000,
          location,
          $.bkfsMap.currentShapeId
        );
      }
    },
    addCircle: function(radius, latLng, shapeId) {
      var convert =
        $.bkfsMap.topMenuOptions.distanceMeasurementAbbr == "km" ? 1 : 0.6214;
      var rad = ((radius / 1000) * convert).toFixed(2);
      var curShape = $.bkfsMap.shapeArray[shapeId] || {};
      var circleJson = {
        id: shapeId,
        use: "search",
        selected: "true",
        shapeType: 1,
        radius: rad,
        points: [
          {
            latitude: latLng.lat(),
            longitude: latLng.lng()
          }
        ],
        exclude: curShape.exclude
      };
      $.bkfsMap.buildShapeElement(circleJson);
      $.bkfsMap.shapeCallback();
    },
    addCircleListeners: function(circle) {
      circle.addListener("center_changed", function() {
        $.bkfsMap.addCircle(this.getRadius(), this.getCenter(), this.shapeId);
      });
      circle.addListener("radius_changed", function() {
        $.bkfsMap.addCircle(this.getRadius(), this.getCenter(), this.shapeId);
      });
      circle.addListener("click", function(e) {
        google.maps.event.trigger($.bkfsMap.divMap, "click", e);
      });
    },
    addRectangle: function(bounds, shapeId, shapeType) {
      var ne = bounds.getNorthEast();
      var sw = bounds.getSouthWest();
      var curShape = $.bkfsMap.shapeArray[shapeId] || {};
      var rectangleJson = {
        id: shapeId,
        use: "search",
        selected: "true",
        shapeType: shapeType,
        points: [
          {
            latitude: ne.lat(),
            longitude: sw.lng()
          },
          {
            latitude: ne.lat(),
            longitude: ne.lng()
          },
          {
            latitude: sw.lat(),
            longitude: ne.lng()
          },
          {
            latitude: sw.lat(),
            longitude: sw.lng()
          }
        ],
        exclude: curShape.exclude
      };
      $.bkfsMap.buildShapeElement(rectangleJson);
      if (!$.bkfsMap.retrieveListingPinsOnLoad) {
        $.bkfsMap.shapeCallback();
      } else {
        $.bkfsMap.retrieveListingPinsOnLoad = false;
      }
    },
    addRectangleListeners: function(rectangle) {
      rectangle.addListener("bounds_changed", function() {
        $.bkfsMap.addRectangle(
          this.getBounds(),
          this.shapeId,
          this.shapeTypeId
        );
      });
      rectangle.addListener("click", function(e) {
        google.maps.event.trigger($.bkfsMap.divMap, "click", e);
      });
    },
    addLayerShape: function(
      layerItemId,
      description,
      collectionId,
      preventEvent
    ) {
      $.bkfsMap.currentShapeId = $.bkfsMap.getNextShapeId();
      var layerJson = {
        id: $.bkfsMap.currentShapeId,
        use: "search",
        selected: "true",
        shapeType: 7,
        layeritemid: layerItemId,
        description: description,
        collectionid: collectionId,
        color: "",
        majorId: "",
        minorId: "",
        lookup: "",
        points: []
      };
      var feature = $.bkfsMap.divMap.data.getFeatureById(layerItemId);
      if (feature != null) {
        $.bkfsMap.addFeatureMarker(
          feature,
          layerItemId,
          $.bkfsMap.currentShapeId
        );
      }
      $.bkfsMap.shapeArray[$.bkfsMap.currentShapeId] = layerJson;

      $.bkfsMap.buildShapeElement(layerJson);
      $("#layerItems" + collectionId).append(
        '<div id="layerItemRow_' +
          layerItemId +
          '"  style="margin-left: 60px;padding-bottom: 4px;"><div class="layerItemDesc" id="layerItemId' +
          layerItemId +
          '" collid="' +
          collectionId +
          '" layeritemid="' +
          layerItemId +
          '"><input type="checkbox" checked onClick="javascript: unselectLayerItemShape(this);" />' +
          description +
          "</div></div>"
      );
      if (!preventEvent) {
        $.bkfsMap.shapeCallback();
      }
    },
    addFeatureMarker: function(feature, layerItemId, currentShapeId) {
      var paths = [];

      //iterate over the paths
      if ($.isArray(feature.getGeometry().getArray())) {
        var path = feature.getGeometry().getArray()[0];

        //iterate over the points in the path to add paths
        path.getArray().forEach(function(latLng) {
          paths.push({
            lat: latLng.lat(),
            lng: latLng.lng()
          });
        });
        var polygon = new google.maps.Polygon({
          paths: paths,
          layerItemId: layerItemId
        });
        var center = $.bkfsMap.getPolygonCenter(polygon);
        var pointContext = new google.maps.Marker({
          position: center,
          map: $.bkfsMap.divMap,
          id: "pointContext_" + currentShapeId,
          zIndex: 999999999,
          icon: $.bkfsMap.iconBasePath + "jqMpCntMenu.png",
          draggable: false
        });
        $.bkfsMap.layerContextElements.push(pointContext);
        var contentString =
          '<div id="content"><a href="javascript:; " onclick="clearLayerItem(' +
          layerItemId +
          ');">Unselect Layer Item</a></div>';

        var infoWindow = new google.maps.InfoWindow({
          id: "infoWindow_" + currentShapeId,
          content: contentString,
          disableAutoPan: true
        });
        $.bkfsMap.layerContextElements.push(infoWindow);

        google.maps.event.addListener(pointContext, "click", function() {
          var shapeIndex = this.id.substring(this.id.indexOf("_") + 1);
          var infoWindow = $.bkfsMap.getInfoWindowFromArray(
            "infoWindow_" + shapeIndex
          );
          if (infoWindow != null) {
            infoWindow.open($.bkfsMap.divMap, pointContext);
          }
        });
      }
    },
    addPolygon: function(paths, shapeId, points) {
      var curShape = $.bkfsMap.shapeArray[shapeId] || {};
      var polygonJson = {
        id: shapeId,
        use: "search",
        selected: "true",
        shapeType: 4,
        points: [],
        exclude: curShape.exclude
      };
      if ($.bkfsMap.topMenuOptions.mapLayerCollectionId > 0) {
        if ($("#hdnShape" + shapeId).length > 0) {
          var hdnShape = JSON.parse($("#hdnShape" + shapeId).val());
          polygonJson.fillcolor = hdnShape.fillcolor;
          polygonJson.description = hdnShape.description;
          polygonJson.autocompletedata = hdnShape.autocompletedata;
          polygonJson.layeritemid = hdnShape.layeritemid;
        }
      }

      if (points != null) {
        polygonJson.points = points;
      } else {
        var pathArray = paths.getArray();
        for (var i = 0; i < pathArray.length; i++) {
          var pathSubArray = pathArray[i].getArray();
          for (var j = 0; j < pathSubArray.length; j++) {
            polygonJson.points.push({
              latitude: pathSubArray[j].lat(),
              longitude: pathSubArray[j].lng()
            });
          }
          polygonJson.points.push({
            latitude: pathSubArray[0].lat(),
            longitude: pathSubArray[0].lng()
          });
        }
      }

      $.bkfsMap.buildShapeElement(polygonJson);
      $.bkfsMap.shapeCallback();
    },
    getPolygonCenter: function(polygon) {
      var pts = [];
      polygon.getPath().forEach(function(element, index) {
        pts.push({
          x: element.lng(),
          y: element.lat()
        });
      });
      var first = pts[0],
        last = pts[pts.length - 1];
      if (first.x != last.x || first.y != last.y) pts.push(first);
      var twicearea = 0,
        x = 0,
        y = 0,
        nPts = pts.length,
        p1,
        p2,
        f;
      for (var i = 0, j = nPts - 1; i < nPts; j = i++) {
        p1 = pts[i];
        p2 = pts[j];
        f =
          (p1.y - first.y) * (p2.x - first.x) -
          (p2.y - first.y) * (p1.x - first.x);
        twicearea += f;
        x += (p1.x + p2.x - 2 * first.x) * f;
        y += (p1.y + p2.y - 2 * first.y) * f;
      }
      f = twicearea * 3;

      var centroid = { x: x / f + first.x, y: y / f + first.y };
      return new google.maps.LatLng(centroid.y, centroid.x);
    },
    addPolygonInfoBox: function(polygon, collectionId, show) {
      var center = $.bkfsMap.getPolygonCenter(polygon);
      var id = "divInfoBox" + collectionId + "_" + polygon.shapeId;
      var labelText = polygon.description;
      var labelDiv = document.createElement("div");
      labelDiv.style.display = show ? "block" : "none";
      labelDiv.innerHTML = labelText;
      labelDiv.className = "InfoBox";
      labelDiv.setAttribute("id", id);
      labelDiv.setAttribute("shapeId", polygon.shapeId);
      labelDiv.setAttribute("class", "jqMpCntlInfoBoxLabel");

      var myOptions = {
        content: labelDiv,
        disableAutoPan: false,
        closeBoxURL: "",
        position: center,
        shapeId: polygon.shapeId,
        isHidden: false,
        pane: "mapPane",
        enableEventPropagation: true
      };

      var ibLabel = new InfoBox(myOptions);
      if (
        $.bkfsMap.polygonInfoBoxes.length > polygon.shapeId &&
        ($.bkfsMap.polygonInfoBoxes[polygon.shapeId] == null ||
          $.bkfsMap.polygonInfoBoxes[polygon.shapeId].content_.id == id)
      ) {
        $.bkfsMap.polygonInfoBoxes[polygon.shapeId] = ibLabel;
      } else {
        $.bkfsMap.polygonInfoBoxes.push(ibLabel);
      }

      ibLabel.open($.bkfsMap.divMap);
    },
    showEditShapeProperties: function(polygon, showToolBoxSection) {
      $.bkfsMap.editShape(polygon.shapeId, false);
      if ($("#AutoComplete").length > 0) {
        var acfb = $("#AutoComplete")
          .parent()
          .parent()[0].acfb;
        acfb.mergeResults([]);
        if (
          polygon.autocompletedata != null &&
          typeof polygon.autocompletedata != "undefined" &&
          polygon.autocompletedata != ""
        ) {
          acfb.mergeResults(JSON.parse(polygon.autocompletedata));
        }
      }
      $("#hdnShapeId").val(polygon.shapeId);
      $("#hdnFillColor").val(polygon.fillColor);
      $("#shapeName").val(polygon.description);
      $("#spnFillColor").css("backgroundColor", polygon.fillColor);
      if (polygon.layerItemId > 0) {
        $("#btnDelete").show();
      } else {
        $("#btnDelete").hide();
      }
      if (showToolBoxSection) {
        $.bkfsMap.selectToolBoxSection("jqMpCntlCustomDiv");
      }

      var pathArray = polygon.getPaths().getArray();
      var paths = [];
      //for (var i = 0; i < pathArray.length; i++) {
      //    var pathSubArray = pathArray[i].getArray();
      //    for (var j = 0; j < pathSubArray.length; j++) {
      //        paths.push(new google.maps.LatLng(pathSubArray[j].lat(), pathSubArray[j].lng()));
      //    }
      //    paths.push(new google.maps.LatLng(pathSubArray[0].lat(), pathSubArray[0].lng()));
      //}

      for (var i = 0; i < pathArray.length; i++) {
        var pathSubArray = pathArray[i].getArray();
        for (var j = 0; j < pathSubArray.length; j++) {
          paths.push({
            latitude: pathSubArray[j].lat(),
            longitude: pathSubArray[j].lng()
          });
        }
        //paths.push({
        //    latitude: pathSubArray[0].lat(),
        //    longitude: pathSubArray[0].lng()
        //});
      }
      $.bkfsMap.editedPolygonOrigPathsArray = paths;
      shapePropertiesChanged = false;
    },
    addPolygonListeners: function(polygon) {
      var polyPaths = polygon.getPaths().getArray();
      for (var i = 0; i < polyPaths.length; i++) {
        var path = polyPaths[i];
        path.addListener("insert_at", function() {
          $.bkfsMap.addPolygon(polygon.getPaths(), polygon.shapeId);
        });

        path.addListener("remove_at", function() {
          $.bkfsMap.addPolygon(polygon.getPaths(), polygon.shapeId);
        });

        path.addListener("set_at", function() {
          $.bkfsMap.addPolygon(polygon.getPaths(), polygon.shapeId);
        });
      }
      polygon.addListener("drag_end", function(e) {
        $.bkfsMap.addPolygon(polygon.getPaths(), polygon.shapeId);
      });
      if ($.bkfsMap.topMenuOptions.mapLayerCollectionId > 0) {
        polygon.getPaths().forEach(function(path, index) {
          google.maps.event.addListener(path, "insert_at", function() {
            shapePropertiesChanged = true;
          });
          google.maps.event.addListener(path, "remove_at", function() {
            shapePropertiesChanged = true;
          });
          google.maps.event.addListener(path, "set_at", function() {
            shapePropertiesChanged = true;
          });
        });
        google.maps.event.addListener(polygon, "click", function(event) {
          if ($("#hdnShapeId").val() == "") {
            $.bkfsMap.showEditShapeProperties(polygon, true);
          } else if (parseInt($("#hdnShapeId").val(), 10) != polygon.shapeId) {
            if (!shapePropertiesChanged) {
              $.bkfsMap.editShape(parseInt($("#hdnShapeId").val(), 10));
              $.bkfsMap.showEditShapeProperties(polygon);
            } else {
              $("#hdnSecondEditedShapeId").val(polygon.shapeId);
              $("#shapeChanged").dialog("open");
            }
          }
          //else {
          //    $.bkfsMap.topMenuOptions.setLayerProperties();
          //}
        });
      } else {
        polygon.addListener("click", function(e) {
          google.maps.event.trigger($.bkfsMap.divMap, "click", e);
        });
      }
    },
    buildShapeElement: function(shapeInfo) {
      if ($.bkfsMap.createDrawingHiddenElements) {
        var $elementToAdd = $("#hdnShape" + shapeInfo.id);
        if ($elementToAdd.length == 0) {
          $elementToAdd = $(
            '<input type="hidden" name="Shape' +
              shapeInfo.id +
              '" id="hdnShape' +
              shapeInfo.id +
              '"/>'
          );
          $elementToAdd.appendTo($("form:first"));
        }
        $elementToAdd.val(JSON.stringify(shapeInfo));
      }
      if (shapeInfo.shapeType == 6) {
        return;
      }
      if ($.bkfsMap.isGoogleMapShape(shapeInfo.shapeType)) {
        $.bkfsMap.currentShapeId = shapeInfo.id;
        $.bkfsMap.addToShapeSummary(shapeInfo);
        $("#jqMpCntlTopMenuActionShapeEdit").show();
      }
      $("#divMap").width($(window).width() - 6);

      var hasShapeIncluded = $.bkfsMap.hasShapeIncluded();
      if (hasShapeIncluded) {
        $("#jqMpCntlTopMenuActionLockBoundry").addClass(
          "jqMpCntlTopMenuActionDisabled"
        );
        $("#jqMpCntlTopMenuActionLockBoundry div").data(
          "tooltip",
          $.bkfsMap.disabledMapBoundary
        );
      }
      if (
        $.bkfsMap.shapeArray.length > 1 &&
        hasShapeIncluded &&
        $.bkfsMap.mapBoundaryShapeId > -1
      ) {
        $.bkfsMap.deleteShape($.bkfsMap.mapBoundaryShapeId.toString(), true);
      }
    },
    toggleMapLock: function(lock, bounds) {
      if ($.bkfsMap.hasShapeIncluded()) {
        return;
      }
      var doLock = typeof lock == "boolean" ? lock : !$.bkfsMap.mapLocked;
      if (doLock != $.bkfsMap.mapLocked) {
        if (doLock) {
          if (typeof bounds == "undefined") {
            bounds = $.bkfsMap.divMap.getBounds();
          }
          $.bkfsMap.currentShapeId = $.bkfsMap.mapBoundaryShapeId = $.bkfsMap.getNextShapeId();
          var rectangle = new google.maps.Rectangle({
            shapeId: $.bkfsMap.currentShapeId,
            shapeTypeId: 5,
            fillOpacity: 0,
            strokeOpacity: 0
          });

          $.bkfsMap.shapeArray[$.bkfsMap.currentShapeId] = rectangle;
          $.bkfsMap.addRectangle(
            bounds,
            rectangle.shapeId,
            rectangle.shapeTypeId
          );
          $.bkfsMap.mapLocked = true;
          $.bkfsMap.mapDiv.addClass("jqMpCntlMapLocked");
          $("#jqMpCntlTopMenuActionLockBoundry")
            .addClass("jqMpCntlTopMenuActionActive")
            .removeClass("jqMpCntlTopMenuActionDisabled");
          $("#jqMpCntlTopMenuActionLockBoundry div").data(
            "tooltip",
            $.bkfsMap.lockMapBoundaryActive
          );
        } else {
          $.bkfsMap.deleteShape($.bkfsMap.mapBoundaryShapeId.toString());
        }
      }
    },
    redrawPins: function(pins) {
      if ($.bkfsMap.markerCluster != null)
        $.bkfsMap.markerCluster.clearMarkers();
      for (var idx = 0; idx < $.bkfsMap.allPins.length; idx++) {
        $.bkfsMap.allPins[idx].setMap(null);
      }
      $.bkfsMap.allPins = [];
      for (var i = 0; i < pins.length; i++) {
        var pin = pins[i];
        var marker = new google.maps.Marker({
          position: { lat: pin.latitude, lng: pin.longitude },
          title: pin.pinText,
          label: {
            text: pin.pinText,
            fontSize: "12px",
            color: "white"
          },
          icon: {
            url: $.bkfsMap.iconBasePath + pin.pinClass + ".png",
            origin: new google.maps.Point(0, 0),
            labelOrigin: new google.maps.Point(40, 30),
            size: new google.maps.Size(100, 65),
            anchor: new google.maps.Point(20, 44)
          },
          pinInfo: {
            id: pin.id,
            street: pin.street,
            thumbnail: pin.thumbnail,
            infoImage: pin.infoImage,
            displayId: pin.displayId,
            price: pin.price,
            status: pin.status,
            infoBoxData: pin.infoBoxData,
            infoBoxLabels: pin.infoBoxLabels,
            infoBoxTitle: pin.infoBoxTitle + "<br/>" + pin.CityStateZip,
            infoBoxTitleClass: pin.infoBoxTitleClass,
            index: $.bkfsMap.allPins.length
          }
        });
        $.bkfsMap.allPins.push(marker);
        marker.addListener("click", function() {
          $.bkfsMap.currentIdx = this.pinInfo.index;
          $.bkfsMap.clusterPins = null;
          $.bkfsMap.markerClick(this);
        });
      }
      if (pins.length > 0) {
        $.bkfsMap.setupMarkerCluster();
        $("#jqMpCntlSubMenuResultsToggle").show();
      } else {
        $("#jqMpCntlSubMenuResultsToggle").hide();
      }
    },
    setupMarkerCluster: function() {
      var basePath = $.bkfsMap.iconBasePath.replace("/user/", "");
      var clusterStyles = [
        {
          textColor: "white",
          url: basePath + "/48x48-cluster.png",
          height: 48,
          width: 48
        },
        {
          textColor: "white",
          url: basePath + "/64x64-cluster.png",
          height: 64,
          width: 64
        },
        {
          textColor: "white",
          url: basePath + "/64x64-cluster.png",
          height: 64,
          width: 64
        }
      ];
      $.bkfsMap.markerCluster = new MarkerClusterer(
        $.bkfsMap.divMap,
        $.bkfsMap.allPins,
        {
          maxZoom: $.bkfsMap.clustererMaxZoom,
          zoomOnClick: false,
          styles: clusterStyles
        }
      );

      if ($.bkfsMap.dblClusterClick) {
        google.maps.event.removeListener($.bkfsMap.dblClusterClick);
      }
      $.bkfsMap.dblClusterClick = google.maps.event.addListener(
        $.bkfsMap.divMap,
        "dblclick",
        function() {
          clearTimeout($.bkfsMap.dblClusterClick);
        }
      );

      if ($.bkfsMap.clusterClick) {
        google.maps.event.removeListener($.bkfsMap.clusterClick);
      }
      $.bkfsMap.clusterClick = google.maps.event.addListener(
        $.bkfsMap.divMap,
        "clusterclick",
        function(cluster) {
          $.bkfsMap.divMap.clickingCluster = true;
          window.setTimeout(function() {
            $.bkfsMap.clusterClicked(cluster);
          }, 250);
        }
      );
    },
    clusterClicked: function(cluster) {
      $.bkfsMap.clusterPins = cluster.getMarkers();
      $.bkfsMap.currentIdx = 0;
      $.bkfsMap.markerClick($.bkfsMap.clusterPins[0]);

      if ($.bkfsMap.clusterPinListen)
        google.maps.event.removeListener($.bkfsMap.clusterPinListen);

      $.bkfsMap.clusterPinListen = $.bkfsMap.divMap.addListener(
        "zoom_changed",
        function() {
          if ($.bkfsMap.clusterPins != null) $.bkfsMap.closeToolboxInfobox();
          google.maps.event.removeListener($.bkfsMap.clusterPinListen);
        }
      );
      $.bkfsMap.divMap.clickingCluster = false;
    },
    markerClick: function(marker) {
      if ($.bkfsMap.pinInfobox && $.bkfsMap.pinInfobox.Container) {
        var infoBoxHtml = "";
        if (infoBoxHtml.length == 0) {
          var labelCnt = marker.pinInfo.infoBoxLabels.length;
          if ($.bkfsMap.useMinibox && marker.pinInfo.infoBoxLabels.length > 4)
            labelCnt = Math.round(marker.pinInfo.InfoBoxLabels.length / 2);
          infoBoxHtml = '<table><tr><td colspan="2">';
          if (marker.pinInfo.thumbnail)
            infoBoxHtml +=
              '<img style="width: 106px" src="' +
              marker.pinInfo.thumbnail +
              '"/>';
          infoBoxHtml += "</td></tr>";
          if (marker.pinInfo.price) {
            infoBoxHtml +=
              '<tr><td class="jqMpCntlPushpinPopupLabel">Price</td><td>' +
              marker.pinInfo.price +
              "</td></tr>";
          }
          $("div.jqMpCntlPushpinPopupTitleLabel")
            .removeClass()
            .addClass("jqMpCntlPushpinPopupTitleLabel")
            .addClass(marker.pinInfo.infoBoxTitleClass);
          for (var i = 0; i < labelCnt; i++) {
            infoBoxHtml +=
              '<tr><td class="jqMpCntlPushpinPopupLabel">' +
              marker.pinInfo.infoBoxLabels[i] +
              "</td><td>" +
              marker.pinInfo.infoBoxData[i] +
              "</td></tr>";
          }
          infoBoxHtml += "</table>";
        }
        $.bkfsMap.pinInfobox.TitleLabel.html(marker.pinInfo.infoBoxTitle);
        $.bkfsMap.pinInfobox.Body.html(infoBoxHtml);
        $.bkfsMap.infoWindow.setContent(
          '<div class="jqMpCntlPushpinPopupEx">' +
            $.bkfsMap.pinInfobox.Container.html() +
            "</div>"
        );
        $.bkfsMap.infoWindow.open(divMap, this);
      } else {
        $("#parcelInfo").hide();
        $("#propertyInfo").show();
        $.bkfsMap.getPinData(marker.pinInfo.id);

        $("div.jqMpCntlInfoboxPager").show();
        var curIdx =
          $.bkfsMap.clusterPins != null
            ? $.bkfsMap.currentIdx
            : marker.pinInfo.index;
        $("div.jqMpCntlInfoboxPager .pagerCurrent").text(curIdx + 1);
        var total =
          $.bkfsMap.clusterPins != null
            ? $.bkfsMap.clusterPins.length
            : $.bkfsMap.allPins.length;
        $("div.jqMpCntlInfoboxPager .pagerTotal").text(total);
      }
    },
    togglePins: function() {
      $.bkfsMap.showPins = !$.bkfsMap.showPins;
      if ($.bkfsMap.markerCluster != null) {
        if (!$.bkfsMap.showPins) $.bkfsMap.markerCluster.clearMarkers();
        else {
          $.bkfsMap.setupMarkerCluster();
        }
      }
      for (var idx = 0; idx < $.bkfsMap.allPins.length; idx++) {
        $.bkfsMap.allPins[idx].setVisible($.bkfsMap.showPins);
      }
    },
    openDetailBox: function(id, title) {
      var link = $.bkfsMap.onDetailOpen(id);
      $.bkfsMap.showDetailBox(link, title);
      if (!$.bkfsMap.detailBox.hasClass("jqMpCntlToggleOpen"))
        $.bkfsMap.detailBox.addClass("jqMpCntlToggleOpen");
      $.bkfsMap.detailBox.animate(
        { width: $.bkfsMap.detailBox.data("width") + "px" },
        "slow",
        "linear"
      );
      $.bkfsMap.closeToolboxActions();
      $("div.jqMpCntlMeasurementDiv, div.jqMpCntlAnnotateContainer").css({
        "z-index": 999
      });
    },
    closeDetailBox: function() {
      $.bkfsMap.detailBox.removeClass("jqMpCntlToggleOpen");
      $.bkfsMap.detailBox.animate({ width: "0px" });
      $.bkfsMap.hideDetailBox();
    },
    updateDetailBoxTitle: function(title) {
      if ($.bkfsMap.detailBox != null && typeof title != "undefined") {
        $.bkfsMap.detailBox.find("div.jqMpCntlDetailTitle").text(title);
      }
    },
    updateDetailBoxContent: function(link) {
      if ($.bkfsMap.detailBox != null && typeof link != "undefined") {
        var $frm = $.bkfsMap.detailBox.find("iframe#jqMpCntDetailFrame");
        var $cntr = $.bkfsMap.detailBox.find("div.jqMpCntlDetailBoxContent");
        $frm.attr("src", link).height($cntr.height());
      }
    },
    showDetailBox: function(link, title) {
      $.bkfsMap.updateDetailBoxTitle(title);
      $.bkfsMap.updateDetailBoxContent(link);
      if (!$.bkfsMap.detailBox.hasClass("jqMpCntlToggleOpen"))
        $.bkfsMap.detailBox.addClass("jqMpCntlToggleOpen");

      if ($.bkfsMap.topMenuOptions.$legacyCount != null)
        $.bkfsMap.topMenuOptions.$legacyCount.hide();
      $.bkfsMap.detailBox.show("slow");
      var toolboxCloser = $("div#jqMpCntlToolboxInfobox div.close");
      if (
        toolboxCloser.css("display") != "none" &&
        $.bkfsMap.hideInfoBoxCloser
      ) {
        toolboxCloser.hide();
        $("div#jqMpCntlToolboxInfobox div.infoBoxTitle").css({ top: "-=42" });
        $("div#jqMpCntlToolboxInfobox div.content").css({ top: "-=12" });
        $("div#jqMpCntlToolboxInfobox").css({ top: "+=42" });
      }
    },
    hideDetailBox: function() {
      if ($.bkfsMap.detailBox != null) $.bkfsMap.detailBox.hide();
      if ($.bkfsMap.topMenuOptions.$legacyCount != null)
        $.bkfsMap.topMenuOptions.$legacyCount.show();
      $("div.jqMpCntlMeasurementDiv").css({ "z-index": 1000 });
      $("div.jqMpCntlAnnotateContainer").css({ "z-index": 1001 });
      var toolboxCloser = $("div#jqMpCntlToolboxInfobox div.close");
      if (
        toolboxCloser.css("display") == "none" &&
        $.bkfsMap.hideInfoBoxCloser
      ) {
        toolboxCloser.show();
        $("div#jqMpCntlToolboxInfobox div.infoBoxTitle").css({ top: "+=42" });
        $("div#jqMpCntlToolboxInfobox div.content").css({ top: "+=12" });
        $("div#jqMpCntlToolboxInfobox").css({ top: "-=42" });
      }
    },
    updateCount: function(count, msg) {
      if (typeof count != "undefined") {
        if (typeof msg == "undefined") msg = "";

        var formatOpts = { format: "#,###", locale: "us" };

        if ($.bkfsMap.topMenuOptions.$legacyCount != null) {
          $.bkfsMap.topMenuOptions.$legacyCount.show();
          var cntDiv = $.bkfsMap.topMenuOptions.$legacyCount.find("b#divCount");
          cntDiv.text(count);
          if ($.isFunction(cntDiv.format)) cntDiv.format(formatOpts);

          $.bkfsMap.topMenuOptions.$legacyCount
            .find("div.jqmCntlLegacyCountLabel")
            .text(msg);
        }

        if (!$.bkfsMap.topMenuOptions.$legacyCount) {
          $.bkfsMap.doAlert({
            text: $.formatNumber(count, formatOpts) + " " + msg
          });
        }
      } else {
        if ($.bkfsMap.topMenuOptions.$legacyCount != null)
          $.bkfsMap.topMenuOptions.$legacyCount.hide();
      }
    },
    giveWarningIfNeeded: function(requestTime) {
      var diffDate = new Date(new Date().getTime() - requestTime);

      if (diffDate.getSeconds() >= 15) {
        $.jGrowl(
          "This search is taking a very long time.  We recommend doing one of the following options:<br/><br/>1) Enter more criteria. <br/>2) Use a smaller shape. <br/>3) Use a different shape (non-polygon).",
          { sticky: true, header: "WARNING", group: "jgrowl-warn" }
        );
      }
    },
    shapeMaxCheck: function() {
      var count = $.bkfsMap.getShapeCount();
      if (count >= $.bkfsMap.maxNumberShapes) {
        $.bkfsMap.doAlert({
          text:
            "Warning:<br/> You cannot draw more than " +
            $.bkfsMap.maxNumberShapes +
            " shapes on the map.  You must delete a shape before you can create a new shape.",
          timeout: 10000
        });
        return false;
      }
      return true;
    },
    drawingImageClick: function(drawMode) {
      $.bkfsMap.isDrawingShape = true;
      if ($.bkfsMap.shapeMaxCheck())
        $.bkfsMap.drawingManager.setDrawingMode(drawMode);
    },
    middlePoint: function(lat1, lng1, lat2, lng2) {
      //-- Longitude difference
      var dLng = (lng2 - lng1).toRad();

      //-- Convert to radians
      lat1 = lat1.toRad();
      lat2 = lat2.toRad();
      lng1 = lng1.toRad();

      var bX = Math.cos(lat2) * Math.cos(dLng);
      var bY = Math.cos(lat2) * Math.sin(dLng);
      var lat3 = Math.atan2(
        Math.sin(lat1) + Math.sin(lat2),
        Math.sqrt((Math.cos(lat1) + bX) * (Math.cos(lat1) + bX) + bY * bY)
      );
      var lng3 = lng1 + Math.atan2(bY, Math.cos(lat1) + bX);

      //-- Return result as LatLng
      return new google.maps.LatLng(lat3.toDeg(), lng3.toDeg());
    },
    deleteDistanceElements: function(id, preventEvent) {
      var numRemoved = 0;
      if (id.indexOf("Distance") >= 0) {
        id = id.replace("Distance", "");
      }
      var shape = $("#hdnShapeDistance" + id);
      if (shape.length > 0) {
        shape.remove();
      }
      if (!preventEvent) {
        $.bkfsMap.criteriaCallback();
      }

      for (var i = $.bkfsMap.distanceElements.length - 1; i >= 0; i--) {
        if (
          $.bkfsMap.distanceElements[i].id == "pointA_" + id ||
          $.bkfsMap.distanceElements[i].id == "pointB_" + id ||
          $.bkfsMap.distanceElements[i].id == "distancePolyline_" + id ||
          $.bkfsMap.distanceElements[i].id == "infoWindow_" + id
        ) {
          //Remove the marker from Map
          $.bkfsMap.distanceElements[i].setMap(null);

          $.bkfsMap.distanceElements.splice(i, 1);

          numRemoved++;
          if (numRemoved == 4) return;
        }
      }
    },
    measureClickEvent: function(latLngPointA, latLngPointB) {
      var shapeId = $.bkfsMap.getNextMeasureShapeId();
      var pointA = new google.maps.Marker({
        position: latLngPointA,
        map: $.bkfsMap.divMap,
        id: "pointA_" + shapeId,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          strokeColor: "purple",
          scale: $.bkfsMap.isReportView ? 0 : 6,
          labelOrigin: new google.maps.Point(2, 5)
        },
        draggable: $.bkfsMap.isReportView ? false : true
      });
      $.bkfsMap.distanceElements.push(pointA);

      var pointB = new google.maps.Marker({
        position: latLngPointB,
        map: $.bkfsMap.divMap,
        id: "pointB_" + shapeId,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          strokeColor: "purple",
          scale: $.bkfsMap.isReportView ? 0 : 6,
          labelOrigin: new google.maps.Point(2, 5)
        },
        draggable: $.bkfsMap.isReportView ? false : true
      });
      $.bkfsMap.distanceElements.push(pointB);

      var distancePolyline = new google.maps.Polyline({
        path: [pointA.position, pointB.position],
        id: "distancePolyline_" + shapeId,
        strokeColor: "#00bfff",
        strokeOpacity: 0.9
      });
      distancePolyline.setMap($.bkfsMap.divMap);
      $.bkfsMap.distanceElements.push(distancePolyline);

      var infoWindow = new google.maps.InfoWindow({
        id: "infoWindow_" + shapeId,
        content: "",
        disableAutoPan: true
      });
      $.bkfsMap.distanceElements.push(infoWindow);

      if (!latLngPointA.equals(latLngPointB)) {
        $.bkfsMap.setInfoWindowDistance(pointA);
      }

      google.maps.event.addListener(infoWindow, "closeclick", function() {
        var shapeIndex = this.id.substring(this.id.indexOf("_") + 1);
        $.bkfsMap.deleteDistanceElements(shapeIndex);
      });

      google.maps.event.addListener(pointA, "drag", function() {
        var pointA = this;
        var pointB = $.bkfsMap.getDistanceElement(this.id, "pointB_");
        $.bkfsMap.draggingMeasure = true;
        var infoWindow = $.bkfsMap.getDistanceElement(this.id, "infoWindow_");
        var distanceLabel = $.bkfsMap.getInfoWindowMeasurementLabel(infoWindow);
        infoWindow.close();

        distancePolyline.setPath([pointA.getPosition(), pointB.getPosition()]);
        pointA.setLabel(
          $.bkfsMap.distance(
            pointA.getPosition().lat(),
            pointA.getPosition().lng(),
            pointB.getPosition().lat(),
            pointB.getPosition().lng(),
            distanceLabel
          )
        );
        pointB.setLabel("");
      });

      google.maps.event.addListener(pointB, "drag", function() {
        var pointA = $.bkfsMap.getDistanceElement(this.id, "pointA_");
        var pointB = this;
        $.bkfsMap.draggingMeasure = true;
        var infoWindow = $.bkfsMap.getDistanceElement(this.id, "infoWindow_");
        var distanceLabel = $.bkfsMap.getInfoWindowMeasurementLabel(infoWindow);
        infoWindow.close();

        distancePolyline.setPath([pointA.getPosition(), pointB.getPosition()]);
        pointA.setLabel("");
        pointB.setLabel(
          $.bkfsMap.distance(
            pointA.getPosition().lat(),
            pointA.getPosition().lng(),
            pointB.getPosition().lat(),
            pointB.getPosition().lng(),
            distanceLabel
          )
        );
      });

      google.maps.event.addListener(pointA, "dragend", function() {
        $.bkfsMap.setInfoWindowDistance(this);
        $.bkfsMap.draggingMeasure = false;
      });

      google.maps.event.addListener(pointB, "dragend", function() {
        $.bkfsMap.setInfoWindowDistance(this);
        $.bkfsMap.draggingMeasure = false;
      });
    },
    getDistanceElement: function(currentShapeElement, shapeId) {
      var element = null;
      var shapeIndex = currentShapeElement.substring(
        currentShapeElement.indexOf("_") + 1
      );
      if ($.bkfsMap.distanceElements.length > 0) {
        $.each($.bkfsMap.distanceElements, function(key, obj) {
          if (obj.id == shapeId + shapeIndex) {
            element = obj;
            return false;
          }
        });
      }

      return element;
    },
    getInfoWindowMeasurementLabel: function(obj) {
      var distanceLabel =
        $.bkfsMap.topMenuOptions.distanceMeasurementAbbr == "km"
          ? "km"
          : "miles";
      if (obj.content.length > 0) {
        var innerHtml = obj.content.substring(
          obj.content.indexOf(">") + 1,
          obj.content.indexOf("</")
        );
        var arrVals = innerHtml.split(" ");
        if (arrVals.length > 1) {
          distanceLabel = arrVals[1];
        }
      }
      return distanceLabel;
    },
    setInfoWindowDistance: function(obj) {
      var pointA = $.bkfsMap.getDistanceElement(obj.id, "pointA_");
      var pointB = $.bkfsMap.getDistanceElement(obj.id, "pointB_");
      var infoWindow = $.bkfsMap.getDistanceElement(obj.id, "infoWindow_");
      var midPoint = $.bkfsMap.middlePoint(
        pointA.position.lat(),
        pointA.position.lng(),
        pointB.position.lat(),
        pointB.position.lng()
      );
      var shapeIndex = obj.id.substring(obj.id.indexOf("_") + 1);
      var distanceLabel = $.bkfsMap.getInfoWindowMeasurementLabel(infoWindow);
      var polyLine = $.bkfsMap.getDistanceElement(obj.id, "distancePolyline_");

      var distance = $.bkfsMap.distance(
        pointA.getPosition().lat(),
        pointA.getPosition().lng(),
        pointB.getPosition().lat(),
        pointB.getPosition().lng(),
        distanceLabel
      );
      polyLine.setPath([pointA.position, pointB.position]);
      pointA.setLabel("");
      pointB.setLabel("");

      var marker = new google.maps.Marker({
        position: midPoint,
        map: $.bkfsMap.divMap,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 0
        }
      });

      infoWindow.setContent(
        '<div id="divInfoWindow_' +
          shapeIndex +
          '" style="cursor:pointer;" onclick="$.bkfsMap.toggleDistance(this)">' +
          distance +
          "</div>"
      );
      infoWindow.open($.bkfsMap.divMap, marker);

      var mapDistanceJson = {
        id: "Distance" + shapeIndex,
        shapeType: 6,
        points: [
          {
            latitude: pointA.position.lat(),
            longitude: pointA.position.lng()
          },
          {
            latitude: pointB.position.lat(),
            longitude: pointB.position.lng()
          }
        ]
      };
      $.bkfsMap.buildShapeElement(mapDistanceJson);
      $.bkfsMap.criteriaCallback();
      var mapBounds = $.bkfsMap.divMap.getBounds();
      var mapBoundsChanged =
        $.bkfsMap.currentMapBounds != null
          ? !$.bkfsMap.currentMapBounds.equals(mapBounds)
          : false;
      if ($.bkfsMap.mapBoundaryShapeId > -1 && mapBoundsChanged) {
        $.bkfsMap.deleteShape($.bkfsMap.mapBoundaryShapeId.toString(), true);
        $.bkfsMap.toggleMapLock();
      }
      $.bkfsMap.currentMapBounds = mapBounds;
    },
    toggleDistance: function(obj) {
      var pointA = $.bkfsMap.getDistanceElement(obj.id, "pointA_");
      var pointB = $.bkfsMap.getDistanceElement(obj.id, "pointB_");
      var infoWindow = $.bkfsMap.getDistanceElement(obj.id, "infoWindow_");
      var distanceLabel = $.bkfsMap.getInfoWindowMeasurementLabel(infoWindow);

      if (distanceLabel == "miles") {
        distanceLabel = "feet";
      } else if (distanceLabel == "feet") {
        distanceLabel = "miles";
      } else if (distanceLabel == "km") {
        distanceLabel = "meters";
      } else if (distanceLabel == "meters") {
        distanceLabel = "km";
      }
      var shapeIndex = obj.id.substring(obj.id.indexOf("_") + 1);
      var val = $.bkfsMap.distance(
        pointA.getPosition().lat(),
        pointA.getPosition().lng(),
        pointB.getPosition().lat(),
        pointB.getPosition().lng(),
        distanceLabel
      );

      infoWindow.setContent(
        '<div id="divInfoWindow_' +
          shapeIndex +
          '" style="cursor:pointer;" onclick="$.bkfsMap.toggleDistance(this)" >' +
          val +
          "</div>"
      );
    },
    distance: function(lat1, lon1, lat2, lon2, currentDistanceLbl) {
      var r = 6371; // km
      var dLat = ((lat2 - lat1) * Math.PI) / 180;
      var dLon = ((lon2 - lon1) * Math.PI) / 180;
      var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = r * c;
      var precision = 0;
      if (currentDistanceLbl == "km") {
        precision = 2;
      } else if (currentDistanceLbl == "miles") {
        precision = 2;
        d = d * 0.621371192;
      } else if (currentDistanceLbl == "feet") {
        d = d * 0.621371192 * 5280;
      } else if (currentDistanceLbl == "meters") {
        d = d * 1000;
      }

      return d.toFixed(precision) + " " + currentDistanceLbl;
    },
    addToShapeSummary: function(shapeInfo, suppressMouse) {
      var shapeTypeId = shapeInfo.shapeType;
      if (
        $.bkfsMap.topMenuOptions.showShapeSummary &&
        $("#jqMpCntlShapeSummaryItem_" + $.bkfsMap.currentShapeId).length == 0
      ) {
        var shapeIconClass = "";
        var shapeDescription = "";
        switch (shapeTypeId) {
          case 1:
            shapeIconClass = "jqMpCntSSumRadius";
            shapeDescription = "Radius";
            break;
          case 2:
            shapeIconClass = "jqMpCntSSumRectangle";
            shapeDescription = "Rectangle";
            break;
          case 4:
            shapeIconClass = "jqMpCntSSumPolygon";
            shapeDescription = "Polygon";
            break;
        }
        $('a[rel="jqMpCntlShapeSummaryDiv"]').show();
        $("a#jqMpCntlSubMenuDrwToolsShapeToggle").show();
        $.bkfsMap.toggleUserTabs();
        $("li#jqMpCntlTopMenuActionPushPins").removeClass(
          "jqMpCntlTopMenuActionDisabled"
        );
        var rel = $.bkfsMap.currentShapeId;
        var $summaryItem = $(
          '<div class="jqMpCntlShapeSummaryItemBase jqMpCntlUseToolTip jqMpCntlShapeSummaryItemNormal" id="jqMpCntlShapeSummaryItem_' +
            $.bkfsMap.currentShapeId +
            '" rel="' +
            rel +
            '" data-tooltip="">'
        );
        if (suppressMouse != true) {
          $summaryItem.mouseover(function(e) {
            $.bkfsMap.shapeMouseOver(e);
          });
          $summaryItem.mouseout(function() {
            $.bkfsMap.startShapeMenuTimer();
          });
        }
        if ($.bkfsMap.shapeGeomType == "Measure")
          $summaryItem.appendTo($("#jqMpCntlDivMeasurements"));
        else $summaryItem.appendTo($("#jqMpCntlDivShapes"));

        if ($.bkfsMap.shapeGeomType != "Measure") {
          var $toggleExclude = $(
            '<div class="jqMpCntShapeSummaryImage jqMpCntlUseToolTip ' +
              shapeIconClass +
              (shapeInfo.exclude ? " jqMpCntSSumShapeExcluded" : "") +
              '"></div>'
          ).appendTo($summaryItem);

          if (
            $.bkfsMap.topMenuOptions.showExcludeOnShapeSummary &&
            $.bkfsMap.selectionMode != "multi" &&
            suppressMouse != true
          ) {
            $toggleExclude
              .data(
                "tooltip",
                "Click to exclude the shape's area in your search."
              )
              .mouseover(function(e) {
                $.bkfsMap.shapeMouseOver(e);
              })
              .mouseout(function(e) {
                $.bkfsMap.startShapeMenuTimer();
                e.stopPropagation();
                e.handled = true;
                return false;
              })
              .click(function(e) {
                e.stopPropagation();
                $.bkfsMap.toggleShapeExclusion(
                  $(this)
                    .parent()
                    .attr("id"),
                  $(this)
                );
                e.handled = true;
                return false;
              });
          }
        }
        var description = $(
          '<div class="jqMpCntlShapeSummaryDesc jqMpCntlUseToolTip" id="shapeDesc_' +
            $.bkfsMap.currentShapeId +
            '" rel="' +
            rel +
            '" data-tooltip="" ><div class="jqMpCntlShapeName">' +
            shapeDescription +
            "</div></div>"
        ).appendTo($summaryItem);
        if ($.bkfsMap.selectionMode != "multi" && suppressMouse != true) {
          $summaryItem
            .mouseover(function(e) {
              $.bkfsMap.shapeMouseOver(e);
            })
            .mouseout(function(e) {
              $.bkfsMap.startShapeMenuTimer();
              e.stopPropagation();
              e.handled = true;
              return false;
            });
        }
        if (
          $.bkfsMap.shapeGeomType != "Measure" &&
          $.bkfsMap.shapeGeomType != "drivetime"
        ) {
          description.append(
            '<div class="jqMpCntlShapeState">' +
              (shapeInfo.exclude ? "Exclude" : "Include") +
              "</div>"
          );
          if ($.bkfsMap.selectionMode != "multi" && suppressMouse != true) {
            description.click(function() {
              var newId = $(this)
                .parent()
                .attr("rel");
              if (
                $.bkfsMap.currentSelectedId != null &&
                $.bkfsMap.currentSelectedId != newId
              ) {
                $.bkfsMap.editShape($.bkfsMap.currentSelectedId);
              }
              $.bkfsMap.editShape(newId);
            });
          }
          if ($.bkfsMap.countElement != null)
            $.bkfsMap.drawing.countElement.text($.bkfsMap.getShapeCount());
        } else {
          description.append(
            '<div class="jqMpCntlShapeState jqMpCntlShowMiles">' +
              $.bkfsMap.distanceElement.html() +
              "</div>"
          );
          var useKm = $.bkfsMap.topMenuOptions.distanceMeasurementAbbr == "km";
          var num = (
            parseFloat($.bkfsMap.distanceElement.html()) * (useKm ? 1000 : 5280)
          ).toFixed(0);
          var distanceLabel = useKm ? " meters" : " feet";
          var test = $.formatNumber(num, { format: "#,###", locale: "us" });
          description.append(
            '<div class="jqMpCntlShapeState jqMpCntlShowFeet">' +
              test +
              distanceLabel +
              "</div>"
          );
          if ($.bkfsMap.currentMeasurementUnit == "miles") {
            $(".jqMpCntlShowMiles").show();
            $(".jqMpCntlShowFeet").hide();
          } else {
            $(".jqMpCntlShowFeet").show();
            $(".jqMpCntlShowMiles").hide();
          }
        }
        var count = $.bkfsMap.getShapeCount();
        if (count > 0) $.bkfsMap.topMenuOptions.shapeActionsElement.show();
        else $.bkfsMap.topMenuOptions.shapeActionsElement.hide();
        count = $.bkfsMap.getMeasurementCount();
        if (count > 0) $.bkfsMap.topMenuOptions.measureActionsElement.show();
        else $.bkfsMap.topMenuOptions.measureActionsElement.hide();
        if ($.bkfsMap.measureCountElement != null) {
          $.bkfsMap.measureCountElement.text(count);
        }
        //test comment to see if this is included inn build to troubleshoot 145791-1
        $.bkfsMap.shapeCountForMenu =
          $.bkfsMap.getShapeCount() + $.bkfsMap.getMeasurementCount();
        $(
          '<div class="jqMpCntlShapeSummaryItemAction jqMpCntlShapeSummaryDel jqMpCntlUseToolTip" data-tooltip="Remove shape from map." />'
        )
          .appendTo($summaryItem)
          .click(function(e) {
            e.stopPropagation();
            $.bkfsMap.deleteShape(
              $(this)
                .parent()
                .attr("rel")
            );
            var shapeCount = $.bkfsMap.getShapeCount();
            if (shapeCount == 0) {
              if (
                searchHasCountLessThanMaxPins &&
                $.bkfsMap.initializeMapBoundary
              ) {
                if ($.bkfsMap.mapBoundaryShapeId > -1) {
                  $.bkfsMap.deleteShape(
                    $.bkfsMap.mapBoundaryShapeId.toString(),
                    true
                  );
                }
                $.bkfsMap.toggleMapLock();
              } else {
                $("#jqMpCntlTopMenuActionLockBoundry").removeClass(
                  "jqMpCntlTopMenuActionDisabled"
                );
                $("#jqMpCntlTopMenuActionLockBoundry div").data(
                  "tooltip",
                  $.bkfsMap.lockMapBoundary
                );
              }
            }

            e.handled = true;
            return false;
          });
        if ($.bkfsMap.shapeGeomType != "drivetime") {
          $(
            '<div class="jqMpCntlShapeSummaryItemAction jqMpCntlShapeSummaryHide jqMpCntlUseToolTip" data-tooltip="Hide this shape." rel="' +
              $.bkfsMap.shapeGeomType +
              '" />'
          )
            .appendTo($summaryItem)
            .click(function(e) {
              e.stopPropagation();
              var id = $(e.target)
                .parent()
                .attr("rel");
              var type = $(e.target).attr("rel");
              if ($(e.target).hasClass("jqMpCntlShapeSummaryHide")) {
                $(e.target)
                  .addClass("jqMpCntlShapeSummaryShow")
                  .removeClass("jqMpCntlShapeSummaryHide");
                if ($.bkfsMap.currentSelectedId == id)
                  $.bkfsMap.editShape($.bkfsMap.currentSelectedId);
                $.bkfsMap.setShapeVisibility(id, false);
                if (type == "Measure") $.bkfsMap.hideMeasurementLabels(id);
              } else {
                $(e.target)
                  .addClass("jqMpCntlShapeSummaryHide")
                  .removeClass("jqMpCntlShapeSummaryShow");
                $.bkfsMap.setShapeVisibility(id, true);
                if (type == "Measure") $.bkfsMap.showMeasurementLabels(id);
              }
              e.handled = true;
              return false;
            });
        }
        $.bkfsMap.bindToolTips();
      }
    },
    toggleUserTabs: function() {
      var userTabs = $("dt.jqMpCntlToolBoxUser");
      if (userTabs.css("display") != "block") {
        userTabs.show("slow", function() {
          if (
            $.bkfsMap.topMenuOptions.showLayer &&
            $.bkfsMap.topMenuOptions.layersInToolBox
          ) {
            var locationsList = $("dd#jqMpCntlLocationsDiv");
            locationsList.height(locationsList.height() - userTabs.height());
          }
        });
      } else if (userTabs.children(":visible").length == 0) {
        var height = userTabs.height();
        userTabs.hide("slow", function() {
          if (
            $.bkfsMap.topMenuOptions.showLayer &&
            $.bkfsMap.topMenuOptions.layersInToolBox
          ) {
            var locationsList = $("dd#jqMpCntlLocationsDiv");
            locationsList.height(locationsList.height() + height);
          }
        });
      }
    },
    isGoogleMapShape: function(shapeTypeId) {
      return shapeTypeId != 5 && shapeTypeId != 7;
    },
    getShapeCount: function() {
      return $.bkfsMap.getShapeArrayCount();
    },
    getMeasurementCount: function() {
      return $.bkfsMap.measureArray.length;
    },
    getShapeArrayCount: function(fromPostSearch) {
      var shapeCount = 0;

      for (var i = 0; i < $.bkfsMap.shapeArray.length; i++) {
        if (
          $.bkfsMap.shapeArray[i] &&
          (fromPostSearch ||
            $.bkfsMap.isGoogleMapShape($.bkfsMap.shapeArray[i].shapeType))
        )
          shapeCount++;
      }
      return shapeCount;
    },
    bindToolTips: function() {
      if ($.bkfsMap.topMenuOptions.showToolTip && !$.bkfsMap.isTouchDevice) {
        $(".jqMpCntlUseToolTip").hover(
          function() {
            $.bkfsMap.clearToolTipTimer();
            $.bkfsMap.tooltipText = $(this).data("tooltip");
            $.bkfsMap.tooltipTimer = setTimeout(function() {
              $.bkfsMap.showJqMCntlToolTip($.bkfsMap.tooltipText);
            }, 1600);
          },
          function() {
            $.bkfsMap.clearToolTipTimer();
            $.bkfsMap.hideJqMCntlToolTip();
          }
        );
      }
    },
    shapeMouseOver: function(e) {
      if (e.target.id == "" || !$.bkfsMap.allowShapeInteraction()) return;

      var id = e.target.id.split("_")[1];
      if (id != "null" && $.bkfsMap.currentSelectedId != id) {
        if (
          $.bkfsMap.mouseOverShapeId != null &&
          $.bkfsMap.mouseOverShapeId != id
        )
          $.bkfsMap.shapeMouseOut(e);
        $.bkfsMap.mouseOverShapeId = id;
        var shape = $.bkfsMap.shapeArray[id];
        if (!shape.editable) {
          var fill = $.bkfsMap.getFillColor(shape.exclude, shape.farming);
          var line = $.bkfsMap.shapeMouseOverLineColor;
          shape.setOptions({
            fillColor: fill,
            strokeColor: line,
            strokeThickness: $.bkfsMap.strokeThickness + 2
          });
          $.bkfsMap.setMapPointer($.bkfsMap.shapeHoverCursor);

          if ($.bkfsMap.topMenuOptions.displayShapeLabel)
            $("#jqMpCntlShapeLabel_" + id + " div").css("color", "#00BFFF");
          if ($('div[name="shape_' + id + '"]'))
            $('div[name="shape_' + id + '"]').addClass(
              "jqMpCntlMeasurementDivHover"
            );

          if ($.bkfsMap.showEditMessage && $.bkfsMap.displayShapeEditMessage) {
            $.bkfsMap.showEditMessage = false;
            $.bkfsMap.instruct($.bkfsMap.instructions.clickShapeToEdit);
            setTimeout(function() {
              $.bkfsMap.showEditMessage = true;
            }, $.bkfsMap.editMessageInterval);
          }
        }
      }
    },
    shapeMouseOut: function() {
      if ($.bkfsMap.currentSelectedId != $.bkfsMap.mouseOverShapeId) {
        if ($.bkfsMap.shapeEdgeHandle) $.bkfsMap.shapeEdgeHandle.hide();
        var shapeInfo = $.bkfsMap.shapeArray[$.bkfsMap.mouseOverShapeId];
        if (shapeInfo && !shapeInfo.editable) {
          var fill = $.bkfsMap.getFillColor(
            shapeInfo.exclude,
            shapeInfo.farming
          );
          var line = $.bkfsMap.getLineColor(
            shapeInfo.exclude,
            shapeInfo.farming
          );
          shapeInfo.setOptions({
            fillColor: fill,
            strokeColor: line,
            strokeThickness: $.bkfsMap.strokeThickness
          });
          $.bkfsMap.setMapPointer($.bkfsMap.mapGrabCur);
        }
      }
    },
    allowShapeInteraction: function() {
      return $.bkfsMap.restrictInteraction
        ? $.bkfsMap.currentToolboxTabId == "jqMpCntlShapeSummaryDiv" &&
            parseInt($.bkfsMap.$toolBox.css("marginLeft")) >= 0
        : true;
    },
    startShapeMenuTimer: function() {
      if ($.bkfsMap.shapeMenuTimer != null)
        clearTimeout($.bkfsMap.shapeMenuTimer);
      $.bkfsMap.shapeMenuTimer = setTimeout($.bkfsMap.shapeMouseOut, 600);
    },
    setMapPointer: function(cursor, ignoreDrawing) {},
    deleteAllShapes: function() {
      $.each($.bkfsMap.shapeArray, function(idx, val) {
        if (val != null) $.bkfsMap.deleteShape(val.shapeId, true);
      });
      $.bkfsMap.shapeArray = [];
      $.bkfsMap.redrawPins([]);
      $.bkfsMap.updateCount();
    },
    deleteShape: function(entityId, preventEvent) {
      if ($.bkfsMap.topMenuOptions.showShapeSummary) {
        var element = $(
          "#jqMpCntlShapeSummaryItem_" +
            entityId +
            " div.jqMpCntlShapeSummaryDel"
        );
        $(element)
          .parent()
          .remove();
      }
      var sStoreItem = $.bkfsMap.shapeArray[entityId];
      var driveTime = sStoreItem ? sStoreItem.shapeType == 41 : false;
      var layerName = sStoreItem ? sStoreItem.associatedId : "";
      var isCustomLayerItem = false;
      $.bkfsMap.shapeArray[entityId] = null;

      if ($.bkfsMap.createDrawingHiddenElements) {
        var shape = $("#hdnShape" + entityId);
        if (shape.length > 0) {
          var value = JSON.parse(shape.val());
          isCustomLayerItem = value.shapeType == 7;
          if (value.shapeType == 5) {
            $.bkfsMap.mapBoundaryShapeId = -1;
            $.bkfsMap.mapLocked = false;
            $.bkfsMap.mapDiv.removeClass("jqMpCntlMapLocked");
            $("#jqMpCntlTopMenuActionLockBoundry").removeClass(
              "jqMpCntlTopMenuActionActive"
            );
            $("#jqMpCntlTopMenuActionLockBoundry div").data(
              "tooltip",
              $.bkfsMap.hasShapeIncluded()
                ? $.bkfsMap.disabledMapBoundary
                : $.bkfsMap.lockMapBoundary
            );
          } else if (value.shapeType == 6) {
            $.bkfsMap.deleteDistanceElements(entityId, preventEvent);
            return;
          } else if (value.shapeType == 7) {
            $("#layerItemRow_" + value.layeritemid).remove();
            var numRemoved = 0;
            for (
              var i = $.bkfsMap.layerContextElements.length - 1;
              i >= 0;
              i--
            ) {
              if (
                $.bkfsMap.layerContextElements[i].id ==
                  "pointContext_" + entityId ||
                $.bkfsMap.layerContextElements[i].id == "infoWindow_" + entityId
              ) {
                //Remove the marker from Map
                $.bkfsMap.layerContextElements[i].setMap(null);

                $.bkfsMap.layerContextElements.splice(i, 1);

                numRemoved++;
                if (numRemoved == 2) break;
              }
            }

            $.bkfsMap.layerItemIds.splice(
              $.inArray(value.layeritemid, $.bkfsMap.layerItemIds),
              1
            );
            var feature = $.bkfsMap.divMap.data.getFeatureById(
              value.layeritemid
            );
            if (feature != null) {
              feature.setProperty("selected", false);
              var mainDiv = $("div[collId='" + value.collectionid + "']");
              if (!mainDiv.hasClass($.bkfsMap.selectedLayerClass)) {
                $.bkfsMap.divMap.data.remove(feature);
              }
              if (
                !mainDiv
                  .find("div.jqMpCntlCheckSlider")
                  .hasClass("jqMpCntlCheckSliderChecked")
              ) {
                var id =
                  "divInfoBox" +
                  value.collectionid +
                  "_" +
                  feature.getProperty("shapeId");
                $("#" + id).hide();
              }
            }
          } else if (value.layeritemid > 0) {
            if ($.bkfsMap.topMenuOptions.mapLayerCollectionId > 0) {
              $(
                "#divInfoBox" +
                  $.bkfsMap.topMenuOptions.mapLayerCollectionId +
                  "_" +
                  value.id
              ).remove();
            }
            $.bkfsMap.polygonInfoBoxes[value.id] = null;
          }
          shape.remove();
        }
      }
      if ($('div[name="shape_' + entityId + '"]')) {
        $('div[name="shape_' + entityId + '"]').remove();
      }
      var dtItem = layerName + "-" + entityId;
      if (driveTime && $.bkfsMap.layers.driveTimeLayer[dtItem] != null) {
        $.bkfsMap.layers.driveTimeLayer[dtItem]._removeEntity();
        $.bkfsMap.driveTimeShapeCount--;
      }
      if (sStoreItem && !isCustomLayerItem) sStoreItem.setMap(null);
      $.bkfsMap.toggleShapeMenu(false);

      var shapes = $.bkfsMap.getShapeArrayCount("search");
      var measurements = $.bkfsMap.getMeasurementCount();
      if ($.bkfsMap.topMenuOptions.showShapeSummary) {
        if (shapes == 0) $.bkfsMap.topMenuOptions.shapeActionsElement.hide();
        if ($.bkfsMap.countElement && $.bkfsMap.topMenuOptions.showShapeCount) {
          if (shapes == 0) {
            $.bkfsMap.countElement.html("");
          } else {
            $.bkfsMap.countElement.html(shapes);
          }
        }
        if (measurements > 0)
          $.bkfsMap.topMenuOptions.measureActionsElement.show();
        else $.bkfsMap.topMenuOptions.measureActionsElement.hide();
        if (
          $.bkfsMap.topMenuOptions.showShapeCount &&
          $.bkfsMap.measureCountElement != null
        ) {
          if (measurements == 0) $.bkfsMap.measureCountElement.html("");
          else $.bkfsMap.measureCountElement.html(measurements);
        }
        if (
          shapes == 0 &&
          measurements == 0 &&
          $.bkfsMap.topMenuOptions.showShapeSummary
        ) {
          $("#jqMpCntlTopMenuActionShapeEdit").hide();
          $('a[rel="jqMpCntlShapeSummaryDiv"]').hide();
          $("a#jqMpCntlSubMenuDrwToolsShapeToggle").hide();
          if ($("li#jqMpCntlTopMenuActionPushPins ul li").length <= 1)
            $("li#jqMpCntlTopMenuActionPushPins").addClass(
              "jqMpCntlTopMenuActionDisabled"
            );
          if ($("dd#jqMpCntlShapeSummaryDiv").css("display") == "block") {
            $.bkfsMap.topMenuOptions.toolBoxHistory = $.grep(
              $.bkfsMap.topMenuOptions.toolBoxHistory,
              function(i, d) {
                return i != "jqMpCntlShapeSummaryDiv";
              }
            );
            $.bkfsMap.selectToolBoxSection(
              $.bkfsMap.topMenuOptions.toolBoxHistory[
                $.bkfsMap.topMenuOptions.toolBoxHistory.length - 1
              ] || $.bkfsMap.topMenuOptions.toolBoxOpenPanel
            );
            $.bkfsMap.topMenuOptions.toolBoxHistory = $.grep(
              $.bkfsMap.topMenuOptions.toolBoxHistory,
              function(i, d) {
                return i != "jqMpCntlShapeSummaryDiv";
              }
            );
          }
          if (preventEvent != true) {
            $.bkfsMap.toggleUserTabs();
            $.bkfsMap.shapeCountForMenu = 0;
            if ($.bkfsMap.topMenuOptions.showEditShape)
              $.bkfsMap.closeToolBox("fast");
          }
        }
      }
      if (preventEvent != true) {
        var shapeCount = $.bkfsMap.getShapeCount();
        if (shapeCount <= 0) {
          $.bkfsMap.redrawPins([]);
          $.bkfsMap.updateCount();
        }
        $.bkfsMap.shapeCallback();
      }
      $.bkfsMap.currentSelectedId = null;
      if ($.bkfsMap.shapeMenu) $.bkfsMap.toggleShapeMenu(false);
    },
    toggleShapeMenu: function(show) {
      if ($.bkfsMap.shapeMenu) {
        if (show === true) {
          $.bkfsMap.shapeMenu.show();
        } else {
          $.bkfsMap.shapeMenu.hide();
          $.bkfsMap.shapeMenu
            .find("div.jqMpCntlShapeMenuDone")
            .removeClass("jqMpCntlShapeMenuDone")
            .addClass("jqMpCntlShapeMenuEdit");
        }
      }
    },
    setShapeVisibility: function(id, isVisible) {
      var shape = $.bkfsMap.shapeArray[id];
      if (shape) shape.setOptions({ visible: isVisible });
    },
    toggleShapeExclusion: function(entityId, element) {
      var id = entityId.split("_")[1];
      var included = !$.bkfsMap.shapeArray[id].exclude;
      $.bkfsMap.shapeArray[id].exclude = included;
      if ($.bkfsMap.topMenuOptions.showShapeSummary) {
        var descriptElement = $("div#shapeDesc_" + id);
        if (!element)
          element = $(descriptElement)
            .parent()
            .find("div.jqMpCntShapeSummaryImage");
        var sState = "";
        if (included) {
          $(element).data(
            "tooltip",
            "Click to include this shape's area in your search."
          );
          descriptElement.data(
            "tooltip",
            "Click to include this shape's area in your search."
          );
          $(element).addClass("jqMpCntSSumShapeExcluded");
          sState = "Exclude";
        } else {
          $(element).data(
            "tooltip",
            "Click to exclude the shape's area in your search."
          );
          descriptElement.data(
            "tooltip",
            "Click to exclude the shape's area in your search."
          );
          $(element).removeClass("jqMpCntSSumShapeExcluded");
          sState = "Include";
        }
        $(descriptElement)
          .parent()
          .find("div.jqMpCntlShapeState")
          .html(sState);
      }
      if ($.bkfsMap.shapeMenu) {
        var pos = included ? "0px -45px" : "0px -15px";
        $.bkfsMap.shapeMenu
          .find("div.jqMpCntlShapeMenuExclude")
          .css("background-position", pos);
      }
      var shape = $.bkfsMap.shapeArray[id];
      if (!shape) {
        return false;
      }
      var selected = $.bkfsMap.currentSelectedId == id;
      var fill = $.bkfsMap.getFillColor(included, shape.farming);
      var stroke = $.bkfsMap.getLineColor(included, shape.farming);
      if (selected) {
        fill = $.bkfsMap.highlightShapeFillColor;
        if (!included) stroke = $.bkfsMap.highlightShapeLineColor;
      }
      shape.setOptions({
        fillColor: fill,
        strokeColor: stroke
      });
      if ($.bkfsMap.createDrawingHiddenElements) {
        var value = JSON.parse($("#hdnShape" + id).val());
        value.exclude = included;
        if ($.bkfsMap.form == null) {
          $.bkfsMap.form = $("form:first");
        }
        $("#hdnShape" + id).val(JSON.stringify(value));
      }
      var addedMapBoundary = false;
      if (
        included &&
        $.bkfsMap.initializeMapBoundary &&
        !$.bkfsMap.hasShapeIncluded()
      ) {
        $.bkfsMap.toggleMapLock();
        addedMapBoundary = true;
      } else if (!$.bkfsMap.hasShapeIncluded()) {
        $("#jqMpCntlTopMenuActionLockBoundry").removeClass(
          "jqMpCntlTopMenuActionDisabled"
        );
        $("#jqMpCntlTopMenuActionLockBoundry div").data(
          "tooltip",
          $.bkfsMap.lockMapBoundary
        );
      } else {
        $("#jqMpCntlTopMenuActionLockBoundry").addClass(
          "jqMpCntlTopMenuActionDisabled"
        );
        $("#jqMpCntlTopMenuActionLockBoundry div").data(
          "tooltip",
          $.bkfsMap.disabledMapBoundary
        );
        if ($.bkfsMap.mapBoundaryShapeId > -1) {
          $.bkfsMap.deleteShape($.bkfsMap.mapBoundaryShapeId.toString(), true);
        }
      }

      $.bkfsMap.shapeCallback();
      return true;
    },
    editShape: function(shapeId, showInfoMsg) {
      var shape = $.bkfsMap.shapeArray[shapeId];
      var showMsg = typeof showInfoMsg == "undefined" ? true : showInfoMsg;
      if (shape) {
        if (!shape.editable) {
          shape.setOptions({
            editable: true,
            fillColor:
              $.bkfsMap.topMenuOptions.mapLayerCollectionId > 0
                ? shape.fillColor
                : $.bkfsMap.editableFillColor
          });

          if (showMsg) {
            $.bkfsMap.doInfo({
              timeout: 2400,
              position: "bottom-right",
              text: "Close the shape summary dialog to finish editing."
            });
          }
        } else {
          $.bkfsMap.stopEditShape(shape);
        }
      }
    },
    stopEditShape: function(shape) {
      shape.setOptions({
        editable: false,
        fillColor:
          $.bkfsMap.topMenuOptions.mapLayerCollectionId > 0
            ? shape.fillColor
            : $.bkfsMap.getFillColor(shape.exclude, shape.farming),
        strokeColor: $.bkfsMap.getLineColor(shape.exclude, shape.farming)
      });
    },
    resizeMap: function() {
      $.bkfsMap.topMenuOptions.mapContainerHeight = $("#divMap").height();
      if ($.bkfsMap.detailBox) {
        $.bkfsMap.detailBox.height($.bkfsMap.topMenuOptions.mapContainerHeight);
        var height =
          $.bkfsMap.topMenuOptions.mapContainerHeight -
          $.bkfsMap.detailBox.find("div.jqMpCntlDetailBoxIconBar").height();
        $.bkfsMap.detailBox.find("div.jqMpCntlDetailBoxContent").height(height);
        $.bkfsMap.detailBox.find("iframe#jqMpCntDetailFrame").height(height);
      }
    },
    hideAllShapes: function(type) {
      for (var i = 0; i < $.bkfsMap.shapeArray.length; i++) {
        if (
          $.bkfsMap.shapeArray[i] &&
          $.bkfsMap.shapeArray[i].layeritemid == null
        )
          $.bkfsMap.shapeArray[i].setOptions({ visible: false });
      }
      for (var i = 0; i < $.bkfsMap.distanceElements.length; i++) {
        if ($.bkfsMap.distanceElements[i]) {
          var shapeId = $.bkfsMap.distanceElements[i].id.substring(
            0,
            $.bkfsMap.distanceElements[i].id.indexOf("_")
          );

          if (shapeId == "infoWindow") {
            $.bkfsMap.distanceElements[i].close();
          } else {
            $.bkfsMap.distanceElements[i].setOptions({ visible: false });
          }
        }
      }
      $.bkfsMap.shapeVisible = false;
      if ($.bkfsMap.topMenuOptions.showShapeSummary) {
        $("#jqMpCntlShapeShowAll").removeClass("jqMpCntlShapeActionSelected");
        $("#jqMpCntlShapeHideAll").addClass("jqMpCntlShapeActionSelected");
      }
    },
    showAllShapes: function(type) {
      for (var i = 0; i < $.bkfsMap.shapeArray.length; i++) {
        if (
          $.bkfsMap.shapeArray[i] &&
          $.bkfsMap.shapeArray[i].layeritemid == null
        )
          $.bkfsMap.shapeArray[i].setOptions({ visible: true });
      }
      for (var i = 0; i < $.bkfsMap.distanceElements.length; i++) {
        if ($.bkfsMap.distanceElements[i]) {
          var shapeId = $.bkfsMap.distanceElements[i].id.substring(
            0,
            $.bkfsMap.distanceElements[i].id.indexOf("_")
          );

          if (shapeId == "infoWindow") {
            var marker = new google.maps.Marker({
              position: $.bkfsMap.distanceElements[i].position,
              map: $.bkfsMap.divMap,
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 0
              }
            });
            $.bkfsMap.distanceElements[i].open($.bkfsMap.divMap, marker);
          } else {
            $.bkfsMap.distanceElements[i].setOptions({ visible: true });
          }
        }
      }
      $.bkfsMap.shapeVisible = true;
      if ($.bkfsMap.topMenuOptions.showShapeSummary) {
        $("#jqMpCntlShapeHideAll").removeClass("jqMpCntlShapeActionSelected");
        $("#jqMpCntlShapeShowAll").addClass("jqMpCntlShapeActionSelected");
      }
    },
    toggleShapes: function(type) {
      if (
        $.bkfsMap.shapeArray.length > 0 ||
        $.bkfsMap.distanceElements.length > 0
      ) {
        if ($.bkfsMap.shapeVisible) $.bkfsMap.hideAllShapes(type);
        else $.bkfsMap.showAllShapes(type);
      }
    },
    openToolboxActions: function() {
      $.bkfsMap.closeSubMenu();
      $.bkfsMap.toolBoxActionBar.toggle();
    },
    closeToolboxActions: function() {
      if ($.bkfsMap.toolBoxActionBar) $.bkfsMap.toolBoxActionBar.hide();
    },
    printDetail: function() {
      window.frames["jqMpCntDetailFrame"].focus();
      window.frames["jqMpCntDetailFrame"].print();
    }
  });
})(jQuery);
