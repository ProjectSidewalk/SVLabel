/**
 * Created with JetBrains PhpStorm.
 * User: kotarohara
 * Date: 3/15/13
 * Time: 9:08 PM
 * To change this template use File | Settings | File Templates.
 */
var svw = svw || {};

function Keyboard () {
    var oPublic = {
            className : 'Keyboard'
        };
    var status = {
        focusOnTextField: false,
        shiftDown: false
    };

    var $textareaComment;
    var $taskDifficultyComment;
    var $inputSkipOther;

    function init () {
        $textareaComment = $("#CommentField");
        $taskDifficultyComment = $("#task-difficulty-comment");
        $inputSkipOther = $("#Text_BusStopAbsenceOtherReason");


        $textareaComment.bind('focus', textFieldFocus);
        $textareaComment.bind('blur', textFieldBlur);
        $inputSkipOther.bind('focus', textFieldFocus);
        $inputSkipOther.bind('blur', textFieldBlur);

        if ($taskDifficultyComment.length > 0) {
            $taskDifficultyComment.bind('focus', textFieldFocus);
            $taskDifficultyComment.bind('blur', textFieldBlur);
        }

        $(document).bind('keyup', documentKeyUp);
        $(document).bind('keydown', documentKeyDown);

        $(document).bind('mouseup', mouseUp);
    }

    function documentKeyDown(e) {
        // This is a callback method that is triggered when a keyUp event occurs.
        if (!status.focusOnTextField) {
            svw.tracker.push('KeyDown', {'keyCode': e.keyCode});
            switch (e.keyCode) {
                case 16:
                    // "Shift"
                    status.shiftDown = true;
                    break;
            }
        }
    }

    function documentKeyUp (e) {
        // console.log(e.keyCode);

        // This is a callback method that is triggered when a keyDown event occurs.
        if (!status.focusOnTextField) {
            svw.tracker.push('KeyUp', {'keyCode': e.keyCode});
            switch (e.keyCode) {
                case 16:
                    // "Shift"
                    status.shiftDown = false;
                    break;
                case 27:
                    // "Escape"
                    svw.canvas.cancelDrawing();
                    break;
                case 67:
                    // "c" for CurbRamp. Switch the mode to the CurbRamp labeling mode.
                    svw.ribbon.modeSwitchClick("CurbRamp");
                    break
                case 69:
                    // "e" for Explore. Switch the mode to Walk (camera) mode.
                    svw.ribbon.modeSwitchClick("Walk");
                    break;
                case 77:
                    // "m" for MissingCurbRamp. Switch the mode to the MissingCurbRamp labeling mode.
                    svw.ribbon.modeSwitchClick("NoCurbRamp");
                    break;
                case 90:
                    // "z" for zoom. By default, it will zoom in. If "shift" is down, it will zoom out.
                    if (status.shiftDown) {
                        // Zoom out
                        if ("zoomControl" in svw) {
                            svw.zoomControl.zoomOut();
                        }
                    } else {
                        // Zoom in
                        if ("zoomControl" in svw)
                            svw.zoomControl.zoomIn();
                    }
            }
        }
    }

    function mouseUp (e) {
        // A call back method for mouseup. Capture a right click and do something.
        // Capturing right click in javascript.
        // http://stackoverflow.com/questions/2405771/is-right-click-a-javascript-event
        var isRightMB;
        e = e || window.event;

        if ("which" in e)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
            isRightMB = e.which == 3;
        else if ("button" in e)  // IE, Opera
            isRightMB = e.button == 2;

        if (isRightMB) {
            oPublic.clearShiftDown();
        }
    }

    function textFieldBlur () {
        // This is a callback function called when any of the text field is blurred.
        status.focusOnTextField = false
    }

    function textFieldFocus () {
        // This is a callback function called when any of the text field is focused.
        status.focusOnTextField = true;
    }

    ////////////////////////////////////////
    // Public methods
    ////////////////////////////////////////
    oPublic.clearShiftDown = function () {
        // This method turn status.shiftDown to false.
        status.shiftDown = false;
        return this;
    };

    oPublic.isShiftDown = function () {
        // This method returns whether a shift key is currently pressed or not.
        return status.shiftDown;
    };

    init();
    return oPublic;
}