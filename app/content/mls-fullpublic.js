//custom full public report

import legalDescription from '../assets/scripts/modules/LegalDescription';


//console.log("full public script activated now: ");

var fullpublic = {

	init: function () {
		console.log("full public script loaded!");
		console.log(this.lp, this.sp);

		this.events();

		this.bcAssess.addClass(this.lp.attr('class'));
		var divBC = $('<div style="top:111px;left:703px;width:53px;height:14px;text-align: left;">(BC2016)</div>');
		var banner = $('<div id="peterqu" style="z-index: 999; height:88px; position:absolute; top: 2px; padding-right:0px; padding-left:0px; padding-top:0px; padding-bottom:0px; left:0px; width: 766px"></div>');
		divBC.addClass(this.lpSuffix.attr('class'));
		divBC.insertAfter(this.bcAssess);
		this.bcAssess.animate({ left: '575px', width: '127px' }).css("text-align", "left");
		this.addBanner(banner);
		if (this.language.is(':checked')) {
			this.translate();
		};

		this.calculateSFPrice();
		this.searchTax();

	},

	calculateSFPrice: function () {

		console.log(this.lp.text(), this.sp.text(), this.finishedFloorArea.text());
		var listPrice = convertStringToDecimal(this.lp.text());
		var soldPrice = convertStringToDecimal(this.sp.text());
		var FinishedFloorArea = convertStringToDecimal(this.finishedFloorArea.text());
		var sfPriceList = listPrice / FinishedFloorArea;
		var sfPriceSold = soldPrice / FinishedFloorArea;

		this.lp.animate({ left: '575px', width: '127px' }).css("text-align", "left");;
		this.lp.text( this.lp.text() + ' [$' + sfPriceList.toFixed(0) + '/sf]');
		if (sfPriceSold > 0) {
			this.sp.animate({ left: '575px', width: '127px' }).css("text-align", "left");;
			this.sp.text( this.sp.text() + ' [$' + sfPriceSold.toFixed(0) + '/sf]');
		}
	},

	searchTax: function () {

		var PID = this.pid.text();

		if (!PID) { return; };

		chrome.storage.sync.set({ 'PID': PID });

		chrome.storage.sync.get('PID', function (result) {

			console.log(result.PID);

			chrome.runtime.sendMessage(

				{ from: 'ListingReport', todo: 'taxSearch' },

				function (response) {

					console.log('mls-fullpublic got response:', response);

				}
			)
		});

	},

	addBanner: function (banner) {

		var img = $('<img src="http://localhost/chromex/mlshelper/app/assets/images/banner4.jpg">');
		img.appendTo(banner);
		banner.appendTo($('div#divHtmlReport'));
	},

	events: function () {

		(function onEvents(self) {

			chrome.storage.onChanged.addListener(function (changes, area) {
				if (area == "sync" && "_id" in changes) {
					console.log("this:", self);
					var listPrice = convertStringToDecimal(self.lp.text());
					var soldPrice = convertStringToDecimal(self.sp.text());

					chrome.storage.sync.get(['totalValue','improvementValue','landValue'], function (result) {
						var totalValue = result.totalValue;
						var improvementValue = result.improvementValue;
						var landValue = result.landValue;
						console.log("mls-fullpublic got total bc assessment: ", landValue, improvementValue, totalValue);

						self.bcAssess.text(totalValue);

						if (soldPrice > 0 && totalValue != 0) {

							var intTotalValue = convertStringToDecimal(totalValue);
							var changeValue = soldPrice - intTotalValue;
							var changeValuePercent = changeValue / intTotalValue * 100;

						} else if (totalValue != 0) {
							var intTotalValue = convertStringToDecimal(totalValue);
							var changeValue = listPrice - intTotalValue;
							var changeValuePercent = changeValue / intTotalValue * 100;

						}

						self.bcAssess.text(removeDecimalFraction(self.bcAssess.text()) + " [ " + changeValuePercent.toFixed(0).toString() + '% ]   ');


					})

				}

				if (area == "sync" && "curTabID" in changes) {

					if (changes.curTabID.newValue) {

						if (changes.curTabID.oldValue) {
							//remove the old style of the div
							var oldTabID = changes.curTabID.oldValue;
							console.log("mls-fullrealtor: my old tab ID is: ", oldTabID);

							var oldDivTab = $('div' + oldTabID, top.document);

							oldDivTab.removeAttr("style");

						}

						curTabID = changes.curTabID.newValue;
						console.log("mls-fullrealtor: my tab ID is: ", curTabID);

						var divTab = $('div' + curTabID, top.document);
						var divTab1 = $('div#tab1', top.document);
						console.log(divTab);

						divTab.attr("style", "display: block!important");
						divTab1.attr("style", "display: none!important");

					}
				}
			});

		})(this);


	},

	lp: $('div[style="top:129px;left:555px;width:147px;height:13px;"]'),
	sp: $('div[style="top:147px;left:555px;width:147px;height:15px;"]'),
	lpSuffix: $('div[style="top:129px;left:703px;width:23px;height:14px;"]'),
	bcAssess: $('div[style="top:111px;left:578px;width:147px;height:16px;"]'),
	finishedFloorArea: $('div[style="top:804px;left:120px;width:50px;height:16px;"]'),
	totalFinishedFloorArea: $('div[style="top:840px;left:120px;width:50px;height:12px;"]'),
	pid: $('div[style="top:283px;left:637px;width:82px;height:15px;"]'),
	complex: $('div[style="top:341px;left:393px;width:369px;height:13px;"]'),
	strataFee: $('div[style="top:267px;left:530px;width:67px;height:13px;"]'),
	exposure: $('div[style="top:261px;left:376px;width:68px;height:13px;"]'),
	age: $('div[style="top:203px;left:698px;width:65px;height:13px;"]'),
	year: $('div[style="top:187px;left:698px;width:39px;height:13px;"]'),
	tax: $('div[style="top:235px;left:698px;width:65px;height:13px;"]'),
	title: $('div[style="top:444px;left:440px;width:321px;height:13px;"]'),
	keyword: $('div#app_banner_links_left input.select2-search__field', top.document),
	language: $('div#reportlanguage input', top.document),

	cnSoldDate: $('div[style="top:170px;left:289px;width:59px;height:16px;"]'),
	cnFrontageFeet: $('div[style="top:171px;left:451px;width:87px;height:13px;"]'),
	cnFrontageMeters: $('div[style="top:187px;left:451px;width:98px;height:16px;"]'),
	cnDepth: $('div[style="top:199px;left:289px;width:89px;height:13px;"]'),
	cnLotArea: $('div[style="top:214px;left:289px;width:88px;height:17px;"]'),
	cnFloodPlain: $('div[style="top:230px;left:289px;width:79px;height:13px;"]'),
	cnApprovalReq: $('div[style="top:246px;left:289px;width:77px;height:16px;"]'),
	cnNewGST: $('div[style="top:277px;left:289px;width:110px;height:14px;"]'),
	cnTaxIncUtilities: $('div[style="top:267px;left:603px;width:90px;height:14px;"]'),
	cnZoning: $('div[style="top:219px;left:603px;width:43px;height:15px;"]'),
	cnServiceConnected: $('div[style="top:357px;left:289px;width:105px;height:15px;"]'),
	cnMeasType: $('div[style="top:184px;left:289px;width:76px;height:15px;"]'),
	cnStrataFee: $('div[style="top:267px;left:451px;width:61px;height:14px;"]'),
	cnGrossTaxes: $('div[style="top:235px;left:603px;width:71px;height:13px;"]'),
	cnFinishedFloor: $('div[style="top:804px;left:3px;width:111px;height:16px;"]'),
	cnTotalFinishedFloor: $('div[style="top:840px;left:3px;width:112px;height:12px;"]'),
	cnRestrictedAge: $('div[style="top:780px;left:210px;width:74px;height:12px;"]'),
	cnForTaxYear: $('div[style="top:251px;left:603px;width:81px;height:15px;"]'),//$('div[style=""]'),
	cnAge: $('div[style="top:203px;left:603px;width:27px;height:14px;"]'),
	cnYearBuilt: $('div[style="top:187px;left:603px;width:97px;height:15px;"]'),
	cnOriginalPrice: $('div[style="top:171px;left:603px;width:76px;height:15px;"]'),
	cnBedrooms: $('div[style="top:203px;left:451px;width:75px;height:16px;"]'),
	cnBathrooms: $('div[style="top:219px;left:451px;width:77px;height:15px;"]'),
	cnFullBaths: $('div[style="top:235px;left:451px;width:55px;height:15px;"]'),
	cnHalfBaths: $('div[style="top:251px;left:451px;width:55px;height:13px;"]'),
	cnExposure: $('div[style="top:261px;left:289px;width:79px;height:15px;"]'),
	cnComplex: $('div[style="top:341px;left:289px;width:93px;height:14px;"]'),
	cnMgmtName: $('div[style="top:293px;left:289px;width:96px;height:17px;"]'),
	cnMgmtPhone: $('div[style="top:309px;left:289px;width:95px;height:17px;"]'),
	cnView: $('div[style="top:325px;left:289px;width:77px;height:13px;"]'),

	cnTotalParking: $('div[style="top:384px;left:367px;width:73px;height:12px;"]'),
	cnParking: $('div[style="top:396px;left:367px;width:43px;height:12px;"]'),
	cnCoveredParking: $('div[style="top:384px;left:458px;width:82px;height:16px;"]'),
	cnParkingAccess: $('div[style="top:384px;left:565px;width:76px;height:15px;"]'),
	cnDistToPublicTransit: $('div[style="top:420px;left:367px;width:99px;height:12px;"]'),
	cnDistToSchoolBus: $('div[style="top:420px;left:565px;width:89px;height:14px;"]'),
	cnUnitInDevelopment: $('div[style="top:432px;left:367px;width:101px;height:15px;"]'),
	cnTotalUnitsInStrata: $('div[style="top:432px;left:565px;width:96px;height:15px;"]'),
	cnLocker: $('div[style="top:408px;left:565px;width:40px;height:12px;"]'),
	cnTitleToLand: $('div[style="top:444px;left:367px;width:63px;height:12px;"]'),
	cnPropertyDisc: $('div[style="top:468px;left:367px;width:72px;height:14px;"]'),
	cnFixturesLeased: $('div[style="top:480px;left:367px;width:74px;height:15px;"]'),
	cnFixturesRmvd: $('div[style="top:492px;left:367px;width:72px;height:13px;"]'),
	cnFloorFinish: $('div[style="top:504px;left:367px;width:61px;height:14px;"]'),

	cnRooms: $('div[style="top:756px;left:210px;width:60px;height:12px;"]'),
	cnKitchens: $('div[style="top:756px;left:293px;width:66px;height:16px;"]'),
	cnLevels: $('div[style="top:756px;left:386px;width:56px;height:12px;"]'),
	cnPets: $('div[style="top:792px;left:210px;width:51px;height:14px;"]'),
	cnCats: $('div[style="top:792px;left:299px;width:30px;height:13px;"]'),
	cnDogs: $('div[style="top:792px;left:366px;width:42px;height:13px;"]'),
	cnBylawRestric: $('div[style="top:816px;left:210px;width:65px;height:13px;"]'),
	cnRentalsAllowed: $('div[style="top:804px;left:210px;width:125px;height:14px;"]'),
	cnCrawHeight: $('div[style="top:768px;left:210px;width:92px;height:15px;"]'),
	cnBasement: $('div[style="top:840px;left:210px;width:57px;height:14px;"]'),

	cnMaintFeeInc: $('div[style="top:520px;left:3px;width:74px;height:14px;"]'),
	cnLegal: $('div[style="top:532px;left:3px;width:33px;height:16px;"]'),
	cnAmenities: $('div[style="top:556px;left:3px;width:53px;height:15px;"]'),
	cnSiteInfluences: $('div[style="top:580px;left:3px;width:71px;height:14px;"]'),
	cnFeatures: $('div[style="top:591px;left:3px;width:46px;height:12px;"]'),

	cnStyleOfHome: $('div[style="top:384px;left:3px;width:69px;height:13px;"]'),
	cnConstruction: $('div[style="top:396px;left:3px;width:62px;height:12px;"]'),
	cnExterior: $('div[style="top:408px;left:3px;width:43px;height:12px;"]'),
	cnFoundation: $('div[style="top:420px;left:3px;width:64px;height:14px;"]'),
	cnRainScreen: $('div[style="top:432px;left:3px;width:59px;height:12px;"]'),
	cnRenovation: $('div[style="top:444px;left:3px;width:60px;height:12px;"]'),
	cnWaterSupply: $('div[style="top:456px;left:3px;width:72px;height:14px;"]'),
	cnFirePlaceFuel: $('div[style="top:468px;left:3px;width:69px;height:13px;"]'),
	cnFuelHeating: $('div[style="top:480px;left:3px;width:61px;height:12px;"]'),
	cnOutdoorArea: $('div[style="top:492px;left:3px;width:70px;height:13px;"]'),
	cnTypeOfRoof: $('div[style="top:504px;left:3px;width:64px;height:12px;"]'),
	cnRenoYear: $('div[style="top:420px;left:259px;width:60px;height:12px;"]'),
	cnRIPlumbing: $('div[style="top:432px;left:259px;width:65px;height:12px;"]'),
	cnRIFireplaces: $('div[style="top:444px;left:259px;width:71px;height:12px;"]'),
	cnNumOfFirePlaces: $('div[style="top:456px;left:259px;width:70px;height:13px;"]'),

	cnFloor: $('div[style="top:616px;left:3px;width:28px;height:15px;"]'),
	cnType: $('div[style="top:616px;left:65px;width:32px;height:15px;"]'),
	cnDimensions: $('div[style="top:616px;left:182px;width:58px;height:16px;"]'),
	cnFloor2: $('div[style="top:616px;left:250px;width:39px;height:15px;"]'),
	cnType2: $('div[style="top:616px;left:328px;width:28px;height:15px;"]'),
	cnDimensions2: $('div[style="top:616px;left:435px;width:64px;height:17px;"]'),
	cnFloor3: $('div[style="top:616px;left:510px;width:37px;height:16px;"]'),
	cnType3: $('div[style="top:616px;left:577px;width:40px;height:19px;"]'),
	cnDimensions3: $('div[style="top:616px;left:695px;width:58px;height:17px;"]'),
	cnBath: $('div[style="top:754px;left:470px;width:30px;height:15px;"]'),
	cnFloor4: $('div[style="top:754px;left:509px;width:25px;height:15px;"]'),
	cnNumOfPieces: $('div[style="top:754px;left:543px;width:54px;height:13px;"]'),
	cnEnsuite: $('div[style="top:754px;left:603px;width:40px;height:16px;"]'),
	cnFinishedFloorMain: $('div[style="top:756px;left:3px;width:105px;height:14px;"]'),
	cnFinishedFloorAbove: $('div[style="top:768px;left:3px;width:115px;height:13px;"]'),
	cnFinishedFloorBelow: $('div[style="top:780px;left:3px;width:112px;height:16px;"]'),
	cnFinishedFloorBasement: $('div[style="top:792px;left:3px;width:125px;height:15px;"]'),
	cnUnfinishedFloor: $('div[style="top:828px;left:3px;width:109px;height:14px;"]'),
	//$('div[style=""]'),
	cnBCAssess: $('<div id="lblBCAssess" style="top: 111px; left: 525px; width: 50px; height: 16px; text-align: left;">政府估價:</div>'),
	cnListingPrice: $('<div id="lblBCAssess" style="top: 129px; left: 525px; width: 50px; height: 16px; text-align: left;">挂牌價格:</div>'),
	cnSoldPrice: $('<div id="lblBCAssess" style="top: 147px; left: 525px; width: 50px; height: 16px; text-align: left;">成交價格:</div>'),

	translate: function () {

		this.cnStrataFee.css("text-decoration", "underline").text('月管理費：');
		this.cnGrossTaxes.css("text-decoration", "underline").text('地稅金額：');
		var squareMeters = convertUnit(this.finishedFloorArea.text());
		var totalSquareMeters = convertUnit(this.totalFinishedFloorArea.text());

		this.cnFinishedFloor.text('室内面積：(' + squareMeters.toString() + ' M2)').css("text-decoration: underline");
		this.cnTotalFinishedFloor.text('縂面積：(' + totalSquareMeters.toString() + ' M2)').css("text-decoration: underline");

		this.cnFinishedFloor.addClass(this.finishedFloorArea.attr('class'));
		this.cnTotalFinishedFloor.addClass(this.totalFinishedFloorArea.attr('class'));

		this.cnRestrictedAge.css("text-decoration", "underline").text('年齡限制：');
		this.cnSoldDate.text('銷售日期:');
		this.cnFrontageFeet.text('');
		this.cnFrontageMeters.text('');
		this.cnDepth.text('');
		this.cnLotArea.text('宅地面積:');
		this.cnFloodPlain.text('是否泄洪區:');
		this.cnApprovalReq.text('是否審批:');
		this.cnNewGST.text('是否含稅:');
		this.cnTaxIncUtilities.text('地稅是否含水費:');
		this.cnZoning.text('規劃碼:');
		this.cnServiceConnected.text('公用服務:');
		this.cnMeasType.text('測量單位:');
		this.cnForTaxYear.text('納稅年度：');
		this.cnAge.css("text-decoration", "underline").text('樓齡: ');
		this.cnYearBuilt.text('建造年份：');
		this.cnOriginalPrice.text('挂牌價格：');
		this.cnBedrooms.css("text-decoration", "underline").text('臥室數：');
		this.cnBathrooms.text('衛生間：');
		this.cnFullBaths.css("text-decoration", "underline").text('全衛：');
		this.cnHalfBaths.text('半衛：');
		this.cnExposure.css("text-decoration", "underline").text('朝向：');
		this.cnComplex.text('小區名稱：');
		this.cnMgmtName.text('管理公司名稱：');
		this.cnMgmtPhone.text('管理公司電話：');
		this.cnView.text('是否有風景：');

		this.cnTotalParking.css("text-decoration", "underline").text('停車位:').css("text-decoration", "underline!important");
		this.cnParking.text('停車場:').css("text-decoration: underline");
		this.cnCoveredParking.css("text-decoration", "underline").text('室内停車位:');
		this.cnParkingAccess.text('停車場入口:');
		this.cnDistToPublicTransit.text('公交距離:');
		this.cnDistToSchoolBus.text('校車距離:');
		this.cnUnitInDevelopment.text('本期開發數量:');
		this.cnTotalUnitsInStrata.text('小區單位數量:');
		this.cnPropertyDisc.text('物業披露書:');
		this.cnFixturesLeased.text('租賃設備:');
		this.cnFixturesRmvd.text('拆卸設備:');
		this.cnFloorFinish.text('地板材料:');
		this.cnLocker.text('儲物間:').css("text-decoration: underline");
		this.cnTitleToLand.css("text-decoration", "underline").text('物業產權:').css("text-decoration: underline");

		this.cnRooms.text('房間數:');
		this.cnKitchens.text('厨房數:');
		this.cnLevels.text('樓層數:');
		this.cnCrawHeight.text('--------');
		this.cnPets.text('寵物數:');
		this.cnCats.text('貓:');
		this.cnDogs.text('狗:');
		this.cnBylawRestric.text('物管限制:');
		this.cnRentalsAllowed.text('出租單位數量/比例:');
		this.cnBasement.text('地下室: ');

		this.cnMaintFeeInc.text('管理費包含：');
		this.cnLegal.text('法編: ');
		this.cnAmenities.text('附屬設施: ');
		this.cnSiteInfluences.text('位置特點: ');
		this.cnFeatures.text('室内設施: ');

		this.cnStyleOfHome.text('建築風格:');
		this.cnConstruction.text('建築結構:');
		this.cnExterior.text('外墻: ');
		this.cnFoundation.text('基礎: ');
		this.cnRainScreen.text('隔雨層:');
		this.cnRenovation.text('新裝修項目:');
		this.cnWaterSupply.text('供水系統:');
		this.cnFirePlaceFuel.text('壁爐熱源:');
		this.cnFuelHeating.text('供暖系統:');
		this.cnOutdoorArea.text('室外區域:');
		this.cnTypeOfRoof.text('屋頂材料:');
		this.cnRenoYear.text('裝修年份:');
		this.cnRIFireplaces.text('壁爐預設:');
		this.cnRIPlumbing.text('管道預設:');
		this.cnNumOfFirePlaces.text('壁爐數量:');

		this.cnFloor.text('樓層');
		this.cnFloor2.text('樓層');
		this.cnFloor3.text('樓層');
		this.cnFloor4.text('樓層');
		this.cnType.animate({ width: '60px' }).text('房間類別');
		this.cnType2.animate({ width: '60px' }).text('房間類別');
		this.cnType3.animate({ width: '60px' }).text('房間類別');
		this.cnDimensions.text('房間大小');
		this.cnDimensions2.text('房間大小');
		this.cnDimensions3.text('房間大小');
		this.cnBath.text('衛生間');
		this.cnNumOfPieces.text('套件數');
		this.cnEnsuite.text('套房？');

		this.cnFinishedFloorMain.text('裝修面積（主層）: ');
		this.cnFinishedFloorAbove.text('裝修面積（二樓）:');
		this.cnFinishedFloorBelow.text('裝修面積（一樓）:');
		this.cnFinishedFloorBasement.text('裝修面積（地下室）:');
		this.cnUnfinishedFloor.text('未裝修面積: ');

		this.cnBCAssess.addClass(this.bcAssess.attr('class')).insertBefore(this.bcAssess);
		this.cnListingPrice.addClass(this.lp.attr('class')).insertBefore(this.lp);
		this.cnSoldPrice.addClass(this.sp.attr('class')).insertBefore(this.sp);
	}
};

//fullpublic startpoint
//document.addEventListener("DOMContentLoaded", function(){
$(function () {

	fullpublic.init();

})

function convertStringToDecimal(strNum) {

	var result = 0,
		numbers = '';

	strNum = strNum.replace(/,/g, '');
	//remove the fraction
	strNum = strNum.substring(0, strNum.indexOf('.') == -1 ? strNum.length : strNum.indexOf('.'));
	//remove the [] 
	strNum = strNum.substring(0, strNum.indexOf('[') == -1 ? strNum.length : strNum.indexOf('['));
	//remove the unit

	for (var i = 0, len = strNum.length; i < len; ++i) {

		if (!isNaN(strNum[i])) {
			numbers += strNum[i];
		}
	}

	result = Number(numbers);
	return result.toFixed(0);
}

function removeDecimalFraction(strNum) {

	var result = 0,

		//remove the fraction
		result = strNum.substring(0, strNum.indexOf('.') == -1 ? strNum.length : strNum.indexOf('.'));

	return result;
}


function convertUnit(sf) {

	sf = convertStringToDecimal(sf);
	var result = parseInt(sf) / 10.76;
	return result.toFixed(1);
}

//});

