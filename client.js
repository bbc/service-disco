var Client = require('node-ssdp').Client,
    EventEmitter = require('events').EventEmitter;

module.exports.create = function (urn) {
  var instance = new EventEmitter(),
      client = new Client({ /*logLevel: 'TRACE'*/ });

  client.on('advertise-alive', function (msg) {
    console.log('GOOD DAY TO YOU');
    console.log(arguments);
    console.log('-----');
    instance.emit('keepalive', msg);
    instance.emit('*', 'keepalive', msg);
  });

  client.on('advertise-bye', function (msg) {
    console.log('FARE THEE WELL');
    console.log(arguments);
    console.log('-----');
    instance.emit('byebye', msg);
    instance.emit('*', 'byebye', msg);
  });

  client.on('response', function (headers, statusCode, rinfo) {
    try {
      console.log('Got a response to an m-search: ', statusCode);
      console.log('Headers', headers);
      console.log('rinfo', rinfo);
      console.log('-------');
    } catch(e) {
      console.error(e);
    }
    instance.emit('notify', headers);
    instance.emit('*', 'notify', headers);
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