var mdns = require('mdns'),
    EventEmitter = require('events').EventEmitter,
    serviceType = mdns.makeServiceType({name: 'http', protocol: 'tcp'});

module.exports.create = function (urn) {
  var instance = new EventEmitter(),
      urn      = urn ? urn : serviceType,
      browser  = urn ? mdns.createBrowser(urn) : mdns.browseThemAll(),
      started  = false;

  browser.on('serviceUp', function(msg) {
    // console.log(msg);

    var output = {
      id: msg.fullname,
      type: msg.type.toString(),
      location: msg.addresses ? msg.addresses[1] : '',
      server: msg.host,
      timestamp: new Date(),
      state: 'serviceup',
      protocol: 'MDNS'
    };

    if(output.id) {
      instance.emit('*', output);
    }
  });

  browser.on('serviceDown', function(msg) {
    // console.log(msg);

    var output = {
      id: msg.name + '.' + msg.type.toString() + msg.replyDomain,
      type: msg.type.toString(),
      location: msg.addresses ? msg.addresses[1] : '',
      server: msg.host,
      timestamp: new Date(),
      state: 'servicedown',
      protocol: 'MDNS'
    };

    if(output.id) {
      instance.emit('*', output);
    }
  });
  
  instance.start = function () {
    if(!started) {
     browser.start();
     started = true; 
    }
  }
  
  return instance;
}