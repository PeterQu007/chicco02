$(function() {

    // just place a div at top right
	var div = document.createElement('div');
	div.style.position = 'fixed';
	div.style.top = 0;
	div.style.right = 0;
	div.textContent = 'MLS List!';
	document.body.appendChild(div);
    
    window.addEventListener ("load", myMain, false);

    function myMain (evt) {
        var jsInitChecktimer = setInterval (checkForJS_Finish, 100);

        function checkForJS_Finish () {
            if (document.querySelector ("#Search")) {
                clearInterval (jsInitChecktimer);
                // DO YOUR STUFF HERE.
                $(function(){

                    var mls =$("#f_1__1-2-3-4");
                    //var mls = document.getElementById("f_1__1-2-3-4");
                    var btn = $("#Search");
                    
                    console.log("mls Search!");
                    console.log(mls);
                    //function .blur() is used to trigger PARAGON to split the mls#s
                    mls.focus().val("R2172579,R2172580,").blur();
                    //mls.value = "R2172579,R2172580,\r\n";
                    //mls.val("R2172579,R2172580,").blur();

                    
                    // var e = jQuery.Event("keydown");
                    // e.which = 13; // Enter
                    // mls.trigger(e);
                   
                   
                    btn.click();
                
                })
            }
        }
    };

   
})