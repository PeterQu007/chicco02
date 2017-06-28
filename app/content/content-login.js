// (function() {

//     // just place a div at top right
// 	var div = document.createElement('div');
// 	div.style.position = 'fixed';
// 	div.style.top = 0;
// 	div.style.right = 0;
// 	div.textContent = 'Injected!';
// 	document.body.appendChild(div);
    
//     //var script = document.createElement('script');
//     //script.src = "http://pidrealty.ca/assets/scripts/test.js"
//     //document.body.appendChild(script);

//      var countTimer = setInterval (checkComplete, 100);

//         function checkComplete () {

            

//             if (document.querySelector('#loginbtn')){

//                 clearInterval (countTimer);

//                 $(function(){
    
//                     var name =$("#j_username");
//                     var pswhidden = $("#j_password");
//                     var psw = $("#password");
//                     var btn = $("#loginbtn");

//                     console.log(btn);
                    
//                     name.focus().val("V70898").blur();
//                     psw.css("color","black");
//                     psw.focus().val("escape89").blur();
//                     pswhidden.val("escape89").blur();

//                     btn.click();
                
//                 })
//             }
            

//         }

//  //    $(function(){
    
//  //        var name =$("#j_username");
//  //        var pswhidden = $("#j_password");
//  //        var psw = $("#password");
//  //        var btn = $("#loginbtn");
        
//  //        name.val("V70898");
//  //        psw.css("color","white");
//  //        psw.val("escape89");
//  //        pswhidden.val("escape89");

//  //    //btn.click();
    
// 	// })

//     // function onPageLoad(event){
//     //     alert("Page loaded");
//     // }

//     // document.addEventListener("DOMContentLoaded",onPageLoad,true);

// 	//alert('inserted self... giggity, thanks!');



// })();

(function(){

    var countTimer = setInterval (checkComplete, 100);

    function checkComplete(){

    	console.log("auto login to server:");

        if (document.querySelector('#loginbtn')){

            clearInterval (countTimer);
            document.getElementById('j_password').value="escape89";
            document.getElementById('j_username').value="v70898";
            document.forms["loginform"].submit();
        }

               

    }
    

}())