//Create, Read, Write, Query Database
//http://localhost:5984/_utils/#/_all_dbs

class Database {
  constructor() {
    //console.group('database constructor');
    this.dbAssess = new PouchDB("http://localhost:5984/bcassessment");
    this.dbComplex = new PouchDB("http://localhost:5984/complex");
    this.dbExposure = new PouchDB("http://localhost:5984/exposure");
    this.dbListing = new PouchDB("http://localhost:5984/listing");
    //http://localhost:5984/_utils/#/database/exposure/_all_docs
    this.dbStrataPlanSummary = new PouchDB(
      "http://localhost:5984/strataplansummary"
    );
    this.dbShowing = new PouchDB("http://localhost:5984/showing");
    this.dbAssess.info().then(function(info) {
      //console.log(info);
    });
    this.dbComplex.info().then(function(info) {
      //console.log(info);
    });
    this.dbExposure.info().then(function(info) {
      // console.log(info);
    });
    this.dbListing.info().then(function(info) {
      console.log(info);
    });
    this.dbStrataPlanSummary.info().then(function(info) {
      //console.log(info);
    });
    this.dbShowing.info().then(function(info) {
      //console.log(info);
    });
    this.assess = null;
    this.complex = null;
    this.exposure = null;
    this.strataPlan = null;
    this.showing = null;
    //console.groupEnd('database constructor');
  }

  readAssess(taxID, callback) {
    //console.group(">>>readAssess");
    var self = this;
    self.dbAssess
      .get(taxID)
      .then(function(doc) {
        var assess = (self.assess = doc);
        //console.log(">>>read the tax info in database is: ", assess);
        assess.from = "assess-" + Math.random().toFixed(8);
        assess.dataFromDB = true;
        // chrome.storage.sync.set(
        // 	// {
        // 	// 	landValue: doc.landValue,
        // 	// 	improvementValue: doc.improvementValue,
        // 	// 	totalValue: doc.totalValue,
        // 	// 	_id: doc._id,
        // 	// 	from: 'assess' + Math.random().toFixed(8)
        // 	// }
        // 	assess
        // );
        callback(self.assess);
      })
      .catch(function(err) {
        //console.log(">>>read database error: ", err);
        self.assess = null;
        callback(self.assess);
      });
    //console.groupEnd(">>>readAssess");
  }

  writeAssess(assess) {
    //console.group('writeAssess');
    var taxID = assess._id;
    var self = this;
    assess.dataFromDB = true;
    self.dbAssess
      .put(assess)
      .then(function() {
        return self.dbAssess.get(taxID);
      })
      .then(function(doc) {
        //console.log(">>>bc assessment has been saved to db: ", doc);
      })
      .catch(function(err) {
        //console.log(">>>save bc assessment error: ", err);
        self.dbAssess
          .get(taxID)
          .then(function(doc) {
            return self.dbAssess.remove(doc);
          })
          .catch(function(err) {
            //console.log(">>>remove bc assess error: ", err);
          });
      });
    //console.groupEnd('writeAssess');
  }

  readStrataPlanSummary(strataPlan, callback) {
    //console.group('readStrataPlanSummary');
    //console.log(">>>this in Database is: ", this);
    var self = this;
    self.dbStrataPlanSummary
      .get(strataPlan)
      .then(function(doc) {
        self.strataPlan = doc;
        //console.log(">>>read the strataPlanSummary in database is: ", self.strataPlan);
        chrome.storage.sync.set({
          active: doc.active,
          sold: doc.sold,
          count: doc.count,
          searchDate: doc.searchDate,
          complex: doc.complex,
          strataPlan: doc._id,
          from: "strataPlanSummary" + Math.random().toFixed(8)
        });
        callback(self.strataPlan);
      })
      .catch(function(err) {
        //console.log(">>>read database strataPlanSummary error: ", err);
        self.strataPlan = null;
        callback(self.strataPlan);
      });
    //console.groupEnd('readStrataPlanSummary');
  }

