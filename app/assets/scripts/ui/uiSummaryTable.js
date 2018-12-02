//// UI ELEMENT: Extra Summary Table
"use strict";

import SumBoxButtons from "../components/sumBoxButtons";
import SumBoxBanners from "../components/sumBoxBanners";

export default class UISummaryTable {
  constructor(parent) {
    this.parent = parent;
    this.tabTitle = "";
    this.sumValues = {
      index: 1,
      high: 0,
      low: 0,
      ave: 0,
      med: 0,
      total: 0
    };
    this.$UITable = $(`<div id = "SummaryFunctionBox" style = 'top: 30px; left: 850px; position: absolute'>
                            <div id = "sumButtonsContainer" style = "z-index: 999" ></div>
                            <div id = "sumBannersContainer" style = 'top: 0px; left: 60px; position: absolute'></div>
                        </div>`);
  }

  showUI(container) {
    this.$UITable.appendTo(container);

    const btnContainer = parent.document.querySelector("#sumButtonsContainer");
    const bannerContainer = parent.document.querySelector(
      "#sumBannersContainer"
    );

    ReactDOM.render(
      <SumBoxButtons tabTitle={this.tabTitle} parent={this.parent} />,
      btnContainer
    );
    ReactDOM.render(
      <SumBoxBanners sumValues={this.sumValues} />,
      bannerContainer
    );
  }

  setHighListedSFP(x) {
    // $(this.$UITable)
    //   .find("#HighAskingPricePSF")
    //   .text("$" + x);
    this.sumValues.high = x;
    this.sumValues.index = 1;
  }

  setHighSoldSFP(x) {
    $(this.$UITable)
      .find("#HighSoldPricePSF")
      .text("$" + x);
  }

  setLowListedSFP(x) {
    $(this.$UITable)
      .find("#LowAskingPricePSF")
      .text("$" + x);
  }

  setLowSoldSFP(x) {
    $(this.$UITable)
      .find("#LowSoldPricePSF")
      .text("$" + x);
  }

  setAvgListedSFP(x) {
    $(this.$UITable)
      .find("#AverageAskingPricePSF")
      .text("$" + x);
  }

  setAvgSoldSFP(x) {
    $(this.$UITable)
      .find("#AverageSoldPricePSF")
      .text("$" + x);
  }

  setMedianListedSFP(x) {
    $(this.$UITable)
      .find("#MedianAskingPricePSF")
      .text("$" + x);
  }

  setMedianSoldSFP(x) {
    $(this.$UITable)
      .find("#MedianSoldPrice")
      .text("$" + x);
  }
}

///////////////////////RECYCLE ZONE////////////////////////////
////-------------------------------------------------------////

{
  /* <button type="button" id="btnExport" title="Export to Excel" style = "position: absolute; width: 60px; z-index: 999" >Exp</button>
<button type="button" id="btnAssess" title="Update BCA Assess" style = "top: 20px; width: 60px; position: absolute; z-index: 999" >Bca</button>
<button type="button" id="btnComplex" title="Update Complex Name" style = "top: 40px; width: 60px; position: absolute; z-index: 999" >Cpx</button> */
}

// addComplexInfo(complex) {
//     var self = this;
//     ////PREPARE THE INFORMATION FIELDS FOR THE COMPLEX.INFO OBJECT
//     ////FETCH ALL THE INFORMTION FROM THE SELECTED ROW
// 	var subArea = self.subArea.text();
// 	var neighborhood = self.neighborhood.text();
// 	var postcode = self.postcode.text();
// 	var dwellingType = self.dwellingType.text();
// 	var complexName = complex || self.complexOrSubdivision.text().trim();
// 	complexName = $fx.normalizeComplexName(complexName);
// 	if(typeof complexName != 'string' && complexName.length<=0){
// 		console.log("ComplexName does not existed"); ////exit
// 		return;
// 	}
// 	var addressSelect = '';
// 	var isFormalAddress = true;
// 	if(typeof self.formalAddress.text() =="string" && self.formalAddress.text().length > 0 ){
// 		addressSelect = self.formalAddress.text();
// 	}else{
// 		addressSelect = self.address.text();
// 		isFormalAddress = false;
// 	}
// 	var address = new addressInfo(addressSelect, this.houseListingType, isFormalAddress);
// 	var strataPlan = self.strataPlan;
// 	var totalUnits = self.totalUnits.text();
// 	var devUnits = self.devUnits.text();
//     ////ASSEMBLE THE COMPLEX INFO OBJECT
// 	var complexInfo = {
// 		_id: strataPlan + '-' + address.streetNumber + '-' + address.streetName + '-' + address.streetType,
// 		name: $fx.normalizeComplexName(complexName),
// 		complexName: complexName,
// 		strataPlan: strataPlan,
// 		addDate: $fx.getToday(),
// 		subArea: subArea,
// 		neighborhood: neighborhood,
// 		postcode: postcode,
// 		streetNumber: address.streetNumber,
// 		streetName: address.streetName + address.streetType,
// 		dwellingType: dwellingType,
// 		totalUnits: totalUnits,
// 		devUnits: devUnits,
// 		todo: "saveComplex",
// 		from: "spreadSheet"
//     }

