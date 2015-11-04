OCEM.controller('legendController', ['$scope',
function ($scope) {
    $scope._ = _;
    // White and black lists use:
    //  - key: the option name (eg, crash.ambulence)
    //  - value: a list of values (eg, Yes, No)
    $scope.whitelist = {};
    $scope.blacklist = {};
    $scope.accidentLabels = [];
    $scope.accidentColor = [];
    $scope.filteredCrashes = [];
    $scope.filteredUserCrashes = [];
    $scope.selectedOption = null;

    var accidentKept = function(accident) {
        // does the accident have all the things on the whitelist?
        var kept = _.every($scope.whitelist,function(values,option) {
            if (values.length == 0) { return true; }
            return _.includes(values,_.get(accident,option));
        });
        if (!kept) {
            return false;
        }
        // does it NOT have all the things on the blacklist?
        return _.every($scope.blacklist,function(values,option) {
            if (values.length == 0) { return true; }
            return !_.includes(values,_.get(accident,option));
        });
    };

    var DEFAULT_DESCRIPTION = 'This map shows all accidents in Durham';
    $scope.filterDescription = DEFAULT_DESCRIPTION;
    var updateFilterDescripton = function() {
        // suppose the wl has bike drunk=yes & no then...
        //
        // Accidents where the bicyclist drunk was one of (yes,no)
        // Accidents where the bicyclist drunk was yes
        //
        // Excluding...
        $scope.filteredCrashes = _.filter($scope.crashes, accidentKept);
        $scope.filteredUserCrashes = _.filter($scope.userCrashes, accidentKept);

        if (_.every($scope.blacklist,_.isEmpty) && _.every($scope.whitelist,_.isEmpty)) {
            $scope.filterDescription = DEFAULT_DESCRIPTION;
            return;
        }
        $scope.filterDescription = 'This map shows accidents that ';
    };

    $scope.setupAccidentColors = function() {
        if (!$scope.crashes) return;
        if (!$scope.selectedOption) {
            $scope.selectedOption = 'biker.alcohol';
        }
        $scope.metadata = $scope.getDataForOptionString('biker.alcohol');
        $scope.metadata = $scope.getDataForOptionString($scope.selectedOption);
        $scope.categoryColors = d3.scale.category10();
        if (_.has($scope.metadata,'colors')) {
            $scope.categoryColors = $scope.metadata.colors;
        }
        // Trim the bike_injur field b/c some of the fields have " Injury"
        // and others have "Injury".
        $scope.accidentLabels = d3.set($scope.crashes.concat($scope.userCrashes).map(function(d) {
            return $scope.getDataForOptionString($scope.selectedOption,d);
        })).values();
        if (_.has($scope.metadata,'options')) {
            // Append any missing values to the end of the values that we expect
            // for this data type:
            var extraValues = _.difference($scope.accidentLabels,$scope.metadata.options);
            $scope.accidentLabels = $scope.metadata.options.concat(extraValues);
        }
    };

    var toggleList = function(list,otherList,item) {
        if (!_.has(list, $scope.selectedOption)) {
            list[$scope.selectedOption] = [];
        }
        if (_.includes(list[$scope.selectedOption],item)) {
            list[$scope.selectedOption] = _.remove(list[$scope.selectedOption],function(v) {
                return v !== item;
            });
            return;
        }
        // Check the 'other' list. if the key is already in there, then
        // remove it (XOR for item values in other words).
        if (_.has(otherList, $scope.selectedOption)) {
            otherList[$scope.selectedOption] = _.remove(otherList[$scope.selectedOption],item);
        }
        list[$scope.selectedOption].push(item);
    };
    $scope.toggleRemove = _.flow(_.partial(toggleList,$scope.blacklist,$scope.whitelist),updateFilterDescripton);
    $scope.toggleFlag = _.flow(_.partial(toggleList,$scope.whitelist,$scope.blacklist),updateFilterDescripton);

    var toggleIconClass = function(list,item) {
        return _.includes(list[$scope.selectedOption],item) ? 'legend-action-selected':'';
    };
    $scope.removeClass = _.partial(toggleIconClass,$scope.blacklist);
    $scope.flagClass = _.partial(toggleIconClass,$scope.whitelist);

    $scope.clearLists = function() {
        _.each($scope.whitelist, function(n, key) {
            $scope.whitelist[key] = [];
        });
        _.each($scope.blacklist, function(n, key) {
            $scope.blacklist[key] = [];
        });
        updateFilterDescripton();
    };

    $scope.$watch('leafletLoaded', $scope.setupAccidentColors);
    $scope.$watch('crashes', updateFilterDescripton);
}]);
