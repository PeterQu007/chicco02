// Assessment information <=> mySQL table wp_pid_assess

'use strict';

const DATA_ASSESSMENT_API_URL_LOCAL = "https://pidrealty4.local/wp-content/themes/realhomes-child-3/db/dataAssessInfo.php";
const DATA_ASSESSMENT_API_URL_LIVE = "https://pidhomes.ca/wp-content/themes/realhomes-child-3/db/dataAssessInfo.php";

const postAssessInfo = function (assessInfos) {
  //console.log(this.complexInfos);
  let urlLocationOptionLocal = $("#pid_local", top.document);
  let urlLocation = urlLocationOptionLocal.prop("checked");
  let ajax_url = "";

  if (urlLocation) {
    // ajax_url =
    //   "https://pidrealty4.local/wp-content/themes/realhomes-child-3/db/dataAssessInfo.php";
    ajax_url = DATA_ASSESSMENT_API_URL_LOCAL;
  } else {
    // ajax_url =
    //   "https://pidhomes.ca/wp-content/themes/realhomes-child-3/db/dataAssessInfo.php";
    ajax_url = DATA_ASSESSMENT_API_URL_LIVE;
  }

  $.ajax({
    url: ajax_url,
    method: "post",
    data: {
      assessInfos: assessInfos
    },
    success: function (res) {
      console.log("ajax::", res);
      res = JSON.parse(res);
      res.forEach((assessInfo) => {
        console.log(assessInfo);
      });
    },
  });
}

class Assessment {
  constructor() {
    this.assessInfos = null;
  }

  postAssessInfos(assessInfos) {
    let urlLocationOptionLocal = $("#pid_local", top.document);
    let urlLocation = urlLocationOptionLocal.prop("checked");
    let ajax_url = "";

    if (urlLocation) {
      ajax_url = DATA_ASSESSMENT_API_URL_LOCAL;
    } else {
      ajax_url = DATA_ASSESSMENT_API_URL_LIVE;
    }

    $.ajax({
      url: ajax_url,
      method: "post",
      data: {
        assessInfos: assessInfos
      },
      success: function (res) {
        console.log("ajax::", res);
        res = JSON.parse(res);
        res.forEach((assessInfo) => {
          console.log(assessInfo);
        });
      },
    });
  }
}

export default Assessment;