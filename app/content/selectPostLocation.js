// Select Sub Area
import PostLoc from '../assets/scripts/modules/PostLocation';


var _$ = console.log;

_$('select sub area: ');

chrome.storage.sync.set({'editPageStatus':'newpost'});

var postLoc = new PostLoc();