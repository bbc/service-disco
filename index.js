var express = require('express');
var eventStream = require('express-eventsource')();
var clientSSDP = require('./clients/ssdp');
var clientMDNS = require('./clients/mdns');

var app      = express(),
    messages = [];

// Serve all static files in /public
app.use(require('serve-static')('public'));

// Shared eventsource
// To send data call: eventStream.send(dataObj, 'eventName');
app.use('/events', eventStream.middleware());

// Perform a scan, sending results 
// through the event stream
app.get('/scan', function (req, res) {
  ssdp.search();
  mdns.start();
  res.send();
});

// Return all previous messages
app.get('/cache', function (req, res) {
  res.send( JSON.stringify(messages.slice(-50)) );
});

var ssdp = clientSSDP.create();
ssdp.on('*', function (msg) {
  console.log(log(msg));
  eventStream.send(msg);
  messages.push(msg);
});
ssdp.search();

var mdns = clientMDNS.create();
mdns.on('*', function (msg) {
  console.log(log(msg));
  eventStream.send(msg);
  messages.push(msg);
});

function log(msg) {
  return msg.protocol + ':\t\t' + msg.state + '\t' + msg.type + '\t\t\t' + msg.id;
}

app.listen(process.env.PORT || 3000);