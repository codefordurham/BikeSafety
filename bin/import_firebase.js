var associateCrashesToRoads = require('../lib/associateCrashesToRoads');
var firebase = require('../lib/firebase');

if (process.argv.length < 5) {
  console.log('Script requires four arguments:');
  console.log('  - firebase URL');
  console.log('  - firebase token');
  console.log('  - database name');
  console.log('  - json file');
  process.exit(1);
}

var jsonFile = process.argv.pop();
var database = process.argv.pop();
var token = process.argv.pop();
var url = process.argv.pop();

firebase.createTableFromJSON(url, database,token,jsonFile, process.exit);
