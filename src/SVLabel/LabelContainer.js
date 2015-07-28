var svl = svl || {};

/**
 * LabelContainer class constructor
 */
function LabelContainer() {
    var self = {className: 'LabelContainer'};
    var canvasLabels = [];

    /**
     * Returns canvas labels
     */
    function getCanvasLabels () {
        return canvasLabels;
    }

    /**
     * Push a label into canvasLabels
     * @param label
     */
    function push(label) {
        canvasLabels.push(label);
    }

    /**
     * Flush the canvasLabels
     */
    function removeAll() {
        canvasLabels = [];
    }

    self.getCanvasLabels = getCanvasLabels;
    self.push = push;
    self.removeAll = removeAll;
    return self;
}