(function () {
    'use strict';

    angular.module('mean.dashboard').
        directive('timing', function () {

            var link = function (scope, element, attrs) {
                scope.timingConfig = JSON.parse(attrs.timing);
            };

            return {
                restrict: 'A',
                link: link
            };
        });
})();