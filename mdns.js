// import the module
var mdns = require('mdns');

var serviceType = mdns.makeServiceType({name: 'radiodan-http', protocol: 'tcp', subtypes: ['radiodanv1']});

console.log(serviceType.toString());

// advertise a http server on port 4321

// var ad = mdns.createAdvertisement(mdns.tcp('http'), 4320, {txtRecord: {radiodan: false}});
// ad.start();

var ad2 = mdns.createAdvertisement(serviceType.toString(), 4321, {txtRecord: {radiodan: true, video: false, audio: true, stream: true}});
ad2.start();

// watch all http servers
var browser = mdns.createBrowser(serviceType.toString());
// discover all available service types
// var browser = mdns.browseThemAll();

browser.on('serviceUp', function(service) {
  console.log("service up: ", service);
});
browser.on('serviceDown', function(service) {
  console.log("service down: ", service);
});
browser.start();