  writeStrataPlanSummary(strataplan) {
    //console.group('writeStrataPlanSummary');
    var strataPlan = strataplan._id;
    var self = this;
    self.dbStrataPlanSummary
      .put(strataplan)
      .then(function() {
        return self.dbStrataPlanSummary.get(strataPlan);
      })
      .then(function(doc) {
        //console.log(">>>StrataPlan Summary has been saved to dbComplex: ", doc);
      })
      .catch(function(err) {
        //console.log(">>>save StrataPlan Summary error: ", err);
        self.dbStrataPlanSummary
          .get(strataPlan)
          .then(function(doc) {
            return self.dbStrataPlanSummary.remove(doc);
          })
          .catch(function(err) {
            //console.log(">>>remove StrataPlan Summary error: ", err);
          });
      });
    //console.groupEnd('writeStrataPlanSummary');
  }

  readComplex(complexInfo, callback) {
    //console.group(">>>readComplex");
    var self = this;
    self.complex = complexInfo;

    self.dbComplex.get(complexInfo._id, function(err, doc) {
      if (err) {
        self.writeComplex(self.complex);
        self.complex.from =
          "complexInfo-saved to db-" + Math.random().toFixed(8);
        callback(self.complex);
      } else {
        self.complex = doc;
        self.complex.from = "complexInfo" + Math.random().toFixed(8);
        callback(self.complex);
      }
    });

    // self.dbComplex.get(complexInfo._id).then(function (doc) {
    // 	self.complex = doc;
    // 	//console.log(">>>read the Complex info in database is: ", self.complex);
    // 	// chrome.storage.sync.set({
    // 	// 	complexID: doc._id,
    // 	// 	complexName: doc.name+'*',
    // 	// 	strataPlan: doc.strataPlan,
    // 	// 	addDate: doc.addDate,
    // 	// 	subArea: doc.subArea,
    // 	// 	neighborhood: doc.neighborhood,
    // 	// 	postcode: doc.postcode,
    // 	// 	streetName: doc.streetName,
    // 	// 	streetNumber: doc.streetNumber,
    // 	// 	dwellingType: doc.dwellingType,
    // 	// 	totalUnits: doc.totalUnits,
    // 	// 	devUnits: doc.devUnits,
    // 	// 	from: 'complex' + Math.random().toFixed(8)
    // 	// });
    // 	self.complex.from = 'complex' + Math.random().toFixed(8);
    // 	callback(self.complex);
    // }).catch(function (err) {
    // 	//console.log(">>>read database Complex error: ", err);
    // 	//self.complex = null;
    // 	self.writeComplex(self.complex);
    // 	self.complex.from = 'complex-saved to db-' + Math.random().toFixed(8);;
    // 	callback(self.complex);
    // })
    // //console.groupEnd(">>>readComplex");
  }

  writeComplex(complex) {
    //console.group('>>>writeComplex');
    var complexID = complex._id;
    var self = this;
    var complexName = complex.name;
    self.dbComplex
      .get(complexID)
      .then(function(doc) {
        //console.log('writeComplex...the complex EXISTS, pass writing');
        doc["name"] = complexName;
        doc["complexName"] = complexName;
        self.dbComplex.put(doc);
        return [doc, "complex updated!"];
      })
      .catch(function(err) {
        self.dbComplex
          .put(complex)
          .then(function() {
            //console.log('SAVED the complex info to database:', complex.name);
            return self.dbComplex.get(complexID);
          })
          .then(function(doc) {
            //console.log(">>>Complex Info has been saved to dbComplex: ", doc);
          })
          .catch(function(err) {
            //console.log(">>>save Complex info error: ", err);
          });
      });
    //console.groupEnd('>>>writeComplex');
  }

  readExposure(exposureInfo, callback) {
    //console.group(">>>readComplex");
    var self = this;
    self.exposure = exposureInfo;

    self.dbExposure.get(exposureInfo._id, function(err, doc) {
      if (err) {
        self.writeExposure(self.exposure);
        self.exposure.from = "exposure-saved to db-" + Math.random().toFixed(8);
        callback(self.exposure);
      } else {
        self.exposure = doc;
        self.exposure.from = "exposure" + Math.random().toFixed(8);
        callback(self.exposure);
      }
    });
  }

