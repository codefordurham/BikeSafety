var OCEM = angular.module('RideOrDie', ['ngRoute', 'ui.bootstrap', 'ui.mask','firebase', 'google-maps'.ns()]);

OCEM.controller('indexCtlr', ['$scope','$http','$firebase', indexCtrl]);


OCEM.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider
        .when('/', {
            templateUrl: '/partials/Index',
            controller: 'indexCtlr'
        })
        .otherwise({
            redirectTo: '/'
        });
  }]);

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
}])


function indexCtrl($scope, $http, $firebase) {
    $scope.map = { center: { latitude: 35.9886, longitude: -78.9072 }, zoom: 12 };

//    var ref = new Firebase("https://rideordie.firebaseio.com/");
//    var Data = ref.child('data').orderByChild("19").equalTo("Durham").once("value", function (snapshot){
//        console.log(snapshot.val());
//    });
//



//    var myData = ref.child('data/0');
//    var theData = myData.once('value', function(snapshot){
//        console.log(snapshot.val());
//    });
//
//    var dataRef = ref.child('data');
//    dataRef.once('child_added', function(snapshot){
//        //console.log(snapshot.val());
//    });
    //$scope.data = theData;
}

