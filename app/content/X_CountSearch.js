function resizeReports() {
  var n = $(".f-cs-control").height() + 105;
  $("#Reports").height($(window).height() - n)
}

function resizePage() {
  $("div.ui-layout-west").height($(window).height() - 29);
  resizeReports()
}

function buildTabDescription(n) {
  var t = "Results",
    i;
  return n != null && (typeof n.result == "object" && typeof (n.result.listingCount != "undefined") && n.result.listingCount > 0 ? t = "Results (" + n.result.Count + " Records for " + n.result.listingCount + " Listings)" : (i = typeof n.result == "object" ? n.result.Count : n.result, t = "Results (" + i + ")")), t
}

function setupParams(n) {
  $("#searchID").length == 0 ? $("form.f-form-search").append('<input type="hidden" id="searchID" name="searchID" value="' + n + '"/>') : $("#searchID").val(n);
  setupSearchType()
}

function setupSearchType() {
  typeof g_searchType != undefined && window.g_searchType != null && $("#searchType").length == 0 ? $("form.f-form-search").append('<input type="hidden" id="searchType" name="searchType" value="' + window.g_searchType + '"/>') : $("#searchType").val(window.g_searchType)
}

function CallMarketConditionsAddendumReport(n, t, i, r, u, f) {
  dataController.UseAllListings = n;
  dataController.MaxDate = t;
  dataController.IncludeListingSummary = i;
  dataController.LowLimit = r;
  dataController.HighLimit = u;
  dataController.UseNextTime = f;
  $.focusFx.loadViewSelectorNode(tempNode, !firstSelect)
}

function CheckBeforeMove(n, t) {
  return removeFavorite || removeRecycleBinItem ? !0 : n.get_type(t).indexOf("favorites") > -1 ? (movingIntoFavorites = !0, !0) : n.get_type(t).indexOf("recycle") > -1 ? (movingIntoRecycleBin = !0, !0) : !1
}

function CallBrokerManagementReport(n, t, i, r, u, f, e, o) {
  dataController.UseAllListings = n;
  dataController.BMRDollarRangeGroup = t;
  dataController.BMRAllClassInfo = i;
  dataController.BMRClassMonthlyInfo = r;
  dataController.BMRPriceRangeInfo = u;
  dataController.BMROfficeID = e;
  dataController.BMRUseFirm = f;
  o.length > 0 && (dataController.BMROrgJson = o);
  $.focusFx.loadViewSelectorNode(tempNode, !firstSelect)
}

