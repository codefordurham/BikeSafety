describe("app.js", function() {
    beforeEach(module("BikeSafety"));

    describe("makeMapColoredLinearly()", function() {
        it("doesn't interpolate for two values", function() {
            var result = makeMapColoredLinearly(['one','two'],['#000000','#ffffff']);
            expect(result).toEqual({
                'one': '#000000',
                'two': '#ffffff'
            });
        });

        it("interpolates with three values", function() {
            var result = makeMapColoredLinearly([1,2,3],['#000000','#ffffff']);
            expect(result).toEqual({
                1: '#000000',
                2: '#808080',
                3: '#ffffff'
            });
        });

        it("doesn't interpolate for three colors & values", function() {
            var result = makeMapColoredLinearly([1,2,3],['#000000','#0066ff','#ffffff']);
            expect(result).toEqual({
                1: '#000000',
                2: '#0066ff',
                3: '#ffffff'
            });
        });

        it("interpolates for three colors & four values", function() {
            var result = makeMapColoredLinearly([1,2,3,4],['#000000','#0066ff','#ffffff']);
            expect(result).toEqual({
                1: '#000000',
                2: '#0044aa',
                3: '#5599ff',
                4: '#ffffff'
            });
        });

        // TODO need a list of all the metrics:
        // Bicyclist Speed
        // Driver Speed
        // Crash
    });

    describe('dataSettings()', function() {
        var dataSettings;

        beforeEach(function() {
            module('BikeSafety');
            inject(function(_dataSettings_) {
                dataSettings = _dataSettings_;
            });
        });

        it('description("biker","alcohol") returns a human readable value', function() {
            expect(dataSettings.description('biker','alcohol')).toEqual('Bicyclist Intoxicated');
        });

        it('data("biker","alcohol") returns biker.alcohol data', function() {
            expect(dataSettings.data('biker','alcohol').description).toEqual('Bicyclist Intoxicated');
        });
    });
});
