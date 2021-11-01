// Complex information <=> mySQL table wp_pid_complex

'use strict';

const DATA_COMPLEX_API_URL_LOCAL = "https://pidrealty4.local/wp-content/themes/Realhomes-child-3/db/dataComplexInfo.php";
const DATA_COMPLEX_API_URL_LOCAL_OBSOLETE = "http://localhost/pidrealty4/wp-content/themes/Realhomes-child-3/db/dataComplexInfo.php";
const DATA_COMPLEX_API_URL_LIVE = "https://pidhomes.ca/wp-content/themes/realhomes-child-3/db/dataComplexInfo.php";

class Complex {
  constructor() {
    this.complexInfos = null;
  }

  // Insert or Update the complex information to mySQL Table WP_PID_COMPLEX
  postComplexInfos(complexInfos) {
    const $fx = L$();
    const uniqueComplexInfos = $fx.normalizeComplexInfos(complexInfos);
    const urlLocationOptionLocal = $("#pid_local", top.document);
    const urlLocation = urlLocationOptionLocal.prop("checked");
    let ajax_url = "";

    if (urlLocation) {
      ajax_url = DATA_COMPLEX_API_URL_LOCAL;
    } else {
      ajax_url = DATA_COMPLEX_API_URL_LIVE;
    }

    $.ajax({
      url: ajax_url,
      method: "post",
      data: {
        complexInfos: uniqueComplexInfos
      },
      success: function (res) {
        console.log("ajax::", res);
        res = JSON.parse(res);
        res.forEach((complexInfo) => {
          console.log(complexInfo);
        });
      },
    });
  }


}


export default Complex;