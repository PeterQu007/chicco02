//Verify the Geo location on map
//pass the any actions

console.log('geoVerify will be bypassed in 2 seconds');

setTimeout(bypassGeoVerify, 2000);

function bypassGeoVerify(){

$('form#leafletForm').submit();

};
