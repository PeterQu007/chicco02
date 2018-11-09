//Create, Read, Write, Query Database

class Database {

	constructor() {
		//console.group('database constructor');
		this.dbAssess = new PouchDB('http://localhost:5984/bcassessment');
		this.dbComplex = new PouchDB('http://localhost:5984/complex');
		this.dbStrataPlanSummary = new PouchDB('http://localhost:5984/strataplansummary');
		this.dbShowing = new PouchDB('http://localhost:5984/showing');
		this.dbAssess.info().then(function (info) {
			//console.log(info);
		});
		this.dbComplex.info().then(function (info) {
			//console.log(info);
		});
		this.dbStrataPlanSummary.info().then(function (info) {
			//console.log(info);
		});
		this.dbShowing.info().then(function(info){
			//console.log(info);
		});
		this.assess = null;
		this.complex = null;
		this.strataPlan = null;
		this.showing = null;
		//console.groupEnd('database constructor');
	}

	readAssess(taxID, callback) {
		//console.group(">>>readAssess");
		var self = this;
		self.dbAssess.get(taxID).then(function (doc) {
			var assess = self.assess = doc;
			//console.log(">>>read the tax info in database is: ", assess);
			assess.from = 'assess-'+ "ForSpreadSheet-" + Math.random().toFixed(8);
			assess.dataFromDB = true;
			chrome.storage.sync.set(
				// {
				// 	landValue: doc.landValue,
				// 	improvementValue: doc.improvementValue,
				// 	totalValue: doc.totalValue,
				// 	_id: doc._id,
				// 	from: 'assess' + Math.random().toFixed(8)
				// }
				assess
			);
			callback(self.assess);
		}).catch(function (err) {
			//console.log(">>>read database error: ", err);
			self.assess = null;
			callback(self.assess);
		})
		//console.groupEnd(">>>readAssess");
	}

	writeAssess(assess) {
		//console.group('writeAssess');
		var taxID = assess._id;
		var self = this;
		assess.dataFromDB = true;
		self.dbAssess.put(assess).then(function () {
			return self.dbAssess.get(taxID);
		}).then(function (doc) {
			//console.log(">>>bc assessment has been saved to db: ", doc);
		}).catch(function (err) {
			//console.log(">>>save bc assessment error: ", err);
			self.dbAssess.get(taxID).then(function (doc) {
				return self.dbAssess.remove(doc);
			}).catch(function (err) {
				//console.log(">>>remove bc assess error: ", err);
			})
		});
		//console.groupEnd('writeAssess');
	}

	readStrataPlanSummary(strataPlan, callback) {
		//console.group('readStrataPlanSummary');
		//console.log(">>>this in Database is: ", this);
		var self = this;
		self.dbStrataPlanSummary.get(strataPlan).then(function (doc) {
			self.strataPlan = doc;
			//console.log(">>>read the strataPlanSummary in database is: ", self.strataPlan);
			chrome.storage.sync.set({
				active: doc.active,
				sold: doc.sold,
				count: doc.count,
				searchDate: doc.searchDate,
				complex: doc.complex,
				strataPlan: doc._id,
				from: 'strataPlanSummary' + Math.random().toFixed(8)
			});
			callback(self.strataPlan);
		}).catch(function (err) {
			//console.log(">>>read database strataPlanSummary error: ", err);
			self.strataPlan = null;
			callback(self.strataPlan);
		})
		//console.groupEnd('readStrataPlanSummary');
	}

	writeStrataPlanSummary(strataplan) {
		//console.group('writeStrataPlanSummary');
		var strataPlan = strataplan._id;
		var self = this;
		self.dbStrataPlanSummary.put(strataplan).then(function () {
			return self.dbStrataPlanSummary.get(strataPlan);
		}).then(function (doc) {
			//console.log(">>>StrataPlan Summary has been saved to dbComplex: ", doc);
		}).catch(function (err) {
			//console.log(">>>save StrataPlan Summary error: ", err);
			self.dbStrataPlanSummary.get(strataPlan).then(function (doc) {
				return self.dbStrataPlanSummary.remove(doc);
			}).catch(function (err) {
				//console.log(">>>remove StrataPlan Summary error: ", err);
			})
		});
		//console.groupEnd('writeStrataPlanSummary');
	}

