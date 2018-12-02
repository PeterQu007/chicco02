"use strict";

import SumBoxBanner from "./sumBoxBanner";

class sumBoxBanners extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      banners: [
        {
          id: "sumBoxBanner0",
          name: "Name",
          high: "High",
          low: "Low",
          ave: "Ave",
          med: "Med",
          total: "Total",
          sumValues: []
        },
        {
          id: "sumBoxBanner1",
          name: "LP/SF",
          high: "HighAskingPricePSF",
          low: "LowAskingPricePSF",
          ave: "AverageAskingPricePSF",
          med: "MedianAskingPricePSF",
          total: "TotalAskingPSF",
          sumValues: []
        },
        {
          id: "sumBoxBanner2",
          name: "SP/SF",
          high: "HighSoldPricePSF",
          low: "LowSoldPricePSF",
          ave: "AverageSoldPricePSF",
          med: "MedianSoldPrice",
          total: "TotalSoldPSF",
          sumValues: []
        }
      ],
      sumValues: []
    };
    this.setState({ sumValues: props.sumValues });
  }

  render() {
    return (
      <table style={{ padding: 0 }}>
        <tbody>
          {this.state.banners.map(banner => (
            <SumBoxBanner
              key={banner.id}
              banner={banner}
              sumValues={this.state.sumValues}
            />
          ))}
        </tbody>
      </table>
    );
  }
}

export default sumBoxBanners;