function saveFavoritesAndRecycleBinItems(n) {
  var t = "",
    i = "";
  $("#nodeRecycle_Bin li a").each(function () {
    i += $(this).attr("viewid") + ","
  });
  $('#Reports li[rel^="favorites"] li a').each(function () {
    t += $(this).attr("viewid") != undefined ? $(this).attr("viewid") + "," : ""
  });
  i = i.length > 0 ? i.substring(0, i.length - 1) : "";
  t = t.length > 0 ? t.substring(0, t.length - 1) : "";
  $.ajax({
    url: saveFavoritesUrl,
    type: "POST",
    data: JSON.stringify({
      favoritesList: t,
      recycleBinItemsList: i
    }),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function () {
      var t = displayFavsMsg && displayRecycleMsg ? "Saved Favorites and Recycle Bin" : displayFavsMsg ? "Saved Favorites" : "Saved Recycle Bin",
        i = "SUCCESS",
        r, u;
      displayFavsMsg && (r = $(n).find("a").first().attr("viewid"), u = $(n).find("a").first().text(), movingIntoFavorites ? (i = "Favorite Added", t = u + " moved to Favorites  <br/><br/> <a style='cursor:pointer' class='undoAddFav' rel='" + r + "' ><i class='fa fa-undo' style='font-size: 12px; color: #fff;'><\/i> Undo<\/a>") : removeFavorite && (i = "Favorites Updated", t = u + " removed from Favorites <br/><br/> <a style='cursor:pointer' class='undoRemoveFav' rel='" + r + "' ><i class='fa fa-undo' style='font-size: 12px; color: #fff;'><\/i> Undo<\/a>"));
      isUndoFav == !1 && $.jGrowl(t, {
        header: i,
        group: "jgrowl-success"
      });
      displayFavsMsg = !1;
      displayRecycleMsg = !1;
      movingIntoFavorites = !1;
      movingIntoRecycleBin = !1;
      removeFavorite = !1;
      removeRecycleBinItem = !1;
      isUndoFav = !1
    },
    error: function (n) {
      var t = displayFavsMsg && displayRecycleMsg ? "Error Saving Recycle Bin and Favorites" : displayFavsMsg ? "Error Saving Favorites" : "Error Saving Recycle Bin";
      this.ajaxRetryOnError(n, t);
      displayFavsMsg = !1;
      displayRecycleMsg = !1;
      movingIntoFavorites = !1;
      movingIntoRecycleBin = !1;
      removeFavorite = !1;
      removeRecycleBinItem = !1;
      isUndoFav = !1
    }
  })
}
var m_VE_ReturnData;
(function (n) {
  var r = "minbox",
    t = "minbox_",
    u = n ? .browser.msie && !n.support.opacity,
    i;
  i = n.fn[r] = n[r] = function (i) {
    var r, o, f, s, h, e;
    if (i = i || {}, n("#min" + t + i.minName).remove(), r = t + i.minName, i.preiframe = !0, i.href = "#div" + r, i.minBoxClass = "MinimizedBox", o = n("#" + r), o.length == 0) f = n("<iframe frameborder='0' style='width:100%; height:100%; border:0; display:block'/>")[0], f.id = f.name = r, f.src = i.minUrl, i.scrolling || (f.scrolling = "no"), u && (f.allowtransparency = "true"), n("<div id='div" + r + "' class='LoadedContent'><\/div>").html(f).appendTo("#cboxContent"), i.dialogSelect && i.dialogSelect.dialog({
      autoOpen: !1,
      draggable: !1,
      modal: !1,
      resizable: !1,
      title: "Overwrite / Restore?",
      buttons: {
        Restore: function () {
          i.minClicked = !0;
          n.fn.minbox(i);
          i.dialogSelect.dialog("close")
        },
        Overwrite: function () {
          n.fn.minbox.close(i.minName);
          n.fn.minbox(i);
          i.dialogSelect.dialog("close")
        }
      }
    });
    else {
      if (n("#div" + r).show(), s = o.attr("src"), !i.minClicked && i.dialogSelect) return i.dialogSelect.dialog("open"), null;
      i.alwaysOverwrite && i.minUrl != s && (document.getElementById(r).contentWindow.location.href = i.minUrl)
    }
    return i.minClicked = !1, i.onClosed = function () {
      n.fn.minbox.minimize(i)
    }, h = n.fn.colorbox(i), e = document.getElementById(r).contentWindow, e != null && e.SetupButtons != null && e.SetupButtons(), h
  };
  i.minimize = function (i) {
    var e = typeof i.minBoxClass == "undefined" ? "MinimizedBox" : i.minBoxClass,
      u = n("#div" + t + i.minName),
      r, f;
    if (u.length > 0) {
      for (u.hide(), r = 0; r < 999; r++)
        if (n("div.MinimizedBox[pos=" + r + "]").length == 0) break;
      f = r * 155;
      n('<div id="min' + t + i.minName + '" style="left: ' + f + "px;" + i.customStyle + '" pos="' + r + '" class="' + e + '"><span>' + i.title + '<\/span><em class="ui-icon ui-icon-close-large">[x]<\/em><\/div>').appendTo("body").click(function () {
        i.minClicked = !0;
        n.fn.minbox(i)
      }).find("em").click(function (t) {
        return t.preventDefault(), n.fn.minbox.close(i.minName), !1
      })
    }
  };
  i.close = function (i) {
    n("#min" + t + i).remove();
    n("#div" + t + i).remove();
    n.fn.colorbox.close()
  };
  i.init = function () {};
  i.settings = {
    minUrl: "",
    minName: "window",
    alwaysOverwrite: !1
  };
  n(i.init)
})(jQuery, this),
function (n) {
  n.fn.criteriaSummary = function (t) {
    function u() {
      var t = n(this).parent().siblings("table");
      n.focusFx.dontCountRightNow = !0;
      n("tr", t).not(".cs-required").each(function () {
        n(this).removeRow()
      });
      n.focusFx.dontCountRightNow = !1;
      n.focusFx.queueSearchFormCount(!0);
      try {
        resizeReports()
      } catch (i) {}
    }
    var f = n.extend({}, n.fn.criteriaSummary.defaults, t),
      r, i;
    n("#f_4007_Selection,#f_4008_Selection,#f_4009_Selection").addClass("f-cs-item");
    r = function () {
      var t = n.data(this, "criteriaSummary:validate");
      if (typeof t == "function" && !t(this)) return !1;
      n(".f-cs-items").addRow(this)
    };
    i = function () {
      var t, i, f, u, e, s, o;
      try {
        if (t = n(this), t.hasClass("f-cs-disable")) return;
        if (n('.f-mutex-item[f="' + t.attr("f") + '"]').each(function (t, i) {
            var r = n('tr[rel="f_' + n(i).attr("f") + '"]');
            r.length > 0 ? r.removeRow(!0) : n('tr[rel="' + n(i).attr("id") + '"]').removeRow(!0)
          }), i = t.attr("id"), i == "f_4004_Low" || i == "f_4004_High")
          if (t.val().length > 0) n('tr[rel="f_4004"],tr[rel="f_4004_DaysForward"]').remove();
          else {
            n('tr[rel="f_4004"]').remove();
            return
          } if (i = t.attr("id"), i == "f_4006_Low" || i == "f_4006_High")
          if (t.val().length > 0) n('tr[rel="f_4006"],tr[rel="f_4006_DaysBack"],tr[rel="f_4006_RunFrom"]').remove();
          else {
            n('tr[rel="f_4006"]').remove();
            return
          } if (i.indexOf("DaysBack") > -1)
          if (t.val().length > 0) n('tr[rel="f_4006"],tr[rel="f_4006_DaysBack"],tr[rel="f_4006_RunFrom"]').remove();
          else {
            n('tr[rel="' + i + '"]').remove();
            return
          } if (i.indexOf("DaysForward") > -1 && (n('tr[rel="f_4004"],tr[rel="f_4004_DaysForward"]').remove(), t.val().length < 1)) return;
        f = i == "f_4006_RunFrom";
        f && (n('tr[rel="f_4006"],tr[rel="f_4006_DaysBack"],tr[rel="f_4006_RunFrom"]').remove(), t.is(":checked") ? n("#f_4006_DaysBack,#f_4006_Low,#f_4006_High").val("").attr("disabled", "disabled").addClass("ui-state-disabled") : n("#f_4006_DaysBack,#f_4006_Low,#f_4006_High").removeAttr("disabled").removeClass("ui-state-disabled"));
        u = !1;
        f && (e = t.attr("critsumvalue"), t.prop("checked") || t.hasClass("cs-required") || e != null && e.length > 0 ? u = !1 : (u = !0, t.prop("checked") || t.hasClass("cs-required") || (s = n(".f-cs-items"), o = s.find('tr[rel="' + this.id + '"]'), o != null && n(o).remove(), t.attr("data-suppress-autocount") !== "true" && n.focusFx && n.focusFx.searchFormAutoCount && n.focusFx.searchFormAutoCount())));
        u || (r.call(this), t.attr("data-suppress-autocount") !== "true" && n.focusFx && n.focusFx.searchFormAutoCount && n.focusFx.searchFormAutoCount(!0))
      } finally {
        try {
          resizeReports()
        } catch (h) {}
      }
    };
    n(".f-cs-clear-all").click(u);
    n('select.f-cs-item,input[type="radio"],select.f-form-field-options').livequery("change", i);
    n(":input.f-cs-item").livequery("change", i).attr("data-suppress-autocount", "true").each(function () {
      var t = n(this),
        i = t.val();
      i != null && i.length > 0 && (!t.hasClass("acfb-value") || i != "[]") && t.trigger("change")
    }).removeAttr("data-suppress-autocount")
  };
  n.fn.criteriaSummaryValidate = function (t) {
    return this.each(function () {
      n.data(this, "criteriaSummary:validate", t)
    })
  };
  n.fn.removeRow = function (t) {
    function y() {
      n("#" + r + "_Low" + u + ",#" + r + "_High" + u).val("");
      n("#" + r + "_Low_1" + u + ",#" + r + "_High_1" + u).val("000")
    }

    function p(n) {
      var t = i.parent();
      t.parent()[0].acfb.mergeResults(n)
    }

    function w() {
      if (i.hasClass("acfb-input")) {
        var t = "";
        i.parent().parent()[0].acfb.mergeResults([]);
        t = i.hasClass("f-form-min") ? i[0].id.replace("Low", "High") : i[0].id.replace("High", "Low");
        n("#" + t).parent().parent()[0].acfb.mergeResults([])
      } else n("#" + r + "_Low,#" + r + "_High,#" + r + "_Low" + u + ",#" + r + "_High" + u).val("")
    }

    function b() {
      i.attr("type") == "checkbox" && i.prop("checked", !1);
      n.each(i.find("input"), function () {
        n(this).prop("checked", !1)
      });
      n.focusFx && n.focusFx.searchFormAutoCount && n.focusFx.searchFormAutoCount()
    }
    var e = !0,
      r = this.attr("rel"),
      u = "",
      o, i, f, c, l, s;
    if (r.indexOf("__") > -1 && (o = r.split("__"), r = o[0], u = "__" + o[1]), i = n("#" + r + u), i.length == 0 && (i = n("#" + r + "_Low" + u), i.length == 0 && (i = n("#" + r + "_Low"))), i.length == 0 && (i = n("#" + r + "_Low__1"), i.length > 0 && (u = "__1")), !!t == !1) {
      if (i.hasClass("f-form-price")) y();
      else if (i.hasClass("acfb-value")) {
        if (f = [], i[0].name.indexOf("hdnf_492") > -1) {
          var a = n("td.f-cs-description", n(this)).html(),
            h = "",
            v = JSON.parse(i[0].value);
          n.each(v, function (n, t) {
            var i = t.hasOwnProperty("Required") ? t.Required : !1;
            i == !0 && (e = !1, f.push(t), h += "<br/>" + t.Data)
          });
          f.length > 0 && n.jGrowl("The " + a + " value(s) below cannot be removed :<br/>" + h, {
            life: 5e3,
            header: "ALERT",
            group: "jgrowl-alert"
          })
        } else i[0].name.indexOf("hdnf_518") > -1 && n.focusFx.$mapTab && n.focusFx.$mapTab.length > 0 && !n.focusFx.isSrcEmpty(n.focusFx.$mapTab) && (c = JSON.parse(i[0].value), n.each(c, function (t, i) {
          n.focusFx.$mapTab[0].contentWindow.$.bkfsMap.deleteShape(i.Value.id, !0)
        }));
        p(f)
      } else i.hasClass("f-form-min") || i.hasClass("f-form-max") ? w() : i.hasClass("f-checkboxlist") || i.hasClass("f-cs-item") && i.attr("type") == "checkbox" ? b() : i.is("select") ? (i[0].selectedIndex = 0, i[0].name.indexOf("f_12") > -1 && (e = !1)) : i.val("");
      l = i.parents("div.f-form-field:first");
      s = n("select.f-form-field-options", l);
      s.length > 0 && n(s).selectBoxIt("selectOption", 0)
    }
    i.hasClass("acfb-value") || i.trigger("change");
    e && this.remove();
    return
  };
  n.fn.addRow = function (t) {
    function p(t) {
      var o = n(t).parents("ul.acfb-holder"),
        i = o.find(".acfb-input"),
        f, e, c;
      if (i && o.css("display") == "none" && i.attr("disabled")) n(".f-cs-items").addCustomRow(i.attr("id"), "", "", null, !1);
      else if (i) {
        var s = n(t).val(),
          l = s.length > 0 ? JSON.parse(s) : [],
          h = !1,
          r = "",
          u = "Data";
        return i.attr("data") !== undefined && (u = i.attr("data")), f = "Description", i.attr("description") != undefined ? f = i.attr("description") : i.attr("desc") != undefined && (f = i.attr("desc")), i.attr("extraparams") != undefined && (e = JSON.parse(i.attr("extraparams")), e.DoRequiredInputCheck != null && (h = e.DoRequiredInputCheck)), c = u.length == 0, n.each(l, function (n, t) {
          t != null && (!h && t.Required != null && t.Required && (k = !0), r += r.length > 0 ? ", " : "", r += c ? t : i.data("combinedataanddesc") ? t[u] + " - " + t[f] : t[u])
        }), i.data("combinedataanddesc") && r.length > 300 && (r = r.substr(0, 300) + "..."), r
      }
    }

    function it() {
      var e = "",
        h = n(t).parent(),
        r, o, f, s;
      return n("input", h).each(function (t) {
        switch (t) {
          case 0:
            u = i.parents("div.f-form-field").find("label").attr("for");
            r = n.trim(n(this).val());
            r.length == 0 && (r = "0");
            break;
          case 1:
            o = n.trim(n(this).val());
            o.length == 0 && (o = "000");
            break;
          case 2:
            f = n.trim(n(this).val());
            f.length == 0 && (f = "0");
            break;
          case 3:
            s = n.trim(n(this).val());
            s.length == 0 && (s = "000")
        }
      }), f = parseInt(f, 10) * 1e3 + parseInt(s, 10), r = parseInt(r, 10) * 1e3 + parseInt(o, 10), r > 0 && f > 0 ? e = r + " - " + f : f > 0 ? e = " <= " + f : r > 0 && (e = ">=" + r), e
    }

    function rt() {
      var t = "";
      return n.each(i.parents(".f-checkboxlist:first").find("input"), function () {
        var i = n(this);
        i.prop("checked") && (t += i.attr("critsumvalue") + ", ")
      }), t.length > 0 ? t.substring(0, t.length - 2) : ""
    }

    function d() {
      var e = i.parents("div.f-form-field").find("input"),
        u = i.parents("div.f-form-field").find("select[class*=f-form-time]"),
        o = i.parents("div.f-form-field").find(":selected"),
        r = "",
        f = "",
        t = this;
      return (t.lastClassMin = !1, t.lastClassMax = !1, t.noMinMaxClass = !1, n.each(e, function (i, o) {
        var s = n(o),
          h = "";
        t.noMinMaxClass = e.length == 4 && !s.hasClass("f-form-min") && !s.hasClass("f-form-max");
        s.hasClass("f-form-min") || t.noMinMaxClass && t.lastClassMin ? (s.hasClass("acfb-input") || s.hasClass("acfb-value") ? s.hasClass("acfb-value") && (r = p(o)) : r = s.val(), r != "" && u.length >= 3 && (h = " " + n("#" + u[0].name).val() + ":" + n("#" + u[1].name).val() + " " + n("#" + u[2].name).val(), r += h), t.lastClassMin = !0, t.lastClassMax = !1) : s.hasClass("f-form-max") || t.noMinMaxClass && t.lastClassMax ? (s.hasClass("acfb-input") || s.hasClass("acfb-value") ? s.hasClass("acfb-value") && (f = p(o)) : f = s.val(), f != "" && u.length == 3 && (h = " " + n("#" + u[0].name).val() + ":" + n("#" + u[1].name).val() + " " + n("#" + u[2].name).val()), f != "" && u.length == 6 && (h = " " + n("#" + u[3].name).val() + ":" + n("#" + u[4].name).val() + " " + n("#" + u[5].name).val()), f += h, t.lastClassMin = !1, t.lastClassMax = !0) : (t.lastClassMin = !1, t.lastClassMax = !1)
      }), r && r.length > 0 && f && f.length > 0) ? r + " - " + f : r && r.length > 0 && o.text() === "Single" ? "= " + r : r && r.length > 0 ? ">= " + r : f && f.length > 0 ? "<= " + f : ""
    }
    var i = n(t),
      s, h, a, y, f, l;
    i.hasClass("f-form-field-options") && (i = i.parent().find(".f-cs-item:not(.f-form-address-num,.f-form-address-dir):first"), t = i[0]);
    var u = i.attr("id"),
      w = i.parents("div.f-form-field"),
      e = w.find("label:first"),
      o = i.hasClass("f-cs-item-use-title") ? i.attr("title") : e.html(),
      b = i.hasClass("f-form-date"),
      r = "",
      k = i.hasClass("cs-required");
    if (i.hasClass("f-form-price")) r = it();
    else if (i.hasClass("acfb-value")) r = p(t), s = n("input.acfb-input", i.parent()), h = n("label[for=" + s.attr("id") + "]"), s.hasClass("f-form-min") || s.hasClass("f-form-max") ? (r = d(), u = e.attr("for")) : h.length > 0 && (o = (h.html() != o ? o + ": " : "") + h.html());
    else if (typeof i.attr("csText") != "undefined" && i.attr("csText").length > 0) r = i.attr("csText");
    else if (i.hasClass("f-form-min") || i.hasClass("f-form-max")) r = d(), u = e.attr("for");
    else if (i.attr("type") == "checkbox") a = i.attr("critsumvalue"), a != null && a.length > 0 ? (u = e.attr("for"), r = rt()) : r = n("#f_4006_RunFromDate").length > 0 ? n("#f_4006_RunFromDate").val() : i.prop("checked") ? "YES" : "NO";
    else if (i.attr("name").indexOf("DaysBack") > 0) r = t.value + " days back";
    else if (i.attr("name").indexOf("Selection") > 0) r = n("#" + i.attr("name") + " :selected").text();
    else if (i.attr("type") == "radio") {
      var g = i.attr("id"),
        v = g.split("_"),
        nt = v[0] + "_" + v[1],
        c, tt = v[2] == "Ascending" ? "ASC" : "DESC";
      n("select.f-cs-item").each(function () {
        n(this).attr("id").indexOf(nt) > -1 && (c = n(this))
      });
      c != undefined ? (u = c.attr("id"), r = n("#" + c.attr("name") + " :selected").text() + ", " + tt) : (u = i.attr("name"), r = i.attr("value"))
    } else r = i.val();
    return i.hasClass("f-form-address-num") || i.hasClass("f-form-address-dir") || (y = w.find("select.f-form-field-options"), y.length > 0 && (f = n("option:selected", y), l = !1, b && f.val() > 0 ? (r = "", l = !0) : !b && r.length > 0 && f.val() > 1 && (l = !0), l && f.text() !== "Single" && (r = f.text() + " " + r))), n(this).addCustomRow(u, o, r, null, k)
  };
  n.fn.addCustomRow = function (t, i, r, u, f) {
    return this.each(function () {
      n("tr[rel*=hdn" + t + "]:not([class^=hotsheet])").remove();
      var u = n(this.rows).filter('[rel="' + t + '"]');
      r.length > 0 && u.length == 0 ? ($row = n("<tr><\/tr>"), $row.attr("rel", t), $row.addClass(i.toLowerCase().replace(" ", "")), f ? ($row.addClass("cs-required"), $td = n('<th scope="row" class="f-cs-action"><\/th>'), $row.append($td)) : ($td = n('<th scope="row" class="f-cs-action"><div class="f-cs-close" title="Remove"><\/div><\/th>'), $row.append($td)), $td = n('<th scope="row" class="f-cs-action"><div class="f-cs-edit" title="Edit"><\/div><\/th>'), $row.append($td), $td = n('<td class="f-cs-description">' + i + "<\/td>"), $row.append($td), $td = n('<td class="f-cs-data">' + r + "<\/td>"), $row.append($td), n("tr:last", this).length > 0 ? n("tr:last", this).after($row) : n(this).append($row), n(".f-cs-edit", $row).click(function () {
        var i = n(this).parents("tr:first").attr("rel"),
          r, u, t, f;
        if (i == "hdnf_518") {
          n("a.f-form-map").click();
          return
        }
        r = "";
        i.indexOf("__") > -1 && (u = i.split("__"), i = u[0], r = "__" + u[1]);
        t = n("#" + i + r);
        t.length == 0 && (t = n("#" + i + "_Low" + r), t.length == 0 && (t = n("#" + i + "_Low")));
        t.length == 0 && (t = n("#" + i + "_Low__1"), t.length > 0 && (r = "__1"));
        t.hasClass("acfb-value") && (t = t.parent().find(".acfb-input"));
        t.length > 0 && (t.parents("fieldset:first").find("span.ui-icon-circle-triangle-s").parent().click(), t.focus().parents("div.f-form-field").effect("highlight", {}, 3e3), f = t.offset().top, n("html,body").animate({
          scrollTop: f
        }, 1e3))
      }), n(".f-cs-close", $row).click(function () {
        n(this).parents("tr").removeRow()
      }), n(".ui-state-default", $row).hover(function () {
        n(this).addClass("ui-state-hover")
      }, function () {
        n(this).removeClass("ui-state-hover")
      })) : r.length > 0 && u.length > 0 ? u.get(0).cells[3].innerHTML = r : u != null && n(u).remove()
    }), n(this)
  };
  n.fn.criteriaSummary.defaults = {
    animate: !1
  }
}(jQuery);
! function () {
  "use strict";
  var n = !1;
  window.JQClass = function () {};
  JQClass.classes = {};
  JQClass.extend = function t(i) {
    function f() {
      !n && this._init && this._init.apply(this, arguments)
    }
    var o = this.prototype,
      e, r;
    n = !0;
    e = new this;
    n = !1;
    for (r in i)
      if ("function" == typeof i[r] && "function" == typeof o[r]) e[r] = function (n, t) {
        return function () {
          var r = this._super,
            i;
          return this._super = function (t) {
            return o[n].apply(this, t || [])
          }, i = t.apply(this, arguments), this._super = r, i
        }
      }(r, i[r]);
      else if ("object" == typeof i[r] && "object" == typeof o[r] && "defaultOptions" === r) {
      var u, h = o[r],
        c = i[r],
        s = {};
      for (u in h) s[u] = h[u];
      for (u in c) s[u] = c[u];
      e[r] = s
    } else e[r] = i[r];
    return f.prototype = e, f.prototype.constructor = f, f.extend = t, f
  }
}(),
function (n) {
  "use strict";

  function t(n) {
    return n.replace(/-([a-z])/g, function (n, t) {
      return t.toUpperCase()
    })
  }
  JQClass.classes.JQPlugin = JQClass.extend({
    name: "plugin",
    defaultOptions: {},
    regionalOptions: {},
    deepMerge: !0,
    _getMarker: function () {
      return "is-" + this.name
    },
    _init: function () {
      n.extend(this.defaultOptions, this.regionalOptions && this.regionalOptions[""] || {});
      var i = t(this.name);
      n[i] = this;
      n.fn[i] = function (t) {
        var u = Array.prototype.slice.call(arguments, 1),
          f = this,
          r = this;
        return this.each(function () {
          if ("string" == typeof t) {
            if ("_" === t[0] || !n[i][t]) throw "Unknown method: " + t;
            var e = n[i][t].apply(n[i], [this].concat(u));
            if (e !== f && void 0 !== e) return r = e, !1
          } else n[i]._attach(this, t)
        }), r
      }
    },
    setDefaults: function (t) {
      n.extend(this.defaultOptions, t || {})
    },
    _attach: function (t, i) {
      if (t = n(t), !t.hasClass(this._getMarker())) {
        t.addClass(this._getMarker());
        i = n.extend(this.deepMerge, {}, this.defaultOptions, this._getMetadata(t), i || {});
        var r = n.extend({
          name: this.name,
          elem: t,
          options: i
        }, this._instSettings(t, i));
        t.data(this.name, r);
        this._postAttach(t, r);
        this.option(t, i)
      }
    },
    _instSettings: function () {
      return {}
    },
    _postAttach: function () {},
    _getMetadata: function (elem) {
      var data, key, value;
      try {
        data = elem.data(this.name.toLowerCase()) || "";
        data = data.replace(/(\\?)'/g, function (n, t) {
          return t ? "'" : '"'
        }).replace(/([a-zA-Z0-9]+):/g, function (n, t, i) {
          var r = data.substring(0, i).match(/"/g);
          return r && r.length % 2 != 0 ? t + ":" : '"' + t + '":'
        }).replace(/\\:/g, ":");
        data = n.parseJSON("{" + data + "}");
        for (key in data) data.hasOwnProperty(key) && (value = data[key], "string" == typeof value && value.match(/^new Date\(([-0-9,\s]*)\)$/) && (data[key] = eval(value)));
        return data
      } catch (a) {
        return {}
      }
    },
    _getInst: function (t) {
      return n(t).data(this.name) || {}
    },
    option: function (t, i, r) {
      t = n(t);
      var f = t.data(this.name),
        u = i || {};
      return !i || "string" == typeof i && "undefined" == typeof r ? (u = (f || {}).options, u && i ? u[i] : u) : void(t.hasClass(this._getMarker()) && ("string" == typeof i && (u = {}, u[i] = r), this._optionsChanged(t, f, u), n.extend(f.options, u)))
    },
    _optionsChanged: function () {},
    destroy: function (t) {
      t = n(t);
      t.hasClass(this._getMarker()) && (this._preDestroy(t, this._getInst(t)), t.removeData(this.name).removeClass(this._getMarker()))
    },
    _preDestroy: function () {}
  });
  n.JQPlugin = {
    createPlugin: function (n, i) {
      "object" == typeof n && (i = n, n = "JQPlugin");
      n = t(n);
      var r = t(i.name);
      JQClass.classes[r] = JQClass.classes[n].extend(i);
      new JQClass.classes[r]
    }
  }
}(jQuery),
function (n) {
  "use strict";
  var i = "datepick",
    t;
  n.JQPlugin.createPlugin({
    name: i,
    defaultRenderer: {
      picker: '<div class="datepick"><div class="datepick-nav">{link:prev}{link:today}{link:next}<\/div>{months}{popup:start}<div class="datepick-ctrl">{link:clear}{link:close}<\/div>{popup:end}<div class="datepick-clear-fix"><\/div><\/div>',
      monthRow: '<div class="datepick-month-row">{months}<\/div>',
      month: '<div class="datepick-month"><div class="datepick-month-header">{monthHeader}<\/div><table><thead>{weekHeader}<\/thead><tbody>{weeks}<\/tbody><\/table><\/div>',
      weekHeader: "<tr>{days}<\/tr>",
      dayHeader: "<th>{day}<\/th>",
      week: "<tr>{days}<\/tr>",
      day: "<td>{day}<\/td>",
      monthSelector: ".datepick-month",
      daySelector: "td",
      rtlClass: "datepick-rtl",
      multiClass: "datepick-multi",
      defaultClass: "",
      selectedClass: "datepick-selected",
      highlightedClass: "datepick-highlight",
      todayClass: "datepick-today",
      otherMonthClass: "datepick-other-month",
      weekendClass: "datepick-weekend",
      commandClass: "datepick-cmd",
      commandButtonClass: "",
      commandLinkClass: "",
      disabledClass: "datepick-disabled"
    },
    commands: {
      prev: {
        text: "prevText",
        status: "prevStatus",
        keystroke: {
          keyCode: 33
        },
        enabled: function (n) {
          var i = n.curMinDate();
          return !i || t.add(t.day(t._applyMonthsOffset(t.add(t.newDate(n.drawDate), 1 - n.options.monthsToStep, "m"), n), 1), -1, "d").getTime() >= i.getTime()
        },
        date: function (n) {
          return t.day(t._applyMonthsOffset(t.add(t.newDate(n.drawDate), -n.options.monthsToStep, "m"), n), 1)
        },
        action: function (n) {
          t.changeMonth(this, -n.options.monthsToStep)
        }
      },
      prevJump: {
        text: "prevJumpText",
        status: "prevJumpStatus",
        keystroke: {
          keyCode: 33,
          ctrlKey: !0
        },
        enabled: function (n) {
          var i = n.curMinDate();
          return !i || t.add(t.day(t._applyMonthsOffset(t.add(t.newDate(n.drawDate), 1 - n.options.monthsToJump, "m"), n), 1), -1, "d").getTime() >= i.getTime()
        },
        date: function (n) {
          return t.day(t._applyMonthsOffset(t.add(t.newDate(n.drawDate), -n.options.monthsToJump, "m"), n), 1)
        },
        action: function (n) {
          t.changeMonth(this, -n.options.monthsToJump)
        }
      },
      next: {
        text: "nextText",
        status: "nextStatus",
        keystroke: {
          keyCode: 34
        },
        enabled: function (n) {
          var i = n.get("maxDate");
          return !i || t.day(t._applyMonthsOffset(t.add(t.newDate(n.drawDate), n.options.monthsToStep, "m"), n), 1).getTime() <= i.getTime()
        },
        date: function (n) {
          return t.day(t._applyMonthsOffset(t.add(t.newDate(n.drawDate), n.options.monthsToStep, "m"), n), 1)
        },
        action: function (n) {
          t.changeMonth(this, n.options.monthsToStep)
        }
      },
      nextJump: {
        text: "nextJumpText",
        status: "nextJumpStatus",
        keystroke: {
          keyCode: 34,
          ctrlKey: !0
        },
        enabled: function (n) {
          var i = n.get("maxDate");
          return !i || t.day(t._applyMonthsOffset(t.add(t.newDate(n.drawDate), n.options.monthsToJump, "m"), n), 1).getTime() <= i.getTime()
        },
        date: function (n) {
          return t.day(t._applyMonthsOffset(t.add(t.newDate(n.drawDate), n.options.monthsToJump, "m"), n), 1)
        },
        action: function (n) {
          t.changeMonth(this, n.options.monthsToJump)
        }
      },
      current: {
        text: "currentText",
        status: "currentStatus",
        keystroke: {
          keyCode: 36,
          ctrlKey: !0
        },
        enabled: function (n) {
          var i = n.curMinDate(),
            r = n.get("maxDate"),
            u = n.selectedDates[0] || t.today();
          return (!i || u.getTime() >= i.getTime()) && (!r || u.getTime() <= r.getTime())
        },
        date: function (n) {
          return n.selectedDates[0] || t.today()
        },
        action: function (n) {
          var i = n.selectedDates[0] || t.today();
          t.showMonth(this, i.getFullYear(), i.getMonth() + 1)
        }
      },
      today: {
        text: "todayText",
        status: "todayStatus",
        keystroke: {
          keyCode: 36,
          ctrlKey: !0
        },
        enabled: function (n) {
          var i = n.curMinDate(),
            r = n.get("maxDate");
          return (!i || t.today().getTime() >= i.getTime()) && (!r || t.today().getTime() <= r.getTime())
        },
        date: function () {
          return t.today()
        },
        action: function () {
          t.showMonth(this)
        }
      },
      clear: {
        text: "clearText",
        status: "clearStatus",
        keystroke: {
          keyCode: 35,
          ctrlKey: !0
        },
        enabled: function () {
          return !0
        },
        date: function () {
          return null
        },
        action: function () {
          t.clear(this)
        }
      },
      close: {
        text: "closeText",
        status: "closeStatus",
        keystroke: {
          keyCode: 27
        },
        enabled: function () {
          return !0
        },
        date: function () {
          return null
        },
        action: function () {
          t.hide(this)
        }
      },
      prevWeek: {
        text: "prevWeekText",
        status: "prevWeekStatus",
        keystroke: {
          keyCode: 38,
          ctrlKey: !0
        },
        enabled: function (n) {
          var i = n.curMinDate();
          return !i || t.add(t.newDate(n.drawDate), -7, "d").getTime() >= i.getTime()
        },
        date: function (n) {
          return t.add(t.newDate(n.drawDate), -7, "d")
        },
        action: function () {
          t.changeDay(this, -7)
        }
      },
      prevDay: {
        text: "prevDayText",
        status: "prevDayStatus",
        keystroke: {
          keyCode: 37,
          ctrlKey: !0
        },
        enabled: function (n) {
          var i = n.curMinDate();
          return !i || t.add(t.newDate(n.drawDate), -1, "d").getTime() >= i.getTime()
        },
        date: function (n) {
          return t.add(t.newDate(n.drawDate), -1, "d")
        },
        action: function () {
          t.changeDay(this, -1)
        }
      },
      nextDay: {
        text: "nextDayText",
        status: "nextDayStatus",
        keystroke: {
          keyCode: 39,
          ctrlKey: !0
        },
        enabled: function (n) {
          var i = n.get("maxDate");
          return !i || t.add(t.newDate(n.drawDate), 1, "d").getTime() <= i.getTime()
        },
        date: function (n) {
          return t.add(t.newDate(n.drawDate), 1, "d")
        },
        action: function () {
          t.changeDay(this, 1)
        }
      },
      nextWeek: {
        text: "nextWeekText",
        status: "nextWeekStatus",
        keystroke: {
          keyCode: 40,
          ctrlKey: !0
        },
        enabled: function (n) {
          var i = n.get("maxDate");
          return !i || t.add(t.newDate(n.drawDate), 7, "d").getTime() <= i.getTime()
        },
        date: function (n) {
          return t.add(t.newDate(n.drawDate), 7, "d")
        },
        action: function () {
          t.changeDay(this, 7)
        }
      }
    },
    defaultOptions: {
      pickerClass: "",
      showOnFocus: !0,
      showTrigger: null,
      showAnim: "show",
      showOptions: {},
      showSpeed: "normal",
      popupContainer: null,
      alignment: "bottom",
      fixedWeeks: !1,
      firstDay: 0,
      calculateWeek: null,
      monthsToShow: 1,
      monthsOffset: 0,
      monthsToStep: 1,
      monthsToJump: 12,
      useMouseWheel: !0,
      changeMonth: !0,
      yearRange: "c-10:c+10",
      shortYearCutoff: "+10",
      showOtherMonths: !1,
      selectOtherMonths: !1,
      defaultDate: null,
      selectDefaultDate: !1,
      minDate: null,
      maxDate: null,
      dateFormat: "mm/dd/yyyy",
      autoSize: !1,
      rangeSelect: !1,
      rangeSeparator: " - ",
      multiSelect: 0,
      multiSeparator: ",",
      onDate: null,
      onShow: null,
      onChangeMonthYear: null,
      onSelect: null,
      onClose: null,
      altField: null,
      altFormat: null,
      constrainInput: !0,
      commandsAsDateFormat: !1,
      commands: {}
    },
    regionalOptions: {
      "": {
        monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
        dateFormat: "mm/dd/yyyy",
        firstDay: 0,
        renderer: {},
        prevText: "&lt;Prev",
        prevStatus: "Show the previous month",
        prevJumpText: "&lt;&lt;",
        prevJumpStatus: "Show the previous year",
        nextText: "Next&gt;",
        nextStatus: "Show the next month",
        nextJumpText: "&gt;&gt;",
        nextJumpStatus: "Show the next year",
        currentText: "Current",
        currentStatus: "Show the current month",
        todayText: "Today",
        todayStatus: "Show today's month",
        clearText: "Clear",
        clearStatus: "Clear all the dates",
        closeText: "Close",
        closeStatus: "Close the datepicker",
        yearStatus: "Change the year",
        earlierText: "&#160;&#160;▲",
        laterText: "&#160;&#160;▼",
        monthStatus: "Change the month",
        weekText: "Wk",
        weekStatus: "Week of the year",
        dayStatus: "Select DD, M d, yyyy",
        defaultStatus: "Select a date",
        isRTL: !1
      }
    },
    _disabled: [],
    _popupClass: i + "-popup",
    _triggerClass: i + "-trigger",
    _disableClass: i + "-disable",
    _monthYearClass: i + "-month-year",
    _curMonthClass: i + "-month-",
    _anyYearClass: i + "-any-year",
    _curDoWClass: i + "-dow-",
    _ticksTo1970: (718685 + Math.floor(1970 / 4) - Math.floor(1970 / 100) + Math.floor(1970 / 400)) * 864e9,
    _msPerDay: 864e5,
    ATOM: "yyyy-mm-dd",
    COOKIE: "D, dd M yyyy",
    FULL: "DD, MM d, yyyy",
    ISO_8601: "yyyy-mm-dd",
    JULIAN: "J",
    RFC_822: "D, d M yy",
    RFC_850: "DD, dd-M-yy",
    RFC_1036: "D, d M yy",
    RFC_1123: "D, d M yyyy",
    RFC_2822: "D, d M yyyy",
    RSS: "D, d M yy",
    TICKS: "!",
    TIMESTAMP: "@",
    W3C: "yyyy-mm-dd",
    formatDate: function (n, t, i) {
      var u;
      if (typeof n != "string" && (i = t, t = n, n = ""), !t) return "";
      n = n || this.defaultOptions.dateFormat;
      i = i || {};
      var h = i.dayNamesShort || this.defaultOptions.dayNamesShort,
        c = i.dayNames || this.defaultOptions.dayNames,
        l = i.monthNamesShort || this.defaultOptions.monthNamesShort,
        a = i.monthNames || this.defaultOptions.monthNames,
        v = i.calculateWeek || this.defaultOptions.calculateWeek,
        f = function (t, i) {
          for (var r = 1; u + r < n.length && n.charAt(u + r) === t;) r++;
          return u += r - 1, Math.floor(r / (i || 1)) > 1
        },
        e = function (n, t, i, r) {
          var u = "" + t;
          if (f(n, r))
            while (u.length < i) u = "0" + u;
          return u
        },
        s = function (n, t, i, r) {
          return f(n) ? r[t] : i[t]
        },
        r = "",
        o = !1;
      for (u = 0; u < n.length; u++)
        if (o) n.charAt(u) !== "'" || f("'") ? r += n.charAt(u) : o = !1;
        else switch (n.charAt(u)) {
          case "d":
            r += e("d", t.getDate(), 2);
            break;
          case "D":
            r += s("D", t.getDay(), h, c);
            break;
          case "o":
            r += e("o", this.dayOfYear(t), 3);
            break;
          case "w":
            r += e("w", v(t), 2);
            break;
          case "m":
            r += e("m", t.getMonth() + 1, 2);
            break;
          case "M":
            r += s("M", t.getMonth(), l, a);
            break;
          case "y":
            r += f("y", 2) ? t.getFullYear() : (t.getFullYear() % 100 < 10 ? "0" : "") + t.getFullYear() % 100;
            break;
          case "@":
            r += Math.floor(t.getTime() / 1e3);
            break;
          case "!":
            r += t.getTime() * 1e4 + this._ticksTo1970;
            break;
          case "'":
            f("'") ? r += "'" : o = !0;
            break;
          default:
            r += n.charAt(u)
        }
      return r
    },
    parseDate: function (n, t, i) {
      var h, e, k, a;
      if (typeof t == "undefined" || t === null) throw "Invalid arguments";
      if (t = typeof t == "object" ? t.toString() : t + "", t === "") return null;
      n = n || this.defaultOptions.dateFormat;
      i = i || {};
      h = i.shortYearCutoff || this.defaultOptions.shortYearCutoff;
      h = typeof h != "string" ? h : this.today().getFullYear() % 100 + parseInt(h, 10);
      var d = i.dayNamesShort || this.defaultOptions.dayNamesShort,
        g = i.dayNames || this.defaultOptions.dayNames,
        nt = i.monthNamesShort || this.defaultOptions.monthNamesShort,
        tt = i.monthNames || this.defaultOptions.monthNames,
        u = -1,
        o = -1,
        s = -1,
        v = -1,
        w = !1,
        y = !1,
        r = null,
        l = function (t, i) {
          for (var r = 1; e + r < n.length && n.charAt(e + r) === t;) r++;
          return e += r - 1, Math.floor(r / (i || 1)) > 1
        },
        c = function (n, i) {
          var u = l(n, i),
            e = [2, 3, u ? 4 : 2, 11, 20]["oy@!".indexOf(n) + 1],
            o = new RegExp("^-?\\d{1," + e + "}"),
            r = t.substring(f).match(o);
          if (!r) throw "Missing number at position {0}".replace(/\{0\}/, f);
          return f += r[0].length, parseInt(r[0], 10)
        },
        b = function (n, i, r, u) {
          for (var o = l(n, u) ? r : i, e = 0; e < o.length; e++)
            if (t.substr(f, o[e].length).toLowerCase() === o[e].toLowerCase()) return f += o[e].length, e + 1;
          throw "Unknown name at position {0}".replace(/\{0\}/, f);
        },
        p = function () {
          if (t.charAt(f) !== n.charAt(e)) throw "Unexpected literal at position {0}".replace(/\{0\}/, f);
          f++
        },
        f = 0;
      for (e = 0; e < n.length; e++)
        if (y) n.charAt(e) !== "'" || l("'") ? p() : y = !1;
        else switch (n.charAt(e)) {
          case "d":
            s = c("d");
            break;
          case "D":
            b("D", d, g);
            break;
          case "o":
            v = c("o");
            break;
          case "w":
            c("w");
            break;
          case "m":
            o = c("m");
            break;
          case "M":
            o = b("M", nt, tt);
            break;
          case "y":
            k = e;
            w = !l("y", 2);
            e = k;
            u = c("y", 2);
            break;
          case "@":
            r = this._normaliseDate(new Date(c("@") * 1e3));
            u = r.getFullYear();
            o = r.getMonth() + 1;
            s = r.getDate();
            break;
          case "!":
            r = this._normaliseDate(new Date((c("!") - this._ticksTo1970) / 1e4));
            u = r.getFullYear();
            o = r.getMonth() + 1;
            s = r.getDate();
            break;
          case "*":
            f = t.length;
            break;
          case "'":
            l("'") ? p() : y = !0;
            break;
          default:
            p()
        }
      if (f < t.length) throw "Additional text found at end";
      if (u === -1 ? u = this.today().getFullYear() : u < 100 && w && (u += h === -1 ? 1900 : this.today().getFullYear() - this.today().getFullYear() % 100 - (u <= h ? 0 : 100)), v > -1)
        for (o = 1, s = v, a = this.daysInMonth(u, o); s > a; a = this.daysInMonth(u, o)) o++, s -= a;
      if (r = this.newDate(u, o, s), r.getFullYear() !== u || r.getMonth() + 1 !== o || r.getDate() !== s) throw "Invalid date";
      return r
    },
    determineDate: function (n, i, r, u, f) {
      r && typeof r != "object" && (f = u, u = r, r = null);
      typeof u != "string" && (f = u, u = "");
      var e = function (n) {
        try {
          return t.parseDate(u, n, f)
        } catch (s) {}
        n = n.toLowerCase();
        for (var i = (n.match(/^c/) && r ? t.newDate(r) : null) || t.today(), o = /([+-]?[0-9]+)\s*(d|w|m|y)?/g, e = null; e = o.exec(n);) i = t.add(i, parseInt(e[1], 10), e[2] || "d");
        return i
      };
      return i = i ? t.newDate(i) : null, typeof n == "undefined" ? i : typeof n == "string" ? e(n) : typeof n == "number" ? isNaN(n) || n === Infinity || n === -Infinity ? i : t.add(t.today(), n, "d") : t.newDate(n)
    },
    daysInMonth: function (n, t) {
      return t = n.getFullYear ? n.getMonth() + 1 : t, n = n.getFullYear ? n.getFullYear() : n, this.newDate(n, t + 1, 0).getDate()
    },
    dayOfYear: function (n, i, r) {
      var u = n.getFullYear ? n : t.newDate(n, i, r),
        f = t.newDate(u.getFullYear(), 1, 1);
      return Math.floor((u.getTime() - f.getTime()) / t._msPerDay) + 1
    },
    iso8601Week: function (n, i, r) {
      var u = n.getFullYear ? new Date(n.getTime()) : t.newDate(n, i, r),
        f;
      return u.setDate(u.getDate() + 4 - (u.getDay() || 7)), f = u.getTime(), u.setMonth(0, 1), Math.floor(Math.round((f - u) / t._msPerDay) / 7) + 1
    },
    today: function () {
      return this._normaliseDate(new Date)
    },
    newDate: function (n, t, i) {
      return n ? n.getFullYear ? this._normaliseDate(new Date(n.getTime())) : new Date(n, t - 1, i, 12) : null
    },
    _normaliseDate: function (n) {
      return n && n.setHours(12, 0, 0, 0), n
    },
    year: function (n, t) {
      return n.setFullYear(t), this._normaliseDate(n)
    },
    month: function (n, t) {
      return n.setMonth(t - 1), this._normaliseDate(n)
    },
    day: function (n, t) {
      return n.setDate(t), this._normaliseDate(n)
    },
    add: function (n, i, r) {
      if (r === "d" || r === "w") this._normaliseDate(n), n.setDate(n.getDate() + i * (r === "w" ? 7 : 1));
      else {
        var u = n.getFullYear() + (r === "y" ? i : 0),
          f = n.getMonth() + (r === "m" ? i : 0);
        n.setTime(t.newDate(u, f + 1, Math.min(n.getDate(), this.daysInMonth(u, f + 1))).getTime())
      }
      return n
    },
    _applyMonthsOffset: function (i, r) {
      var u = r.options.monthsOffset;
      return n.isFunction(u) && (u = u.apply(r.elem[0], [i])), t.add(i, -u, "m")
    },
    _init: function () {
      this.defaultOptions.commands = this.commands;
      this.defaultOptions.calculateWeek = this.iso8601Week;
      this.regionalOptions[""].renderer = this.defaultRenderer;
      this._super()
    },
    _instSettings: function (i) {
      return {
        selectedDates: [],
        drawDate: null,
        pickingRange: !1,
        inline: n.inArray(i[0].nodeName.toLowerCase(), ["div", "span"]) > -1,
        get: function (i) {
          return n.inArray(i, ["defaultDate", "minDate", "maxDate"]) > -1 ? t.determineDate(this.options[i], null, this.selectedDates[0], this.options.dateFormat, this.getConfig()) : this.options[i]
        },
        curMinDate: function () {
          return this.pickingRange ? this.selectedDates[0] : this.get("minDate")
        },
        getConfig: function () {
          return {
            dayNamesShort: this.options.dayNamesShort,
            dayNames: this.options.dayNames,
            monthNamesShort: this.options.monthNamesShort,
            monthNames: this.options.monthNames,
            calculateWeek: this.options.calculateWeek,
            shortYearCutoff: this.options.shortYearCutoff
          }
        }
      }
    },
    _postAttach: function (i, r) {
      if (r.inline) r.drawDate = t._checkMinMax(t.newDate(r.selectedDates[0] || r.get("defaultDate") || t.today()), r), r.prevDate = t.newDate(r.drawDate), this._update(i[0]), n.fn.mousewheel && i.mousewheel(this._doMouseWheel);
      else {
        this._attachments(i, r);
        i.on("keydown." + r.name, this._keyDown).on("keypress." + r.name, this._keyPress).on("keyup." + r.name, this._keyUp);
        i.attr("disabled") && this.disable(i[0])
      }
    },
    _optionsChanged: function (i, r, u) {
      var f, e;
      u.calendar && u.calendar !== r.options.calendar && (f = function (n) {
        return typeof r.options[n] == "object" ? null : r.options[n]
      }, u = n.extend({
        defaultDate: f("defaultDate"),
        minDate: f("minDate"),
        maxDate: f("maxDate")
      }, u), r.selectedDates = [], r.drawDate = null);
      e = r.selectedDates;
      n.extend(r.options, u);
      this.setDate(i[0], e, null, !1, !0);
      r.pickingRange = !1;
      r.drawDate = t.newDate(this._checkMinMax((r.options.defaultDate ? r.get("defaultDate") : r.drawDate) || r.get("defaultDate") || t.today(), r));
      r.inline || this._attachments(i, r);
      (r.inline || r.div) && this._update(i[0])
    },
    _attachments: function (i, r) {
      var u, f, e;
      if (i.off("focus." + r.name), r.options.showOnFocus) i.on("focus." + r.name, this.show);
      r.trigger && r.trigger.remove();
      u = r.options.showTrigger;
      r.trigger = u ? n(u).clone().removeAttr("id").addClass(this._triggerClass)[r.options.isRTL ? "insertBefore" : "insertAfter"](i).click(function () {
        t.isDisabled(i[0]) || t[t.curInst === r ? "hide" : "show"](i[0])
      }) : n([]);
      this._autoSize(i, r);
      f = this._extractDates(r, i.val());
      f && this.setDate(i[0], f, null, !0);
      e = r.get("defaultDate");
      r.options.selectDefaultDate && e && r.selectedDates.length === 0 && this.setDate(i[0], t.newDate(e || t.today()))
    },
    _autoSize: function (n, i) {
      var r, u, f;
      i.options.autoSize && !i.inline && (r = t.newDate(2009, 10, 20), u = i.options.dateFormat, u.match(/[DM]/) && (f = function (n) {
        for (var i = 0, r = 0, t = 0; t < n.length; t++) n[t].length > i && (i = n[t].length, r = t);
        return r
      }, r.setMonth(f(i.options[u.match(/MM/) ? "monthNames" : "monthNamesShort"])), r.setDate(f(i.options[u.match(/DD/) ? "dayNames" : "dayNamesShort"]) + 20 - r.getDay())), i.elem.attr("size", t.formatDate(u, r, i.getConfig()).length))
    },
    _preDestroy: function (t, i) {
      i.trigger && i.trigger.remove();
      t.empty().off("." + i.name);
      i.inline && n.fn.mousewheel && t.unmousewheel();
      !i.inline && i.options.autoSize && t.removeAttr("size")
    },
    multipleEvents: function () {
      var n = arguments;
      return function () {
        for (var t = 0; t < n.length; t++) n[t].apply(this, arguments)
      }
    },
    enable: function (t) {
      if (t = n(t), t.hasClass(this._getMarker())) {
        var i = this._getInst(t);
        i.inline ? t.children("." + this._disableClass).remove().end().find("button,select").prop("disabled", !1).end().find("a").attr("href", "#") : (t.prop("disabled", !1), i.trigger.filter("button." + this._triggerClass).prop("disabled", !1).end().filter("img." + this._triggerClass).css({
          opacity: "1.0",
          cursor: ""
        }));
        this._disabled = n.map(this._disabled, function (n) {
          return n === t[0] ? null : n
        })
      }
    },
    disable: function (t) {
      var u, i;
      if (t = n(t), t.hasClass(this._getMarker())) {
        if (u = this._getInst(t), u.inline) {
          var r = t.children(":last"),
            e = r.offset(),
            f = {
              left: 0,
              top: 0
            };
          r.parents().each(function () {
            if (n(this).css("position") === "relative") return f = n(this).offset(), !1
          });
          i = t.css("zIndex");
          i = (i === "auto" ? 0 : parseInt(i, 10)) + 1;
          t.prepend('<div class="' + this._disableClass + '" style="width: ' + r.outerWidth() + "px; height: " + r.outerHeight() + "px; left: " + (e.left - f.left) + "px; top: " + (e.top - f.top) + "px; z-index: " + i + '"><\/div>').find("button,select").prop("disabled", !0).end().find("a").removeAttr("href")
        } else t.prop("disabled", !0), u.trigger.filter("button." + this._triggerClass).prop("disabled", !0).end().filter("img." + this._triggerClass).css({
          opacity: "0.5",
          cursor: "default"
        });
        this._disabled = n.map(this._disabled, function (n) {
          return n === t[0] ? null : n
        });
        this._disabled.push(t[0])
      }
    },
    isDisabled: function (t) {
      return t && n.inArray(t, this._disabled) > -1
    },
    show: function (i) {
      var r, s, u, f, e, o;
      if ((i = n(i.target || i), r = t._getInst(i), t.curInst !== r) && (t.curInst && t.hide(t.curInst, !0), !n.isEmptyObject(r)))
        if (r.lastVal = null, r.selectedDates = t._extractDates(r, i.val()), r.pickingRange = !1, r.drawDate = t._checkMinMax(t.newDate(r.selectedDates[0] || r.get("defaultDate") || t.today()), r), r.prevDate = t.newDate(r.drawDate), t.curInst = r, t._update(i[0], !0), s = t._checkOffset(r), r.div.css({
            left: s.left,
            top: s.top
          }), u = r.options.showAnim, f = r.options.showSpeed, f = f === "normal" && n.ui && parseInt(n.ui.version.substring(2)) >= 8 ? "_default" : f, n.effects && (n.effects[u] || n.effects.effect && n.effects.effect[u])) {
          e = r.div.data();
          for (o in e) o.match(/^ec\.storage\./) && (e[o] = r._mainDiv.css(o.replace(/ec\.storage\./, "")));
          r.div.data(e).show(u, r.options.showOptions, f)
        } else r.div[u || "show"](u ? f : 0)
    },
    _extractDates: function (n, i) {
      var r, u, f, o, e;
      if (i !== n.lastVal) {
        for (n.lastVal = i, i = i.split(n.options.multiSelect ? n.options.multiSeparator : n.options.rangeSelect ? n.options.rangeSeparator : "\x00"), r = [], u = 0; u < i.length; u++) try {
          if (f = t.parseDate(n.options.dateFormat, i[u], n.getConfig()), f) {
            for (o = !1, e = 0; e < r.length; e++)
              if (r[e].getTime() === f.getTime()) {
                o = !0;
                break
              } o || r.push(f)
          }
        } catch (s) {}
        return r.splice(n.options.multiSelect || (n.options.rangeSelect ? 2 : 1), r.length), n.options.rangeSelect && r.length === 1 && (r[1] = r[0]), r
      }
    },
    _update: function (i, r) {
      var u, e, f;
      i = n(i.target || i);
      u = t._getInst(i);
      n.isEmptyObject(u) || ((u.inline || t.curInst === u) && n.isFunction(u.options.onChangeMonthYear) && (!u.prevDate || u.prevDate.getFullYear() !== u.drawDate.getFullYear() || u.prevDate.getMonth() !== u.drawDate.getMonth()) && u.options.onChangeMonthYear.apply(i[0], [u.drawDate.getFullYear(), u.drawDate.getMonth() + 1]), u.inline ? (e = n("a, :input", i).index(n(":focus", i)), i.html(this._generateContent(i[0], u)), f = i.find("a, :input"), f.eq(Math.max(Math.min(e, f.length - 1), 0)).focus()) : t.curInst === u && (u.div || (u.div = n("<div><\/div>").addClass(this._popupClass).css({
        display: r ? "none" : "static",
        position: "absolute",
        left: i.offset().left,
        top: i.offset().top + i.outerHeight()
      }).appendTo(n(u.options.popupContainer || "body")), n.fn.mousewheel && u.div.mousewheel(this._doMouseWheel)), u.div.html(this._generateContent(i[0], u)), i.focus()))
    },
    _updateInput: function (i, r) {
      var u = this._getInst(i),
        f;
      if (!n.isEmptyObject(u)) {
        var e = "",
          o = "",
          s = u.options.multiSelect ? u.options.multiSeparator : u.options.rangeSeparator,
          h = u.options.altFormat || u.options.dateFormat;
        for (f = 0; f < u.selectedDates.length; f++) e += r ? "" : (f > 0 ? s : "") + t.formatDate(u.options.dateFormat, u.selectedDates[f], u.getConfig()), o += (f > 0 ? s : "") + t.formatDate(h, u.selectedDates[f], u.getConfig());
        u.inline || r || n(i).val(e);
        n(u.options.altField).val(o);
        !n.isFunction(u.options.onSelect) || r || u.inSelect || (u.inSelect = !0, u.options.onSelect.apply(i, [u.selectedDates]), u.inSelect = !1)
      }
    },
    _getBorders: function (n) {
      var t = function (n) {
        return {
          thin: 1,
          medium: 3,
          thick: 5
        } [n] || n
      };
      return [parseFloat(t(n.css("border-left-width"))), parseFloat(t(n.css("border-top-width")))]
    },
    _checkOffset: function (t) {
      var c = t.elem.is(":hidden") && t.trigger ? t.trigger : t.elem,
        i = c.offset(),
        a = n(window).width(),
        y = n(window).height(),
        r, u;
      if (a === 0) return i;
      r = !1;
      n(t.elem).parents().each(function () {
        return r = r || n(this).css("position") === "fixed", !r
      });
      var f = document.documentElement.scrollLeft || document.body.scrollLeft,
        e = document.documentElement.scrollTop || document.body.scrollTop,
        o = i.top - (r ? e : 0) - t.div.outerHeight(),
        l = i.top - (r ? e : 0) + c.outerHeight(),
        s = i.left - (r ? f : 0),
        h = i.left - (r ? f : 0) + c.outerWidth() - t.div.outerWidth(),
        v = i.left - f + t.div.outerWidth() > a,
        p = i.top - e + t.elem.outerHeight() + t.div.outerHeight() > y;
      return t.div.css("position", r ? "fixed" : "absolute"), u = t.options.alignment, i = u === "topLeft" ? {
        left: s,
        top: o
      } : u === "topRight" ? {
        left: h,
        top: o
      } : u === "bottomLeft" ? {
        left: s,
        top: l
      } : u === "bottomRight" ? {
        left: h,
        top: l
      } : u === "top" ? {
        left: t.options.isRTL || v ? h : s,
        top: o
      } : {
        left: t.options.isRTL || v ? h : s,
        top: p ? o : l
      }, i.left = Math.max(r ? 0 : f, i.left), i.top = Math.max(r ? 0 : e, i.top), i
    },
    _checkExternalClick: function (i) {
      if (t.curInst) {
        var r = n(i.target);
        r.closest("." + t._popupClass + ",." + t._triggerClass).length !== 0 || r.hasClass(t._getMarker()) || t.hide(t.curInst)
      }
    },
    hide: function (i, r) {
      var u, f, e, o, s;
      i && (u = this._getInst(i), n.isEmptyObject(u) && (u = i), u && u === t.curInst && (f = r ? "" : u.options.showAnim, e = u.options.showSpeed, e = e === "normal" && n.ui && parseInt(n.ui.version.substring(2)) >= 8 ? "_default" : e, o = function () {
        u.div && (u.div.remove(), u.div = null, t.curInst = null, n.isFunction(u.options.onClose) && u.options.onClose.apply(i, [u.selectedDates]))
      }, u.div.stop(), n.effects && (n.effects[f] || n.effects.effect && n.effects.effect[f]) ? u.div.hide(f, u.options.showOptions, e, o) : (s = f === "slideDown" ? "slideUp" : f === "fadeIn" ? "fadeOut" : "hide", u.div[s](f ? e : "", o)), f || o()))
    },
    _keyDown: function (i) {
      var f = i.data && i.data.elem || i.target,
        u = t._getInst(f),
        e = !1,
        r = null,
        o;
      if (u.inline || u.div) {
        if (i.keyCode === 9) t.hide(f);
        else if (i.keyCode === 13) t.selectDate(f, n("a." + u.options.renderer.highlightedClass, u.div)[0]), e = !0;
        else
          for (o in u.options.commands)
            if (u.options.commands.hasOwnProperty(o) && (r = u.options.commands[o], r.keystroke.keyCode === i.keyCode && !!r.keystroke.ctrlKey == !!(i.ctrlKey || i.metaKey) && !!r.keystroke.altKey === i.altKey && !!r.keystroke.shiftKey === i.shiftKey)) {
              t.performAction(f, o);
              e = !0;
              break
            }
      } else r = u.options.commands.current, r.keystroke.keyCode === i.keyCode && !!r.keystroke.ctrlKey == !!(i.ctrlKey || i.metaKey) && !!r.keystroke.altKey === i.altKey && !!r.keystroke.shiftKey === i.shiftKey && (t.show(f), e = !0);
      return u.ctrlKey = i.keyCode < 48 && i.keyCode !== 32 || i.ctrlKey || i.metaKey, e && (i.preventDefault(), i.stopPropagation()), !e
    },
    _keyPress: function (i) {
      var r = t._getInst(i.data && i.data.elem || i.target),
        u, f;
      return !n.isEmptyObject(r) && r.options.constrainInput ? (u = String.fromCharCode(i.keyCode || i.charCode), f = t._allowedChars(r), i.metaKey || r.ctrlKey || u < " " || !f || f.indexOf(u) > -1) : !0
    },
    _allowedChars: function (n) {
      for (var u, t = n.options.multiSelect ? n.options.multiSeparator : n.options.rangeSelect ? n.options.rangeSeparator : "", e = !1, i = !1, f = n.options.dateFormat, r = 0; r < f.length; r++)
        if (u = f.charAt(r), e) u === "'" && f.charAt(r + 1) !== "'" ? e = !1 : t += u;
        else switch (u) {
          case "d":
          case "m":
          case "o":
          case "w":
            t += i ? "" : "0123456789";
            i = !0;
            break;
          case "y":
          case "@":
          case "!":
            t += (i ? "" : "0123456789") + "-";
            i = !0;
            break;
          case "J":
            t += (i ? "" : "0123456789") + "-.";
            i = !0;
            break;
          case "D":
          case "M":
          case "Y":
            return null;
          case "'":
            f.charAt(r + 1) === "'" ? t += "'" : e = !0;
            break;
          default:
            t += u
        }
      return t
    },
    _keyUp: function (i) {
      var f = i.data && i.data.elem || i.target,
        r = t._getInst(f),
        u;
      if (!n.isEmptyObject(r) && !r.ctrlKey && r.lastVal !== r.elem.val()) try {
        u = t._extractDates(r, r.elem.val());
        u.length > 0 && t.setDate(f, u, null, !0)
      } catch (e) {}
      return !0
    },
    _doMouseWheel: function (i, r) {
      var u = t.curInst && t.curInst.elem[0] || n(i.target).closest("." + t._getMarker())[0],
        f;
      t.isDisabled(u) || (f = t._getInst(u), f.options.useMouseWheel && (r = r < 0 ? -1 : 1, t.changeMonth(u, -f.options[i.ctrlKey ? "monthsToJump" : "monthsToStep"] * r)), i.preventDefault())
    },
    clear: function (i) {
      var r = this._getInst(i),
        u;
      n.isEmptyObject(r) || (r.selectedDates = [], this.hide(i), u = r.get("defaultDate"), r.options.selectDefaultDate && u ? this.setDate(i, t.newDate(u || t.today())) : this._updateInput(i))
    },
    getDate: function (t) {
      var i = this._getInst(t);
      return n.isEmptyObject(i) ? [] : i.selectedDates
    },
    setDate: function (i, r, u, f, e) {
      var o = this._getInst(i),
        h, s, l, c;
      if (!n.isEmptyObject(o)) {
        n.isArray(r) || (r = [r], u && r.push(u));
        var a = o.get("minDate"),
          v = o.get("maxDate"),
          y = o.selectedDates[0];
        for (o.selectedDates = [], h = 0; h < r.length; h++)
          if (s = t.determineDate(r[h], null, y, o.options.dateFormat, o.getConfig()), s && (!a || s.getTime() >= a.getTime()) && (!v || s.getTime() <= v.getTime())) {
            for (l = !1, c = 0; c < o.selectedDates.length; c++)
              if (o.selectedDates[c].getTime() === s.getTime()) {
                l = !0;
                break
              } l || o.selectedDates.push(s)
          } if (o.selectedDates.splice(o.options.multiSelect || (o.options.rangeSelect ? 2 : 1), o.selectedDates.length), o.options.rangeSelect) {
          switch (o.selectedDates.length) {
            case 1:
              o.selectedDates[1] = o.selectedDates[0];
              break;
            case 2:
              o.selectedDates[1] = o.selectedDates[0].getTime() > o.selectedDates[1].getTime() ? o.selectedDates[0] : o.selectedDates[1]
          }
          o.pickingRange = !1
        }
        o.prevDate = o.drawDate ? t.newDate(o.drawDate) : null;
        o.drawDate = this._checkMinMax(t.newDate(o.selectedDates[0] || o.get("defaultDate") || t.today()), o);
        e || (this._update(i), this._updateInput(i, f))
      }
    },
    isSelectable: function (i, r) {
      var u = this._getInst(i);
      return n.isEmptyObject(u) ? !1 : (r = t.determineDate(r, u.selectedDates[0] || this.today(), null, u.options.dateFormat, u.getConfig()), this._isSelectable(i, r, u.options.onDate, u.get("minDate"), u.get("maxDate")))
    },
    _isSelectable: function (t, i, r, u, f) {
      var e = typeof r == "boolean" ? {
        selectable: r
      } : n.isFunction(r) ? r.apply(t, [i, !0]) : {};
      return e.selectable !== !1 && (!u || i.getTime() >= u.getTime()) && (!f || i.getTime() <= f.getTime())
    },
    performAction: function (t, i) {
      var r = this._getInst(t),
        u;
      n.isEmptyObject(r) || this.isDisabled(t) || (u = r.options.commands, u[i] && u[i].enabled.apply(t, [r]) && u[i].action.apply(t, [r]))
    },
    showMonth: function (i, r, u, f) {
      var e = this._getInst(i),
        o;
      n.isEmptyObject(e) || typeof f == "undefined" && e.drawDate.getFullYear() === r && e.drawDate.getMonth() + 1 === u || (e.prevDate = t.newDate(e.drawDate), o = this._checkMinMax(typeof r != "undefined" ? t.newDate(r, u, 1) : t.today(), e), e.drawDate = t.newDate(o.getFullYear(), o.getMonth() + 1, typeof f != "undefined" ? f : Math.min(e.drawDate.getDate(), t.daysInMonth(o.getFullYear(), o.getMonth() + 1))), this._update(i))
    },
    changeMonth: function (i, r) {
      var f = this._getInst(i),
        u;
      n.isEmptyObject(f) || (u = t.add(t.newDate(f.drawDate), r, "m"), this.showMonth(i, u.getFullYear(), u.getMonth() + 1))
    },
    changeDay: function (i, r) {
      var f = this._getInst(i),
        u;
      n.isEmptyObject(f) || (u = t.add(t.newDate(f.drawDate), r, "d"), this.showMonth(i, u.getFullYear(), u.getMonth() + 1, u.getDate()))
    },
    _checkMinMax: function (n, i) {
      var r = i.get("minDate"),
        u = i.get("maxDate");
      return n = r && n.getTime() < r.getTime() ? t.newDate(r) : n, u && n.getTime() > u.getTime() ? t.newDate(u) : n
    },
    retrieveDate: function (t, i) {
      var r = this._getInst(t);
      return n.isEmptyObject(r) ? null : this._normaliseDate(new Date(parseInt(i.className.replace(/^.*dp(-?\d+).*$/, "$1"), 10)))
    },
    selectDate: function (i, r) {
      var u = this._getInst(i),
        f, o, e;
      if (!n.isEmptyObject(u) && !this.isDisabled(i)) {
        if (f = this.retrieveDate(i, r), u.options.multiSelect) {
          for (o = !1, e = 0; e < u.selectedDates.length; e++)
            if (f.getTime() === u.selectedDates[e].getTime()) {
              u.selectedDates.splice(e, 1);
              o = !0;
              break
            }! o && u.selectedDates.length < u.options.multiSelect && u.selectedDates.push(f)
        } else u.options.rangeSelect ? (u.pickingRange ? u.selectedDates[1] = f : u.selectedDates = [f, f], u.pickingRange = !u.pickingRange) : u.selectedDates = [f];
        u.fromSelect = !0;
        u.prevDate = u.drawDate = t.newDate(f);
        this._updateInput(i);
        u.inline || u.pickingRange || u.selectedDates.length < (u.options.multiSelect || (u.options.rangeSelect ? 2 : 1)) ? this._update(i) : this.hide(i);
        u.fromSelect = !1
      }
    },
    _generateContent: function (i, r) {
      function b() {
        (r.inline ? n(this).closest("." + e._getMarker()) : r.div).find(r.options.renderer.daySelector + " a").removeClass(r.options.renderer.highlightedClass)
      }
      var f = r.options.monthsToShow,
        o, a, s, v, h, u, y, c, w, e, l, p;
      for (f = n.isArray(f) ? f : [1, f], r.generateDate ? r.fromSelect || (r.generateDate = r.drawDate) : r.generateDate = r.drawDate, r.drawDate = f.length > 1 && r.fromSelect ? this._checkMinMax(r.generateDate || r.get("defaultDate") || t.today(), r) : this._checkMinMax(r.drawDate || r.get("defaultDate") || t.today(), r), o = t._applyMonthsOffset(t.newDate(r.drawDate), r), a = "", s = 0; s < f[0]; s++) {
        for (v = "", h = 0; h < f[1]; h++) v += this._generateMonth(i, r, o.getFullYear(), o.getMonth() + 1, r.options.renderer, s === 0 && h === 0), t.add(o, 1, "m");
        a += this._prepare(r.options.renderer.monthRow, r).replace(/\{months\}/, v)
      }
      u = this._prepare(r.options.renderer.picker, r).replace(/\{months\}/, a).replace(/\{weekHeader\}/g, this._generateDayHeaders(r, r.options.renderer));
      y = function (n, f, e, o, s) {
        if (u.indexOf("{" + n + ":" + o + "}") !== -1) {
          var h = r.options.commands[o],
            c = r.options.commandsAsDateFormat ? h.date.apply(i, [r]) : null;
          u = u.replace(new RegExp("\\{" + n + ":" + o + "\\}", "g"), "<" + f + (h.status ? ' title="' + r.options[h.status] + '"' : "") + ' class="' + r.options.renderer.commandClass + " " + r.options.renderer.commandClass + "-" + o + " " + s + (h.enabled(r) ? "" : " " + r.options.renderer.disabledClass) + '">' + (c ? t.formatDate(r.options[h.text], c, r.getConfig()) : r.options[h.text]) + "<\/" + e + ">")
        }
      };
      for (c in r.options.commands) r.options.commands.hasOwnProperty(c) && (y("button", 'button type="button"', "button", c, r.options.renderer.commandButtonClass), y("link", 'a href="javascript:void(0)"', "a", c, r.options.renderer.commandLinkClass));
      return u = n(u), f[1] > 1 && (w = 0, n(r.options.renderer.monthSelector, u).each(function () {
        var t = ++w % f[1];
        n(this).addClass(t === 1 ? "first" : t === 0 ? "last" : "")
      })), e = this, u.find(r.options.renderer.daySelector + " a").hover(function () {
        b.apply(this);
        n(this).addClass(r.options.renderer.highlightedClass)
      }, b).click(function () {
        e.selectDate(i, this)
      }).end().find("select." + this._monthYearClass + ":not(." + this._anyYearClass + ")").change(function () {
        var t = n(this).val().split("/");
        e.showMonth(i, parseInt(t[1], 10), parseInt(t[0], 10))
      }).end().find("select." + this._anyYearClass).click(function () {
        n(this).css("visibility", "hidden").next("input").css({
          left: this.offsetLeft,
          top: this.offsetTop,
          width: this.offsetWidth,
          height: this.offsetHeight
        }).show().focus()
      }).end().find("input." + e._monthYearClass).change(function () {
        try {
          var t = parseInt(n(this).val(), 10);
          t = isNaN(t) ? r.drawDate.getFullYear() : t;
          e.showMonth(i, t, r.drawDate.getMonth() + 1, r.drawDate.getDate())
        } catch (u) {
          window.alert(u)
        }
      }).keydown(function (t) {
        t.keyCode === 13 ? n(t.elem).change() : t.keyCode === 27 && (n(t.elem).hide().prev("select").css("visibility", "visible"), r.elem.focus())
      }), l = {
        elem: r.elem[0]
      }, u.keydown(l, this._keyDown).keypress(l, this._keyPress).keyup(l, this._keyUp), u.find("." + r.options.renderer.commandClass).click(function () {
        if (!n(this).hasClass(r.options.renderer.disabledClass)) {
          var u = this.className.replace(new RegExp("^.*" + r.options.renderer.commandClass + "-([^ ]+).*$"), "$1");
          t.performAction(i, u)
        }
      }), r.options.isRTL && u.addClass(r.options.renderer.rtlClass), f[0] * f[1] > 1 && u.addClass(r.options.renderer.multiClass), r.options.pickerClass && u.addClass(r.options.pickerClass), n("body").append(u), p = 0, u.find(r.options.renderer.monthSelector).each(function () {
        p += n(this).outerWidth()
      }), u.width(p / f[0]), n.isFunction(r.options.onShow) && r.options.onShow.apply(i, [u, r]), u
    },
    _generateMonth: function (i, r, u, f, e, o) {
      var ot = t.daysInMonth(u, f),
        c = r.options.monthsToShow,
        v, w, b, ft, k, d, y, p, l, a, h, et;
      c = n.isArray(c) ? c : [1, c];
      var g = r.options.fixedWeeks || c[0] * c[1] > 1,
        nt = r.options.firstDay,
        tt = (t.newDate(u, f, 1).getDay() - nt + 7) % 7,
        st = g ? 6 : Math.ceil((tt + ot) / 7),
        it = r.options.selectOtherMonths && r.options.showOtherMonths,
        rt = r.pickingRange ? r.selectedDates[0] : r.get("minDate"),
        ut = r.get("maxDate"),
        ht = e.week.indexOf("{weekOfYear}") > -1,
        ct = t.today(),
        s = t.newDate(u, f, 1);
      for (t.add(s, -tt - (g && s.getDay() === nt ? 7 : 0), "d"), v = s.getTime(), w = "", b = 0; b < st; b++) {
        for (ft = ht ? '<span class="dp' + v + '">' + (n.isFunction(r.options.calculateWeek) ? r.options.calculateWeek(s) : 0) + "<\/span>" : "", k = "", d = 0; d < 7; d++) {
          if (y = !1, r.options.rangeSelect && r.selectedDates.length > 0) y = s.getTime() >= r.selectedDates[0] && s.getTime() <= r.selectedDates[1];
          else
            for (p = 0; p < r.selectedDates.length; p++)
              if (r.selectedDates[p].getTime() === s.getTime()) {
                y = !0;
                break
              } l = n.isFunction(r.options.onDate) ? r.options.onDate.apply(i, [s, s.getMonth() + 1 === f]) : {};
          a = (it || s.getMonth() + 1 === f) && this._isSelectable(i, s, l.selectable, rt, ut);
          k += this._prepare(e.day, r).replace(/\{day\}/g, (a ? '<a href="javascript:void(0)"' : "<span") + ' class="dp' + v + " " + (l.dateClass || "") + (y && (it || s.getMonth() + 1 === f) ? " " + e.selectedClass : "") + (a ? " " + e.defaultClass : "") + ((s.getDay() || 7) < 6 ? "" : " " + e.weekendClass) + (s.getMonth() + 1 === f ? "" : " " + e.otherMonthClass) + (s.getTime() === ct.getTime() && s.getMonth() + 1 === f ? " " + e.todayClass : "") + (s.getTime() === r.drawDate.getTime() && s.getMonth() + 1 === f ? " " + e.highlightedClass : "") + '"' + (l.title || r.options.dayStatus && a ? ' title="' + (l.title || t.formatDate(r.options.dayStatus, s, r.getConfig())) + '"' : "") + ">" + (r.options.showOtherMonths || s.getMonth() + 1 === f ? l.content || s.getDate() : "&#160;") + (a ? "<\/a>" : "<\/span>"));
          t.add(s, 1, "d");
          v = s.getTime()
        }
        w += this._prepare(e.week, r).replace(/\{days\}/g, k).replace(/\{weekOfYear\}/g, ft)
      }
      return h = this._prepare(e.month, r).match(/\{monthHeader(:[^\}]+)?\}/), h = h[0].length <= 13 ? "MM yyyy" : h[0].substring(13, h[0].length - 1), h = o ? this._generateMonthSelection(r, u, f, rt, ut, h, e) : t.formatDate(h, t.newDate(u, f, 1), r.getConfig()), et = this._prepare(e.weekHeader, r).replace(/\{days\}/g, this._generateDayHeaders(r, e)), this._prepare(e.month, r).replace(/\{monthHeader(:[^\}]+)?\}/g, h).replace(/\{weekHeader\}/g, et).replace(/\{weeks\}/g, w)
    },
    _generateDayHeaders: function (n, t) {
      for (var i, u = "", r = 0; r < 7; r++) i = (r + n.options.firstDay) % 7, u += this._prepare(t.dayHeader, n).replace(/\{day\}/g, '<span class="' + this._curDoWClass + i + '" title="' + n.options.dayNames[i] + '">' + n.options.dayNamesMin[i] + "<\/span>");
      return u
    },
    _generateMonthSelection: function (n, i, r, u, f, e) {
      var c, h;
      if (!n.options.changeMonth) return t.formatDate(e, t.newDate(i, r, 1), n.getConfig());
      var b = n.options["monthNames" + (e.match(/mm/i) ? "" : "Short")],
        p = e.replace(/m+/i, "\\x2E").replace(/y+/i, "\\x2F"),
        l = '<select class="' + this._monthYearClass + '" title="' + n.options.monthStatus + '">';
      for (c = 1; c <= 12; c++)(!u || t.newDate(i, c, t.daysInMonth(i, c)).getTime() >= u.getTime()) && (!f || t.newDate(i, c, 1).getTime() <= f.getTime()) && (l += '<option value="' + c + "/" + i + '"' + (r === c ? ' selected="selected"' : "") + ">" + b[c - 1] + "<\/option>");
      if (l += "<\/select>", p = p.replace(/\\x2E/, l), h = n.options.yearRange, h === "any") l = '<select class="' + this._monthYearClass + " " + this._anyYearClass + '" title="' + n.options.yearStatus + '"><option>' + i + '<\/option><\/select><input class="' + this._monthYearClass + " " + this._curMonthClass + r + '" value="' + i + '">';
      else {
        h = h.split(":");
        var w = t.today().getFullYear(),
          o = h[0].match("c[+-].*") ? i + parseInt(h[0].substring(1), 10) : (h[0].match("[+-].*") ? w : 0) + parseInt(h[0], 10),
          s = h[1].match("c[+-].*") ? i + parseInt(h[1].substring(1), 10) : (h[1].match("[+-].*") ? w : 0) + parseInt(h[1], 10);
        l = '<select class="' + this._monthYearClass + '" title="' + n.options.yearStatus + '">';
        o = t.add(t.newDate(o + 1, 1, 1), -1, "d");
        s = t.newDate(s, 1, 1);
        var v = function (n, t) {
            n !== 0 && (l += '<option value="' + r + "/" + n + '"' + (i === n ? ' selected="selected"' : "") + ">" + (t || n) + "<\/option>")
          },
          y = null,
          a = null;
        if (o.getTime() < s.getTime()) {
          for (o = (u && u.getTime() > o.getTime() ? u : o).getFullYear(), s = (f && f.getTime() < s.getTime() ? f : s).getFullYear(), y = Math.floor((s - o) / 2), (!u || u.getFullYear() < o) && v(o - y, n.options.earlierText), a = o; a <= s; a++) v(a);
          (!f || f.getFullYear() > s) && v(s + y, n.options.laterText)
        } else {
          for (o = (f && f.getTime() < o.getTime() ? f : o).getFullYear(), s = (u && u.getTime() > s.getTime() ? u : s).getFullYear(), y = Math.floor((o - s) / 2), (!f || f.getFullYear() > o) && v(o + y, n.options.earlierText), a = o; a >= s; a--) v(a);
          (!u || u.getFullYear() < s) && v(s - y, n.options.laterText)
        }
        l += "<\/select>"
      }
      return p.replace(/\\x2F/, l)
    },
    _prepare: function (n, t) {
      var r = function (t, i) {
          for (var r, u;;) {
            if (r = n.indexOf("{" + t + ":start}"), r === -1) return;
            u = n.substring(r).indexOf("{" + t + ":end}");
            u > -1 && (n = n.substring(0, r) + (i ? n.substr(r + t.length + 8, u - t.length - 8) : "") + n.substring(r + u + t.length + 6))
          }
        },
        u, i;
      for (r("inline", t.inline), r("popup", !t.inline), u = /\{l10n:([^\}]+)\}/, i = null; i = u.exec(n);) n = n.replace(i[0], t.options[i[1]]);
      return n
    }
  });
  t = n.datepick;
  n(function () {
    n(document).on("mousedown." + i, t._checkExternalClick).on("resize." + i, function () {
      t.hide(t.curInst)
    })
  })
}(jQuery);
! function (n) {
  "use strict";
  var t = {
    picker: '<div{popup:start} id="ui-datepicker-div"{popup:end} class="ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all{inline:start} ui-datepicker-inline{inline:end}"><div class="ui-datepicker-header ui-widget-header ui-helper-clearfix ui-corner-all">{link:prev}{link:today}{link:next}<\/div>{months}{popup:start}<div class="ui-datepicker-header ui-widget-header ui-helper-clearfix ui-corner-all">{button:clear}{button:close}<\/div>{popup:end}<div class="ui-helper-clearfix"><\/div><\/div>',
    monthRow: '<div class="ui-datepicker-row-break">{months}<\/div>',
    month: '<div class="ui-datepicker-group"><div class="ui-datepicker-header ui-widget-header ui-helper-clearfix ui-corner-all">{monthHeader:MM yyyy}<\/div><table class="ui-datepicker-calendar"><thead>{weekHeader}<\/thead><tbody>{weeks}<\/tbody><\/table><\/div>',
    weekHeader: "<tr>{days}<\/tr>",
    dayHeader: "<th>{day}<\/th>",
    week: "<tr>{days}<\/tr>",
    day: "<td>{day}<\/td>",
    monthSelector: ".ui-datepicker-group",
    daySelector: "td",
    rtlClass: "ui-datepicker-rtl",
    multiClass: "ui-datepicker-multi",
    defaultClass: "ui-state-default",
    selectedClass: "ui-state-active",
    highlightedClass: "ui-state-hover",
    todayClass: "ui-state-highlight",
    otherMonthClass: "ui-datepicker-other-month",
    weekendClass: "ui-datepicker-week-end",
    commandClass: "ui-datepicker-cmd",
    commandButtonClass: "ui-state-default ui-corner-all",
    commandLinkClass: "",
    disabledClass: "ui-datepicker-disabled"
  };
  n.extend(n.datepick, {
    weekOfYearRenderer: n.extend({}, n.datepick.defaultRenderer, {
      weekHeader: '<tr><th class="datepick-week"><span title="{l10n:weekStatus}">{l10n:weekText}<\/span><\/th>{days}<\/tr>',
      week: '<tr><td class="datepick-week">{weekOfYear}<\/td>{days}<\/tr>'
    }),
    themeRollerRenderer: t,
    themeRollerWeekOfYearRenderer: n.extend({}, t, {
      weekHeader: '<tr><th class="ui-state-hover"><span>{l10n:weekText}<\/span><\/th>{days}<\/tr>',
      week: '<tr><td class="ui-state-hover">{weekOfYear}<\/td>{days}<\/tr>'
    }),
    noWeekends: function (n) {
      return {
        selectable: (n.getDay() || 7) < 6
      }
    },
    changeFirstDay: function (t) {
      var i = n(this);
      t.find("th span").each(function () {
        var t = n(this).parent();
        t.is(".datepick-week") || t.is(".ui-state-hover") || n('<a href="#" class="' + this.className + '" title="Change first day of the week">' + n(this).text() + "<\/a>").click(function () {
          var n = parseInt(this.className.replace(/^.*datepick-dow-(\d+).*$/, "$1"), 10);
          return i.datepick("option", {
            firstDay: n
          }), !1
        }).replaceAll(this)
      })
    },
    hoverCallback: function (t) {
      return function (i, r) {
        var u = this,
          f = r.get("renderer");
        i.find(f.daySelector + " a, " + f.daySelector + " span").hover(function () {
          t.apply(u, [n.datepick.retrieveDate(u, this), "a" === this.nodeName.toLowerCase()])
        }, function () {
          t.apply(u, [])
        })
      }
    },
    highlightWeek: function (t, i) {
      var r = i.get("renderer");
      t.find(r.daySelector + " a, " + r.daySelector + " span").hover(function () {
        n(this).parents("tr").find(r.daySelector + " *").addClass(r.highlightedClass)
      }, function () {
        n(this).parents("tr").find(r.daySelector + " *").removeClass(r.highlightedClass)
      })
    },
    showStatus: function (i, r) {
      var e = r.get("renderer"),
        o = e.selectedClass === t.selectedClass,
        u = r.get("defaultStatus") || "&#160;",
        f = n('<div class="' + (o ? "ui-datepicker-status ui-widget-header ui-helper-clearfix ui-corner-all" : "datepick-status") + '">' + u + "<\/div>").insertAfter(i.find(".datepick-month-row:last,.ui-datepicker-row-break:last"));
      i.find("*[title]").each(function () {
        var t = n(this).attr("title");
        n(this).removeAttr("title").hover(function () {
          f.text(t || u)
        }, function () {
          f.text(u)
        })
      })
    },
    monthNavigation: function (i, r) {
      for (var c = n(this), a = r.get("renderer"), v = a.selectedClass === t.selectedClass, s = r.curMinDate(), h = r.get("maxDate"), l = r.get("monthNames"), y = r.get("monthNamesShort"), p = r.drawDate.getMonth(), f = r.drawDate.getFullYear(), o = !1, e = '<div class="' + (v ? "ui-datepicker-month-nav" : "datepick-month-nav") + '" style="display: none;">', u = 0; u < l.length; u++) o = (!s || new Date(f, u + 1, 0).getTime() >= s.getTime()) && (!h || new Date(f, u, 1).getTime() <= h.getTime()), e += "<div>" + (o ? '<a href="#" class="dp' + new Date(f, u, 1).getTime() + '"' : "<span") + ' title="' + l[u] + '">' + y[u] + (o ? "<\/a>" : "<\/span>") + "<\/div>";
      for (u = -6; u <= 6; u++) 0 !== u && (o = (!s || new Date(f + u, 11, 31).getTime() >= s.getTime()) && (!h || new Date(f + u, 0, 1).getTime() <= h.getTime()), e += "<div>" + (o ? '<a href="#" class="dp' + new Date(f + u, p, 1).getTime() + '"' : "<span") + ' title="' + (f + u) + '">' + (f + u) + (o ? "<\/a>" : "<\/span>") + "<\/div>");
      e += "<\/div>";
      e = n(e).insertAfter(i.find("div.datepick-nav,div.ui-datepicker-header:first"));
      e.find("a").click(function () {
        var t = n.datepick.retrieveDate(c[0], this);
        return e.slideToggle(function () {
          c.datepick("showMonth", t.getFullYear(), t.getMonth() + 1)
        }), !1
      });
      i.find("div.datepick-month-header,div.ui-datepicker-month-header").click(function () {
        e.slideToggle()
      }).css("cursor", "pointer")
    },
    selectWeek: function (t, i) {
      var r = n(this);
      t.find("td.datepick-week span,td.ui-state-hover span").each(function () {
        n('<a href="#" class="' + this.className + '" title="Select the entire week">' + n(this).text() + "<\/a>").click(function () {
          for (var u = r.datepick("retrieveDate", this), t = [u], f = 1; f < 7; f++) t.push(u = n.datepick.add(n.datepick.newDate(u), 1, "d"));
          return i.get("rangeSelect") && t.splice(1, t.length - 2), r.datepick("setDate", t).datepick("hide"), !1
        }).replaceAll(this)
      })
    },
    selectMonth: function (t, i) {
      var r = n(this);
      t.find("th.datepick-week span,th.ui-state-hover span").each(function () {
        n('<a href="#" title="Select the entire month">' + n(this).text() + "<\/a>").click(function () {
          for (var t = r.datepick("retrieveDate", n(this).parents("table").find("td:not(.datepick-week):not(.ui-state-hover) *:not(.datepick-other-month):not(.ui-datepicker-other-month)")[0]), u = [t], e = n.datepick.daysInMonth(t), f = 1; f < e; f++) u.push(t = n.datepick.add(n.datepick.newDate(t), 1, "d"));
          return i.get("rangeSelect") && u.splice(1, u.length - 2), r.datepick("setDate", u).datepick("hide"), !1
        }).replaceAll(this)
      })
    },
    monthOnly: function (t) {
      var i = n(this);
      n('<div style="text-align: center;"><button type="button">Select<\/button><\/div>').insertAfter(t.find(".datepick-month-row:last,.ui-datepicker-row-break:last")).children().click(function () {
        var r = t.find(".datepick-month-year:first").val().split("/");
        i.datepick("setDate", n.datepick.newDate(parseInt(r[1], 10), parseInt(r[0], 10), 1)).datepick("hide")
      });
      t.find(".datepick-month-row table,.ui-datepicker-row-break table").remove()
    }
  })
}(jQuery),
function (n) {
  function t(t) {
    n.focusFx.processingAutocomplete && (n.focusFx.processingAutocompleteCallback = t)
  }

  function i() {
    n.isFunction(n.focusFx.processingAutocompleteCallback) && (n.focusFx.processingAutocompleteCallback(), n.focusFx.processingAutocompleteCallback = !1)
  }

  function r(n) {
    return n.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
  }
  n.focusFx || (n.focusFx = {});
  n.extend(n.focusFx, {
    safeSubmit: !1,
    requiredFields: [],
    countQueued: !1,
    processingAutocomplete: !1,
    processingAutocompleteCallback: !1,
    countChangedMap: !1,
    countChangedResults: !1,
    $criteriaSpan: null,
    $mapTab: null,
    $resultsTab: null,
    searchForm: function () {
      function h(n) {
        return n.indexOf("f_11_") > -1 ? !0 : "ordered"
      }

      function c(t, r, u, f, e, o, s, c, l) {
        var b, y, p, w, v, a;
        f == undefined && (f = "Data");
        e == undefined && (e = "Description");
        o == undefined && (o = "AdditionalColumnDescription");
        b = [];
        u.substr(0, 6) == "f_517_" && (b = ["f_517_MH", "f_517_MNH", "f_517_MH1"]);
        var k = !0,
          d = !1,
          g = !1,
          nt = !1;
        return s == null || s.length == 0 ? s = {} : (s = JSON.parse(s), s.multiple != null && (k = s.multiple), s.matchCase != null && (nt = s.matchCase), s.allowCommas != null && (d = s.allowCommas), s.nameDescLabel != null && (g = s.nameDescLabel)), y = 10, p = null, n(t).hasClass("f-form-erms") ? (p = function () {
          return n.focusFx.searchFormBuildData(n(".f-form-erms"))
        }, y = 0) : (p = function () {
          return n.focusFx.searchFormBuildData(n(t))
        }, y = 0), w = null, c != null && c.length > 0 ? (v = u.split("_"), window.top._cacheData != null && (a = v.length >= 4 ? v[3] : "1", c == "2" ? r = window.top._cacheData[v[1]] : c == "1" ? (a.indexOf("-") >= 0 && (a = a.split("-")[0]), r = window.top._cacheData[v[1]][a]) : c == "3" && a.indexOf("-") == -1 && (r = window.top._cacheData[v[1]][a]), w = function (n) {
          return l ? n.data.Data + " - " + n.data.Description : n.data.Data
        })) : l && (w = function (n) {
          return n.data.Data + " - " + n.data.Description
        }), n("ul." + u).autoCompletefb({
          urlLookup: r,
          deleteImg: g_acfbDeleteImg,
          mutexControls: b,
          nameDescLabel: g,
          allowCommas: d,
          acOptions: {
            dataType: "json",
            width: 300,
            multiple: k,
            cacheLength: y,
            parse: function (n) {
              for (var i = [], t = 0; t < n.rows.length; t++) i[t] = {
                data: n.rows[t],
                value: n.rows[t][f],
                result: n.rows[t][f]
              };
              return i
            },
            formatItem: function (n) {
              return n[e].length > 0 ? n[o] ? n[f] + " - " + n[e] + " - " + n[o] : n[f] + " - " + n[e] : n[f]
            },
            extraParams: s,
            FormData: p,
            noResultsMessage: "No Results Found.",
            matchContains: h(u),
            formatLabel: w
          },
          processBegin: function () {
            n.focusFx.processingAutocomplete = !0
          },
          processEnd: function () {
            n.focusFx.processingAutocomplete = !1;
            i()
          }
        })
      }
      var f, t, r, e, u, o, s;
      isTabletDevice() ? n(window).bind("orientationchange", resizePage) : n(window).bind("resize", resizePage);
      resizePage();
      n("form").submit(function () {
        return n.focusFx.safeSubmit ? (n.focusFx.safeSubmit = !1, !0) : !1
      });
      n("#MainContent").fadeIn("slow");
      n("span.im-icon-required").each(function () {
        var t = n(this).parent().attr("for");
        t = n("#hdn" + t).length > 0 ? "hdn" + t : t;
        n.focusFx.requiredFields.push(t)
      });
      n("#ViewSubjProp").click(function () {
        n.fn.minbox({
          open: !0,
          width: "905px",
          height: "620px",
          title: "Subject Property",
          close: '<button id="Minimize" onClick="javascript:$.fn.colorbox.close();">Minimize<\/button><button id="close" onClick="javascript:$.fn.minbox.close(\'subjpropmin\');">Close<\/button>',
          onClosed: !1,
          minUrl: _linkDetailView,
          minName: "subjpropmin",
          customStyle: "bottom: 0px!important;"
        })
      });
      n("#CountSearch *").length > 1 && n("#CountSearch button").css("margin-left", "4px");
      n("a.f-form-tooltip").qtip({
        style: {
          name: "cream",
          tip: !0
        },
        position: {
          corner: {
            target: "topMiddle",
            tooltip: "bottomRight"
          },
          adjust: {
            screen: !0
          }
        }
      });
      n(".f-form-map").click(n.focusFx.bingSearch);
      n("a.f-form-area-map-link") && window.g_searchType != 6 && (f = n("a.f-form-area-map-link").parents()[0], f != null && n(f).children("ul").attr("style"));
      n("a.f-form-area-map-link").click(function () {
        parent.parent.$.fn.colorbox({
          href: window.g_areaMapLinkUrl,
          open: !0,
          iframe: !0,
          width: 940,
          height: 500,
          title: n(this).attr("title"),
          close: '<button id="Print">Print<\/button><button id="Close">Close<\/button>',
          onClosed: !1
        })
      });
      $expandCollapse = n("form.f-form-search div.legend a,form.f-form-input div.legend a");
      $expandCollapse.length > 0 && (t = "ui-icon-circle-triangle-s", r = "ui-icon-circle-triangle-n", $expandCollapse.click(function () {
        return n(this).parent().next().slideToggle("fast"), $icon = n("span.ui-icon", this), $icon.hasClass(t) ? switchClassEx($icon, r, t) : switchClassEx($icon, t, r), !1
      }).parent().click(function () {
        return n(this).next().slideToggle("fast"), $icon = n("a span.ui-icon", this), $icon.hasClass(t) ? switchClassEx($icon, r, t) : switchClassEx($icon, t, r), !1
      }), n("a.f-form-openall").click(function () {
        n("form.f-form-search div.legend a span." + t + ",form.f-form-input div.legend a span." + t).each(function () {
          n(this).parent().click()
        })
      }), n("a.f-form-closeall").click(function () {
        n("form.f-form-search div.legend a span." + r + ",form.f-form-input div.legend a span." + r).each(function () {
          n(this).parent().click()
        })
      }));
      n("ul.acfb-no-input").click(function () {
        n(this).parent().find("a").click()
      });
      n(".f-form-lookup-partial,.f-form-area-partial,.f-form-property-type-partial,.f-form-how-sold-partial,.f-form-state-partial, .f-form-popup").click(function (t) {
        var i, u;
        t.preventDefault();
        var f = 460,
          r = 385,
          e = !0;
        n(this).attr("cboxwidth") && (f = n(this).attr("cboxwidth"));
        n(this).attr("cboxheight") && (r = n(this).attr("cboxheight"));
        n(this).attr("cboxsavebutton") && (e = n(this).attr("cboxsavebutton") == "true");
        i = n(this).attr("href");
        i += i.indexOf("?") > 0 ? "&searchID=" : "?searchID=";
        i += window.frameElement.id;
        window.g_searchType == "Tax" && (i += "&fieldName=" + n(this).attr("title"));
        u = "Save";
        n(this).attr("cboxsavebuttontext") && (u = n(this).attr("cboxsavebuttontext"));
        n(this).attr("id") == "customize" ? parent.$.fn.colorbox({
          href: i,
          iframe: !0,
          width: 860,
          height: r,
          title: n(this).attr("title"),
          close: '<button id="ApplySave">Apply/Save<\/button><button id="ApplySaveAs">Apply/Save As<\/button><button id="Apply">Apply<\/button><button id="Close">Cancel<\/button>',
          onClosed: !1
        }) : parent.$.fn.colorbox({
          href: i,
          iframe: !0,
          width: f,
          height: r,
          title: n(this).attr("title"),
          close: (e ? '<button id="Save">' + u + "<\/button>" : "") + '<button id="Close">Cancel<\/button>',
          onClosed: !1
        })
      });
      e = n(".f-form-date.ui-state-disabled");
      e.removeClass("ui-state-disabled").removeAttr("disabled");
      n(".f-form-date").datepick({
        dateFormat: "mm/dd/yyyy",
        renderer: n.datepick.themeRollerRenderer,
        showAnim: "",
        showTrigger: "#datePickCal",
        showOnFocus: !1,
        onSelect: function () {
          n(this).change()
        },
        onShow: function () {
          var i = n(this),
            t = i.attr("id");
          if ((t == "f_4006_Low" || t == "f_4006_High" || t == "f_4004_Low" || t == "f_4004_High") && n(this).is(":disabled")) {
            n("#f_4006_RunFrom").prop("checked") ? n("#f_4006_RunFrom").removeAttr("checked") : (n("#f_4006_DaysBack,#f_4004_DaysForward").val(""), n("#fo_f_4006,#fo_f_4004").val("").change());
            n.focusFx.hotSheetSetEnabled();
            n("#f_4006_Low,#f_4006_High,#f_4004_Low,#f_4004_High").val("").removeAttr("disabled").removeClass("ui-state-disabled");
            return
          }
          n(this).is(":disabled") && n(this).datepick("hide")
        }
      });
      e.addClass("ui-state-disabled").attr("disabled");
      n(".ui-state-default").hover(function () {
        n(this).addClass("ui-state-hover")
      }, function () {
        n(this).removeClass("ui-state-hover")
      });
      n("select.acfb-listing-owner").change(function () {
        n("a.acfb-listing-owner, ul.acfb-listing-owner").hide();
        n("ul.acfb-listing-owner input:hidden").attr("disabled", !0);
        n(this).val() == "A" ? (n(".acfb-listing-owner-agent").show(), n("ul.acfb-listing-owner-agent input").removeAttr("disabled")) : n(this).val() == "AO" ? (n(".acfb-listing-owner-office").show(), n("ul.acfb-listing-owner-office input").removeAttr("disabled")) : n(this).val() == "AF" && (n(".acfb-listing-owner-firm").show(), n("ul.acfb-listing-owner-firm input").removeAttr("disabled"));
        n("ul.acfb-listing-owner:not(:hidden) input.acfb-value").each(function () {
          setTimeout(function () {
            n("ul.acfb-listing-owner:not(:hidden) input.acfb-value").trigger("change")
          }, 100)
        })
      });
      typeof g_ermsList != "undefined" && g_ermsList && n.each(g_ermsList, function (t, i) {
        n('[id^="f_' + i + '__"]').addClass("f-form-erms")
      });
      n("input.acf").each(function () {
        var t = n(this);
        c(t, t.attr("url"), t.attr("name"), t.attr("data"), t.attr("desc"), t.attr("additionalcolumn"), t.attr("extraParams"), t.attr("cacheType"), t.data("combinedataanddesc"))
      });
      n(".acfb-holder").click(function () {
        n("input:text", this).focus()
      });
      typeof n.fn.criteriaSummary == "function" && n(".f-cs-control").criteriaSummary();
      n(".SearchBtn").click(n.focusFx.searchFormSubmit);
      n(".CountBtn").click(function () {
        n.focusFx.queueSearchFormCount(!1)
      });
      n("input.f-form-date").mask("99/99/9999");
      n("input.f-form-integer").focusMask("intMask");
      n("input.f-form-thousands").focusMask("intMask");
      n("input.f-form-decimal").focusMask("decMask");
      n("input.f-form-dollars").focusMask("intMask").blur(function () {
        var t = n.trim(n(this).val()),
          i = t.length;
        i == 0 ? n(this).val("000") : i == 1 ? n(this).val("00" + t) : i == 2 && n(this).val("0" + t)
      });
      n("input.f-form-date").blur(function () {
        var t = n(this).val();
        t != "" && (validateDateString(t) || (alert("The date entered is invalid."), n(this).val("")))
      });
      typeof n.fn.criteriaSummaryValidate == "function" && (n("form input.f-form-price").criteriaSummaryValidate(function (t) {
        var i = "",
          e, l, a;
        n(t).attr("id").indexOf("__") > -1 && (e = n(t).attr("id").split("__"), i = "__" + e[1]);
        var r = n(t).attr("id").split("_", 2),
          u = n.trim(n("#f_" + r[1] + "_Low" + i).val()),
          o = n.trim(n("#f_" + r[1] + "_Low_1" + i).val()),
          s = n("#f_" + r[1] + "_High" + i),
          h = n("#f_" + r[1] + "_High_1" + i),
          f = n.trim(s.val()),
          c = n.trim(h.val());
        return (u != "" || o != "000") && (f != "" || c != "000") && (l = parseInt(u == "" ? 0 : u, 10) * 1e3 + parseInt(o, 10), a = parseInt(f == "" ? 0 : f, 10) * 1e3 + parseInt(c, 10), l > a) ? (alert("Low price cannot be greater than high price.  Removed high price."), h.val("000"), s.val("").focus(), !1) : !0
      }), u = function (t) {
        var i = n(t).parent().parent(),
          r = n("input.f-form-min", i),
          u = n("input.f-form-max", i),
          f = n.trim(r.val()),
          e = n.trim(u.val());
        return {
          low: f,
          high: e,
          lowEl: r,
          highEl: u
        }
      }, n("form input.f-form-date").criteriaSummaryValidate(function (n) {
        var t = u(n),
          i = null,
          r = null;
        return (t.low != "" && (i = new Date(t.low)), t.high != "" && (r = new Date(t.high)), r != null && r > new Date("06/06/2079")) ? (alert("End date cannot be greater than 06/06/2079.  Removed end date."), t.highEl.val("").focus(), !1) : i != null && i < new Date("01/01/1900") || i > new Date("06/06/2079") ? (alert("Begin date cannot be less than 01/01/1900 or greater than 06/06/2079.  Removed begin date."), t.lowEl.val("").focus(), !1) : i != null && r != null && i > r ? (alert("Begin date cannot be greater than end date.  Removed end date."), t.highEl.val("").focus(), !1) : !0
      }), n("form input.f-form-integer").criteriaSummaryValidate(function (n) {
        var t = u(n),
          i, r;
        return t.low != "" && t.high != "" && (i = parseInt(t.low, 10), r = parseInt(t.high, 10), i > r) ? (alert("Min number cannot be greater than max number.  Removed max number."), t.highEl.val("").focus(), !1) : !0
      }), n("form input.f-form-integer-multiple").criteriaSummaryValidate(function (t) {
        var f, i;
        if (n.trim(n(t).val()) == "") return !0;
        var u = n(t).val().split(","),
          r = "",
          e = [];
        for (f in u) i = parseInt(u[f], 10), i == "NaN" || i.toString(10).length != u[f].length ? e.push(i) : r += (r.length > 0 ? "," : "") + i;
        return e.length > 0 ? (alert("Invalid values were removed."), n(t).focus().val(r), !1) : (n(t).val(r), !0)
      }), n("form input.f-form-decimal").criteriaSummaryValidate(function (n) {
        var t = u(n),
          i, r;
        return t.low != "" && t.high != "" && (i = parseFloat(t.low), r = parseFloat(t.high), i > r) ? (alert("Min number cannot be greater than max number.  Removed max number."), t.highEl.val("").focus(), !1) : !0
      }));
      o = n("#focusControl").val();
      try {
        typeof o != "undefined" && o != "" ? n("#" + n("#focusControl").val()).focus() : navigator.platform.indexOf("iPad") != -1 || n("form input:text:enabled:visible:first").focus()
      } catch (l) {}
      s = "input:text:enabled,select:select-one:enabled,select:select-multiple:enabled,textarea:enabled";
      n("div.f-form-field:last", n("div.fieldset")).keypress(function (t) {
        if (t.keyCode == 9 && !t.shiftKey) {
          var i = n(this).parents("fieldset").next("fieldset");
          n("div.fieldset:hidden", i).length > 0 && (t.preventDefault(), n("div.legend", i).click(), n("div.f-form-field:has(" + s + ") " + s, i).get(0).focus())
        }
      });
      n("a.multipleaddress").each(function () {
        var t = n(this),
          i = {
            deleteImg: g_acfbDeleteImg,
            directionsUser: t.data("directionused"),
            streetLookup: t.data("streetlookup"),
            streetLookupPopupUrl: t.data("popupdataurl"),
            streetLookupPopupTitle: t.data("popuptitle"),
            streetLookupUrl: t.data("url")
          };
        n(this).multipleaddress(i)
      });
      n("a.wordsearch").each(function () {
        var t = JSON.parse(n(this).attr("extraparams"));
        t.applicationTabId = window;
        t.deleteImg = g_acfbDeleteImg;
        t.containerId = "#MainContent";
        n(this).wordsearch(t)
      });
      n("select.f-form-field-options").selectBoxIt({
        hideCurrent: !0,
        isMobile: function () {
          return !1
        }
      }).change(function () {
        var t = n(this),
          r, i, f, e;
        if (t.siblings("div.f-form-date-range").length > 0) {
          if (!t.hasClass("ui-state-disabled")) {
            var o = t.val(),
              s = t.attr("id"),
              h = s.split("_")[2],
              u = n.focusFx.findDateField(h);
            u != null && (o.length > 0 ? u.controlsAndLinks.filter(":not(select)").attr("disabled", "disabled").addClass("ui-state-disabled").filter("input:text").val("") : u.controlsAndLinks.removeClass("ui-state-disabled").removeAttr("disabled"))
          }
        } else t.attr("id") == "fo_f_4006" || t.attr("id") == "fo_f_4004" ? n.focusFx.hotSheetSetEnabled() : t.siblings("div.f-form-mixed-range-container").length > 0 && (r = t.siblings("div.f-form-mixed-range-container"), i = n("input.f-form-min", r), t.val() == "2" ? (i.focusMask({
          mask: "stringMask"
        }).removeClass("f-form-integer"), n("input.f-form-max", r).val("").attr("disabled", "disabled")) : (f = i.val(), f != parseInt(f, 10) && i.val(""), i.focusMask({
          mask: "intMask"
        }).addClass("f-form-integer"), n("input.f-form-max", r).removeAttr("disabled")));
        e = t.find(":selected").attr("title");
        e && t.parent().find("span.selectboxit-text").attr("title", e)
      });
      n.focusFx.setupExtraTabs();
      window.setTimeout(function () {
        n.focusFx.dontCountRightNow = !1
      }, 100)
    },
    searchFormBuildData: function (t) {
      var i = [];
      return (t.each(function () {
        var r = n("#hdn" + n(this).attr("name")).val(),
          t;
        r != null && r.length > 0 && (t = "", n(this).attr("data-erms-physnum") != null ? t = n(this).attr("data-erms-physnum") : (t = n(this).attr("name"), t = t.substring(t.indexOf("_") + 1, t.length), t.indexOf("_") >= 0 && (t = t.substring(0, t.indexOf("_")))), i[i.length] = {
          Key: t,
          Value: JSON.parse(r)
        })
      }), i.length == 0) ? null : i
    },
    loadViewSelectorNode: function (t, i) {
      var r = {},
        u;
      r.viewID = n("a", t).attr("viewID");
      r.name = n("a", t).clone().children().remove().end().text();
      r.perPage = n("a", t).attr("perPage");
      r.type = n("a", t).attr("viewType");
      u = JSON.stringify(r);
      n("#ViewSelected").length == 0 && n("form.f-form-search").append('<input type="hidden" id="ViewSelected" name="ViewSelected"/>');
      n("#ViewSelected").val(u);
      i && n("#Search").click()
    },
    searchFormAutoCount: function (t) {
      if (n.focusFx.requiredFields.length > 0)
        for (var i = 0; i < n.focusFx.requiredFields.length; i++) n('table.f-cs-items tr[rel="' + n.focusFx.requiredFields[i] + '"]').length > 0 ? n(n('span[title="Required"]')[i]).removeClass("im-icon-required").addClass("im-icon-not-required") : n(n('span[title="Required"]')[i]).removeClass("im-icon-not-required").addClass("im-icon-required");
      n.focusFx.queueSearchFormCount(t === !0)
    },
    dontCountRightNow: !0,
    queueSearchFormCount: function (t) {
      if (!n.focusFx.dontCountRightNow) {
        var i = n(".CountBtn");
        i.length >= 1 && (i.attr("disabled") != "disabled" ? n.focusFx.searchFormCount(t === !0) : n.focusFx.countQueued = !0)
      }
    },
    hasRequiredFields: function (t) {
      var f = !1,
        i = !1,
        e = [],
        r = [],
        u = !1;
      return window.g_searchType == null && (n("form.f-form-search input.required").each(function () {
        var t, i;
        n(this).val().length == 0 && (t = !0, n(this).parent().parent().attr("class") == "f-form-date-range" && (u ? t = !1 : (i = n(this).parents("div.f-form-field").find("select.f-form-field-options"), i.length > 0 && i.val() > 0 && (t = !1)), u = !0), t && (f = !0, e[e.length] = n(this).parent().parent().parent().find("label:first").text()))
      }), n("form.f-form-search input.onerequired").each(function () {
        var t, f;
        n(this).val().length == 0 && (t = !0, n(this).parent().parent().attr("class") == "f-form-date-range" && (u ? t = !1 : (f = n(this).parents("div.f-form-field").find("select.f-form-field-options"), f.length > 0 && f.val() > 0 && (t = !1)), u = !0), t && (i = !0, r[r.length] = n(this).parent().parent().parent().find("label:first").text()))
      }), r.length < n("form.f-form-search input.onerequired").length && (i = !1), i && t && n.jGrowl("One of the following fields is required:<br/><br/>" + r.join("<br/>"), {
        header: "ALERT",
        group: "jgrowl-alert"
      }), f && t && n.jGrowl("Please fill in the following required field(s):<br/><br/>" + e.join("<br/>"), {
        header: "ALERT",
        group: "jgrowl-alert"
      }), f || i) ? (t && n("#CountResult").val(""), !0) : !1
    },
    setCount: function (t, i) {
      var r = t;
      n.isNumeric(t) && (r = n("<div/>").text(n.formatNumber(t, {
        locale: "us"
      })).format({
        format: "#,##0"
      }).text());
      n(".CountResultText").val(r);
      i || (n.focusFx.countChangedMap = !0);
      n.focusFx.countChangedResults = !0;
      var u = n.focusFx.getCurrentTab(),
        f = u.substring(0, u.lastIndexOf("_")),
        e = f + "_2";
      window.top.$('a[href="#' + f + '"] span[rel="#' + e + '"]').text("Run Search")
    },
    triggerSave: function () {
      setTimeout(function () {
        if ((n("#initSave").val() == "1" || n("#initSave").val() == "2") && window.g_searchType != 6) {
          var t = n("#initSave").val() == "1" ? ".f-save-search" : ".f-save-search-as";
          n("#initSave").val("0");
          n(t)[0].click()
        }
      }, 250)
    },
    searchFormCount: function (i) {
      var r, u;
      if (n.focusFx.processingAutocomplete) {
        r = function () {
          this.searchFormCount(i)
        };
        t(r);
        return
      }
      if (!n.focusFx.hasRequiredFields(!i)) {
        if (i === !0 && (u = n.focusFx.hasRealCriteria(), !u)) {
          n(".CountBtn,.SearchBtn,.ClearBtn").removeAttr("disabled");
          n.focusFx.setCount("");
          window.g_isMapSearchOnInit && (window.g_isMapSearchOnInit = !1, n.focusFx.bingSearch());
          n.focusFx.triggerSave();
          return
        }
        i === !0 ? n(".CountBtn,.ClearBtn").attr("disabled", "disabled") : n(".CountBtn,.SearchBtn,.ClearBtn").attr("disabled", "disabled");
        n(".CountResultText").val("Counting...");
        n("form.f-form-search").ajaxSubmit({
          url: g_urlCountAction,
          dataType: "json",
          headers: {
            __RequestVerificationToken: n('input[name="__RequestVerificationToken"]').val()
          },
          type: "POST",
          timeout: 12e4,
          success: function (t) {
            var r = typeof t.result == "object" ? t.result.Count : t.result;
            if (t.status == "OK") {
              if (n.focusFx.setCount(r), n.focusFx.countQueued) {
                n.focusFx.countQueued = !1;
                n.focusFx.searchFormCount(i);
                return
              }
              window.g_isMapSearchOnInit && (window.g_isMapSearchOnInit = !1, n.focusFx.bingSearch())
            } else n(".CountResultText").val("Error."), n.jGrowl(r, {
              header: "ALERT",
              group: "jgrowl-alert"
            });
            n(".CountBtn,.SearchBtn,.ClearBtn").removeAttr("disabled")
          },
          error: function () {
            n(".CountResultText").val("Error.");
            n(".CountBtn,.SearchBtn,.ClearBtn").removeAttr("disabled")
          }
        })
      }
      n.focusFx.triggerSave()
    },
    hasRealCriteria: function () {
      var t = !1,
        i = n("form.f-form-search :input").not(function () {
          return n(this).hasClass("f-form-dollars") && this.value == "000"
        }).not(function () {
          return n(this).hasClass("f-form-salerent") && this.value == "B"
        }),
        r = i.serialize().split("&");
      return n.each(r, function (i, r) {
        var f = r.split("="),
          u = f[0],
          e = f[1],
          o, s;
        if (u && e && (u.startsWith("f_") || u.startsWith("hdnf_") || u.startsWith("fo_f_"))) return (o = u.split("_"), u.startsWith("fo_f_") && !n.focusFx.isDateField(o[2])) ? !0 : u == "hdnf_518" ? (s = JSON.parse(unescape(e)), n.each(s, function (n, i) {
          if (i.Value.shapeType != 6) return t = !0, !1
        }), !0) : (t = !0, !1)
      }), t
    },
    getCurrentTab: function () {
      var n = window.frameElement.id;
      return !parent.$("#" + n).hasClass("ui-tabs-panel") && n.indexOf("_M") < 0 && parent.frameElement != null && (n = parent.frameElement.id), n
    },
    setupExtraTabs: function () {
      var u = n.focusFx.getCurrentTab(),
        t = u.substring(0, u.lastIndexOf("_")),
        o = u.substring(0, u.indexOf("_")),
        i, e, f, r, s;
      if (window.g_hasMapTab) {
        i = t + "_M";
        n.focusFx.$mapTab = window.top.$("#" + i);
        e = n("#hdnf_518").length == 0;
        n.focusFx.$mapTab.length == 0 ? parent.appendSubTabGroup({
          mainFrame: o,
          subFrame: t,
          curFrame: window.frameElement.id,
          newTabId: i,
          tabDesc: "Map Search",
          backgroundLoad: !0,
          cssClass: e ? "ui-helper-hidden" : "",
          url: "about:blank"
        }) : n.focusFx.$mapTab[0].contentDocument.location.href = "about:blank";
        f = window.top.$('a[href="#' + t + '"] span[rel="#' + i + '"]');
        e ? f.addClass("ui-helper-hidden") : f.removeClass("ui-helper-hidden");
        f.off("subtabClicked").on("subtabClicked", function () {
          n.focusFx.$mapTab = window.top.$("#" + i);
          !n.focusFx.runIfSrcIsEmpty(n.focusFx.$mapTab, !1, n.focusFx.loadMapTab) && n.focusFx.countChangedMap && n.isFunction(n.focusFx.$mapTab[0].contentWindow.postSearchIfShapes) && n.focusFx.$mapTab[0].contentWindow.postSearchIfShapes();
          n.focusFx.countChangedMap = !1
        })
      }
      if (window.g_hasResultsTab) {
        r = t + "_2";
        n.focusFx.$resultsTab = window.top.$("#" + r);
        n.focusFx.$resultsTab.length == 0 ? parent.appendSubTabGroup({
          mainFrame: o,
          subFrame: t,
          curFrame: window.frameElement.id,
          newTabId: r,
          tabDesc: "Run Search",
          backgroundLoad: !0,
          url: "about:blank"
        }) : n.focusFx.$resultsTab[0].contentDocument.location.href = "about:blank";
        s = window.top.$('a[href="#' + t + '"] span[rel="#' + r + '"]');
        s.off("subtabClicked").on("subtabClicked", function () {
          n.focusFx.$resultsTab = window.top.$("#" + r);
          n.focusFx.runIfSrcIsEmpty(n.focusFx.$resultsTab, n.focusFx.countChangedResults, n.focusFx.searchFormSubmit);
          n.focusFx.countChangedResults = !1
        })
      }
    },
    isSrcEmpty: function (n, t) {
      if (n.length > 0) {
        var i = n[0].contentDocument.location.href;
        if (t || i === "about:blank") return !0
      }
      return !1
    },
    runIfSrcIsEmpty: function (t, i, r) {
      return n.focusFx.isSrcEmpty(t, i) ? (r(t), !0) : !1
    },
    doSubmit: function (t) {
      var u = parent,
        i = window.frameElement.id,
        r, e, f, o;
      parent.$("#" + i).hasClass("ui-tabs-panel") || (u = parent.parent, i = parent.frameElement.id);
      i == "HomeTab" ? (e = u.$("#app_tab_switcher a[tabDescription='Quick Search']"), f = buildTabDescription(t), e.length > 0 ? (r = e.attr("href").replace("#", ""), u.$("#app_tab_switcher").tabs("select", "#" + r), r += "_1", u.$("a[href='#" + r + "']").html('<span class="">' + f + "<\/span>"), u.$("a[href='#" + r + "']").attr("rel", f)) : r = u.loadItemMain("Quick Search", f, "about:blank", !0, "frmMain") + "_1") : window.g_replaceTabID != null && window.g_replaceTabID.length > 0 && u.$("#" + window.g_replaceTabID).length > 0 ? (i = i.substring(0, i.indexOf("_")), r = window.g_replaceTabID, window.g_replaceTabID = "", u.$("#" + i).tabs("select", "#" + r), u.$("#" + i + ' a[href="#' + r + '"] span').html(buildTabDescription(t))) : window.g_useSubSubTabForResults ? r = u.appendOrActivateSubSubTab(buildTabDescription(t), i, "#") : (o = i.substring(0, i.lastIndexOf("_")), i = i.substring(0, i.indexOf("_")), r = o + "_2", parent.appendSubTabGroup({
        mainFrame: i,
        subFrame: o,
        curFrame: window.frameElement.id,
        newTabId: r,
        tabDesc: buildTabDescription(t)
      }));
      r != null && (setupParams(r), n.focusFx.safeSubmit = !0, n.focusFx.countChangedResults = !1, window.setTimeout(function () {
        n("form.f-form-search").attr("target", r).submit()
      }, 100));
      n(".CountBtn,.SearchBtn,.ClearBtn").removeAttr("disabled")
    },
    searchFormSubmit: function () {
      var u, i;
      if (n.focusFx.processingAutocomplete) {
        u = function () {
          this.searchFormSubmit()
        };
        t(u);
        return
      }
      n.focusFx.hasRequiredFields(!0) || (n(".CountBtn,.SearchBtn,.ClearBtn").attr("disabled", "disabled"), i = g_urlCountAction, i == "" ? n.focusFx.doSubmit() : (i += i.indexOf("?") > -1 ? "&fromSearch=true" : "?fromSearch=true", n("form.f-form-search").ajaxSubmit({
        url: i,
        dataType: "json",
        headers: {
          __RequestVerificationToken: n('input[name="__RequestVerificationToken"]').val()
        },
        type: "POST",
        success: function (t) {
          var i = typeof t.result == "object" ? t.result.Count : t.result,
            u;
          t.status == "OK" ? parseInt(i, 10) > 0 ? (u = n("#ViewSelected").val(), t.message != null && t.message == "MULTI_PAGE_WARNING" && (u == null || u.indexOf("Spreadsheet") > -1) ? (n.focusFx.selectCriteriaTab(), n("#LargeResults").dialog("isOpen") === !0 && n("#LargeResults").dialog("destroy"), n("#LargeResults").dialog({
            title: r(i) + " Results found",
            resizable: !1,
            dialogClass: "dialog-absolute",
            height: 180,
            width: 450,
            close: function () {
              n(this).dialog("destroy")
            },
            create: function () {
              var t = n(this).dialog("widget").find(".ui-dialog-buttonpane .ui-dialog-buttonset");
              n("<input id='do-not-show-check' type='checkbox'><\/input><label class='do-not-show' > Do not show this message again.<\/label>").prependTo(t)
            },
            buttons: {
              "Show Results": function () {
                if (n("#do-not-show-check").is(":checked")) {
                  var i = n("form.f-form-search").attr("action");
                  n("form.f-form-search").attr("action", i + "?HideWarn=true");
                  n.focusFx.doSubmit(t)
                } else n.focusFx.doSubmit(t);
                n(this).dialog("destroy")
              },
              Close: function () {
                n(this).dialog("destroy")
              }
            },
            open: function () {
              n(this).parent().find("button:eq(0)").focus()
            }
          }), n("LargeResults").dialog("open")) : n.focusFx.doSubmit(t)) : (n.focusFx.selectCriteriaTab(), n.jGrowl("No results found.  Please refine your criteria and try again.", {
            header: "INFO",
            group: "jgrowl-info"
          })) : (n.focusFx.selectCriteriaTab(), n("#CountResult").val("Error."), n.jGrowl(i, {
            header: "ALERT",
            group: "jgrowl-alert"
          }));
          n(".CountBtn,.SearchBtn,.ClearBtn").removeAttr("disabled")
        },
        error: function () {
          n.focusFx.selectCriteriaTab();
          n("#CountResult").val("Error.");
          n(".CountBtn,.SearchBtn,.ClearBtn").removeAttr("disabled");
          n.jGrowl("The server returned an error running the search.  Please try again.", {
            header: "ALERT",
            group: "jgrowl-alert"
          })
        }
      })))
    },
    selectCriteriaTab: function () {
      if (n.focusFx.$criteriaSpan == null) {
        var t = n.focusFx.getCurrentTab(),
          i = t.substring(0, t.lastIndexOf("_"));
        n.focusFx.$criteriaSpan = window.top.$('a[href="#' + i + '"] span[rel="#' + i + '_1"]')
      }
      n.focusFx.$criteriaSpan.hasClass("disabledSpan") && n.focusFx.$criteriaSpan.click()
    }
  })
}(jQuery);
$(function () {
    var r = $("#f_4006_Low,#f_4004_Low"),
      u = $("#f_4006_High,#f_4004_High"),
      n = $("#f_4006_DaysBack,#f_4004_DaysForward"),
      t = $("#f_4006_RunFrom"),
      i = $("#fo_f_4006,#fo_f_4004"),
      f;
    n.length != 0 && (f = function () {
      t.prop("checked") || $(this).val().length > 0 && (n.val(""), $(t).prop("checked", ""))
    }, $.extend($.focusFx, {
      hotSheetSetEnabled: function () {
        var f = i.data("selectBoxIt");
        t.prop("checked") ? (n.val("").attr("disabled", "disabled").addClass("ui-state-disabled"), r.val("").attr("disabled", "disabled").addClass("ui-state-disabled"), u.val("").attr("disabled", "disabled").addClass("ui-state-disabled"), i.val("").attr("disabled", "disabled").addClass("ui-state-disabled"), f && f.disable()) : n.val().length > 0 ? (r.val("").attr("disabled", "disabled").addClass("ui-state-disabled"), u.val("").attr("disabled", "disabled").addClass("ui-state-disabled"), i.val("").attr("disabled", "disabled").addClass("ui-state-disabled"), t.prop("checked", "")) : i.length > 0 && i.val().length > 0 ? (n.val("").attr("disabled", "disabled").addClass("ui-state-disabled"), r.val("").attr("disabled", "disabled").addClass("ui-state-disabled"), u.val("").attr("disabled", "disabled").addClass("ui-state-disabled"), t.prop("checked", "")) : (n.removeAttr("disabled").removeClass("ui-state-disabled"), r.removeAttr("disabled").removeClass("ui-state-disabled"), u.removeAttr("disabled").removeClass("ui-state-disabled"), i.removeAttr("disabled").removeClass("ui-state-disabled"), f && f.enable())
      }
    }), $.focusFx.hotSheetSetEnabled(), r.blur(f), u.blur(f), n.keyup(function () {
      $.focusFx.hotSheetSetEnabled()
    }), t.click(function () {
      $.focusFx.hotSheetSetEnabled()
    }), n.val().length > 0 && n.change())
  }),
  function (n) {
    var s = 11,
      nt = 27,
      tt = 28,
      h = 33,
      c = 34,
      l = 43,
      a = 44,
      it = 46,
      rt = 47,
      v = 476,
      y = 620,
      p = 621,
      w = 622,
      b = 623,
      k = 624,
      i = 628,
      d = "dateSelection",
      u = 2,
      e = 3,
      o = 4,
      g = 5,
      f = 6,
      r = [h, c, l, a, v, y, p, w, b, k, i, d],
      t = [1, u, e, o, g, f];
    n.focusFx || (n.focusFx = {});
    n.extend(n.focusFx, {
      validStatuses: [{
        id: h,
        statuses: t
      }, {
        id: c,
        statuses: [o]
      }, {
        id: l,
        statuses: [u, e, f]
      }, {
        id: a,
        statuses: [u, f]
      }, {
        id: v,
        statuses: [u, e, o, g, f]
      }, {
        id: y,
        statuses: t
      }, {
        id: p,
        statuses: t
      }, {
        id: w,
        statuses: t
      }, {
        id: b,
        statuses: t
      }, {
        id: k,
        statuses: t
      }, {
        id: i,
        statuses: t
      }, {
        id: d,
        statuses: t
      }],
      searchFormRules: function () {
        var o, e;
        typeof g_searchExpireDateStatuses != "undefined" && (n.focusFx.validStatuses[1].statuses = g_searchExpireDateStatuses);
        o = [];
        typeof g_validAgentOfficeSearchStatuses != "undefined" && g_validAgentOfficeSearchStatuses != null && g_validAgentOfficeSearchStatuses.length > 0 && (g_validAgentOfficeSearchStatuses.length > 1 || g_validAgentOfficeSearchStatuses[0].length > 0) && (o = [nt, tt, it, rt]);
        var h = n("input[id^=f_" + i + "_Low]"),
          c = n("input[id^=f_" + i + "_High]"),
          f = h.add(c),
          u = n("input:hidden[id^=hdnf_" + s + "_]");
        u.length == 0 && (u = n("input:hidden[id=hdnf_" + s + "]"));
        n.each(n.focusFx.validStatuses, function (t, i) {
          i.lowControl = n("input[id^=f_" + i.id + "_Low]");
          i.highControl = n("input[id^=f_" + i.id + "_High]");
          i.controls = i.lowControl.add(i.highControl);
          i.controlsAndLinks = i.controls.add(n("input[id^=f_" + i.id + "_LowLink],input[id^=f_" + i.id + "_HighLink],select[id^=fo_f_" + i.id + "_]"))
        });
        e = function () {
          var l = [],
            e = [],
            s, a, v, y, w, p;
          if (u.length > 0 && u.val() != "") {
            s = JSON.parse(u.val());
            for (a in s) e.push(s[a].ID), v = parseInt(s[a].ID.split("_")[0], 10), n.inArray(v, l) == -1 && l.push(v)
          }
          o.length > 0 && (y = e.length > 0, e.length > 0 && n.each(e, function (t, i) {
            var r = !1;
            return n.each(g_validAgentOfficeSearchStatuses, function (n, t) {
              var u = t.split("_");
              if (u.length == 1) {
                if (u[0] == i[0]) return r = !0, !1
              } else if (t == i) return r = !0, !1
            }), r ? void 0 : (y = !1, !1)
          }), n.each(o, function (t, i) {
            var u = n("input[id^=f_" + i + "_]"),
              r, f;
            u.length > 0 && (r = u.parent().parent(), f = r.parent().find("a.f-form-lookup-partial"), y ? (u.removeAttr("disabled"), r.removeClass("acfb-no-input"), f.show()) : (u.attr("disabled", "disabled"), r.addClass("acfb-no-input"), n("li.acfb-data", r).each(function (t, i) {
              n("img.p", i).click()
            }), f.hide()))
          }));
          w = f.length > 0 && (n.trim(h.val()) != "" || n.trim(c.val()) != "");
          n.each(n.focusFx.validStatuses, function (i, r) {
            if (r.statuses.length < t.length) {
              var u = !1;
              w || n.each(r.statuses, function (t, i) {
                if (n.inArray(parseInt(i, 10), l) != -1) return u = !0, !1
              });
              u ? r.controlsAndLinks.removeClass("ui-state-disabled").removeAttr("disabled") : (r.controlsAndLinks.attr("disabled", "disabled").addClass("ui-state-disabled").filter("input:text").val(""), n(".f-cs-items tr[rel^=f_" + r.id + "__]").remove())
            }
          });
          f.length > 0 && (p = !0, n.each(r, function (t, r) {
            if (r == i) return !0;
            var u = n.focusFx.findDateField(r);
            if (u != null && u.lowControl.length > 0 && (u.lowControl.val() != "" || u.highControl.val() != "")) return p = !1, !1
          }), p ? f.removeAttr("disabled").removeClass("ui-state-disabled") : f.attr("disabled", "disabled").addClass("ui-state-disabled"))
        };
        u.expire();
        u.livequery("change", e);
        e();
        f.length > 0 && n.each(r, function (t, u) {
          if (u == i) f.blur(function () {
            n.trim(h.val()) != "" || n.trim(c.val()) != "" ? n.each(r, function (t, r) {
              if (r != i) {
                var u = n.focusFx.findDateField(r);
                u != null && u.controlsAndLinks.attr("disabled", "disabled").addClass("ui-state-disabled")
              }
            }) : n.each(r, function (t, r) {
              if (r != i) {
                var u = n.focusFx.findDateField(r);
                u != null && u.controlsAndLinks.removeAttr("disabled").removeClass("ui-state-disabled")
              }
            });
            e()
          });
          else {
            var o = n.focusFx.findDateField(u);
            o != null && o.controls.blur(function () {
              e()
            })
          }
        });
        n("select.f-form-field-options").change()
      },
      isDateField: function (t) {
        var i = !1;
        return n.each(r, function (n, r) {
          if (r == t) return i = !0, !1
        }), i
      },
      findDateField: function (t) {
        var i = null;
        return n.each(n.focusFx.validStatuses, function (n, r) {
          if (r.id == t) return i = r, !1
        }), i
      },
      getDateRange: function (n, t) {
        var r = new Date,
          i = new Date,
          u, f;
        switch (n) {
          case 1:
            t > 0 ? i.setDate(i.getDate() + t) : r.setDate(r.getDate() + t);
            break;
          case 2:
            t > 0 ? i.setMonth(i.getMonth() + t) : r.setMonth(i.getMonth() + t);
            break;
          case 3:
            r.setMonth(r.getMonth() + t);
            r.setDate(1);
            i.setMonth(i.getMonth() + t);
            i = new Date(i.getFullYear(), i.getMonth() + 1, 0);
            break;
          case 4:
            r = new Date(r.getFullYear() + t, 0, 1);
            i = new Date(i.getFullYear() + t, 12, 0);
            break;
          case 5:
            r = new Date(r.getFullYear() + t, 0, 1);
            i = new Date(i.getFullYear() + t, i.getMonth(), i.getDate());
            break;
          case 6:
            u = new Date;
            u.setMonth(r.getMonth() + t * 3);
            f = Math.ceil((u.getMonth() + 1) / 3) * 3 - 3;
            r = new Date(u.getFullYear(), f, 1);
            i = new Date(u.getFullYear(), f + 3, 0)
        }
        return {
          begin: r,
          end: i
        }
      }
    })
  }(jQuery);
