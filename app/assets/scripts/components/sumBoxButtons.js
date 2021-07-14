"use strict";

import addressInfo from "../modules/AddressInfo";
var $fx = L$();

class SumBoxButtons extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      liked: false,
      language: $("div#reportlanguage input", top.document),
      complexName: $(
        "div#app_banner_links_left input.select2-search__field",
        top.document
      ),
    };
  }

  render() {
    if (this.state.language.is(":checked")) {
      console.info("Hello React Chinese");
    }

    return (
      <div className="flex-container">
        <div>
          <div>
            <button title="Send CMA Listings" onClick={this.onExp.bind(this)}>
              Exp
            </button>
          </div>
          <div>
            <button
              title="Resume Tax Searches"
              onClick={() => this.onTaxSearch()}
            >
              Bca
            </button>
          </div>
          <div>
            <button
              title="Save Complex Name"
              onClick={() => this.onSaveComplexInfo()}
            >
              Cpx
            </button>
          </div>
        </div>
        <div>
          <div>
            <button
              title="Save CMA Subject Info"
              onClick={() => this.onSaveSubjectInfo()}
            >
              Sub
            </button>
          </div>
          <div>
            <button
              title="Send Listings Table to Map Search"
              id="mls-send-table-to-background"
              onClick={() => this.onSendTableInfoToBackground()}
            >
              Tbl
            </button>
          </div>
          <div>
            <button
              title="Update RPS Listings Info(neighborhood)"
              id="mls-get-data"
              onClick={() => this.onGetData()}
            >
              RPS
            </button>
          </div>
        </div>
      </div>
    );
  }

  onGetData(page = 1) {
    console.log("get data");
    //{"viewID":1,"searchID":"tab4_1_2","paging":{"_search":false,"nd":1602269249984,"rows":250,"page":1,"sidx":"0_13_","sord":"asc","sidx2":null,"sord2":null,"sidx3":null,"sord3":null}}
    // https://bcres.paragonrels.com/ParagonLS/Services/Listing.svc/json/v1/GetData
    let ajax_url =
      "https://bcres.paragonrels.com/ParagonLS/Services/Listing.svc/json/v1/GetData";
    let tabID = $fx.getSearchTabID();
    // remove '#' from tabID
    tabID = tabID.replace("#", "");
    var htmlTotalPages = $("#sp_1", parent.document);
    var totalPages = parseInt(htmlTotalPages.text());
    var currentPage = page;
    let listingData = {
      viewID: 1,
      searchID: tabID, //"tab4_1_2",
      paging: {
        _search: false,
        nd: 1602269249984,
        rows: 250,
        page: currentPage,
        sidx: "0_13_",
        sord: "asc",
        sidx2: null,
        sord2: null,
        sidx3: null,
        sord3: null,
      },
    };
    //do ajax call
    let ajax_call = $.ajax.bind(this);

    ajax_call({
      url: ajax_url,
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(listingData),
      dataType: "json",
      success: function (res) {
        //console.log("res::", JSON.stringify(res));
        let urlLocationOptionLocal = $("#pid_local", top.document);
        let urlLocation = urlLocationOptionLocal.prop("checked");
        let ajax_url = "";

        if (urlLocation) {
          ajax_url =
            "http://localhost/pidrealty4/wp-content/themes/Realhomes-child-3/db/updateRPSCommunity.php";
          ajax_url = "http://pidrealty4.local/wp-content/themes/Realhomes-child-3/db/updateRPSCommunity.php";
        } else {
          ajax_url =
            "https://cn.pidhomes.ca/wp-content/themes/realhomes-child-3/db/updateRPSCommunity.php";
        }

        let _listings = res.rows;
        let listings = [];
        let _listing = {};
        for (let i = 0; i < _listings.length; i++) {
          _listing = {
            mlsNo: _listings[i]["cell"][1],
            neighborhood: _listings[i]["cell"][8],
            communityName: _listings[i]["cell"][31],
          };
          listings.push(_listing);
        }
        let listingData = {
          listings: listings,
          ajax_url: ajax_url,
          todo: "UpdateCommunityInfoToWP",
          from: "spreadsheet_get_data",
        };
        chrome.runtime.sendMessage(listingData, (res) => {
          console.log(res);
          if (res === "Page Update Done") {
            // succeed, go to next page
            // htmlTotalPages = $('#sp_1', parent.document);
            // totalPages = (int)(htmlTotalPages.text());
            if (currentPage < totalPages) {
              console.log(
                `(CommunityName & Neighborhoods) Updating Page:${
                  currentPage + 1
                } Of ${totalPages}`
              );
              // go to update next page
              this.onGetData(currentPage + 1);
            } else {
              alert(
                `(CommunityName & Neighborhoods) All Pages:${totalPages} UPDATED!`
              );
            }
          } else {
            //failed, do not loop
            console.log(res);
          }
        });
      }.bind(this),
      error: function (jqXhr, textStatus, errorThrown) {
        console.log(errorThrown);
      },
    });
  }

  onTaxSearch() {
    let { parent } = this.props;
    console.log(parent);
    parent.searchTax();
  }

  onExp() {
    let { tabTitle } = this.props;
    ////---- Get the col name row, push names to the cloned table head row
    var htmlHead = document.querySelector(".ui-jqgrid-htable");
    var cloneHead = $(htmlHead).clone().attr("id", "newClonedHead");
    var htmlTable = document.querySelector("#grid");
    var cloneTable = $(htmlTable).clone().attr("id", "newClonedTable");

    var rowHead = $(cloneHead).children().find("tr");

    var originalHeadCells = $(rowHead).children("th");
    var exportTableRows = $(cloneTable).children().find("tr");

    var row0 = $(exportTableRows[0]);
    row0.height(40); //set the height of the table header
    var newHeadCells = row0.children("td");

    /////----NORMALIZE THE COL NAMES, COPY TO NEW TABLE
    this.normalizeColNames(newHeadCells, originalHeadCells);

    ////---- CHECK THE LANGUAGE ----////
    if (this.state.language.is(":checked")) {
      this.chineseColNames(newHeadCells);
    }

    ////----SELECT COLUMNS FOR EXPORTING, MAKE THE TABLE FOR EXPORTING
    let expType = $("select#SelectCMAType", top.document); // get the select element defined by MainMenu.js
    if (expType.find("option:selected").text() === "CMA4Exl") {
      //// ----only export to an excel file
      this.selectExportTableRows(tabTitle, exportTableRows);
      cloneTable.appendTo($(htmlTable));

      this.tableToExcel(cloneTable.attr("id"), "Listings Table");
      cloneTable.remove();
      return;
    } else {
      //// ----Send CMA records to mysql server
      this.selectCMATableRows(tabTitle, exportTableRows);
    }

    //////----PREPARE DATASET FOR MYSQL SERVER
    var rowValues = [];
    for (var i = 0; i < exportTableRows.length; i++) {
      var row = exportTableRows[i];
      var cells = $(row).children("td");
      var cellValues = [];
      var cellValue = null;
      for (var j = 0; j < cells.length; j++) {
        cellValue = cells[j].innerText;
        cellValues.push(cellValue);
      }
      // ADD cma_ID to the array
      let subjectOptions = $("select#SubjectProperty", top.document); // get the select element defined by MainMenu.js
      let cmaSubject = subjectOptions.children()[
        subjectOptions.prop("selectedIndex")
      ];
      let cmaID = cmaSubject.getAttribute("cmaID");
      cellValues.push(cmaID); //push the cma Subject ID into the array
      rowValues.push(cellValues);
    }

    // Check the URL local or remote
    let urlLocationOptionLocal = $("#pid_local", top.document);
    let urlLocation = urlLocationOptionLocal.prop("checked");
    let ajax_url = "";

    if (urlLocation) {
      ajax_url =
        "http://localhost/pidrealty4/wp-content/themes/Realhomes-child-3/db/dbSaveCMAInfo.php";
      ajax_url =
        "http://pidrealty4.local/wp-content/themes/Realhomes-child-3/db/dbSaveCMAInfo.php";
    } else {
      ajax_url =
        "https://pidhomes.ca/wp-content/themes/realhomes-child-3/db/dbSaveCMAInfo.php";
    }

    //////----DEFINE CMA OBJECT DATA
    var cmaInfo = {
      cmaData: rowValues,
      ajax_url: ajax_url,
      todo: "saveCMAInfo",
      from: "uiSummaryTable::onExp(save CMA Date)",
    };

    ////SEND THE COMPLEX NAME INTO THE DATABASE BY CALL ADD.COMPLEX.INFO
    chrome.runtime.sendMessage(cmaInfo, function (response) {
      console.log("save CMA Info");
    });
  }

  ////EXPORT TABLE TO EXCEL STEP 1
  normalizeColNames(newColCells, originalColCells) {
    ////NORMALIZE THE COL NAMES OF THE SPREADSHEET TABLE
    ////COPY THE NEW COL NAMES TO THE EXPORT TABLE HEAD
    var colName = "";
    for (var i = 0; i < newColCells.length; i++) {
      colName = originalColCells[i].textContent.trim();
      colName = colName.replace("1) ", "");
      colName = colName.replace("2) ", "");
      colName = colName.replace("3) ", "");
      switch (colName) {
        case "?":
          colName = "No";
          break;
        case "Price":
          colName = "Price0";
          break;
        case "DisplayId":
          colName = "MLS";
          break;
        case "landValue": //"Room28Dim1":
          colName = "LandValue";
          break;
        case "imprvValue": //"Room28Dim2":
          colName = "ImproveValue";
          break;
        case "totalValue": //"Room28Lev":
          colName = "BCAValue";
          break;
        case "change%": //"Room28Type":
          colName = "Change%";
          break;
        case "strataPlan": //"Room27Dim1":
          colName = "PlanNum";
          break;
        case "streetAddress": //"Room27Dim2":
          colName = "Address2"; //FORMAL.ADDRESS FROM TAX REPORT
          break;
        case "Unit#": //"Room27Lev":
          colName = "Unit#";
          break;
      }
      newColCells[i].textContent = colName;
    }
  }

  ////EXPORT TABLE TO EXCEL STEP 2
  chineseColNames(newColNames) {
    //// OUTPUT CHINESE HEAD LABLE
    var colName = "";
    for (var i = 0; i < newColNames.length; i++) {
      colName = newColNames[i].textContent.trim();
      switch (colName) {
        case "Complex/Subdivision":
          colName = "小区";
          break;
        case "Price":
          colName = "价格";
          break;
        case "Area":
          colName = "区域";
          break;
        case "BCAValue":
          colName = "政府估价";
          break;
        case "Strata Maint Fee":
        case "StratMtFee":
          colName = "管理费";
          break;
        case "Total Bedrooms":
        case "Tot BR":
          colName = "卧室";
          break;
        case "Total Baths":
        case "Tot Baths":
          colName = "卫生间";
          break;
        case "Address":
          colName = "地址";
          break;
        case "Unit#":
          colName = "单元号";
          break;
        case "Status":
          colName = "挂牌状况";
          break;
        case "DOM":
          colName = "上市天数";
          break;
        case "TotFlArea":
          colName = "室内面积";
          break;
        case "Price Per SQFT":
          colName = "单位呎价";
          break;
        case "Yr Blt":
          colName = "建造年份";
          break;
        case "Change%":
          colName = "变动幅度";
          break;
        case "S/A":
          colName = "社区";
          break;
        case "Price Date":
          colName = "上市日期";
          break;
      }
      newColNames[i].textContent = colName;
    }
  }

  ////EXPORT CMA/VPR TO MYSQL
  selectCMATableRows(tabTitle, tableRows) {
    if (
      tabTitle == "Residential Attached" ||
      tabTitle == "Residential Detached" ||
      tabTitle == "Market Monitor" ||
      tabTitle == "Listing Carts" ||
      tabTitle == "Quick Search" ||
      tabTitle == "Multi-Class"
    ) {
      for (var i = 0; i < tableRows.length; i++) {
        var row = tableRows[i];
        if (!$fx.inGreatVanArea($(row).children("td").eq(32).text())) {
          $(row).remove();
        } else {
          $(row).height(40);
          //REMOVE TAIL.CELLS 94 - 82
          for (var j = 94; j >= 82; j--) {
            $(row).children("td").eq(j).remove();
          }
          // 79 - 70
          for (var j = 79; j >= 70; j--) {
            $(row).children("td").eq(j).remove();
          }
          // 63-50
          for (var j = 63; j >= 50; j--) {
            $(row).children("td").eq(j).remove();
          }
          // 47 - 41
          for (var j = 47; j >= 41; j--) {
            $(row).children("td").eq(j).remove();
          }

          // 50
          //REMOVE HEADER.CELLS
          let RemovalHeadCellsNo = [
            39,
            38,
            37,
            36,
            34,
            33,
            24,
            14,
            9,
            7,
            6,
            5,
            4,
            1,
            0,
          ];
          for (var j in RemovalHeadCellsNo) {
            $(row).children("td").eq(RemovalHeadCellsNo[j]).remove();
          }
        }
      }
    }

    if (tabTitle == "Tour and Open House") {
      for (var i = 0; i < tableRows.length; i++) {
        var row = tableRows[i];
        if (!$fx.inGreatVanArea($(row).children("td").eq(32).text())) {
          $(row).remove();
        } else {
          $(row).height(40);
          //REMOVE CELLS
          let RemovalHeadCellsNo = [
            94,
            93,
            92,
            91,
            40,
            39,
            38,
            34,
            28,
            27,
            20,
            19,
            18,
            17,
            8,
            7,
            6,
            5,
            4,
            1,
            0,
          ];
          for (var j in RemovalHeadCellsNo) {
            $(row).children("td").eq(RemovalHeadCellsNo[j]).remove();
          }
        }
      }
    }
  }

  ////EXPORT TABLE TO EXCEL STEP 3
  selectExportTableRows(tabTitle, tableRows) {
    if (
      tabTitle == "Residential Attached" ||
      tabTitle == "Residential Detached" ||
      tabTitle == "Market Monitor" ||
      tabTitle == "Listing Carts" ||
      tabTitle == "Quick Search" ||
      tabTitle == "Multi-Class"
    ) {
      for (var i = 0; i < tableRows.length; i++) {
        var row = tableRows[i];
        if (!$fx.inGreatVanArea($(row).children("td").eq(32).text())) {
          $(row).remove();
        } else {
          $(row).height(40);
          //REMOVE TAIL.CELLS 94 - 82
          for (var j = 79; j >= 74; j--) {
            $(row).children("td").eq(j).remove();
          }
          //REMOVE HEADER.CELLS
          let RemovalHeadCellsNo = [7, 6, 5, 4, 1, 0];
          for (var j in RemovalHeadCellsNo) {
            $(row).children("td").eq(RemovalHeadCellsNo[j]).remove();
          }
        }
      }
    }

    if (tabTitle == "Tour and Open House") {
      for (var i = 0; i < tableRows.length; i++) {
        var row = tableRows[i];
        if (!$fx.inGreatVanArea($(row).children("td").eq(32).text())) {
          $(row).remove();
        } else {
          $(row).height(40);
          //REMOVE CELLS
          let RemovalHeadCellsNo = [
            94,
            93,
            92,
            91,
            40,
            39,
            38,
            34,
            28,
            27,
            20,
            19,
            18,
            17,
            8,
            7,
            6,
            5,
            4,
            1,
            0,
          ];
          for (var j in RemovalHeadCellsNo) {
            $(row).children("td").eq(RemovalHeadCellsNo[j]).remove();
          }
        }
      }
    }
  }

  tableToExcel(table, name) {
    var uri = "data:application/vnd.ms-excel;base64,",
      template = `<html xmlns:o="urn:schemas-microsoft-com:office:office" 
        xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
          <head><!--[if gte mso 9]>
            <xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
                <x:Name>{worksheet}</x:Name>
                <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
              </x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook>
            </xml><![endif]-->
          </head>
          <body>
            <table>{table}</table>
          </body>
        </html>`,
      base64 = function (s) {
        return window.btoa(unescape(encodeURIComponent(s)));
      },
      format = function (s, c) {
        return s.replace(/{(\w+)}/g, function (m, p) {
          return c[p];
        });
      };

    table = "#" + table;
    if (!table.nodeType) table = document.querySelector(table); //document.getElementById(table)
    var ctx = { worksheet: name || "Worksheet", table: table.innerHTML };
    window.location.href = uri + base64(format(template, ctx));
  }

  onSaveSubjectInfo() {
    console.log("onSaveSubjectInfo button clicked!");
    var address = "14043 109 AVE";
    var id = "1234";
    ////////////////////
    ////MANUALLY SAVE OR UPDATE COMPLEX NAME TO THE DATABASE
    ////RECORD NO HAS TO BE LOOK UP THE CHECKED ONE IN THE TABLE
    const { tabTitle } = this.props;
    //var self = this;
    var cols = $fx.setCols(tabTitle);
    ////SEARCH CHECKED RECORD NO
    var recordNo = 0;
    var recordRow_i = null;
    var SubjectAddress = "";
    var streetAddress_i = "";
    var cells_i = null;
    var complexCell_i = null;
    var recordNo_i = 0;
    var recordCheckbox_i = null;
    var htmlTable = document.querySelector("#grid");
    var recordRows = $(htmlTable).children().find("tr");

    for (var i = 1; i < recordRows.length; i++) {
      recordRow_i = $(recordRows[i]); ////LOOP ALL THE ROWS IN THE TABLE
      cells_i = recordRow_i.children();
      recordNo_i = cells_i[cols.RecordNo];
      recordCheckbox_i = $(cells_i[1]).children('input[type="checkbox"]'); ////HARDWIRED THE COL NO 1 TO THE CHECKBOX COLUMN
      if ($(recordCheckbox_i).prop("checked") == true) {
        recordNo = recordNo_i.textContent;
        break;
      }
      recordNo = -1;
    }
    if (recordNo == -1) {
      console.warn("No Record Selected!");
      return;
    } else {
      recordNo = ((recordNo - 1) % 250) + 1;
    }

    ////UPDATE THE COMPLEX NAME IN THE SPREAD SHEET
    var recordRow = $(recordRows[recordNo]); ////FETCH THE SELECTED ROW AND ITS CELLS
    var cells = recordRow.children();
    ////PREPARE THE FIELDS FOR THE COMPLEX.INFO OBJECT
    var subjectStreetAddress = cells[cols.StreetAddress].textContent;
    var subjectUnitNo = cells[cols.UnitNo].textContent;
    var subjectAge = cells[cols.Age].textContent;
    var landSize = $fx.convertStringToDecimal(cells[cols.LotSize].textContent);
    var floorArea = $fx.convertStringToDecimal(
      cells[cols.TotalFloorArea].textContent
    );
    var bcAssessImprove = $fx.convertStringToDecimal(
      cells[cols.ImprovementValue].textContent
    );
    var bcAssessLand = $fx.convertStringToDecimal(
      cells[cols.LandValue].textContent
    );
    var bcAssessTotal = $fx.convertStringToDecimal(
      cells[cols.TotalValue].textContent
    );
    var subjectHouseType = cells[cols.PropertyType].textContent;
    var subjectDwellingType = cells[cols.HouseType].textContent;
    var subjectCity = cells[cols.City].textContent;
    var maintenanceFee = cells[cols.StrataFeePSF].textContent;
    var neighborhood = cells[cols.Neighborhood].textContent;
    const listPrice = $fx.convertStringToDecimal(
      cells[cols.ListPrice].textContent
    );
    const soldPrice = $fx.convertStringToDecimal(
      cells[cols.SoldPrice].textContent
    );
    const bcaChange =
      parseFloat(cells[cols.ChangeValuePercent].textContent) / 100.0;

    let urlLocationOptionLocal = $("#pid_local", top.document);
    let htmlUpdateCurrentSubject = $("#checkUpdateSubjectInfo", top.document);
    let htmlCMAType = $("#SelectCMAType", top.document);
    let cmaType = htmlCMAType.val();
    let urlLocation = urlLocationOptionLocal.prop("checked");
    let updateCurrentSubject = htmlUpdateCurrentSubject.prop("checked");
    // get cma id
    // ADD cma_ID to the array
    let subjectOptions = $("select#SubjectProperty", top.document); // get the select element defined by MainMenu.js
    let cmaSubject = subjectOptions.children()[
      subjectOptions.prop("selectedIndex")
    ];
    let cmaID = cmaSubject.getAttribute("cmaID");

    let ajax_url = "";

    if (urlLocation) {
      ajax_url =
        "http://localhost/pidrealty4/wp-content/themes/Realhomes-child-3/db/dbAddSubjectProperty.php";
      ajax_url =
        "http://pidrealty4.local/wp-content/themes/Realhomes-child-3/db/dbAddSubjectProperty.php";
    } else {
      ajax_url =
        "https://pidhomes.ca/wp-content/themes/realhomes-child-3/db/dbAddSubjectProperty.php";
    }

    var subjectInfo = {
      cmaID: cmaID,
      cmaType: cmaType,
      address: subjectStreetAddress,
      unitNo: subjectUnitNo,
      age: subjectAge,
      landSize: landSize,
      floorArea: floorArea,
      bcAssessImprove: bcAssessImprove,
      bcAssessLand: bcAssessLand,
      bcAssessTotal: bcAssessTotal,
      subjectHouseType: subjectHouseType,
      subjectDwellingType: subjectDwellingType,
      maintenanceFee: maintenanceFee,
      city: subjectCity,
      neighborhood: neighborhood,
      listPrice: listPrice,
      soldPrice: soldPrice,
      bcaChange: bcaChange,
      ajax_url: ajax_url,
      updateSubject: updateCurrentSubject,
      todo: "saveSubjectInfo",
      from: "uiSummaryTable",
    };

    ////SEND THE COMPLEX NAME INTO THE DATABASE BY CALL ADD.COMPLEX.INFO
    chrome.runtime.sendMessage(subjectInfo, function (response) {});

    ////FEEDBACK THE INPUT AREA WITH ADDED STAR SIGN
    // this.state.complexName.val(complexName + "*");

    ///////////////
  }

  onSaveComplexInfo() {
    ////MANUALLY SAVE OR UPDATE COMPLEX NAME TO THE DATABASE
    ////RECORD NO HAS TO BE LOOK UP THE CHECKED ONE IN THE TABLE
    const { tabTitle } = this.props;
    //var self = this;
    var cols = $fx.setCols(tabTitle);
    var complexName = $fx.normalizeComplexName(this.state.complexName.val()); ////NORMALIZED THE COMPLEX NAME

    if (complexName.length == 0) {
      console.warn("NOT INPUT A VALID COMPLEX NAME");
      return;
    }
    ////SEARCH CHECKED RECORD NO
    var recordNo = 0;
    var recordRow_i = null;
    var strataPlan_i = "";
    var streetAddress_i = "";
    var cells_i = null;
    var complexCell_i = null;
    var recordNo_i = 0;
    var recordCheckbox_i = null;
    var htmlTable = document.querySelector("#grid");
    var recordRows = $(htmlTable).children().find("tr");

    for (var i = 1; i < recordRows.length; i++) {
      recordRow_i = $(recordRows[i]); ////LOOP ALL THE ROWS IN THE TABLE
      cells_i = recordRow_i.children();
      recordNo_i = cells_i[cols.RecordNo];
      recordCheckbox_i = $(cells_i[1]).children('input[type="checkbox"]'); ////HARDWIRED THE COL NO 1 TO THE CHECKBOX COLUMN
      if ($(recordCheckbox_i).prop("checked") == true) {
        recordNo = recordNo_i.textContent;
        break;
      }
      recordNo = -1;
    }
    if (recordNo == -1) {
      console.warn("No Record Selected!");
      return;
    } else {
      recordNo = ((recordNo - 1) % 250) + 1;
    }

    ////UPDATE THE COMPLEX NAME IN THE SPREAD SHEET
    var recordRow = $(recordRows[recordNo]); ////FETCH THE SELECTED ROW AND ITS CELLS
    var cells = recordRow.children();

    var strataPlan = cells[cols.StrataPlan].textContent;
    var streetAddress = cells[cols.StreetAddress].textContent;

    for (var i = 1; i < recordRows.length; i++) {
      recordRow_i = $(recordRows[i]); ////LOOP ALL THE ROWS IN THE TABLE
      cells_i = recordRow_i.children();
      recordNo_i = cells_i[cols.RecordNo];
      recordCheckbox_i = $(cells_i[2]).children().find('input[type="checkbox'); ////HARDWIRED THE COL NO 2 TO THE CHECKBOX COLUMN
      complexCell_i = cells_i[cols.ComplexName];
      strataPlan_i = cells_i[cols.StrataPlan].textContent;
      streetAddress_i = cells_i[cols.StreetAddress].textContent;
      if (strataPlan == strataPlan_i && streetAddress == streetAddress_i) {
        complexCell_i.textContent = complexName;
      }
    }

    ////SAVE THE COMPLEX.INFO INTO THE DATABASE
    if (complexName.length > 0) {
      ////PREPARE THE FIELDS FOR THE COMPLEX.INFO OBJECT
      var subArea = cells[cols.SubArea].textContent;
      var neighborhood = cells[cols.Neighborhood].textContent;
      var postcode = cells[cols.Postcode].textContent;
      var houseType = cells[cols.HouseType].textContent;
      var formalAddress = cells[cols.Address].textContent;
      var isFormalAddress = true;
      var address = new addressInfo(formalAddress, houseType, isFormalAddress);
      var strataPlan = cells[cols.StrataPlan].textContent;
      var totalUnits = 0;
      var devUnits = 0;

      ////ASSEMBLE THE COMPLEX INFO OBJECT
      var complexInfo = {
        _id:
          strataPlan +
          "-" +
          address.streetNumber +
          "-" +
          address.streetName +
          "-" +
          address.streetType,
        name: complexName,
        complexName: complexName,
        strataPlan: strataPlan,
        addDate: $fx.getToday(),
        subArea: subArea,
        neighborhood: neighborhood,
        postcode: postcode,
        streetNumber: address.streetNumber,
        streetName: address.streetName + " " + address.streetType,
        dwellingType: houseType,
        totalUnits: totalUnits,
        devUnits: devUnits,
        todo: "saveComplexInfo",
        from: "uiSummaryTable",
      };

      ////SEND THE COMPLEX NAME INTO THE DATABASE BY CALL ADD.COMPLEX.INFO
      chrome.runtime.sendMessage(complexInfo, function (response) {});

      ////FEEDBACK THE INPUT AREA WITH ADDED STAR SIGN
      this.state.complexName.val(complexName + "*");
    }
  }

  onSendTableInfoToBackground() {
    console.log("send the listing table to background event page !!");
    var htmlTable = document.querySelector("#grid");
    var htmlHead = document.querySelector(".ui-jqgrid-htable");
    var tableData = JSON.stringify(htmlTable.innerHTML);
    var tagsToReplace = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
    };

    function replaceTag(tag) {
      return tagsToReplace[tag] || tag;
    }

    function safe_tags_replace(str) {
      return str.replace(/[&<>]/g, replaceTag);
    }
    var array = [];
    var headers = [];
    $(".ui-jqgrid-htable th").each(function (index, item) {
      headers[index] = $(item)
        .html()
        .replace(/(<([^>]+)>)/gi, "")
        .replace("&nbsp;", "")
        .substr(0, 50);
    });
    $("#grid tr")
      .has("td")
      .each(function () {
        var arrayItem = {};
        $("td", $(this)).each(function (index, item) {
          arrayItem[headers[index]] = $(item)
            .html()
            .replace(/(<([^>]+)>)/gi, "")
            .replace("&nbsp;", "");
        });
        array.push(arrayItem);
      });

    var tableInfo = {
      table: JSON.stringify(array),
      todo: "saveTableInfo",
      from: "uiSummaryTable::onSendTableToBackground",
    };

    ////SEND THE COMPLEX NAME INTO THE DATABASE BY CALL ADD.COMPLEX.INFO
    chrome.runtime.sendMessage(tableInfo, function (response) {
      console.log("save CMA Info");
    });
  }
}

