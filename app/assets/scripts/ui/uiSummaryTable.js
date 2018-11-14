// UI element: Extra Summary Table

export default class UISummaryTable {
    constructor(){
        this.$UITable = $(`<div id = "SummaryFunctionBox" style = 'top: 30px; left: 850px; position: absolute'>
        <div id ="divExport"  >
            <button type="button" id="btnExport" style = "position: absolute; z-index: 999" >export</button>
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
        this.onClick();
    
    }

    onClick(){
        //var x = this.$UITable.children().find('#btnExport');
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
        // var htmltable= document.getElementById(mytblId);
        // var html = htmltable.outerHTML;
        // window.open('data:application/vnd.ms-excel,' + encodeURIComponent(html));
        //var htmltable = document.getElementById('#ifSpreadsheet ' + mytblId);
        var htmlTable = document.querySelector(tableID);
        var cloneTable = $(htmlTable).clone().attr('id','newClonedTable')
        
        var rows = $(cloneTable).children().find('tr');
        
        if(this.tabTitle == 'Residential Attached'){
            for(var i=0; i<rows.length; i++){
                var row = rows[i];
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
            var row0=$(rows[0]);
            var colTitle = row0.children('td');
            $(colTitle[0]).text('No');
            $(colTitle[1]).text('MLS#');
            $(colTitle[2]).text('Status');
            $(colTitle[3]).text('Address');
            $(colTitle[4]).text('Neighborhood');
            $(colTitle[5]).text('Complex');
            $(colTitle[6]).text('ListingPrice');
            $(colTitle[7]).text('Date');
            $(colTitle[8]).text('DOM');
            $(colTitle[9]).text('Bed');
            $(colTitle[10]).text('Bath');
            $(colTitle[11]).text('FloorArea');
            $(colTitle[12]).text('PricePSF');
            $(colTitle[13]).text('Year');
            $(colTitle[14]).text('Maint.Fee');
            $(colTitle[15]).text('PID');
            $(colTitle[16]).text('BCA');
            $(colTitle[17]).text('Price%');
            $(colTitle[18]).text('MLS#');
            $(colTitle[19]).text('MLS#');
            $(colTitle[20]).text('MLS#');
            $(colTitle[21]).text('MLS#');
            $(colTitle[22]).text('MLS#');
            $(colTitle[23]).text('MLS#');
            $(colTitle[24]).text('MLS#');
            $(colTitle[25]).text('MLS#');
            $(colTitle[26]).text('MLS#');
            $(colTitle[27]).text('MLS#');
            $(colTitle[28]).text('MLS#');
            $(colTitle[29]).text('MLS#');
            $(colTitle[30]).text('MLS#');
            $(colTitle[31]).text('MLS#');
            $(colTitle[32]).text('MLS#');
            $(colTitle[33]).text('MLS#');
        };

        if(this.tabTitle == 'Residential Detached'){
            for(var i=0; i<rows.length; i++){
                var row = rows[i];
                for(var j=48; j>=30; j--){
                    $(row).children('td').eq(j).remove();
                }
                // $(row).children('td').eq(33).remove();
                // $(row).children('td').eq(32).remove();
                // $(row).children('td').eq(29).remove();
                // $(row).children('td').eq(28).remove();
                // $(row).children('td').eq(27).remove();
                // $(row).children('td').eq(26).remove();
                // $(row).children('td').eq(24).remove();
                // //$(row).children('td').eq(19).remove(); //Days On Market
                // $(row).children('td').eq(18).remove();
                // $(row).children('td').eq(17).remove();
                // $(row).children('td').eq(15).remove();
                // $(row).children('td').eq(14).remove();
                // $(row).children('td').eq(13).remove();
                $(row).children('td').eq(7).remove(); //ML # with Link
                $(row).children('td').eq(6).remove(); //Action Icons
                $(row).children('td').eq(5).remove(); //Pcitures
                $(row).children('td').eq(4).remove(); //Pictures NO
                //$(row).children('td').eq(3).remove();
                $(row).children('td').eq(2).remove(); //Hidden
                $(row).children('td').eq(1).remove(); //Hidden
            }
            var row0=$(rows[0]);
            var colTitle = row0.children('td');
            $(colTitle[0]).text('No');
            $(colTitle[1]).text('MLS#');
            $(colTitle[2]).text('Status');
            $(colTitle[3]).text('Address');
            $(colTitle[4]).text('Neighborhood');
            $(colTitle[5]).text('District');
            $(colTitle[6]).text('ListingPrice');
            $(colTitle[7]).text('Date');
            $(colTitle[8]).text('DOM');
            $(colTitle[9]).text('Bed');
            $(colTitle[10]).text('Bath');
            $(colTitle[11]).text('FloorArea');
            $(colTitle[12]).text('Year');
            $(colTitle[13]).text('Age');
            $(colTitle[14]).text('LotSize');
            $(colTitle[15]).text('Kitchen');
            $(colTitle[16]).text('ListPerSF');
            $(colTitle[17]).text('SoldPerSF');
            $(colTitle[18]).text('PID');
            $(colTitle[19]).text('BCA_Land');
            $(colTitle[20]).text('BCA_Impr.');
            $(colTitle[21]).text('BCA_Total');
            $(colTitle[22]).text('Change%');
            $(colTitle[23]).text('City');
            //$(colTitle[24]).text('MLS#');
           
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
        //tableToExcel(mytblId, 'W3C Example Table');
        tableToExcel('#newClonedTable', 'Listings Table');
        cloneTable.remove();
        //console.log(htmlTable);
    }

    
}