//     ////SEND 'SAVE.COMPLEX' REQUEST TO BACKGROUND PAGE
// 	chrome.runtime.sendMessage(
// 		complexInfo,
// 		function (response) {
// 			if (response) {
// 				self.complexName.text(response.name);
// 				self.complexOrSubdivision.text(response.name);
// 			}
// 		}
// 	)
// }

//this.language = $("div#reportlanguage input", top.document);
// this.complex = $(
//   "div#app_banner_links_left input.select2-search__field",
//   top.document
// );
//this.onExportClick();
//this.onComplexClick();
//this.onAssessClick();

//   onAssessClick() {
//     var self = this;
//     $(this.$UITable.children().find("#btnAssess")).click(
//       function() {
//         //console.log('export');
//         this.ContinueTaxSearch("#grid");
//       }.bind(self)
//     );
//   }

//   onExportClick() {
//     var self = this;
//     $(this.$UITable.children().find("#btnExport")).click(
//       function() {
//         //console.log('export');
//         this.ExportToExcel("#grid");
//       }.bind(self)
//     );
//   }

//   onComplexClick() {
//     var self = this;
//     $(this.$UITable.children().find("#btnComplex")).click(
//       function() {
//         //console.log('export');
//         this.saveComplexInfo(self.tabTitle);
//       }.bind(self)
//     );
//   }

//   ExportToExcel(tableID) {
//     ////---- Get the col name row, push names to the cloned table head row
//     var htmlHead = document.querySelector(".ui-jqgrid-htable");
//     var cloneHead = $(htmlHead)
//       .clone()
//       .attr("id", "newClonedHead");
//     var htmlTable = document.querySelector("#grid");
//     var cloneTable = $(htmlTable)
//       .clone()
//       .attr("id", "newClonedTable");

//     var rowHead = $(cloneHead)
//       .children()
//       .find("tr");

//     var headCells = $(rowHead).children("th");
//     var rowsBody = $(cloneTable)
//       .children()
//       .find("tr");
//     var row0 = $(rowsBody[0]);
//     row0.height(40); //set the height of the table header
//     var oldHeadCells = row0.children("td");

//     /////----Normalize the col names
//     var colName = "";
//     for (var i = 0; i < oldHeadCells.length; i++) {
//       colName = headCells[i].textContent.trim();
//       colName = colName.replace("1)", "");
//       colName = colName.replace("2)", "");
//       colName = colName.replace("3)", "");
//       switch (colName) {
//         case "?":
//           colName = "No";
//           break;
//         case "DisplayId":
//           colName = "MLS#";
//           break;
//         case "Room28Lev":
//           colName = "BCAValue";
//           break;
//         case "Room28Dim1":
//           colName = "LandValue";
//           break;
//         case "Room28Dim2":
//           colName = "ImproveValue";
//           break;
//         case "Room28Type":
//           colName = "Change%";
//           break;
//         case "Room27Lev":
//           colName = "Address";
//           break;
//         case "Room27Dim2":
//           colName = "Unit#";
//           break;
//       }

//       oldHeadCells[i].textContent = colName;
//     }

