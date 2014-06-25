var express = require('express');
var eventStream = require('express-eventsource')();
var clientSSDP = require('./clients/ssdp');
var clientMDNS = require('./clients/mdns');

var app = express();

// Serve all static files in /public
app.use(require('serve-static')('public'));

// Shared eventsource
// To send data call: eventStream.send(dataObj, 'eventName');
app.use('/events', eventStream.middleware());

app.get('/scan', function (req, res) {
  ssdp.search();
  mdns.start();
  res.send(200);
});

var ssdp = clientSSDP.create();
ssdp.on('*', function (msg) {
  // console.log(msg);
  eventStream.send(msg);
});
ssdp.search();

var mdns = clientMDNS.create();
mdns.on('*', function (msg) {
  // console.log(msg);
  eventStream.send(msg);
});

app.listen(process.env.PORT || 3000);