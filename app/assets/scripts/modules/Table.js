//Table class
import $ from 'jquery';
import Listing from './Listing';

const Debug = {logLocal: 1, logBackground: 2, logBG: 2, disable: 3 };

const Cols = {

				status: "0",
				select: "7",
				manage: "1",
				title: "2",
				area: "3",
				date: "4",
				exp: "5",
				id: "6"
			} 

class Table{

	constructor(tableSelector, debug){

		var _$ = this.log = (debug === Debug.enable)? console.log : function(){};
		
		this.backupListing = this.getBackupListing(debug);
		this.tableSelector = tableSelector.trim();
		this.table = $(this.tableSelector); //convert the tabelSelector to jquery table element
		this.rows = $($(this.tableSelector + ' tbody tr').get().reverse()); //get all of the rows in the table page 1/2/3...
		this.listings = $.map(this.rows, function(row){
			return new Listing({tr: row, debug: Debug.disable});
		});
		//_$(this.listings);

		////--var baseListing = this.backupListing;
		this.currentListing = null; //point to current repostable listing
		this.selectedListings = null; //collection of selected listings of the table
		this.form = {}; //contain the repost link

		this.checkboxes = {}; //all the added checkboxes
		this.addCheckboxes(Debug.disable);
		//_$("all the checkboxes", this.checkboxes);
		this.events();
	}

	events(){

		var self = this;
		var _$ = self.log;

		self.checkboxes.click(function(){
			_$('Checkboxes clicked', this);
			var checkbox = this;

			self.currentListing = self.listings.filter(function(listing){
				return listing.postID.toString().trim() === checkbox.value.replace("post","");
			})[0];

			_$('Checkboxes Clicked.result ==>', self.currentListing);
			$(self.currentListing.tr).addClass('currentRow');

			chrome.runtime.sendMessage(

				{from: 'classTable', subject: 'currentListingUpdated'},

				function(response){

					_$("***tableClass.checkbox Clicked.send out currentListing updated msg");
				}

			)
		})
	}
	
	addCheckboxes(){

		var self = this;
		var _$ = self.log;
		var rows = self.rows;
		
		var newHeadTag = '<th class="tablesorter-header ' + 
				'tablesorter-headerUnSorted ui-widget-header ui-corner-all ui-state-default">' +
				'<div>select!</div>' +
				"</th>"
		var newCellTagTemplate = '<td >' + 
				'<input type="checkbox" name="selectPost" class="status Z" value="spost">' +
				"</td>"

		try{

			_$("Table.addSelectField: ");

			//$(newHeadTag).insertAfter("thead tr th:last");
			$(newHeadTag).insertAfter(this.tableSelector + " thead tr th:first");
			

			rows.each(function(index){
				$(this).attr('id', 'row'+index);
			});

			rows.each(function(index){

				var newCellTag = newCellTagTemplate.replace("spost", "post"+self.listings[index].postID.toString().trim());
				_$("newCellTag: =====> ", newCellTag);
				_$("the row: ", this);
				$(newCellTag).insertAfter("#row"+index + " td:first");

				
			})

			self.checkboxes = $(self.tableSelector + ' tbody input[type = checkbox]');
			_$("all the checkboxes", self.checkboxes);
			
		}catch(ex){

			_$(ex);

		}//end of try

	}

	getBackupListing(){
	//after the table has been created, get the backupListing from background
	//background listing is use as baseListing for next currentListing
		var _$ = this.log;
		var self = this;
		var msg = {from: 'readListing', subject: 'fetchBackupListing'};
		var result;
	
		$(function(){
			//read the backupListing from background
			chrome.runtime.sendMessage(

				msg,
				//callback function
				function(response){
			
					result = response;
					_$("Table.getBackupListing.1.00:", result);
					_$("Table.ready to set Current Listing: ============>")
					self.setCurrentListing(result); // use the result as baseListing

				}

			); 
		});

		return result;

	}

	repostableListings(){
	//filter the repostable listings 
		return this.rows.filter(function(index){
			return $.map($(this).find("td:eq(1)").find('input[type="submit"]'), 
						function(value){return value.value;}) == 'repost';
		})
	}

	setCurrentListing(listing){

		var self = this;
		var _$ = this.log;

		self.currentListing = $(self.listings).filter(function(){

			return this.manage[0]=="repost" && (listing.postID == '' || this.postID > listing.postID)

		})[0];

		

		if(self.currentListing){
			$(self.currentListing.tr).addClass('currentRow');
		}else{
			_$("classTable.setCurrentListing...no repostable listing found");
			self.currentListing = self.listings[0];
		}

		_$('classTable.setCurrentListing...self.currentListing: ', self.currentListing);

		chrome.runtime.sendMessage(

			{from: 'classTable', subject: 'currentListingUpdated'},

			function(response){

				_$("classTable...send out currentListing updated msg");
			}

			)
		
	}
	
}

export default Table;