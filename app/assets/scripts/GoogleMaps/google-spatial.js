(function ($) {
    if (!$.bkfsMap)
        $.bkfsMap = {};
    $.extend($.bkfsMap, {
        spatialStreamKey: null,
        descriptionDiv: null,
        layerConnect: 'SS',
        layerOptions: [],
        customLayerOptions: [],
        excludeLayers: [],
        layerCheckBoxCheckedClass: 'jqMpCntlLayerCheckBoxChecked',
        selectedLayerClass: 'jqMpCntlLayerItemSelected',
        $layersPanel: null,
        $customLayersPanel: null,
        parcelLayers: [],
        selectedLayerOptions: [],
        interactionActive: false,
        parcelClickAllowed: false,
        selectionMode: null,
        trafficLayer: null,
        trafficLayerShown: false,
        clickableLayers: ['ParcelLines'],
        layerValue: null,
        parcelInfobox: {
            active: false,
            container: null,
            id: "parcelInfobox",
            title: null,
            body: null,
            htmlContent: null,
            labelArray: [],
            dataArray: [],
            height: 126,
            width: 256,
            iconBar: null,
            titleAction: null,
            titleClickHandler: null,
            visible: false,
            arrowLeft: null,
            arrowRight: null,
            arrowUp: null,
            arrowDown: null
        },
        spatialInit: function(options) {
            $.bkfsMap.layerOptions = options.layerOptions || $.bkfsMap.layerOptions;
            $.bkfsMap.customLayerOptions = options.customLayerOptions || $.bkfsMap.customLayerOptions;
            $.bkfsMap.spatialStreamKey = options.spatialStreamKey || $.bkfsMap.spatialStreamKey;
            $.bkfsMap.allowInteractiveLayer = options.allowInteractiveLayer || $.bkfsMap.allowInteractiveLayer;
            $.bkfsMap.layerValue = options.layerValue || $.bkfsMap.layerValue;
            $.bkfsMap.initDataLayer();
        },
        initDataLayer: function () {
            if ($.bkfsMap.spatialStreamKey) {
                $.bkfsMap.layerLoaded = true;
                Dmp.HostName = window.location.protocol + "//parcelstream.com/";
                Dmp.Env.Connections[$.bkfsMap.layerConnect] = new Dmp.Conn.Connection(Dmp.HostName + "InitSession.aspx");
                Dmp.Env.Connections[$.bkfsMap.layerConnect].init($.bkfsMap.spatialStreamKey,
                    function () {
                        $.bkfsMap.initLayers();
                    },
                    function (e) {
                        $.bkfsMap.doAlert({ text: e.targetType, log: true });
                    });
                $.bkfsMap.setupParcelColors();
            }
        },
        initLayers: function () {
            $.each($.bkfsMap.layerOptions, function (keyname, layerOpt) {
                if (layerOpt.name) {
                    var layer = {};
                    layer.lines = null;
                    layer.labels = null;
                    if (layerOpt.resourceName && layerOpt.resourceName.indexOf('DFIRMTiles') > 0) {
                        layerOpt.resourceName = layerOpt.resourceName.replace('DFIRMTiles', 'DFIRM');
                    }
                    if (layerOpt.id == 'ParcelLines') {
                        $.bkfsMap.parcelLineLayerId = layerOpt.value;
                        $.bkfsMap.parcelLineLayerMeanZoom = layerOpt.minZoom + 1;
                    }
                    layerOpt.resourceName = layerOpt.resourceName.replace('ParcelTiles', 'Parcels');
                    var useTileLayer = false;
                    var tempResourceName = layerOpt.resourceName;
                    if (layerOpt.id == 'ParcelLines') {
                        $.bkfsMap.parcelLabelLayerId = layerOpt.value;
                    }
                    else if (layerOpt.id == 'Parcels') {
                        tempResourceName = layerOpt.resourceName + 'label';
                    } else if (layerOpt.id == 'Flood') {
                        useTileLayer = true;
                    }

                    if (useTileLayer) {
                        layer.lines = new Dmp.Layer.TileLayer($.bkfsMap.layerConnect, layerOpt.resourceName);
                    } else {
                        layer.lines = new Dmp.Layer.WmsLayer(layerOpt.resourceName, $.bkfsMap.layerConnect);
                    }
                    if (layerOpt.labelData != null && layerOpt.labelData != '') {
                        layer.labels = new Dmp.Layer.WmsLayer(layerOpt.resourceName + 'label', $.bkfsMap.layerConnect);
                    }

                    if (layerOpt.legend) {
                        var scr = layerOpt.id == 'Flood' ?
                            Dmp.Env.Connections[$.bkfsMap.layerConnect].getBaseUrl() +
                            "GetFile.aspx?file=SS.FEMA.DFIRM.Styles.DFIRM/TileLegend.png&SS_CANDY=" + Dmp.Env.Connections[$.bkfsMap.layerConnect]._candy :
                            Dmp.Env.Connections[$.bkfsMap.layerConnect].getBaseUrl() +
                            "Legend.aspx?layer=" + layerOpt.resourceName + "&sld=" + layerOpt.style +
                            "&ver=" + new Date().getTime();

                        $('div#jqMpCntl' + layerOpt.name + 'Legend').html("<img src='" + scr + "' />");
                    }
                    if ($.isFunction(layer.lines.addChild)) {
                        layer.lines.addChild(layerOpt.id, layerOpt.resourceName, layerOpt.style, { zIndex: layerOpt.zIndex, zoomRange: { min: layerOpt.minZoom, max: layerOpt.maxZoom } });
                        if (layer.labels != null) {
                            var resource = !layerOpt.altResource ? layerOpt.resourceName : layerOpt.altResource;
                            layer.labels.addChild(layerOpt.id, resource, layerOpt.labelData, { zIndex: layerOpt.zIndex + 1, zoomRange: { min: layerOpt.minZoom, max: layerOpt.maxZoom } });
                        }
                    }
                    layer.clickable = false;
                    if ($.isArray($.bkfsMap.clickableLayers)
                        && $.inArray(layerOpt.id, $.bkfsMap.clickableLayers) >= 0)
                        layer.clickable = true;
                    layerOpt.parcelIndex = $.bkfsMap.parcelLayers.length;
                    $.bkfsMap.parcelLayers.push(layer);
                }
                if (layerOpt.type == "BingTraffic") {
                    $.bkfsMap.trafficLayerValue = layerOpt.value;
                }
            });
            if ($.bkfsMap.layerValue > 0) {
                var box = $('div.jqMpCntlLayerItem[rel=' + $.bkfsMap.layerValue + '] div.jqMpCntlLayerCheckBox');
                $.bkfsMap.toggleLayerCheckBox(box, false);
            }
            if ($.bkfsMap.parcelLineLayerId != null)
                $('div.jqMpCntlIconBarFarmLite').show();
            if ($.bkfsMap.topMenuOptions.menuType == 'context') {
                $.bkfsMap.changeLayerOption($.bkfsMap.layerValue);
            }
        },
        setupParcelColors: function () {
            $.bkfsMap.parcelSelectFillColor = '#034D59';
            $.bkfsMap.parcelSelectLineColor = '#5198DE';
            $.bkfsMap.parcelSelectLineThickness = 2;

            $.bkfsMap.parcelHighLightFillColor = '#F6E144';
            $.bkfsMap.parcelHighLightLineColor = '#FFC900';
            $.bkfsMap.parcelHighLightLineThickness = 3;
        },
        toggleLayerCheckBox: function (box, showMessage = true) {
            if (box.hasClass($.bkfsMap.layerCheckBoxCheckedClass)) {
                $.bkfsMap.uncheckLayerCheckBox(box);
                if (box.parent().hasClass($.bkfsMap.selectedLayerClass))
                    $.bkfsMap.unselectActiveLayer(box.parent());
            } else {
                $.bkfsMap.checkLayerCheckBox(box);
                $.bkfsMap.selectActiveLayer(box.parent());
            }
            $.bkfsMap.selectedLayersChanged = true;
            $.bkfsMap.toggleLayerItem.call($.bkfsMap, null, showMessage);
        },
        checkLayerCheckBox: function (box) {
            $.bkfsMap.currentLayerOption = box.parent().data('displaylayer');
            box.parent().find('div.jqMpCntlLayerLegendsIcon').show();
            var slider = box.parent().children(':last');
            box.addClass($.bkfsMap.layerCheckBoxCheckedClass);
            slider.show();
            $.bkfsMap.addSelectedLayerOption($.bkfsMap.currentLayerOption);
        },
        uncheckLayerCheckBox: function (box) {
            var id = box.parent().data('displaylayer');
			box.removeClass($.bkfsMap.layerCheckBoxCheckedClass);
			box.parent().find('div.jqMpCntlCheckSlider').removeClass('jqMpCntlCheckSliderChecked');
	        box.parent().find('div.jqMpCntlLayerMagnify').hide();
            box.parent().find('div.jqMpCntlLayerLegendsIcon').hide();
            $.bkfsMap.removeSelectedLayerOption(id);
            if (id != $.bkfsMap.trafficLayerValue)
                $.bkfsMap.currentLayerOption = 0;
        },
        toggleLayerItem: function (layerId, showMessage = true) {
            if (typeof (layerId) != 'undefined' && layerId != null)
                $.bkfsMap.currentLayerOption = layerId;

            var layerOption = $.bkfsMap.getLayerOption($.bkfsMap.currentLayerOption);
            if (layerOption != null && layerOption.type == 'BingTraffic') {
                if ($.bkfsMap.trafficLayer == null)
                    $.bkfsMap.trafficLayer = new google.maps.TrafficLayer();
                if ($.bkfsMap.trafficLayerShown)
                    $.bkfsMap.trafficLayer.setMap(null);
                else
                    $.bkfsMap.trafficLayer.setMap($.bkfsMap.divMap);
                $.bkfsMap.trafficLayerShown = !$.bkfsMap.trafficLayerShown;
            } else {
                $.bkfsMap.checkIfLayerIsValid(showMessage);
            }
        },
        clearAllLayers: function (keep, resetMenu) {
            if (resetMenu) {
                $('div.jqMpCntlLayerCheckBox').removeClass('jqMpCntlLayerCheckBoxChecked');
                $('div.jqMpCntlCheckSlider').hide();
                $('div.jqMpCntlLayerMagnify').hide();
                $('div.jqMpCntlLayerLegendsIcon').hide();
                $('div.jqMpCntlLayerItem').removeClass($.bkfsMap.selectedLayerClass);
                $('div.jqMpCntlLayerActive').removeClass($.bkfsMap.activeLayerClass);
                $.bkfsMap.selectedLayerOptions = [];
            }
            for (var idxLayer = 0; idxLayer < $.bkfsMap.parcelLayers.length; idxLayer++) {
                var layer = $.bkfsMap.parcelLayers[idxLayer];
                if (layer.lines != null && layer.lines._map != null)
                    layer.lines.setMap(null);
                if (layer.labels != null && layer.labels._map != null)
                    layer.labels.setMap(null);
            }
            $.bkfsMap.interactionActive = false;
            if ($.bkfsMap.layerLoaded && $.bkfsMap.divMap.overlayMapTypes) {
                for (var i = $.bkfsMap.divMap.overlayMapTypes.length - 1; i >= 0; i--) {
                    var overlay = $.bkfsMap.divMap.overlayMapTypes.getAt(i);
                    if (overlay.alt == keep)
                        continue;
                    $.bkfsMap.divMap.overlayMapTypes.removeAt(i);
                }
            }
        },
        buildLayerPanel: function () {
            $.bkfsMap.$customLayersPanel = $('<div class="jqMpCntTabs"></div>');
            $.bkfsMap.$layersPanel = $('<div class="jqMpCntTabs"></div>');
            var mapContent = $('<div id="jqMpCntMapLayers" ></div>').appendTo($.bkfsMap.$layersPanel)
                .append('<div class="jqMpCntlLayersHeader" >' +
                    '<div class="jqMpCntlLayersCollumnHeader" >' +
                    '<div class="jqMpCntlLayersLeftCollumn" >Display Layer</div>' +
                    '<div class="jqMpCntlLayersRightCollumn" >Show Labels</div></div></div>');
            var layerScroll = $('<div class="jqMpCntlLayersScroll"></div>');

            var mapCustomContent = "";
            if ($.bkfsMap.customLayerOptions.length > 0) {
                mapCustomContent = $('<div id="jqMpCntCustomMapLayers" ></div>').appendTo($.bkfsMap.$customLayersPanel)
                    .append('<div class="jqMpCntlLayersHeader" >' +
                        '<div class="jqMpCntlLayersCollumnHeader" >' +
                        '<div class="jqMpCntlLayersLeftCollumn" >Display Interactive Layer</div>' +
                        '<div class="jqMpCntlLayersRightCollumn" >Show Labels</div></div></div>');
                var customLayerScroll = $('<div class="jqMpCntlLayersScroll"></div>');
                $.each($.bkfsMap.customLayerOptions, function (keyName, layerOpt) {
                    var idOption = "";
                    var labelsOn = '';
                    var ownerLevel = layerOpt.OwnerLevel == 4 ? mlsReportIconClass : layerOpt.OwnerLevel == 1 ? "Agent" : layerOpt.OwnerLevel == 2 ? "Office" : "Board";
                    idOption = $('<div class="jqMpCntlCheckSlider ' + labelsOn + '" groupId="' + layerOpt.ID + '" rel="' + layerOpt.Name + '"  ></div>')
                        .click(function (e) { e.stopPropagation(); $.bkfsMap.toggleCustomLayerSlider.call(e, $(this)) });
                    var bottomPadding = layerOpt.Name.length > 29 ? 10 : 0;
                    var lineItem = $('<div groupId="customLayer" style="float: left;padding-bottom: ' + bottomPadding + 'px;padding-left: 17px;" collId="' + layerOpt.Id + '" geoJsonPath="' + layerOpt.GeoJsonPath + '" rel="' + layerOpt.Name + '" data-displaylayer="' + layerOpt.Name + '" class=" jqMpCntlLayerItem" ></div>')
                        .appendTo(customLayerScroll)
                        .append($('<div class="jqMpCntlLayer' + ownerLevel + '"></div>'))
                        .append($('<div class="jqMpCntlLayerCheckBox" ></div>')
                            .click(function (e) { e.stopPropagation(); $.bkfsMap.toggleCustomLayerCheckBox.call($.bkfsMap, $(e.target)); }))
                        .append($('<div class="jqMpCntlLayerItemDesc jqMpCntlCustomLayerItemDesc" >' + layerOpt.Name + '</div>')
                            .click(function (e) { e.stopPropagation(); $.bkfsMap.toggleCustomLayerActive.call($.bkfsMap, $(e.target)); }));
                    lineItem.append(idOption);
                    if (keyName < $.bkfsMap.customLayerOptions.length) {
                        customLayerScroll.append('<div id="layerItems' + layerOpt.Id + '" style="width:95%"></div>');
                        customLayerScroll.append('<div style="float: left;margin-left:10px;" class="jqMpCntlLayersSeparator"></div>');
                    }
                });
                mapCustomContent.append(customLayerScroll);
            }

            $.each($.bkfsMap.layerOptions, function (keyName, layerOpt) {
                if (!layerOpt.hide) {
                    var idOption = "";
                    if (layerOpt.labelData != null && layerOpt.labelData != "") {
                        var labelsOn = layerOpt.labelsOn ? 'jqMpCntlCheckSliderChecked' : '';
                        idOption = $('<div class="jqMpCntlCheckSlider ' + labelsOn + '" groupId="' + layerOpt.group + '" rel="' + layerOpt.value + '"  ></div>')
                            .click(function (e) { e.stopPropagation(); $.bkfsMap.toggleSlider.call(e, $(this)) });
                    }
                    if (layerOpt.id == 'ParcelLines') {
                        $.bkfsMap.parcelLineDescText = layerOpt.text;
                    }
                    var lineItem = $('<div groupId="' + layerOpt.group + '" rel="' + layerOpt.value + '" data-displaylayer="' + layerOpt.value + '" class=" jqMpCntlLayerItem" ></div>')
                        .appendTo(layerScroll)
                        .append($('<div class="jqMpCntlLayerActive" ></div>'))
                        .append($('<div class="jqMpCntlLayerCheckBox" ></div>')
                            .click(function (e) { e.stopPropagation(); $.bkfsMap.toggleLayerCheckBox.call($.bkfsMap, $(e.target)); }))
                        .append($('<div class="jqMpCntlLayerItemDesc" >' + layerOpt.text + '</div>')
                            .click(function (e) { e.stopPropagation(); $.bkfsMap.toggleLayerActive.call($.bkfsMap, $(e.target)); })
                            .append($('<div style="display: none;" class="jqMpCntlLayerMagnify" ><div class="jqMpCntlMagnifyIcon" ></div></div>')
                                .click(function (e) { e.stopPropagation(); $.bkfsMap.zoomLayerToView.call($.bkfsMap, e); })));


                    if (layerOpt.legend) {
                        lineItem.append($('<div class="jqMpCntlLayerLegendsIcon" rel="' + layerOpt.id + '" ></div>')
                            .click(function (e) { e.stopPropagation(); $.bkfsMap.toggleLayerLegend.call($.bkfsMap, $(e.target)); }));
                    }
                    lineItem.append(idOption);
                    if (layerOpt.legend) {
                        layerScroll.append($('<div class="jqMpCntlLegendContainer" id="jqMpCntl' + layerOpt.id + 'Legend" rel="' + layerOpt.id + '" >No legend available.</div>'));
                    }
                    if (keyName < $.bkfsMap.layerOptions.length) {
                        layerScroll.append('<div class="jqMpCntlLayersSeparator"></div>');
                    }
                }
            });
            mapContent.append(layerScroll);
            mapContent.append("<br/><br/>");
        },
        toggleCustomLayerSlider: function (slider) {
            var collId = slider.parent().attr('collId');
            var id = 'divInfoBox' + collId + '_';
            if (slider.hasClass('jqMpCntlCheckSliderChecked')) {
                slider.removeClass('jqMpCntlCheckSliderChecked');
                slider.parent().data('displaylayer', slider.parent().attr('rel'));
                $("div[id^='" + id + "']").hide();
            } else {
                if (!slider.parent().hasClass($.bkfsMap.selectedLayerClass)) {
                    var layerOption = slider.parent();
                    var checkBox = layerOption.find('div.jqMpCntlLayerCheckBox');
                    $.bkfsMap.descriptionDiv = checkBox;
                    checkBox.click();
                }
                else {
                    slider.addClass('jqMpCntlCheckSliderChecked');
                    $("div[id^='" + id + "']").show();
                }
            }
        },
        toggleSlider: function (slider) {
            if (slider.hasClass('jqMpCntlCheckSliderChecked')) {
                slider.removeClass('jqMpCntlCheckSliderChecked');
                slider.parent().data('displaylayer', slider.parent().attr('rel'));
            } else {
                slider.addClass('jqMpCntlCheckSliderChecked');
                slider.parent().data('displaylayer', slider.attr('rel'));
                if (!slider.parent().hasClass($.bkfsMap.selectedLayerClass))
                    $.bkfsMap.selectActiveLayer(slider.parent());
            }

            $.bkfsMap.currentLayerOption = slider.parent().data('displaylayer');
            var layerOption = $.bkfsMap.getLayerOption($.bkfsMap.currentLayerOption);
            $.bkfsMap.addSelectedLayerOption($.bkfsMap.currentLayerOption);
            $.bkfsMap.layerMinZoom = layerOption.minZoom;
            $.bkfsMap.layerMaxZoom = layerOption.maxZoom;
            $.bkfsMap.selectedLayersChanged = true;
            $.bkfsMap.checkIfLayerIsValid(true);
        },
        removeSelectedLayerOption: function (id) {
            if ($.inArray(id, $.bkfsMap.selectedLayerOptions) > -1) {
                $.bkfsMap.selectedLayerOptions = $.grep($.bkfsMap.selectedLayerOptions, function (value) {
                    return value != id;
                });
            }
            $.bkfsMap.selectedLayerCount($.bkfsMap.selectedLayerOptions.length);
        },
        selectActiveLayer: function (layerOption) {
            var groupId = layerOption.attr('groupId');
            var $layerGroup = $('div.jqMpCntlLayerItem[groupId=' + groupId + ']');
            $layerGroup.removeClass($.bkfsMap.selectedLayerClass).addClass("");
            $('div.jqMpCntlLayerActive').removeClass($.bkfsMap.activeLayerClass);
            layerOption.addClass($.bkfsMap.selectedLayerClass);
            layerOption.find('div.jqMpCntlLayerActive').addClass($.bkfsMap.activeLayerClass);
            $.bkfsMap.currentLayerOption = layerOption.data('displaylayer');
            if (!layerOption.find('div.jqMpCntlLayerCheckBox').hasClass('jqMpCntlLayerCheckBoxChecked'))
                $.bkfsMap.checkLayerCheckBox(layerOption.find('div.jqMpCntlLayerCheckBox'));
            var id = parseInt(layerOption.attr('rel'), 10);
            if (id == $.bkfsMap.parcelLineLayerId || id == $.bkfsMap.parcelLabelLayerId) {
                $.bkfsMap.interactionActive = true;
                $.bkfsMap.parcelClickAllowed = true;
            }
        },
        unselectActiveLayer: function (layerOption) {
            layerOption.removeClass($.bkfsMap.selectedLayerClass).addClass("");
            layerOption.find('div.jqMpCntlLayerActive').removeClass($.bkfsMap.activeLayerClass);
            var id = parseInt(layerOption.attr('rel'), 10);
            if (id == $.bkfsMap.parcelLineLayerId || id == $.bkfsMap.parcelLabelLayerId) {
                $.bkfsMap.interactionActive = false;
                $.bkfsMap.parcelClickAllowed = false;
            }
        },
        addSelectedLayerOption: function (id) {
            if ($.inArray(id, $.bkfsMap.selectedLayerOptions) == -1)
                $.bkfsMap.selectedLayerOptions.push(id);
            $.bkfsMap.selectedLayerCount($.bkfsMap.selectedLayerOptions.length);
        },
        selectedLayerCount: function(count) {
            $('#divSelectedLayerCount').text(count);
            if (count > 0) {
                $('#divSelectedLayerCount').show();
            } else {
                $('#divSelectedLayerCount').hide();
            }
        },
        getLayerOption: function (layerId) {
            if (layerId == 0)
                return null;
            var layer = null;
            $.each($.bkfsMap.layerOptions, function (keyName, layerOpt) {
                if (layerOpt.value == layerId) {
                    layer = layerOpt;
                } else if (layerOpt.labelData && typeof (layerOpt.labelData) === 'object' && layerOpt.labelData.value == layerId) {
                    layer = layerOpt.labelData;
                }
            });
            return layer;
        },
        getLayerOptionByName: function (name) {
            var layer = null;
            $.each($.bkfsMap.layerOptions, function (keyName, layerOpt) {
                if (layerOpt.name == name) {
                    layer = layerOpt;
                }
            });
            return layer;
        },
        checkIfLayerIsValid: function (showMessage) {
            if ($.bkfsMap.currentLayerOption >= '0' && $.bkfsMap.currentLayerOption != null) {
                var newZoom = $.bkfsMap.divMap.getZoom();
                var disable = false;
                var message = '';
                if ($.bkfsMap.currentLayerOption > '0') {
                    var layerOpts = $.bkfsMap.getLayerOption($.bkfsMap.currentLayerOption);
                    var id = layerOpts.value;
                    if ($.isArray(layerOpts.addIds))
                        id = $.bkfsMap.getLayerOptionByName(layerOpts.addIds[0]).value;
                    if (newZoom > layerOpts.maxZoom || newZoom < layerOpts.minZoom) {
                        message = 'Layers are not available at this zoom level. Click on the Magnifying glass to see layer.';
                        disable = true;
                        if (id == $.bkfsMap.parcelLineLayerId)
                            $.bkfsMap.interactionActive = false;
                        $('div.jqMpCntlLayerItem[data-displaylayer=' + id + ']').find('div.jqMpCntlLayerMagnify').show();
                    } else {
                        if (id == $.bkfsMap.parcelLineLayerId)
                            $.bkfsMap.interactionActive = true;
                        $('div.jqMpCntlLayerItem[data-displaylayer=' + id + ']').find('div.jqMpCntlLayerMagnify').hide();
                    }
                }
                if ($.bkfsMap.selectedLayerOptions.length > 0) {
                    for (var i = 0; i < $.bkfsMap.selectedLayerOptions.length; i++) {
                        var value = $.bkfsMap.selectedLayerOptions[i];
                        var layerOpt = $.bkfsMap.getLayerOption(value);
                        if (layerOpt && (newZoom > layerOpt.maxZoom || newZoom < layerOpt.minZoom))
                            $('div.jqMpCntlLayerItem[data-displaylayer=' + value + ']').find('div.jqMpCntlLayerMagnify').show();
                    }
                }
                if ($.bkfsMap.parcelLineLayerId == $.bkfsMap.currentLayerOption || $.bkfsMap.parcelLabelLayerId == $.bkfsMap.currentLayerOption) {
                    if ($.bkfsMap.parcelClickAllowed)
                        $('li#jqMpCntlTopMenuActionDrawSelector').removeClass('jqMpCntlTopMenuActionDisabled');
                } else {
                    $.bkfsMap.endFarming();
                    $.bkfsMap.closeSubMenu();
                }

                if (disable) {
                    if (showMessage && message.length > 0) {
                        $.bkfsMap.doAlert({ text: message, log: true });
                    }
                    if (!$('li#jqMpCntlTopMenuActionDrawSelector').hasClass('jqMpCntlTopMenuActionDisabled')) {
                        $('li#jqMpCntlTopMenuActionDrawSelector').addClass('jqMpCntlTopMenuActionDisabled');
                    }
                }
                else if ($.bkfsMap.selectedLayersChanged) {
                    $.bkfsMap.changeLayerOption($.bkfsMap.currentLayerOption);
                }
            }
        },
        changeLayerOption: function (layerId) {
            if ($.bkfsMap.parcelInteractionLayer != null) {
                $.bkfsMap.parcelInteractionLayer.clear();
            }
            if ($.isFunction($.bkfsMap.clearParcelDimensions))
                $.bkfsMap.clearParcelDimensions();
            if (!$.bkfsMap.layerLoaded) {
                $.bkfsMap.initDataLayer(layerId);
            }
            else {
                $.bkfsMap.clearAllLayers('drivetime', false);
                if ($.bkfsMap.selectedLayerOptions.length > 0) {
                    for (var l = 0; l < $.bkfsMap.selectedLayerOptions.length; l++) {
                        var visibleId = $.bkfsMap.selectedLayerOptions[l];
                        if (visibleId != layerId)
                            $.bkfsMap.AddMapLayer(visibleId, false);
                    }
                    if (layerId > 0)
                        $.bkfsMap.AddMapLayer(layerId, true);
                }
                else {
                    $.bkfsMap.currentLayerOption = 0;
                }
                if ((layerId == $.bkfsMap.parcelLineLayerId || layerId == $.bkfsMap.parcelLabelLayerId) && $.bkfsMap.currentLayerOption != 0) {
                    $('li#jqMpCntlTopMenuActionDrawSelector').removeClass('jqMpCntlTopMenuActionDisabled');
                }
                else if (!$('li#jqMpCntlTopMenuActionDrawSelector').hasClass('jqMpCntlTopMenuActionDisabled')) {
                    $('li#jqMpCntlTopMenuActionDrawSelector').addClass('jqMpCntlTopMenuActionDisabled');
                }
            }
            $.bkfsMap.previousLayerOption = layerId;
            $.bkfsMap.selectedLayersChanged = false;
        },
        zoomLayerToView: function (e, id) {
            var layerId = id || $(e.target).parent().parent().parent().data('displaylayer');
            if (!layerId) {
                return false;
            }
            var layerOpts = $.bkfsMap.getLayerOption(layerId);
            var currentZoom = $.bkfsMap.divMap.getZoom();
            var diffToMin = Math.abs(currentZoom - layerOpts.minZoom);
            var diffToMax = Math.abs(currentZoom - layerOpts.maxZoom);
            if (diffToMin < diffToMax)
                $.bkfsMap.divMap.setZoom(layerOpts.minZoom);
            else
                $.bkfsMap.divMap.setZoom(layerOpts.maxZoom);
            $.bkfsMap.changeLayerOption(layerId);
            $('div.jqMpCntlLayerItem[rel="' + layerId + '"]').find('div.jqMpCntlLayerMagnify').hide();
            return true;
        },
        enableLayer: function(layer) {
            if (layer != null) {
                if (layer.isPng) {
                    $.bkfsMap.divMap.overlayMapTypes.push(new google.maps.ImageMapType(layer));
                } else {
                    layer.setMap($.bkfsMap.divMap);
                }
            }
        },
        AddMapLayer: function (layerId, clickable) {
            var layerOption = $.bkfsMap.getLayerOption(layerId);
            if (layerOption != null) {
                var clickableLayer = layerOption;
                if (layerOption.type == 'DMP') {
                    var layer = $.bkfsMap.parcelLayers[layerOption.parcelIndex];
                    if (layer != null) {
                        $.bkfsMap.enableLayer(layer.lines);
                        if (clickable && layer.clickable && $.bkfsMap.allowInteractiveLayer) {
                            if ($.bkfsMap.interactiveLayerClick == null) {
                                $.bkfsMap.interactiveLayerClick = $.bkfsMap.divMap.addListener('click', function (e) {
                                    $.bkfsMap.parcelClickTimeout = setTimeout(function () { $.bkfsMap.parcelClick(e); }, 250);
                                });
                            }
                            if ($.bkfsMap.interactiveLayerDblClick == null) {
                                $.bkfsMap.interactiveLayerDblClick = $.bkfsMap.divMap.addListener('dblclick', function () {
                                    clearTimeout($.bkfsMap.parcelClickTimeout);
                                });
                            }
                            $.bkfsMap.currentLayerId = clickableLayer.id;
                            $.bkfsMap.currentLayerResourceName = clickableLayer.resourceName;
                            if (typeof (clickableLayer.altResource) != 'undefined')
                                $.bkfsMap.currentLayerResourceName = clickableLayer.altResource;
                            $.bkfsMap.currentLayerQuery = "";
                            if (typeof (clickableLayer.dataQuery) === 'string')
                                $.bkfsMap.currentLayerQuery = clickableLayer.dataQuery;
                            else if (clickableLayer.dataQuery && !$.isEmptyObject(clickableLayer.dataQuery)) {
                                $.bkfsMap.currentLayerQuery += "&fields=" + clickableLayer.dataQuery.fields;
                                $.bkfsMap.currentLayerQuery += "&nested=" + clickableLayer.dataQuery.nested;
                                $.bkfsMap.currentLayerQuery += "&showSchema=" + clickableLayer.dataQuery.showSchema;
                                $.bkfsMap.currentLayerQuery += "&attributelinks=" + clickableLayer.dataQuery.attributeLinks;
                                if (clickableLayer.dataQuery.links != null && clickableLayer.dataQuery.links != "") {
                                    $.bkfsMap.currentLayerQuery += "&LINKS={";
                                    var count = 0;
                                    $.each(clickableLayer.dataQuery.links, function (key, value) {
                                        if (value && !$.isEmptyObject(value)) {
                                            if (count > 0)
                                                $.bkfsMap.currentLayerQuery += ",";
                                            count++;
                                            $.bkfsMap.currentLayerQuery += value.fields + ":{";
                                            $.bkfsMap.currentLayerQuery += "Class:'" + value.linkClass + "'";
                                            if (value.to.length > 0)
                                                $.bkfsMap.currentLayerQuery += ",To:'" + value.to + "'";
                                            if (value.fromKey.length > 0)
                                                $.bkfsMap.currentLayerQuery += ",FromKey:'" + value.fromKey + "'";
                                            if (value.toKey.length > 0)
                                                $.bkfsMap.currentLayerQuery += ",ToKey:'" + value.toKey + "'";
                                            if (value.method.length > 0)
                                                $.bkfsMap.currentLayerQuery += ",Method:'" + value.method + "'";
                                            if (value.buffer.length > 0)
                                                $.bkfsMap.currentLayerQuery += ",Buffer:" + value.buffer;
                                            $.bkfsMap.currentLayerQuery += "}";
                                        }
                                    });
                                    $.bkfsMap.currentLayerQuery += "}";
                                }
                                if (clickableLayer.dataQuery.account.length > 0 && $.bkfsMap.debug) {
                                    $.bkfsMap.currentLayerQuery += "&account=" + clickableLayer.dataQuery.account;
                                    $.bkfsMap.currentLayerQuery += "&login=" + clickableLayer.dataQuery.login;
                                    $.bkfsMap.currentLayerQuery += "&password=" + clickableLayer.dataQuery.password;
                                }
                            }
                            $.bkfsMap.tempParcelOption = layerId;
                        }

                        if ($('div.jqMpCntlCheckSlider[rel="' + layerId + '"]').hasClass('jqMpCntlCheckSliderChecked')) {
                            $.bkfsMap.enableLayer(layer.labels);
                        }
                    }
                }
            }
        },
        getLayer: function (id) {
            if ($.bkfsMap.layerLoaded == true && $.bkfsMap.parcelLayers.length == 0) {
                $.bkfsMap.previousLayerOption = null;
                $.bkfsMap.initLayers();
            }
            for (var i = 0; i < $.bkfsMap.parcelLayers.length; i++) {
                var lines = $.bkfsMap.parcelLayers[i].lines;
                if (lines.resourceName == id || lines.id == id) {
                    return $.bkfsMap.parcelLayers[i];
                }
            }
            return null;
        },
        toggleCustomLayerActive: function (descriptionDiv) {
            var layerOption = descriptionDiv.parent();
            var checkBox = layerOption.find('div.jqMpCntlLayerCheckBox');
            if (!checkBox.hasClass($.bkfsMap.layerCheckBoxCheckedClass)) {
                checkBox.click();
            }
        },
        unselectCustomLayer: function () {
            var layerOption = $.bkfsMap.descriptionDiv.parent();
            var id = 'divInfoBox' + layerOption.attr('collId') + '_';

            $.bkfsMap.uncheckLayerCheckBox($.bkfsMap.descriptionDiv);
            $.bkfsMap.unselectActiveLayer(layerOption);
            $.bkfsMap.descriptionDiv.removeClass($.bkfsMap.layerCheckBoxCheckedClass);
            $.bkfsMap.divMap.data.forEach(function (feature) {
                if (feature.getProperty('collectionId') == layerOption.attr('collId') && $.inArray(feature.getId(), $.bkfsMap.layerItemIds) < 0) {
                    $.bkfsMap.divMap.data.remove(feature);
                    $("#" + id + feature.getProperty('shapeId')).hide();
                }
            });
        },
        getInfoWindowFromArray: function (infoWindowId) {
            var infoWindow = null
            $.each($.bkfsMap.layerContextElements, function (key, obj) {
                if (obj.id == infoWindowId) {
                    infoWindow = obj;
                    return false;
                }
            });
            return infoWindow;
        },
        selectGeoJson: function () {
            var layerOption = $.bkfsMap.descriptionDiv.parent();

            if ($.bkfsMap.layerCollectionIds.length == 0) {
                layerOption.addClass($.bkfsMap.selectedLayerClass);
                layerOption.find('div.jqMpCntlCheckSlider').addClass('jqMpCntlCheckSliderChecked');
                $.bkfsMap.checkLayerCheckBox($.bkfsMap.descriptionDiv);
                $.bkfsMap.selectActiveLayer($.bkfsMap.descriptionDiv.parent());
            }
            $.bkfsMap.divMap.data.loadGeoJson(layerOption.attr('geoJsonPath'),
                {},
                function (features) {
                    $.each($.bkfsMap.shapeArray, function (idx, val) {
                        if (val != null && val.shapeTypeId == 7) {
                            $.bkfsMap.layerItemIds.push(val.layerItemId);
                        }
                    });
                    $.each(features, function (idx, feature) {
                        if ($.inArray(feature.getId(), $.bkfsMap.layerItemIds) > -1) {
                            feature.setProperty('selected', true);
                            var hdnShapeId = -1;
                            $.each($("[id^=hdnShape]"), function (idx, shape) {
                                var value = JSON.parse($(shape).val());
                                if (value.layeritemid == feature.getId()) {
                                    hdnShapeId = value.id;
                                    return false;
                                }
                            });
                            var infoWindow = $.bkfsMap.getInfoWindowFromArray('infoWindow_' + hdnShapeId);
                            if (infoWindow == null) {
                                $.bkfsMap.addFeatureMarker(feature, feature.getId(), hdnShapeId);
                            }
                        }
                        feature.setProperty('collectionId', layerOption.attr('collId'));
                        if (feature.getGeometry().getType() === 'Polygon') {
                            if ($.bkfsMap.layerCollectionIds.length > 0 && $.inArray(feature.getId(), $.bkfsMap.layerItemIds) < 0) {
                                $.bkfsMap.divMap.data.remove(feature);
                            }
                            else {
                                //initialize the paths
                                var paths = [];

                                //iterate over the paths
                                if ($.isArray(feature.getGeometry().getArray())) {
                                    var path = feature.getGeometry().getArray()[0];
                                    //iterate over the points in the path to add paths
                                    path.getArray().forEach(function (latLng) {
                                        paths.push({
                                            lat: latLng.lat(),
                                            lng: latLng.lng()
                                        });
                                    });
                                    feature.setProperty('shapeId', idx);
                                    var tempShape = new google.maps.Polygon({
                                        paths: paths,
                                        layerItemId: feature.getId(),
                                        shapeId: idx,
                                        description: feature.getProperty('desc')
                                    });
                                    if ($('#divInfoBox' + layerOption.attr('collId') + '_' + tempShape.shapeId).length == 0) {
                                        if ($.bkfsMap.polygonInfoBoxes.length >= tempShape.shapeId && ($.bkfsMap.polygonInfoBoxes[tempShape.shapeId] == null || $.bkfsMap.polygonInfoBoxes[tempShape.shapeId].content_.id != "divInfoBox" + layerOption.attr('collId') + "_" + tempShape.shapeId)) {
                                            $.bkfsMap.addPolygonInfoBox(tempShape, layerOption.attr('collId'), true);
                                        }
                                    }
                                    else {
                                        $('#divInfoBox' + layerOption.attr('collId') + '_' + tempShape.shapeId).show();
                                    }
                                }
                            }
                        }
                    });
                });
        },
        toggleCustomLayerCheckBox: function (descriptionDiv) {
            $.bkfsMap.descriptionDiv = descriptionDiv;

            if (descriptionDiv.hasClass($.bkfsMap.layerCheckBoxCheckedClass)) {
                $.bkfsMap.unselectCustomLayer();
            } else {
                if ($('#jqMpCntCustomMapLayers .jqMpCntlLayerCheckBox').hasClass($.bkfsMap.layerCheckBoxCheckedClass)) {
                    //$('#customLayerSelected').dialog('open');  //Add this back in if UAT thinks we need a warning, and remove other code
                    var tempLayer = $.bkfsMap.descriptionDiv;
                    $.bkfsMap.descriptionDiv = $('#jqMpCntCustomMapLayers .jqMpCntlLayerCheckBoxChecked');
                    $.bkfsMap.unselectCustomLayer();
                    $.bkfsMap.descriptionDiv = tempLayer;
                    $.bkfsMap.selectGeoJson();
                }
                else {
                    $.bkfsMap.selectGeoJson();
                }
            }
        },
        toggleLayerActive: function (descriptionDiv) {
            var layerOption = descriptionDiv.parent();
            if (layerOption.hasClass($.bkfsMap.selectedLayerClass)) {
                $.bkfsMap.unselectActiveLayer(layerOption);
            } else {
                $.bkfsMap.selectActiveLayer(layerOption);
            }
            $.bkfsMap.selectedLayersChanged = true;
            $.bkfsMap.toggleLayerItem.call($.bkfsMap);
        },
        endFarming: function () {
            $.bkfsMap.selectionMode = 'single';
            $('div.jqMpCntlSubMenuLasoSelect').parent().removeClass('jqMpCntlSubMenuSelectionSelected');
            $('div.jqMpCntlSubMenuMultiSelect').parent().removeClass('jqMpCntlSubMenuSelectionSelected');
            $('div.jqMpCntlSubMenuFinishSelect').parent().parent().hide();
        },
        toggleLayerLegend: function (layerOption) {
            var currentVisible = $('div.jqMpCntlLegendContainer:visible').attr('rel');
            $.bkfsMap.closeLayerLegend();
            if (layerOption.attr('rel') != currentVisible)
                $.bkfsMap.openLayerLegend(layerOption.attr('rel'));
        },
        openLayerLegend: function (layerOptionId) {
            $('div#jqMpCntl' + layerOptionId + 'Legend').show();
        },
        closeLayerLegend: function () {
            $('div.jqMpCntlLegendContainer').hide();
        }
    });
})(jQuery);
