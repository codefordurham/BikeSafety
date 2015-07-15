// Render the Leaflet map, and setup controllers for the Legend, Crashes, and
// Paths.
OCEM.controller('mapController', ['$scope','$location','leafletData','getCrashes', 'getCrashesUserSubmitted', 'dataSettings',
function ($scope, $location, leafletData, getCrashes, getCrashesUserSubmitted, dataSettings) {
    // Provide a key that will let sub-controllers know when the map is ready to
    // draw on (data is loaded and leaflet is setup):
    $scope.leafletLoaded = false;

    $scope.keyToHumanReadables = {};
    $scope.keyToHumanReadables['crash.ambulance'] = dataSettings.description('crash','ambulance');
    $scope.keyToHumanReadables['crash.weather'] = dataSettings.description('crash','weather');
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
    // TODO biker.age - increments of 5 years?

    // Get the schema metadata for an option, or the data for an option.
    //
    // Parameters:
    //   option: like 'biker.alcohol'
    //   data: The data to select from. If not supplied then this function
    //   returns the schema data from dataSettings.
    $scope.getDataForOptionString = function(option,data) {
        var categoryAndMetric = option.split('.');
        if (data) {
            return $.trim(data[categoryAndMetric[0]][categoryAndMetric[1]]);
        }
        return dataSettings.data(categoryAndMetric[0],categoryAndMetric[1]);
    };

    $scope.metadata = $scope.getDataForOptionString('biker.alcohol');

    $scope.wrecks = [];
    $scope.accident = null;

    $scope.defaults = {
        scrollWheelZoom: false,
        maxZoom: 17,
        minZoom: 12
    };
    $scope.center = {
        lat: 35.9886,
        lng: -78.9072,
        zoom: 12
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

    $scope.setupAccidentColors = function() {
        $scope.selectedOption = $('#color_combo option:selected').val();
        $scope.metadata = $scope.getDataForOptionString($scope.selectedOption);
        $scope.categoryColors = d3.scale.category10();
        if (_.has($scope.metadata,'colors')) {
            $scope.categoryColors = $scope.metadata.colors;
        }
        // Trim the bike_injur field b/c some of the fields have " Injury"
        // and others have "Injury".
        $scope.accidentLabel = d3.set($scope.crashes.concat($scope.userCrashes).map(function(d) {
            return $scope.getDataForOptionString($scope.selectedOption,d);
        })).values();
        if (_.has($scope.metadata,'options')) {
          // Append any missing values to the end of the values that we expect
          // for this data type:
          var extraValues = _.difference($scope.accidentLabel,$scope.metadata.options);
          $scope.accidentLabel = $scope.metadata.options.concat(extraValues);
        }
        $scope.accidentColor = _.map($scope.accidentLabel, function(type) {
            return $scope.categoryColors(type);
        });
        d3.select('.accidentLegend .rows')
            .selectAll('div')
            .remove();
        d3.select('.accidentLegend .rows')
            .selectAll('div')
            .data($scope.accidentLabel)
            .enter().append('div')
            .html(function(d, i) {
                return '<div class="legend-line"><div class="legend-circle inline" style="background-color:'+ $scope.accidentColor[i] +'"></div><div class="legend-label inline">'+ d +'</div></div>';
            });
    };
    $('#color_combo').change(function() {
        $scope.setupAccidentColors();
        $scope.$apply();
    });

    $scope.widthScale = d3.scale.pow().domain([12, 13, 14, 15, 16, 17]).range([2, 4, 8, 16, 32, 64]);

    getCrashes.then(function(result) {
        $scope.crashes = result;
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
            $scope.setupAccidentColors();
            $scope.leafletLoaded = true;
        }).addTo($scope.map);
    }).catch(function(err) {
        console.error(err);
    });
}]);
