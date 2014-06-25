var mdns = require('mdns'),
    EventEmitter = require('events').EventEmitter,
    serviceType = mdns.makeServiceType({name: 'radiodan-http', protocol: 'tcp', subtypes: ['radiodanv1']});

module.exports.create = function (urn) {
  var instance = new EventEmitter(),
      browser = mdns.createBrowser(serviceType.toString()),
      started = false;

  browser.on('serviceUp', function(msg) {
    var output = {
      id: msg.fullname,
      type: msg.type.toString(),
      location: msg.addresses ? msg.addresses[1] : '',
      server: msg.host,
      timestamp: new Date(),
      state: 'serviceup',
      protocol: 'MDNS'
    };

    instance.emit('*', output);
  });

  browser.on('serviceDown', function(msg) {
    console.log(msg);

    var output = {
      id: msg.name + '.' + msg.type.toString() + msg.replyDomain,
      type: msg.type.toString(),
      location: msg.addresses ? msg.addresses[1] : '',
      server: msg.host,
      timestamp: new Date(),
      state: 'servicedown',
      protocol: 'MDNS'
    };

    instance.emit('*', output);
  });
  
  instance.start = function () {
    if(!started) {
     browser.start();
     started = true; 
    }
  }
  
  return instance;
}