var Server = require('node-ssdp').Server,
    ip = require('ip'),
    server = new Server({
      ssdpPort: 1900,
      udn: 'uuid:radiodan-of-dan',
      location: 'http://' + ip.address() + ':5000'
    });

server.addUSN('upnp:rootdevice');
server.addUSN('urn:schemas-upnp-org:device:MediaServer:1');
server.addUSN('urn:schemas-upnp-org:device:Radio:1');
server.addUSN('urn:schemas-upnp-org:service:ContentDirectory:1');
server.addUSN('urn:schemas-upnp-org:service:ConnectionManager:1');

server.on('advertise-alive', function (headers) {
  // Expire old devices from your cache.
  // Register advertising device somewhere
  // (as designated in http headers heads)
  // console.log('alive');
});

server.on('advertise-bye', function (headers) {
  // Remove specified device from cache.
  // console.log('byebye');
});

// start the server
server.start();

function stopServer() {
  // advertise shutting down and stop listening
  server.stop();
}

process.on('SIGINT', stopServer);
