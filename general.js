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
function setUpClickListener(amap) {
    // Attach an event listener to map display
    // obtain the coordinates and display in an alert box.
    map.addEventListener('tap', function (evt) {
        var coord = amap.screenToGeo(evt.currentPointer.viewportX,
            evt.currentPointer.viewportY);
        var lat = coord.lat.toFixed(4);
        var lng = coord.lng.toFixed(4);
        var coordStr = String(lat) + "," + String(lng);

        if (start) {
            document.getElementById('start').value = coordStr;
            var end = document.getElementById('end').value;
            var nums = end.split(",");
            for (var i = 0; i < nums.length; i++) {
                nums[i] = parseInt(nums[i]);
            }
            var rect = new H.map.Rect(new H.geo.Rect(lat, long, nums[0], nums[1]));
            map.addObject(rect);
        } else {
            
        }
    });
}
setUpClickListener(map);
var ui = H.ui.UI.createDefault(map, defaultLayers);
var bubble;

$(() => {
    $("#go").click(() => {
        var message = { Origin: $("#origin").val(), Destination: $("#destination").val() };
        //$.post('http://localhost:3000/messages', message);
        var origin = getCoords($("#origin").val());
        var destination = getCoords($("#destination").val());
        console.log(origin);
        calculateRoute(platform, origin, destination);
    });
});

function getCoords(stringLoc) {
    var geocoder = platform.getGeocodingService();
    var geocodingParams = { searchText: stringLoc };
    var location;
    geocoder.geocode(geocodingParams, (result) => {
        location = String(result.Response.View[0].Result[0].Location.DisplayPosition.Latitude) + ","
            + String(result.Response.View[0].Result[0].Location.DisplayPosition.Longitude);
    }, (error) => {
        alert("error!");
        return;
    });
    return location;
}

function doCall(urlToCall, callback) {

}

function calculateRoute(platform, origin, destination) {
    var router = platform.getRoutingService();
    var routeRequestParams = {
        mode: 'fastest;pedestrian',
        representation: 'display',
        routeattributes: 'summary,shape,legs',
        maneuverattributes: 'direction,action',
        waypoint0: "43.6629,-79.3957",
        waypoint1: "43.7615,-79.4111"
    };
    router.calculateRoute(routeRequestParams, (result) => {
        console.log(result);
        var route = result.response.route[0];
        addRouteShapeToMap(route);
        addManueversToMap(route);
    }, (error) => {
        alert('Ooops!');
    });
}

/**
 * Opens/Closes a infobubble
 * @param  {H.geo.Point} position     The location on the map.
 * @param  {String} text              The contents of the infobubble.
 */
function openBubble(position, text) {
    if (!bubble) {
        bubble = new H.ui.InfoBubble(
            position,
            // The FO property holds the province name.
            { content: text });
        ui.addBubble(bubble);
    } else {
        bubble.setPosition(position);
        bubble.setContent(text);
        bubble.open();
    }
}

/**
 * Creates a H.map.Polyline from the shape of the route and adds it to the map.
 * @param {Object} route A route as received from the H.service.RoutingService
 */
function addRouteShapeToMap(route) {
    var lineString = new H.geo.LineString(),
        routeShape = route.shape,
        polyline;

    routeShape.forEach(function (point) {
        var parts = point.split(',');
        lineString.pushLatLngAlt(parts[0], parts[1]);
    });

    polyline = new H.map.Polyline(lineString, {
        style: {
            lineWidth: 4,
            strokeColor: 'rgba(0, 128, 255, 0.7)'
        }
    });
    // Add the polyline to the map
    map.addObject(polyline);
    // And zoom to its bounding rectangle
    map.setViewBounds(polyline.getBounds(), true);
}


/**
 * Creates a series of H.map.Marker points from the route and adds them to the map.
 * @param {Object} route  A route as received from the H.service.RoutingService
 */
function addManueversToMap(route) {
    var svgMarkup = '<svg width="18" height="18" ' +
        'xmlns="http://www.w3.org/2000/svg">' +
        '<circle cx="8" cy="8" r="8" ' +
        'fill="#1b468d" stroke="white" stroke-width="1"  />' +
        '</svg>',
        dotIcon = new H.map.Icon(svgMarkup, { anchor: { x: 8, y: 8 } }),
        group = new H.map.Group(),
        i,
        j;

    // Add a marker for each maneuver
    for (i = 0; i < route.leg.length; i += 1) {
        for (j = 0; j < route.leg[i].maneuver.length; j += 1) {
            // Get the next maneuver.
            maneuver = route.leg[i].maneuver[j];
            // Add a marker to the maneuvers group
            var marker = new H.map.Marker({
                lat: maneuver.position.latitude,
                lng: maneuver.position.longitude
            },
                { icon: dotIcon });
            marker.instruction = maneuver.instruction;
            group.addObject(marker);
        }
    }

    group.addEventListener('tap', function (evt) {
        map.setCenter(evt.target.getPosition());
        openBubble(
            evt.target.getPosition(), evt.target.instruction);
    }, false);

    // Add the maneuvers group to the map
    map.addObject(group);
}