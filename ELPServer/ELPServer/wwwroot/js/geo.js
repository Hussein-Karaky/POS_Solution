var map = null;
var marker = null;
var geocoder = null;
var cityCircle = null;
var radius = 3000;
var defaultZoom = 8;
var mapDom = null;

function initMap() {
    // The location of Uluru
    let uluru = { lat: -25.344, lng: 131.036 };
    // The map, centered at Uluru
    geocoder = new google.maps.Geocoder();
    mapDom = document.getElementById("map");
    if (mapDom === null || mapDom === undefined) {
        return false;
    }
    map = new google.maps.Map(
        mapDom,
        {
            zoom: 4,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            center: uluru
        });
    const input = document.getElementById("pac-input");
    const searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    // Bias the SearchBox results towards current map's viewport.
    map.addListener("bounds_changed", () => {
        searchBox.setBounds(map.getBounds());
    });
    let markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener("places_changed", () => {
        const places = searchBox.getPlaces();

        if (places.length === 0) {
            return;
        }
        // Clear out the old markers.
        markers.forEach(marker => {
            marker.setMap(null);
        });
        markers = [];
        // For each place, get the icon, name and location.
        const bounds = new google.maps.LatLngBounds();
        places.forEach(place => {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            const icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };
            // Create a marker for each place.
            markers.push(
                new google.maps.Marker({
                    map,
                    icon,
                    title: place.name,
                    position: place.geometry.location
                })
            );

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });

    tileListener = google.maps.event.addListener(map, 'tilesloaded', fixPaymentIssue);

    // The marker, positioned at Uluru
    marker = new google.maps.Marker({
        map: map, draggable: true,
        animation: google.maps.Animation.DROP
    });
    map.addListener('click', function (e) {
        placeMarkerAndPanTo(e.latLng, map, defaultZoom);
    });
    marker.addListener('dragend', function () {
        map.setZoom(defaultZoom);
        map.setCenter(marker.getPosition());
        cityCircle.setCenter(this.getPosition());
    });
    placeMarkerAndPanTo(uluru, map, 4);
};
function placeMarkerAndPanTo(latLng, map, zoom) {
    marker.setPosition(latLng);
    map.panTo(latLng);
    marker.setAnimation(google.maps.Animation.DROP);
    if (cityCircle !== null) {
        cityCircle.setMap(null);
    }
    cityCircle = new google.maps.Circle({
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        map,
        center: marker.position,
        radius: radius
    });
    map.setZoom(zoom);
};
function toggleBounce() {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
    }
};

function fixPaymentIssue() {
    if (mapDom === null || mapDom === undefined) {
        return false;
    }
    let mapDom = document.getElementById("map");
    if (mapDom !== null && mapDom !== undefined && mapDom.children.length > 1) {
        if (mapDom.children[1] !== null && mapDom.children[1] !== undefined) {
            mapDom.children[1].setAttribute("style", "display:none;");
        }
        if (mapDom.children[2] !== null && mapDom.children[2] !== undefined) {
            mapDom.children[2].setAttribute("style", "display:none;");
        }
    }
};

function codeAddress(address) {
    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);
            marker.setPosition(results[0].geometry.location);
        }
    });
};