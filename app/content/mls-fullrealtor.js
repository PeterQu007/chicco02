'use strict'

import legalDescription from '../assets/scripts/modules/LegalDescription';
import addressInfo from '../assets/scripts/modules/AddressInfo';

var curTabID = null;
var topPosition = 7;
var houseType = $('div[style="top:32px;left:46px;width:61px;height:14px;"]');

// get the currently selected Chrome tab
var getCurrentTab = function () {
	chrome.storage.sync.set({ 'curTabID': curTabID });
	chrome.runtime.sendMessage(
		{ todo: 'readCurTabID', from: 'mls-fullrealtor' },
		function (response) {
			console.log('current Tab ID is: ', response);
		}
	)
};

var setHouseType = function (houseType) {
	chrome.storage.sync.set({ 'houseType': houseType });
	console.log('current House Type is: ', houseType);
}

var getToday = function () {
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth() + 1; //January is 0!
	var yyyy = today.getFullYear();
	if (dd < 10) {
		dd = '0' + dd
	}
	if (mm < 10) {
		mm = '0' + mm
	}
	today = yyyy + mm + dd;
	return today;
};

var fullrealtor = {

	init: function () {
		getCurrentTab();
		this.clearAssess();
		this.houseListingType = this.houseType.text().replace(',', '').replace(' ', '');
		setHouseType(this.houseListingType);
		this.getMorePropertyInfo(); //get pid, complex, lotArea, etc.
		this.calculateSFPrice();
		this.addMLSNo();
		this.addStrataPlan();
		this.addBCAssessment();
		this.addRemarks();
		this.addShowingInfo();
		this.addDataEvents();
		this.searchTax();
		this.addComplexInfo();
		this.addStrataEvents();
		this.addComplexEvent();
		this.searchStrataPlanSummary();
	},

	//elements on the page
	houseType: $('div[style="top:32px;left:46px;width:61px;height:14px;"]'),
	div: $('div.mls0'),
	lp: $('div[style="top:7px;left:571px;width:147px;height:13px;"]'),
	sp: $('div[style="top:23px;left:571px;width:147px;height:15px;"]'),
	lotArea: null,
	finishedFloorArea: $('div[style="top:698px;left:120px;width:50px;height:16px;"]'),
	report: $('div#divHtmlReport'),
	pid: null,
	complex: null, //complex name
	mlsNo: $('div[style="top:18px;left:4px;width:123px;height:13px;"] a'),
	legal: $('div[style="top:426px;left:75px;width:593px;height:24px;"]'),
	realtorRemarks: $('div[style="top:860px;left:53px;width:710px;height:35px;"]'),
	publicRemarks: $('div[style="top:897px;left:4px;width:758px;height:75px;"]'),
	keyword: $('div#app_banner_links_left input.select2-search__field', top.document),

	//complex info:
	address: $('div[style="top:4px;left:134px;width:481px;height:17px;"]'),
	houseListingType: null,
	subArea: $('div[style="top:20px;left:134px;width:480px;height:13px;"]'),
	neighborhood: $('div[style="top:33px;left:134px;width:479px;height:13px;"]'),
	postcode: $('div[style="top:46px;left:306px;width:130px;height:13px;"]'),
	dwellingType: $('div[style="top:46px;left:4px;width:137px;height:15px;"]'),
	totalUnits: null,
	devUnits: null,

	averagePrice: $('<div style="top:7px;left:471px;width:147px;height:13px;" id="averagePrice" class="mls18"></div>'),
	saveComplexButton: null,
	legalDesc: null,
	strataPlan: null, //new strataPlan field, to be added
	formalAddress: null, //new formal Address field, to be added
	strataPlanLink: null, //new strataPlan search link, to be added
	complexSummary: null, //new complex summary data, to be added
	bcAssess: null,
	bcLand: null,
	bcImprovement: null,
	bcLand2ImprovementRatio: null,
	valueChange: null,
	valueChangePercent: null,
	oldTimerLotValuePerSF: null,
	street: null,
	streetNumber: null,
	curTabID: null,

	getMorePropertyInfo: function () {
		var self = this;
		var listingHouseType = self.houseType.text().replace(',', '').replace(' ', '');
		switch (listingHouseType) {
			case 'Attached':
				self.pid = $('div[style="top:194px;left:355px;width:82px;height:15px;"]');
				self.complex = $('div[style="top:236px;left:381px;width:383px;height:14px;"]');
				self.totalUnits = $('div[style="top:326px;left:659px;width:101px;height:16px;"');
				self.devUnits = $('div[style="top:326px;left:470px;width:95px;height:15px;"');
				self.lotArea = $('div[style="top:129px;left:355px;width:75px;height:13px;"');
				break;
			case 'Detached':
				self.pid = $('div[style="top:198px;left:681px;width:82px;height:15px;"]');
				self.complex = $('div[style="top:229px;left:393px;width:369px;height:13px;"]');
				self.lotArea = $('div[style="top:133px;left:375px;width:67px;height:13px;"');
				self.devUnits = $('<div>1</div>');
				self.totalUnits = $('<div>1</div>');
				break;
		}
	},

	calculateSFPrice: function () {
		console.log(this.lp.text(), this.sp.text(), this.finishedFloorArea.text());
		var listPrice = convertStringToDecimal(this.lp.text());
		var soldPrice = convertStringToDecimal(this.sp.text());
		var finishedFloorArea = convertStringToDecimal(this.finishedFloorArea.text());
		var sfPriceList = listPrice / finishedFloorArea;
		var sfPriceSold = soldPrice / finishedFloorArea;

		this.lp.text(this.lp.text() + ' [$' + sfPriceList.toFixed(0) + '/sf]');
		if (sfPriceSold > 0) {
			this.sp.text(this.sp.text() + ' [$' + sfPriceSold.toFixed(0) + '/sf]');
		}
	},

	addMLSNo: function () {
		var newDivMLS = $('<div style="position: absolute; top:' + topPosition.toString() + 'px;left:771px;width:147px;height:13px;">MLS #</div>');
		newDivMLS.appendTo(this.report);
		var lineBreak = $('<br>');
		lineBreak.appendTo(this.report);
		topPosition += 13 + 1;
		var mlsNO = this.mlsNo.text();
		newDivMLS.text(mlsNO);
	},

	addStrataPlan: function () {
		var stylePosition = function (top, left, width, height) {
			var result = 'position: absolute;';
			result += 'top: ' + top.toString().trim() + 'px; ';
			result += 'left: ' + left.toString().trim() + 'px; ';
			result += 'width: ' + width.toString().trim() + 'px; ';
			result += 'height: ' + height.toString().trim() + 'px;';
			return result;
		};
		var legal = this.legal.text(); //get legal description from the Report
		var legalDesc = this.legalDesc = new legalDescription(legal);
		var complexName = this.complex.text();
		var newDivStrPlan = $('<div id="strataPlan" style="' + stylePosition(topPosition, 771, 147, 13) + '"></div>');
		topPosition += 13 + 1;
		var lineBreak = $('<br>');
		var strPlanLink = $('<a href="http://bcres.paragonrels.com/ParagonLS/Home/Page.mvc#HomeTab" target="HomeTab" id="strataPlanLink" ></a>');
		var formalAddress = $('<div id="formaladdress" style="' + stylePosition(topPosition, 771, 147, 13) + '"></div>');
		topPosition += 13 + 1;
		var complexSummary = $('<div id="complexSummary" style="' + stylePosition(topPosition, 771, 147, 13) + '">re:</div>');
		if (complexName) {
			complexSummary.text(complexName + ": ");
		}
		topPosition += 26 + 1;
		var complexNameInput = $('<input id="complexname" type="text" style="' + stylePosition(topPosition, 771, 147, 13) + '"><br>');
		topPosition += 24 + 1;
		//var saveComplexButton = $('<button id="savecomplex" type="button" style="position: absolute; top:' + topPosition.toString() + 'px;left:771px;width:80px;height:20px;">save</button>');
		var saveComplexButton = $('<button id="savecomplex" type="button" style="' + stylePosition(topPosition, 771, 80, 20) + '">save</button>');
		topPosition += 22 + 1;
		this.strataPlan = legalDesc.strataPlan1;
		strPlanLink.text(legalDesc.strataPlan1);
		strPlanLink.appendTo(newDivStrPlan);
		newDivStrPlan.appendTo(this.report);
		lineBreak.appendTo(this.report);
		formalAddress.appendTo(this.report);
		lineBreak.appendTo(this.report);
		complexSummary.appendTo(this.report);
		lineBreak.appendTo(this.report);
		complexNameInput.appendTo(this.report);
		saveComplexButton.appendTo(this.report);
		lineBreak.appendTo(this.report);
		this.saveComplexButton = $('#savecomplex');
		this.strataPlanLink = $('#strataPlanLink');
		this.complexSummary = $('#complexSummary');
		this.formalAddress = $('#formaladdress');

		chrome.storage.sync.set({
			strataPlan1: legalDesc.strataPlan1,
			strataPlan2: legalDesc.strataPlan2,
			strataPlan3: legalDesc.strataPlan3,
			strataPlan4: legalDesc.strataPlan4
		});
	},

	addComplexInfo: function (complexname) {
		var self = this;
		var subArea = self.subArea.text();
		var neighborhood = self.neighborhood.text();
		var postcode = self.postcode.text();
		var dwellingType = self.dwellingType.text();
		var complexName = complexname || self.complex.text().trim();
		var address = new addressInfo(self.address.text(), this.houseListingType); //todo list...
		var strataPlan = self.strataPlan;
		var totalUnits = self.totalUnits.text();
		var devUnits = self.devUnits.text();

		var complexInfo = {

			_id: strataPlan + '-' + address.streetNumber + '-' + address.streetName + '-' + address.streetType,
			name: complexName,
			strataPlan: strataPlan,
			addDate: getToday(),
			subArea: subArea,
			neighborhood: neighborhood,
			postcode: postcode,
			streetNumber: address.streetNumber,
			streetName: address.streetName + address.streetType,
			dwellingType: dwellingType,
			totalUnits: totalUnits,
			devUnits: devUnits,
			todo: 'searchComplex'

		}
		if (complexName.length > 0) {
			complexInfo.todo = 'saveComplex';
			//chrome.runtime.send
		};

		console.log('===>add ComplexInfo: ', complexInfo);
		chrome.runtime.sendMessage(
			complexInfo,
			function (response) {
				if (response) {
					self.complex.text(response);
					self.complexSummary.text(response);
				}
			}
		)
	},

	addBCAssessment: function () {

		//get bc assessment
		var newDivLandValue = $('<div id="landValue" style="position: absolute; top:' + topPosition.toString() + 'px;left:771px;width:147px;height:13px;"></div>');
		topPosition += 13 + 1;
		var newDivImprovementValue = $('<div id="improvementValue" style="position: absolute; top:' + topPosition.toString() + 'px;left:771px;width:147px;height:13px;"></div>');
		topPosition += 13 + 1;
		var newDivL2IRatio = $('<div id="land2improvementratio" style="position: absolute; top:' + topPosition.toString() + 'px;left:771px;width:147px;height:13px;"></div>');
		topPosition += 13 + 1;
		var newDivTotalValue = $('<div id="totalValue" style="position: absolute; top:' + topPosition.toString() + 'px;left:771px;width:147px;height:13px;"></div>');
		topPosition += 13 + 1;

		var newDivValueChange = $('<div id="changeValue" style="position: absolute; top:' + topPosition.toString() + 'px;left:771px;width:147px;height:13px;"></div>');
		topPosition += 13 + 1;
		var newOldTimerLotValuePerSF = $('<div id="oldtimerlotvaluepersf" style="position: absolute; top:' + topPosition.toString() + 'px;left:771px;width:147px;height:13px;"></div>');
		topPosition += 13 + 1;
		var newDivValueChangePercent = $('<div id="changeValuePercent" style="position: absolute; top:' + topPosition.toString() + 'px;left:771px;width:147px;height:13px;"></div>');
		topPosition += 13 + 1;
		newDivLandValue.appendTo(this.report);
		newDivImprovementValue.appendTo(this.report);
		newDivL2IRatio.appendTo(this.report);
		newDivTotalValue.appendTo(this.report);
		newDivValueChange.appendTo(this.report);
		newOldTimerLotValuePerSF.appendTo(this.report);
		newDivValueChangePercent.appendTo(this.report);

		this.bcAssess = $("#totalValue");
		this.bcLand = $("#landValue");
		this.bcImprovement = $("#improvementValue");
		this.bcLand2ImprovementRatio = $('#land2improvementratio');
		this.valueChange = $("#changeValue");
		this.valueChangePercent = $("#changeValuePercent");
		this.oldTimerLotValuePerSF = $('#oldtimerlotvaluepersf');
	},

	addRemarks: function () {

		//get realtor remarks

		var realtorRemarks = this.realtorRemarks.text();
		var newDivRealtorRemarks = $('<div style = "position: absolute; top:' + topPosition.toString() + 'px;left:771px;width:160px;height:130px;"></div>');
		newDivRealtorRemarks.text(realtorRemarks);
		newDivRealtorRemarks.appendTo(this.report);
		topPosition += 130 + 1;
		//get public remarks

		var publicRemarks = this.publicRemarks.text();
		var newDivPublicRemarks = $('<div style = "position: absolute; top:' + topPosition.toString() + 'px;left:771px;width:160px;height:150px;"></div>');
		newDivPublicRemarks.text(publicRemarks);

		highlight_words(this.keyword.val(), newDivPublicRemarks);

		newDivPublicRemarks.appendTo(this.report);
		topPosition += 300 + 1;

	},

	addShowingInfo: function () {
		var stylePosition = function (top, left, width, height) {
			var result = 'position: absolute;';
			result += 'top: ' + top.toString().trim() + 'px; ';
			result += 'left: ' + left.toString().trim() + 'px; ';
			result += 'width: ' + width.toString().trim() + 'px; ';
			result += 'height: ' + height.toString().trim() + 'px;';
			topPosition += height + 13;
			return result;
		};

		var newDivShowingInfo = $('<div id="showinginfo" style="' + stylePosition(topPosition, 771, 147, 13) + '">Showing Info:</div>');
		//topPosition += 13 + 1;
		var lineBreak = $('<br>');
		var clientNameInput = $('<input id="clientname" type="text" style="' + stylePosition(topPosition, 771, 147, 13) + '"><br>');
		//topPosition += 13 + 1;
		var requestMethod = $('<input id="requestmethod" type="text" style="' + stylePosition(topPosition, 771, 147, 13) + '"><br>');
		//topPosition += 13 +1;
		var showingDate = $('<input id="showingdate" type="text" style="' + stylePosition(topPosition, 771, 147, 13) + '"><br>');
		//topPosition += 13 +1;
		var showingTime = $('<input id="showingtime" type="text" style="' + stylePosition(topPosition, 771, 147, 13) + '"><br>');
		//topPosition += 13 +1;
		//var saveComplexButton = $('<button id="savecomplex" type="button" style="position: absolute; top:' + topPosition.toString() + 'px;left:771px;width:80px;height:20px;">save</button>');
		var saveShowingButton = $('<button id="saveshowing" type="button" style="' + stylePosition(topPosition, 771, 60, 20) + '">save</button>');
		//topPosition += 22 + 1;
		newDivShowingInfo.appendTo(this.report);
		lineBreak.appendTo(this.report);
		clientNameInput.appendTo(this.report);
		lineBreak.appendTo(this.report);
		requestMethod.appendTo(this.report);
		showingDate.appendTo(this.report);
		showingTime.appendTo(this.report);
		lineBreak.appendTo(this.report);
		saveShowingButton.appendTo(this.report);
		this.saveShowingButton = $('#savecomplex');
	},

	searchTax: function () {
		var PID = this.pid.text();
		var self = this;
		if (!PID) { return; };
		chrome.storage.sync.set({ 'PID': PID });
		chrome.storage.sync.get('PID', function (result) {
			console.log(">>>PID saved for tax search: ", result.PID);
			chrome.runtime.sendMessage(
				{ from: 'ListingReport', todo: 'taxSearch' },
				function (response) {
					console.log('>>>mls-fullpublic got tax response:', response);
				}
			)
		});
	},

	searchStrataPlanSummary: function () {

		console.log('mls-fullrealtor.search strataPlanSummary listings: ');
		var strataPlan = this.legalDesc.strataPlan1;
		var complexName = this.complex.text();
		chrome.storage.sync.set({ 'strataPlan': strataPlan, 'complexName': complexName }, function (e) {
			console.log('mls-fullrealtor.searchComplex.callback parameters: ', e);
			chrome.runtime.sendMessage(

				{ from: 'ListingReport', todo: 'searchStrataPlanSummary', showResult: true, saveResult: true },

				function (response) {

					console.log('mls-fullrealtor got search strataPlanSummary response: ', response);

				}
			)
		});
	},

	addStrataEvents: function () {

		var self = this;

		this.strataPlanLink.click(function (e) {

			e.preventDefault();
			var homeTab = $('#HomeTabLink', top.document);
			homeTab[0].click();
			console.log("strata plan Link Clicked!");
			var mlsDateLow = $("#f_33_Low__1-2-3-4");
			var mlsDateHigh = $("#f_33_High__1-2-3-4");
			var divTab = $('div' + curTabID, top.document);
			console.log(divTab);
			divTab.removeAttr("style");

			chrome.runtime.sendMessage(
				{ from: 'ListingReport', todo: 'switchTab', showResult: false, saveResult: true },

				function (response) {
					console.log('mls-fullrealtor got response: ', response);
				}
			)

		});
	},

	addComplexEvent: function () {
		(function event(self) {
			self.saveComplexButton.click(
				self.saveComplexInfo.bind(self)
			);

		})(this);
	},

	saveComplexInfo: function () {
		console.log('save button clicked!');
		var inputName = $('#complexname').val();
		if (inputName.length > 0) {
			this.addComplexInfo(inputName);
			this.complex.text(inputName + '*');
			this.complexSummary.text(inputName + '*');
		};

	},

	addDataEvents: function () {

		(function onEvents(self) {

			chrome.storage.onChanged.addListener(function (changes, area) {

				console.log("====>fullrealtor: got a message: !", changes);

				if (area == "sync" && "from" in changes) {

					if (changes.from.newValue.indexOf('assess') > -1) {
						self.updateAssess();
					};

					if (changes.from.newValue.indexOf('strataPlanSummary') > -1) {
						self.updateStrataPlanSummary(changes);
					}

					if (changes.from.newValue.indexOf('complex') > -1) {
						self.updateComplexInfo();
					}
					console.log("this: ", self);

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

	updateAssess: function () {

		var self = this;
		var listPrice = convertStringToDecimal(self.lp.text());
		var soldPrice = convertStringToDecimal(self.sp.text());

		chrome.storage.sync.get(['totalValue', 'improvementValue', 'landValue', 'lotSize', 'address', 'bcaDataUpdateDate'], function (result) {
			var totalValue = result.totalValue;
			var improvementValue = result.improvementValue;
			var landValue = result.landValue;
			var lotSize = result.lotSize;
			var lotArea = convertStringToDecimal(lotSize);
			var formalAddress = result.address.trim();
			var finishedFloorArea = convertStringToDecimal(self.finishedFloorArea.text());
			var intTotalValue = convertStringToDecimal(totalValue);
			var intImprovementValue = convertStringToDecimal(improvementValue);
			var intLandValue = convertStringToDecimal(landValue);
			var land2TotalRatio = (intLandValue / intTotalValue * 100).toFixed(1).toString() + '%L2T ';
			var house2TotalRatio = (intImprovementValue / intTotalValue * 100).toFixed(1).toString() + '%H2T ';
			var land2HouseRatio = (intLandValue / intImprovementValue).toFixed(1).toString() + 'L2H';
			var landValuePerSF = '';
			var houseValuePerSF = '';
			var olderTimerLotValuePerSF = '';
			var houseType = self.houseListingType;
			console.log("mls-fullpublic got total bc assessment: ", landValue, improvementValue, totalValue, lotArea);

			if (totalValue != 0) {
				if (soldPrice > 0) {
					var changeValue = soldPrice - intTotalValue;
					var changeValuePercent = changeValue / intTotalValue * 100;
				} else {
					var changeValue = listPrice - intTotalValue;
					var changeValuePercent = changeValue / intTotalValue * 100;
				}
			}
			if (houseType == 'Detached') {
				var lotAreaInSquareFeet = (lotArea<100? (lotArea * 43560).toFixed(0) : lotArea);
				landValuePerSF = '[ $' + (intLandValue / lotAreaInSquareFeet).toFixed(0).toString() + '/sf ]';
				console.log('landValue / lotArea', intLandValue, lotAreaInSquareFeet);
				houseValuePerSF = '[ $' + (intImprovementValue / finishedFloorArea).toFixed(0).toString() + '/sf ]';
				console.log('houseValue / finishedArea', intImprovementValue, finishedFloorArea);
				if(soldPrice > 0){
					var soldOldTimerPerSF = (soldPrice / lotAreaInSquareFeet).toFixed(0).toString();
					olderTimerLotValuePerSF = 'OT Lot/SF sold$'+ soldOldTimerPerSF + ' /bca$' + (intTotalValue / lotAreaInSquareFeet).toFixed(0).toString();
				}else{
					var listOldTimerPerSF = (listPrice / lotAreaInSquareFeet).toFixed(0).toString();
					olderTimerLotValuePerSF = 'OT Lot/SF list$'+ listOldTimerPerSF + ' /bca$' + (intTotalValue / lotAreaInSquareFeet).toFixed(0).toString();
				}
				
			}
			self.bcAssess.text('total:  ' + removeDecimalFraction(totalValue));
			self.bcLand.text('land:  ' + removeDecimalFraction(landValue) + landValuePerSF);
			self.bcImprovement.text('house:' + removeDecimalFraction(improvementValue) + houseValuePerSF);
			self.bcLand2ImprovementRatio.text(land2TotalRatio + house2TotalRatio + land2HouseRatio);
			self.valueChange.text("$" + numberWithCommas(changeValue.toFixed(0)) + " [ " + changeValuePercent.toFixed(0).toString() + '% ]   ');
			self.oldTimerLotValuePerSF.text(olderTimerLotValuePerSF);
			self.lotArea.text(numberWithCommas(convertStringToDecimal(lotSize, true)));
			self.formalAddress.text(formalAddress);
		})
	},

	clearAssess: function () {
		var self = this;
		chrome.storage.sync.set({
			'totalValue': '',
			'improvementValue': '',
			'landValue': '',
			'lotSize': '',
			'address': '',
			'bcaDataUpdateDate': ''
		}, function () {
			console.log("mls-fullpublic clear AssessInfo! ");
		})
	},

	updateStrataPlanSummary: function (changes) {
		var self = this;
		console.log("update strataPlanSummary:");
		chrome.storage.sync.get('count', function (result) {
			var complexName = (self.complex.text().length > 0 ? self.complex.text() : 'Complex');
			var summary = self.complex.text() + ': [ ' + result.count + ' ]';
			self.complexSummary.text(summary);
		})
	},

	updateComplexInfo: function () {
		var self = this;
		console.log('update Complex info:');
		chrome.storage.sync.get('complexName', function (result) {
			self.complex.text(result.complexName);
			self.complexSummary.text(result.complexName);
		})
	}
}

//star the app
$(function () {
	fullrealtor.init();
});

function getDecimalNumber(strNum) {

	var result = 0,
		numbers = '';

	strNum = strNum.replace(/,/g, '');
	//remove the fraction
	strNum = strNum.substring(0, strNum.indexOf('.') == -1 ? strNum.length : strNum.indexOf('.'));

	for (var i = 0, len = strNum.length; i < len; ++i) {

		if (!isNaN(strNum[i])) {
			numbers += strNum[i];
		}
	}

	result = Number(numbers);
	return result.toFixed(0);
};

function convertStringToDecimal(strNum, keepFraction) {

	var result = 0,
		numbers = '';
	keepFraction = keepFraction || false;

	strNum = strNum.replace(/,/g, '');
	//remove the fraction
	if(!keepFraction){
		strNum = strNum.substring(0, strNum.indexOf('.') == -1 ? strNum.length : strNum.indexOf('.'));
	}
	//remove the [] 
	strNum = strNum.substring(0, strNum.indexOf('[') == -1 ? strNum.length : strNum.indexOf('['));
	//remove the unit
	strNum = strNum.substring(0, strNum.indexOf(' ') == -1 ? strNum.length : strNum.indexOf(' '));

	for (var i = 0, len = strNum.length; i < len; ++i) {

		if (!isNaN(strNum[i])) {
			numbers += strNum[i];
		}
	}

	result = Number(numbers);
	return result.toFixed(0);
};

function removeDecimalFraction(strNum) {

	var result = 0,

		//remove the fraction
		result = strNum.substring(0, strNum.indexOf('.') == -1 ? strNum.length : strNum.indexOf('.'));

	return result;
};


function convertUnit(sf) {

	sf = convertStringToDecimal(sf);
	var result = parseInt(sf) / 10.76;
	return result.toFixed(1);
};

function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

function highlight_words(keywords, element) {
	if (keywords) {
		var textNodes;
		keywords = keywords.replace(/\W/g, '');
		var str = keywords.split(" ");
		$(str).each(function () {
			var term = this;
			var textNodes = $(element).contents().filter(function () { return this.nodeType === 3 });
			textNodes.each(function () {
				var content = $(this).text();
				var regex = new RegExp(term, "gi");
				content = content.replace(regex, '<span class="highlight">' + term + '</span>');
				$(this).replaceWith(content);
			});
		});
	}
};