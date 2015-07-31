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
        svl.labelCounter.increment(label.getProperty("labelType"));
    }

    /**
     * Flush the canvasLabels
     */
    function removeAll() {
        canvasLabels = [];
    }

    /**
     * This function removes a passed label and its child path and points
     * @method
     */
    function removeLabel (label) {
        if (!label) {
            return false;
        }
        svl.tracker.push('RemoveLabel', {labelId: label.getProperty('labelId')});

        svl.labelCounter.decrement(label.getProperty("labelType"));
        label.setStatus('deleted', true);
        label.setStatus('visibility', 'hidden');

        // Review label correctness if this is a ground truth insertion task.
        if (("goldenInsertion" in svl) &&
            svl.goldenInsertion &&
            svl.goldenInsertion.isRevisingLabels()) {
            svl.goldenInsertion.reviewLabels();
        }

        svl.canvas.clear();
        svl.canvas.render();
        return this;
    }


    self.getCanvasLabels = getCanvasLabels;
    self.push = push;
    self.removeAll = removeAll;
    self.removeLabel = removeLabel;
    return self;
}