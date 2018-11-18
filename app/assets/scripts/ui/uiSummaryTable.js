// UI element: Extra Summary Table

export default class UISummaryTable {
    constructor(){
        this.$UITable = $(`<div id = "SummaryFunctionBox" style = 'top: 30px; left: 850px; position: absolute'>
        <div id ="divExport"  >
            <button type="button" id="btnExport" style = "position: absolute; width: 60px; z-index: 999" >Export</button>
            <button type="button" id="btnAssess" style = "top: 20px; width: 60px; position: absolute; z-index: 999" >Assess</button>
            <button type="button" id="btnComplex" style = "top: 40px; width: 60px; position: absolute; z-index: 999" >Complex</button>
        </div>
        <div id = "SummaryBox" style = 'top: 0px; position: absolute'>

        <table cellspacing="0" cellpadding="0" >
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
        </tbody></table></div></div>
        `);
        this.tabTitle = '';
        this.language = $('div#reportlanguage input', top.document);
        this.onClick();
    
    }

    onClick(){
        
        var self = this;
        $(this.$UITable.children().find('#btnExport')).click(function(){
            //console.log('export');
            this.ExportToExcel('#grid');
        }.bind(self))
    }

    showUI(container){
        this.$UITable.appendTo(container);
    }

    setHighListedSFP(x){
        $(this.$UITable).find('#HighAskingPricePSF').text("$"+x);
    }

    setHighSoldSFP(x){
        $(this.$UITable).find('#HighSoldPricePSF').text("$"+x);
    }

    setLowListedSFP(x){
        $(this.$UITable).find('#LowAskingPricePSF').text("$"+x);
    }

    setLowSoldSFP(x){
        $(this.$UITable).find('#LowSoldPricePSF').text("$"+x);
    }

    setAvgListedSFP(x){
        $(this.$UITable).find('#AverageAskingPricePSF').text("$"+x);
    }

    setAvgSoldSFP(x){
        $(this.$UITable).find('#AverageSoldPricePSF').text("$"+x);
    }
   
    setMedianListedSFP(x){
        $(this.$UITable).find('#MedianAskingPricePSF').text("$"+x);
    }

    setMedianSoldSFP(x){
        $(this.$UITable).find('#MedianSoldPrice').text("$"+x);
    }

