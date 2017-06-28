// function Listing(status, postID, manage, description, postedDate, from, subject){
//   this.status = status || '';
//   this.postID = postID || '';
//   this.manage = manage || '';
//   this.description = description || '';
//   this.postedDate = postedDate || '';
//   this.from = from || '';
//   this.subject = subject || '';

// };

import $ from 'jquery';

const Debug = {logLocal: 1, logBackground: 2, logBG: 2, disable: 3 }; //BG === Background

const fields = {
				//match the column number
				status: "0",
				select: "7",
				manage: "1",
				description: "2",
				area: "3",
				date: "4",
				exp: "5",
				id: "6"
			} 

class Listing{

	constructor(status, MLSNo, manage, strataPLan, listngDate, from, subject, debug){
		//signature-0 param: ()
		//signature-1 param: ({tr:tr,from:from,subject:subject,...})
		//signature-7 param: (status, postID, manage, description, postedDate, from, subject) 

		var args = arguments.length;

		this.forms = {
				repostForm: null,
				editForm: null,
				deleteForm: null,
				renewForm: null,
				displayForm: null};

		if(args==1)
		{
			//@@http://www.barelyfitz.com/blog/archives/2006/03/07/230/
			//Easier JavaScript object constructor arguments
			for (var n in arguments[0]) { this[n] = arguments[0][n]; }
			//var _$$$ = this.log = this.debug === Debug.enable? console.log : function(){};
			this.debug = this.debug || Debug.disable;
			this.log = this.$$$.bind(this);
			this.$$$('^^^Inside Listing Module, with argument of a table row');
			this.readRow(this.tr);
		}else{
			//var _$$$ = this.log = debug === Debug.enable? console.log : function(){};
			this.debug = debug || Debug.disable;
			this.log = this.$$$.bind(this);
			this.$$$('^^^Inside Listing Moduel, with arguments of listing fields')
			this.status = status || '';
			this.MLSNo = MLSNo || '';
			this.manage = manage || '';
			this.strataPlan = strataPlan || '';
			this.ListingDate = listingDate || '';
			this.select = false;
			this.from = from || '';
			this.subject = subject || '';
			this.tr =null;
		}

	} 

	readRow(tr){
	//read status, postID, manage[], postedDate, description, forms from (tr)
	
		'use strict';

		var self = this;
		var _$ = self.log;

		if(!tr){
			_$('classListing.readRow.2.0x..No Listing row passed in to function: ', tr);
			this.status = '';
			this.postID = '';
			this.manage = '';
			this.description = '';
			this.areaAndCat = '';
			this.title = '';
			this.price = '';
			this.area = '';
			this.cat = '';
			this.postedDate = '';
			this.select = false;
			this.from = '';
			this.subject = '';
			this.tr =null;
			return ;
		}
		
		var forms;
		var BreakException = {};
				
		//for each listing, get to the first repostable one
		try {
		
			var thisRow = $(tr);
			thisRow.removeClass('currentRow');

			_$("classListing.readRow.1.00..thisRow from the Table: ", thisRow);

			self.status = thisRow.find("td:eq("+fields.status+")").text().trim(); 
			self.postID = thisRow.find("td:eq("+fields.id+")").text().trim();
			self.manage = $.map(thisRow
							.find("td:eq("+fields.manage+")")
							.find('input[type="submit"]'), function(value){
								return value.value;});
			self.description = thisRow.find("td:eq("+fields.description+")").text().trim(); 
			self.areaAndCat = thisRow.find("td:eq("+fields.area+")").text().trim();
			self.postedDate = thisRow.find("td:eq("+fields.date+")").text().trim();

			forms = thisRow.find("td:eq("+fields.manage+")").find('form');

			_$('classListing.readRow.1.01..show forms: ', forms, thisRow);
			forms.each(function(index, form){

				self.addForm(self.manage[index], form);

			})

			self.readTitleAndPrice(self.description);
			self.readAreaAndCat(self.areaAndCat);

			_$('classListing.readRow.1.02..thisRow fields are ', self);
			_$('classListing.readRow.1.03..------------------------------)')

		} catch (e) {

			if (e !== BreakException) throw e;
				
		} //end of Try block

			
		
	} //end of read row

	readTitleAndPrice(description){

		var self = this;
		var _$$$ = this.log;
		
		var title,price;
		var indexOf$ = description.indexOf('$');
		var indexOf_ = description.indexOf('-');
		var length = description.length;

		if(indexOf$ != -1){
			title = description.substring(0,indexOf$).substring(0,indexOf_).trim();
			price = description.substring(indexOf$, length).trim();
		}else{
			title = description.trim();
			price = '';
		};

		self.title = title;
		self.price = price;

		return self;
	}

	readAreaAndCat(areaAndCat){

		var self = this;
		var _$$$ = this.log;
		
		var area, cat;
		var indexOf_ = areaAndCat.indexOf('-') + 5;
		var len = areaAndCat.length;
		
		area = areaAndCat.substring(0, indexOf_).replace(' ','').trim();
		cat = areaAndCat.substring(indexOf_, len).trim();
	
		self.area = area;
		self.cat = cat;

		return self;
	}

	addForm(name, form){

		var _$ = this.log;
		_$("classListing.addForm.2.0..the form to be added: ", form);
		switch (name) {
			case 'repost':
				this.forms.repostForm = form;
				_$("classListing.addForm.2.1..the repostform has been added: ", this.forms.repostForm, this);
				break;
			case 'edit':
				this.forms.editForm = form;
				_$("classListing.addForm.2.1..the editform has been added: ", this.forms.editForm, this);
				break;
			case 'delete':
				this.forms.deleteForm = form;
				_$("classListing.addForm.2.1..the deleteform has been added: ", this.forms.deleteForm, this);
				break;
			case 'renew':
				this.forms.renewForm = form;
				_$("classListing.addForm.2.1..the renewform has been added: ", this.forms.renewForm, this);
				break;
			default:
				break;
		}
	}

	edit(price, debug){
		if(debug){
			this.$$$(debug, 'clsListing.edit a post...listing postID: ', this.postID);
			return;
		}
		this.forms.editForm.submit();
	}

	delete(debug){
		if(debug){
			this.$$$(debug, 'clsListing.edit a post...listing postID: ', this.postID);
			return;
		}
		this.forms.deleteForm.submit();
	}

	renew(){
		this.forms.renewForm.submit();
	}

	display(){
		this.forms.displayForm.submit();
	}

	repost(debug){
		if(debug){
			this.$$$(debug, 'clsListing.edit a post...listing postID: ', this.postID);
			return;
		}
		this.forms.repostForm.submit();
	}

	copy(debug){
		if(debug){
			this.$$$(debug, 'clsListing.copy a post...listing postID: ', this.postID);
			return;
		}
		this.forms.editForm.submit();
	}

	saveToFav(){
		this.forms.saveForm.submit();
	}

	removeFromFav(){
		this.forms.removeForm.submit();
	}

	$$$(dbg, msg){

		var self = this;
		var debug = dbg == 0 ? Debug.disable : (parseInt(dbg) || self.debug || Debug.disable);

		switch (debug)
		{
			case Debug.logLocal:
				console.warn(arguments);
				break;
			case Debug.logBackground:
				chrome.runtime.sendMessage(

					{from: 'clsDelete', subject: 'logMessage', log: arguments},

					function(response){
						//to do sth.
					}

					)
				break;
			case Debug.disable:
				break;

			default:
				console.warn(arguments);
				break;
		}

		return self;
	}
}

module.exports = Listing;