//     ////---- CHECK THE LANGUAGE ----////
//     if (this.language.is(":checked")) {
//       //// OUTPUT CHINESE HEAD LABLE
//       for (var i = 0; i < oldHeadCells.length; i++) {
//         colName = oldHeadCells[i].textContent.trim();
//         switch (colName) {
//           case "Complex/Subdivision":
//             colName = "小区";
//             break;
//           case "Price":
//             colName = "价格";
//             break;
//           case "BCAValue":
//             colName = "政府估价";
//             break;
//           case "Strata Maint Fee":
//           case "StratMtFee":
//             colName = "管理费";
//             break;
//           case "Total Bedrooms":
//           case "Tot BR":
//             colName = "卧室";
//             break;
//           case "Total Baths":
//           case "Tot Baths":
//             colName = "卫生间";
//             break;
//           case "Address":
//             colName = "地址";
//             break;
//           case "Unit#":
//             colName = "单元号";
//             break;
//           case "Status":
//             colName = "挂牌状况";
//             break;
//           case "DOM":
//             colName = "上市天数";
//             break;
//           case "TotFlArea":
//             colName = "室内面积";
//             break;
//           case "Price Per SQFT":
//             colName = "单位呎价";
//             break;
//           case "Yr Blt":
//             colName = "建造年份";
//             break;
//           case "Change%":
//             colName = "变动幅度";
//             break;
//           case "S/A":
//             colName = "社区";
//             break;
//           case "Price Date":
//             colName = "上市日期";
//             break;
//         }
//         oldHeadCells[i].textContent = colName;
//       }
//     }

//     if (this.tabTitle == "Residential Attached") {
//       for (var i = 0; i < rowsBody.length; i++) {
//         var row = rowsBody[i];
//         $(row).height(40);
//         for (var j = 72; j >= 39; j--) {
//           $(row)
//             .children("td")
//             .eq(j)
//             .remove();
//         }
//         $(row)
//           .children("td")
//           .eq(33)
//           .remove(); ////IMPROVEMENT VALUE
//         $(row)
//           .children("td")
//           .eq(32)
//           .remove(); ////LAND VALUE
//         $(row)
//           .children("td")
//           .eq(29)
//           .remove();
//         $(row)
//           .children("td")
//           .eq(28)
//           .remove();
//         $(row)
//           .children("td")
//           .eq(27)
//           .remove();
//         //$(row).children('td').eq(26).remove(); ////KEEP THE AGE
//         $(row)
//           .children("td")
//           .eq(24)
//           .remove();
//         //$(row).children('td').eq(19).remove(); //Days On Market
//         $(row)
//           .children("td")
//           .eq(18)
//           .remove();
//         $(row)
//           .children("td")
//           .eq(17)
//           .remove();
//         $(row)
//           .children("td")
//           .eq(15)
//           .remove();
//         $(row)
//           .children("td")
//           .eq(14)
//           .remove();
//         $(row)
//           .children("td")
//           .eq(13)
//           .remove();
//         $(row)
//           .children("td")
//           .eq(7)
//           .remove(); //ML # with Link
//         $(row)
//           .children("td")
//           .eq(6)
//           .remove(); //Action Icons
//         $(row)
//           .children("td")
//           .eq(5)
//           .remove(); //Pcitures
//         $(row)
//           .children("td")
//           .eq(4)
//           .remove(); //Pictures NO
//         //$(row).children('td').eq(3).remove();
//         $(row)
//           .children("td")
//           .eq(2)
//           .remove(); //Hidden
//         $(row)
//           .children("td")
//           .eq(1)
//           .remove(); //Hidden
//       }
//     }

//     if (this.tabTitle == "Residential Detached") {
//       for (var i = 0; i < rowsBody.length; i++) {
//         var row = rowsBody[i];
//         $(row).height(40);
//         for (var j = 51; j >= 32; j--) {
//           $(row)
//             .children("td")
//             .eq(j)
//             .remove();
//         }

//         $(row)
//           .children("td")
//           .eq(7)
//           .remove(); //ML # with Link
//         $(row)
//           .children("td")
//           .eq(6)
//           .remove(); //Action Icons
//         $(row)
//           .children("td")
//           .eq(5)
//           .remove(); //Pcitures
//         $(row)
//           .children("td")
//           .eq(4)
//           .remove(); //Pictures NO
//         //$(row).children('td').eq(3).remove();
//         $(row)
//           .children("td")
//           .eq(2)
//           .remove(); //Hidden
//         $(row)
//           .children("td")
//           .eq(1)
//           .remove(); //Hidden
//       }
//     }

