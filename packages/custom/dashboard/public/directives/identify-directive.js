(function () {
    'use strict';

    angular.module('mean.dashboard').
        directive('identify', function ($rootScope, $timeout) {



            var link = function (scope, element, attrs) {
                scope.countdown = 5;

                $rootScope.$on('identify', function (event, text) {
                    scope.showIdentifier = true;
                    scope.text = text;
                    scope.countdown = 5;
                    $timeout(resetTimer, 1000);
                });

                var resetTimer = function(){
                    scope.countdown--;
                    if (scope.countdown > 0){
                        $timeout(resetTimer,1000);
                    }else{
                        scope.showIdentifier = false;
                    }
                };

                scope.showIdentifier = false;
            };

            return {
                restrict: 'E',
                link: link,
                templateUrl : '/dashboard/views/identify-directive.html'
            };
        });
})();