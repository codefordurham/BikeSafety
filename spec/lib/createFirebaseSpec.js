var firebase = require('../../lib/firebase');
var fs = require('fs');
var h = require('highland');

describe('firebase', function() {
    describe('createFormat()', function() {
        it('returns an empty stream if there is no input', function(done) {
            h(firebase.createFormat(h([])))
                .errors(function(err,push) {
                    expect(err).toEqual(null);
                })
                .toArray(function(data) {
                    expect(data).toEqual([]);
                    done();
                });
        });

        it('converts a single row', function(done) {
            h(firebase.createFormat(fs.createReadStream(__dirname +'/testrow.csv')))
                .errors(function(err,push) {
                    expect(err).toEqual(null);
                })
                .toArray(function(data) {
                    expect(data).toEqual([{
                      biker: {
                          age: '11',
                          alcohol: 'No',
                          injury: 'Evident Injury',
                          race: 'Unknown',
                          sex: 'Male',
                          direction: 'With Traffic',
                          position: 'Sidewalk / Crosswalk / Driveway Crossing'
                      },
                      driver: {
                          age: '35',
                          alcohol: 'No',
                          injury: 'No Injury',
                          race: 'Unknown',
                          sex: 'Male',
                          vehicle_type: 'Passenger Car',
                          estimated_speed: '31-35 mph'
                      },
                      location: {
                          city: 'Durham',
                          county: 'Durham',
                          region: 'Piedmont',
                          development: 'Residential',
                          latitude: '36.03949',
                          longitude: '-78.883896',
                          locality: 'Urban (>70% Developed)',
                          lanes: '1 lane',
                          characteristics: 'Straight - Level',
                          class: 'Local Street',
                          configuration: 'Two-Way, Divided, Unprotected Median',
                          feature: 'No Special Feature',
                          surface: 'Smooth Asphalt',
                          rural_urban: 'Urban',
                          speed_limit: '30 - 35  MPH',
                          traffic_control: 'No Control Present'
                      },
                      crash: {
                          ambulance: 'Yes',
                          group: 'Parallel Paths - Other Circumstances',
                          location: 'Non-Intersection',
                          type: 'Bicyclist Ride Out - Parallel Path',
                          hit_and_run: 'No',
                          timestamp: '01/02/2007 12:00:00 AMT16:41:00',
                          light_conditions: 'Daylight',
                          road_conditions: 'Dry',
                          road_defects: 'None',
                          weather: 'Clear',
                          workzone: 'No'
                      }
                    }]);
                    done();
                });
        });

        it("converts a standard dataset", function(done) {
            h(firebase.createFormat(fs.createReadStream(__dirname +'/testdata.csv')))
                .toArray(function(data) {
                    expect(data.length).toEqual(6);
                    done();
                });
        });
    });

    describe('createTable()', function() {
        // TODO mock firebase
        it('does nothing if there is no data', function(done) {
          done();
        });
    });
});