//     if (this.tabTitle == "Tour and Open House") {
//       for (var i = 0; i < rowsBody.length; i++) {
//         var row = rowsBody[i];
//         $(row).height(40);
//         $(row)
//           .children("td")
//           .eq(40)
//           .remove(); //
//         $(row)
//           .children("td")
//           .eq(39)
//           .remove(); //Floor Plan Url
//         $(row)
//           .children("td")
//           .eq(38)
//           .remove();
//         $(row)
//           .children("td")
//           .eq(34)
//           .remove(); //
//         $(row)
//           .children("td")
//           .eq(28)
//           .remove(); //Floor Plan Url
//         $(row)
//           .children("td")
//           .eq(27)
//           .remove(); //Building Plan
//         $(row)
//           .children("td")
//           .eq(20)
//           .remove(); //ML # with Link
//         $(row)
//           .children("td")
//           .eq(19)
//           .remove(); //Status
//         $(row)
//           .children("td")
//           .eq(18)
//           .remove(); //Postal Code
//         $(row)
//           .children("td")
//           .eq(17)
//           .remove(); //Province
//         $(row)
//           .children("td")
//           .eq(8)
//           .remove(); //ML # with Link
//         $(row)
//           .children("td")
//           .eq(7)
//           .remove(); //ML # with Link
//         $(row)
//           .children("td")
//           .eq(6)
//           .remove(); //Action Icons
//         $(row)
//           .children("td")
//           .eq(5)
//           .remove(); //Pcitures
//         $(row)
//           .children("td")
//           .eq(4)
//           .remove(); //Pictures NO
//         //$(row).children('td').eq(3).remove(); //Keep the records number
//         $(row)
//           .children("td")
//           .eq(2)
//           .remove(); //Hidden
//         $(row)
//           .children("td")
//           .eq(1)
//           .remove(); //Hidden
//       }
//     }

//     if (this.tabTitle == "Market Monitor" || this.tabTitle == "Listing Carts") {
//       for (var i = 0; i < rowsBody.length; i++) {
//         var row = rowsBody[i];
//         if (
//           !$fx.inGreatVanArea(
//             $(row)
//               .children("td")
//               .eq(32)
//               .text()
//           )
//         ) {
//           $(row).remove();
//         } else {
//           $(row).height(40);
//           // for(var j=72; j>=41; j--){
//           //     $(row).children('td').eq(j).remove();
//           // }
//           $(row)
//             .children("td")
//             .eq(33)
//             .remove(); ////LAST CELL FOR CSS CLASS
//           // $(row).children('td').eq(32).remove();////LAND VALUE
//           $(row)
//             .children("td")
//             .eq(29)
//             .remove();
//           $(row)
//             .children("td")
//             .eq(28)
//             .remove();
//           //$(row).children('td').eq(27).remove(); ////KEEP THE LOT SIZE
//           //$(row).children('td').eq(26).remove(); ////KEEP THE AGE
//           $(row)
//             .children("td")
//             .eq(24)
//             .remove();
//           //$(row).children('td').eq(19).remove(); //Days On Market
//           //$(row).children('td').eq(18).remove(); ////KEEP THE YEAR BUILT
//           $(row)
//             .children("td")
//             .eq(17)
//             .remove();
//           $(row)
//             .children("td")
//             .eq(15)
//             .remove();
//           $(row)
//             .children("td")
//             .eq(14)
//             .remove();
//           $(row)
//             .children("td")
//             .eq(13)
//             .remove();
//           $(row)
//             .children("td")
//             .eq(7)
//             .remove(); //ML # with Link
//           $(row)
//             .children("td")
//             .eq(6)
//             .remove(); //Action Icons
//           $(row)
//             .children("td")
//             .eq(5)
//             .remove(); //Pcitures
//           $(row)
//             .children("td")
//             .eq(4)
//             .remove(); //Pictures NO
//           //$(row).children('td').eq(3).remove();
//           $(row)
//             .children("td")
//             .eq(2)
//             .remove(); //Hidden
//           $(row)
//             .children("td")
//             .eq(1)
//             .remove(); //Hidden
//         }
//       }
//     }

