/**
 * Created with JetBrains PhpStorm.
 * User: kotarohara
 * Date: 2/15/13
 * Time: 5:26 PM
 * To change this template use File | Settings | File Templates.
 */

var svw = svw || {};

////////////////////////////////////////////////////////////////////////////////
// RibbonMenu Class Constructor
////////////////////////////////////////////////////////////////////////////////
function RibbonMenu ($, params) {
    var oPublic = {className: 'RibbonMenu'};
    var properties = {
        borderWidth : "3px",
        modeSwitchDefaultBorderColor : "rgba(200,200,200,0.75)",
        originalBackgroundColor: "white"
    };
    var status = {
            'disableModeSwitch' : false,
            'lockDisableModeSwitch' : false,
            'mode' : 'Walk',
            'selectedLabelType' : undefined
        };

    // jQuery DOM elements
    var $divStreetViewHolder;
    var $ribbonButtonBottomLines;
    var $ribbonConnector;
    var $spansModeSwitches;


    ////////////////////////////////////////
    // Private Functions
    ////////////////////////////////////////
    function _init () {
        //
        /// Set some of initial properties
        var browser = getBrowser();
        if (browser === 'mozilla') {
            properties.originalBackgroundColor = "-moz-linear-gradient(center top , #fff, #eee)";
        } else if (browser === 'msie') {
            properties.originalBackgroundColor = "#ffffff";
        } else {
            properties.originalBackgroundColor = "-webkit-gradient(linear, left top, left bottom, from(#fff), to(#eee))";
        }


        var labelColors = svw.misc.getLabelColors();

        //
        // Initialize the jQuery DOM elements
        $divStreetViewHolder = $("#Holder_StreetView");
        $ribbonButtonBottomLines = $(".RibbonModeSwitchHorizontalLine");
        $ribbonConnector = $("#StreetViewLabelRibbonConnection");
        $spansModeSwitches = $('span.modeSwitch');

        //
        // Initialize the color of the lines at the bottom of ribbon menu icons
        $.each($ribbonButtonBottomLines, function (i, v) {
            var labelType = $(v).attr("value");
            var color = labelColors[labelType].fillStyle;
            if (labelType === 'Walk') {
                $(v).css('width', '56px');
            }

            $(v).css('border-top-color', color);
            $(v).css('background', color);
        });

        setModeSwitchBorderColors(status.mode);
        setModeSwitchBackgroundColors(status.mode);

        $spansModeSwitches.bind('click', modeSwitchClickCallback);
        $spansModeSwitches.bind({
            'mouseenter': modeSwitchMouseEnter,
            'mouseleave': modeSwitchMouseLeave
        });
    }

    function modeSwitch (mode) {
        // This is a callback method that is invoked with a ribbon menu button click
        var labelType;

        if (typeof mode === 'string') {
            labelType = mode;
        } else {
            labelType = $(this).attr('val');
        }

        if (status.disableModeSwitch === false) {
            // Check if a bus stop sign is labeled or not.
            // If it is not, do not allow a user to switch to modes other than
            // Walk and StopSign.
            var labelColors;
            var ribbonConnectorPositions;
            var borderColor;

            //
            // Whenever the ribbon menu is clicked, cancel drawing.
            if (svw.canvas.isDrawing()) {
                svw.canvas.cancelDrawing();
            }


            labelColors = getLabelColors();
            ribbonConnectorPositions = getRibbonConnectionPositions();
            borderColor = labelColors[labelType].fillStyle;

            if (svw.map) {
                if (labelType === 'Walk') {
                    // Switch to walking mode.
                    oPublic.setStatus('mode', 'Walk');
                    oPublic.setStatus('selectedLabelType', undefined);
                    svw.map.modeSwitchWalkClick();
                } else {
                    // Switch to labeling mode.
                    oPublic.setStatus('mode', labelType);
                    oPublic.setStatus('selectedLabelType', labelType);
                    svw.map.modeSwitchLabelClick();
                }
            } else {
                throw oPublic.className + ' modeSwitch(): map not defined.';
            }

            // Set border color
            setModeSwitchBorderColors(labelType);
            setModeSwitchBackgroundColors(labelType);


            // Set the instructional message
            if (svw.overlayMessageBox) {
                svw.overlayMessageBox.setMessage(labelType);
            }

            $ribbonConnector.css("left", ribbonConnectorPositions[labelType].labelRibbonConnection);
            $ribbonConnector.css("border-left-color", borderColor);
            $divStreetViewHolder.css("border-color", borderColor);
        }
    }

    function modeSwitchClickCallback () {
        if (status.disableModeSwitch === false) {
            var labelType;
            labelType = $(this).attr('val');

            //
            // If allowedMode is set, mode ('walk' or labelType) except for
            // the one set is not allowed
            if (status.allowedMode && status.allowedMode !== labelType) {
                return false;
            }

            //
            // Track the user action
            svw.tracker.push('Click_ModeSwitch_' + labelType);
            modeSwitch(labelType);
        }
    }

    function modeSwitchMouseEnter () {
        if (status.disableModeSwitch === false) {
            // Change the background color and border color of menu buttons
            // But if there is no Bus Stop label, then do not change back ground colors.
            var labelType = $(this).attr("val");

            //
            // If allowedMode is set, mode ('walk' or labelType) except for
            // the one set is not allowed
            if (status.allowedMode && status.allowedMode !== labelType) {
                return false;
            }
            setModeSwitchBackgroundColors(labelType);
            setModeSwitchBorderColors(labelType);
        }
    }

    function modeSwitchMouseLeave () {
        if (status.disableModeSwitch === false) {
            setModeSwitchBorderColors(status.mode);
            setModeSwitchBackgroundColors(status.mode);
        }
    }

    function setModeSwitchBackgroundColors (mode) {
        // background: -moz-linear-gradient(center top , #fff, #eee);
        // background: -webkit-gradient(linear, left top, left bottom, from(#fff), to(#eee));
        var labelType;
        var labelColors;
        var borderColor;
        var browser;
        var backgroundColor;

        labelColors = getLabelColors();
        borderColor = labelColors[mode].fillStyle;

        $.each($spansModeSwitches, function (i, v) {
            labelType = $(v).attr('val');
            if (labelType === mode) {
                if (labelType === 'Walk') {
                    backgroundColor = "#ccc";
                } else {
                    backgroundColor = borderColor;
                }
                $(this).css({
                    "background" : backgroundColor
                });
            } else {
                backgroundColor = properties.originalBackgroundColor;
                if (labelType !== status.mode) {
                    // Change background color if the labelType is not the currently selected mode.
                    $(this).css({
                        "background" : backgroundColor
                    });
                }
            }
        });
    }

    function setModeSwitchBorderColors (mode) {
        // This method sets the border color of the ribbon menu buttons
        var labelType, labelColors, borderColor;
        labelColors = getLabelColors();
        borderColor = labelColors[mode].fillStyle;

        $.each($spansModeSwitches, function (i, v) {
            labelType = $(v).attr('val');
            if (labelType=== mode) {
                $(this).css({
                    "border-color" : borderColor,
                    "border-style" : "solid",
                    "border-width": properties.borderWidth
                });
            } else {
                if (labelType !== status.mode) {
                    // Change background color if the labelType is not the currently selected mode.
                    $(this).css({
                        "border-color" : properties.modeSwitchDefaultBorderColor,
                        "border-style" : "solid",
                        "border-width": properties.borderWidth
                    });

                }
            }
        });
    }

    ////////////////////////////////////////
    // Public Functions
    ////////////////////////////////////////
    oPublic.backToWalk = function () {
        // This function simulates the click on Walk icon
        modeSwitch('Walk');
        return this;
    };


    oPublic.disableModeSwitch = function () {
        if (!status.lockDisableModeSwitch) {
            status.disableModeSwitch = true;
            $spansModeSwitches.css('opacity', 0.5);
        }
        return this;
    };

    oPublic.disableLandmarkLabels = function () {
        // This function dims landmark labels and
        // also set status.disableLandmarkLabels to true
        $.each($spansModeSwitches, function (i, v) {
            var labelType = $(v).attr('val');
            if (!(labelType === 'Walk' ||
                labelType === 'StopSign' ||
                labelType === 'Landmark_Shelter')
                ) {
                $(v).css('opacity', 0.5);
            }
        });
        status.disableLandmarkLabels = true;
        return this;
    };

    oPublic.enableModeSwitch = function () {
        // This method enables mode switch.
        if (!status.lockDisableModeSwitch) {
            status.disableModeSwitch = false;
            $spansModeSwitches.css('opacity', 1);
        }
        return this;
    };

    oPublic.enableLandmarkLabels = function () {
        $.each($spansModeSwitches, function (i, v) {
            var labelType = $(v).attr('val');
            $(v).css('opacity', 1);
        });
        status.disableLandmarkLabels = false;
        return this;
    };


    oPublic.lockDisableModeSwitch = function () {
        status.lockDisableModeSwitch = true;
        return this;
    };

    oPublic.modeSwitch = function (labelType) {
        // This function simulates the click on a mode switch icon
        modeSwitch(labelType);
    };

    oPublic.modeSwitchClick = function (labelType) {
        // This function simulates the click on a mode switch icon
        // Todo. Deprecated. Delete when you will refactor this code.
        modeSwitch(labelType);
    };


    oPublic.getStatus = function(key) {
            if (key in status) {
                return status[key];
            } else {
              console.warn(oPublic.className, 'You cannot access a property "' + key + '".');
              return undefined;
            }
    };

    oPublic.setAllowedMode = function (mode) {
        // This method sets the allowed mode.
        status.allowedMode = mode;
        return this;
    };

    oPublic.setStatus = function(name, value) {
        try {
            if (name in status) {
                if (name === 'disableModeSwitch') {
                    if (typeof value === 'boolean') {
                        if (value) {
                            oPublic.disableModeSwitch();
                        } else {
                            oPublic.enableModeSwitch();
                        }
                        return this;
                    } else {
                        return false
                    }
                } else {
                    status[name] = value;
                    return this;
                }
            } else {
                var errMsg = '"' + name + '" is not a modifiable status.';
                throw errMsg;
            }
        } catch (e) {
            console.error(oPublic.className, e);
            return false;
        }

    };

    oPublic.unlockDisableModeSwitch = function () {
        status.lockDisableModeSwitch = false;
        return this;
    };


    _init(params);

    return oPublic;
}
