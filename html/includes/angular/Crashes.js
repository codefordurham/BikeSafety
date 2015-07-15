OCEM.controller('crashesController', ['$scope','leafletData',
function ($scope, leafletData) {
    var updateMapFn = function(selection,projection) {
        var zoom = $scope.map.getZoom();
        var eachCircle = function(d) {
            var p = projection.latLngToLayerPoint(L.latLng(d.location.latitude, d.location.longitude));
            var s = d3.select(this);
            s.attr('cx', p.x);
            s.attr('cy', p.y);
            s.attr('fill', function(d) {
                return $scope.categoryColors($scope.getDataForOptionString($scope.selectedOption,d));
            });
            s.attr('r', $scope.widthScale(zoom));
        };
        // TODO fade in with a transition() when the data is added
        selection.selectAll('.crash')
            .data($scope.crashes)
            .each(eachCircle)
            .enter().append('svg:circle')
            .each(eachCircle)
            .on('mouseover', function(d) {
              $scope.accident = d;
            })
            .on('mouseout', function(d) {
              $scope.accident = null;
            })
            .attr('opacity', 0.7)
            .attr('class','crash');
    };

    $scope.change = function() {
        if (!$scope.showCrashes) {
            $scope.d3selection.selectAll('.crash').remove();
            return;
        }
        updateMapFn($scope.d3selection, $scope.d3projection);
    };
    $scope.showCrashes = true;
    $scope.$watch('accidentColor', function(newValue, oldValue) {
        if (!$scope.map) {
            return;
        }
        if (newValue && oldValue === undefined) {
            $scope.change();
            return;
        }
        for (var i = 0; i < newValue.length; i++) {
            if (newValue[i] !== oldValue[i]) {
                $scope.change();
                return;
            }
        }
    });
}]);
