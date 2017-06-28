//background.js

import Listing from "../assets/scripts/modules/Listing";

'use strict';

const cgManagerStatus = {

    edit: 'edit',
    del: 'del',
    rep: 'rep'

}

var $$$ = console.log;
var _$_ = function(){};
var $00, $01, $02, $03, $04, $05, $06, $07, $08, $09, $10, $11, $12, $13, $14, $15, $16
$00=$01=$02=$03=$04=$05=$06=$07=$08=$09=$10=$11=$12=$13=$14=$15=$16= _$_;

var backupListing =new Listing();  // keep the reposted listing
var backupCurrentPage = 1; // keep the current page number
var backupCurURL = ''; //keep the current URL for go back after some action
var backupPostTitle = ''; 

var allCatPosts = []; //keep the cat listings
var delCatPosts = false; 
var curCgManagerStatus = null;
var cgNewPost = false;

console.clear();
$$$("bg.0: backupCurrentPage: ", backupCurrentPage);
$$$("bg.0: backupListing: ", backupListing);
$$$('=============================================================');
chrome.storage.sync.set({'appDeletingStatus': null});
chrome.storage.sync.set({'postMenuStatus': null});

/************/
//EVETNTS
/***********/

chrome.runtime.onMessage.addListener(function (msg, sender, response) {
  
  $00 = $$$

  $00('---------------------------------------')
  $00("bg.00...msg received: ", msg.from, msg.subject)

/*************/// show Page Action 
  // First, validate the message's structure
  if ((msg.from === 'content') && (msg.subject === 'showPageAction')) {

    //$01 = $$$

    $01("bg.1:", msg.from, msg.subject);
    // Enable the page-action for the requesting tab
    chrome.pageAction.show(sender.tab.id);
  };

/*************/// listing reposted
  if ((msg.from === 'readListing') && (msg.subject === 'listingReposted')){

    //$02 = $$$

    $02("bg.2:",msg.from, msg.subject);
  	//keep the listing info to object listingbackup
  	backupListing = msg;
  	$02("bg.2.1: write listing", backupListing);
  };

/*************/// fetch backup listing
  if ((msg.from === 'readListing') && (msg.subject === 'fetchBackupListing')){

    //$03 = $$$;

    $03("bg.3:", msg.from, msg.subject);
  	//send back the previous listing
  	$03("bg.3.1 send back the backupListing to readListing.js:", backupListing);
  	response(backupListing);
    return true;
  };

/*************/// backup listing
  //readinglist.js read a repostable listing, ask background.js to keep it as record
  if ((msg.from === 'readListing' || msg.from === 'doRepost') && (msg.subject === 'backupListing')){
    
    //$04 = $$$;

    $04("bg.4:", msg);
    //keep the listing info to object listingbackup
    if (msg.status != ''){
        $04("bg.4.1.backup a repostable listing as per readListing.js' request:", backupListing);
        backupListing = msg;
        $04("bg.4.2.I send the backupListing back to readListing.js:");
        response(backupListing);
        return true;
    }
    else
    {
      $04("bg.4.1.1.do not backup an empty listing:", backupListing);
    }
  };

/************///fetch BackupCurrentPage

  if ((msg.from === 'paginator' || msg.from === 'repost') && (msg.subject === 'fetchBackupCurrentPage')){
    
    //$05 = $$$;

    $05("bg.5:", msg.from, msg.subject);
    //send back the previous listing
    $05("bg.5.1 send back the backupCurrentPage: ", backupCurrentPage);
    response({backupCurrentPage:backupCurrentPage});
    return true;
  };

/************/// backup current page
/**/if ((msg.from === 'paginator') && (msg.subject === 'backupCurrentPage')){

    //$06 = $$$;

    $06("bg.6:", msg.from, msg.subject);
    $06("bg.6.1.get the page number: ", msg.currentPage);
   
    backupCurrentPage = msg.currentPage;
    
    //send back the previous listing
    $06("bg.6.3 save the backupCurrentPage:", backupCurrentPage);
    response({backupCurrentPage:backupCurrentPage});
    return true;

  };

/***************/// reset backup Listing
  //readinglist.js read a repostable listing, ask background.js to keep it as record
  if ((msg.from === 'paginator') && (msg.subject === 'resetBackupListing')){
   
    //$07 = $$$;

    $07("bg.7:", msg.from, msg.subject);
    //keep the listing info to object listingbackup
    
    $07("bg.7.1.reset backupListing:");
    backupListing = new Listing();
    $07("bg.7.2.I have reset backupListing:");
    response();
    return true;
   
  };

/***************/// backup current URL 
  //msg be sent from clsCopy, clsDelete
  if (msg.subject === 'backupCurURL'){
    
    $08 = $$$;

    $08("bg.8:", msg.from, msg.subject, msg.curURL);
    
    $08("bg.8.1.backup current URL:");
    backupCurURL = msg.curURL;
    $08("bg.8.2.send the backupCurrentURL back: ", backupCurURL);
    response({backupCurURL:backupCurURL});
    return true;
   
  };

/***************/// fetch backuped current URL 
  //msg from clsReadPost, module goBackPrevUrl
  if (msg.subject === 'fetchBackupCurrentURL'){
    
    $09 = $$$;

    $09("bg.9:", msg.from, msg.subject);
       
    $09("bg.9.1.fetch current URL:");
    var curURL = backupCurURL;
    $09("bg.9.2.send the backupCurrentURL back: ", backupCurURL);
    response({backupCurURL:curURL});
    return true;
   
  };

/***************/// current Listing updated 
  //readinglist.js read a repostable listing, ask background.js to keep it as record
  if ((msg.from === 'classTable') && (msg.subject === 'currentListingUpdated')){
    
    //$10 = $$$;

    $10("bg.10:", msg.from, msg.subject);
    //keep the listing info to object listingbackup
    
    $10("bg.10.1.broadcast the msg: ");
    
    
    //background broadcast a message:
    //https://stackoverflow.com/questions/11597416/how-to-transfer-data-between-the-content-scripts-of-two-different-tabs/11599150#11599150
    chrome.tabs.query({
       active: true,
       currentWindow: true
      }, function(tabs){

       $10("bg.10.2.background.broadcast current listing updated msg:")

       chrome.tabs.sendMessage(

         tabs[0].id,

         {from: 'background', subject: 'currentListingUpdated'},

         function(){

          $10("bg.10.3.background.done broadcast:")

         }

         ); //the message will be passed back thru setDOMInfo

      });

    response({});
    return true;
   
  };

/***************/// backup Delete Post Title 
  //readinglist.js read a repostable listing, ask background.js to keep it as record
  if (msg.subject === 'bg.11.backupPostTitle'){
    
    $11 = $$$;

    $11("bg.11", msg.from, msg.subject, msg.PostTitle);
        
    $11("bg.11.1.backup delete post title:");
    backupPostTitle = msg.PostTitle;
    $11("bg.11.2.send the backup delete post title back: ", backupPostTitle);
    response({backupPostTitle:backupPostTitle});
    return true;
   
  };

/***************/// fetch backuped Delete Post Title 
  //readinglist.js read a repostable listing, ask background.js to keep it as record
  if ((msg.from === 'clsDelete') && (msg.subject === 'bg.12.fetchBackupPostTitle')){
    
    $12 = $$$;

    $12("bg.12:", msg.from, msg.subject);
        
    $12("bg.12.1.fetch backup post title:");
    
    $12("bg.12.2.send the backup post title back: ", backupPostTitle);

    response({backupPostTitle:backupPostTitle});
    return true;
   
  };

/***************/// setup the cgManager Status  
  
  if (msg.subject === 'bg.13.backupCatPosts'){
    
    $13 = $$$;

    $13("bg.13", msg.from, msg.subject, msg.catPosts);
        
    $13("bg.13.1...manage all cat posts: ");

    allCatPosts = msg.catPosts;
    //all the listing has been converted to an Object
    if(allCatPosts.length>0){

      switch (msg.from){
        case 'clsDelete':
          curCgManagerStatus = cgManagerStatus.del;
          break;
        case 'clsEdit':
          curCgManagerStatus = cgManagerStatus.edit;
          break;
        case 'clsRep':
          curCgManagerStatus = cgManagerStatus.rep;
          break;
        default :
          break;
      }
      
      allCatPosts.forEach(function(listing){
        $13("bg.13.2.0...backuped listing postID: ", listing.postID);
      })

      $13("bg.13.2.send the catPosts back: ", allCatPosts);
      response({catPosts: allCatPosts});

    }else{
      $13("bg.13.3.no listing in the messgage: ", allCatPosts);
      curCgManagerStatus = null;
    }
   
    return true;
   
  };

/***************/// Return the catPostsManage  
  
  if (msg.subject === 'bg.14.fetchCgManagerStatus'){
    
    $14 = $$$;

    $14("bg.14", msg.from, msg.subject);
        
    $14("bg.14.1...manage cat posts: ");

    if(curCgManagerStatus){

      var postQueue = allCatPosts.length;

      if(postQueue > 0) {

        var nextPostID = allCatPosts.pop().postID;
        
        $14("bg.14.2...send next PostID back: ", nextPostID, allCatPosts);
        response({cgManagerStatus: curCgManagerStatus, postID: nextPostID});

      }else{
        $14('bg.14.3...All Listings DONE!');
        curCgManagerStatus = null; 

      }
   
    }else{

      $14("bg.14.4...send CatPosts manage back: ", curCgManagerStatus);
      response({cgManagerStatus: curCgManagerStatus});

    }

    return true;
   
  };

/***************/// set current cgNewPost
  // clsReadWritePost.goHomePage & .doNewPost
  if (msg.subject === 'setCgNewPost'){
    
    $15 = $$$;

    $15("bg.15:", msg.from, msg.subject, msg.cgNewPost);
    
    $15("bg.15.1.set up cgNewPost:", msg.cgNewPost);
    cgNewPost = msg.cgNewPost;
    $15("bg.15.2.send the backupCurrentURL back: ", cgNewPost);
    response({cgNewPost: cgNewPost});
    return true;
   
  };

/***************/// fetch backuped current URL 
  //
  if (msg.subject === 'fetchCgNewPost'){
    
    $16 = $$$;

    $16("bg.16:", msg.from, msg.subject);
       
    $16("bg.16.1.fetch cgNewPost:");
    
    $16("bg.16.2.send cgNewPost back: ", cgNewPost);
    response({cgNewPost: cgNewPost});
    return true;
   
  };


/**********************/// Log Message From Content scripts

  if ((msg.subject = 'logMessage')) {

    console.warn(msg.from, msg.log);

  }



}); /////end of addListener



