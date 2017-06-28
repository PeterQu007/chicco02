//Login Module
//Page URL: https://accounts.craigslist.org/login?lang=en&cc=us&rt=L&rp=%2Flogin%2Fhome%3Flang%3Den%26cc%3Dus
import $ from 'jquery';

class Login{

    constructor (console, debug){

        this.countTimer = setInterval(this.checkComplete.bind(this), 3000);
        //debug setting
     
        this.log = (debug===0) ? console.log : function(){};
        //console.log(this.log);
        var _$ = this.log;

        this.form = document.forms[0];
        this.loginButton = $('button.accountform-btn:first');
        this.email = $('#inputEmailHandle');
        this.password = $('#inputPassword');
      
        _$("I am in Content login.js now! ");
      
    }

    checkComplete(){

        var _$ = this.log;

        _$("Check the login page status:");
        _$(this);
        _$($(this.loginButton));

        if (this.loginButton){

            _$($('#inputEmailHandle').val());
            clearInterval (this.countTimer);
            
            this.submit();
            
        } 
    }

    submit(){
        
        var _$ = this.log;

        _$("submit method:");
        _$(this);
        _$($(this.loginButton));

        if (this.loginButton){

            _$($('#inputEmailHandle').val());
            clearInterval (this.countTimer);
            //this.email.val("peterqu007@gmail.com");
            this.email.val("pqu007@gmail.com");
            this.password.val("inform69");
            this.form.submit();
            
        }
    }
}

export default Login;