var tempNode, myFirstSelect = !1,
  firstSelect, removeRecycleBinItem = !1,
  removeFavorite = !1,
  movingIntoRecycleBin = !1,
  movingIntoFavorites = !1,
  displayRecycleMsg = !1,
  displayFavsMsg = !1,
  isUndoFav = !1,
  removeFavHtml = "<a class='remove-fav' title='Remove from Favorites'><ins><\/ins><\/a>",
  addFavHtml = "<a class='add-fav' title='Add to Favorites'><ins><\/ins><\/a>";
$(function () {
  function u() {
    parent.$.fn.colorbox({
      href: changeDefaultReportUrl + "?reportType=1&tabId=" + window.frameElement.id,
      open: !0,
      iframe: !0,
      height: "225px",
      width: "400px",
      title: "Default Search Results Report",
      close: '<button id="Save">Save<\/button><button id="Close" onClick="javascript:parent.$.fn.colorbox.close();" >Cancel<\/button>',
      onClosed: !1
    })
  }

  function f() {
    parent.$.fn.colorbox({
      href: changeDefaultReportUrl + "?reportType=2&tabId=" + window.frameElement.id,
      open: !0,
      iframe: !0,
      height: "225px",
      width: "400px",
      title: "Default Details Report",
      close: '<button id="Save">Save<\/button><button id="Close" onClick="javascript:parent.$.fn.colorbox.close();" >Cancel<\/button>',
      onClosed: !1
    })
  }

  function e() {
    parent.$.fn.colorbox({
      href: changeDefaultReportUrl + "?reportType=3&tabId=" + window.frameElement.id,
      open: !0,
      iframe: !0,
      height: "225px",
      width: "350px",
      title: "Default Hotsheet Report",
      close: '<button id="Save">Save<\/button><button id="Close" onClick="javascript:parent.$.fn.colorbox.close();" >Cancel<\/button>',
      onClosed: !1
    })
  }

  function o() {
    parent.$.fn.colorbox({
      href: changeDefaultReportUrl + "?reportType=4&tabId=" + window.frameElement.id,
      open: !0,
      iframe: !0,
      height: "225px",
      width: "450px",
      title: "Default Tour/Open House Search Report",
      close: '<button id="Save">Save<\/button><button id="Close" onClick="javascript:parent.$.fn.colorbox.close();" >Cancel<\/button>',
      onClosed: !1
    })
  }

  function s() {
    parent.$.fn.colorbox({
      href: changeDefaultReportUrl + "?reportType=5&tabId=" + window.frameElement.id,
      open: !0,
      iframe: !0,
      height: "225px",
      width: "450px",
      title: "Default Tour/Open House Details Report",
      close: '<button id="Save">Save<\/button><button id="Close" onClick="javascript:parent.$.fn.colorbox.close();" >Cancel<\/button>',
      onClosed: !1
    })
  }

  function n(n) {
    var t = $(`#Reports a:contains('${n.detail}')`).last().clone(),
      i = $("#Reports li[rel='defaultItem'] a[viewid]").first(),
      r = i.children("span")[0].outerHTML;
    t.prepend(r);
    i.replaceWith(t)
  }

  function t(n) {
    var t = $(`#Reports a:contains('${n.detail}')`).last().clone(),
      i = $("#Reports li[rel='defaultItem'] a[viewid]").last(),
      r = i.children("span")[0].outerHTML;
    t.prepend(r);
    i.replaceWith(t)
  }

  function h(n) {
    var t = n.srcElement;
    t.nodeName.toUpperCase() == "INS" && (t = $(n.srcElement).parent());
    i(t, $(t).parent())
  }

  function c(n) {
    var t = n.srcElement;
    t.nodeName.toUpperCase() == "INS" && (t = $(n.srcElement).parent());
    r(t, $(t).parent())
  }

  function i(n, t) {
    $(n).replaceWith(removeFavHtml);
    $.tree.focused().cut(t);
    var i = $("#nodeFavorites");
    t.attr("rel", "favoritesNormalItem");
    $.tree.focused().paste(i) === !1 && ($.jGrowl("Could not add favorite item from list.", {
      header: "ALERT",
      group: "jgrowl-alert"
    }), isUndoFav = !1)
  }

  function r(n, t) {
    removeFavorite = !0;
    $(n).replaceWith(addFavHtml);
    $.tree.focused().cut(t);
    var i = $("#" + t.attr("parentHeader"));
    t.attr("rel", t.attr("ownerType"));
    $.tree.focused().paste(i) === !1 && ($.jGrowl("Could not remove favorite item from list.", {
      header: "ALERT",
      group: "jgrowl-alert"
    }), isUndoFav = !1)
  }
  typeof $.fn.tree == "function" && (firstSelect = !0, $("#Reports,#ReportsToh").tree({
    opened: ["nodeFavorites", "nodeDefault"],
    selected: "nodeSelected",
    ui: {
      theme_path: window.focusAppPath + "Scripts/jstree/themes/paragon/style.css?v=" + window._cssVersion,
      theme_name: "paragon"
    },
    rules: {
      valid_children: ["root"]
    },
    types: {
      "default": {
        max_depth: 0,
        valid_children: "none"
      },
      favoritesNormalItem: {
        icon: {
          position: "-16px -16px"
        }
      },
      normalItem: {
        icon: {}
      },
      mlsItem: {
        icon: {
          position: "-213px -1px"
        }
      },
      lsItem: {
        icon: {
          position: "-557px 0px"
        }
      },
      boardItem: {
        icon: {
          position: "-192px -1px"
        }
      },
      firmItem: {
        icon: {
          position: "-171px -1px"
        }
      },
      officeItem: {
        icon: {
          position: "-150px -1px"
        }
      },
      agentItem: {
        icon: {
          position: "-129px -2px"
        }
      },
      recycleMlsItem: {
        icon: {
          position: "-341px 0px"
        }
      },
      recyclelsItem: {
        icon: {
          position: "-586px 0px"
        }
      },
      recycleBoardItem: {
        icon: {
          position: "-316px -2px"
        }
      },
      recycleFirmItem: {
        icon: {
          position: "-292px -1px"
        }
      },
      recycleOfficeItem: {
        icon: {
          position: "-265px 0px"
        }
      },
      recycleAgentItem: {
        icon: {
          position: "-239px 0px"
        }
      },
      recycleNormalItem: {
        icon: {
          position: "-399px -1px"
        }
      },
      favoritesMlsItem: {
        icon: {
          position: "-213px -1px"
        }
      },
      favoriteslsItem: {
        icon: {
          position: "-557px 0px"
        }
      },
      favoritesBoardItem: {
        icon: {
          position: "-192px -1px"
        }
      },
      favoritesFirmItem: {
        icon: {
          position: "-171px -1px"
        }
      },
      favoritesOfficeItem: {
        icon: {
          position: "-150px -1px"
        }
      },
      favoritesAgentItem: {
        icon: {
          position: "-129px -2px"
        }
      },
      defaultContainer: {
        draggable: !1,
        icon: {}
      },
      defaultItem: {
        draggable: !1,
        icon: {}
      },
      favoritesContainer: {
        draggable: !1,
        valid_children: "favoritesNormalItem, favoritesMlsItem, favoritesBoardItem, favoritesFirmItem, favoritesOfficeItem, favoritesAgentItem",
        max_depth: 1
      },
      normalContainer: {
        draggable: !1,
        valid_children: "normalItem",
        max_depth: 1
      },
      recyclebinContainer: {
        draggable: !1,
        valid_children: "recycleMlsItem, recycleBoardItem, recycleFirmItem, recycleOfficeItem, recycleAgentItem, recycleNormalItem",
        max_depth: 1
      }
    },
    callback: {
      beforemove: function (n, t, i, r) {
        return CheckBeforeMove(r, t)
      },
      ondblclk: function () {
        return !1
      },
      onselect: function (n, t) {
        var s = $(n).attr("rel"),
          f;
        if (s != null && s.indexOf("Container") < 0) {
          if (n.innerHTML.indexOf("iPointSv") > 0) {
            var h = n.innerHTML.indexOf("iPointSv"),
              i = n.innerHTML.substring(h, n.innerHTML.indexOf('"', h)).split("~"),
              p = i[0].replace("iPointSv_", ""),
              r = i[1] == "null" ? null : i[1],
              u = i[2] == "null" ? null : i[2],
              w = i[3],
              c = i[4],
              l = i[5],
              b = n.innerText;
            try {
              f = integrationUrl + "/" + dataController.CurrentID + "/" + p;
              w == "Redirect" ? DoIntegrationPointReDirect(f, r, u, c, l, null) : parent.$.fn.colorbox({
                href: f,
                open: !0,
                iframe: !0,
                height: r + "px",
                width: u + "px",
                title: b,
                close: '<button id="Close" onClick="javascript:parent.$.fn.colorbox.close();" >Close<\/button>',
                onClosed: !1
              })
            } catch (e) {}
            return !1
          }
          if (n.innerHTML.indexOf("iPointTv") > 0) {
            var a = n.innerHTML.indexOf("iPointTv"),
              k = n.innerHTML.substring(a, n.innerHTML.indexOf('"', a)).split("~"),
              d = k[0].replace("iPointTv_", "");
            try {
              var g = taxIntegrationUrl + "?",
                nt = dataController.SelectedIDs.length > 0 ? dataController.SelectedIDs[0].ID.toString() : dataController.CurrentID.toString(),
                tt = $.param({
                  taxid: encodeURIComponent(nt),
                  id2: d,
                  taxDbId: intTaxDbId,
                  taxCounty: taxCountyName
                });
              DoIntegrationPointReDirect(g + tt, r, u, c, l, null)
            } catch (e) {}
            return !1
          }
          if ($(n).attr("colorbox") == "true" && window.dataController != undefined) {
            var e = "?",
              o = "&",
              v = 0,
              y = "sc=",
              it = "t=" + dataController.TotalRecords,
              rt = "cv=" + dataController.CurrentViewID;
            dataController.SelectedIDs.length > 0 && (v = dataController.SelectedIDs.length);
            y += v.toString();
            tempNode = n;
            e += it + o + y + o + rt + o + "searchID=" + frameElement.id;
            n.innerHTML.indexOf("broker_management_report") == -1 ? parent.$.fn.colorbox({
              href: marketConditionsAddendumUrl + e,
              open: !0,
              iframe: !0,
              width: "600px",
              height: "500px",
              title: "Market Conditions Addendum Report",
              close: '<button id="Generate">Generate Report<\/button><button id="Cancel">Cancel<\/button>',
              onClosed: !1
            }) : parent.$.fn.colorbox({
              href: brokerManagementReportUrl + e,
              open: !0,
              iframe: !0,
              width: "710px",
              height: "550px",
              title: "Broker Management Report",
              close: '<button id="Generate">Generate Report<\/button><button id="Cancel">Cancel<\/button>',
              onClosed: !1
            })
          } else $.focusFx.loadViewSelectorNode(n, !firstSelect), firstSelect = !1
        } else t.toggle_branch(n)
      },
      onmove: function (n) {
        movingIntoFavorites ? (displayFavsMsg = !0, $(n).attr("rel").indexOf("recycle") > -1 && (displayRecycleMsg = !0), $.tree.focused().set_type("favorites" + $(n).attr("ownerType"), n), $(n).children("a.add-fav").replaceWith(removeFavHtml)) : movingIntoRecycleBin ? (displayRecycleMsg = !0, $(n).attr("rel").indexOf("favorites") > -1 && (displayFavsMsg = !0), $.tree.focused().set_type("recycle" + $(n).attr("ownerType"), n)) : removeFavorite ? (displayFavsMsg = !0, $.tree.focused().set_type($(n).attr("ownerType"), n), $(n).children("a.remove-fav").replaceWith(addFavHtml)) : removeRecycleBinItem && (displayRecycleMsg = !0, $.tree.focused().set_type($(n).attr("ownerType"), n));
        saveFavoritesAndRecycleBinItems(n)
      }
    }
  }), $('#Reports li[rel^="recycle"]>a>ins').live("click", function (n) {
    var i = $(this).parent().parent().attr("rel").indexOf("favorites"),
      r = $(this).parent().parent().attr("rel").indexOf("recycle"),
      t, u;
    (i > -1 || r > -1) && $(this).parent().parent().attr("rel").toLowerCase().indexOf("item") > -1 && (n.stopPropagation(), removeFavorite = i > -1, removeRecycleBinItem = r > -1, t = $(this).parent().parent(), $.tree.focused().cut(t), u = $("#" + t.attr("parentHeader")), t.attr("rel", t.attr("ownerType")), $.tree.focused().paste(u) === !1 && $.jGrowl("Could not remove " + (removeFavorite ? "favorite" : "Recycle Bin") + " item from list.", {
      header: "ALERT",
      group: "jgrowl-alert"
    }))
  }), $("#ReportsOpenAll").click(function () {
    $.tree.focused().open_all();
    try {
      resizeReports()
    } catch (n) {}
  }), $("#ReportsCloseAll").click(function () {
    $.tree.focused().close_all();
    try {
      resizeReports()
    } catch (n) {}
  }));
  $.focusFx.postTreeLoad && $.focusFx.postTreeLoad();
  window.addEventListener("modifyDetailsReport.save", function (n) {
    t(n)
  });
  window.addEventListener("modifyResultsReport.save", function (t) {
    n(t)
  });
  window.addEventListener("modifyHotsheetResultsReport.save", function (t) {
    n(t)
  });
  window.addEventListener("modifyTohDetailsReport.save", function (n) {
    t(n)
  });
  window.addEventListener("modifyTohResultsReport.save", function (t) {
    n(t)
  });
  $("#Reports li.leaf").on("click", function (n) {
    n.srcElement.className.indexOf("add-fav") >= 0 || n.srcElement.parentElement.className.indexOf("add-fav") >= 0 ? (h(n), n.stopPropagation()) : n.srcElement.className.indexOf("remove-fav") >= 0 || n.srcElement.parentElement.className.indexOf("remove-fav") >= 0 ? (c(n), n.stopPropagation()) : n.srcElement.className.indexOf("modify-default-results") >= 0 ? (n.stopPropagation(), u()) : n.srcElement.className.indexOf("modify-default-details") >= 0 ? (n.stopPropagation(), f()) : n.srcElement.className.indexOf("modify-default-toh-results") >= 0 ? (n.stopPropagation(), o()) : n.srcElement.className.indexOf("modify-default-toh-details") >= 0 ? (n.stopPropagation(), s()) : n.srcElement.className.indexOf("modify-default-hotsheet-results") >= 0 && (n.stopPropagation(), e())
  });
  $(".undoAddFav").live("click", function (n) {
    isUndoFav = !0;
    var t = $(n.srcElement).attr("rel");
    t && t.length != 0 || (t = $(n.srcElement).parent().attr("rel"));
    r($("a[viewid=" + t + "]").siblings(), $("a[viewid=" + t + "]").parent("li[rel!='defaultItem']"));
    $(".jGrowl-notification").trigger("jGrowl.close")
  });
  $(".undoRemoveFav").live("click", function (n) {
    isUndoFav = !0;
    var t = $(n.srcElement).attr("rel");
    t && t.length != 0 || (t = $(n.srcElement).parent().attr("rel"));
    i($("a[viewid=" + t + "]").siblings(), $("a[viewid=" + t + "]").parent("li[rel!='defaultItem']"));
    $(".jGrowl-notification").trigger("jGrowl.close")
  })
});
m_VE_ReturnData = "",
  function (n) {
    n.focusFx || (n.focusFx = {});
    n.extend(n.focusFx, {
      loadMapTab: function (t) {
        t.attr("src", n.focusFx.getMapUrl())
      },
      getMapUrl: function () {
        var i = "?",
          e = n("#hdnf_518").val(),
          u, t, r, f;
        return e.length > 0 && (u = n("#Map").val(), u.length > 0 && (t = JSON.parse(u), i += "&Address=" + escape(t.address) + "&City=" + escape(t.city) + "&State=" + escape(t.state) + "&Zip=" + escape(t.zip) + "&MapZoom=" + t.zoom + "&CenterLat=" + t.centerLat + "&CenterLng=" + t.centerLng)), r = n.focusFx.getCountObject(), r.hasValidCount && (r.hasCountLessThanMaxPins && (i += "&SearchHasCountLessThenMaxPins=true"), i += "&SearchCount=" + r.countResult), i += "&IsFromSearch=true", f = n("a.f-form-map"), m_VE_ReturnData = null, f.attr("href") + i + "&tabName=" + window.frameElement.id
      },
      getCountObject: function () {
        var t = {
            hasValidCount: !1,
            countResult: 0,
            hasCountLessThanMaxPins: !1
          },
          i = n("#hdnf_518").val(),
          r = !1,
          u;
        return i.length > 0 && (u = JSON.parse(i), n.each(u, function (n, t) {
          t.Value.shapeType != 6 && (r = !0)
        })), n("#CountResult").val() != "" && (t.countResult = n("#CountResult").val().replace(/,/g, ""), t.hasValidCount = !0, parseInt(t.countResult, 10) <= window.g_searchMaxPins && !r && (t.hasCountLessThanMaxPins = !0)), t
      },
      bingSearch: function () {
        if (!window.g_hasMapTab && n("#Map").length > 0) parent.$.fn.colorbox({
          href: n.focusFx.getMapUrl() + "&iscolorbox=true",
          open: !0,
          iframe: !0,
          width: window.isTabletDevice() ? 940 : n(window).width() - 50,
          height: window.top.getAppHeight() - 50,
          close: '<button id="Add">Add To Criteria<\/button><button id="Instant">Search Now<\/button><button id="Cancel">Cancel<\/button>',
          title: window._mappingProviderName + " Map Search",
          onClosed: n.focusFx.processBingResult
        });
        else if (window.g_hasMapTab && n("#Map").length > 0) {
          var t = n.focusFx.getCurrentTab(),
            i = t.substring(0, t.lastIndexOf("_")),
            r = i + "_M";
          window.top.$('a[href="#' + i + '"] span[rel="#' + r + '"]').click()
        } else alert('The "Mapping" search control must be added to the layout for Mapping Search to work.');
        return !1
      },
      processBingResult: function (t) {
        var i, r, u, o, s;
        if (t = t || m_VE_ReturnData, t != null && typeof t == "object") {
          t.count != "" && n.focusFx.setCount(t.count, !0);
          var h = n("#f_518"),
            e = h.parent().parent()[0].acfb,
            f = [];
          for (i = 0; i < t.shapes.length; i++) r = t.shapes[i].shapeType, u = "Rubberband", r == "1" ? u = "Radius" : r == "4" ? u = "Polygon" : r == "5" ? u = "Map Boundary" : r == "6" ? u = "Distance" : r == "7" && (u = "Layer Item: " + t.shapes[i].description), o = "Shape" + (i + 1), s = {
            ID: o,
            Data: r == "5" || r == "7" ? u : "Shape " + (i + 1) + ": " + u,
            Value: t.shapes[i]
          }, f.push(s);
          n.focusFx.dontCountRightNow = !0;
          t.shapeArray = null;
          n("#Map").val(JSON.stringify(t));
          f.length > 0 && e.mergeResults([]);
          t.instant !== "1" && n("#hdnf_518").removeClass("f-cs-disable");
          e.mergeResults(f);
          n.focusFx.dontCountRightNow = !1;
          t.instant === "1" && (n("#hdnf_518").addClass("f-cs-disable"), n.focusFx.searchFormSubmit())
        }
      }
    })
  }(jQuery),
  function (n) {
    function i(n, t, i) {
      this.dec = n;
      this.group = t;
      this.neg = i
    }

    function t(n) {
      var t = ".",
        r = ",";
      return n == "us" || n == "ae" || n == "eg" || n == "il" || n == "jp" || n == "sk" || n == "th" || n == "cn" || n == "hk" || n == "tw" || n == "au" || n == "ca" || n == "gb" || n == "in" ? (t = ".", r = ",") : n == "de" || n == "vn" || n == "es" || n == "dk" || n == "at" || n == "gr" || n == "br" ? (t = ",", r = ".") : n == "cz" || n == "fr" || n == "fi" || n == "ru" || n == "se" ? (r = " ", t = ",") : n == "ch" && (r = "'", t = "."), new i(t, r, "-")
    }
    n.formatNumber = function (i, r) {
      var r = n.extend({}, n.fn.parse.defaults, r),
        u = t(r.locale.toLowerCase()),
        f = u.dec,
        s = u.group,
        e = u.neg,
        o = new String(i);
      return o.replace(".", f).replace("-", e)
    };
    n.fn.parse = function (i) {
      var i = n.extend({}, n.fn.parse.defaults, i),
        r = t(i.locale.toLowerCase()),
        e = r.dec,
        u = r.group,
        o = r.neg,
        s = "1234567890.-",
        f = [];
      return this.each(function () {
        var t = new String(n(this).text()),
          r, c, h, i;
        for (n(this).is(":input") && (t = new String(n(this).val())); t.indexOf(u) > -1;) t = t.replace(u, "");
        for (t = t.replace(e, ".").replace(o, "-"), r = "", c = !1, t.charAt(t.length - 1) == "%" && (c = !0), h = 0; h < t.length; h++) s.indexOf(t.charAt(h)) > -1 && (r = r + t.charAt(h));
        i = new Number(r);
        c && (i = i / 100, i = i.toFixed(r.length - 1));
        f.push(i)
      }), f
    };
    n.fn.format = function (i) {
      var i = n.extend({}, n.fn.format.defaults, i),
        r = t(i.locale.toLowerCase()),
        u = r.dec,
        f = r.group,
        e = r.neg,
        o = "0#-,.";
      return this.each(function () {
        var v = new String(n(this).text()),
          c, d, a, s, r, tt, it, b, l, p, g, nt, k, t;
        for (n(this).is(":input") && (v = new String(n(this).val())), c = "", d = !1, t = 0; t < i.format.length; t++)
          if (o.indexOf(i.format.charAt(t)) == -1) c = c + i.format.charAt(t);
          else if (t == 0 && i.format.charAt(t) == "-") {
          d = !0;
          continue
        } else break;
        for (a = "", t = i.format.length - 1; t >= 0; t--)
          if (o.indexOf(i.format.charAt(t)) == -1) a = i.format.charAt(t) + a;
          else break;
        for (i.format = i.format.substring(c.length), i.format = i.format.substring(0, i.format.length - a.length); v.indexOf(f) > -1;) v = v.replace(f, "");
        if (s = new Number(v.replace(u, ".").replace(e, "-")), a == "%" && (s = s * 100), r = "", tt = s % 1, i.format.indexOf(".") > -1) {
          var w = u,
            y = i.format.substring(i.format.lastIndexOf(".") + 1),
            h = new String(tt.toFixed(y.length));
          for (h = h.substring(h.lastIndexOf(".") + 1), t = 0; t < y.length; t++)
            if (y.charAt(t) == "#" && h.charAt(t) != "0") {
              w += h.charAt(t);
              continue
            } else if (y.charAt(t) == "#" && h.charAt(t) == "0")
            if (it = h.substring(t), it.match("[1-9]")) {
              w += h.charAt(t);
              continue
            } else break;
          else y.charAt(t) == "0" && (w += h.charAt(t));
          r += w
        } else s = Math.round(s);
        if (b = Math.floor(s), s < 0 && (b = Math.ceil(s)), l = "", b == 0) l = "0";
        else
          for (p = "", p = i.format.indexOf(".") == -1 ? i.format : i.format.substring(0, i.format.indexOf(".")), g = new String(Math.abs(b)), nt = 9999, p.lastIndexOf(",") != -1 && (nt = p.length - p.lastIndexOf(",") - 1), k = 0, t = g.length - 1; t > -1; t--) l = g.charAt(t) + l, k++, k == nt && t != 0 && (l = f + l, k = 0);
        r = l + r;
        s < 0 && d && c.length > 0 ? c = e + c : s < 0 && (r = e + r);
        i.decimalSeparatorAlwaysShown || r.lastIndexOf(u) == r.length - 1 && (r = r.substring(0, r.length - 1));
        r = c + r + a;
        n(this).is(":input") ? n(this).val(r) : n(this).text(r)
      })
    };
    n.fn.parse.defaults = {
      locale: "us",
      decimalSeparatorAlwaysShown: !1
    };
    n.fn.format.defaults = {
      format: "#,###.00",
      locale: "us",
      decimalSeparatorAlwaysShown: !1
    }
  }(jQuery),
  function (n, t, i, r) {
    function e(t, i) {
      this.element = t;
      this.$element = n(t);
      this.$container = null;
      this.options = n.extend({}, f, i);
      this._defaults = f;
      this._name = u;
      this.init()
    }
    var u = "multipleaddress",
      f = {
        directionUsed: !0,
        streetLookup: !1,
        streetLookupUrl: "",
        streetLookupPopupUrl: "",
        streetLookupPopupTitle: "",
        acfbDeleteImg: "",
        applicationTabId: "",
        fieldId: "",
        actionLinks: '<a class="f-action-delete ui-corner-all ui-state-default" href="javascript:;" title="Delete"><span class="ui-icon ui-icon-circle-close">Delete<\/span><\/a><a class="f-action-edit ui-corner-all ui-state-default" href="javascript:;" title="Edit"><span class="ui-icon ui-icon-pencil">Edit<\/span><\/a>',
        directionList: ["", "E", "N", "NE", "NW", "S", "SE", "SW", "W"]
      };
    e.prototype = {
      init: function () {
        n(this.element).click({
          that: this
        }, function (t) {
          var i = t.data.that,
            r = i.$element,
            o = r.data("cboxwidth") ? r.data("cboxwidth") : "70%",
            s = r.data("cboxheight") ? r.data("cboxheight") : "50%",
            u = r.data("forid"),
            f = "ma_" + u,
            e = i.buildPopupMarkup(f, u);
          r.parent().find("a[rel]:first").focusOverlay({
            load: !0,
            onBeforeLoad: function () {
              var t = this.getOverlay().find(".contentWrap:first"),
                r;
              t && (t.html(e), i.initElements(), r = n("#hdn" + u).val(), r.length > 0 && n.each(JSON.parse(r), function (n, t) {
                var r = t.Addr.addr,
                  u = i.getAddr(r.low, r.high, r.dir, r.name);
                i.exists(u) || i.buildInlineRow(u)
              }), t.show())
            },
            onSave: function () {
              var f = i.$element.siblings("ul.acfb-holder:first").get(0).acfb,
                t, r;
              f.clearData();
              t = 0;
              r = [];
              n("#ma_" + u).find("div.selected > div").each(function () {
                var i = {
                  ID: u + "." + t,
                  Data: n.data(this, "addr").toString(),
                  Addr: n.data(this)
                };
                r.push(i);
                t++
              });
              f.mergeResults(r)
            }
          })
        })
      },
      buildPopupMarkup: function (t, i) {
        var r = n('<div id="' + t + '" data-forid="' + i + '">' + this.buildHeader("Add Address") + "<\/div>");
        return r.append(this.buildAddressControl()).append(this.buildHeader("Selected Addresses")).append('<div class="selected"><\/div>').append(this.buildInlineControl()), r[0].outerHTML
      },
      initElements: function () {
        n("#add").button({
          disabled: !0
        });
        n("div.ma-container input.f-form-integer").focusMask("intMask");
        var t = this.options.acfbDeleteImg;
        this.$element.parent().find("div.contentWrap").find("ul.acfb-holder").each(function () {
          var i = n(this),
            r = "Data",
            u = "Description";
          n(this).autoCompletefb({
            urlLookup: i.data("url"),
            deleteImg: t,
            acOptions: {
              width: 300,
              multiple: !1,
              parse: function (n) {
                for (var i = [], t = 0; t < n.rows.length; t++) i[t] = {
                  data: n.rows[t],
                  value: n.rows[t][r],
                  result: n.rows[t][r]
                };
                return i
              },
              formatItem: function (n) {
                return n[r] + " - " + n[u]
              },
              noResultsMessage: "No Results Found."
            },
            popupSettings: {
              url: i.data("popupdataurl"),
              width: 600,
              title: i.data("popuptitle"),
              close: !1,
              onSave: function () {
                var r = i.find("input.acf").attr("id"),
                  u = i.get(0).acfb,
                  t, f;
                u.clearData();
                t = [];
                f = [n("#table_" + r).jqGrid("getGridParam", "selrow")];
                n.each(f, function (i, u) {
                  var f = n("#table_" + r).jqGrid("getRowData", u),
                    e = {
                      ID: f.ID,
                      Data: f.Data
                    };
                  t.push(e)
                });
                u.mergeResults(t)
              }
            }
          })
        });
        n("#low,#high,#direction,#name").keyup({
          that: this
        }, function (n) {
          var t = n.data.that;
          t.updateAddState(this)
        });
        n("#direction").change({
          that: this
        }, function (n) {
          var t = n.data.that;
          t.updateAddState(this)
        });
        n("#hdnname").change({
          that: this
        }, function (n) {
          var t = n.data.that;
          t.updateAddState(this)
        });
        n("#add").click({
          that: this
        }, function (t) {
          var i = t.data.that,
            u = i.getAddr(n.trim(n("#low").val()), n.trim(n("#high").val()), n.trim(n("#direction").val()), i.getAddrName("name")),
            r;
          i.exists(u) || i.buildInlineRow(u);
          n("#low,#high,#direction,#name,#hdnname").val("");
          r = n(this);
          r.button("option", "disabled", !0);
          r.parent().parent().find("ul.acfb-holder")[0].acfb.clearData();
          n("#low").focus()
        });
        n(".selected", this.$container).delegate("a.f-action-delete", "click", function () {
          n("#inlineeditor").appendTo("#inlinetemplate");
          n(this).parent().remove()
        });
        n(".selected", this.$container).delegate("a.f-action-edit", "click", function () {
          var i, t, u, r;
          n("#inlineeditor").parent().attr("id") != "inlinetemplate" && (i = n("#inlineeditor").parent(), n("inlineeditor").appendTo("#inlinetemplate"), n("span.f-data", i).text(n.data(i.get(0), "addr").toString()).show());
          i = n(this).parent();
          i.find("span.f-data").hide();
          t = n.data(i.get(0), "addr");
          n("#inlinelow").val(t.low);
          n("#inlinehigh").val(t.high);
          n("#inlinedirection").val(t.dir);
          u = n("#inlinename");
          u.hasClass("acfb-input") ? (r = u.parent().parent().get(0).acfb, r != null && t.nameJson != null && t.nameJson.length > 0 && t.nameJson[0].Data.length > 0 ? r.mergeResults(t.nameJson) : r != null && r.mergeResults([])) : n("#inlinename").val(t.name);
          n("#inlineeditor").appendTo(i);
          n("#Save").attr("disabled", "disabled")
        });
        n("#inlinesave").button().click({
          that: this
        }, function (t) {
          var i = t.data.that,
            r = i.getAddr(n.trim(n("#inlinelow").val()), n.trim(n("#inlinehigh").val()), n.trim(n("#inlinedirection").val()), i.getAddrName("inlinename")),
            u = n(this).parent().parent();
          n.data(u.get(0), "addr", r);
          n("#inlineeditor").appendTo("#inlinetemplate");
          n("span.f-data", u).text(r.toString()).show();
          n("#Save").removeAttr("disabled")
        });
        n("#inlinecancel").button().click(function () {
          var t = n(this).parents("div:first");
          n("#inlineeditor").appendTo("#inlinetemplate");
          n("span.f-data", t).show();
          n("#Save").removeAttr("disabled")
        })
      },
      buildHeader: function (n) {
        return '<div class="ui-state-default legend">' + n + "<\/div>"
      },
      buildAddressControl: function () {
        var r = "<table>",
          i = ["Low", "High"],
          n, t;
        return this.options.directionUsed && (i[i.length] = "Direction"), i[i.length] = "Street Name", i[i.length] = "", r += "<thead>", r += this.buildRow(!0, i), r += "<\/thead><tbody>", n = [], n[0] = '<input class="f-form-integer" id="low" maxlength="10" name="low" type="text" style="width: 75px;">', n[1] = '<input class="f-form-integer" id="high" maxlength="10" name="high" type="text" style="width: 75px;" >', this.options.directionUsed && (n[n.length] = '<select id="direction">' + this.buildOptions(this.options.directionList) + "<\/select>"), this.options.streetLookup ? (t = "<fieldset>", t += '<div class="ui-widget-container fieldset">', t += '  <div class="f-form-field">', t += '      <ul class="ui-helper-reset acfb-holder name" data-popupdataurl="' + this.options.streetLookupPopupUrl + '" data-popuptitle="' + this.options.streetLookupPopupTitle + '" data-url="' + this.options.streetLookupUrl + '">', t += '          <li><input class="ac_input acfb-input acf" id="name" name="name" type="text" autocomplete="off"><input class="acfb-value f-cs-item" id="hdnname" name="hdnname" type="hidden"><\/li>', t += "      <\/ul>", t += "    <\/div>", t += "<\/div>", t += "<\/fieldset>", n[n.length] = t) : n[n.length] = '<input id="name" maxlength="50" name="name" style="width: 150px" type="text">', n[n.length] = '<input type="button" value="Add" id="add" disabled="disabled">', r += this.buildRow(!1, n), r + "<\/tbody><\/table>"
      },
      buildInlineControl: function () {
        var n = '<div style="display:none;" id="inlinetemplate"><span id="inlineeditor">';
        return n += '<div style="float: left; width: 220px;">', n += '<input class="f-form-integer" id="inlinelow" maxlength="10" name="low" type="text" style="width: 75px; margin-right: 5px;">', n += '<input class="f-form-integer" id="inlinehigh" maxlength="10" name="low" type="text" style="width: 75px;">', this.options.directionUsed && (n += '<select id="inlinedirection">' + this.buildOptions(this.options.directionList) + "<\/select>"), n += "<\/div>", n += '<input id="inlinename" maxlength="50" name="inlinename" style="float: left; width: 150px" type="text" disabled="disabled">', n + '<input type="button" value="Save" id="inlinesave"/><input type="button" value="Cancel" id="inlinecancel"/><\/span><\/div>'
      },
      buildRow: function (n, t) {
        for (var i = "<tr>", r = 0; r < t.length; r++) i += n ? "<th>" : "<td>", i += t[r], i += n ? "<\/th>" : "<\/td>";
        return i + "<\/tr>"
      },
      buildOptions: function (n) {
        for (var i = "", t = 0; t < n.length; t++) i += '<option value="' + n[t] + '">' + n[t] + "<\/option>";
        return i
      },
      getAddr: function (t, i, r, u) {
        return {
          low: t,
          high: i,
          dir: r,
          name: u,
          nameJson: [{
            Data: u,
            Description: u,
            ID: n(".f-action-delete").length
          }],
          toString: function () {
            return this.low + (this.low !== "" || this.high !== "" ? "-" : "") + this.high + " " + this.dir + " " + this.name
          }
        }
      },
      getAddrName: function (t) {
        var i, r;
        return n("#hdn" + t).length > 0 && (i = n("#hdn" + t).val(), i != null && i.length > 0) ? (r = JSON.parse(i), r.length > 0 ? r[0].Data : "") : n.trim(n("#" + t).val())
      },
      updateAddState: function (t) {
        var i = n.trim(n(t).val()).length > 0;
        i || n("#low,#high,#direction,#name,#hdnname").each(function () {
          n.trim(n(this).val()).length > 0 && (i = !0)
        });
        n("#add").button("option", "disabled", !i)
      },
      exists: function (t) {
        return n(".selected div", this.$container).filter(function () {
          return objectEqual(t, n.data(this, "addr"))
        }).length > 0
      },
      buildInlineRow: function (t) {
        n("<div>" + this.options.actionLinks + '<span class="f-data">' + t.toString() + "<\/span><\/div>").appendTo(".selected", this.$container);
        n.data(n(".selected div:last", this.$container).get(0), "addr", t)
      }
    };
    objectEqual = function (n, t) {
      var i;
      if (typeof n === r && typeof t !== r || typeof t === r && typeof n !== r) return !1;
      if (typeof n === r && typeof t === r) return !0;
      for (i in n)
        if (typeof n[i] != "function" && (!t.hasOwnProperty(i) || n[i] !== t[i])) return !1;
      for (i in t)
        if (typeof t[i] != "function" && (!n.hasOwnProperty(i) || t[i] !== n[i])) return !1;
      return !0
    };
    n.fn[u] = function (t) {
      return this.each(function () {
        n.data(this, "plugin_" + u) || n.data(this, "plugin_" + u, new e(this, t))
      })
    }
  }(jQuery, window, document),
  function (n, t, i) {
    function a() {
      if (n.browser.msie) {
        var r = n(i).height(),
          u = n(t).height();
        return [t.innerWidth || i.documentElement.clientWidth || i.body.clientWidth, r - u < 20 ? u : r]
      }
      return [n(i).width(), n(i).height()]
    }

    function o(t) {
      if (t) return t.call(n.mask)
    }

    function y(t, i) {
      this.element = t;
      this.options = n.extend({}, l, i);
      this._defaults = l;
      this._name = e;
      this.init()
    }
    var r, s, u, f, h, v, c, e, l;
    n.focusTools = n.focusTools || {
      version: "0.1"
    };
    n.focusTools.overlay = {
      addEffect: function (n, t, i) {
        c[n] = [t, i]
      },
      conf: {
        close: null,
        closeOnClick: !0,
        closeOnEsc: !0,
        closeSpeed: "fast",
        effect: "default",
        fixed: !0,
        left: "center",
        load: !1,
        height: "80%",
        width: "80%",
        mask: {
          color: "#fff",
          loadSpeed: 200,
          opacity: .8
        },
        oneInstance: !0,
        speed: "normal",
        target: null,
        top: "10%"
      }
    };
    n.focusTools.expose = {
      conf: {
        maskId: "exposeMask",
        loadSpeed: "slow",
        closeSpeed: "fast",
        closeOnClick: !0,
        closeOnEsc: !0,
        zIndex: 9998,
        opacity: .8,
        startOpacity: 0,
        color: "#fff",
        onLoad: null,
        onClose: null
      }
    };
    n.focusOverlayMask = {
      load: function (e, c) {
        if (u) return this;
        typeof e == "string" && (e = {
          color: e
        });
        e = e || config;
        f = e = n.extend(n.extend({}, n.focusTools.expose.conf), e);
        r = n("#" + e.maskId);
        r.length || (r = n("<div/>").attr("id", e.maskId), n("body").append(r));
        var l = a();
        if (r.css({
            position: "absolute",
            top: 0,
            left: 0,
            width: l[0],
            height: l[1],
            display: "none",
            opacity: e.startOpacity,
            zIndex: e.zIndex
          }), e.color && r.css("backgroundColor", e.color), o(e.onBeforeLoad) === !1) return this;
        if (e.closeOnEsc) n(i).on("keydown.mask", function (t) {
          t.keyCode == 27 && n.focusOverlayMask.close(t)
        });
        if (e.closeOnClick) r.on("click.mask", function (t) {
          n.focusOverlayMask.close(t)
        });
        n(t).on("resize.mask", function () {
          n.focusOverlayMask.fit()
        });
        return c && c.length && (h = c.eq(0).css("zIndex"), n.each(c, function () {
          var t = n(this);
          /relative|absolute|fixed/i.test(t.css("position")) || t.css("position", "relative")
        }), s = c.css({
          zIndex: Math.max(e.zIndex + 1, h == "auto" ? 0 : h)
        })), r.css({
          display: "block"
        }).fadeTo(e.loadSpeed, e.opacity, function () {
          n.focusOverlayMask.fit();
          o(e.onLoad);
          u = "full"
        }), u = !0, this
      },
      close: function () {
        if (u) {
          if (o(f.onBeforeClose) === !1) return this;
          r.fadeOut(f.closeSpeed, function () {
            o(f.onClose);
            s && s.css({
              zIndex: h
            });
            u = !1
          });
          n(i).off("keydown.mask");
          r.off("click.mask");
          n(t).off("resize.mask")
        }
        return this
      },
      fit: function () {
        if (u) {
          var n = a();
          r.css({
            width: n[0],
            height: n[1]
          })
        }
      },
      getMask: function () {
        return r
      },
      isLoaded: function (n) {
        return n ? u == "full" : loaded
      },
      getConf: function () {
        return f
      },
      getExposed: function () {
        return s
      }
    };
    n.fn.focusOverlayMask = function (t) {
      return n.focusOverlayMask.load(t), this
    };
    n.fn.expose = function (t) {
      return n.focusOverlayMask.load(t, this), this
    };
    v = [];
    c = {};
    n.focusTools.overlay.addEffect("default", function (i, r) {
      var u = this.getConf(),
        f = n(t);
      u.fixed || (i.top += f.scrollTop(), i.left += f.scrollLeft());
      i.position = u.fixed ? "fixed" : "absolute";
      this.getOverlay().css(i).fadeIn(u.speed, r)
    }, function (n) {
      this.getOverlay().fadeOut(this.getConf().closeSpeed, n)
    });
    e = "focusOverlay";
    l = {
      load: !1,
      height: "40%",
      width: "80%",
      addSaveButton: !0,
      close: null,
      save: null,
      closeOnClick: !0,
      closeOnEsc: !0,
      closeSpeed: "fast",
      effect: "default",
      left: "center",
      mask: "darkgray",
      oneInstance: !0,
      speed: "normal",
      target: null,
      top: "10%",
      onBeforeLoad: null,
      onLoad: null,
      onSave: null,
      onBeforeClose: null,
      onClose: null
    };
    y.prototype = {
      init: function () {
        var e = n(this.element),
          r = this,
          s = e.add(r),
          h = n(t),
          o, l, u, a, f = n.focusTools.expose && (this.options.mask || this.options.expose),
          y = Math.random().toString().slice(10),
          p, w, b, k, d;
        if (f && (typeof f == "string" && (f = {
            color: f
          }), f.closeOnClick = f.closeOnEsc = !1), p = this.options.target || e.attr("rel"), u = p ? n(p) : null || e, !u.length) throw "Could not find Overlay: " + p;
        typeof this.options.width == "string" && this.options.width.indexOf("%", this.options.width.length - 1) !== -1 && (w = this.options.width.replace("%", ""), b = h.width() * (parseInt(w) / 100), this.options.width = b);
        typeof this.options.height == "string" && this.options.height.indexOf("%", this.options.height.length - 1) !== -1 && (k = this.options.height.replace("%", ""), d = h.height() * (parseInt(k) / 100), this.options.height = d);
        u.width(this.options.width);
        u.height(this.options.height);
        e && e.index(u) == -1 && e.click(function (n) {
          return r.load(n), n.preventDefault()
        });
        n.extend(r, {
          load: function (t) {
            var o;
            if (r.isOpened()) return r;
            if (o = c[this.options.effect], !o) throw 'Overlay: cannot find effect : "' + this.options.effect + '"';
            if (this.options.oneInstance && n.each(v, function () {
                this.close(t)
              }), t = t || n.Event(), t.type = "onBeforeLoad", s.trigger(t), t.isDefaultPrevented()) return r;
            a = !0;
            f && n(u).expose(f);
            var e = this.options.top,
              l = this.options.left,
              p = this.options.width,
              w = this.options.height;
            if (typeof e == "string" && (e = e == "center" ? Math.max((h.height() - w) / 2, 0) : parseInt(e, 10) / 100 * h.height()), l == "center" && (l = Math.max((h.width() - p) / 2, 0)), o[0].call(r, {
                top: e,
                left: l
              }, function () {
                a && (t.type = "onLoad", s.trigger(t))
              }), f && this.options.closeOnClick) n.focusOverlayMask.getMask().one("click", r.close);
            if (this.options.closeOnClick) n(i).on("click." + y, function (t) {
              n(t.target).parents(u).length || r.close(t)
            });
            if (this.options.closeOnEsc) n(i).on("keydown." + y, function (n) {
              n.keyCode == 27 && r.close(n)
            });
            return r
          },
          save: function (t) {
            if (t = t || n.Event(), t.type = "onSave", s.trigger(t), !t.isDefaultPrevented()) return r.close(t)
          },
          close: function (t) {
            if (!r.isOpened()) return r;
            if (t = t || n.Event(), t.type = "onBeforeClose", s.trigger(t), !t.isDefaultPrevented()) {
              a = !1;
              c[r.options.effect][1].call(r, function () {
                t.type = "onClose";
                s.trigger(t)
              });
              n(i).off("click." + y + " keydown." + y);
              var u = n("div.focus-overlay:visible").length;
              return f && u === 1 && n.focusOverlayMask.close(), r
            }
          },
          getOverlay: function () {
            return u
          },
          getTrigger: function () {
            return trigger
          },
          getClosers: function () {
            return o
          },
          isOpened: function () {
            return a
          },
          getConf: function () {
            return this.options
          }
        });
        n.each("onBeforeLoad,onStart,onLoad,onBeforeClose,onClose,onSave".split(","), function (t, i) {
          if (n.isFunction(r.options[i])) n(r).on(i, r.options[i]);
          r[i] = function (t) {
            if (t) n(r).on(i, t);
            return r
          }
        });
        l = u.find(this.options.save || ".save");
        l.length || this.options.save || (l = n('<button class="save">Save<\/button>'), u.prepend(l));
        l.click(function (n) {
          r.save(n)
        });
        o = u.find(this.options.close || ".close");
        o.length || this.options.close || (o = n('<button class="close">Close<\/button>'), u.prepend(o));
        o.click(function (n) {
          r.close(n)
        });
        u.find("button.save,button.close").button();
        this.options.load && r.load()
      }
    };
    n.fn[e] = function (t) {
      return this.each(function () {
        n.data(this, "plugin_" + e) || n.data(this, "plugin_" + e, new y(this, t))
      })
    }
  }(jQuery, window, document),
  function (n) {
    function r(r, u) {
      this.element = r;
      this.$element = n(r);
      this.$container = null;
      this.options = n.extend({}, i, u);
      this._defaults = i;
      this._name = t;
      this._uniqueId = 0;
      this.init()
    }
    var t = "wordsearch",
      i = {
        fieldListUrl: "",
        containerId: "",
        acfbDeleteImg: "",
        applicationTabId: "",
        fieldId: ""
      };
    r.prototype = {
      init: function () {
        n(this.element).click({
          that: this
        }, function (t) {
          var i = t.data.that,
            r, u;
          i.buildElementIfNeeded();
          r = i.cboxwidth != null ? i.cboxwidth : 700;
          u = i.cboxheight != null ? i.cboxheight : 500;
          n.fn.colorbox({
            inline: !0,
            href: i.$element.attr("link"),
            width: r,
            height: u,
            title: "Word Search",
            close: '<button id="Save">Save<\/button><button id="Close">Cancel<\/button>',
            onClosed: !1,
            onComplete: function () {
              n("#Close").click(function () {
                n.fn.colorbox.close()
              });
              n("#Save").click(function () {
                var t = i.options.applicationTabId.$("#" + i.options.fieldId),
                  u = t.parent().parent().get(0).acfb,
                  r = [];
                n("ul.wsCriteriaList .acfb-input", this.$container).each(function () {
                  var u = n(this).attr("id"),
                    f = n("#hdn" + u).val();
                  f != null && f.length > 0 && n.each(JSON.parse(f), function (f, e) {
                    i._uniqueId++;
                    var o = {};
                    o.ID = t.attr("id") + "__" + u + "__" + i._uniqueId;
                    o.Data = n("#fn_" + u).text() + ": " + (e.Data || e);
                    r.push(o)
                  })
                });
                u.mergeResults(r);
                n.fn.colorbox.close()
              })
            }
          })
        })
      },
      buildElementIfNeeded: function () {
        var t = this.$element.attr("link"),
          u, f, i, e, r;
        n(t).length == 0 ? (n(this.options.containerId).append('<div style="display: none;"><div class="word_search_container ui-widget" id="' + t.replace("#", "") + '">'), this.$container = n(t), this.$container.append('<div class="wsField ui-widget-content fieldset ui-field_selection">').append('<div class="wsCriteria ui-widget-content fieldset ui-word_container">'), u = n(".wsField", this.$container), u.append('<div class="wsFieldTitle ui-state-default legend ui-label">Field Selection<\/div>').append('<div class="wsFieldText">Add a field to search<\/div>').append('<input type="text" class="wsFieldFilter watermark watermarkOn" watermarkValue="Search" value="Search" />').append('<input class="wsFieldAdd" type="button" title="Add" value="Add" /> <br />').append('<select class="wsWords" multiple="multiple"><\/select>'), f = n(".wsCriteria", this.$container), f.append('<div class="wsCriteriaTitle ui-state-default legend ui-label" >Word Search<\/div>').append('<div class="wsCriteriaClearAll"><a href="#">Clear All<\/a><\/div>').append('<div class="wsCriteriaText">Add criteria to selected field<\/div>').append('<ul  class="wsCriteriaList"><\/ul>'), this.initElements()) : (this.$container = n(t), this.clearAllWordCriteria());
        i = this.options.applicationTabId.$("#hdn" + this.options.fieldId).val();
        i != null && i.length > 0 && (e = JSON.parse(i), r = this, n.each(e, function (t, i) {
          var e = n.trim(i.Data.split(":")[0]),
            u = i.ID.split("__")[1],
            f = n("#" + u);
          f.length == 0 && (r.addSelectedWord(e, u), f = n("#" + u));
          r._uniqueId++;
          i.Data = n.trim(i.Data.split(":")[1]);
          f.trigger("result", [i, i.Data])
        }))
      },
      initElements: function () {
        var t = this;
        this.blockUI("Loading Fields...");
        n.post(this.options.fieldListUrl, function (i) {
          n.each(i, function () {
            n("select.wsWords", t.$container).append('<option value="' + this.Value + '">' + this.Text + "<\/option>")
          });
          n.unblockUI()
        });
        n("select.wsWords", this.$container).dblclick({
          that: this
        }, this.addSelectedWordCriteria);
        n("input.wsFieldAdd", this.$container).click({
          that: this
        }, this.addSelectedWordCriteria);
        n("div.wsCriteriaClearAll", this.$container).click(this.clearAllWordCriteria);
        n("ul.wsCriteriaList .remove", this.$container).live("click", this.removeSelectedWordCriteria);
        n("input.wsFieldFilter", this.$container).autocomplete(n.map(n("select.wsWords option", this.$container), function (t) {
          return n(t).text()
        }));
        n("input.wsFieldFilter", this.$container).result(function (n, t) {
          this.filterList(t[0])
        });
        n("input.watermark", this.$container).watermark()
      },
      addSelectedWordCriteria: function (t) {
        var i = t.data.that;
        n("select option:selected").each(function () {
          var t = n(this).text(),
            r = n(this).val();
          i.addSelectedWord(t, r)
        })
      },
      addSelectedWord: function (t, i) {
        if (n("#" + i).length == 0) {
          var r = this.acfbuild(i);
          n("ul.wsCriteriaList", this.$container).append('<li class="f-cs-action"><div class="ui-state-default ui-corner-all" title="Remove"><span class="ui-icon ui-icon-close remove" /><\/div><span class="wsFilteredWord" id="fn_' + i + '">' + t + '<\/span><span id="wsFilteredWordData">' + r + "<\/span><\/li>");
          n("." + i).autoCompletefb({
            deleteImg: this.options.deleteImg
          })
        }
      },
      acfbuild: function (n) {
        var i = "hdn" + n,
          t = '<ul class="' + n + ' acfb-holder ui-helper-reset" style="width:300px !important;">';
        return t = t + '<input class="acf acfb-input ac_input" type="text" id="' + n + '" name="' + n + '" value = "" url="" data="" desc="" />', t = t + '<input class="acfb-hidden-values" type="hidden" name="' + i + '" id="' + i + '" value = "" />', t + "<\/ul>"
      },
      clearAllWordCriteria: function () {
        n("ul.wsCriteriaList li", this.$container).remove();
        n("input.wsFieldFilter", this.$container).addClass("watermarkOn").val("Search")
      },
      removeSelectedWordCriteria: function () {
        n(this).parent().parent().remove()
      },
      filterList: function (t) {
        n("select.wsWords", this.$container).children('@option[text="' + t + '"]').attr("selected", "selected");
        n("input.wsFieldFilter", this.$container).val("")
      },
      blockUI: function (t) {
        n.blockUI({
          message: t,
          fadeIn: 0,
          overlayCSS: {
            backgroundColor: "#000",
            opacity: .2
          },
          css: {
            border: "none",
            padding: "15px",
            backgroundColor: "#000",
            "-webkit-border-radius": "10px",
            "-moz-border-radius": "10px",
            opacity: .85,
            color: "#fff",
            fontSize: "32px",
            fontWeight: "bold"
          },
          baseZ: 1e4
        })
      }
    };
    n.fn[t] = function (i) {
      return this.each(function () {
        n.data(this, "plugin_" + t) || n.data(this, "plugin_" + t, new r(this, i))
      })
    }
  }(jQuery, window, document),
  function (n) {
    n.extend(n.fn, {
      livequery: function (t, i, r) {
        var f = this,
          u;
        return n.isFunction(t) && (r = i, i = t, t = undefined), n.each(n.livequery.queries, function (n, e) {
          if (f.selector == e.selector && f.context == e.context && t == e.type && (!i || i.$lqguid == e.fn.$lqguid) && (!r || r.$lqguid == e.fn2.$lqguid)) return (u = e) && !1
        }), u = u || new n.livequery(this.selector, this.context, t, i, r), u.stopped = !1, u.run(), this
      },
      expire: function (t, i, r) {
        var u = this;
        return n.isFunction(t) && (r = i, i = t, t = undefined), n.each(n.livequery.queries, function (f, e) {
          u.selector != e.selector || u.context != e.context || t && t != e.type || i && i.$lqguid != e.fn.$lqguid || r && r.$lqguid != e.fn2.$lqguid || this.stopped || n.livequery.stop(e.id)
        }), this
      }
    });
    n.livequery = function (t, i, r, u, f) {
      return this.selector = t, this.context = i || document, this.type = r, this.fn = u, this.fn2 = f, this.elements = [], this.stopped = !1, this.id = n.livequery.queries.push(this) - 1, u.$lqguid = u.$lqguid || n.livequery.guid++, f && (f.$lqguid = f.$lqguid || n.livequery.guid++), this
    };
    n.livequery.prototype = {
      stop: function () {
        var n = this;
        this.type ? this.elements.unbind(this.type, this.fn) : this.fn2 && this.elements.each(function (t, i) {
          n.fn2.apply(i)
        });
        this.elements = [];
        this.stopped = !0
      },
      run: function () {
        if (!this.stopped) {
          var i = this,
            t = this.elements,
            r = n(this.selector, this.context),
            u = r.not(t);
          this.elements = r;
          this.type ? (u.bind(this.type, this.fn), t.length > 0 && n.each(t, function (t, u) {
            n.inArray(u, r) < 0 && n.event.remove(u, i.type, i.fn)
          })) : (u.each(function () {
            i.fn.apply(this)
          }), this.fn2 && t.length > 0 && n.each(t, function (t, u) {
            n.inArray(u, r) < 0 && i.fn2.apply(u)
          }))
        }
      }
    };
    n.extend(n.livequery, {
      guid: 0,
      queries: [],
      queue: [],
      running: !1,
      timeout: null,
      checkQueue: function () {
        if (n.livequery.running && n.livequery.queue.length)
          for (var t = n.livequery.queue.length; t--;) n.livequery.queries[n.livequery.queue.shift()].run()
      },
      pause: function () {
        n.livequery.running = !1
      },
      play: function () {
        n.livequery.running = !0;
        n.livequery.run()
      },
      registerPlugin: function () {
        n.each(arguments, function (t, i) {
          if (n.fn[i]) {
            var r = n.fn[i];
            n.fn[i] = function () {
              var t = r.apply(this, arguments);
              return n.livequery.run(), t
            }
          }
        })
      },
      run: function (t) {
        t != undefined ? n.inArray(t, n.livequery.queue) < 0 && n.livequery.queue.push(t) : n.each(n.livequery.queries, function (t) {
          n.inArray(t, n.livequery.queue) < 0 && n.livequery.queue.push(t)
        });
        n.livequery.timeout && clearTimeout(n.livequery.timeout);
        n.livequery.timeout = setTimeout(n.livequery.checkQueue, 20)
      },
      stop: function (t) {
        t != undefined ? n.livequery.queries[t].stop() : n.each(n.livequery.queries, function (t) {
          n.livequery.queries[t].stop()
        })
      }
    });
    n.livequery.registerPlugin("append", "prepend", "after", "before", "wrap", "attr", "removeAttr", "addClass", "removeClass", "toggleClass", "empty", "remove");
    n(function () {
      n.livequery.play()
    });
    var t = n.prototype.init;
    n.prototype.init = function (n, i) {
      var r = t.apply(this, arguments);
      return n && n.selector && (r.context = n.context, r.selector = n.selector), typeof n == "string" && (r.context = i || document, r.selector = n), r
    };
    n.prototype.init.prototype = n.prototype
  }(jQuery);
