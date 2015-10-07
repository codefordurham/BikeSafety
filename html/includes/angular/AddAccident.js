function mixin(a, b) {
    for (var p in b) {
        a[p] = b[p];
    }

    return a;
}

function person(extra) {
    return mixin({
      age: 'Unknown',
      alcohol: 'Unknown',
      injury: 'Unknown',
      race: 'Unknown',
      sex: 'Unknown'
    }, extra);
}

function submitCrash(result, data) {
    var crashTemplate = {
        biker: person({
            direction: 'Unknown',
            position: 'Unknown'
        }),
        driver: person({
            estimated_speed: 'Unknown',
            vehicle_type: 'Unknown'
        }),
        crash: {
            ambulence: 'Unknown',
            group: 'Unknown',
            hit_and_run: 'Unknown',
            light_conditions: 'Unknown',
            location: 'Unknown',
            road_conditions: 'Unknown',
            road_defects: 'Unknown',
            timestamp: 'Unknown',
            type: 'Unknown',
            weather: 'Unknown',
            workzone: 'Unknown'
        },
        location: {
            characteristics: 'Unknown',
            city: 'Durham',
            class: 'Unknown',
            configuration: 'Unknown',
            county: 'Durham',
            development: 'Unknown',
            feature: 'Unknown',
            lanes: 'Unknown',
            latitude: 'Unknown',
            locality: 'Unknown',
            longitude: 'Unknown',
            region: 'Unknown',
            rural_urban: 'Unknown',
            speed_limit: 'Unknown',
            surface: 'Unknown',
            traffic_control: 'Unknown'
        }
    };

    for (cat in data) {
        mixin(crashTemplate[cat], data[cat]);
    }

    var crash = result.db.push();
    crash.set(crashTemplate);
    result.data.push(crashTemplate);
}

angular.module('BikeSafety').controller('addAccidentController', ['$scope','$location','getCrashesUserSubmitted','dataSettings', 'leafletData',
function ($scope, $location, getCrashesUserSubmitted, dataSettings, leafletData) {
  $scope.dataSettings = dataSettings;

  $scope.ambulance = "Unknown";
  $scope.weather = "Unknown";
  $scope.bike_injury = "Unknown";
  $scope.bike_sex = "Unknown";
  $scope.bike_race = "Unknown";
  $scope.bike_alcohol = "Unknown";
  $scope.driver_injury = "Unknown";
  $scope.driver_sex = "Unknown";
  $scope.driver_race = "Unknown";
  $scope.driver_estimated_speed = "Unknown";
  $scope.driver_alcohol = "Unknown";
  $scope.date_known = false;
  $scope.date_time = new Date();
  $scope.center = {
    lat: 35.9886,
    lng: -78.9072,
    zoom: 15
  };
  $scope.markers = {
    Location: {
      lat: 35.9886,
      lng: -78.9072,
      message: "Crash location",
      focus: true,
      draggable: true
    }
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

  var updatePosition = function(position,skipApply) {
      $scope.lookingUpLocation = false;
      $scope.center.lat = position.coords.latitude;
      $scope.center.lng = position.coords.longitude;
      $scope.markers.Location.lat = position.coords.latitude;
      $scope.markers.Location.lng = position.coords.longitude;
      if (!skipApply) {
          $scope.$apply();
      }
  };
  $scope.$on('leafletDirectiveMarker.dragend', function(event, args) {
      updatePosition({
          coords: {
              latitude: args.model.lat,
              longitude: args.model.lng
          }
      },true);
  });
  var showPositionError = function(err) {
      $scope.lookingUpLocation = false;
      $scope.positionError = true;
  };
  if (navigator.geolocation) {
      $scope.lookingUpLocation = true;
      navigator.geolocation.getCurrentPosition(updatePosition,showPositionError);
  }

  $scope.addAccident = function() {
    var dataset;
    getCrashesUserSubmitted.then(function(result) {
        var newDataPoint = {
            biker: {
                injury: $scope.bike_injury,
                sex: $scope.bike_sex,
                race: $scope.bike_race,
                alcohol: $scope.bike_alcohol
            },
            driver: {
                injury: $scope.driver_injury,
                sex: $scope.driver_sex,
                race: $scope.driver_race,
                estimated_speed: $scope.driver_estimated_speed,
                alcohol: $scope.driver_alcohol
            },
            crash: {
                ambulance: $scope.ambulance,
                weather: $scope.weather,
                timestamp: $scope.date_known ? $scope.date_time.toISOString():"Unknown"
            },
            location: {
                latitude: $scope.markers.Location.lat,
                longitude: $scope.markers.Location.lng
            }
        };
        submitCrash(result, newDataPoint);
        $location.search({
            lat: newDataPoint.location.latitude,
            lon: newDataPoint.location.longitude,
            z: 17
        });
        $location.path("/");
        $scope.accidentPosted = true;
    });
  };
}]);
