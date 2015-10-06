var firebase = require('../lib/firebase');

if (process.argv.length < 3) {
    console.log('Script requires two arguments:');
    console.log('  - firebase URL');
    console.log('  - firebase token');
    process.exit(1);
}


var url = process.argv[process.argv.length - 2];
var token = process.argv[process.argv.length - 1];

firebase.exportTable(url,token,process.exit);
