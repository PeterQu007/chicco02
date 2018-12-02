////COMPLEX MODULE FOR
////CRUD DATABASE RECORD
////PLUGIN TO OTHER MODULES

export default class Complex {
    constructor(interface){
        ////PROPERTIES
        this.complexID;
        this.complexName;
        this.planNum;
        this.formalAddress;
        this.legalDescription;
        this.col;

        ////
        this.connect(interface); ////PASS TAB.TITLE FOR COLUMNS SETTING


    }

    ////EVENTS
    onSearch(){

    }

    ////METHODS
    update(){

    }

    search(){

    }

    connect(interface){
        switch (interface){
            case "spreadSheet":
                this.col = 10;
                break;
            case "fullRealtor":
                this.col = 10;
                break;
            case "fullPublic":
                this.col = 10;
                break;
            case "Market Monitor":
                this.col = 11;
                break;
            case "Residential Detached":
                this.col = 10;
                break;
            case "Residential Attached":
                this.col = 10;
                break;
            case "Land Only":
                this.col = 10;
                break;
            case "Listing Carts":
                this.col = 10;
                break;
            default :
                this.col = 10;
                break;
        }
    }
}

