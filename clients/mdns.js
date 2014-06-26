var mdns = require('mdns'),
    EventEmitter = require('events').EventEmitter,
    browsers = {};
    serviceType = mdns.makeServiceType({name: 'http', protocol: 'tcp'});

module.exports.create = function (service) {
  var instance = new EventEmitter(),
      browser,
      started;

  // If browser exists for service
  if ( service && browsers[service] ) {
    browsers[service].on('serviceUp', createServiceUpHandler(instance));
    browsers[service].on('serviceDown', createServiceDownHandler(instance));
  // If no browser for service
  } else if ( service ) {
    browsers[service] = createBrowserWithHandlers(service, instance);
  // Browse everything 
  } else {
    service = '*';
    browsers[service] = mdns.browseThemAll();
    browsers[service].on('serviceUp', function (msg) {
      var service = mdns.makeServiceType(
        { name: msg.type.name, protocol: msg.type.protocol }
      );
      browsers[service] = createBrowserWithHandlers(service, instance);
      if (started) {
        browsers[service].start();
        browsers[service].started = true;
      }
    });
  }

  instance.start = function () {
    Object.keys(browsers).forEach(function (service) {
      if(!browsers[service].started) {
        browsers[service].start();
        browsers[service].started = true; 
      }
    });
    started = true;
  }

  return instance;
}

function createBrowserWithHandlers(service, instance) {
    var type = mdns.makeServiceType(service);
    var browser = mdns.createBrowser(type);
    browser.on('serviceUp', createServiceUpHandler(instance));
    browser.on('serviceDown', createServiceDownHandler(instance));
    return browser;
}

function createServiceUpHandler(instance) {
  return function serviceUp(msg) {
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
  }
}

function createServiceDownHandler(instance) {
  return function serviceDown(msg) {
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
  }
}
