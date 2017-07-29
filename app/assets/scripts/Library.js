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

        convertStringToDecimal: function (strNum, keepFraction) {
            var result = 0,
                numbers = '';
            keepFraction = keepFraction || false;
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
            result = Number(numbers);
            return result.toFixed(keepFraction ? 2 : 0);
        },

        removeDecimalFraction: function (strNum) {
            var result = 0;
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
            console.log('current House Type is: ', houseType);
            return this;
        },

        getCurrentTab: function (curTabID) {
            chrome.storage.sync.set({ 'curTabID': curTabID });
            chrome.runtime.sendMessage(
                { todo: 'readCurTabID', from: 'mls-fullrealtor' },
                function (response) {
                    console.log('current Tab ID is: ', response);
                }
            )
            return this;
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
