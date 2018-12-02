//common functions module

(function (global, $) {
    let Library = function () {
        return new Library.init();
    };

    let HouseType = {
        Attached: 'Attached',
        Detached: 'Detached',
        Land: 'Land'
    }

    Library.prototype = {

        getDecimalNumber: function (strNum) {
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
        },

        getRecordCount: function(url){
            //recordCount number is between recordCount= AND &
            //console.log("URL",url);
            var pos = url.indexOf("recordCount=");
            var s = url.substring(pos).replace("recordCount=","")
            pos =s.indexOf("&");
            var recordCount = Number(s.substring(0,pos)) ;
            recordCount = recordCount > 0? recordCount : 0;
            return recordCount;
        },

        convertStringToDecimal: function (strNum, keepFraction) {
            //convert Number String To Decimal number
            //example: "$345,890.78" --> 345890
            var result = 0,
                numbers = '';
            keepFraction = keepFraction || false;
            strNum = strNum.toString();
            strNum = strNum.replace(/,/g, '');
            //remove the fraction
            if (!keepFraction) {
                strNum = strNum.substring(0, strNum.indexOf('.') == -1 ? strNum.length : strNum.indexOf('.'));
            }
            //remove the [] 
            strNum = strNum.substring(0, strNum.indexOf('[') == -1 ? strNum.length : strNum.indexOf('['));
            //remove the unit
            strNum = strNum.substring(0, strNum.indexOf(' ') == -1 ? strNum.length : strNum.indexOf(' '));
            for (var i = 0, len = strNum.length; i < len; ++i) {
                if (!isNaN(strNum[i]) || strNum[i] === '.') {
                    numbers += strNum[i];
                }
            }
            result = Number(Number(numbers).toFixed(keepFraction ? 2 : 0));
            return result;
        },

        removeDecimalFraction: function (strNum) {
            var result = 0;
            strNum = strNum.toString();
            //remove the fraction
            result = strNum.substring(0, strNum.indexOf('.') == -1 ? strNum.length : strNum.indexOf('.'));
            return result;
        },

        convertUnit: function (sf) {
            if (!isNaN(sf)) (sf = sf.toString());
            sf = this.convertStringToDecimal(sf);
            var result = parseInt(sf) / 10.76;
            return result.toFixed(1);
        },

        numberWithCommas: function (x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },

        highlight_words: function (keywords, element) {
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
        },

        isInt: function (value) {
            return !isNaN(value) &&
                parseInt(Number(value)) == value &&
                !isNaN(parseInt(value, 10));
        },

        getToday: function () {
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
        },

        getToday_mmddyyyy: function () {
            /*return format dd/mm/yyyy*/
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
            today = mm + '/' + dd + '/' + yyyy;
            return today;
        },

        formatDate: function (date) {
            let dd = date.getDate();
            let mm = date.getMonth() + 1; // January is 0!
            let yyyy = date.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }
            var date = mm + '/' + dd + '/' + yyyy;
            return date;
        },

        setHouseType: function (houseType) {
            chrome.storage.sync.set({ 'houseType': houseType });
            //console.log('current House Type is: ', houseType);
            return this;
        },

        getCurrentTab: function (curTabID) {
            chrome.storage.sync.set({ 'curTabID': curTabID });
            chrome.runtime.sendMessage(
                { todo: 'readCurTabID', from: 'mls-fullrealtor' },
                function (response) {
                    //console.log('current Tab ID is: ', response);
                }
            )
            return this;
        },

        getTabID: function (str) {
            let src, start, end;
            src = str;
            start = src.indexOf('searchID=');
            src = src.substring(start);
            //console.log(src);
            if (src.indexOf('&') > -1) {
                end = src.indexOf('&');
                src = src.substring(0, end);
            };
            start = src.indexOf('=tab');
            src = src.substring(start + 1);
            end = src.indexOf('_');
            //only need the main tab id, remove the sub tab ids:
            src = src.substring(0, end);
            //console.log('QuickSearch Page\'s tabID is:', src);
            return '#' + src; //add id sign # as prefix
        },

        getSubTabID: function(str){
            let src, start, end;
            src = str;
            start = src.indexOf('searchID=');
            src = src.substring(start);
            //console.log(src);
            if (src.indexOf('&') > -1) {
                end = src.indexOf('&');
                src = src.substring(0, end);
            };
            start = src.indexOf('=tab');
            src = src.substring(start + 1);
            return '#' + src; //add id sign # as prefix
        },

        normalizeComplexName: function(complexName){
            var normalizedName = '';
            if(typeof complexName == 'string'){
                complexName = complexName.trim();
                var nameParts = complexName.split(' ');
                var firstChar = '';
                var remainingChar = '';
                
                for (var i = 0; i<nameParts.length; i++){
                    nameParts[i] = nameParts[i].trim();
                    firstChar = nameParts[i].charAt(0).toUpperCase();
                    remainingChar = nameParts[i].slice(1).toLowerCase().trim();
                    normalizedName += (firstChar + remainingChar + " ");
                    
                }
                normalizedName = normalizedName.trim();
            }else{
                normalizedName = "";
            }
            
            return normalizedName;
        },

        setCols: function(tabTitle){
           
            var cols = null;
            switch(tabTitle){
                case 'Quick Search':
                case 'Listing Carts':
                    cols = {
                        RecordNo: 0, //index 0
                        Status: 8,
                        address: 9,
                        complexName: 11,
                        ListPrice: 12,
                        Price: 13,
                        SoldPrice: 14,
                        TotalFloorArea: 15,
                        PricePSF: 16,
                        SoldPricePSF: 17,
                        PID: 22,
                        landValue: 23,
                        improvementValue: 24,
                        totalValue: 25,
                        changeValuePercent: 26,
                        lotSize: 27,
                        strataPlan: 28,
                        houseType: 29
                    }
                    break;
                case 'Residential Attached':
                    cols = {
                        RecordNo: 0, //index 0
                        Status: 8,
                        address: 9,
                        subArea: 48,
                        neighborhood: 10,
                        complexName: 11,
                        postcode: 54,
                        Price: 12,
                        ListPrice: 14,
                        SoldPrice: 18,
                        TotalFloorArea: 22,
                        PricePSF: 23,
                        SoldPricePSF: 24,
                        lotSize: 28,
                        PID: 31,
                        landValue: 32,
                        improvementValue: 33,
                        totalValue: 34,
                        changeValuePercent: 35,
                        strataPlan: 36,
                        streetAddress: 37,
                        unitNo: 38,
                        houseType: 42
                    }
                    break;
                case 'Residential Detached':
                    cols = {
                        RecordNo: 0, //index 0
                        Status: 8,
                        address: 9,
                        complexName: 11,
                        Price: 12,
                        ListPrice: 12,
                        SoldPrice: 36, //
                        TotalFloorArea: 17,
                        PricePSF: 22,
                        SoldPricePSF: 23,
                        PID: 24,
                        landValue: 25,
                        improvementValue: 26,
                        totalValue: 27,
                        changeValuePercent: 28,
                        strataPlan: 33,
                        lotSize: 20,
                        houseType: 30
                    }
                    break;
                    case 'Tour and Open House':
                    cols = {
                        RecordNo: 0, //index 0
                        Status: 20,
                        Price: 11,
                        ListPrice: 11,
                        address: 13,
                        complexName: 14,
                        SoldPrice: 39, //No use for open house
                        TotalFloorArea: 32,
                        PricePSF: 22,
                        SoldPricePSF: 39,
                        PID: 21,
                        landValue: 22,
                        improvementValue: 23,
                        totalValue: 24,
                        changeValuePercent: 25,
                        strataPlan: 34,
                        lotSize: 33,
                        houseType: 9
                    }
                    break;
                default:
                    cols = {
                        RecordNo: 0, //index 0
                        Status: 8,
                        Price: 12,
                        ListPrice: 14,
                        SoldPrice: 18,
                        TotalFloorArea: 22,
                        PricePSF: 23,
                        SoldPricePSF: 24,
                        PID: 31,
                        landValue: 32,
                        improvementValue: 33,
                        totalValue: 34,
                        changeValuePercent: 35,
                        strataPlan: 36
                    }
                    break;
            }
            return cols;
            
        },
    
        inGreatVanArea: function(city){
            var cities = ["City"/*FOR KEEPING THE TABLE HEAD*/, "Vancouver", "Burnaby", "Richmond", "White Rock",
                            "Coquitlam", "Port Moody", "Maple Ridge", "Surrey", "New Westminster", "Pitt Meadows",
                            "Langley", "Port Coquitlam", "Delta", "North Vancouver", "West Vancouver"]
            if(cities.includes(city)) {
                return true;
            }else{
                return false;
            }
        }
    };

    Library.init = function (houseType) {
        var self = this;
        self.name = 'General Function Library';
        self.version = '1.0';
        self.language = 'en';
        self.houseType = houseType || HouseType['Attached'];
        self.today = self.getToday_mmddyyyy();
    }

    Library.init.prototype = Library.prototype;

    global.Library = global.L$ = Library;

}(window, jQuery));
