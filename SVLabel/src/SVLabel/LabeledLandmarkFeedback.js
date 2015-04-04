function LabeledLandmarkFeedback (params) {
    var oPublic = {
        className : 'LabeledLandmarkFeedback'
    };
    var properties = {};
    var status = {};

    // jQuery eleemnts
    var $labelCountCurbRamp;
    var $labelCountNoCurbRamp;
    var $submittedLabelMessage;

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions
    ////////////////////////////////////////////////////////////////////////////////
    function init (params) {
        // Initialize jQuery elements
        $labelCountCurbRamp = $("#LabeledLandmarkCount_CurbRamp");
        $labelCountNoCurbRamp = $("#LabeledLandmarkCount_NoCurbRamp");
        $submittedLabelMessage = $("#LabeledLandmarks_SubmittedLabelCount");

        $labelCountCurbRamp.html(0);
        $labelCountNoCurbRamp.html(0);
    }


    ////////////////////////////////////////////////////////////////////////////////
    // Public functions
    ////////////////////////////////////////////////////////////////////////////////
    oPublic.setLabelCount = function (labelCount) {
        // This function takes labelCount object that holds label names with
        // corresponding label counts. This function sets the label counts
        // that appears in the feedback window.
        $labelCountCurbRamp.html(labelCount['CurbRamp']);
        $labelCountNoCurbRamp.html(labelCount['NoCurbRamp']);
        return this;
    };

    oPublic.setSubmittedLabelMessage = function (param) {
        // This method takes a param and sets the submittedLabelCount
        if (!param) {
            return this;
        }
        if ('message' in param) {
            $submittedLabelMessage.html(message);
        } else if ('numCurbRampLabels' in param && 'numMissingCurbRampLabels' in param) {
            var message = "You've submitted <b>" +
                param.numCurbRampLabels +
                "</b> curb ramp labels and <br /><b>" +
                param.numMissingCurbRampLabels +
                "</b> missing curb ramp labels.";
            $submittedLabelMessage.html(message);
        }

        return this;
    };

    init(params);
    return oPublic;
}