	readComplex(complexID, callback) {
		//console.group(">>>readComplex");
		var self = this;
		self.dbComplex.get(complexID).then(function (doc) {
			self.complex = doc;
			//console.log(">>>read the Complex info in database is: ", self.complex);
			chrome.storage.sync.set({
				complexID: doc._id,
				complexName: doc.name+'*',
				strataPlan: doc.strataPlan,
				addDate: doc.addDate,
				subArea: doc.subArea,
				neighborhood: doc.neighborhood,
				postcode: doc.postcode,
				streetName: doc.streetName,
				streetNumber: doc.streetNumber,
				dwellingType: doc.dwellingType,
				totalUnits: doc.totalUnits,
				devUnits: doc.devUnits,
				from: 'complex' + Math.random().toFixed(8)
			});
			callback(self.complex);
		}).catch(function (err) {
			//console.log(">>>read database Complex error: ", err);
			self.complex = null;
			callback(self.complex);
		})
		//console.groupEnd(">>>readComplex");
	}

	writeComplex(complex) {
		//console.group('>>>writeComplex');
		var complexID = complex._id;
		var self = this;
		self.dbComplex.get(complexID).then(function (doc) {
			//console.log('writeComplex...the complex EXISTS, pass writing');
		}).catch(function (err) {
			self.dbComplex.put(complex).then(function () {
				//console.log('SAVED the complex info to database:', complex.name);
				return self.dbComplex.get(complexID);
			}).then(function (doc) {
				//console.log(">>>Complex Info has been saved to dbComplex: ", doc);
			}).catch(function (err) {
				//console.log(">>>save Complex info error: ", err);
			});
		})
		//console.groupEnd('>>>writeComplex');
	}

	readShowing(showingID, callback) {
		//console.group(">>>readShowing");
		var self = this;
		self.dbShowing.get(showingID).then(function (doc) {
			self.showing = doc;
			//console.log(">>>read the showing Info in database is: ", self.showing);
			chrome.storage.sync.set({
				showingID: doc._id,
				mlsNo: doc.mls,
				clientName: doc.clientName,
				requestMethod: doc.requestMethod,
				showingDate: doc.showingDate,
				showingTime: doc.showingTime,
				complexName: doc.name,
				strataPlan: doc.strataPlan,
				addDate: doc.addDate,
				subArea: doc.subArea,
				neighborhood: doc.neighborhood,
				postcode: doc.postcode,
				streetName: doc.streetName,
				streetNumber: doc.streetNumber,
				from: 'showing' + Math.random().toFixed(8)
			});
			callback(self.showing);
		}).catch(function (err) {
			//console.log(">>>read database showing error: ", err);
			self.showing = null;
			callback(self.showing);
		})
		//console.groupEnd(">>>readShowing");
	}

	writeShowing(showing) {
		var showingID = showing._id;
		var self = this;
		//console.group('>>>writeShowing');
		self.dbShowing.get(showingID).then(function (doc) {
			//console.log('writeShowing...the showing info EXISTS, pass writing!');
		}).catch(function (err) {

			self.dbShowing.put(showing).then(function () {
				//console.log('SAVED the showing info to database:', showing.clientName);
				return self.dbShowing.get(showingID);
			}).then(function (doc) {
				//console.log(">>>Showing Info has been saved to dbShowing: ", doc);
			}).catch(function (err) {
				//console.log(">>>save showing info error: ", err);
			});
		})
		//console.groupEnd('>>>writeShowing');
	}
}

export default Database;