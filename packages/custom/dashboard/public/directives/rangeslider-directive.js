(function () {
    'use strict';

    angular.module('mean.dashboard').
        directive('rangeSlider', function () {

            var link = function (scope, element, attrs) {
                var sliderElement;

                scope.$watch('dashboard.totalSecondsPerCycle', function (newValue) {
                    if (sliderElement) {
                        if (newValue && newValue > 1) {
                            sliderElement.slider('setNewMax', newValue);
                            sliderElement.slider('refreshRanges', getRanges());
                            sliderElement.slider('refreshChanges');
                        }
                    }
                });

                var getRanges = function () {
                    var index = 0;
                    var value = 0;

                    var previousValue = 0;
                    var handles = scope.dashboard.pages.map(function (page) {
                        var range = {
                            type: 'page' + (index++),
                            value: value
                        };
                        value = previousValue + page.percentageOfCycle / 100 * scope.dashboard.totalSecondsPerCycle;
                        previousValue = value;
                        console.log(value);

                        return range;
                    });
                    handles.push({
                        type: 'page' + (index++),
                        value: value
                    });
                    return handles;
                }

                scope.$watchCollection('dashboard.pages', function (newValue) {
                    if (newValue) {
                        sliderElement.slider('refreshRanges', getRanges());
                        sliderElement.slider('refreshChanges');
                    }
                });

                scope.$watch('dashboard', function () {
                    if (!scope.dashboard || !scope.dashboard.pages) {
                        return;
                    }

                    var handles = getRanges();

                    sliderElement = $(element).slider({
                        min: 0,
                        max: scope.dashboard.totalSecondsPerCycle,
                        step: 0.1,
                        tooltips: true,
                        handles: handles,
                        showTypeNames: true,
                        typeNames: {
                            'page1': 'Page',
                            'page2': 'Page',
                            'page3': 'Page',
                            'page4': 'Page',
                            'page5': 'Page',
                            'page6': 'Page',
                            'page7': 'Page',
                            'page8': 'Page',
                            'page9': 'Page',
                            'page10': 'Page',
                            'page11': 'Page',
                            'page12': 'Page'
                        },
                        mainClass: 'sleep',
                        type: 'number',
                        slide: function (e, ui) {
                            scope.$apply(function () {
                                var percentage = ui.value / scope.dashboard.totalSecondsPerCycle * 100;
                                scope.dashboard.setPageSeconds(ui.index - 1, percentage);
                            });
                        },
                        handleActivated: function (event, handle) {

                        }

                    });

                    //$scope.slider('removeHandle', $slider.find('a.ui-state-active').attr('data-id'));
                    //$slider.slider('addHandle', {
                    //    value: 12,
                    //    type: $('.slider-controller select').val()
                    //});
                });
            };

            return {
                restrict: 'A',
                link: link,
                template: '<div class="slider sleep"></div>',
                scope: {
                    dashboard: '='
                }
            };
        });
})();