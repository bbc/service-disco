var Client = require('node-ssdp').Client,
    EventEmitter = require('events').EventEmitter;

module.exports.create = function (urn) {
  var instance = new EventEmitter(),
      client = new Client({ /*logLevel: 'TRACE'*/ });

  client.on('advertise-alive', function (msg) {
    // console.log(arguments);
    var output = {
      id: msg.USN,
      type: msg.NT,
      location: msg.LOCATION,
      server: msg.SERVER,
      timestamp: new Date(),
      state: 'keepalive'
    };
    instance.emit('*', output);
  });

  client.on('advertise-bye', function (msg) {
    // console.log(arguments);
    var output = {
      id: msg.USN,
      type: msg.NT,
      location: msg.LOCATION,
      server: msg.SERVER,
      timestamp: new Date(),
      state: 'byebye'
    };
    instance.emit('*', output);
  });

  client.on('response', function (headers, statusCode, rinfo) {
    var msg = headers,
        output = {
          id: msg.USN,
          type: msg.NT,
          location: msg.LOCATION,
          server: msg.SERVER,
          timestamp: new Date(),
          state: 'notify'
        };
      
    instance.emit('*', output);
  });

  // search for a service type

  // Or get a list of all services on the network

  function search() {
    var urn = urn || 'ssdp:all';
    // var urn = 'urn:schemas-upnp-org:service:ConnectionManager:1';
    console.log('Search for ', urn);
    console.log('\n\n\n');
    client.search(urn);
  }

  // setInterval(search, 5000);

  instance.search = function () {
    search();
  };

  return instance;
}