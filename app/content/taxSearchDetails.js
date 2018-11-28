////READ TAX DETAILS REPORT
////SAVE TAX DATA TO DATABASE 

const divContainerID = 'divHtmlReport';
var curTabID = null;

let taxDetails = {

	pid: $('div[style="top:113px;left:150px;width:221px;height:14px;"]').text(),
	address: $('div[style="top:71px;left:150px;width:221px;height:14px;"]').text(),
	taxYear: $('div[style="top:176px;left:150px;width:221px;height:14px;"]').text(),
	taxRollNumber: $('div[style="top:162px;left:150px;width:221px;height:14px;"]').text(),
	grossTaxes: $('div[style="top:162px;left:525px;width:221px;height:14px;"]').text(),
	legal: $('div[style="top:264px;left:0px;width:746px;height:14px;"]').text(),
	legalFreeFormDescription: $('div[style="top:303px;left:0px;width:746px;height:14px;"]').text(),
	
	reportTitleClass: $("div[style='top:0px;left:0px;width:746px;height:17px;']").attr('class'), //base class for reading the variable position fields

	landValue: null,
	improvementValue: null,
	totalValue: null,
	bcaDescription: null,
	bcaDataUpdateDate: null,
	lotSize: null,
	planNum: null,
	reportLink: null,
	houseType: null,

	newTaxAssessRecord: false,
	
	init: function () {

		let self = this;
		chrome.storage.sync.get(['houseType','taxSearchRequester','taxYear'], function (result) {

			self.houseType = result.houseType;
			console.log('houseType is: ', self.houseType);
			console.log('TopPosition: ', self.ActualTotalsTopPosition);

			self.getTaxReportDetails();
			
			let assess = {
				_id: self.pid + '-' + result.taxYear,
				landValue: self.landValue,
				improvementValue: self.improvementValue,
				totalValue: self.totalValue,
				PID: self.pid,
				taxYear: self.taxYear,
				address: self.address,
				legal: self.legal,
				taxRollNumber: self.taxRollNumber,
				grossTaxes: self.grossTaxes,
				planNum: self.planNum,
				houseType: self.houseType,
				lotSize: self.lotSize,
				bcaDataUpdateDate: self.bcaDataUpdateDate,
				bcaDescription: self.bcaDescription,
				from: 'assess-'+ result.taxSearchRequester + '-' + Math.random().toFixed(8),
				dataFromDB: false 
			};

			if (self.newTaxAssessRecord){
				assess.from = 'assess-'+ result.taxSearchRequester + '-TaxSearchFailed-' + Math.random().toFixed(8)
			}
	
			chrome.storage.sync.set(assess, function () {
				console.log('TaxDetails.bcAssessment is...', assess);
				// self.getReportLink(function () {
				// 	self.reportLink[0].click();
				// 	console.log("1 Current Tab When Doing Tax Search is : ", curTabID);
				// 	let curTabContentContainer = $('div' + curTabID, top.document);
				// 	curTabContentContainer.attr("style", "display:block!important");
				// });
			});
			if(!self.newTaxAssessRecord){
				chrome.runtime.sendMessage(
					{
						todo: 'saveTax',
						taxData: assess,
					},
					function (response) {
						console.log('tax Data has been save to the database!');
					}
				);
			}
			
		})
	},

	// getReportLink: function (callback) {
	// 	let self = this;
	// 	chrome.storage.sync.get('curTabID', function (result) {
	// 		console.log("2 Current Tab When Doing Tax Search is : ", result.curTabID);
	// 		self.reportLink = $('div#app_tab_switcher a[href="' + result.curTabID + '"]', top.document);
	// 		console.log(self.reportLink);
	// 		curTabID = result.curTabID;
	// 		callback();
	// 	});
	// },

	getAssessClass: function(reportTitleClass){

		var assessClass = "";
		console.log('reportTitleClass is: ', reportTitleClass);
		assessClass = 'mls' + (Number(reportTitleClass.replace('mls','')) + 7);
		
		return assessClass;

	},

	getPlanNumClass: function(reportTitleClass){

		var planNumClass = "";
		console.log('reportTitleClass is: ', reportTitleClass);
		planNumClass = 'mls' + (Number(reportTitleClass.replace('mls','')) + 5);
		
		return planNumClass;

	},

	getOtherFieldsClass: function(reportTitleClass){

		var otherFieldsClass = "";
		console.log('reportTitleClass is: ', reportTitleClass);
		otherFieldsClass = 'mls' + (Number(reportTitleClass.replace('mls','')) + 3);
		
		return otherFieldsClass;

	},

	getTaxReportDetails: function(){

		var x0 = $('div#' + divContainerID).children(0).children();
		var i;
		for (i=0; i<=x0.length; i++){
			if ($(x0[i]).is('div')) {
				if(x0[i].textContent == 'Prop Address'){
					this.address = x0[i+1].textContent;
					if(x0[i+2].textContent != 'Jurisdiction'){
						this.address += x0[i+2].textContent;
					}
				}
				if(x0[i].textContent == 'PropertyID'){
					this.pid = x0[i+1].textContent;
				}
				if(x0[i].textContent == 'Tax Year'){
					this.taxYear = x0[i+1].textContent;
				}
				if(x0[i].textContent == 'Gross Taxes'){
					this.grossTaxes = x0[i+1].textContent;
				}
				if (x0[i].textContent == 'Actual Totals') {
					this.landValue = x0[i+4].textContent;
					this.improvementValue = x0[i+5].textContent;
					this.totalValue = x0[i+6].textContent;
					if (this.landValue == '$0.00'){
						this.newTaxAssessRecord=true;
						this.landValue = 0;
						this.improvementValue = 0;
						this.totalValue = 0;
					}else{
						this.newTaxAssessRecord=false;
					}
				}
				if (x0[i].textContent == 'PlanNum'){
					this.planNum = x0[i+9].textContent;
				}
				if (x0[i].textContent == 'BCA Description'){
					this.bcaDescription = x0[i+1].textContent;
				}
				if (x0[i].textContent == 'BCAData Update'){
					this.bcaDataUpdateDate = x0[i+1].textContent;
				}
				if (x0[i].textContent == 'Lot Size'){
					this.lotSize = x0[i+1].textContent;
				}
				if (x0[i].textContent== 'BCA Description'){
					this.bcaDescription = x0[i+1].textContent;
				}
				if (x0[i].textContent == 'BCAData Update'){
					this.bcaDataUpdateDate = x0[i+1].textContent;
				}
			}
		
		}
		if (! this.totalValue){
			this.newTaxAssessRecord = true;
			this.landValue = 0;
			this.improvementValue = 0;
			this.totalValue = 0;
		}else{
			this.newTaxAssessRecord = false;
		}
	},
	//Revision 0, legacy version
	getTaxReportDetails_R0: function () {
		var self = this;
	
		var assessClass = self.getAssessClass(self.reportTitleClass);
		var planNumClass = self.getPlanNumClass(self.reportTitleClass);
		var otherFieldsClass = self.getOtherFieldsClass(self.reportTitleClass);

		// got Actual Totals:
		
		var x1 = $("div." + assessClass);
		self.landValue = x1[0].innerText;
		self.improvementValue=x1[1].innerText;
		self.totalValue=x1[2].innerText;
		
		// got plan number & other fields:
	
		var x2 = $("div." + planNumClass);
		self.planNum = x2[1].textContent;

		if (self.landValue != '$0.00'){
			var x3 = $("div." + otherFieldsClass);
			self.lotSize = x3[17].textContent; //lotSize Field Index: 17
			self.bcaDescription = x3[24].textContent; //BCA Description Field Index: 24
			self.bcaDataUpdateDate = x3[28].textContent; //BCAData Update: 28
		}else{
			self.lotSize = '';
			self.bcaDescription = '';
			self.bcaDataUpdateDate = '';
		}
	}
};

// start point:
$(function () {
	console.log('mls-taxdetails iFrame: ');
	taxDetails.init();
});