export default SumBoxButtons;

////////////////////RECYCLE ZONE////////////////////
//------------------------------------------------//

//const e = React.createElement;

// var tableToExcel = (function() {
//   var uri = "data:application/vnd.ms-excel;base64,",
//     template =
//       '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
//     base64 = function(s) {
//       return window.btoa(unescape(encodeURIComponent(s)));
//     },
//     format = function(s, c) {
//       return s.replace(/{(\w+)}/g, function(m, p) {
//         return c[p];
//       });
//     };
//   return function(table, name) {
//     if (!table.nodeType) table = document.querySelector(table); //document.getElementById(table)
//     var ctx = { worksheet: name || "Worksheet", table: table.innerHTML };
//     window.location.href = uri + base64(format(template, ctx));
//   };
// })();

// $(row)
//   .children("td")
//   .eq(40)
//   .remove(); //
// $(row)
//   .children("td")
//   .eq(39)
//   .remove(); //Floor Plan Url
// $(row)
//   .children("td")
//   .eq(38)
//   .remove();
// $(row)
//   .children("td")
//   .eq(34)
//   .remove(); //
// $(row)
//   .children("td")
//   .eq(28)
//   .remove(); //Floor Plan Url
// $(row)
//   .children("td")
//   .eq(27)
//   .remove(); //Building Plan
// $(row)
//   .children("td")
//   .eq(20)
//   .remove(); //ML # with Link
// $(row)
//   .children("td")
//   .eq(19)
//   .remove(); //Status
// $(row)
//   .children("td")
//   .eq(18)
//   .remove(); //Postal Code
// $(row)
//   .children("td")
//   .eq(17)
//   .remove(); //Province
// $(row)
//   .children("td")
//   .eq(8)
//   .remove(); //ML # with Link
// $(row)
//   .children("td")
//   .eq(7)
//   .remove(); //ML # with Link
// $(row)
//   .children("td")
//   .eq(6)
//   .remove(); //Action Icons
// $(row)
//   .children("td")
//   .eq(5)
//   .remove(); //Pcitures
// $(row)
//   .children("td")
//   .eq(4)
//   .remove(); //Pictures NO
// //$(row).children('td').eq(3).remove(); //Keep the records number
// $(row)
//   .children("td")
//   .eq(2)
//   .remove(); //Hidden
// $(row)
//   .children("td")
//   .eq(1)
//   .remove(); //Hidden
