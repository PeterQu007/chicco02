<div style="top:0px;left:0px;width:746px;height:17px;" id="" class="mls57">Detailed Tax Report           </div>

//mls-taxdetails.js legacy code:
var ActualTotalsTopPosition = $('div:contains("Actual Totals"):last').position().top + 38;
console.log("ActualTotalsTopPosition: ", ActualTotalsTopPosition);
var PlanNumTopPosition = $('div:contains("PlanNum"):last').position().top + 20;
var LotSizeTopPosition = $('div:contains("Lot Size"):last').position().top;
var bcaDescriptionTopPosition = $('div:contains("BCA Description"):last').position().top;
var bcaDataUpdateDateTopPosition = $('div:contains("BCAData Update"):last').position().top;

switch (self.houseType) {
			case 'Attached':
				// got Actual Totals
							
				// self.landValue = $(`div[style="top:${ActualTotalsTopPosition}px;left:0px;width:246px;height:14px;"]`).text();

				// console.log("land Value is: ", self.landValue);
				// self.improvementValue = $(`div[style="top:${ActualTotalsTopPosition}px;left:250px;width:246px;height:14px;"]`).text();
				// self.totalValue = $(`div[style="top:${ActualTotalsTopPosition}px;left:500px;width:246px;height:14px;"]`).text();
				var x1 = $("div." + assessClass);
				self.landValue = x1[0].innerText;
				self.improvementValue=x1[1].innerText;
				self.totalValue=x1[2].innerText;
				
				// got plan number
			
				// self.planNum = $(`div[style="top:${PlanNumTopPosition}px;left:0px;width:79px;height:14px;"]`).text();
				// self.lotSize = $(`div[style="top:${LotSizeTopPosition}px;left:150px;width:221px;height:14px;"]`).text();
				// self.bcaDescription = $(`div[style="top:${bcaDescriptionTopPosition}px;left:150px;width:221px;height:14px;"]`).text();
				// self.bcaDataUpdateDate = $(`div[style="top:${bcaDataUpdateDateTopPosition}px;left:150px;width:221px;height:14px;"]`).text();

				var x2 = $("div." + planNumClass);
				self.planNum = x2[1].textContent;

				var x3 = $("div." + otherFieldsClass);
				self.lotSize = x3[17].textContent; //lotSize Field Index: 17
				self.bcaDescription = x3[24].textContent; //BCA Description Field Index: 24
				self.bcaDataUpdateDate = x3[28].textContent; //BCAData Update: 28

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