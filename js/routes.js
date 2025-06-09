$(document).ready(function() {
    NearByMapFunctions.initialize('43.3898652', '-80.4047788')
})


ShowMapPopup = (element) => {
    const title = $(element).data('title')
    const url = $(element).data('url')
    $('#routeModalHeading').html(title)
    $('#modelFrame').attr('src', url)
    $('.routeModal').addClass('is-visible')
}

closePopup = () => {
    $('.routeModal').removeClass('is-visible')
}


const NearByMapFunctions = (function () {
    var map, myLatlng = {}, marker = {}, markersList = [], directionsService = {}, directionsDisplay = {};

    function InitializeNearByMap(lat, lang) {
        myLatlng = new google.maps.LatLng(lat, lang);
        directionsService = new google.maps.DirectionsService;
        directionsDisplay = new google.maps.DirectionsRenderer;
        map = new google.maps.Map(document.getElementById('googleMaplocation'), {
            zoom: 15,
            center: myLatlng
        });
        marker = new google.maps.Marker({
            zoom: 19,
            position: myLatlng,
            map: map,
            icon: {
                url: 'Images/mapplotter.png',
                Size: new google.maps.Size(30, 30)
            }
        });
        markersList.push(marker);
    }

    function GetDirections(origincoordinates, destinationcooradinates) {
        directionsDisplay.setMap(null);
        directionsService.route({
            origin: origincoordinates,
            destination: destinationcooradinates,
            travelMode: 'DRIVING'
        }, function (response, status) {
            if (status === 'OK') {
                directionsDisplay.setDirections(response);
                directionsDisplay.setMap(map);
                directionsDisplay.setOptions({
                    suppressMarkers: true,
                    polylineOptions: {
                        strokeColor: '#bd1261'
                    }
                });
            } else {
                directionsDisplay.setMap(null);
                console.log(response);
                window.alert('Directions request failed due to ' + status);
            }
        });
    }

    function ClearMapMarkers() {
        for (var i = 0; i < markersList.length; i++) {
            markersList[i].setMap(null);
        }
    }

    return {
        initialize: function (lat, lang) {
            InitializeNearByMap(lat, lang);
        },
        plotmarkers: function (LocationTypeId) {
            PlotNearByMarkers(LocationTypeId);
        },
        navigate: function (origincoordinates, destinationcooradinates) {
            GetDirections(origincoordinates, destinationcooradinates);
        }
    };
})();

const ShowNearbyCategory = (Element) => {
    if (Element.hasClass('collapsed')) {
        Element.click();
    } else {
        NearByMapFunctions.plotmarkers(Element.data('locationtypeid'));
    }
};

const MapViewMap = (function () {
    var map, markersList = [];

    function InitializeMapViewMap() {
        map = new google.maps.Map(document.getElementById('PropertySearchMap'), {
            zoom: zoomlevel,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            zoomControl: true,
            mapTypeControl: true,
            scaleControl: false,
            streetViewControl: false,
            rotateControl: true,
            fullscreenControl: true
        });

    }

    function PlotMapViewMarkers(markersList) {
        if (markersList.length > 0) {
            map.setCenter(new google.maps.LatLng(markersList[0].lat, markersList[0].lng));
        } else {
            map.setCenter(new google.maps.LatLng(12.989991, 77.645392));
        }
        ClearMapMarkers();
        $.each(markersList, function (i, data) {
            var myLatlng = new google.maps.LatLng(data.lat, data.lng);
            var image;
            image = { url: '/assets/images/location_pin.png' };
            var marker = new google.maps.Marker({
                position: myLatlng,
                map: map,
                title: data.title,
                animation: google.maps.Animation.DROP,
                icon: image
            });
            var infoWindow = new google.maps.InfoWindow();
            markersList.push(marker);

            google.maps.event.addListener(marker, "click", function (e) {
                infoWindow.setContent('<div class="map-card">\
                    <a href="/property/' + data.link + '" target="_blank"> \
                        <div class="map-view-card"> \
                            <div class="house-card" style="position: relative"> \
                                <img alt="' + data.title + '" style="" class="mapcard-img property-img" src="' + data.imageName + '"> \
                            </div> \
                            <div class="map-listed-detail"> \
                                <h3 class="ellipsify ng-binding">' + data.title + '</h3> \
                    <i class="fa fa-heart-o"></i>\
                                <p class="card-item ellipsify ng-binding"><img src="/assets/images/marker.png" class="pl-1" alt=""><span class="spanAdditional">' + data.description + '</span></p> \
                                <div class="card-lower-row"> \
                                    <div class="house-rent"> \
                                        <p>Starting price</p><br/>\
                                        <div class="house-rent-value binding"><span class="small-font binding">Rs. ' + data.price + '</span></div> \
                                    </div> <br>\
                                    <div class="view-property"> \
                                       <p><a href="/property/' + data.link + '" target="_blank"> View Property</a></p> \
                                    </div> \
                                </div> \
                            </div> \
                        </div> \
                    </a>\
                </div>');
                infoWindow.open(map, marker);
            });

            google.maps.event.addListener(marker, 'mouseout', function () {
                infowindow.close();
            });

        });
    }

    function ClearMapMarkers() {
        for (var i = 0; i < markersList.length; i++) {
            markersList[i].setMap(null);
        }
    }

    return {
        initialize: function () {
            InitializeMapViewMap();
        },
        plotmarkers: function (MarkersList) {
            PlotMapViewMarkers(MarkersList);
        }
    };
})();





