OCEM.controller('userContributedCrashesController', ['$scope','leafletData',
function ($scope, leafletData) {
    $('#color_combo').change(function(el) {
      $scope.colorAccidentsBy = $('#color_combo option:selected').val();
      updateMapFn($scope.d3selection, $scope.d3projection);
    });

    var updateMapFn = function(selection,projection) {
        var zoom = $scope.map.getZoom();
        var eachSquare = function(d) {
            var p = projection.latLngToLayerPoint(L.latLng(d.location.latitude, d.location.longitude));
            var s = d3.select(this);
            s.attr('x', p.x);
            s.attr('y', p.y);
            s.attr('fill', function(d) {
                return $scope.categoryColors($scope.getDataForOptionString($scope.selectedOption,d));
            });
            s.attr('width', $scope.widthScale(zoom)*2);
            s.attr('height', $scope.widthScale(zoom)*2);
        };

        // TODO fade in with a transition() when the data is added
        selection.selectAll('.userCrash')
            .data($scope.userCrashes)
            .each(eachSquare)
            .enter().append('svg:rect')
            .each(eachSquare)
            .on('mouseover', function(d) {
              $scope.accident = d;
            })
            .on('mouseout', function(d) {
              $scope.accident = null;
            })
            .attr('opacity', 0.7)
            .attr('class','userCrash');
    };

    $scope.change = function() {
        if (!$scope.showCrashes) {
            $scope.d3selection.selectAll('.userCrash').remove();
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
