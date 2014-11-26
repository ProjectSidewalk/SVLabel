////////////////////////////////////////////////////////////////////////////////
// Global variables
////////////////////////////////////////////////////////////////////////////////
// var canvasWidth = 720;
// var canvasHeight = 480;
// var svImageHeight = 6656;
// var svImageWidth = 13312;

// Image distortion coefficient. Need to figure out how to compute these.
// It seems like these constants do not depend on browsers... (tested on Chrome, Firefox, and Safari.)
// Distortion coefficient for a window size 640x360: var alpha_x = 5.2, alpha_y = -5.25;
// Distortion coefficient for a window size 720x480:
var svw = svw || {}; // Street View Walker namespace.
svw.canvasWidth = 720;
svw.canvasHeight = 480;
svw.svImageHeight = 6656;
svw.svImageWidth = 13312;
svw.alpha_x = 4.6;
svw.alpha_y = -4.65;
svw._labelCounter = 0;
svw.getLabelCounter = function () {
    return svw._labelCounter++;
};

////////////////////////////////////////////////////////////////////////////////
// Canvas Class Constructor
////////////////////////////////////////////////////////////////////////////////
function Canvas (param, $) {
    console.log("hi");
    var oPublic = {
            className : 'Canvas',
            testCases: {}};

        // Mouse status and mouse event callback functions
    var mouseStatus = {
            currX:0,
            currY:0,
            prevX:0,
            prevY:0,
            leftDownX:0,
            leftDownY:0,
            leftUpX:0,
            leftUpY:0,
            isLeftDown: false,
            prevMouseDownTime : 0,
            prevMouseUpTime : 0
        };
        // Properties
    var properties = {
        evaluationMode: false,
        radiusThresh: 7,
        showDeleteMenuTimeOutToken : undefined,
        tempPointRadius: 5
    };

    var pointParameters = {
        'fillStyleInnerCircle' : 'rgba(0,0,0,1)', // labelColor.fillStyle,
        'lineWidthOuterCircle' : 2,
        'iconImagePath' : undefined, // iconImagePath,
        'radiusInnerCircle' : 5, //13,
        'radiusOuterCircle' : 6, //14,
        'strokeStyleOuterCircle' : 'rgba(255,255,255,1)',
        'storedInDatabase' : false
    };

    var status = {
        'currentLabel' : undefined,
        'disableLabelDelete' : false,
        'disableLabelEdit' : false,
        'disableLabeling' : false,
        'disableWalking' : false,
        'drawing' : false,
        'lockCurrentLabel' : false,
        'lockDisableLabelDelete' : false,
        'lockDisableLabelEdit' : false,
        'lockDisableLabeling' : false,
        svImageCoordinatesAdjusted: false,
        totalLabelCount: 0,
        'visibilityMenu' : 'hidden'
    };

    var lock = {
        showLabelTag: false
    };

    // doms holds id of doms that Canvas will access.
    // validDoms are items names of dom's that should be specified in domIds parameter
    var doms = {};
    var validDoms = ['canvas'];

    // Canvas context
    var canvasProperties = {'height':0, 'width':0};
    var ctx;

    var tempPath = [];

    // Right click menu
    var rightClickMenu = undefined;

    // Path elements
    var systemLabels = [];
    var labels = [];

    // jQuery doms
    var $canvas = $("#labelCanvas");
    var $divLabelDrawingLayer = $("div#labelDrawingLayer");
    var $divHolderLabelDeleteIcon = $("#Holder_LabelDeleteIcon");
    var $divHolderLabelEditIcon = $("#Holder_LabelEditIcon");
    var $labelDeleteIcon = $("#LabelDeleteIcon");

    ////////////////////////////////////////
    // Private Functions
    ////////////////////////////////////////
    // Initialization
    function _init (param) {
        // Initialize doms
        var domIds = param.domIds;
        for (i in validDoms) {
            var domName = validDoms[i];
            doms[domName] = domIds[domName];
        }

        // Set the canvas context.
        var el = document.getElementById(doms.canvas);
        ctx = el.getContext('2d');
        canvasProperties.width = el.width;
        canvasProperties.height = el.height;

        if ('evaluationMode' in param) {
            properties.evaluationMode = param.evaluationMode;
        }

        // Attach listeners to dom elements
        $divLabelDrawingLayer.bind('mousedown', drawingLayerMouseDown);
        $divLabelDrawingLayer.bind('mouseup', drawingLayerMouseUp);
        $divLabelDrawingLayer.bind('mousemove', drawingLayerMouseMove);

        $labelDeleteIcon.bind("click", labelDeleteIconClick);
    }

    function closeLabelPath() {
        svw.tracker.push('LabelingCanvas_FinishLabeling');
        var labelType = svw.ribbon.getStatus('selectedLabelType');
        var labelColor = getLabelColors()[labelType];
        var labelDescription = getLabelDescriptions()[svw.ribbon.getStatus('selectedLabelType')];
        var iconImagePath = getLabelIconImagePath()[labelDescription.id].iconImagePath;

        pointParameters.fillStyleInnerCircle = labelColor.fillStyle;
        pointParameters.iconImagePath = iconImagePath;

        var pathLen = tempPath.length;
        var points = [];
        var pov = getPOV();
        var i;

        for (i = 0; i < pathLen; i++) {
            points.push(new Point(tempPath[i].x, tempPath[i].y, pov, pointParameters));
        }
        var path = new Path(points, {});
        var latlng = getPosition();
        var param = {
            canvasWidth: svw.canvasWidth,
            canvasHeight: svw.canvasHeight,
            canvasDistortionAlphaX: svw.alpha_x,
            canvasDistortionAlphaY: svw.alpha_y,
            labelId: svw.getLabelCounter(),
            labelType: labelDescription.id,
            labelDescription: labelDescription.text,
            labelFillStyle: labelColor.fillStyle,
            panoId: getPanoId(),
            panoramaLat: latlng.lat,
            panoramaLng: latlng.lng,
            panoramaHeading: pov.heading,
            panoramaPitch: pov.pitch,
            panoramaZoom: pov.zoom,
            svImageWidth: svw.svImageWidth,
            svImageHeight: svw.svImageHeight,
            svMode: 'html4'
        };
        if (("panorama" in svw) && ("getPhotographerPov" in svw.panorama)) {
            var photographerPov = svw.panorama.getPhotographerPov();
            param.photographerHeading = photographerPov.heading;
            param.photographerPitch = photographerPov.pitch;
        }

        var label = Label(path, param);
        if (label) {
            status.currentLabel = new Label(path, param)
            labels.push(status.currentLabel);
            svw.actionStack.push('addLabel', status.currentLabel);
        } else {
            throw "Failed to add a new label.";
        }

        // Initialize the tempPath
        tempPath = [];
        svw.ribbon.backToWalk();

        //
        // Review label correctness if this is a ground truth insertion task.
        if (("goldenInsertion" in svw) &&
            svw.goldenInsertion &&
            svw.goldenInsertion.isRevisingLabels()) {
            svw.goldenInsertion.reviewLabels();
        }
    }

    function drawingLayerMouseDown (e) {
        // This function is fired when at the time of mouse-down
        mouseStatus.isLeftDown = true;
        mouseStatus.leftDownX = mouseposition(e, this).x;
        mouseStatus.leftDownY = mouseposition(e, this).y;

        if (!properties.evaluationMode) {
            svw.tracker.push('LabelingCanvas_MouseDown', {x: mouseStatus.leftDownX, y: mouseStatus.leftDownY});
        }

        mouseStatus.prevMouseDownTime = new Date().getTime();
    }

    function drawingLayerMouseUp (e) {
        // This function is fired when at the time of mouse-up
        var currTime;

        mouseStatus.isLeftDown = false;
        mouseStatus.leftUpX = mouseposition(e, this).x;
        mouseStatus.leftUpY = mouseposition(e, this).y;

        currTime = new Date().getTime();

        if (!properties.evaluationMode) {
            if (!status.disableLabeling &&
                currTime - mouseStatus.prevMouseUpTime > 300) {
                // currTime - mouseStatus.prevMouseDownTime < 400) {
                ///!isOn(mouseStatus.leftUpX, mouseStatus.leftUpY)) {
                // This part is executed by a single click
                var iconImagePath;
                var label;
                var latlng;
                var pointParameters;
                var labelColor;
                var labelDescription;

                if (svw.ribbon) {
                    // labelColor = getLabelColors()[svw.ribbon.getStatus('selectedLabelType')];
                    var labelType = svw.ribbon.getStatus('selectedLabelType');
                    var labelDescriptions = getLabelDescriptions();
                    labelDescription = labelDescriptions[labelType];
                    // iconImagePath = getLabelIconImagePath()[labelDescription.id].iconImagePath;

                    // Define point parameters to draw

                    if (!status.drawing) {
                        // Start drawing a path if a user hasn't started to do so.
                        status.drawing = true;
                        if ('tracker' in svw && svw.tracker) {
                            svw.tracker.push('LabelingCanvas_StartLabeling');
                        }

                        var point = {x: mouseStatus.leftUpX, y: mouseStatus.leftUpY};
                        tempPath.push(point);
                    } else {
                        // Close the current path if there are more than 2 points in the tempPath and
                        // the user clicks on a point near the initial point.
                        var closed = false;
                        var pathLen = tempPath.length;
                        if (pathLen > 2) {
                            var r = Math.sqrt(Math.pow((tempPath[0].x - mouseStatus.leftUpX), 2) + Math.pow((tempPath[0].y - mouseStatus.leftUpY), 2));
                            if (r < properties.radiusThresh) {
                                closed = true;
                                status.drawing = false;
                                closeLabelPath();
                            }
                        }

                        //
                        // Otherwise add a new point
                        if (!closed) {
                            var point = {x: mouseStatus.leftUpX, y: mouseStatus.leftUpY};
                            tempPath.push(point);
                        }
                    }
                } else {
                    throw oPublic.className + ' drawingLayerMouseUp(): ribbon not defined.';
                }

                oPublic.clear();
                oPublic.setVisibilityBasedOnLocation('visible', getPanoId());
                oPublic.render2();
            } else if (currTime - mouseStatus.prevMouseUpTime < 400) {
                // This part is executed for a double click event
                // If the current status.drawing = true, then close the current path.
                var pathLen = tempPath.length;
                if (status.drawing && pathLen > 2) {
                    status.drawing = false;

                    closeLabelPath();
                    oPublic.clear();
                    oPublic.setVisibilityBasedOnLocation('visible', getPanoId());
                    oPublic.render2();
                }
            }
        } else {
            // If it is an evaluation mode, do... (nothing)
        }

        svw.tracker.push('LabelingCanvas_MouseUp', {x: mouseStatus.leftUpX, y: mouseStatus.leftUpY});
        mouseStatus.prevMouseUpTime = new Date().getTime();
        mouseStatus.prevMouseDownTime = 0;
    }

    function drawingLayerMouseMove (e) {
        // This function is fired when mouse cursor moves
        // over the drawing layer.
        var mousePosition = mouseposition(e, this);
        mouseStatus.currX = mousePosition.x;
        mouseStatus.currY = mousePosition.y;

        // Change a cursor according to the label type.
        // $(this).css('cursor', )
        if ('ribbon' in svw) {
            var cursorImagePaths = svw.misc.getLabelCursorImagePath();
            var labelType = svw.ribbon.getStatus('mode');
            if (labelType) {
                var cursorImagePath = cursorImagePaths[labelType].cursorImagePath;
                var cursorUrl = "url(" + cursorImagePath + ") 6 25, auto";

                if (rightClickMenu && rightClickMenu.isAnyOpen()) {
                    cursorUrl = 'default';
                }

                $(this).css('cursor', cursorUrl);
            }
        } else {
            throw oPublic.className + ': Import the RibbonMenu.js and instantiate it!';
        }


        if (!status.drawing) {
            var ret = isOn(mouseStatus.currX, mouseStatus.currY);
            if (ret && ret.className === 'Path') {
                oPublic.showLabelTag(status.currentLabel);
                ret.renderBoundingBox(ctx);
            } else {
                oPublic.showLabelTag(undefined);
            }
        }
        oPublic.clear();
        oPublic.render2();
        mouseStatus.prevX = mouseposition(e, this).x;
        mouseStatus.prevY = mouseposition(e, this).y;
    }

    function imageCoordinates2String (coordinates) {
        if (!(coordinates instanceof Array)) {
            throw oPublic.className + '.imageCoordinates2String() expects Array as an input';
        }
        if (coordinates.length === 0) {
            throw oPublic.className + '.imageCoordinates2String(): Empty array';
        }
        var ret = '';
        var i ;
        var len = coordinates.length;

        for (i = 0; i < len; i += 1) {
            ret += parseInt(coordinates[i].x) + ' ' + parseInt(coordinates[i].y) + ' ';
        }

        return ret;
    }

    function isOn (x, y) {
        // This function takes cursor coordinates x and y on the canvas.
        // Then returns an object right below the cursor.
        // If a cursor is not on anything, return false.
        var i, lenLabels, ret;
        lenLabels = labels.length;

        ret = false;
        for (i = 0; i < lenLabels; i += 1) {
            // Check labels, paths, and points to see if they are
            // under a mouse cursor
            ret = labels[i].isOn(x, y);
            if (ret) {
                status.currentLabel = labels[i];
                return ret;
            }
        }
        return false;
    }

    function labelDeleteIconClick () {
        // Deletes the current label
        if (!status.disableLabelDelete) {
            svw.tracker.push('Click_LabelDelete');
            var currLabel = oPublic.getCurrentLabel();
            if (!currLabel) {
                //
                // Sometimes (especially during ground truth insertion if you force a delete icon to show up all the time),
                // currLabel would not be set properly. In such a case, find a label underneath the delete icon.
                var x = $divHolderLabelDeleteIcon.css('left');
                var y = $divHolderLabelDeleteIcon.css('top');
                x = x.replace("px", "");
                y = y.replace("px", "");
                x = parseInt(x, 10) + 5;
                y = parseInt(y, 10) + 5;
                var item = isOn(x, y);
                if (item && item.className === "Point") {
                    var path = item.belongsTo();
                    currLabel = path.belongsTo();
                } else if (item && item.className === "Label") {
                    currLabel = item;
                } else if (item && item.className === "Path") {
                    currLabel = item.belongsTo();
                }
            }

            if (currLabel) {
                oPublic.removeLabel(currLabel);
                svw.actionStack.push('deleteLabel', oPublic.getCurrentLabel());
                $divHolderLabelDeleteIcon.css('visibility', 'hidden');
                // $divHolderLabelEditIcon.css('visibility', 'hidden');


                //
                // If showLabelTag is blocked by GoldenInsertion (or by any other object), unlock it as soon as
                // a label is deleted.
                if (lock.showLabelTag) {
                    oPublic.unlockShowLabelTag();
                }
            }
        }
    }

    function renderTempPath() {
        // This method renders a line from the last point in tempPath to current mouse point.

        if (!svw.ribbon) {
            // return if the ribbon menu is not correctly loaded.
            return false;
        }

        var i = 0;
        var pathLen = tempPath.length;
        var labelColor = getLabelColors()[svw.ribbon.getStatus('selectedLabelType')];

        var pointFill = labelColor.fillStyle;
        pointFill = svw.util.color.changeAlphaRGBA(pointFill, 0.5);


        // Draw the first line.
        ctx.strokeStyle = 'rgba(255,255,255,1)';
        ctx.lineWidth = 2;
        if (pathLen > 1) {
            var curr = tempPath[1];
            var prev = tempPath[0];
            var r = Math.sqrt(Math.pow((tempPath[0].x - mouseStatus.currX), 2) + Math.pow((tempPath[0].y - mouseStatus.currY), 2));

            // Change the circle radius of the first point depending on the distance between a mouse cursor and the point coordinate.
            if (r < properties.radiusThresh && pathLen > 2) {
                svw.util.shape.lineWithRoundHead(ctx, prev.x, prev.y, 2 * properties.tempPointRadius, curr.x, curr.y, properties.tempPointRadius, 'both', 'rgba(255,255,255,1)', pointFill, 'none', 'rgba(255,255,255,1)', pointFill);
            } else {
                svw.util.shape.lineWithRoundHead(ctx, prev.x, prev.y, properties.tempPointRadius, curr.x, curr.y, properties.tempPointRadius, 'both', 'rgba(255,255,255,1)', pointFill, 'none', 'rgba(255,255,255,1)', pointFill);
            }
        }

        // Draw the lines in between
        for (i = 2; i < pathLen; i++) {
            var curr = tempPath[i];
            var prev = tempPath[i-1];
            svw.util.shape.lineWithRoundHead(ctx, prev.x, prev.y, 5, curr.x, curr.y, 5, 'both', 'rgba(255,255,255,1)', pointFill, 'none', 'rgba(255,255,255,1)', pointFill);
        }

        if (r < properties.radiusThresh && pathLen > 2) {
            svw.util.shape.lineWithRoundHead(ctx, tempPath[pathLen-1].x, tempPath[pathLen-1].y, properties.tempPointRadius, tempPath[0].x, tempPath[0].y, 2 * properties.tempPointRadius, 'both', 'rgba(255,255,255,1)', pointFill, 'none', 'rgba(255,255,255,1)', pointFill);
        } else {
            svw.util.shape.lineWithRoundHead(ctx, tempPath[pathLen-1].x, tempPath[pathLen-1].y, properties.tempPointRadius, mouseStatus.currX, mouseStatus.currY, properties.tempPointRadius, 'both', 'rgba(255,255,255,1)', pointFill, 'stroke', 'rgba(255,255,255,1)', pointFill);
        }
        return;
    }

    ////////////////////////////////////////
    // Public Functions
    ////////////////////////////////////////
    oPublic.cancelDrawing = function () {
        // This method clears a tempPath and cancels drawing. This method is called by Keyboard when esc is pressed.
        if ('tracker' in svw && svw.tracker) {
            svw.tracker.push("LabelingCanvas_CancelLabeling");
        }

        tempPath = [];
        status.drawing = false;
        oPublic.clear().render2();
        return this;
    };

    oPublic.clear = function () {
        // Clears the canvas
        ctx.clearRect(0, 0, canvasProperties.width, canvasProperties.height);
        return this;
    };

    oPublic.disableLabelDelete = function () {
        if (!status.lockDisableLabelDelete) {
            status.disableLabelDelete = true;
            return this;
        }
        return false;
    };

    oPublic.disableLabelEdit = function () {
       if (!status.lockDisableLabelEdit) {
           status.disableLabelEdit = true;
           return this;
       }
       return false;
    };

    oPublic.disableLabeling = function () {
        // Check right-click-menu visibility
        // If any of menu is visible, disable labeling
        if (!status.lockDisableLabeling) {
            status.disableLabeling = true;
            /*
            var menuOpen = rightClickMenu.isAnyOpen();
            if (menuOpen) {
                status.disableLabeling = true;
            } else {
                status.disableLabeling = false;
            }
            */
            return this;
        }
        return false;
    };

    oPublic.disableMenuClose = function () {
        if (rightClickMenu) {
            rightClickMenu.disableMenuClose();
        }
        return this;
    };

    oPublic.disableMenuSelect = function ()  {
        if (rightClickMenu) {
            rightClickMenu.disableMenuSelect();
        }
        return this;
    };

    oPublic.enableLabelDelete = function () {
        if (!status.lockDisableLabelDelete) {
            status.disableLabelDelete = false;
            return this;
        }
        return false;
    };

    oPublic.enableLabelEdit = function () {
        if (!status.lockDisableLabelEdit) {
            status.disableLabelEdit = false;
            return this;
        }
        return false;
    };

    oPublic.enableLabeling = function () {
        // Check right-click-menu visiibliey
        // If all of the right click menu are hidden,
        // enable labeling
        if (!status.lockDisableLabeling) {
            status.disableLabeling = false;
            return this;
        }
        return false;
    };

    oPublic.enableMenuClose = function () {
        rightClickMenu.enableMenuClose();
        return this;
    };

    oPublic.enableMenuSelect  = function () {
        rightClickMenu.enableMenuSelect();
        return this;
    };

    oPublic.getCurrentLabel = function () {
        return status.currentLabel;
    };

    oPublic.getLabels = function (target) {
        // This method returns a deepcopy of labels stored in this canvas.
        if (!target) {
            target = 'user';
        }

        if (target === 'system') {
            return oPublic.getSystemLabels(false);
            // return $.extend(true, [], systemLabels);
        } else {
            return oPublic.getUserLabels(false);
            // $.extend(true, [], labels);
        }
    };

    oPublic.getNumLabels = function () {
        var len = labels.length;
        var i;
        var total = 0;
        for (i =0; i < len; i++) {
            if (!labels[i].isDeleted() && labels[i].isVisible()) {
                total++;
            }
        }
        return total;
    };

    oPublic.getRightClickMenu = function () {
        return rightClickMenu;
    };

    oPublic.getSystemLabels = function (reference) {
        // This method returns system labels. If refrence is true, then it returns reference to the labels.
        // Otherwise it returns deepcopy of labels.
        if (!reference) {
            reference = false;
        }

        if (reference) {
            return systemLabels;
        } else {
            return $.extend(true, [], systemLabels);
        }
    };

    oPublic.getUserLabelCount = function () {
        var labels = oPublic.getUserLabels();
        labels = labels.filter(function (label) {
            return !label.isDeleted() && label.isVisible();
        })
        return labels.length;
    };

    oPublic.getUserLabels = function (reference) {
        // This method returns user labels. If reference is true, then it returns reference to the labels.
        // Otherwise it returns deepcopy of labels.
        if (!reference) {
            reference = false;
        }

        if (reference) {
            return labels;
        } else {
            return $.extend(true, [], labels);
        }
    };

    oPublic.hideDeleteLabel = function (x, y) {
        rightClickMenu.hideDeleteLabel();
        return this;
    };

    oPublic.hideRightClickMenu = function () {
        rightClickMenu.hideBusStopType();
        rightClickMenu.hideBusStopPosition();
        return this;
    };

    oPublic.insertLabel = function (labelPoints, target) {
        // This method takes a label data (i.e., a set of point coordinates, label types, etc) and
        // and insert it into the labels array so the Canvas will render it
        if (!target) {
            target = 'user';
        }

        var i;
        var labelColors = svw.misc.getLabelColors();
        var iconImagePaths = svw.misc.getIconImagePaths();
        var length = labelPoints.length;
        var pointData;
        var pov;
        var point;
        var points = [];

        for (i = 0; i < length; i += 1) {
            pointData = labelPoints[i];
            pov = {
                heading: pointData.originalHeading,
                pitch: pointData.originalPitch,
                zoom: pointData.originalZoom
            };
            point = new Point();

            if ('PhotographerHeading' in pointData && pointData.PhotographerHeading &&
                'PhotographerPitch' in pointData && pointData.PhotographerPitch) {
                point.setPhotographerPov(parseFloat(pointData.PhotographerHeading), parseFloat(pointData.PhotographerPitch));
            }

            point.resetSVImageCoordinate({
                x: parseInt(pointData.svImageX, 10),
                y: parseInt(pointData.svImageY, 10)
            });
            point.resetProperties({
                fillStyleInnerCircle : labelColors[pointData.LabelType].fillStyle,
                lineWidthOuterCircle : 2,
                iconImagePath : iconImagePaths[pointData.LabelType].iconImagePath,
                originalCanvasCoordinate: pointData.originalCanvasCoordinate,
                originalHeading: pointData.originalHeading,
                originalPitch: pointData.originalPitch,
                originalZoom: pointData.originalZoom,
                pov: pov,
                radiusInnerCircle : 5, // 13,
                radiusOuterCircle : 6, // 14,
                strokeStyleOuterCircle : 'rgba(255,255,255,1)',
                storedInDatabase : false
            });

            points.push(point)
        }

        var param = {};
        var path;
        var labelDescriptions = svw.misc.getLabelDescriptions();

        path = new Path(points);

        param.canvasWidth = svw.canvasWidth;
        param.canvasHeight = svw.canvasHeight;
        param.canvasDistortionAlphaX = svw.alpha_x;
        param.canvasDistortionAlphaY = svw.alpha_y;
        param.labelId = labelPoints[0].LabelId;
        param.labelerId = labelPoints[0].AmazonTurkerId
        param.labelType = labelPoints[0].LabelType;
        param.labelDescription = labelDescriptions[param.labelType].text;
        param.labelFillStyle = labelColors[param.labelType].fillStyle;
        param.panoId = labelPoints[0].LabelGSVPanoramaId;
        param.panoramaLat = labelPoints[0].Lat;
        param.panoramaLng = labelPoints[0].Lng;
        param.panoramaHeading = labelPoints[0].heading;
        param.panoramaPitch = labelPoints[0].pitch;
        param.panoramaZoom = labelPoints[0].zoom;

        param.svImageWidth = svw.svImageWidth;
        param.svImageHeight = svw.svImageHeight;
        param.svMode = 'html4';

        if (("PhotographerPitch" in labelPoints[0]) && ("PhotographerHeading" in labelPoints[0])) {
            param.photographerHeading = labelPoints[0].PhotographerHeading;
            param.photographerPitch = labelPoints[0].PhotographerPitch;
        }

        var newLabel = new Label(path, param);

        if (target === 'system') {
            systemLabels.push(newLabel);
        } else {
            labels.push(newLabel);
        }
    };

    oPublic.isBusStopLabeled = function () {
        var i;
        var isBusStopSignLabeled = false;
        var label;
        var lenLabels;
        lenLabels = labels.length;

        for (i = 0; i < lenLabels; i += 1) {
            // Check if the label comes from current SV panorama
            label = labels[i];
            // if (!label.isDeleted() && label.getLabelType() ==="StopSign") {
            if (label.isVisible() && label.getLabelType() ==="StopSign") {
                isBusStopSignLabeled = true;
            }
        }
        return isBusStopSignLabeled;
    };

    oPublic.isBusStopShelterLabeled = function () {
        var i;
        var isBusStopShelterLabeled = false;
        var label;
        var lenLabels;
        lenLabels = labels.length;

        for (i = 0; i < lenLabels; i += 1) {
            // Check if the label comes from current SV panorama
            label = labels[i];
            // if (!label.isDeleted() && label.getLabelType() ==="StopSign") {
            if (label.isVisible() && label.getLabelType() ==="Landmark_Shelter") {
                isBusStopShelterLabeled = true;
            }
        }
        return isBusStopShelterLabeled;
    };

    oPublic.isDrawing = function () {
        // This method returns the current status drawing.
        return status.drawing;
    };

    oPublic.isEvaluationMode = function () {
        return properties.evaluationMode;
    };

    oPublic.isOn = function (x, y) {
        // Get an object right below (x,y)
        return isOn(x, y);
    };

    oPublic.lockCurrentLabel = function () {
        status.lockCurrentLabel = true;;
        return this;
    };

    oPublic.lockDisableLabelDelete = function () {
        status.lockDisableLabelDelete = true;;
        return this;
    };

    oPublic.lockDisableLabelEdit = function () {
        status.lockDisableLabelEdit = true;
        return this;
    };

    oPublic.lockDisableLabeling = function () {
        status.lockDisableLabeling = true;
        return this;
    };

    oPublic.lockDisableMenuSelect = function () {
        rightClickMenu.lockDisableMenuSelect();
        return this;
    };

    oPublic.lockShowLabelTag = function () {
        // This method locks showLabelTag
        lock.showLabelTag = true;
        return this;
    };

    oPublic.pushLabel = function (label) {
        status.currentLabel = label;
        labels.push(label);
        if (svw.actionStack) {
            svw.actionStack.push('addLabel', label);
        }
        return this;
    };

    oPublic.removeLabel = function (label) {
        // This function removes a passed label and its child path and points
        // var labelIndex = labels.indexOf(label);

        if (!label) {
            return false;
        }
        svw.tracker.push('RemoveLabel', {labelId: label.getProperty('labelId')});

        label.setStatus('deleted', true);
        label.setStatus('visibility', 'hidden');
        // I do not want to actually remove this label, but set the flag as
        // deleted
        // label.removePath();
        // labels.remove(labelIndex);

        //
        // Review label correctness if this is a ground truth insertion task.
        if (("goldenInsertion" in svw) &&
            svw.goldenInsertion &&
            svw.goldenInsertion.isRevisingLabels()) {
            svw.goldenInsertion.reviewLabels();
        }

        oPublic.clear();
        oPublic.render2();
        return this;
    };

    oPublic.render = function () {
        // KH. Deprecated.
        // Renders labels and pathes (as well as points in each path.)
        var pov = getPOV();
        // renderLabels(pov, ctx);
        return this;
    };

    oPublic.render2 = function () {
        var i;
        var label;
        var lenLabels;
        var labelCount = {
            Landmark_Bench : 0,
            Landmark_Shelter: 0,
            Landmark_TrashCan: 0,
            Landmark_MailboxAndNewsPaperBox: 0,
            Landmark_OtherPole: 0,
            StopSign : 0,
            CurbRamp: 0,
            NoCurbRamp: 0
        };
        status.totalLabelCount = 0;
        var pov = getPOV();


        //
        // The image coordinates of the points in system labels shift as the projection parameters (i.e., heading and pitch) that
        // you can get from Street View API change. So adjust the image coordinate
        // Note that this adjustment happens only once
        if (!status.svImageCoordinatesAdjusted) {
            var currentPhotographerPov = svw.panorama.getPhotographerPov();
            if (currentPhotographerPov && 'heading' in currentPhotographerPov && 'pitch' in currentPhotographerPov) {
                var j;
                //
                // Adjust user labels
                lenLabels = labels.length;
                for (i = 0; i < lenLabels; i += 1) {
                    // Check if the label comes from current SV panorama
                    label = labels[i];
                    var points = label.getPoints(true)
                    var pointsLen = points.length;

                    for (j = 0; j < pointsLen; j++) {
                        var pointData = points[j].getProperties();
                        var svImageCoordinate = points[j].getGSVImageCoordinate();
                        if ('photographerHeading' in pointData && pointData.photographerHeading) {
                            var deltaHeading = currentPhotographerPov.heading - pointData.photographerHeading;
                            var deltaPitch = currentPhotographerPov.pitch - pointData.photographerPitch;
                            var x = (svImageCoordinate.x + (deltaHeading / 360) * svw.svImageWidth + svw.svImageWidth) % svw.svImageWidth;
                            var y = svImageCoordinate.y + (deltaPitch / 90) * svw.svImageHeight;
                            points[j].resetSVImageCoordinate({x: x, y: y})
                        }
                    }
                }

                //
                // Adjust system labels
                lenLabels = systemLabels.length;
                for (i = 0; i < lenLabels; i += 1) {
                    // Check if the label comes from current SV panorama
                    label = systemLabels[i];
                    var points = label.getPoints(true)
                    var pointsLen = points.length;

                    for (j = 0; j < pointsLen; j++) {
                        var pointData = points[j].getProperties();
                        var svImageCoordinate = points[j].getGSVImageCoordinate();
                        if ('photographerHeading' in pointData && pointData.photographerHeading) {
                            var deltaHeading = currentPhotographerPov.heading - pointData.photographerHeading;
                            var deltaPitch = currentPhotographerPov.pitch - pointData.photographerPitch;
                            var x = (svImageCoordinate.x + (deltaHeading / 360) * svw.svImageWidth + svw.svImageWidth) % svw.svImageWidth;
                            var y = svImageCoordinate.y + (deltaPitch / 180) * svw.svImageHeight;
                            points[j].resetSVImageCoordinate({x: x, y: y})
                        }
                    }
                }
                status.svImageCoordinatesAdjusted = true;
            }
        }

        //
        // Render user labels
        lenLabels = labels.length;
        for (i = 0; i < lenLabels; i += 1) {
            // Check if the label comes from current SV panorama
            label = labels[i];

            // If it is an evaluation mode, let a label not render a bounding box and a delete button.
            if (properties.evaluationMode) {
                label.render(ctx, pov, true);
            } else {
                label.render(ctx, pov);
            }

            if (label.isVisible() && !label.isDeleted()) {
                labelCount[label.getLabelType()] += 1;
                status.totalLabelCount += 1;
            }
        }

        //
        // Render system labels
        lenLabels = systemLabels.length;
        for (i = 0; i < lenLabels; i += 1) {
            // Check if the label comes from current SV panorama
            label = systemLabels[i];

            // If it is an evaluation mode, let a label not render a bounding box and a delete button.
            if (properties.evaluationMode) {
                label.render(ctx, pov, true);
            } else {
                label.render(ctx, pov);
            }
        }

        //
        // Draw a temporary path from the last point to where a mouse cursor is.
        if (status.drawing) {
            renderTempPath();
        }

        //
        // Check if the user audited all the angles or not.
        if ('form' in svw) {
            svw.form.checkSubmittable();
        }

        if ('progressPov' in svw) {
            svw.progressPov.updateCompletionRate();
        }

        //
        // Update the landmark counts on the right side of the interface.
        if (svw.labeledLandmarkFeedback) {
            svw.labeledLandmarkFeedback.setLabelCount(labelCount);
        }

        //
        // Update the opacity of undo and redo buttons.
        if (svw.actionStack) {
            svw.actionStack.updateOpacity();
        }

        //
        // Update the opacity of Zoom In and Zoom Out buttons.
        if (svw.zoomControl) {
            svw.zoomControl.updateOpacity();
        }

        //
        // This like of code checks if the golden insertion code is running or not.
        if ('goldenInsertion' in svw && svw.goldenInsertion) {
            svw.goldenInsertion.renderMessage();
        }
        return this;
    };

    oPublic.renderBoundingBox = function (path) {
        path.renderBoundingBox(ctx);
        return this;
    };

    oPublic.setCurrentLabel = function (label) {
        if (!status.lockCurrentLabel) {
            status.currentLabel = label;
            return this;
        }
        return false;
    };

    oPublic.setStatus = function (key, value) {
        // This function is allows other objects to access status
        // of this object
        if (key in status) {
            if (key === 'disableLabeling') {
                if (typeof value === 'boolean') {
                    if (value) {
                        oPublic.disableLabeling();
                    } else {
                        oPublic.enableLabeling();
                    }
                    return this;
                } else {
                    return false;
                }
            } else if (key === 'disableMenuClose') {
                if (typeof value === 'boolean') {
                    if (value) {
                        oPublic.disableMenuClose();
                    } else {
                        oPublic.enableMenuClose();
                    }
                    return this;
                } else {
                    return false;
                }
            } else if (key === 'disableLabelDelete') {
                if (value === true) {
                    oPublic.disableLabelDelete();
                } else if (value === false) {
                    oPublic.enableLabelDelete();
                }
            } else {
                status[key] = value;
            }
        } else {
            throw oPublic.className + ": Illegal status name.";
        }
    };

    oPublic.showLabelTag = function (label) {
        // This function sets the passed label's tagVisiblity to 'visible' and all the others to
        // 'hidden'.
        if (!lock.showLabelTag) {
            var i;
            var labelLen;
            var isAnyVisible = false;
            labelLen = labels.length;
            if (label) {
                for (i = 0; i < labelLen; i += 1) {
                    //if (labels[i] === label) {
                    if (labels[i].getLabelId() === label.getLabelId()) {
                        labels[i].setTagVisibility('visible');
                        isAnyVisible = true;
                    } else {
                        labels[i].setTagVisibility('hidden');
                        labels[i].resetTagCoordinate();
                    }
                }
            } else {
                for (i = 0; i < labelLen; i++) {
                    labels[i].setTagVisibility('hidden');
                    labels[i].resetTagCoordinate();
                }
                $divHolderLabelDeleteIcon.css('visibility', 'hidden');
            }
            // If any of the tags is visible, show a deleting icon on it.
            if (!isAnyVisible) {
                $divHolderLabelDeleteIcon.css('visibility', 'hidden');
            }
            oPublic.clear().render2();
            return this;
        }
    };

    oPublic.setTagVisibility = function (labelIn) {
        // Deprecated
        return oPublic.showLabelTag(labelIn);
    };

    oPublic.setVisibility = function (visibility) {
        var i = 0;
        var labelLen = 0;

        labelLen = labels.length;
        for (i = 0; i < labelLen; i += 1) {
            labels[i].unlockVisibility().setVisibility('visible');
        }
        return this;
    };

    oPublic.setVisibilityBasedOnLocation = function (visibility) {
        var i = 0;
        var labelLen = 0;

        labelLen = labels.length;
        for (i = 0; i < labelLen; i += 1) {
            labels[i].setVisibilityBasedOnLocation(visibility, getPanoId());
        }
        return this;
    };

    oPublic.setVisibilityBasedOnLabelerId = function (visibility, LabelerIds, included) {
        // This function should not be used in labeling interfaces, but only in evaluation interfaces.
        // Set labels that are not in LabelerIds hidden
        var i = 0;
        var labelLen = 0;

        labelLen = labels.length;
        for (i = 0; i < labelLen; i += 1) {
            labels[i].setVisibilityBasedOnLabelerId(visibility, LabelerIds, included);
        }
        return this;
    };

    oPublic.setVisibilityBasedOnLabelerIdAndLabelTypes = function (visibility, table, included) {
        var i = 0;
        var labelLen = 0;

        labelLen = labels.length;
        for (i = 0; i < labelLen; i += 1) {
            labels[i].setVisibilityBasedOnLabelerIdAndLabelTypes(visibility, table, included);
        }
        return this;
    };

    oPublic.showDeleteLabel = function (x, y) {
        rightClickMenu.showDeleteLabel(x, y);
    };

    oPublic.unlockCurrentLabel = function () {
        status.lockCurrentLabel = false;
        return this;
    };

    oPublic.unlockDisableLabelDelete = function () {
        status.lockDisableLabelDelete = false;
        return this;
    };

    oPublic.unlockDisableLabelEdit = function () {
        status.lockDisableLabelEdit = false;
        return this;
    };


    oPublic.unlockDisableLabeling = function () {
        status.lockDisableLabeling = false;
        return this;
    };

    oPublic.unlockDisableMenuSelect = function () {
        rightClickMenu.unlockDisableMenuSelect();
        return this;
    };

    oPublic.unlockShowLabelTag = function () {
        // This method locks showLabelTag
        lock.showLabelTag = false;
        return this;
    };
    ////////////////////////////////////////
    // Tests
    ////////////////////////////////////////
    oPublic.runTestCases = function () {
        module('Canvas tests');

        test('Return false.', function () {
            ok(true, "Test");
        });

        test('Ajax test', function () {
            expect(1);
            stop();

            $.ajax({
                url: 'http://localhost/sidewalk/SidewalkLabeler_v1/api_get_intersection',
                success: function (result) {
                    ok(true, 'Ajax tet works :)');
                    start();
                },
                error: function (e) {
                    console.error('Something wrong with Ajax', e);
                    start();
                }
            });
        });

        test('Pano location test', function () {
            expect(3);
            stop();

            $.ajax({
                url: 'http://localhost/sidewalk/SidewalkLabeler_v1/?/api_get_intersection&pano_id=3dlyB8Z0jFmZKSsTQJjMQg',
                dataType: "json",
                success: function (result) {
                    var intersections = result.intersections;
                    var lat = intersections[0].Lat;
                    var lng = intersections[0].Lng;
                    equal(1, '1', 'String and number?');
                    equal(lat, 38.935869, 'Lat matches :)');
                    equal(lng, -77.019210, 'Lng matches :)');
                    start();
                },
                error: function (e) {
                    console.error('Something wrong with Ajax', e);
                    start();
                }
            });
        });

        test('Wrong pano id', function () {
            expect(1);
            stop();

            $.ajax({
                url: 'http://localhost/sidewalk/SidewalkLabeler_v1/?/api_get_intersection&pano_id=3dlyB8Z0jFmZKSsTQJjMQ',
                dataType: "json",
                success: function (result) {
                    if (result.error) {
                        var message = result.error.message;
                        equal(message, 'No panorama matched the pano id: 3dlyB8Z0jFmZKSsTQJjMQ .');
                    }
                    start();
                },
                error: function (e) {
                    console.error('Something wrong with Ajax', e);
                    start();
                }
            });
        });

        test('Get intersection by worker_id and task_description', function () {
            expect(3);
            stop();

            $.ajax({
                url: 'http://localhost/sidewalk/SidewalkLabeler_v1/?/api_get_intersection&task_description=PilotTask&worker_id=NameINeverUse',
                dataType: "json",
                success: function (result) {
                    var intersections = result.intersections;
                    var lat = intersections[0].Lat;
                    var lng = intersections[0].Lng;
                    var panoId = intersections[0].NearestGSVPanoramaId;
                    equal(lat, 38.894799, 'Lat matches :)');
                    equal(lng, -77.021906, 'Lng matches :)');
                    equal(panoId, '_AUz5cV_ofocoDbesxY3Kw', 'PanoId matches');
                    start();
                },
                error: function (e) {
                    console.error('Something wrong with Ajax', e);
                    start();
                }
            });
        });

        // Label tests
        test('Instantiate label', function () {
            var pov = getPOV();
            var pointParam = {
                fillStyleInnerCircle: "rgba(0, 244, 38, 0.9)",
                iconImagePath: "public/img/icons/Sidewalk/Icon_CurbRamp-13.svg",
                lineWidthOuterCircle: 2,
                radiusInnerCircle: 5,
                radiusOuterCircle: 6,
                storedInDatabase: false,
                strokeStyleOuterCircle: "rgba(255,255,255,1)"
            };
            var userPoints = [
                {x: 200, y: 200},
                {x: 300, y: 200},
                {x: 300, y: 300},
                {x: 200, y: 300}
            ];
            var points = [];
            for (i = 0; i < userPoints.length; i++) {
                points.push(new Point(userPoints[i].x, userPoints[i].y, pov, pointParam));
            }
            var path = new Path(points, {});
            var param = {
                canvasWidth: 720,
                canvasHeight: 480,
                canvasDistortionAlphaX: 4.6,
                canvasDistortionAlphaY: -4.65,
                labelFillStyle: "rgba(0, 244, 38, 0.9)",
                labelId: svw.getLabelCounter(),
                labelType: "CurbRamp",
                labelDescription: 'CurbRamp',
                panoId: "3dlyB8Z0jFmZKSsTQJjMQg",
                panoramaHeading: 0,
                panoramaLat: 38.935869,
                panoramaLng: -77.01920999999999,
                panoramaPitch: -10,
                panoramaZoom: 1,
                svImageHeight: 6656,
                svImageWidth: 13312,
                svMode: "html4"
            };

            var label = new Label(path, param);
            equal(label.getProperty('canvasWidth'), param.canvasWidth, 'Correct canvasWidth');
            equal(label.getProperty('canvasHeight'), param.canvasHeight, 'Correct canvasHeight');
            equal(label.getProperty('canvasDistortionAlphaX'), param.canvasDistortionAlphaX, 'Correct canvasDistortionAlphaX');
            equal(label.getProperty('canvasDistortionAlphaY'), param.canvasDistortionAlphaY, 'Correct canvasDistortionAlphaY');
            equal(label.getProperty('labelFillStyle'), param.labelFillStyle, 'Correct labelFillStyle');
            equal(label.getProperty('labelId'), param.labelId, 'Correct labelId');
            equal(label.getProperty('labelType'), param.labelType, 'Correct labelType');
            equal(label.getProperty('labelDescription'), param.labelDescription, 'Correct labelDescription');
            equal(label.getProperty('panoId'), param.panoId, 'Correct panoId');
            equal(label.getProperty('panoramaHeading'), param.panoramaHeading, 'Correct panoramaHeading');
            equal(label.getProperty('panoramaLat'), param.panoramaLat, 'Correct panoramaLat');
            equal(label.getProperty('panoramaLng'), param.panoramaLng, 'Correct panoramaLng');
            equal(label.getProperty('panoramaPitch'), param.panoramaPitch, 'Correct panoramaPitch');
            equal(label.getProperty('panoramaZoom'), param.panoramaZoom, 'Correct panoramaZoom');
            equal(label.getProperty('svImageHeight'), param.svImageHeight, 'Correct svImageHeight');
            equal(label.getProperty('svImageWidth'), param.svImageWidth, 'Correct svImageWidth');
            equal(label.getProperty('svMode'), param.svMode, 'Correct svMode');
        });

        test('Render label', function () {
            expect(0);
            var pov = getPOV();
            var pointParam = {
                fillStyleInnerCircle: "rgba(0, 244, 38, 0.9)",
                iconImagePath: "public/img/icons/Sidewalk/Icon_CurbRamp-13.svg",
                lineWidthOuterCircle: 2,
                radiusInnerCircle: 5,
                radiusOuterCircle: 6,
                storedInDatabase: false,
                strokeStyleOuterCircle: "rgba(255,255,255,1)"
            };
            var userPoints = [
                {x: 200, y: 200},
                {x: 300, y: 200},
                {x: 300, y: 300},
                {x: 200, y: 300}
            ];
            var points = [];
            for (i = 0; i < userPoints.length; i++) {
                points.push(new Point(userPoints[i].x, userPoints[i].y, pov, pointParam));
            }
            var path = new Path(points, {});
            var param = {
                canvasWidth: 720,
                canvasHeight: 480,
                canvasDistortionAlphaX: 4.6,
                canvasDistortionAlphaY: -4.65,
                labelFillStyle: "rgba(0, 244, 38, 0.9)",
                labelId: "None",
                labelType: "CurbRamp",
                labelDescription: 'Curb Ramp',
                panoId: "3dlyB8Z0jFmZKSsTQJjMQg",
                panoramaHeading: 0,
                panoramaLat: 38.935869,
                panoramaLng: -77.01920999999999,
                panoramaPitch: -10,
                panoramaZoom: 1,
                svImageHeight: 6656,
                svImageWidth: 13312,
                svMode: "html4"
            };

            var label = new Label(path, param);
            label.render(ctx, pov);
        });

    };

    ////////////////////////////////////////
    // Initialization.
    ////////////////////////////////////////
    _init(param);

    return oPublic;
}
