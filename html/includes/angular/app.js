var OCEM = angular.module('BikeSafety', ['ngRoute', 'ui.bootstrap', 'ui.mask','firebase', 'leaflet-directive']);

OCEM.constant('_',window._);

OCEM.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
    .when('/', {
        templateUrl: '/partials/MainMap',
        controller: 'mapController'
    })
    .when('/addAccident', {
        templateUrl: '/partials/AddAccident',
        controller: 'addAccidentController'
    })
    .otherwise({
        redirectTo: '/'
    });
}]);

function makeMapColoredLinearly(arr,colors) {
    var result = {};
    var domainIntervals = d3.scale.ordinal()
        .domain(_.range(colors.length))
        .rangePoints([0,arr.length-1]);
    var arrayColorsFunction = d3.scale.linear()
        .domain(domainIntervals.range())
        .interpolate(d3.interpolateRgb)
        .range(colors);
    _.forEach(arr,function(val,index) {
        result[val] = arrayColorsFunction(index);
    });
    return result;
}

var booleans = [
    'Unknown',
    'Yes',
    'No'
];
var injuries = [
    'Unknown', 'Routine', 'Immediate', 'Surgical'
];
var races = [
    'Unknown',
    'Asian',
    'Black',
    'Hispanic',
    'White',
    'Other'
];
var genders = [ 'Unknown', 'Female', 'Male' ];
var booleanColorsFunction = function(d) {
    var booleanColors = {
        Male: '#FA6019',
        Female: '#4E98C6',
        No: '#FA6019',
        Yes: '#4E98C6',
        Unknown: '#AFAF6E',
        Missing: '#AFAF6E', // TODO when we clean up the data, this can go away
        "": '#AFAF6E' // TODO when we clean up the data, this can go away
    };
    return booleanColors[d];
};
var speeds = [
    'Unknown',
    '0-5 mph',
    '6-10 mph',
    '11-15 mph',
    '16-20 mph',
    '21-25 mph',
    '26-30 mph',
    '31-35 mph',
    '36-40 mph',
    '41-45 mph',
    '46-50 mph',
    '51-55 mph',
    '56-60 mph'
];
var speedColorMap = makeMapColoredLinearly(speeds.slice(1),colorbrewer.RdYlGn[10].reverse());
// TODO when the data is cleaned up this can go away
speedColorMap.Unknown = '#AFAF6E';
speedColorMap[''] = '#AFAF6E';
var speedColorsFunction = function(d) {
    return speedColorMap[d];
};

var bikerAndDriver = {
    age: {
        description: 'Age'
    },
    alcohol: {
        description: 'Drunk?',
        type: 'list',
        options: booleans,
        colors: booleanColorsFunction,
    },
    injury: {
        description: 'Injury',
        type: 'list',
        options: injuries
    
    },
    race: {
        description: 'Race',
        type: 'list',
        options: races
    },
    sex: {
        description: 'Gender',
        type: 'list',
        options: genders,
        colors: booleanColorsFunction
    }
};

var biker = _.cloneDeep(bikerAndDriver);
biker.position = {
    options: ["Unknown","Bike Lane / Paved Shoulder","Driveway / Alley",
            "Non-Roadway", "Not Applicable", "Other",
            "Sidewalk / Crosswalk / Driveway Crossing",
            ],
    description: 'Location'
};
biker.direction = {
    options: ["Unknown","Facing Traffic","With Traffic",
              "Not Applicable"],
    description: 'Direction'
};
_.each(biker, function(v) {
    v.description = 'Bicyclist '+ v.description;
});

var driver = _.cloneDeep(bikerAndDriver);
driver.estimated_speed = {
    description: 'Speed',
    type: 'list',
    options: speeds,
    colors: speedColorsFunction
};
_.each(driver, function(v) {
    v.description = 'Driver '+ v.description;
});
driver.vehicle_type = {
    description: 'Vehicle Type'
};

// The key names listed below match the column names in the Firebase table:
//
// The keys for each data item are used to render the legend on the map, and
// to populate the options on the 'add accident' page.
//
// Key details:
//   description:
//   type: Used to determine how to render the add accident form
//   options: For 'list' types, the list of valid options.
//   colors: A function that maps a value to a color. Used by the D3 library
//     to pick the color of the data point (and render the legend). If not
//     provided category10 is used.
var dataSetMapping = {
    biker: biker,
    crash: {
        ambulance: {
            description: 'Ambulance Called?',
            type: 'list',
            options: booleans,
            colors: booleanColorsFunction
        },
        group: {},
        hit_and_run: {},
        light_conditions: {},
        location: {},
        road_conditions: {},
        road_defects: {},
        timestamp: {},
        type: {},
        weather: {
            description: 'Weather',
            type: 'list',
            options: [
                'Unknown',
                'Clear',
                'Cloudy',
                'Rain'
            ]
        },
        workzone: {}
    },
    driver: driver,
    location: {
        characteristics: {},
        city: {},
        class: {},
        configuration: {},
        county: {},
        development: {},
        feature: {},
        lanes: {},
        latitude: {},
        longitude: {},
        region: {},
        rural_urban: {},
        speed_limit: {},
        surface: {},
        traffic_control: {}
    }
};

OCEM.service('dataSettings', function() {
    return {
        description: function(category, metric) {
            return dataSetMapping[category][metric].description || category +'.'+ metric;
        },
        data: function(category, metric) {
            return dataSetMapping[category][metric];
        }
    };
});

OCEM.service('getPaths', function($http) {
    return $http.get('/data/durham-bike-lanes.topojson');
});

OCEM.service('getCrashes', function($q, $firebase) {
    $('#pleaseWaitDialog').modal('show');
    var deferred = $q.defer();
    var ref = new Firebase('https://bikesafety.firebaseio.com/Crashes_Sanitzed');
    ref.once('value', function(snapshot){
        deferred.resolve(snapshot.val());
        $('#pleaseWaitDialog').modal('hide');
    });
    return deferred.promise;
});

OCEM.service('getCrashesUserSubmitted', function($q, $firebase) {
    $('#pleaseWaitDialog').modal('show');
    var deferred = $q.defer();
    var ref = new Firebase('https://bikesafety.firebaseio.com/CrashesUserSubmitted_Sanitized');
    ref.once('value', function(snapshot){
        deferred.resolve({
          data: _.values(snapshot.val()),
          db: ref
        });
        $('#pleaseWaitDialog').modal('hide');
    });
    return deferred.promise;
});

OCEM.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push(function() {
        return {
            request: function(request) {
                if (request.method === 'GET') {
                    if (request.url.indexOf('.') === -1) {
                        var sep = request.url.indexOf('?') === -1 ? '?' : '&';
                        request.url = request.url + sep + 'cacheBust=' + new Date().getTime();
                    }
                }
                return request;
            }
        };
    });
}]);

OCEM.controller('headerController', ['$scope','$location',function($scope, $location) {
    $scope.paths = {
        '/': {
            label: 'Add Accident',
            next: '/addAccident'
        },
        '/addAccident': {
            label: 'View Map',
            next: '/'
        }
    };
    $scope.label = $scope.paths[$location.path()].label;
    $scope.togglePage = function() {
        $location.path($scope.paths[$location.path()].next);
        $scope.label = $scope.paths[$location.path()].label;
    };
}]);
