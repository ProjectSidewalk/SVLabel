var svl = svl || {};

/**
 * A Keyboard module
 * @param $
 * @returns {{className: string}}
 * @constructor
 * @memberof svl
 */
function Keyboard ($) {
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
        $textareaComment = ($("#CommentField").length) > 0 ? $("#CommentField") : null;
        $taskDifficultyComment = ($("#task-difficulty-comment").length > 0) ? $("#task-difficulty-comment") : null;
        $inputSkipOther = ($("#Text_BusStopAbsenceOtherReason").length > 0) ? $("#Text_BusStopAbsenceOtherReason") : null;

        if ($textareaComment) {
          $textareaComment.bind('focus', textFieldFocus);
          $textareaComment.bind('blur', textFieldBlur);
        }

        if ($taskDifficultyComment) {
            $taskDifficultyComment.bind('focus', textFieldFocus);
            $taskDifficultyComment.bind('blur', textFieldBlur);
        }

        if ($inputSkipOther) {
          $inputSkipOther.bind('focus', textFieldFocus);
          $inputSkipOther.bind('blur', textFieldBlur);
        }

        $(document).bind('keyup', documentKeyUp);
        $(document).bind('keydown', documentKeyDown);
        $(document).bind('mouseup', mouseUp);
    }

    function documentKeyDown(e) {
        // The callback method that is triggered with a keyUp event.
        if (!status.focusOnTextField) {
          if ('tracker' in svl) {
            svl.tracker.push('KeyDown', {'keyCode': e.keyCode});
          }
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
          if ('tracker' in svl) {
            svl.tracker.push('KeyUp', {'keyCode': e.keyCode});
          }
            switch (e.keyCode) {
                case 16:
                    // "Shift"
                    status.shiftDown = false;
                    break;
                case 27:
                    // "Escape"
                    svl.canvas.cancelDrawing();
                    break;
                case 67:
                    // "c" for CurbRamp. Switch the mode to the CurbRamp labeling mode.
                    svl.ribbon.modeSwitchClick("CurbRamp");
                    break
                case 69:
                    // "e" for Explore. Switch the mode to Walk (camera) mode.
                    svl.ribbon.modeSwitchClick("Walk");
                    break;
                case 77:
                    // "m" for MissingCurbRamp. Switch the mode to the MissingCurbRamp labeling mode.
                    svl.ribbon.modeSwitchClick("NoCurbRamp");
                    break;
                case 90:
                    // "z" for zoom. By default, it will zoom in. If "shift" is down, it will zoom out.
                    if (status.shiftDown) {
                        // Zoom out
                        if ("zoomControl" in svl) {
                            svl.zoomControl.zoomOut();
                        }
                    } else {
                        // Zoom in
                        if ("zoomControl" in svl)
                            svl.zoomControl.zoomIn();
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

    oPublic.getStatus = function (key) {
        if (!(key in status)) {
          console.warn("You have passed an invalid key for status.")
        }
        return status[key];
    };

    oPublic.isShiftDown = function () {
        // This method returns whether a shift key is currently pressed or not.
        return status.shiftDown;
    };

    oPublic.setStatus = function (key, value) {
      if (key in status) {
        status[key] = value;
      }
      return this;
    };

    init();
    return oPublic;
}
