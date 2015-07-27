var svl = svl || {};

// Todo. Decouple data container and rendering stuff in Canvas.js
function LabelContainer() {
    var self = {className: 'LabelContainer'};
    var canvasLabels = [];

    function getCanvasLabels () {
        return canvasLabels;
    }

    function push(label) {
        canvasLabels.push(label);
    }

    function removeAll() {
        canvasLabels = [];
    }

    self.getCanvasLabels = getCanvasLabels;
    self.push = push;
    self.removeAll = removeAll;
    return self;
}