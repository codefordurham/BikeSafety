var associateCrashesToRoads = require('../lib/associateCrashesToRoads');
var firebase = require('../lib/firebase');

if (process.argv.length < 4) {
  console.log('Script requires two arguments:');
  console.log('  - firebase URL');
  console.log('  - firebase token');
  console.log('  - csv file (optional) - if not provided');
  console.log('    data/North_Carolina_Bicycle_Crash_Data.csv.gz and data/North_Carolina_Pedestrian_Crash_Data.csv.gz used.');
  process.exit(1);
}

var token = process.argv.pop();
var url = process.argv.pop();

firebase.createTableFromCSV(url,'bicyclist_crashes',token,'data/North_Carolina_Bicycle_Crash_Data.csv.gz', function() {
    associateCrashesToRoads(url, token, 'html/src/data/durham-bike-lanes.geojson');
});

firebase.createTableFromCSV(url,'pedestrian_crashes',token,'data/North_Carolina_Pedestrian_Crash_Data.csv.gz', function() {
    associateCrashesToRoads(url, token, 'html/src/data/durham-bike-lanes.geojson');
    process.exit();
});
