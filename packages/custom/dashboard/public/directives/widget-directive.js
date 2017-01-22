(function(){
    'use strict';

    angular.module('mean.dashboard').
        directive('widget', function(resizeService, $document, moveService, messageService, $window){

            var initWidget = function(element, attrs, scope){
                resizeService.initSize(element, attrs.width, attrs.height,scope.$eval(attrs.gridsize));
                moveService.initPosition(element,attrs.x, attrs.y, scope.$eval(attrs.gridsize));
            };

            var link = function(scope, element, attrs){
                initWidget(element,attrs,scope);

                angular.element($window).bind('resize', function(){
                    initWidget(element,attrs,scope);
                });
            };

            return {
                restrict : 'E',
                link : link
            };
        });
})();