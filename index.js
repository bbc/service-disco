var express = require('express');
var eventStream = require('express-eventsource')();
var client = require('./client');

var app = express();

// Serve all static files in /public
app.use(require('serve-static')('public'));

// Shared eventsource
// To send data call: eventStream.send(dataObj, 'eventName');
app.use('/events', eventStream.middleware());

app.get('/scan', function (req, res) {
  ssdp.search();
  res.send(200);
});

var ssdp = client.create();
ssdp.on('*', function (msg) {
  eventStream.send(msg);
});
ssdp.search();

app.listen(process.env.PORT || 3000);