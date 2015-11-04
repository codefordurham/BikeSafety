describe("legendController", function() {
    beforeEach(module("BikeSafety"));

    var $controller, controller, $scope;
    beforeEach(inject(function(_$controller_) {
        $controller = _$controller_;
        $scope = {};
        $scope.$watch = function() {};
        controller = $controller('legendController', { $scope: $scope });
        $scope.selectedOption = 'biker.alcohol';
    }));

    it('sets up default values', function() {
        expect($scope.whitelist).toEqual({});
        expect($scope.blacklist).toEqual({});
    });

    describe('toggleFlag()', function() {
        it('adds new elements if they do not exist', function() {
            $scope.toggleFlag('Yes');
            expect($scope.whitelist).toEqual({'biker.alcohol': ['Yes']});
        });

        it('removes an element when toggled twice', function() {
            $scope.toggleFlag('Yes');
            $scope.toggleFlag('Yes');
            expect($scope.whitelist).toEqual({'biker.alcohol': []});
        });

        it('does not modify other whitelist when double toggling', function() {
            $scope.toggleFlag('No');
            $scope.toggleFlag('Yes');
            expect($scope.whitelist).toEqual({'biker.alcohol': ['No','Yes']});
            $scope.toggleFlag('Yes');
            expect($scope.whitelist).toEqual({'biker.alcohol': ['No']});
        });
    });
});
