OCEM.controller('crashesController', ['$scope','leafletData',
function ($scope, leafletData) {
    var updateMapFn = function(selection,projection) {
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

        selection.selectAll('.crash')
            .data($scope.crashes)
            .each(eachCircle)
            .enter().append('svg:circle')
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
        if (!newValue) { return; }
            $scope.change();
    });
}]);
