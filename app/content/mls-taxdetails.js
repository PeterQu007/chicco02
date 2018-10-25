// read tax details report, save the data
var curTabID = null;

let taxDetails = {

	pid: $('div[style="top:113px;left:150px;width:221px;height:14px;"]').text(),
	address: $('div[style="top:71px;left:150px;width:221px;height:14px;"]').text(),
	taxYear: $('div[style="top:176px;left:150px;width:221px;height:14px;"]').text(),
	taxRollNumber: $('div[style="top:162px;left:150px;width:221px;height:14px;"]').text(),
	grossTaxes: $('div[style="top:162px;left:525px;width:221px;height:14px;"]').text(),
	legal: $('div[style="top:264px;left:0px;width:746px;height:14px;"]').text(),
	legalFreeFormDescription: $('div[style="top:303px;left:0px;width:746px;height:14px;"]').text(),

	/* ActualTotalsTopPosition : $("div:contains('Actual Totals'):last").position().top + 38,
	PlanNumTopPosition : $('div:contains("PlanNum"):last').position().top + 20,
	LotSizeTopPosition : $('div:contains("Lot Size"):last').position().top,
	bcaDescriptionTopPosition : $('div:contains("BCA Description"):last').position().top,
	bcaDataUpdateDateTopPosition : $('div:contains("BCAData Update"):last').position().top,
 */
	landValue: null,
	improvementValue: null,
	totalValue: null,
	bcaDescription: null,
	bcaDataUpdateDate: null,
	lotSize: null,
	planNum: null,
	reportLink: null,
	houseType: null,

	init: function () {

		let self = this;
		chrome.storage.sync.get('houseType', function (result) {

			self.houseType = result.houseType;
			console.log('houseType is: ', self.houseType);
			console.log('TopPosition: ', self.ActualTotalsTopPosition);

			self.getAssess();

			let assess = {
				_id: self.pid,
				landValue: self.landValue,
				improvementValue: self.improvementValue,
				totalValue: self.totalValue,
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
				from: 'assess' + Math.random().toFixed(8)
			};
			chrome.storage.sync.set(assess, function () {
				console.log('TaxDetails.bcAssessment is...', assess);
				self.getReportLink(function () {
					self.reportLink[0].click();
					console.log("1 Current Tab When Doing Tax Search is : ", curTabID);
					let curTabContentContainer = $('div' + curTabID, top.document);
					curTabContentContainer.attr("style", "display:block!important");
				});
			});
			chrome.runtime.sendMessage(
				{
					todo: 'saveTax_Pause',
					taxData: assess,
				},
				function (response) {
					console.log('tax Data has been save to the database!');
				}
			);
		})
	},

	getReportLink: function (callback) {
		let self = this;
		chrome.storage.sync.get('curTabID', function (result) {
			console.log("2 Current Tab When Doing Tax Search is : ", result.curTabID);
			self.reportLink = $('div#app_tab_switcher a[href="' + result.curTabID + '"]', top.document);
			console.log(self.reportLink);
			curTabID = result.curTabID;
			callback();
		});
	},

	getAssess: function () {
		var self = this;
		var ActualTotalsTopPosition = $('div:contains("Actual Totals"):last').position().top + 38;
		console.log("ActualTotalsTopPosition: ", ActualTotalsTopPosition);
		var PlanNumTopPosition = $('div:contains("PlanNum"):last').position().top + 20;
		var LotSizeTopPosition = $('div:contains("Lot Size"):last').position().top;
		var bcaDescriptionTopPosition = $('div:contains("BCA Description"):last').position().top;
		var bcaDataUpdateDateTopPosition = $('div:contains("BCAData Update"):last').position().top;

		console.log("ActualTotalsTopPosition: ", self.ActualTotalsTopPosition);

		switch (self.houseType) {
			case 'Attached':
				// got Actual Totals
				//self.landValue = $('div[style="top:604px;left:0px;width:246px;height:14px;"]').text();
				//self.improvementValue = $('div[style="top:643px;left:250px;width:246px;height:14px;"]').text();
				//self.totalValue = $('div[style="top:643px;left:500px;width:246px;height:14px;"]').text();
				
				self.landValue = $(`div[style="top:${ActualTotalsTopPosition}px;left:0px;width:246px;height:14px;"]`).text();

				console.log("land Value is: ", self.landValue);
				self.improvementValue = $(`div[style="top:${ActualTotalsTopPosition}px;left:250px;width:246px;height:14px;"]`).text();
				self.totalValue = $(`div[style="top:${ActualTotalsTopPosition}px;left:500px;width:246px;height:14px;"]`).text();
				// got plan number
				// self.planNum = $('div[style="top:356px;left:0px;width:79px;height:14px;"]').text();
				// self.lotSize = $('div[style="top:413px;left:150px;width:221px;height:14px;"]').text();
				// self.bcaDescription = $('div[style="top:469px;left:150px;width:221px;height:14px;"]').text();
				// self.bcaDataUpdateDate = $('div[style="top:497px;left:150px;width:221px;height:14px;"').text();
				self.planNum = $(`div[style="top:${PlanNumTopPosition}px;left:0px;width:79px;height:14px;"]`).text();
				self.lotSize = $(`div[style="top:${LotSizeTopPosition}px;left:150px;width:221px;height:14px;"]`).text();
				self.bcaDescription = $(`div[style="top:${bcaDescriptionTopPosition}px;left:150px;width:221px;height:14px;"]`).text();
				self.bcaDataUpdateDate = $(`div[style="top:${bcaDataUpdateDateTopPosition}px;left:150px;width:221px;height:14px;"]`).text();
				break;
			case 'Detached':
				// if(self.legalFreeFormDescription.length>0){
				// 	self.landValue = $(`div[style="top:${ActualTotalsTopPosition}px;left:0px;width:246px;height:14px;"]`).text();
				// 	self.improvementValue = $(`div[style="top:${615}px;left:250px;width:246px;height:14px;"]`).text();
				// 	self.totalValue = $('div[style="top:615px;left:500px;width:246px;height:14px;"]').text();
				// 	self.planNum = $('div[style="top:342px;left:0px;width:79px;height:14px;"]').text();
				// 	self.lotSize = $('div[style="top:399px;left:150px;width:221px;height:14px;"]').text();
				// 	self.bcaDescription = $('div[style="top:441px;left:150px;width:221px;height:14px;"]').text();
				// 	self.bcaDataUpdateDate = $('div[style="top:469px;left:150px;width:221px;height:14px;"]').text();
				// }else{
				// 	self.planNum = $('div[style="top:303px;left:0px;width:79px;height:14px;"]').text();
				// 	self.lotSize = $('div[style="top:360px;left:150px;width:221px;height:14px;"]').text();
				// 	self.bcaDescription = $('div[style="top:402px;left:150px;width:221px;height:14px;"]').text();
				// 	self.bcaWaterConn = $('div[style="top:430px;left:0px;width:144px;height:14px;"]').text();
				// 	if(self.bcaWaterConn == 'WaterConn'){
				// 		self.bcaDataUpdateDate = $('div[style="top:444px;left:150px;width:221px;height:14px;"]').text();
				// 		self.landValue = $('div[style="top:590px;left:0px;width:246px;height:14px;"]').text();
				// 		self.improvementValue = $('div[style="top:590px;left:250px;width:246px;height:14px;"]').text();
				// 		self.totalValue = $('div[style="top:590px;left:500px;width:246px;height:14px;"]').text();
				// 	}else{
				// 		self.bcaDataUpdateDate = $('div[style="top:430px;left:150px;width:221px;height:14px;"]').text();
				// 		self.landValue = $('div[style="top:576px;left:0px;width:246px;height:14px;"]').text();
				// 		self.improvementValue = $('div[style="top:576px;left:250px;width:246px;height:14px;"]').text();
				// 		self.totalValue = $('div[style="top:576px;left:500px;width:246px;height:14px;"]').text();
				// 	}
				// }

				self.landValue = $(`div[style="top:${ActualTotalsTopPosition}px;left:0px;width:246px;height:14px;"]`).text();
				self.improvementValue = $(`div[style="top:${ActualTotalsTopPosition}px;left:250px;width:246px;height:14px;"]`).text();
				self.totalValue = $(`div[style="top:${ActualTotalsTopPosition}px;left:500px;width:246px;height:14px;"]`).text();
				self.planNum = $(`div[style="top:${PlanNumTopPosition}px;left:0px;width:79px;height:14px;"]`).text();
				self.lotSize = $(`div[style="top:${LotSizeTopPosition}px;left:150px;width:221px;height:14px;"]`).text();
				self.bcaDescription = $(`div[style="top:${bcaDescriptionTopPosition}px;left:150px;width:221px;height:14px;"]`).text();
				self.bcaDataUpdateDate = $(`div[style="top:${bcaDataUpdateDateTopPosition}px;left:150px;width:221px;height:14px;"]`).text();

				break;
		}
	}
};

// start point:
$(function () {
	console.log('mls-taxdetails iFrame: ');
	taxDetails.init();
});