! function (n) {
  "use strict";
  n(window.jQuery, window, document)
}(function (n, t, i, r) {
  "use strict";
  n.widget("selectBox.selectBoxIt", {
    VERSION: "3.8.1",
    options: {
      showEffect: "none",
      showEffectOptions: {},
      showEffectSpeed: "medium",
      hideEffect: "none",
      hideEffectOptions: {},
      hideEffectSpeed: "medium",
      showFirstOption: !0,
      defaultText: "",
      defaultIcon: "",
      downArrowIcon: "",
      theme: "default",
      keydownOpen: !0,
      isMobile: function () {
        var n = navigator.userAgent || navigator.vendor || t.opera;
        return /iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/.test(n)
      },
      "native": !1,
      aggressiveChange: !1,
      selectWhenHidden: !0,
      viewport: n(t),
      similarSearch: !1,
      copyAttributes: ["title", "rel"],
      copyClasses: "button",
      nativeMousedown: !1,
      customShowHideEvent: !1,
      autoWidth: !0,
      html: !0,
      populate: "",
      dynamicPositioning: !0,
      hideCurrent: !1
    },
    getThemes: function () {
      var i = this,
        t = n(i.element).attr("data-theme") || "c";
      return {
        bootstrap: {
          focus: "active",
          hover: "",
          enabled: "enabled",
          disabled: "disabled",
          arrow: "caret",
          button: "btn",
          list: "dropdown-menu",
          container: "bootstrap",
          open: "open"
        },
        jqueryui: {
          focus: "ui-state-focus",
          hover: "ui-state-hover",
          enabled: "ui-state-enabled",
          disabled: "ui-state-disabled",
          arrow: "ui-icon ui-icon-triangle-1-s",
          button: "ui-widget ui-state-default",
          list: "ui-widget ui-widget-content",
          container: "jqueryui",
          open: "selectboxit-open"
        },
        jquerymobile: {
          focus: "ui-btn-down-" + t,
          hover: "ui-btn-hover-" + t,
          enabled: "ui-enabled",
          disabled: "ui-disabled",
          arrow: "ui-icon ui-icon-arrow-d ui-icon-shadow",
          button: "ui-btn ui-btn-icon-right ui-btn-corner-all ui-shadow ui-btn-up-" + t,
          list: "ui-btn ui-btn-icon-right ui-btn-corner-all ui-shadow ui-btn-up-" + t,
          container: "jquerymobile",
          open: "selectboxit-open"
        },
        "default": {
          focus: "selectboxit-focus",
          hover: "selectboxit-hover",
          enabled: "selectboxit-enabled",
          disabled: "selectboxit-disabled",
          arrow: "selectboxit-default-arrow",
          button: "selectboxit-btn",
          list: "selectboxit-list",
          container: "selectboxit-container",
          open: "selectboxit-open"
        }
      }
    },
    isDeferred: function (t) {
      return n.isPlainObject(t) && t.promise && t.done
    },
    _create: function (t) {
      var r = this,
        f = r.options.populate,
        u = r.options.theme;
      if (r.element.is("select")) return r.widgetProto = n.Widget.prototype, r.originalElem = r.element[0], r.selectBox = r.element, r.options.populate && r.add && !t && r.add(f), r.selectItems = r.element.find("option"), r.firstSelectItem = r.selectItems.slice(0, 1), r.documentHeight = n(i).height(), r.theme = n.isPlainObject(u) ? n.extend({}, r.getThemes()["default"], u) : r.getThemes()[u] ? r.getThemes()[u] : r.getThemes()["default"], r.currentFocus = 0, r.blur = !0, r.textArray = [], r.currentIndex = 0, r.currentText = "", r.flipped = !1, t || (r.selectBoxStyles = r.selectBox.attr("style")), r._createDropdownButton()._createUnorderedList()._copyAttributes()._replaceSelectBox()._addClasses(r.theme)._eventHandlers(), r.originalElem.disabled && r.disable && r.disable(), r._ariaAccessibility && r._ariaAccessibility(), r.isMobile = r.options.isMobile(), r._mobile && r._mobile(), r.options["native"] && this._applyNativeSelect(), r.triggerEvent("create"), r
    },
    _createDropdownButton: function () {
      var t = this,
        i = t.originalElemId = t.originalElem.id || "",
        f = t.originalElemValue = t.originalElem.value || "",
        e = t.originalElemName = t.originalElem.name || "",
        r = t.options.copyClasses,
        u = t.selectBox.attr("class") || "";
      return t.dropdownText = n("<span/>", {
        id: i && i + "SelectBoxItText",
        "class": "selectboxit-text",
        unselectable: "on",
        text: t.firstSelectItem.text()
      }).attr("data-val", f), t.dropdownImageContainer = n("<span/>", {
        "class": "selectboxit-option-icon-container"
      }), t.dropdownImage = n("<i/>", {
        id: i && i + "SelectBoxItDefaultIcon",
        "class": "selectboxit-default-icon",
        unselectable: "on"
      }), t.dropdown = n("<span/>", {
        id: i && i + "SelectBoxIt",
        "class": "selectboxit " + ("button" === r ? u : "") + " " + (t.selectBox.prop("disabled") ? t.theme.disabled : t.theme.enabled),
        name: e,
        tabindex: t.selectBox.attr("tabindex") || "0",
        unselectable: "on"
      }).append(t.dropdownImageContainer.append(t.dropdownImage)).append(t.dropdownText), t.dropdownContainer = n("<span/>", {
        id: i && i + "SelectBoxItContainer",
        "class": "selectboxit-container " + t.theme.container + " " + ("container" === r ? u : "")
      }).append(t.dropdown), t
    },
    _createUnorderedList: function () {
      var e, o, s, a, u, v, y, p, h, c, r, i, f, t = this,
        w = "",
        b = t.originalElemId || "",
        k = n("<ul/>", {
          id: b && b + "SelectBoxItOptions",
          "class": "selectboxit-options",
          tabindex: -1
        }),
        l;
      return (t.options.showFirstOption || (t.selectItems.first().attr("disabled", "disabled"), t.selectItems = t.selectBox.find("option").slice(1)), t.selectItems.each(function (l) {
        i = n(this);
        o = "";
        s = "";
        e = i.prop("disabled");
        a = i.attr("data-icon") || "";
        u = i.attr("data-iconurl") || "";
        v = u ? "selectboxit-option-icon-url" : "";
        y = u ? "style=\"background-image:url('" + u + "');\"" : "";
        p = i.attr("data-selectedtext");
        h = i.attr("data-text");
        r = h ? h : i.text();
        f = i.parent();
        f.is("optgroup") && (o = "selectboxit-optgroup-option", 0 === i.index() && (s = '<span class="selectboxit-optgroup-header ' + f.first().attr("class") + '"data-disabled="true">' + f.first().attr("label") + "<\/span>"));
        i.attr("value", this.value);
        w += s + '<li data-id="' + l + '" data-val="' + this.value + '" data-disabled="' + e + '" class="' + o + " selectboxit-option " + (n(this).attr("class") || "") + '"><a class="selectboxit-option-anchor"><span class="selectboxit-option-icon-container"><i class="selectboxit-option-icon ' + a + " " + (v || t.theme.container) + '"' + y + "><\/i><\/span>" + (t.options.html ? r : t.htmlEscape(r)) + "<\/a><\/li>";
        c = i.attr("data-search");
        t.textArray[l] = e ? "" : c ? c : r;
        this.selected && (t._setText(t.dropdownText, p || r), t.currentFocus = l)
      }), t.options.defaultText || t.selectBox.attr("data-text")) && (l = t.options.defaultText || t.selectBox.attr("data-text"), t._setText(t.dropdownText, l), t.options.defaultText = l), k.append(w), t.list = k, t.dropdownContainer.append(t.list), t.listItems = t.list.children("li"), t.listAnchors = t.list.find("a"), t.listItems.first().addClass("selectboxit-option-first"), t.listItems.last().addClass("selectboxit-option-last"), t.list.find("li[data-disabled='true']").not(".optgroupHeader").addClass(t.theme.disabled), t.dropdownImage.addClass(t.selectBox.attr("data-icon") || t.options.defaultIcon || t.listItems.eq(t.currentFocus).find("i").attr("class")), t.dropdownImage.attr("style", t.listItems.eq(t.currentFocus).find("i").attr("style")), t
    },
    _replaceSelectBox: function () {
      var s, u, f, t = this,
        i = t.originalElem.id || "",
        e = t.selectBox.attr("data-size"),
        o = t.listSize = e === r ? "auto" : "0" === e ? "auto" : +e;
      return t.selectBox.css("display", "none").after(t.dropdownContainer), t.dropdownContainer.appendTo("body").addClass("selectboxit-rendering"), s = t.dropdown.height(), t.downArrow = n("<i/>", {
        id: i && i + "SelectBoxItArrow",
        "class": "selectboxit-arrow",
        unselectable: "on"
      }), t.downArrowContainer = n("<span/>", {
        id: i && i + "SelectBoxItArrowContainer",
        "class": "selectboxit-arrow-container",
        unselectable: "on"
      }).append(t.downArrow), t.dropdown.append(t.downArrowContainer), t.listItems.removeClass("selectboxit-selected").eq(t.currentFocus).addClass("selectboxit-selected"), u = t.downArrowContainer.outerWidth(!0), f = t.dropdownImage.outerWidth(!0), t.options.autoWidth && (t.dropdown.css({
        width: "auto"
      }).css({
        width: t.list.outerWidth(!0) + u + f
      }), t.list.css({
        "min-width": t.dropdown.width()
      })), t.dropdownText.css({
        "max-width": t.dropdownContainer.outerWidth(!0) - (u + f)
      }), t.selectBox.after(t.dropdownContainer), t.dropdownContainer.removeClass("selectboxit-rendering"), "number" === n.type(o) && (t.maxHeight = t.listAnchors.outerHeight(!0) * o), t
    },
    _scrollToView: function (n) {
      var t = this,
        e = t.listItems.eq(t.currentFocus),
        f = t.list.scrollTop(),
        r = e.height(),
        i = e.position().top,
        o = Math.abs(i),
        u = t.list.height();
      return "search" === n ? r > u - i ? t.list.scrollTop(f + (i - (u - r))) : -1 > i && t.list.scrollTop(i - r) : "up" === n ? -1 > i && t.list.scrollTop(f - o) : "down" === n && r > u - i && t.list.scrollTop(f + (o - u + r)), t
    },
    _callbackSupport: function (t) {
      var i = this;
      return n.isFunction(t) && t.call(i, i.dropdown), i
    },
    _setText: function (n, t) {
      var i = this;
      return i.options.html ? n.html(t) : n.text(t), i
    },
    open: function (n) {
      var t = this,
        i = t.options.showEffect,
        r = t.options.showEffectSpeed,
        u = t.options.showEffectOptions,
        f = t.options["native"],
        e = t.isMobile;
      return !t.listItems.length || t.dropdown.hasClass(t.theme.disabled) ? t : (f || e || this.list.is(":visible") || (t.triggerEvent("open"), t._dynamicPositioning && t.options.dynamicPositioning && t._dynamicPositioning(), "none" === i ? t.list.show() : "show" === i || "slideDown" === i || "fadeIn" === i ? t.list[i](r) : t.list.show(i, u, r), t.list.promise().done(function () {
        t._scrollToView("search");
        t.triggerEvent("opened")
      })), t._callbackSupport(n), t)
    },
    close: function (n) {
      var t = this,
        i = t.options.hideEffect,
        r = t.options.hideEffectSpeed,
        u = t.options.hideEffectOptions,
        f = t.options["native"],
        e = t.isMobile;
      return f || e || !t.list.is(":visible") || (t.triggerEvent("close"), "none" === i ? t.list.hide() : "hide" === i || "slideUp" === i || "fadeOut" === i ? t.list[i](r) : t.list.hide(i, u, r), t.list.promise().done(function () {
        t.triggerEvent("closed")
      })), t._callbackSupport(n), t
    },
    toggle: function () {
      var n = this,
        t = n.list.is(":visible");
      t ? n.close() : t || n.open()
    },
    _keyMappings: {
      38: "up",
      40: "down",
      13: "enter",
      8: "backspace",
      9: "tab",
      32: "space",
      27: "esc"
    },
    _keydownMethods: function () {
      var n = this,
        t = n.list.is(":visible") || !n.options.keydownOpen;
      return {
        down: function () {
          n.moveDown && t && n.moveDown()
        },
        up: function () {
          n.moveUp && t && n.moveUp()
        },
        enter: function () {
          var t = n.listItems.eq(n.currentFocus);
          n._update(t);
          "true" !== t.attr("data-preventclose") && n.close();
          n.triggerEvent("enter")
        },
        tab: function () {
          n.triggerEvent("tab-blur");
          n.close()
        },
        backspace: function () {
          n.triggerEvent("backspace")
        },
        esc: function () {
          n.close()
        }
      }
    },
    _eventHandlers: function () {
      var r, o, t = this,
        u = t.options.nativeMousedown,
        f = t.options.customShowHideEvent,
        i = t.focusClass,
        e = t.hoverClass,
        s = t.openClass;
      return this.dropdown.on({
        "click.selectBoxIt": function () {
          t.dropdown.trigger("focus", !0);
          t.originalElem.disabled || (t.triggerEvent("click"), u || f || t.toggle())
        },
        "mousedown.selectBoxIt": function () {
          n(this).data("mdown", !0);
          t.triggerEvent("mousedown");
          u && !f && t.toggle()
        },
        "mouseup.selectBoxIt": function () {
          t.triggerEvent("mouseup")
        },
        "blur.selectBoxIt": function () {
          t.blur && (t.triggerEvent("blur"), t.close(), n(this).removeClass(i))
        },
        "focus.selectBoxIt": function (r, u) {
          var f = n(this).data("mdown");
          n(this).removeData("mdown");
          f || u || setTimeout(function () {
            t.triggerEvent("tab-focus")
          }, 0);
          u || (n(this).hasClass(t.theme.disabled) || n(this).addClass(i), t.triggerEvent("focus"))
        },
        "keydown.selectBoxIt": function (n) {
          var i = t._keyMappings[n.keyCode],
            r = t._keydownMethods()[i];
          r && (r(), !t.options.keydownOpen || "up" !== i && "down" !== i || t.open());
          r && "tab" !== i && n.preventDefault()
        },
        "keypress.selectBoxIt": function (n) {
          var r = n.charCode || n.keyCode,
            i = t._keyMappings[n.charCode || n.keyCode],
            u = String.fromCharCode(r);
          t.search && (!i || i && "space" === i) && t.search(u, !0, !0);
          "space" === i && n.preventDefault()
        },
        "mouseenter.selectBoxIt": function () {
          t.triggerEvent("mouseenter")
        },
        "mouseleave.selectBoxIt": function () {
          t.triggerEvent("mouseleave")
        }
      }), t.list.on({
        "mouseover.selectBoxIt": function () {
          t.blur = !1
        },
        "mouseout.selectBoxIt": function () {
          t.blur = !0
        },
        "focusin.selectBoxIt": function () {
          t.dropdown.trigger("focus", !0)
        }
      }), t.list.on({
        "mousedown.selectBoxIt": function () {
          t._update(n(this));
          t.triggerEvent("option-click");
          "false" === n(this).attr("data-disabled") && "true" !== n(this).attr("data-preventclose") && t.close();
          setTimeout(function () {
            t.dropdown.trigger("focus", !0)
          }, 0)
        },
        "focusin.selectBoxIt": function () {
          t.listItems.not(n(this)).removeAttr("data-active");
          n(this).attr("data-active", "");
          var r = t.list.is(":hidden");
          (t.options.searchWhenHidden && r || t.options.aggressiveChange || r && t.options.selectWhenHidden) && t._update(n(this));
          n(this).addClass(i)
        },
        "mouseup.selectBoxIt": function () {
          u && !f && (t._update(n(this)), t.triggerEvent("option-mouseup"), "false" === n(this).attr("data-disabled") && "true" !== n(this).attr("data-preventclose") && t.close())
        },
        "mouseenter.selectBoxIt": function () {
          "false" === n(this).attr("data-disabled") && (t.listItems.removeAttr("data-active"), n(this).addClass(i).attr("data-active", ""), t.listItems.not(n(this)).removeClass(i), n(this).addClass(i), t.currentFocus = +n(this).attr("data-id"))
        },
        "mouseleave.selectBoxIt": function () {
          "false" === n(this).attr("data-disabled") && (t.listItems.not(n(this)).removeClass(i).removeAttr("data-active"), n(this).addClass(i), t.currentFocus = +n(this).attr("data-id"))
        },
        "blur.selectBoxIt": function () {
          n(this).removeClass(i)
        }
      }, ".selectboxit-option"), t.list.on({
        "click.selectBoxIt": function (n) {
          n.preventDefault()
        }
      }, "a"), t.selectBox.on({
        "change.selectBoxIt, internal-change.selectBoxIt": function (n, i) {
          var u, f;
          i || (u = t.list.find('li[data-val="' + t.originalElem.value + '"]'), u.length && (t.listItems.eq(t.currentFocus).removeClass(t.focusClass), t.currentFocus = +u.attr("data-id")));
          u = t.listItems.eq(t.currentFocus);
          f = u.attr("data-selectedtext");
          r = u.attr("data-text");
          o = r ? r : u.find("a").text();
          t._setText(t.dropdownText, f || o);
          t.dropdownText.attr("data-val", t.originalElem.value);
          u.find("i").attr("class") && (t.dropdownImage.attr("class", u.find("i").attr("class")).addClass("selectboxit-default-icon"), t.dropdownImage.attr("style", u.find("i").attr("style")));
          t.triggerEvent("changed")
        },
        "disable.selectBoxIt": function () {
          t.dropdown.addClass(t.theme.disabled)
        },
        "enable.selectBoxIt": function () {
          t.dropdown.removeClass(t.theme.disabled)
        },
        "open.selectBoxIt": function () {
          var n, r = t.list.find("li[data-val='" + t.dropdownText.attr("data-val") + "']");
          r.length || (r = t.listItems.not("[data-disabled=true]").first());
          t.currentFocus = +r.attr("data-id");
          n = t.listItems.eq(t.currentFocus);
          t.dropdown.addClass(s).removeClass(e).addClass(i);
          t.listItems.removeClass(t.selectedClass).removeAttr("data-active").not(n).removeClass(i);
          n.addClass(t.selectedClass).addClass(i);
          t.options.hideCurrent && (t.listItems.show(), n.hide())
        },
        "close.selectBoxIt": function () {
          t.dropdown.removeClass(s)
        },
        "blur.selectBoxIt": function () {
          t.dropdown.removeClass(i)
        },
        "mouseenter.selectBoxIt": function () {
          n(this).hasClass(t.theme.disabled) || t.dropdown.addClass(e)
        },
        "mouseleave.selectBoxIt": function () {
          t.dropdown.removeClass(e)
        },
        destroy: function (n) {
          n.preventDefault();
          n.stopPropagation()
        }
      }), t
    },
    _update: function (n) {
      var f, i, e, t = this,
        r = t.options.defaultText || t.selectBox.attr("data-text"),
        u = t.listItems.eq(t.currentFocus);
      "false" === n.attr("data-disabled") && (f = t.listItems.eq(t.currentFocus).attr("data-selectedtext"), i = u.attr("data-text"), e = i ? i : u.text(), (r && t.options.html ? t.dropdownText.html() === r : t.dropdownText.text() === r) && t.selectBox.val() === n.attr("data-val") ? t.triggerEvent("change") : (t.selectBox.val(n.attr("data-val")), t.currentFocus = +n.attr("data-id"), t.originalElem.value !== t.dropdownText.attr("data-val") && t.triggerEvent("change")))
    },
    _addClasses: function (n) {
      var t = this,
        i = (t.focusClass = n.focus, t.hoverClass = n.hover, n.button),
        r = n.list,
        u = n.arrow,
        f = n.container;
      return t.openClass = n.open, t.selectedClass = "selectboxit-selected", t.downArrow.addClass(t.selectBox.attr("data-downarrow") || t.options.downArrowIcon || u), t.dropdownContainer.addClass(f), t.dropdown.addClass(i), t.list.addClass(r), t
    },
    refresh: function (n, t) {
      var i = this;
      return i._destroySelectBoxIt()._create(!0), t || i.triggerEvent("refresh"), i._callbackSupport(n), i
    },
    htmlEscape: function (n) {
      return String(n).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    },
    triggerEvent: function (n) {
      var t = this,
        i = t.options.showFirstOption ? t.currentFocus : t.currentFocus - 1 >= 0 ? t.currentFocus : 0;
      return t.selectBox.trigger(n, {
        selectbox: t.selectBox,
        selectboxOption: t.selectItems.eq(i),
        dropdown: t.dropdown,
        dropdownOption: t.listItems.eq(t.currentFocus)
      }), t
    },
    _copyAttributes: function () {
      var n = this;
      return n._addSelectBoxAttributes && n._addSelectBoxAttributes(), n
    },
    _realOuterWidth: function (n) {
      if (n.is(":visible")) return n.outerWidth(!0);
      var i, t = n.clone();
      return t.css({
        visibility: "hidden",
        display: "block",
        position: "absolute"
      }).appendTo("body"), i = t.outerWidth(!0), t.remove(), i
    }
  });
  var u = n.selectBox.selectBoxIt.prototype;
  u.add = function (t, i) {
    this._populate(t, function (t) {
      var u, h, r = this,
        f = n.type(t),
        e = 0,
        o = [],
        c = r._isJSON(t),
        s = c && r._parseJSON(t);
      if (t && ("array" === f || c && s.data && "array" === n.type(s.data)) || "object" === f && t.data && "array" === n.type(t.data)) {
        for (r._isJSON(t) && (t = s), t.data && (t = t.data), h = t.length; h - 1 >= e; e += 1) u = t[e], n.isPlainObject(u) ? o.push(n("<option/>", u)) : "string" === n.type(u) && o.push(n("<option/>", {
          text: u,
          value: u
        }));
        r.selectBox.append(o)
      } else t && "string" === f && !r._isJSON(t) ? r.selectBox.append(t) : t && "object" === f ? r.selectBox.append(n("<option/>", t)) : t && r._isJSON(t) && n.isPlainObject(r._parseJSON(t)) && r.selectBox.append(n("<option/>", r._parseJSON(t)));
      return r.dropdown ? r.refresh(function () {
        r._callbackSupport(i)
      }, !0) : r._callbackSupport(i), r
    })
  };
  u._parseJSON = function (t) {
    return JSON && JSON.parse && JSON.parse(t) || n.parseJSON(t)
  };
  u._isJSON = function (n) {
    var t, i = this;
    try {
      return t = i._parseJSON(n), !0
    } catch (r) {
      return !1
    }
  };
  u._populate = function (t, i) {
    var r = this;
    return t = n.isFunction(t) ? t.call() : t, r.isDeferred(t) ? t.done(function (n) {
      i.call(r, n)
    }) : i.call(r, t), r
  };
  u._ariaAccessibility = function () {
    var t = this,
      i = n("label[for='" + t.originalElem.id + "']");
    return t.dropdownContainer.attr({
      role: "combobox",
      "aria-autocomplete": "list",
      "aria-haspopup": "true",
      "aria-expanded": "false",
      "aria-owns": t.list[0].id
    }), t.dropdownText.attr({
      "aria-live": "polite"
    }), t.dropdown.on({
      "disable.selectBoxIt": function () {
        t.dropdownContainer.attr("aria-disabled", "true")
      },
      "enable.selectBoxIt": function () {
        t.dropdownContainer.attr("aria-disabled", "false")
      }
    }), i.length && t.dropdownContainer.attr("aria-labelledby", i[0].id), t.list.attr({
      role: "listbox",
      "aria-hidden": "true"
    }), t.listItems.attr({
      role: "option"
    }), t.selectBox.on({
      "open.selectBoxIt": function () {
        t.list.attr("aria-hidden", "false");
        t.dropdownContainer.attr("aria-expanded", "true")
      },
      "close.selectBoxIt": function () {
        t.list.attr("aria-hidden", "true");
        t.dropdownContainer.attr("aria-expanded", "false")
      }
    }), t
  };
  u._addSelectBoxAttributes = function () {
    var t = this;
    return t._addAttributes(t.selectBox.prop("attributes"), t.dropdown), t.selectItems.each(function (i) {
      t._addAttributes(n(this).prop("attributes"), t.listItems.eq(i))
    }), t
  };
  u._addAttributes = function (t, i) {
    var r = this,
      u = r.options.copyAttributes;
    return t.length && n.each(t, function (t, r) {
      var f = r.name.toLowerCase(),
        e = r.value;
      "null" === e || -1 === n.inArray(f, u) && -1 === f.indexOf("data") || i.attr(f, e)
    }), r
  };
  u.destroy = function (n) {
    var t = this;
    return t._destroySelectBoxIt(), t.widgetProto.destroy.call(t), t._callbackSupport(n), t
  };
  u._destroySelectBoxIt = function () {
    var t = this;
    return t.dropdown.off(".selectBoxIt"), n.contains(t.dropdownContainer[0], t.originalElem) && t.dropdownContainer.before(t.selectBox), t.dropdownContainer.remove(), t.selectBox.removeAttr("style").attr("style", t.selectBoxStyles), t.triggerEvent("destroy"), t
  };
  u.disable = function (n) {
    var t = this;
    return t.options.disabled || (t.close(), t.selectBox.attr("disabled", "disabled"), t.dropdown.removeAttr("tabindex").removeClass(t.theme.enabled).addClass(t.theme.disabled), t.setOption("disabled", !0), t.triggerEvent("disable")), t._callbackSupport(n), t
  };
  u.disableOption = function (t, i) {
    var u, f, e, r = this,
      o = n.type(t);
    return "number" === o && (r.close(), u = r.selectBox.find("option").eq(t), r.triggerEvent("disable-option"), u.attr("disabled", "disabled"), r.listItems.eq(t).attr("data-disabled", "true").addClass(r.theme.disabled), r.currentFocus === t && (f = r.listItems.eq(r.currentFocus).nextAll("li").not("[data-disabled='true']").first().length, e = r.listItems.eq(r.currentFocus).prevAll("li").not("[data-disabled='true']").first().length, f ? r.moveDown() : e ? r.moveUp() : r.disable())), r._callbackSupport(i), r
  };
  u._isDisabled = function () {
    var n = this;
    return n.originalElem.disabled && n.disable(), n
  };
  u._dynamicPositioning = function () {
    var t = this,
      e, o;
    if ("number" === n.type(t.listSize)) t.list.css("max-height", t.maxHeight || "none");
    else {
      var s = t.dropdown.offset().top,
        i = t.list.data("max-height") || t.list.outerHeight(),
        r = t.dropdown.outerHeight(),
        u = t.options.viewport,
        h = u.height(),
        f = n.isWindow(u.get(0)) ? u.scrollTop() : u.offset().top,
        c = h + f >= s + r + i,
        l = !c;
      (t.list.data("max-height") || t.list.data("max-height", t.list.outerHeight()), l) ? t.dropdown.offset().top - f >= i ? (t.list.css("max-height", i), t.list.css("top", t.dropdown.position().top - t.list.outerHeight())) : (e = Math.abs(s + r + i - (h + f)), o = Math.abs(t.dropdown.offset().top - f - i), o > e ? (t.list.css("max-height", i - e - r / 2), t.list.css("top", "auto")) : (t.list.css("max-height", i - o - r / 2), t.list.css("top", t.dropdown.position().top - t.list.outerHeight()))): (t.list.css("max-height", i), t.list.css("top", "auto"))
    }
    return t
  };
  u.enable = function (n) {
    var t = this;
    return t.options.disabled && (t.triggerEvent("enable"), t.selectBox.removeAttr("disabled"), t.dropdown.attr("tabindex", 0).removeClass(t.theme.disabled).addClass(t.theme.enabled), t.setOption("disabled", !1), t._callbackSupport(n)), t
  };
  u.enableOption = function (t, i) {
    var u, r = this,
      f = n.type(t);
    return "number" === f && (u = r.selectBox.find("option").eq(t), r.triggerEvent("enable-option"), u.removeAttr("disabled"), r.listItems.eq(t).attr("data-disabled", "false").removeClass(r.theme.disabled)), r._callbackSupport(i), r
  };
  u.moveDown = function (n) {
    var t = this,
      i, r;
    if (t.currentFocus += 1, i = "true" === t.listItems.eq(t.currentFocus).attr("data-disabled") ? !0 : !1, r = t.listItems.eq(t.currentFocus).nextAll("li").not("[data-disabled='true']").first().length, t.currentFocus === t.listItems.length) t.currentFocus -= 1;
    else {
      if (i && r) return t.listItems.eq(t.currentFocus - 1).blur(), t.moveDown(), void 0;
      i && !r ? t.currentFocus -= 1 : (t.listItems.eq(t.currentFocus - 1).blur().end().eq(t.currentFocus).focusin(), t._scrollToView("down"), t.triggerEvent("moveDown"))
    }
    return t._callbackSupport(n), t
  };
  u.moveUp = function (n) {
    var t = this,
      i, r;
    if (t.currentFocus -= 1, i = "true" === t.listItems.eq(t.currentFocus).attr("data-disabled") ? !0 : !1, r = t.listItems.eq(t.currentFocus).prevAll("li").not("[data-disabled='true']").first().length, -1 === t.currentFocus) t.currentFocus += 1;
    else {
      if (i && r) return t.listItems.eq(t.currentFocus + 1).blur(), t.moveUp(), void 0;
      i && !r ? t.currentFocus += 1 : (t.listItems.eq(this.currentFocus + 1).blur().end().eq(t.currentFocus).focusin(), t._scrollToView("up"), t.triggerEvent("moveUp"))
    }
    return t._callbackSupport(n), t
  };
  u._setCurrentSearchOption = function (n) {
    var t = this;
    return (t.options.aggressiveChange || t.options.selectWhenHidden || t.listItems.eq(n).is(":visible")) && t.listItems.eq(n).data("disabled") !== !0 && (t.listItems.eq(t.currentFocus).blur(), t.currentIndex = n, t.currentFocus = n, t.listItems.eq(t.currentFocus).focusin(), t._scrollToView("search"), t.triggerEvent("search")), t
  };
  u._searchAlgorithm = function (n, t) {
    for (var f, e, i = this, h = !1, s = i.textArray, u = i.currentText, r = n, o = s.length; o > r; r += 1) {
      for (e = s[r], f = 0; o > f; f += 1) - 1 !== s[f].search(t) && (h = !0, f = o);
      if (h || (i.currentText = i.currentText.charAt(i.currentText.length - 1).replace(/[|()\[{.+*?$\\]/g, "\\$0"), u = i.currentText), t = new RegExp(u, "gi"), u.length < 3) {
        if (t = new RegExp(u.charAt(0), "gi"), -1 !== e.charAt(0).search(t)) return i._setCurrentSearchOption(r), (e.substring(0, u.length).toLowerCase() !== u.toLowerCase() || i.options.similarSearch) && (i.currentIndex += 1), !1
      } else if (-1 !== e.search(t)) return i._setCurrentSearchOption(r), !1;
      if (e.toLowerCase() === i.currentText.toLowerCase()) return i._setCurrentSearchOption(r), i.currentText = "", !1
    }
    return !0
  };
  u.search = function (n, t, i) {
    var r = this,
      u;
    return i ? r.currentText += n.replace(/[|()\[{.+*?$\\]/g, "\\$0") : r.currentText = n.replace(/[|()\[{.+*?$\\]/g, "\\$0"), u = r._searchAlgorithm(r.currentIndex, new RegExp(r.currentText, "gi")), u && r._searchAlgorithm(0, r.currentText), r._callbackSupport(t), r
  };
  u._updateMobileText = function () {
    var t, i, r, n = this;
    t = n.selectBox.find("option").filter(":selected");
    i = t.attr("data-text");
    r = i ? i : t.text();
    n._setText(n.dropdownText, r);
    n.list.find('li[data-val="' + t.val() + '"]').find("i").attr("class") && n.dropdownImage.attr("class", n.list.find('li[data-val="' + t.val() + '"]').find("i").attr("class")).addClass("selectboxit-default-icon")
  };
  u._applyNativeSelect = function () {
    var n = this;
    return n.dropdownContainer.append(n.selectBox), n.dropdown.attr("tabindex", "-1"), n.selectBox.css({
      display: "block",
      visibility: "visible",
      width: n._realOuterWidth(n.dropdown),
      height: n.dropdown.outerHeight(),
      opacity: "0",
      position: "absolute",
      top: "0",
      left: "0",
      cursor: "pointer",
      "z-index": "999999",
      margin: n.dropdown.css("margin"),
      padding: "0",
      "-webkit-appearance": "menulist-button"
    }), n.originalElem.disabled && n.triggerEvent("disable"), this
  };
  u._mobileEvents = function () {
    var n = this;
    n.selectBox.on({
      "changed.selectBoxIt": function () {
        n.hasChanged = !0;
        n._updateMobileText();
        n.triggerEvent("option-click")
      },
      "mousedown.selectBoxIt": function () {
        n.hasChanged || !n.options.defaultText || n.originalElem.disabled || (n._updateMobileText(), n.triggerEvent("option-click"))
      },
      "enable.selectBoxIt": function () {
        n.selectBox.removeClass("selectboxit-rendering")
      },
      "disable.selectBoxIt": function () {
        n.selectBox.addClass("selectboxit-rendering")
      }
    })
  };
  u._mobile = function () {
    var n = this;
    return n.isMobile && (n._applyNativeSelect(), n._mobileEvents()), this
  };
  u.remove = function (t, i) {
    var u, o, r = this,
      s = n.type(t),
      f = 0,
      e = "";
    if ("array" === s) {
      for (o = t.length; o - 1 >= f; f += 1) u = t[f], "number" === n.type(u) && (e += e.length ? ", option:eq(" + u + ")" : "option:eq(" + u + ")");
      r.selectBox.find(e).remove()
    } else "number" === s ? r.selectBox.find("option").eq(t).remove() : r.selectBox.find("option").remove();
    return r.dropdown ? r.refresh(function () {
      r._callbackSupport(i)
    }, !0) : r._callbackSupport(i), r
  };
  u.selectOption = function (t, i) {
    var r = this,
      u = n.type(t);
    return "number" === u ? r.selectBox.val(r.selectItems.eq(t).val()).change() : "string" === u && r.selectBox.val(t).change(), r._callbackSupport(i), r
  };
  u.setOption = function (t, i, r) {
    var u = this;
    return "string" === n.type(t) && (u.options[t] = i), u.refresh(function () {
      u._callbackSupport(r)
    }, !0), u
  };
  u.setOptions = function (t, i) {
    var r = this;
    return n.isPlainObject(t) && (r.options = n.extend({}, r.options, t)), r.refresh(function () {
      r._callbackSupport(i)
    }, !0), r
  };
  u.wait = function (n, t) {
    var i = this;
    return i.widgetProto._delay.call(i, t, n), i
  }
})