    ExportToExcel(tableID){
        
        ////---- Get the col name row, push names to the cloned table head row
        var htmlHead = document.querySelector('.ui-jqgrid-htable');
        var cloneHead = $(htmlHead).clone().attr('id','newClonedHead');
        var htmlTable = document.querySelector('#grid');
        var cloneTable = $(htmlTable).clone().attr('id','newClonedTable');

        var rowHead = $(cloneHead).children().find('tr');
      
        var headCells = $(rowHead).children('th');
        var rowsBody = $(cloneTable).children().find('tr');
        var row0=$(rowsBody[0]);
        row0.height(40) ; //set the height of the table header
        var oldHeadCells = row0.children('td');
        
        /////----Normalize the col names
        var colName = '';
        for(var i =0 ; i<oldHeadCells.length; i++){
            colName = (headCells[i].textContent).trim();
            colName = colName.replace('1)','');
            colName = colName.replace('2)','');
            colName = colName.replace('3)','');
            switch (colName) {
                case '?':
                    colName = 'No';
                    break;
                case 'DisplayId':
                    colName = 'MLS#';
                    break;
                case 'Room28Lev':
                    colName = "BCAValue";
                    break;
                case 'Room28Dim1':
                    colName = "LandValue";
                    break;
                case 'Room28Dim2':
                    colName = "ImproveValue";
                    break;
                case 'Room28Type':
                    colName = "Change%";
                    break;
            }
                
            oldHeadCells[i].textContent = colName;
        }

        ////---- CHECK THE LANGUAGE ----////
        if(this.language.is(':checked')){ //// OUTPUT CHINESE HEAD LABLE
            for(var i =0 ; i<oldHeadCells.length; i++){
                colName = (oldHeadCells[i].textContent).trim();
                switch (colName){
                    case 'Complex/Subdivision':
                        colName = "小区";
                        break;
                    case 'Price':
                        colName = "价格";
                        break;
                    case 'BCAValue':
                        colName = "政府估价";
                        break;
                    case 'Strata Maint Fee':
                    case 'StratMtFee':
                        colName = "管理费";
                        break;
                    case 'Total Bedrooms':
                    case 'Tot BR':
                        colName = "卧室";
                        break;
                    case 'Total Baths':
                    case 'Tot Baths':
                        colName = "卫生间";
                        break;
                    case 'Address':
                        colName = "地址";
                        break;
                    case 'Status':
                        colName = "挂牌状况";
                        break;
                    case 'DOM':
                        colName = "上市天数";
                        break;
                    case 'TotFlArea':
                        colName = "室内面积";
                        break;
                    case 'Price Per SQFT':
                        colName = "单位呎价";
                        break;
                    case 'Yr Blt':
                        colName = "建造年份";
                        break;
                    case 'Change%':
                        colName = "变动幅度";
                        break;
                    case 'S/A':
                        colName = "社区";
                        break;
                    case 'Price Date':
                        colName = "上市日期";
                        break;
                }
                oldHeadCells[i].textContent = colName;
            }
        }
        
        if(this.tabTitle == 'Residential Attached'){
            for(var i=0; i<rowsBody.length; i++){
                var row = rowsBody[i];
                $(row).height(40) ; 
                for(var j=71; j>35; j--){
                    $(row).children('td').eq(j).remove();
                }
                $(row).children('td').eq(33).remove();
                $(row).children('td').eq(32).remove();
                $(row).children('td').eq(29).remove();
                $(row).children('td').eq(28).remove();
                $(row).children('td').eq(27).remove();
                $(row).children('td').eq(26).remove();
                $(row).children('td').eq(24).remove();
                //$(row).children('td').eq(19).remove(); //Days On Market
                $(row).children('td').eq(18).remove();
                $(row).children('td').eq(17).remove();
                $(row).children('td').eq(15).remove();
                $(row).children('td').eq(14).remove();
                $(row).children('td').eq(13).remove();
                $(row).children('td').eq(7).remove(); //ML # with Link
                $(row).children('td').eq(6).remove(); //Action Icons
                $(row).children('td').eq(5).remove(); //Pcitures
                $(row).children('td').eq(4).remove(); //Pictures NO
                //$(row).children('td').eq(3).remove();
                $(row).children('td').eq(2).remove(); //Hidden
                $(row).children('td').eq(1).remove(); //Hidden
            }
        
        };

        if(this.tabTitle == 'Residential Detached'){
            for(var i=0; i<rowsBody.length; i++){
                var row = rowsBody[i];
                $(row).height(40) ; 
                for(var j=50; j>=30; j--){
                    $(row).children('td').eq(j).remove();
                }
             
                $(row).children('td').eq(7).remove(); //ML # with Link
                $(row).children('td').eq(6).remove(); //Action Icons
                $(row).children('td').eq(5).remove(); //Pcitures
                $(row).children('td').eq(4).remove(); //Pictures NO
                //$(row).children('td').eq(3).remove();
                $(row).children('td').eq(2).remove(); //Hidden
                $(row).children('td').eq(1).remove(); //Hidden
            }
          
           
        };
        
        if(this.tabTitle == 'Tour and Open House'){
            for(var i=0; i<rowsBody.length; i++){
                var row = rowsBody[i];
                $(row).height(40) ; 
                $(row).children('td').eq(40).remove(); //
                $(row).children('td').eq(39).remove(); //Floor Plan Url
                $(row).children('td').eq(38).remove(); 
                $(row).children('td').eq(34).remove(); //
                $(row).children('td').eq(28).remove(); //Floor Plan Url
                $(row).children('td').eq(27).remove(); //Building Plan
                $(row).children('td').eq(20).remove(); //ML # with Link
                $(row).children('td').eq(19).remove(); //Status
                $(row).children('td').eq(18).remove(); //Postal Code
                $(row).children('td').eq(17).remove(); //Province
                $(row).children('td').eq(8).remove(); //ML # with Link
                $(row).children('td').eq(7).remove(); //ML # with Link
                $(row).children('td').eq(6).remove(); //Action Icons
                $(row).children('td').eq(5).remove(); //Pcitures
                $(row).children('td').eq(4).remove(); //Pictures NO
                //$(row).children('td').eq(3).remove(); //Keep the records number
                $(row).children('td').eq(2).remove(); //Hidden
                $(row).children('td').eq(1).remove(); //Hidden
            }
          
           
        };

        cloneTable.appendTo($(htmlTable));

        var tableToExcel = (function() {
            var uri = 'data:application/vnd.ms-excel;base64,'
              , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
              , base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
              , format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) }
            return function(table, name) {
              if (!table.nodeType) table = document.querySelector(table) //document.getElementById(table)
              var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML}
              window.location.href = uri + base64(format(template, ctx))
            }
          })()
        
        tableToExcel('#newClonedTable', 'Listings Table');
        cloneTable.remove();
        
    }

    
}