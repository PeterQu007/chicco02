//Select Post Type

import PostType from '../assets/scripts/modules/PostType';
//../assets/scripts/modules/ReadWritePost

var _$ = console.log;

_$("Select Post Type:");

chrome.storage.sync.set({'editPageStatus':'newpost'});

var postType = new PostType();
