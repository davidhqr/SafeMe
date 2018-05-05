var platform = new H.service.Platform({
    'app_id': 'HJcQUexJFd6ee5XJaCQ1',
    'app_code': '_q7W4N0oGEkEG5RvgTXM0g'
});

// Obtain the default map types from the platform object:
var defaultLayers = platform.createDefaultLayers();

// Instantiate (and display) a map object:
var map = new H.Map(
  document.getElementById('mapContainer'),
  defaultLayers.normal.map,
  {
    zoom: 10,
    center: { lat: 43.6052, lng: -79.6032 }
  });
