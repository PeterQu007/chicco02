//Create, Read, Write, Query Database

class Database {

	constructor() {

		this.dbAssess = new PouchDB('http://localhost:5984/bcassessment');
		this.dbComplex = new PouchDB('http://localhost:5984/complex');
		this.dbAssess.info().then(function (info) {
			console.log(info);
		});
		this.dbComplex.info().then(function(info){
			console.log(info);
		});
		this.assess = null;
		this.complex = null;
	}

	readAssess(PID, callback) {

		console.log(">>>this in Database Assess is: ", this);
		var self = this;

		self.dbAssess.get(PID).then(function (doc) {

			self.assess = doc;
			console.log(">>>read the tax info in database is: ", self.assess);

			chrome.storage.sync.set({
				landValue: doc.landValue,
				improvementValue: doc.improvementValue,
				totalValue: doc.totalValue,
				_id: doc._id,
				from: 'assess'+ Math.random().toFixed(8)
			});
			callback(self.assess);

		}).catch(function (err) {
			console.log(">>>read database error: ", err);

			self.assess = null;
			callback(self.assess);

		})


	}

	writeAssess(assess) {

		var PID = assess._id;
		var self = this;

		self.dbAssess.put(assess).then(function () {
			return self.dbAssess.get(PID);
		}).then(function (doc) {
			console.log(">>>bc assessment has been saved to db: ", doc);
		}).catch(function (err) {
			console.log(">>>save bc assessment error: ", err);
			self.dbAssess.get(PID).then(function (doc) {
				return self.dbAssess.remove(doc);
			}).catch(function (err) {
				console.log(">>>remove bc assess error: ", err);
			})
		});

	}

	readComplex(strataPlan, callback) {

		console.log(">>>this in Database is: ", this);
		var self = this;

		self.dbComplex.get(strataPlan).then(function (doc) {

			self.complex = doc;
			console.log(">>>read the Complex info in database is: ", self.complex);

			chrome.storage.sync.set({
				active: doc.active,
				sold: doc.sold,
				count: doc.count,
				searchDate: doc.searchDate,
				complex: doc.complex,
				strataPlan: doc._id,
				from: 'complex'+ Math.random().toFixed(8)
			});
			callback(self.complex);

		}).catch(function (err) {
			console.log(">>>read database Complex error: ", err);

			self.complex = null;
			callback(self.complex);

		})


	}

	writeComplex(complex) {

		var strataPlan = complex._id;
		var self = this;

		self.dbComplex.put(complex).then(function () {
			return self.dbComplex.get(strataPlan);
		}).then(function (doc) {
			console.log(">>>StrataPlan / Complex has been saved to dbComplex: ", doc);
		}).catch(function (err) {
			console.log(">>>save StrataPlan / Complex error: ", err);
			self.dbComplex.get(strataPlan).then(function (doc) {
				return self.dbComplex.remove(doc);
			}).catch(function (err) {
				console.log(">>>remove StrataPlan / Complex error: ", err);
			})
		});

	}
}

export default Database;