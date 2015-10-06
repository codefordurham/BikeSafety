var Firebase = require('firebase');
var fs = require('fs');

var threshold = 0.04572;

function toRad(Value)
{
    return Value * Math.PI / 180;
}

function calcCrow(lat1, lon1, lat2, lon2)
{
    var R = 6371; // km
    var dLat = toRad(lat2-lat1);
    var dLon = toRad(lon2-lon1);
    var lat1 = toRad(lat1);
    var lat2 = toRad(lat2);
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d;
}

function searchRoads(crash, roads) {
    var lat = crash.location.latitude;
    var lon = crash.location.longitude;

    var matches = [];

    for (var j = 0; j < roads.length; j++) {
        var polyline = roads[j].geometry.coordinates;

        for (var k = 0; k < polyline.length; k++) {
            if (calcCrow(lat, lon, polyline[k][1], polyline[k][0]) < threshold) {
                matches.push(roads[j]);
                break;
            }
        }
    }

    return matches;
}

function associateCrashesToRoads(crashDB, token, roadFile) {
    var bikeSafetyDB = new Firebase(crashDB);
    bikeSafetyDB.authWithCustomToken(token, function(error, authData) {
        bikeSafetyDB.once('value', function(data) {
            var crashes = data.val();
            fs.readFile(roadFile, {encoding: 'utf-8'}, function(err, data) {
                var roads = JSON.parse(data).features;

                for (var i = 0; i < crashes.length; i++) {
                    var crash = crashes[i];
                    var matches = searchRoads(crash, roads);
                    if (matches.length > 0) {
                        var ids = matches.map(function (r) {return r.properties.OBJECTID_12;});
                        var crashRef = crashDB.child(i);
                        crashRef.update({
                            rd_ids: ids
                        });
                    }
                }
            });
        });
    });
}

module.exports = associateCrashesToRoads;
