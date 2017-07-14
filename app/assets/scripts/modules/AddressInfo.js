// Analyse the address information

class AddressInfo {

    constructor(address) {
        this.streetNumber = this.getStreetNumber(address);
        this.streetName = this.getStreetName(address);
        this.streetType = this.getStreetType(address);
    }

    getStreetNumber(address) {
        //split the address
        var addressParts = address.split(' ');
        return addressParts[1].trim();
    }

    getStreetName(address) {
        var addressParts = address.split(' ');
        return addressParts[2].trim();
    }

    getStreetType(address) {
        var addressParts = address.split(' ');
        var addressType = '';
        for(var i=3; i<addressParts.length; i++){
            addressType += addressParts[i].trim()
        }
        return addressType;
    }
};

export default AddressInfo;