//     cloneTable.appendTo($(htmlTable));

//     var tableToExcel = (function() {
//       var uri = "data:application/vnd.ms-excel;base64,",
//         template =
//           '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
//         base64 = function(s) {
//           return window.btoa(unescape(encodeURIComponent(s)));
//         },
//         format = function(s, c) {
//           return s.replace(/{(\w+)}/g, function(m, p) {
//             return c[p];
//           });
//         };
//       return function(table, name) {
//         if (!table.nodeType) table = document.querySelector(table); //document.getElementById(table)
//         var ctx = { worksheet: name || "Worksheet", table: table.innerHTML };
//         window.location.href = uri + base64(format(template, ctx));
//       };
//     })();

//     tableToExcel("#newClonedTable", "Listings Table");
//     cloneTable.remove();
//   }

//   saveComplexInfo(tabTitle) {
//     ////MANUALLY SAVE OR UPDATE COMPLEX NAME TO THE DATABASE
//     ////RECORD NO HAS TO BE LOOK UP THE CHECKED ONE IN THE TABLE
//     var self = this;
//     var cols = $fx.setCols(tabTitle);
//     var complexName = self.complex.val();
//     complexName = $fx.normalizeComplexName(complexName); ////NORMALIZED THE COMPLEX NAME
//     if (complexName.length == 0) {
//       console.warn("NOT INPUT A VALID COMPLEX NAME");
//       return;
//     }
//     ////SEARCH CHECKED RECORD NO
//     var recordNo = 0;
//     var recordRow_i = null;
//     var strataPlan_i = "";
//     var streetAddress_i = "";
//     var cells_i = null;
//     var complexCell_i = null;
//     var recordNo_i = 0;
//     var recordCheckbox_i = null;
//     var htmlTable = document.querySelector("#grid");
//     var recordRows = $(htmlTable)
//       .children()
//       .find("tr");

//     for (var i = 1; i < recordRows.length; i++) {
//       recordRow_i = $(recordRows[i]); ////LOOP ALL THE ROWS IN THE TABLE
//       cells_i = recordRow_i.children();
//       recordNo_i = cells_i[cols.RecordNo];
//       recordCheckbox_i = $(cells_i[1]).children('input[type="checkbox"]'); ////HARDWIRED THE COL NO 1 TO THE CHECKBOX COLUMN
//       if ($(recordCheckbox_i).prop("checked") == true) {
//         recordNo = recordNo_i.textContent;
//         break;
//       }
//     }
//     if (recordNo == 0) {
//       console.warn("No Record Selected!");
//       return;
//     }

//     ////UPDATE THE COMPLEX NAME IN THE SPREAD SHEET
//     var recordRow = $(recordRows[recordNo]); ////FETCH THE SELECTED ROW AND ITS CELLS
//     var cells = recordRow.children();

//     var strataPlan = cells[cols.strataPlan].textContent;
//     var streetAddress = cells[cols.streetAddress].textContent;

//     for (var i = 1; i < recordRows.length; i++) {
//       recordRow_i = $(recordRows[i]); ////LOOP ALL THE ROWS IN THE TABLE
//       cells_i = recordRow_i.children();
//       recordNo_i = cells_i[cols.RecordNo];
//       recordCheckbox_i = $(cells_i[2])
//         .children()
//         .find('input[type="checkbox'); ////HARDWIRED THE COL NO 2 TO THE CHECKBOX COLUMN
//       complexCell_i = cells_i[cols.complexName];
//       strataPlan_i = cells_i[cols.strataPlan].textContent;
//       streetAddress_i = cells_i[cols.streetAddress].textContent;
//       if (strataPlan == strataPlan_i && streetAddress == streetAddress_i) {
//         complexCell_i.textContent = complexName;
//       }
//     }

