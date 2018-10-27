// UI element: Extra Summary Table

export default class UISummaryTable {
    constructor(){
        this.$UITable = $(`<div id = "SummaryBox" style= 'top: 30px; left: 850px; position: absolute'>
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
                                            LIST PRICE / SF:
                                        </td>
                                    </tr>
                                    <tr align="right">
                                        <td>
                                            SOLD PRICE / SF:
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
                                                $548
                                            </div>
                                        </td>
                                        <td>
                                            <div id="LowAskingPricePSF" class="f-summary-data-box">
                                                $399
                                            </div>
                                        </td>
                                        <td>
                                            <div id="AverageAskingPricePSF" class="f-summary-data-box">
                                                $479
                                            </div>
                                        </td>
                                        <td>
                                            <div id="MedianAskingPricePSF" class="f-summary-data-box">
                                                $477
                                            </div>
                                        </td>                                        
                                     </tr>
                                    <tr align="center">
                                        <td>
                                            <div id="HighSoldPricePSF" class="f-summary-data-box">
                                                $500
                                            </div>
                                        </td>
                                        <td>
                                            <div id="LowSoldPricePSF" class="f-summary-data-box">
                                                $420
                                            </div>
                                        </td>
                                        <td>
                                            <div id="AverageSoldPricePSF" class="f-summary-data-box">
                                                $465
                                            </div>
                                        </td>
                                        <td>
                                            <div id="MedianSoldPrice" class="f-summary-data-box">
                                                $475
                                            </div>
                                        </td>                                        
                                    </tr>
                                </tbody></table>
                            </td>
                        </tr>
                    </tbody></table>
                </td>
            </tr>
        </tbody></table></div>
        `);
    
    }

    showUI(container){
        this.$UITable.appendTo(container);
    }

    setHighPSF(x){
        $(this.$UITable).find('#HighAskingPricePSF').text("$"+x);
    }

    // highLightCol25(){
    //     $('table tr > td:nth-child(2), table tr > th:nth-child(2)')
    //         .attr('style', 'background-color:#CCF;');
    // }
}