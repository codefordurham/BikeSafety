OCEM.controller('crashesController', ['$scope','leafletData',
function ($scope, leafletData) {
    var updateMapFn = function(selection,projection) {
        if (!$scope.map) { return; }
        var zoom = $scope.map.getZoom();
        var eachCircle = function(d) {
            var p = projection.latLngToLayerPoint(L.latLng(d.location.latitude, d.location.longitude));
            var s = d3.select(this);
            s.transition().delay(500)
                .attr('cx', p.x)
                .attr('cy', p.y)
                .attr('fill', function(d) {
                    return $scope.categoryColors($scope.getDataForOptionString($scope.selectedOption,d));
                })
                .attr('r', projection.unitsPerMeter*$scope.widthScale(zoom));
        };

        var d = selection.selectAll('.crash')
            .data($scope.filteredCrashes, function(d) { return d.crash.timestamp + d.location.latitude + d.location.longitude; })
            .each(eachCircle);

        d.enter().append('svg:circle')
            .attr('fill', 'white')
            .each(eachCircle)
            .on('mouseover', function(d) {
              $scope.accident = d;
            })
            .on('mouseout', function(d) {
              $scope.accident = null;
            })
            .attr('opacity', 0.7)
            .attr('class','crash');

        d.exit()
            .transition().delay(500)
            .attr('opacity', 0)
            .remove();
    };

    $scope.showCrashes = true;
    $scope.$watch('filteredCrashes', function() {
        if (!$scope.showCrashes) {
            $scope.d3selection.selectAll('.crash').remove();
            return;
        }
        updateMapFn($scope.d3selection, $scope.d3projection);
    });
    var callUpdateFnWithD3 = function() {
        if (!$scope.showCrashes) {
            $scope.d3selection.selectAll('.crash').remove();
            return;
        }
        updateMapFn($scope.d3selection, $scope.d3projection);
    };
    $scope.$watch('filteredCrashes', callUpdateFnWithD3);
    $scope.$watch('selectedOption', callUpdateFnWithD3);
    $scope.$watch('showCrashes', callUpdateFnWithD3);
}]);
