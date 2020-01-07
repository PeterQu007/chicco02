(function($) {
  if (!$.bkfsMap) $.bkfsMap = {};
  $.extend($.bkfsMap, {
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
    mapTypeChanged: null,
    init: function(options) {
      $.bkfsMap.isFromSearch = options.isFromSearch || $.bkfsMap.isFromSearch;
      $.bkfsMap.addressOptions =
        options.addressOptions || $.bkfsMap.addressOptions;
      if (options.addressInfo) $.bkfsMap.addressInfo = options.addressInfo;
      if (options.bounds || (options.lat && options.lng)) {
        privateInit(options);
      } else {
        $.bkfsMap.getAddress($.bkfsMap.addressInfo, false, function(coord) {
          options.lat = coord.lat();
          options.lng = coord.lng();
          privateInit(options);
        });
      }

      function privateInit(options) {
        var mapTypeId = google.maps.MapTypeId.ROADMAP;
        if (options.mapTypeId == "h") mapTypeId = google.maps.MapTypeId.HYBRID;
        else if (options.mapTypeId == "a")
          mapTypeId = google.maps.MapTypeId.SATELLITE;
        $.bkfsMap.mapDiv = $("#divMap");
        $.bkfsMap.divMap = new google.maps.Map($.bkfsMap.mapDiv[0], {
          zoom: options.zoom,
          center: options.bounds
            ? options.bounds.getCenter()
            : { lat: options.lat, lng: options.lng },
          gestureHandling: "greedy",
          mapTypeControl: false,
          mapTypeId: mapTypeId,
          fullscreenControl: false
        });
        if (options.bounds) {
          $.bkfsMap.divMap.fitBounds(options.bounds);
        }
        $.bkfsMap.iconBasePath = options.iconBasePath;
        $.bkfsMap.infoWindow = new google.maps.InfoWindow();
        if ($.isFunction(options.resizeMapItem))
          $.bkfsMap.resizeMapItem = options.resizeMapItem;

        $.bkfsMap.showCenterImage =
          options.showCenterImage != null ? options.showCenterImage : true;
        if ($.bkfsMap.showCenterImage) {
          var center = $.bkfsMap.divMap.getCenter();
          $.bkfsMap.setCenterImage({ lat: center.lat(), lng: center.lng() });
        }
        if ($.isFunction(options.mapLoaded)) {
          options.mapLoaded();
        }
        $.bkfsMap.zoomChg = options.zoomChanged;
        $.bkfsMap.divMap.addListener("bounds_changed", function() {
          if (!$.bkfsMap.draggingMeasure) {
            $.bkfsMap.currentMapBounds = $.bkfsMap.divMap.getBounds();
          }
        });
        $.bkfsMap.divMap.addListener("zoom_changed", function() {
          $.bkfsMap.zoomChanged();
        });
        if ($.isFunction(options.centerChanged)) {
          $.bkfsMap.divMap.addListener("center_changed", options.centerChanged);
        }
        $.bkfsMap.dragEnd = options.dragEnd;
        $.bkfsMap.divMap.addListener("dragstart", function() {
          $.bkfsMap.dragStarted();
        });
        $.bkfsMap.divMap.addListener("dragend", function() {
          $.bkfsMap.dragEnded();
        });
      }
    },
    setMapType: function(mapTypeId) {
      $.bkfsMap.divMap.setMapTypeId(mapTypeId);
      $("#jqMpCntlTopMenuActionMapType div.jqMpCntlSubMenuButton").removeClass(
        "jqMpCntlSubMenuMapTypeSelected"
      );
      var mapTypeLabel = "";
      switch (mapTypeId) {
        case "roadmap":
          mapTypeLabel = "Road";
          $("#jqMpCntlTopMenuActionMapType div.jqMpCntlSubMenuMpTypeRoad")
            .parent()
            .addClass("jqMpCntlSubMenuMapTypeSelected");
          break;
        case "satellite":
          mapTypeLabel = "Aerial";
          $("#jqMpCntlTopMenuActionMapType div.jqMpCntlSubMenuMpTypeAerial")
            .parent()
            .addClass("jqMpCntlSubMenuMapTypeSelected");
          break;
        case "hybrid":
          mapTypeLabel = "Hybrid";
          $("#jqMpCntlTopMenuActionMapType div.jqMpCntlSubMenuMpTypeLabels")
            .parent()
            .addClass("jqMpCntlSubMenuMapTypeSelected");
          break;
      }
      if ($.bkfsMap.topMenuOptions.useDynamicMapTypeLabel) {
        $("div.jqMpCntlMapTypeLabel").text(mapTypeLabel);
      }
      if ($.isFunction($.bkfsMap.mapTypeChanged)) {
        $.bkfsMap.mapTypeChanged();
      }
    },
    getMapType: function() {
      return $.bkfsMap.divMap.getMapTypeId();
    },
    doAlert: function(options) {
      $.jGrowl.defaults.position = options.position || "bottom-right";
      $.jGrowl.defaults.glue = "before";
      var target = window;
      if (options.noAlerts != true) {
        if (options.menuType == "context")
          target = options.contextMenuContainer;
        target.$.jGrowl(options.text, {
          speed: "slow",
          life: options.timeout || 1500
        });
      }
      if (options.instruct) $.bkfsMap.instruct(options.text);
    },
    doInfo: function(options, e) {
      $.jGrowl.defaults.position = options.position || "bottom-right";
      $.jGrowl.defaults.glue = "before";
      var target = window;
      if (options.noAlerts != true) {
        if (options.menuType == "context")
          target = options.jqm.contextMenuContainer;
        target.$.jGrowl(options.text, {
          speed: "slow",
          life: options.timeout || 1500,
          header: "INFO",
          group: "jgrowl-info"
        });
      }
      if (options.instruct) $.bkfsMap.instruct(options.text);
    },
    getAddressData: function() {
      return { address: "", city: "", state: "", zip: "" };
    },
    centerMap: function(latLng, zoom) {
      $.bkfsMap.divMap.setCenter(latLng);
      if (zoom) $.bkfsMap.divMap.setZoom(zoom);
    },
    getAddress: function(address, doCenter, callBack) {
      var addressIsString = typeof address === "string";
      var addressStr;
      if (!addressIsString) {
        addressStr =
          address.address +
          " " +
          address.city +
          ", " +
          address.state +
          " " +
          address.zip;
      } else {
        addressStr = address;
      }
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: addressStr }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (results && results.length > 0) {
            $.bkfsMap.addressInfo = results[0].formatted_address;
            var coord = results[0].geometry.location;
            if (doCenter || doCenter === undefined) {
              $.bkfsMap.setCenter({ lat: coord.lat(), lng: coord.lng() });
            }
            $.bkfsMap.noAddressResults = "";

            if ($.isFunction(callBack)) {
              callBack.call(this, coord, address);
            }
            $.bkfsMap.afterFindAddress({ latLng: coord });
          } else {
            $.bkfsMap.noAddressResults =
              "No results found for address. Try reviewing your address preferences.";
          }
          if ($.bkfsMap.noAddressResults.length > 0)
            $.bkfsMap.doAlert({
              text: $.bkfsMap.noAddressResults,
              timeout: 3000
            });
        } else if (!addressIsString) {
          addressStr = address.city + ", " + address.state + " " + address.zip;
          $.bkfsMap.getAddress(addressStr, doCenter, callBack);
        } else {
          if ($.isFunction(callBack)) {
            callBack.call(
              this,
              {
                lat: function() {
                  return 0;
                },
                lng: function() {
                  return 0;
                }
              },
              address
            );
          }
          $.bkfsMap.doAlert({ text: "Geocoding failed: " + status });
        }
      });
    },
    setCenter: function(location) {
      $.bkfsMap.divMap.setCenter(location);
      if ($.bkfsMap.showCenterImage) {
        var center = $.bkfsMap.divMap.getCenter();
        $.bkfsMap.setCenterImage({ lat: center.lat(), lng: center.lng() });
      }
    },
    setCenterImage: function(location) {
      if (location) {
        if (!$.bkfsMap.pinHome) {
          $.bkfsMap.pinHome = new google.maps.Marker({
            position: { lat: location.lat, lng: location.lng },
            map: $.bkfsMap.divMap,
            icon: {
              url: $.bkfsMap.iconBasePath.replace("/user/", "/") + "start.png",
              origin: new google.maps.Point(0, 0),
              size: new google.maps.Size(16, 16)
            },
            draggable: $.bkfsMap.locatorDraggable
          });
          if ($.bkfsMap.showLocator) {
            $.bkfsMap.pinHome.setOptions({
              icon: $.bkfsMap.iconBasePath + "pin_194.png"
            });
            google.maps.event.addListener(
              $.bkfsMap.pinHome,
              "dragend",
              $.bkfsMap.pushpinMoved
            );
          }
        } else {
          $.bkfsMap.pinHome.setOptions({
            position: { lat: location.lat, lng: location.lng }
          });
        }
      }
    },
    getDistance: function(location1, location2, useKm) {
      var p1Lat = latLongToRadians(location1.latitude);
      var p1Lon = latLongToRadians(location1.longitude);
      var p2Lat = latLongToRadians(location2.latitude);
      var p2Lon = latLongToRadians(location2.longitude);
      var earthMean = 6371; // earth's mean radius in km
      var dLat = p2Lat - p1Lat;
      var dLong = p2Lon - p1Lon;
      var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(p1Lat) *
          Math.cos(p2Lat) *
          Math.sin(dLong / 2) *
          Math.sin(dLong / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var disKm = earthMean * c;
      return useKm ? disKm : disKm * 0.6214;

      function latLongToRadians(point) {
        return (point * Math.PI) / 180;
      }
    },
    zoomChanged: function() {
      if ($.isFunction($.bkfsMap.zoomChg)) {
        $.bkfsMap.divMap.addListener("zoom_changed", function() {
          $.bkfsMap.zoomChg();
        });
      }
      if (
        $.bkfsMap.currentLayerOption > 0 &&
        $.bkfsMap.previousZoom != $.bkfsMap.divMap.getZoom()
      )
        $.bkfsMap.checkIfLayerIsValid(false);
      $.bkfsMap.previousZoom = $.bkfsMap.divMap.getZoom();

      if (
        $.bkfsMap.mapLocked &&
        !$.bkfsMap.isDrawingShape &&
        !$.bkfsMap.isReportView &&
        !$.bkfsMap.hasShapeIncluded()
      ) {
        $.bkfsMap.mapBoundaryMovementCount++;
        setTimeout(function() {
          $.bkfsMap.tryToggleMapLock();
        }, 2000);
      }
    },
    tryToggleMapLock: function() {
      if ($.bkfsMap.mapBoundaryMovementCount == 1) {
        $.bkfsMap.deleteShape($.bkfsMap.mapBoundaryShapeId.toString(), true);
        $.bkfsMap.toggleMapLock();
      }
      $.bkfsMap.mapBoundaryMovementCount--;
    },
    dragStarted: function() {
      if ($.bkfsMap.mapLocked && !$.bkfsMap.isDrawingShape) {
        $.bkfsMap.mapBoundaryMovementCount++;
      }
    },
    dragEnded: function() {
      if ($.bkfsMap.mapLocked && !$.bkfsMap.isDrawingShape) {
        setTimeout(function() {
          $.bkfsMap.tryToggleMapLock();
        }, 2000);
      }
    }
  });
})(jQuery);
