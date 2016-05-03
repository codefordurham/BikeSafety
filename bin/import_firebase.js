var associateCrashesToRoads = require('../lib/associateCrashesToRoads');
var firebase = require('../lib/firebase');

if (process.argv.length < 6) {
  console.log('Script requires four arguments:');
  console.log('  - firebase URL');
  console.log('  - firebase token');
  console.log('  - database name');
  console.log('  - json file');
  process.exit(1);
}

var jsonFile = process.argv.pop();
var table = process.argv.pop();
var token = process.argv.pop();
var url = process.argv.pop();

firebase.createTableFromJSON(url, table, token, jsonFile, process.exit);
