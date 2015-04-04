function OverlayMessageBox (params) {
    var oPublic = {
            'className' : 'OverlayMessageBox'
        };
    var properties = {
            'visibility' : 'visible'
        };
    var status = {};

    var $divOverlayMessage;
    var $divOverlayMessageBox;

    ////////////////////////////////////////
    // Private functions
    ////////////////////////////////////////
    function init() {
        // Initialization function.
        $divOverlayMessage = $(params.domIds.OverlayMessage);
        $divOverlayMessageBox = $(params.domIds.Holder_OverlayMessage);

        oPublic.setMessage('Walk');
    }

    ////////////////////////////////////////
    // Public functions
    ////////////////////////////////////////
    oPublic.setMessage = function (mode, message) {
        var instructions = svw.misc.getLabelInstructions(),
            labelColors = svw.misc.getLabelColors();

        if ((mode in instructions) &&
            (mode in labelColors)) {
            // Set the box color.
            var modeColor = labelColors[mode];
            var backgroundColor = changeAlphaRGBA(modeColor.fillStyle, 0.85);
            backgroundColor = changeDarknessRGBA(backgroundColor, 0.35);
            $divOverlayMessageBox.css({
                'background' : backgroundColor
            });
            $divOverlayMessage.css({
                'color' : instructions[mode].textColor
            });

            // Set the instructional message.
            if (message) {
                // Manually set a message.
                $divOverlayMessage.html(message);
            } else {
                // Otherwise use the pre set message
                $divOverlayMessage.html('<strong>' + instructions[mode].instructionalText + '</strong>');
            }
            return this;
        } else {
            return false;
        }
    };

    oPublic.setVisibility = function (val) {
        // Set the visibility to visible or hidden.
        if (val === 'visible' || val === 'hidden') {
            properties.visibility = val;
        }
        return this;
    };

    ////////////////////////////////////////
    // Initialization
    ////////////////////////////////////////
    init();

    return oPublic;
}
