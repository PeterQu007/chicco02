//Create, Read, Write, Query Database
//http://localhost:5984/_utils/#/_all_dbs
//REFERENCE VIDEO
// https://www.youtube.com/watch?v=OdxGJ4lgies
// PouchDB Tutorial - Offline First Apps With PouchDB

class DatabaseOffline {
  constructor() {
    //console.group('database constructor');
    this.dbAssess = new PouchDB("bcAssessmentTEST");
    this.dbAssess.put({
      _id: "bca:001",
      value: 5200000,
    });
    this.dbAssess.replicate.to("http://localhost:5984/bcassessmenttest");
    this.dbAssess.on("change", function () {
      console.log("Ch-Ch-Changes");
    });
    //console.groupEnd();
  }
}

export default DatabaseOffline;
