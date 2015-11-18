// Render the Leaflet map, and setup controllers for the Legend, Crashes, and
// Paths.
OCEM.controller('mapController', ['$scope','$location','leafletData','getCrashes', 'getCrashesUserSubmitted', 'dataSettings',
function ($scope, $location, leafletData, getCrashes, getCrashesUserSubmitted, dataSettings) {
    // Provide a key that will let sub-controllers know when the map is ready to
    // draw on (data is loaded and leaflet is setup):
    $scope.leafletLoaded = false;

    // keyToHumanReadables defines the kinds of data that will show up on the
    // map legend (things you can color the accidents by). If its not defined
    // here its NOT on the map!
    $scope.keyToHumanReadables = {};
    $scope.keyToHumanReadables['crash.ambulance'] = dataSettings.description('crash','ambulance');
    $scope.keyToHumanReadables['crash.weather'] = dataSettings.description('crash','weather');
    $scope.keyToHumanReadables['crash.light_conditions'] = dataSettings.description('crash','light_conditions');
    $scope.keyToHumanReadables['crash.road_conditions'] = dataSettings.description('crash','road_conditions');
    $scope.keyToHumanReadables['crash.workzone'] = dataSettings.description('crash','workzone');
    $scope.keyToHumanReadables['biker.alcohol'] = dataSettings.description('biker','alcohol');
    $scope.keyToHumanReadables['biker.injury'] = dataSettings.description('biker','injury');
    $scope.keyToHumanReadables['biker.race'] = dataSettings.description('biker','race');
    $scope.keyToHumanReadables['biker.sex'] = dataSettings.description('biker','sex');
    $scope.keyToHumanReadables['biker.position'] = dataSettings.description('biker','position');
    $scope.keyToHumanReadables['biker.direction'] = dataSettings.description('biker','direction');
    $scope.keyToHumanReadables['driver.alcohol'] = dataSettings.description('driver','alcohol');
    $scope.keyToHumanReadables['driver.injury'] = dataSettings.description('driver','injury');
    $scope.keyToHumanReadables['driver.race'] = dataSettings.description('driver','race');
    $scope.keyToHumanReadables['driver.sex'] = dataSettings.description('driver','sex');
    $scope.keyToHumanReadables['driver.estimated_speed'] = dataSettings.description('driver','estimated_speed');
    $scope.keyToHumanReadables['driver.vehicle_type'] = dataSettings.description('driver','vehicle_type');

    // Get the schema metadata for an option, or the data for an option.
    //
    // Parameters:
    //   option: like 'biker.alcohol'
    //   data: The data to select from. If not supplied then this function
    //   returns the schema data from dataSettings.
    //
    // Returns metadata.
    $scope.getDataForOptionString = function(option,data) {
        var categoryAndMetric = option.split('.');
        if (data) {
            return $.trim(data[categoryAndMetric[0]][categoryAndMetric[1]]);
        }
        return dataSettings.data(categoryAndMetric[0],categoryAndMetric[1]);
    };

    $scope.wrecks = [];
    $scope.accident = null;

    $scope.defaults = {
        scrollWheelZoom: false,
        maxZoom: 17,
        minZoom: 12
    };
    // If there is location & zoom GET params, use those values if they
    // parse:
    var z = parseInt($location.search().z);
    $scope.center = {
        lat: parseFloat($location.search().lat) || 35.9886,
        lng: parseFloat($location.search().lon) || -78.9072,
        // respect min/max
        zoom: _.inRange(z,$scope.defaults.minZoom,$scope.defaults.maxZoom+1) ? z:$scope.defaults.minZoom
    };
    $scope.layers = {
        baselayers: {
            xyz: {
                name: "CartoDB",
                url: "http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
                type: "xyz"
            }
        }
    };

    // account for the change in 'units per pixel' on the map:
    $scope.widthScale = d3.scale.linear()
        .domain([$scope.defaults.minZoom,$scope.defaults.maxZoom])
        .range([3/0.025,0.5/0.025]);

    getCrashes.then(function(result) {
        $scope.crashes = _.values(result);
        return leafletData.getMap('map_canvas');
    }).then(function(leafletMap) {
        $scope.map = leafletMap;
        return getCrashesUserSubmitted;
    }).then(function(result) {
        // Remove any accidents that don't have lat/lng:
        $scope.userCrashes = _.filter(result.data, function(v) {
            return v.location.latitude && v.location.longitude;
        });
    }).then(function() {
        L.d3SvgOverlay(function(selection, projection) {
            $scope.d3selection = selection;
            $scope.d3projection = projection;
            $scope.leafletLoaded = true;
            $('.leaflet-control-layers-toggle').hide();
        }).addTo($scope.map);
    }).catch(function(err) {
        console.error(err);
    });
}]);
