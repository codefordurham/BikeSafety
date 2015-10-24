OCEM.controller('legendController', ['$scope',
function ($scope) {
    // filter visible elements by the following black/white lists of functions:
    $scope.whitelist = [];
    $scope.blacklist = [];
    $scope.accidentLabel = [];
    $scope.accidentColor = [];
    $scope.selectedOption = null;
    $scope.filterDescription = function() {
        return 'All accidents';
    };

    $('#color_combo').change(function() {
        $scope.setupAccidentColors();
        $scope.$apply();
    });

    $scope.setupAccidentColors = function() {
        $scope.selectedOption = $('#color_combo option:selected').val();
        if (!$scope.selectedOption) return;
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
    };

    $scope.$watch('leafletLoaded', $scope.setupAccidentColors);
}]);
