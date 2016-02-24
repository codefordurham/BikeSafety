OCEM.controller('userContributedCrashesController', ['$scope','leafletData',
function ($scope, leafletData) {
    var updateMapFn = function(selection,projection) {
        if (!$scope.map) { return; }
        var zoom = $scope.map.getZoom();
        var eachSquare = function(d) {
            var p = projection.latLngToLayerPoint(L.latLng(d.location.latitude, d.location.longitude));
            var s = d3.select(this);
            var w = $scope.widthScale(zoom)*projection.unitsPerMeter;
            s.transition().delay(500)
                .attr('x', p.x - w)
                .attr('y', p.y - w)
                .attr('width', w*2)
                .attr('height', w*2)
                .attr('fill', function(d) {
                    return $scope.categoryColors($scope.getDataForOptionString($scope.selectedOption,d));
                });
        };

        var d = selection.selectAll('.userCrash')
            .data($scope.filteredUserCrashes, function(d) { return d.crash.timestamp + d.location.latitude + d.location.longitude; })

        d.each(eachSquare);

        d.enter().append('svg:rect')
            .attr('fill', 'white')
            .each(eachSquare)
            .on('mouseover', function(d) {
              $scope.accident = d;
            })
            .on('mouseout', function(d) {
              $scope.accident = null;
            })
            .attr('opacity', 0.7)
            .attr('class','userCrash');

        d.exit()
            .transition().delay(500)
            .attr('opacity', 0)
            .remove();
    };

    $scope.showCrashes = true;
    var callUpdateFnWithD3 = function() {
        if (!$scope.showCrashes) {
            $scope.d3selection.selectAll('.userCrash').remove();
            return;
        }
        updateMapFn($scope.d3selection, $scope.d3projection);
    };
    $scope.$on('leafletDirectiveMap.zoomend', function(evt) {
        updateMapFn($scope.d3selection, $scope.d3projection);
    });
    $scope.$watch('filteredCrashes', callUpdateFnWithD3);
    $scope.$watch('selectedOption', callUpdateFnWithD3);
    $scope.$watch('showCrashes', callUpdateFnWithD3);
    $scope.$watch('leafletLoaded', callUpdateFnWithD3);
}]);
