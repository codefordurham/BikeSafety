var associateCrashesToRoads = require('../lib/associateCrashesToRoads');
var firebase = require('../lib/firebase');

if (process.argv.length < 3) {
  console.log('Script requires two arguments:');
  console.log('  - firebase URL');
  console.log('  - firebase token');
  console.log('  - csv file (optional) - if not provided');
  console.log('    data/North_Carolina_Bicycle_Crash_Data.csv.gz is used.');
  process.exit(1);
}

var token = process.argv.pop();
var jsonFile = null;
var url = process.argv.pop();

firebase.createTableFromCSV(url,'crashes',token,'data/North_Carolina_Bicycle_Crash_Data.csv.gz', function() {
    associateCrashesToRoads(url, token, 'html/src/data/durham-bike-lanes.geojson');
    process.exit();
});
