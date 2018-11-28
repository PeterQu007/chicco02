//// ANALYSE THE CIVIC ADDRESS INFORMATION
//// NORMALIZE THE ADDRESS IF IT IS NOT A FORMAL.BCA.ADDRESS

class AddressInfo {

    constructor(address, houseType, formal) {
        address = address.replace('.', '');
        this.isFormalAddress = (formal == undefined ? false : formal);
        this.houseType = houseType ? houseType : "AUTO";
        houseType = this.houseType;
        this.addressParts = address.split(' '); ////SPLIT THE ADDRESS TO PARTS.ARRAY
        ////LOOK FOR UNIT NO, THEN REMOVE THE UNIT.NO FROM THE ADDRESS.PARTS.ARRAY
        this.UnitNo = '';

        switch (houseType.toUpperCase()){
            case 'TOWNHOUSE' :
            case 'APARTMENT' :
            case 'APARTMENT/CONDO' :
            case 'CONDO' :
            case 'ATTACHED' :
                houseType = 'Attached';
                break;
            case 'AUTO': ////HOUSE TYPE COULD BE TOLD FROM IF THERE IS A UNIT NO OR NOT
                if(address.indexOf('UNIT#')>-1){
                    houseType = 'Attached';
                }else{
                    houseType = 'Detached';
                }
                break;
            default :
                houseType = 'Detached';
                break;
        }
        this.houseType = houseType;
        ////FORMAL.ADDRESS IS FROM THE BC.ASSESSMENT RESULT
        if(this.isFormalAddress){
            if ( houseType == 'Attached' ) {
                if(this.addressParts.length>3){
                    this.UnitNo = this.addressParts.pop();
                    this.addressParts.pop();
                }else{
                    this.UnitNo = "TBA";
                }
            }
        }else{
            if ( houseType == 'Attached' ) {
                if(this.addressParts.length>3){
                    this.UnitNo = this.addressParts.shift() ;
                }else{
                    this.UnitNo = "TBA" ;
                }
                
            }
        }
     
        this.streetNumber = this.addressParts.shift();
        this.streetType = this.addressParts.pop(); ////STREET, AVENUE, BOULEVARD, HIGHWAY...
        this.streetName = this.addressParts.toString().replace(',','-');
        var streetType = this.streetType.trim().toString().toUpperCase();
        ////STANDARDIZE THE STREET.TYPE TO ABBREVIATIONS: ST, AV, BV, HW, CR, ...
        switch (streetType){
            case 'AVENUE' :
                streetType = 'AV';
                break;
            case 'STREET' :
                streetType = 'ST';
                break;
            case 'DRIVE' :
                streetType = 'DR';
                break;
            case 'BOULEVARD' :
                streetType = 'BV';
                break;
            case 'BYPASS' :
                streetType = 'BP';
                break;
            case 'CRESCENT':
                streetType = "CR";
                break;
            default :
                streetType = streetType;
                break;
        }
        this.streetType = streetType;
        ////GET FORMAL.BCA.ADDRESS
        this.formalAddress = this.streetNumber + " " + this.streetName.replace('-',' ') + " " + this.streetType;
        if (this.UnitNo){
            this.formalAddress = this.formalAddress + " UNIT# " + this.UnitNo;
        }
        ////GET ADDRESS.ID FOR STRATA.PLAN.ID
        this.addressID = '-' + this.streetNumber + '-' + this.streetName + '-' + this.streetType;
        ////GET STREET.ADDRESS WITHOUT UNIT.NO
        this.streetAddress = this.streetNumber + ' ' + this.streetName.replace('-',' ') + ' ' + this.streetType;
        ////GET GOOGLE.SEARCH.LINK FOR COMPLEX.NAME FORM BC.CONDOS.COM
        this.googleSearchLink = "https://www.google.com/search?q=" + this.streetAddress.split(' ').join('+');
        if(this.houseType != 'Detached'){
            this.googleSearchLink += "+\"BCCONDOS\"+BUILDING+INFO";
        }
    }

};

export default AddressInfo;