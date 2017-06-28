//Paginator
import $ from 'jquery';
import Table from './Table';

var log = console.log;

const Debug = {
	enable: 0,
	disable: 1
}

class Paginator{

	constructor(paginatorSelector, debug){

		this.log = (debug === Debug.enable)? console.log : function(){};
		var _$ = this.log;
		_$("==================================New Paginator");

		this.selector = paginatorSelector.trim();
		this.pageChanged = null;
		this.paginator = $(this.selector).children('#paginator1');
		this.totalPages = this.getTotalPages();
		//currentPage = current page number
		this.currentPage = this.getCurrentPage(0);
		_$("Paginator.getCurrentPage: ", this.currentPage);
		//prevPage = previous page number
		this.prevPage = this.getPrevPage();
	
		this.cgTable = new Table(this.selector + ' table', Debug.disable);

		_$("==================================exit Paginator")
	}

	getTotalPages(debug){

		var _$$ = ((debug || 1) == Debug.enable) ? console.log : function(){};

		_$$("getTotalPages method: ---------------------")
		var pn = this.paginator;
		_$$(pn);

		//only one active page => current page
		var currentPage = parseInt(pn.children('b').last().text());
		_$$(currentPage);
		//the last inactive page number could be the total pages
		var lastInactivePage = parseInt(pn.children('a').last().text());
		_$$(lastInactivePage);
		//if the current page is after the last inactive page, total pages = currentpage
		return (currentPage > lastInactivePage) ? currentPage : lastInactivePage;
	}

	getCurrentPage(currentPageSelector){
		//parameter: todo...
		var pn = this.paginator;
		//get current page from the web page paginator (craigslist account)
		return parseInt(pn.children('b').last().text());
	}

	backupCurrentPage(){

		var self = this;
		var _$ = this.log;
		var msg = {from: "paginator", subject: "backupCurrentPage", currentPage: self.currentPage};

		chrome.runtime.sendMessage(

			msg,

			function(response){
				_$("paginator.backupCurrentPage.1.0.Done! ", response.backupCurrentPage);
			}
			)

	} 

	getPrevPage(){

		var self = this;
		var _$ = self.log;
		var msg = {from: "paginator", subject: "fetchBackupCurrentPage"};

		chrome.runtime.sendMessage(

			msg,

			function(response){

				_$("paginator.1.0.get fetchBackupCurrentPage response: ", response)
				self.prevPage = response.backupCurrentPage;
				self.pageChanged = self.currentPage != self.prevPage;

				if(self.pageChanged){

					if(response.pageChanged){
						msg = {from: "paginator", subject: "resetBackupListing"}
						//reset the backupListing
						chrome.runtime.sendMessage(

							msg,

							function(response){
								
								self.backupCurrentPage();
								
							}
						)
					}
				}
			}
		);
	}

	gotoPage(pageIndex, mode){

		//var log = ((mode || 1) ==0) ? console.log : function(){};
		
		var pn = this.paginator;
		try{

			pn.children('a').filter(function(index){
				log('page number: ', $(this).text());
				return parseInt($(this).text()) == pageIndex;
			})[0].click();
			
		}catch(e){

		}



	}
}

export default Paginator;