//Select Post Cat
import PostCat from '../assets/scripts/modules/PostCat';

var _$ = console.log;

_$("select post type: ");

chrome.storage.sync.set({'editPageStatus':'newpost'}); 

var postCat = new PostCat();