import { realpathSync } from "fs";

("use strict");

////SUMMARY BOX

class uiSumBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      parent: null,
      tabTitle: "",
      panels: [
        {
          id: "sumBoxPanel0",
          labels: {
            name: "Name",
            high: "High",
            low: "Low",
            ave: "Ave",
            med: "Med",
            total: "Total"
          },
          values: {
            high: 0,
            low: 0,
            ave: 0,
            med: 0,
            total: 0
          }
        },
        {
          id: "sumBoxPanel1",
          labels: {
            name: "LP/SF",
            high: "HighAskingPricePSF",
            low: "LowAskingPricePSF",
            ave: "AverageAskingPricePSF",
            med: "MedianAskingPricePSF",
            total: "TotalAskingPSF"
          },
          values: {
            high: 0,
            low: 0,
            ave: 0,
            med: 0,
            total: 0
          }
        },
        {
          id: "sumBoxPanel2",
          labels: {
            name: "SP/SF",
            high: "HighSoldPricePSF",
            low: "LowSoldPricePSF",
            ave: "AverageSoldPricePSF",
            med: "MedianSoldPrice",
            total: "TotalSoldPSF"
          },
          values: {
            high: 0,
            low: 0,
            ave: 0,
            med: 0,
            total: 0
          }
        }
      ]
    };
  }
  render() {
    return (
      <React.Fragment>
        <div id="sumButtonContainer" style="z-index: 999">
          <SumBoxButtons
            tabTitle={this.props.tabTitle}
            parent={this.props.parent}
          />
        </div>
        <div
          id="sumPanelContainer"
          style="top: 0px; left: 230px; position: absolute"
        >
          <SumBoxPanels panels={this.state.panels} />
        </div>
      </React.Fragment>
    );
  }
}

export default uiSumBox;
