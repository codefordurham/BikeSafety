var firebase = require('../lib/firebase');

if (process.argv.length < 5) {
    console.log('Script requires three arguments:');
    console.log('  - firebase URL');
    console.log('  - firebase token');
    console.log('  - database name');
    process.exit(1);
}

var table = process.argv.pop();
var token = process.argv.pop();
var url = process.argv.pop();

firebase.deleteFirebaseTable(url, token, table, process.exit);
