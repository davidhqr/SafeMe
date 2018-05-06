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

$(() => {
    $("#go").click(() => {
        console.log("click");
        var message = { Origin: $("#origin").val(), Destination: $("#destination").val() };
        //$.post('http://localhost:3000/messages', message);
        var origin = getCoords($("#origin").val());
        var destination = getCoords($("#destination").val());
        calculateRoute(platform, origin, destination);
    });
});

function getCoords(stringLoc) {
    var geocoder = platform.getGeocodingService();
    var geocodingParams = { searchText: stringLoc };
    geocoder.geocode(geocodingParams, (result) => {
        return result.Response.View.Result.Location.DisplayPosition.Latitude + ","
            + result.Response.View.Result.Location.DisplayPosition.Longitude;
    });
}

function calculateRoute(platform, origin, destination) {
    var router = platform.getRoutingService();
    var routeRequestParams = {
        mode: 'fastest;car',
        representation: 'display',
        routeattributes: 'waypoints,summary,shape,legs',
        maneuverattributes: 'direction,action',
        waypoint0: origin,
        waypoint1: desination
    };
    router.calculateRoute(routeRequestParams, (result) => {
        var route = result.response.route[0];
        addRouteShapeToMap(route);
        addManueversToMap(route);
    }, (error) => {
        alert('Ooops!');
    });
}