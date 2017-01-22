(function () {
    'use strict';

    angular.module('mean.dashboard')
        .directive('fullScreen', function ($document, $timeout) {
            return {
                restrict : 'A',
                link : function(scope, element, attrs){
                    attrs.$observe('fullScreen', function(fullScreen){
                        if (fullScreen && fullScreen.length > 0) {
                            $document.fullScreen(JSON.parse(fullScreen));
                        }
                    });
                }
            }
        });
})();


