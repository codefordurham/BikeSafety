var Firebase = require('firebase');
var _ = require('lodash');
var csv = require('csv');
var fs = require('fs');
var h = require('highland');
var sanitizeCrashes = require('./sanitizeCrashes');
var zlib = require('zlib');

// Read in a CSV stream, and create a JSON stream of the format expected by
// createFirebaseTable().
//
// Returns a stream of objects created by sanitizeCrashes.js
var createFormat = function(csvStream) {
    var i = 0;
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
// (created by createFormat).
var createFirebaseTable = function(crashDB, table, token, dataStream, callback) {
    var bikeSafetyDB = new Firebase(crashDB);
    var crashes = bikeSafetyDB.child(table);
    bikeSafetyDB.authWithCustomToken(token, function(error, authData) {
        h(dataStream).toArray(function(data) {
            crashes.remove(function(error) {
                var callbackAfterPushes = _.after(data.length, callback);
                _(data).forEach(function(d) {
                    var newPush = crashes.push();
                    newPush.set(d, function(error) {
                        if (error) {
                            console.log(error);
                        }
                        callbackAfterPushes();
                    });
                }).value();
            });
        });
    });
};

// Export firebase table contents to STDOUT. Each line is one JSON dictionary.
var exportFirebaseTable = function(crashDB, token, callback) {
    var bikeSafetyDB = new Firebase(crashDB);
    bikeSafetyDB.authWithCustomToken(token, function(error) {
        if (error) {
            console.log(error);
            return;
        }

        bikeSafetyDB.once('value', function(data) {
            var crashes = data.val();
            _.values(crashes).forEach(function(v) {
                console.log(JSON.stringify(v));
            });
            callback();
        });
    });
};

module.exports.createFormat = createFormat;
module.exports.createTableFromCSV  = function(crashDB, table, token, csvFile, callback) {
    var formattedData = createFormat(fs.createReadStream(csvFile)
        .pipe(zlib.createGunzip()));
    createFirebaseTable(crashDB, table, token, formattedData, callback);
};
module.exports.createTableFromJSON  = function(crashDB, table, token, jsonFile, callback) {
    var formattedData = h(fs.createReadStream(jsonFile))
        .split()
        .map(function(d) {
            try {
                return JSON.parse(d);
            } catch (e) {
                return null;
            }
        })
        ;
    return createFirebaseTable(crashDB, table, token, formattedData, callback);
};
module.exports.exportTable = exportFirebaseTable;
