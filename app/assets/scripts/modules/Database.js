//Create, Read, Write, Query Database

class Database{

	constructor(){

		this.db = new PouchDB('http://localhost:5984/bcassessment');
		this.db.info().then(function(info){
			  	console.log(info);
			});
		this.assess = null;

	}

	read(PID, callback){

		console.log(">>>this in Database is: ", this);
		var self = this;

		self.db.get(PID).then(function(doc){

				self.assess=doc;
				console.log(">>>read the tax info in database is: ", self.assess);

				chrome.storage.sync.set({landValue: doc.landValue, 
		        										improvementValue: doc.improvementValue,
		        										totalValue: doc.totalValue
		        										});
				callback(self.assess);
				
			}).catch(function(err){
				console.log(">>>read database error: ", err);

				// chrome.runtime.sendMessage(

				//    		{from: 'ListingReport', todo: 'taxSearch'},

				//    		function(response){

				//    			console.log('>>>mls-fullpublic got response:', response);

				//    		}
				// )

				self.assess=null;
				callback(self.assess);
				
			})


	}

	write(assess){

		var PID = assess._id;
		var self = this;

		self.db.put(assess).then(function(){
			        	return self.db.get(PID);
			        }).then(function(doc){
			        	console.log(">>>bc assessment has been saved to db: ", doc);
			        }).catch(function(err){
			        	console.log(">>>save bc assessment error: ", err);
			        	self.db.get(PID).then(function(doc){
			        		return self.db.remove(doc);
			        	}).catch(function(err){
			        		console.log(">>>remove bc assess error: ", err);
			        	})
			        });

	}


}

export default Database;