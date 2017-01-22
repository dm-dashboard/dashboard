(function () {
    'use strict';

    angular.module('mean.dashboard')
        .factory('resizeService', ResizeService);


    ResizeService.$inject = ['$document'];

    function ResizeService($document) {
        var self = this;

        function getEdges(element) {
            var offset = 5;
            var left = {
                x1: element.position().left + element.parent().position().left - offset,
                x2: element.position().left + element.parent().position().left + offset,
                y1: element.position().top + element.parent().position().top - offset,
                y2: element.position().top + element.parent().position().top + element.height() + offset,
                anchor: {
                    name: 'left',
                    x: element.position().left + element.width(),
                    cursor: 'w-resize'
                }
            };

            var right = {
                x1: left.x1 + element.width(),
                x2: left.x2 + element.width(),
                y1: left.y1,
                y2: left.y2,
                anchor: {
                    name: 'right',
                    x: element.position().left,
                    cursor: 'e-resize'
                }
            };

            var top = {
                x1: left.x1,
                x2: left.x1 + element.width() + (2 * offset),
                y1: element.position().top + element.parent().position().top - offset,
                y2: element.position().top + element.parent().position().top + offset,
                anchor: {
                    name: 'top',
                    y: element.position().top + element.height(),
                    cursor: 'n-resize'
                }
            };

            var bottom = {
                x1: top.x1,
                x2: top.x2,
                y1: top.y1 + element.height(),
                y2: top.y2 + element.height(),
                anchor: {
                    name: 'bottom',
                    y: element.position().top,
                    cursor: 's-resize'
                }
            };

            return {
                left: left,
                top: top,
                right: right,
                bottom: bottom
            };
        }

        function getCorners(element) {

            var offset = 5;
            var topLeft = {
                x1: element.position().left + element.parent().position().left - offset,
                x2: element.position().left + element.parent().position().left + offset,
                y1: element.position().top + element.parent().position().top - offset,
                y2: element.position().top + element.parent().position().top + offset,
                anchor: {
                    name: 'topLeft',
                    x: element.position().left + element.width(),
                    y: element.position().top + element.height(),
                    cursor: 'nw-resize'
                }
            };

            var topRight = {
                x1: topLeft.x1 + element.width(),
                x2: topLeft.x2 + element.width(),
                y1: topLeft.y1,
                y2: topLeft.y2,
                anchor: {
                    name: 'topRight',
                    x: element.position().left,
                    y: element.position().top + element.height(),
                    cursor: 'ne-resize'
                }
            };

            var bottomLeft = {
                x1: topLeft.x1,
                x2: topLeft.x2,
                y1: topLeft.y1 + element.height(),
                y2: topLeft.y2 + element.height(),
                anchor: {
                    name: 'bottomLeft',
                    x: element.position().left + element.width(),
                    y: element.position().top,
                    cursor: 'sw-resize'
                }
            };

            var bottomRight = {
                x1: bottomLeft.x1 + element.width(),
                x2: bottomLeft.x2 + element.width(),
                y1: bottomLeft.y1,
                y2: bottomLeft.y2,
                anchor: {
                    name: 'bottomRight',
                    x: element.position().left,
                    y: element.position().top,
                    cursor: 'se-resize'
                }
            };

            return {
                topLeft: topLeft,
                topRight: topRight,
                bottomLeft: bottomLeft,
                bottomRight: bottomRight
            };
        }

        function isInResizeArea(corner, x, y) {
            if (x >= corner.x1 && x <= corner.x2 && y >= corner.y1 && y <= corner.y2) {
                return corner.anchor;
            }
        }

        self.checkResizeHandle = function (mouseX, mouseY, element) {
            var corners = getCorners(element);
            var resizeData = {};

            var anchor = isInResizeArea(corners.topLeft, mouseX, mouseY);
            if (!anchor) {
                anchor = isInResizeArea(corners.topRight, mouseX, mouseY);
            }
            if (!anchor) {
                anchor = isInResizeArea(corners.bottomLeft, mouseX, mouseY);
            }
            if (!anchor) {
                anchor = isInResizeArea(corners.bottomRight, mouseX, mouseY);
            }

            if (anchor !== undefined) {
                resizeData.inCorner = true;
                resizeData.anchor = anchor;
                resizeData.cursor = anchor.cursor;
                return resizeData;
            }

            var edges = getEdges(element);
            anchor = isInResizeArea(edges.left, mouseX, mouseY);
            if (!anchor) {
                anchor = isInResizeArea(edges.right, mouseX, mouseY);
            }
            if (!anchor) {
                anchor = isInResizeArea(edges.bottom, mouseX, mouseY);
            }
            if (!anchor) {
                anchor = isInResizeArea(edges.top, mouseX, mouseY);
            }

            if (anchor !== undefined) {
                resizeData.onEdge = true;
                resizeData.anchor = anchor;
                resizeData.cursor = anchor.cursor;
                return resizeData;
            }
            return resizeData;
        };

        self.forceToGrid = function (element, gridsize) {
            var newWidth = element.outerWidth(true);
            var newHeight = element.outerHeight(true);

            var gridWidth = (gridsize.width * element.parent().width());
            var gridHeight = (gridsize.height * element.parent().height());

            var gridBlocks = Math.floor(newWidth / gridWidth);
            gridBlocks = gridBlocks || 1;
            var distanceToBlock = newWidth % (gridBlocks * gridWidth);
            if (distanceToBlock >= gridWidth / 2) {
                newWidth = (gridBlocks + 1) * gridWidth;
            } else {
                newWidth = (gridBlocks) * gridWidth;
            }

            element.width(newWidth);
            gridBlocks = Math.floor(newHeight / gridHeight);
            gridBlocks = gridBlocks || 1;
            distanceToBlock = newHeight % (gridBlocks * gridHeight);
            if (distanceToBlock >= gridHeight / 2) {
                newHeight = (gridBlocks + 1) * gridHeight;
            } else {
                newHeight = (gridBlocks) * gridHeight;
            }
            element.height(newHeight);
        };

        self.resizeEdge = function (mouseX, mouseY, element, anchor, gridsize) {
            var gridWidth = (gridsize.width * element.parent().width());
            var gridHeight = (gridsize.height * element.parent().height());
            var newWidth, newHeight, position, gridBlocks, distanceToBlock;
            switch (anchor.name) {
                case 'right':
                    newWidth = mouseX < anchor.x ? gridWidth : mouseX - anchor.x;
                    break;
                case 'left':
                    newWidth = mouseX > anchor.x ? gridWidth : anchor.x - mouseX;
                    position = {
                        left: (mouseX < anchor.x ? mouseX : anchor.x - gridWidth) + 'px'
                    };
                    break;
                case 'bottom':
                    newHeight = mouseY < anchor.y ? gridHeight : mouseY - anchor.y;
                    break;
                case 'top':
                    newHeight = mouseY > anchor.y ? gridHeight : anchor.y - mouseY;
                    position = {
                        top: (mouseY < anchor.y ? mouseY : anchor.y - gridHeight) + 'px'
                    };
                    break;
            }
            if (newWidth) {
                if (newWidth < gridWidth) {
                    newWidth = gridWidth;
                } else {
                    gridBlocks = Math.floor(newWidth / gridWidth);
                    distanceToBlock = newWidth % (gridBlocks * gridWidth);
                    if (distanceToBlock < (gridWidth / 6)) {
                        newWidth = (gridBlocks) * gridWidth;
                    } else if (distanceToBlock >= ((gridWidth / 6) * 5)) {
                        newWidth = (gridBlocks + 1) * gridWidth;
                    }
                }
                element.width(newWidth);
            }
            if (newHeight) {
                if (newHeight < gridHeight) {
                    newHeight = gridHeight;
                } else {
                    gridBlocks = Math.floor(newHeight / gridHeight);
                    distanceToBlock = newHeight % (gridBlocks * gridHeight);
                    if (distanceToBlock < (gridHeight / 6)) {
                        newHeight = (gridBlocks) * gridHeight;
                    } else if (distanceToBlock >= ((gridHeight / 6) * 5)) {
                        newHeight = (gridBlocks + 1) * gridHeight;
                    }
                }
                element.height(newHeight);
            }
            if (position) {
                element.css(position);
            }
        };

        self.resizeCorner = function (mouseX, mouseY, element, anchor) {
            switch (anchor.name) {
                case 'bottomRight':
                    element.width((mouseX < anchor.x ? 5 : mouseX - anchor.x) + 'px');
                    element.height((mouseY < anchor.y ? 5 : mouseY - anchor.y) + 'px');
                    break;
                case 'topLeft':
                    element.width((mouseX > anchor.x ? 5 : anchor.x - mouseX) + 'px');
                    element.height((mouseY > anchor.y ? 5 : anchor.y - mouseY) + 'px');
                    element.css({
                        left: (mouseX < anchor.x ? mouseX : anchor.x - 5) + 'px',
                        top: (mouseY < anchor.y ? mouseY : anchor.y - 5) + 'px'
                    });
                    break;
                case 'topRight':
                    element.height((mouseY > anchor.y ? 5 : anchor.y - mouseY) + 'px');
                    element.width((mouseX < anchor.x ? 5 : mouseX - anchor.x) + 'px');
                    element.css({
                        top: (mouseY < anchor.y ? mouseY : anchor.y - 5) + 'px'
                    });
                    break;
                case 'bottomLeft':
                    element.height((mouseY < anchor.y ? 5 : mouseY - anchor.y) + 'px');
                    element.width((mouseX > anchor.x ? 5 : anchor.x - mouseX) + 'px');
                    element.css({
                        left: (mouseX < anchor.x ? mouseX : anchor.x - 5) + 'px'
                    });
                    break;

            }
        };

        self.initSize = function (element, width, height, gridsize) {
            var gridWidth = (gridsize.width * element.parent().width());
            var gridHeight = (gridsize.height * element.parent().height());

            element.width(gridWidth * width);
            element.height(gridHeight * height);
        };
        return self;
    };
} ());