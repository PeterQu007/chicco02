// webpack automation
// bundle modules to single js file
// create gulp task to auto run webpack as configured in webpack.config.js

let gulp = require("gulp"),
  webpack = require("webpack");

gulp.task("scripts", function(callback) {
  //   webpack(function(err, stats) {
  //     //require("../../webpack.config.js"),
  //     if (err) {
  //       console.log(err.toString());
  //     }
  //     console.log(stats.toString());
  //     callback();
  //   });
  console.log("scripts");
});