//     ////SAVE THE COMPLEX.INFO INTO THE DATABASE
//     if (complexName.length > 0) {
//       ////PREPARE THE FIELDS FOR THE COMPLEX.INFO OBJECT
//       var subArea = cells[cols.subArea].textContent;
//       var neighborhood = cells[cols.neighborhood].textContent;
//       var postcode = cells[cols.postcode].textContent;
//       var houseType = cells[cols.houseType].textContent;
//       var formalAddress = cells[cols.address].textContent;
//       var isFormalAddress = true;
//       var address = new addressInfo(formalAddress, houseType, isFormalAddress);
//       var strataPlan = cells[cols.strataPlan].textContent;
//       var totalUnits = 0;
//       var devUnits = 0;

//       ////ASSEMBLE THE COMPLEX INFO OBJECT
//       var complexInfo = {
//         _id:
//           strataPlan +
//           "-" +
//           address.streetNumber +
//           "-" +
//           address.streetName +
//           "-" +
//           address.streetType,
//         name: complexName,
//         complexName: complexName,
//         strataPlan: strataPlan,
//         addDate: $fx.getToday(),
//         subArea: subArea,
//         neighborhood: neighborhood,
//         postcode: postcode,
//         streetNumber: address.streetNumber,
//         streetName: address.streetName + " " + address.streetType,
//         dwellingType: houseType,
//         totalUnits: totalUnits,
//         devUnits: devUnits,
//         todo: "saveComplex",
//         from: "uiSummaryTable"
//       };

//       ////SEND THE COMPLEX NAME INTO THE DATABASE BY CALL ADD.COMPLEX.INFO
//       chrome.runtime.sendMessage(complexInfo, function(response) {});

//       ////FEEDBACK THE INPUT AREA WITH ADDED STAR SIGN
//       this.complex.val(complexName + "*");
//     }
//   }

//   ContinueTaxSearch(tableID) {
//     console.log("ContinueTaxSearch");
//     this.parent.searchTax();
//   }

{
  /* <table cellspacing="0" cellpadding="0" >
            <tbody><tr>
                <td width="100%" align="center">
                    <table cellpadding="0" cellspacing="0">
                        <tbody><tr align="right">
                            <td width="100px">
                                <table cellpadding="1" cellspacing="1" align="center" width="100px">
                                    <tbody><tr>
                                        <td>
                                            &nbsp;
                                        </td>
                                    </tr>
                                    <tr align="right">
                                        <td>
                                            LP/SF:
                                        </td>
                                    </tr>
                                    <tr align="right">
                                        <td>
                                            SP/SF:
                                        </td>
                                    </tr>
                                </tbody></table>
                            </td>
                            <td>
                                <table cellpadding="1" cellspacing="1" align="center" width="365px">
                                    <tbody><tr align="center" style="font-weight: bold">
                                        <td class="f-summary-label">
                                            HIGH
                                        </td>
                                        <td class="f-summary-label">
                                            LOW
                                        </td>
                                        <td class="f-summary-label">
                                            AVERAGE
                                        </td>
                                        <td class="f-summary-label">
                                            MEDIAN
                                        </td>                                        
                                    </tr>
                                    <tr align="center">
                                        <td>
                                            <div id="HighAskingPricePSF" class="f-summary-data-box">
                                                $0
                                            </div>
                                        </td>
                                        <td>
                                            <div id="LowAskingPricePSF" class="f-summary-data-box">
                                                $0
                                            </div>
                                        </td>
                                        <td>
                                            <div id="AverageAskingPricePSF" class="f-summary-data-box">
                                                $0
                                            </div>
                                        </td>
                                        <td>
                                            <div id="MedianAskingPricePSF" class="f-summary-data-box">
                                                $0
                                            </div>
                                        </td>                                        
                                     </tr>
                                    <tr align="center">
                                        <td>
                                            <div id="HighSoldPricePSF" class="f-summary-data-box">
                                                $0
                                            </div>
                                        </td>
                                        <td>
                                            <div id="LowSoldPricePSF" class="f-summary-data-box">
                                                $0
                                            </div>
                                        </td>
                                        <td>
                                            <div id="AverageSoldPricePSF" class="f-summary-data-box">
                                                $0
                                            </div>
                                        </td>
                                        <td>
                                            <div id="MedianSoldPrice" class="f-summary-data-box">
                                                $0
                                            </div>
                                        </td>                                        
                                    </tr>
                                </tbody></table>
                            </td>
                        </tr>
                    </tbody></table>
                </td>
            </tr>
        </tbody></table> */
}