  writeExposure(exposure) {
    //console.group('>>>writeComplex');
    var exposureID = exposure._id;
    var self = this;
    var exposureName = exposure.name;
    self.dbExposure
      .get(exposureID)
      .then(function(doc) {
        //console.log('writeComplex...the complex EXISTS, pass writing');
        doc["name"] = exposureName;
        self.dbExposure.put(doc);
        return [doc, "exposure updated!"];
      })
      .catch(function(err) {
        self.dbExposure
          .put(exposure)
          .then(function() {
            //console.log('SAVED the complex info to database:', complex.name);
            return self.dbExposure.get(exposureID);
          })
          .then(function(doc) {
            //console.log(">>>Complex Info has been saved to dbComplex: ", doc);
          })
          .catch(function(err) {
            //console.log(">>>save Complex info error: ", err);
          });
      });
    //console.groupEnd('>>>writeComplex');
  }

  readListing(listingInfo, callback) {
    //console.group(">>>readComplex");
    var self = this;
    self.listing = listingInfo;

    self.dbListing.get(listingInfo._id, function(err, doc) {
      if (err) {
        self.writeListing(self.listing);
        self.listing.from = "listing-saved to db-" + Math.random().toFixed(8);
        callback(self.listing);
      } else {
        self.listing = doc;
        self.listing.from = "listing" + Math.random().toFixed(8);
        callback(self.listing);
      }
    });
  }

  writeListing(listing) {
    //console.group('>>>writeListing');
    var listingID = listing._id;
    var self = this;
    var listingName = listing.name;
    self.dbListing
      .get(listingID)
      .then(function(doc) {
        //console.log('writeListing...the listing EXISTS, pass writing');
        doc["name"] = listingName;
        self.dbListing.put(doc);
        return [doc, "listing updated!"];
      })
      .catch(function(err) {
        self.dbListing
          .put(listing)
          .then(function() {
            //console.log('SAVED the listing info to database:', listing.name);
            return self.dbListing.get(listingID);
          })
          .then(function(doc) {
            //console.log(">>>Listing Info has been saved to dbListing: ", doc);
          })
          .catch(function(err) {
            //console.log(">>>save Listing info error: ", err);
          });
      });
    //console.groupEnd('>>>writeListing');
  }

  readShowing(showingInfo, callback) {
    //console.group(">>>readShowing");
    var self = this;
    self.showing = showingInfo;

    self.dbShowing.get(showingInfo._id, function(err, doc) {
      if (err) {
        //console.log(">>>read database showing error: ", err);
        self.writeShowing(self.showing);
        self.showing.from = "showing-saved to db-" + Math.random().toFixed(8);
        callback(self.showing);
      } else {
        self.showing = doc;
        //console.log(">>>read the showing Info in database is: ", self.showing);
        self.showing.from = "showing-" + Math.random().toFixed(8);
        callback(self.showing);
      }
    });
    //console.groupEnd(">>>readShowing");
  }

  writeShowing(showing) {
    var showingID = showing._id;
    var self = this;
    var showingName = showing.name;
    var clientName = showing.clientName;
    var showingNote = showing.showingNote;
    var showingDate = showing.showingDate;
    var showingTime = showing.showingTime;
    //console.group('>>>writeShowing');
    self.dbShowing
      .get(showingID)
      .then(function(doc) {
        //console.log('writeShowing...the showing info EXISTS, pass writing!');
        doc["name"] = showingName;
        doc["clientName"] = clientName;
        doc["showingNote"] = showingNote;
        doc["showingDate"] = showingDate;
        doc["showingTime"] = showingTime;
        self.dbShowing.put(doc);
        return [doc, "showing updated!"];
      })
      .catch(function(err) {
        self.dbShowing
          .put(showing)
          .then(function() {
            //console.log('SAVED the showing info to database:', showing.clientName);
            return self.dbShowing.get(showingID);
          })
          .then(function(doc) {
            //console.log(">>>Showing Info has been saved to dbShowing: ", doc);
          })
          .catch(function(err) {
            //console.log(">>>save showing info error: ", err);
          });
      });
    //console.groupEnd('>>>writeShowing');
  }
}

export default Database;
