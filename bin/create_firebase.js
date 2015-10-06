var associateCrashesToRoads = require('../lib/associateCrashesToRoads');
var firebase = require('../lib/firebase');

if (process.argv.length < 3) {
  console.log('Script requires two arguments:');
  console.log('  - firebase URL');
  console.log('  - firebase token');
  console.log('  - json file (optional) - if not provided');
  console.log('    data/North_Carolina_Bicycle_Crash_Data.csv.gz is used.');
  process.exit(1);
}

var token = process.argv.pop();
var jsonFile = null;
if (token.match(/.json$/)) {
    jsonFile = token;
    token = process.argv.pop();
}
var url = process.argv.pop();

if (jsonFile) {
    firebase.createTableFromJSON(url,token,jsonFile, function() {
        console.log('created table from JSON...');
        associateCrashesToRoads(url, token, 'html/src/data/durham-bike-lanes.geojson');
        console.log('Done');
    });
} else {
    firebase.createTableFromCSV(url,token,'data/North_Carolina_Bicycle_Crash_Data.csv.gz', function() {
        console.log('created table from CSV...');
        associateCrashesToRoads(url, token, 'html/src/data/durham-bike-lanes.geojson');
        console.log('Done');
    });
}
