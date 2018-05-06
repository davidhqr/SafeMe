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
var currentRect;

function getRect(lat1, lng1, lat2, lng2) {
    var rect;
    if (lat1 > lat2) {
        if (lng1 > lng2) {
            rect = new H.map.Rect(new H.geo.Rect(lat1, lng2, lat2, lng1));
        } else {
            rect = new H.map.Rect(new H.geo.Rect(lat1, lng1, lat2, lng2));
        }
    } else {
        if (lng1 > lng2) {
            rect = new H.map.Rect(new H.geo.Rect(lat2, lng2, lat1, lng1));
        } else {
            rect = new H.map.Rect(new H.geo.Rect(lat2, lng1, lat1, lng2));
        }
    }
    return rect;
}

function setUpClickListener(amap) {
    // Attach an event listener to map display
    // obtain the coordinates and display in an alert box.
    map.addEventListener('tap', function (evt) {
        var coord = amap.screenToGeo(evt.currentPointer.viewportX,
            evt.currentPointer.viewportY);
        var lat = coord.lat.toFixed(4);
        var lng = coord.lng.toFixed(4);
        var coordStr = String(lat) + "," + String(lng);

        if (document.getElementById('start-switch').checked) {
            document.getElementById('start').value = coordStr;
            var end = document.getElementById('end').value;
            var nums = end.split(",");
            if (nums == null || nums.length < 2) {
                return;
            }
            for (var i = 0; i < nums.length; i++) {
                nums[i] = parseFloat(nums[i]);
            }
            var rect = getRect(lat, lng, nums[0], nums[1]);
            map.addObject(rect);
            if (currentRect != null) {
                map.removeObject(currentRect);
            }
            currentRect = rect;
        } else {
            document.getElementById('end').value = coordStr;
            var start = document.getElementById('start').value;
            var nums = start.split(",");
            if (nums == null || nums.length < 2) {
                return;
            }
            for (var i = 0; i < nums.length; i++) {
                nums[i] = parseFloat(nums[i]);
            }
            var rect = getRect(lat, lng, nums[0], nums[1]);
            map.addObject(rect);
            if (currentRect != null) {
                map.removeObject(currentRect);
            }
            currentRect = rect;
        }
    });
}

setUpClickListener(map);
var ui = H.ui.UI.createDefault(map, defaultLayers);
var bubble;

$(() => {
    document.getElementById("start-switch").checked = true;
    
    $("#go").click(() => {
        if (!$('#go').hasClass("disabled")) {
            getCoords($("#ac1").val(), $("#ac2").val());
        }
    });

    $("#submit").click(() => {
        var message = { Start: $("#start").val(), End: $("#end").val() };
        var end = document.getElementById('end').value;
        var ends = end.split(",");
        var start = document.getElementById('start').value;
        var starts = start.split(",");

        if (starts[0] > ends[0]) {
            if (starts[1] > ends[1]) {
                message = { Lat1: starts[0], Lng1: ends[1], Lat2: ends[0], Lng2: starts[1] };
            } else {
                message = { Lat1: starts[0], Lng1: starts[1], Lat2: ends[0], Lng2: ends[1] };
            }
        } else {
            if (starts[1] > ends[1]) {
                message = { Lat1: ends[0], Lng1: ends[1], Lat2: starts[0], Lng2: starts[1] };
            } else {
                message = { Lat1: ends[0], Lng1: starts[1], Lat2: starts[0], Lng2: ends[1] };
            }
        }

        if ($("#safe").val() === "Very Unsafe" || $("#safe").val() === "Slightly Unsafe") {
            $.post('http://localhost:3000/messages', message);
        }
        alert("Submitted! Route guidance will take this region into account.");
    });

    $("#clear2").click(() => {
        document.getElementById('start').value = "";
        document.getElementById('end').value = "";
        document.getElementById('safe').value = "Select";
        document.getElementById('start-switch').checked = true;
        document.getElementById('end-switch').checked = false;
        document.getElementById("start").disabled = false;
        document.getElementById("end").disabled = true;
    });
});

function toggle(element) {
    if (element.checked) {
        if (element.id === "start-switch") {
            document.getElementById('end-switch').checked = false;
            document.getElementById("end").disabled = true;
            document.getElementById("start").disabled = false;
        } else {
            document.getElementById('start-switch').checked = false;
            document.getElementById("start").disabled = true;
            document.getElementById("end").disabled = false;
        }
    } else {
        if (element.id === "start-switch") {
            document.getElementById('end-switch').checked = true;
            document.getElementById("start").disabled = true;
            document.getElementById("end").disabled = false;
        } else {
            document.getElementById('start-switch').checked = true;
            document.getElementById("end").disabled = true;
            document.getElementById("start").disabled = false;
        }
    }
}

function getCoords(origin, destination) {
    var geocoder = platform.getGeocodingService();
    geocoder.geocode({ searchtext: origin }, (result) => {
        var location1 = String(result.Response.View[0].Result[0].Location.DisplayPosition.Latitude) + ","
            + String(result.Response.View[0].Result[0].Location.DisplayPosition.Longitude);
        geocoder.geocode({ searchtext: destination }, (result1) => {
            var location2 = String(result1.Response.View[0].Result[0].Location.DisplayPosition.Latitude) + ","
                + String(result1.Response.View[0].Result[0].Location.DisplayPosition.Longitude);
            calculateRoute(platform, location1, location2);
        }, (error) => {
            alert("error!");
            return;
        });
    }, (error) => {
        alert("error!");
        return;
    });
    return location;
}

function calculateRoute(platform, origin, destination) {
    $.get('http://localhost:3000/messages', (data) => {
        var router = platform.getRoutingService();
        var append = "";
        for (var i = 0; i < data.length; i++) {
            append += data[i].Lat1 + "," + data[i].Lng1 + ";" + data[i].Lat2 + "," + data[i].Lng2;
            if (i < data.length - 1) {
                append += "!";
            }
            console.log(append);
            rect = new H.geo.Rect(data[i].Lat1, data[i].Lng2, data[i].Lat2, data[i].Lng1);
            map.addObject(new H.map.Rect(rect, {
                style: {
                    fillColor: 'rgba(244, 121, 131, 0.5)',
                    strokeColor: 'rgb(195, 39, 43)',
                },
            }));
        }
        var routeRequestParams = {
            mode: 'fastest;pedestrian',
            representation: 'display',
            routeattributes: 'summary,shape,legs',
            maneuverattributes: 'direction,action',
            waypoint0: origin,
            waypoint1: destination,
            avoidareas: append
        };
        router.calculateRoute(routeRequestParams, (result) => {
            console.log(result);
            var route = result.response.route[0];
            addRouteShapeToMap(route);
            addManueversToMap(route);
            $('#go').addClass("disabled");
        }, (error) => {
            alert('Ooops!');
        });
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