"use strict";

import SumBoxPanel from "./sumBoxPanel";

class sumBoxPanels extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   panels: [
    //     {
    //       id: "sumBoxPanel0",
    //       labels: {
    //         name: "Name",
    //         high: "High",
    //         low: "Low",
    //         ave: "Ave",
    //         med: "Med",
    //         total: "Total"
    //       },
    //       values: {
    //         high: 0,
    //         low: 0,
    //         ave: 0,
    //         med: 0,
    //         total: 0
    //       }
    //     },
    //     {
    //       id: "sumBoxPanel1",
    //       labels: {
    //         name: "LP/SF",
    //         high: "HighAskingPricePSF",
    //         low: "LowAskingPricePSF",
    //         ave: "AverageAskingPricePSF",
    //         med: "MedianAskingPricePSF",
    //         total: "TotalAskingPSF"
    //       },
    //       values: {
    //         high: 100,
    //         low: 0,
    //         ave: 0,
    //         med: 0,
    //         total: 0
    //       }
    //     },
    //     {
    //       id: "sumBoxPanel2",
    //       labels: {
    //         name: "SP/SF",
    //         high: "HighSoldPricePSF",
    //         low: "LowSoldPricePSF",
    //         ave: "AverageSoldPricePSF",
    //         med: "MedianSoldPrice",
    //         total: "TotalSoldPSF"
    //       },
    //       values: {
    //         high: 0,
    //         low: 0,
    //         ave: 0,
    //         med: 0,
    //         total: 0
    //       }
    //     }
    //   ]
    // };
  }

  // handleClick(panel) {
  //   console.log("label clicked", panel);
  //   let panels = [...this.state.panels];
  //   let index = panels.indexOf(panel);
  //   console.log(panels, index);
  //   // panels[index].values.high = 200;
  //   panels[1].values.high = 300;
  //   this.setState({ panels });
  // }

  render() {
    return (
      <table style={{ padding: 0 }}>
        <tbody>
          {this.props.panels.map(panel => (
            <SumBoxPanel
              key={panel.id}
              panel={panel}
              onClick={() => this.props.onClick(panel)}
            />
          ))}
        </tbody>
      </table>
    );
  }
}

export default sumBoxPanels;
