OCEM.controller('pathController', ['$scope','leafletData','getPaths',
function ($scope, leafletData, getPaths) {
    $scope.change = function() {
        d3.select('#legend .roadLegend .rows')
            .selectAll('div')
            .remove();
        if (!$scope.showRoad) {
            $scope.d3selection.selectAll('.bikepath').remove();
            return;
        }

        getPaths.then(function(result) {
            var roads = topojson.feature(result.data,result.data.objects['durham-bike-lanes']).features;
            roads.forEach(function(arc) {
                arc.wrecks = [];
                arc.severityCount = 0;
            });
            $scope.highestWrecks = 0;
            $scope.crashes.forEach(function (accident) {
                if (accident.location.city == 'Durham' && accident.rd_ids) {
                    accident.rd_ids.forEach(function (road_id) {
                        var currFeature = _.find(roads, function(r) { return r.id == road_id; });
                        currFeature.severityCount++;
                        currFeature.wrecks.push(accident);
                        if (currFeature.severityCount > $scope.highestWrecks) {
                            $scope.highestWrecks = currFeature.severityCount;
                            $scope.highestWreckLoc = accident;
                        }
                    });
                }
            });

            var roadOpacity = d3.scale.linear()
                .domain([0,$scope.highestWrecks])
                .range([Math.PI/4,1]);
            var roadColor = d3.scale.linear()
                .domain([0,1,$scope.highestWrecks])
                .range(["#637939","#fd8d3c","#d62728"]);
            var zoom = $scope.map.getZoom();

            var path = d3.geo.path().projection(function(coord) {
                var latLng = new L.latLng(coord[1], coord[0]);
                var p = $scope.d3projection.latLngToLayerPoint(latLng);
                return [p.x,p.y];
            });

            d3.select('#legend .roadLegend .rows')
                .selectAll('div')
                .data(d3.range($scope.highestWrecks+1))
                .enter().append('div')
                .html(function(d, i) {
                    return '<div class="legend-line"><div class="legend-circle inline" style="background-color:'+ roadColor(i) +';opacity:'+ roadOpacity(i) +'"></div><div class="legend-label inline">'+ i +'</div></div>';
                });

            $scope.d3selection.selectAll('.bikepath')
                .data(roads)
                .attr('d',path)
                .attr('stroke-width', '1px')
                .enter().append('svg:path')
                .attr('d',path)
                .attr('opacity', function(d, i) {
                    return roadOpacity(d.severityCount);
                })
                .attr('stroke', function(d, i) {
                    return roadColor(d.severityCount);
                })
                .attr('stroke-width', '1px')
                .on('mouseover', function(d) {
                  $scope.wrecks = d.wrecks;
                })
                .on('mouseout', function(d) {
                  $scope.wrecks = [];
                })
                .attr('class','bikepath');
        });
    };
    $scope.showRoad = false;
    $scope.$watch('selectedOption', function(newValue, oldValue) {
        if (!newValue) { return; }
        $scope.change();
    });
}]);
