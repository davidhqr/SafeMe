var platform = new H.service.Platform({
    'app_id': 'HJcQUexJFd6ee5XJaCQ1',
    'app_code': '_q7W4N0oGEkEG5RvgTXM0g'
});

var defaultLayers = platform.createDefaultLayers();
var mapContainer = document.getElementById('map-container');

var map = new H.Map(
    mapContainer,
    defaultLayers.normal.map);

window.addEventListener('resize', function () {
    map.getViewPort().resize();
});