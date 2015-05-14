var csv = require('csv');
var h = require('highland');
var _ = require('lodash');
var sanitizeCrashes = require('./sanitizeCrashes');

// Read in a CSV stream, and create a JSON stream of the format expected by
// createFirebaseTable().
//
// Returns a stream of objects created by sanitizeCrashes.js
var createFirebaseFormat = function(csvStream) {
    return h.pipeline(
        h(csvStream),
        csv.parse({columns: true, trim: true}),
        h.map(function(d) {
            // lowercase the headers for the sanitize code.
            _(_.keys(d)).forEach(function(k) {
                d[k.toLowerCase()] = d[k];
            }).value();
            return sanitizeCrashes(d);
        })
    );
};

// Create a new table 'tableName' in 'crashDB' from a JSON stream 'dataStream'
// (created by createFirebaseFormat).
var createFirebaseTable = function(crashDB, tableName, dataStream) {
    var Firebase = require('firebase');
    var bikeSafetyDB = new Firebase(crashDB);
    bikeSafetyDB.authWithCustomToken(process.env.FIREBASE_SECRET, function(error, authData) {

        var crashDB = bikeSafetyDB.child(oldCrashTable);

        crashDB.once('value', function(data) {
            var crashes = data.val();
            var values = {};
            var newCrashes = [];

            for (var i = 0; i < crashes.length; i++) {
                var crash = crashes[i];

                //Get all the current values for each attribute
                /*
                for (var key in crash) {
                    if (!(key in values)) {
                        values[key] = [];
                    }
                    var value = crash[key];
                    if (values[key].indexOf(value) == -1) {
                        values[key].push(value);
                    }
                }
                */

                newCrashes.push(createNewCrash(crash));
            }

            var newCrashDB = bikeSafetyDB.child(newCrashTable);
            newCrashDB.set(newCrashes);
        });

    });
};

module.exports.createFormat = createFirebaseFormat;
module.exports.createTable = function(crashDB, tableName) {
    var formattedData = createFirebaseFormat(fs.createReadStream(__dirname +'/testdata.csv'));
    return createFirebaseTable(crashDB, tableName, formattedData);
};
