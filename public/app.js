var table = new Ractive({
  el: 'container',
  template: '#template',
  data: { 
    services: [], 
    sortColumn: 'state',
    sort: function ( array, column ) {
      array = array.slice(); // clone, so we don't modify the underlying data

      return array.sort( function ( a, b ) {
        return a[ column ] < b[ column ] ? -1 : 1;
      });
    },
    time: function (date) {
      return moment(date).format('HH:mm:ss');
    },
    ago: function (date) {
      return moment(date).fromNow();
    }
  }
});

/*
  Trigger a scan when button is pressed
*/
document.querySelector('button')
        .addEventListener('click', scan);

var isScanningId;

function isScanning() {
  if (isScanningId) { return; }

  document.querySelector('body')
          .classList
          .add('is-scanning');

  isScanningId = window.setTimeout(function () {
    document.querySelector('body')
            .classList.remove('is-scanning');
    isScanningId = null;
  }, 1000);
}

function scan () {
  var img = new Image();
  img.src = '/scan';
  isScanning();
};

var services = table.get('services');

var stream = new EventSource('/events');
stream.addEventListener('message', function (evt) {
  isScanning();

  var json = JSON.parse(evt.data);
  console.log('message', json);

  var service = _.find(services, { id: json.id });

  if (service) {
    service.seen = json.timestamp;
    service.state = json.state;

    if(json.location) {
      service.location = json.location;
    }

    if(json.server) {
      service.server = json.server;
    }

    table.update();
  } else {
    services.push(json);
  }        
}); 