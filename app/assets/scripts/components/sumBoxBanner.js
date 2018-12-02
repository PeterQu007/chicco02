"use strict";

class SumBoxBanner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      high: 0,
      low: 0,
      ave: 0,
      med: 0,
      total: 0
    };
  }
  render() {
    let { banner } = this.props;
    let boxClass = "f-summary-data-box";
    let headBanner = "sumBoxBanner0";
    return (
      <React.Fragment>
        <tr>
          <td>
            <span>{banner.name}</span>
          </td>
          <td>
            {banner.id == headBanner ? (
              <span>{banner.high}</span>
            ) : (
              <div id={banner.high} className={boxClass}>
                {this.state.hight}
              </div>
            )}
          </td>
          <td>
            {banner.id == headBanner ? (
              <span>{banner.low}</span>
            ) : (
              <div id={banner.low} className={boxClass}>
                {this.state.low}
              </div>
            )}
          </td>
          <td>
            {banner.id == headBanner ? (
              <span>{banner.ave}</span>
            ) : (
              <div id={banner.ave} className={boxClass}>
                {this.state.ave}
              </div>
            )}
          </td>
          <td>
            {banner.id == headBanner ? (
              <span>{banner.med}</span>
            ) : (
              <div id={banner.med} className={boxClass}>
                {this.state.med}
              </div>
            )}
          </td>
          <td>
            {banner.id == headBanner ? (
              <span>{banner.total}</span>
            ) : (
              <div id={banner.total} className={boxClass}>
                {this.state.total}
              </div>
            )}
          </td>
        </tr>
      </React.Fragment>
    );
  }
}

export default SumBoxBanner;
