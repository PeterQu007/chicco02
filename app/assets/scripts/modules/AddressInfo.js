// Analyse the address information

class AddressInfo {

    constructor(address, houseType) {
        address = address.replace('.', '');
        this.streetNumber = this.getStreetNumber(address, houseType);
        this.streetName = this.getStreetName(address, houseType);
        this.streetType = this.getStreetType(address, houseType);
    }

    getStreetNumber(address, houseType) {
        //split the address
        var addressParts = address.split(' ');
        var partIndex = 1;
        switch(houseType){
            case 'Attached':
                partIndex = 1;
                break;
            case 'Detached':
                partIndex = 0;
                break;
        }
        return addressParts[partIndex].trim();
    }

    getStreetName(address, houseType) {
        var addressParts = address.split(' ');
        var partIndex = 2;
        switch(houseType){
            case 'Attached':
                partIndex = 2;
                break;
            case 'Detached':
                partIndex = 1;
                break;
        }
        return addressParts[partIndex].trim();
    }

    getStreetType(address, houseType) {
        var addressParts = address.split(' ');
        var addressType = '';
        var partIndex = 3;
        switch(houseType){
            case 'Attached':
                partIndex = 3;
                break;
            case 'Detached':
                partIndex = 2;
                break;
        }
        for (var i = partIndex; i < addressParts.length; i++) {
            addressType += addressParts[i].trim()
        }
        return addressType;
    }
};

export default AddressInfo;