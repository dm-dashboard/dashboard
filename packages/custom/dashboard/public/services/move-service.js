(function () {
    'use strict';

    angular.module('mean.dashboard').
        factory('moveService', MoveService);

    function MoveService() {
        var self = this;

        function dashBoardBoxModel(element) {
            var boxModel = {
                width: element.width(),
                widthWithPadding: element.innerWidth(),
                widthWithBorder: element.outerWidth(),
                widthWithMargin: element.outerWidth(true),

                height: element.height(),
                heightWithPadding: element.innerHeight(),
                heightWithBorder: element.outerHeight(),
                heightWithMargin: element.outerHeight(true)
            };

            boxModel.borderH = (boxModel.widthWithBorder - boxModel.widthWithPadding) / 2;
            boxModel.paddingH = (boxModel.widthWithPadding - boxModel.width) / 2;
            boxModel.marginH = (boxModel.widthWithMargin - boxModel.widthWithBorder) / 2;

            boxModel.borderV = (boxModel.heightWithBorder - boxModel.heightWithPadding) / 2;
            boxModel.paddingV = (boxModel.heightWithPadding - boxModel.height) / 2;
            boxModel.marginV = (boxModel.heightWithMargin - boxModel.heightWithBorder) / 2;

            boxModel.spacingH = (boxModel.borderH + boxModel.paddingH + boxModel.marginH);
            boxModel.spacingV = (boxModel.borderV + boxModel.paddingV + boxModel.marginV);
            return boxModel;
        }

        function moveTo(x, y, element, gridsize) {
            var dashboardModel = dashBoardBoxModel(element.parent());
            var widgetModel = dashBoardBoxModel(element);

            var gridWidth = (gridsize.width * dashboardModel.width);
            var gridHeight = (gridsize.height * dashboardModel.height);


            var gridPositionHorizontal = (Math.floor(x / gridWidth) * gridWidth) + dashboardModel.spacingH - widgetModel.borderH;
            if (gridPositionHorizontal < 0) {
                gridPositionHorizontal = dashboardModel.spacingH - widgetModel.borderH;
            }
            else if (gridPositionHorizontal + widgetModel.width >= dashboardModel.width) {
                gridPositionHorizontal = dashboardModel.width - widgetModel.width;
            }
            var gridPositionVertical = (Math.floor(y / gridHeight) * gridHeight) + dashboardModel.spacingV - widgetModel.borderV;
            if (gridPositionVertical < 0) {
                gridPositionVertical = dashboardModel.spacingV - widgetModel.borderV;
            }
            else if (gridPositionVertical + widgetModel.height >= dashboardModel.height) {
                gridPositionVertical = dashboardModel.height - widgetModel.height;
            }
            if (x < gridPositionHorizontal + (gridWidth / 2)) {
                x = gridPositionHorizontal;
            } else {
                x = gridPositionHorizontal + gridWidth;
            }

            if (y < gridPositionVertical + (gridHeight / 2)) {
                y = gridPositionVertical;
            } else {
                y = gridPositionVertical + gridHeight;
            }

            element.css({
                top: y + 'px',
                left: x + 'px'
            });
        }

        self.move = function (startX, startY, mouseX, mouseY, element, gridsize) {
            var x = mouseX - startX;
            var y = mouseY - startY;

            moveTo(x, y, element, gridsize);
        };

        self.initPosition = function (element, x, y, gridsize) {
            var gridWidth = (gridsize.width * element.parent().width());
            var gridHeight = (gridsize.height * element.parent().height());
            moveTo(x * gridWidth, y * gridHeight, element, gridsize);
        };

        return self;
    };
})();