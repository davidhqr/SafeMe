// Initialize the platform object:
var platform = new H.service.Platform({
  'app_id': 'HJcQUexJFd6ee5XJaCQ1',
  'app_code': '_q7W4N0oGEkEG5RvgTXM0g'
});

var mapContainer = document.getElementById('map-container');

var defaultLayers = platform.createDefaultLayers();

var coordinates = {
  lat: 43.6544,
  lng: -79.3807
};

var mapOptions = {
  center: coordinates,
  zoom: 15
}

var map = new H.Map(mapContainer, defaultLayers.normal.map, mapOptions);
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
var ui = H.ui.UI.createDefault(map, defaultLayers);