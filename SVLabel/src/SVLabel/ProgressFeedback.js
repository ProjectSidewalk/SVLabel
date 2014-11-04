/**
 * Created with JetBrains PhpStorm.
 * User: kotarohara
 * Date: 3/18/13
 * Time: 7:35 PM
 * To change this template use File | Settings | File Templates.
 */
function ProgressFeedback (params) {
    var oPublic = {
        className : 'ProgressFeedback'
    };
    var properties = {
        progressBarWidth : undefined
    };
    var status = {
        progress : undefined
    };

    // jQuery elements
    var $progressBarContainer;
    var $progressBarFilled;
    var $progressMessage;

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions
    ////////////////////////////////////////////////////////////////////////////////
    function init (params) {
        $progressBarContainer = $("#ProgressBarContainer");
        $progressBarFilled = $("#ProgressBarFilled");
        $progressMessage = $("#Progress_Message");

        properties.progressBarWidth = $progressBarContainer.width();

        if ('message' in params && params.message) {
            oPublic.setMessage(params.message);
        } else {
            oPublic.setMessage('');
        }

        oPublic.setProgress(0);
    }


    ////////////////////////////////////////////////////////////////////////////////
    // Public functions
    ////////////////////////////////////////////////////////////////////////////////
    oPublic.setMessage = function (message) {
        // This function sets a message box in the feedback area.
        $progressMessage.html(message);
    };


    oPublic.setProgress = function (progress) {
        // Check if the passed argument is a number. If not, try parsing it as a
        // float value. If it fails (if parseFloat returns NaN), then throw an error.
        if (typeof progress !== "number") {
            progress = parseFloat(progress);
        }

        if (progress === NaN) {
            throw new TypeError(oPublic.className + ': The passed value cannot be parsed.');
        }

        if (progress > 1) {
            progress = 1.0;
            console.error(oPublic.className + ': You can not pass a value larger than 1 to setProgress.');
        }

        status.progress = progress;

        if (properties.progressBarWidth) {
            var r;
            var g;
            var color;

            if (progress < 0.5) {
                r = 255;
                g = parseInt(255 * progress * 2);
            } else {
                r = parseInt(255 * (1 - progress) * 2);
                g = 255;
            }

            color = 'rgba(' + r + ',' + g + ',0,1)';
            $progressBarFilled.css({
                background: color,
                width: progress * properties.progressBarWidth
            });
        }

        return this;
    };

    init(params);
    return oPublic;
}