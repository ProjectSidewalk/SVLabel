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

var svl = svl || {};
svl.canvasWidth = 720;
svl.canvasHeight = 480;
svl.svImageHeight = 6656;
svl.svImageWidth = 13312;
svl.alpha_x = 4.6;
svl.alpha_y = -4.65;
svl._labelCounter = 0;
svl.getLabelCounter = function () {
    return svl._labelCounter++;
};

/**
 * A canvas module
 * @param $ {object} jQuery object
 * @param param {object} Other parameters
 * @returns {{className: string}}
 * @constructor
 * @memberof svl
 */
function Canvas ($, param) {
    var self = { className : 'Canvas' },
        callbacks = [];

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
        drawingMode: "point",
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
        currentLabel : null,
        disableLabelDelete : false,
        disableLabelEdit : false,
        disableLabeling : false,
        disableWalking : false,
        drawing : false,

        lockCurrentLabel : false,
        lockDisableLabelDelete : false,
        lockDisableLabelEdit : false,
        lockDisableLabeling : false,
        svImageCoordinatesAdjusted: false,
        totalLabelCount: 0,
        'visibilityMenu' : 'hidden'
    };

    var lock = {
        showLabelTag: false
    };

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
    var $canvas = $("#labelCanvas").length === 0 ? null : $("#labelCanvas");
    var $divLabelDrawingLayer = $("div#labelDrawingLayer").length === 0 ? null : $("div#labelDrawingLayer");
    var $divHolderLabelDeleteIcon = $("#Holder_LabelDeleteIcon").length === 0 ? null : $("#Holder_LabelDeleteIcon");
    var $divHolderLabelEditIcon = $("#Holder_LabelEditIcon").length === 0 ? null : $("#Holder_LabelEditIcon");
    var $labelDeleteIcon = $("#LabelDeleteIcon").length === 0 ? null : $("#LabelDeleteIcon");

    ////////////////////////////////////////
    // Private Functions
    ////////////////////////////////////////
    // Initialization
    function _init (param) {
        var el = document.getElementById("label-canvas");
        if (!el) {
            return false;
        }
        ctx = el.getContext('2d');
        canvasProperties.width = el.width;
        canvasProperties.height = el.height;

        if (param && 'evaluationMode' in param) {
            properties.evaluationMode = param.evaluationMode;
        }

        // Attach listeners to dom elements
        if ($divLabelDrawingLayer) {
          $divLabelDrawingLayer.bind('mousedown', drawingLayerMouseDown);
          $divLabelDrawingLayer.bind('mouseup', drawingLayerMouseUp);
          $divLabelDrawingLayer.bind('mousemove', drawingLayerMouseMove);
        }
        if ($labelDeleteIcon) {
          $labelDeleteIcon.bind("click", labelDeleteIconClick);
        }

        // Point radius
        if (properties.drawingMode == 'path') {
            properties.pointInnerCircleRadius = 5;
            properties.pointOuterCircleRadius = 6;
        } else {
            properties.pointInnerCircleRadius = 13;
            properties.pointOuterCircleRadius = 14;
        }
    }

    /**
     * Finish up labeling.
     * Clean this method when I get a chance.....
     */
    function closeLabelPath() {
        svl.tracker.push('LabelingCanvas_FinishLabeling');
        var labelType = svl.ribbon.getStatus('selectedLabelType');
        var labelColor = getLabelColors()[labelType];
        var labelDescription = getLabelDescriptions()[svl.ribbon.getStatus('selectedLabelType')];
        var iconImagePath = getLabelIconImagePath()[labelDescription.id].iconImagePath;

        pointParameters.fillStyleInnerCircle = labelColor.fillStyle;
        pointParameters.iconImagePath = iconImagePath;
        pointParameters.radiusInnerCircle = properties.pointInnerCircleRadius;
        pointParameters.radiusOuterCircle = properties.pointOuterCircleRadius;

        var pathLen = tempPath.length;
        var points = [];
        var pov = svl.getPOV();
        var i;

        for (i = 0; i < pathLen; i++) {
            points.push(new Point(tempPath[i].x, tempPath[i].y, pov, pointParameters));
        }
        var path = new Path(points, {});
        var latlng = getPosition();
        var param = {
            canvasWidth: svl.canvasWidth,
            canvasHeight: svl.canvasHeight,
            canvasDistortionAlphaX: svl.alpha_x,
            canvasDistortionAlphaY: svl.alpha_y,
            labelId: svl.getLabelCounter(),
            labelType: labelDescription.id,
            labelDescription: labelDescription.text,
            labelFillStyle: labelColor.fillStyle,
            panoId: getPanoId(),
            panoramaLat: latlng.lat,
            panoramaLng: latlng.lng,
            panoramaHeading: pov.heading,
            panoramaPitch: pov.pitch,
            panoramaZoom: pov.zoom,
            svImageWidth: svl.svImageWidth,
            svImageHeight: svl.svImageHeight,
            svMode: 'html4'
        };
        if (("panorama" in svl) && ("getPhotographerPov" in svl.panorama)) {
            var photographerPov = svl.panorama.getPhotographerPov();
            param.photographerHeading = photographerPov.heading;
            param.photographerPitch = photographerPov.pitch;
        }

        status.currentLabel = new Label(path, param)
        labels.push(status.currentLabel);
        svl.labelContainer.push(status.currentLabel);

        svl.actionStack.push('addLabel', status.currentLabel);

        // Initialize the tempPath
        tempPath = [];
        svl.ribbon.backToWalk();

        if (callbacks) {
            for (var i = 0; i < callbacks.length; i++) {
                callbacks[i]();
            }
        }
        // Review label correctness if this is a ground truth insertion task.
        if (("goldenInsertion" in svl) &&
            svl.goldenInsertion &&
            svl.goldenInsertion.isRevisingLabels()) {
            svl.goldenInsertion.reviewLabels();
        }
    }

    function drawingLayerMouseDown (e) {
        // This function is fired when at the time of mouse-down
        mouseStatus.isLeftDown = true;
        mouseStatus.leftDownX = mouseposition(e, this).x;
        mouseStatus.leftDownY = mouseposition(e, this).y;

        if (!properties.evaluationMode) {
            svl.tracker.push('LabelingCanvas_MouseDown', {x: mouseStatus.leftDownX, y: mouseStatus.leftDownY});
        }

        mouseStatus.prevMouseDownTime = new Date().getTime();
    }

    /**
     * This function is fired when at the time of mouse-up
     */
    function drawingLayerMouseUp (e) {
        var currTime;

        mouseStatus.isLeftDown = false;
        mouseStatus.leftUpX = mouseposition(e, this).x;
        mouseStatus.leftUpY = mouseposition(e, this).y;

        currTime = new Date().getTime();

        if (!properties.evaluationMode) {
            if (!status.disableLabeling && currTime - mouseStatus.prevMouseUpTime > 300) {
                var labelType = svl.ribbon.getStatus('selectedLabelType');
                var labelDescription = svl.misc.getLabelDescriptions()[labelType];
                if (properties.drawingMode == "point") {
                    // Point labeling. Simply push a single point and call closeLabelPath.
                    var iconImagePath = getLabelIconImagePath()[labelDescription.id].iconImagePath;
                    tempPath.push({x: mouseStatus.leftUpX, y: mouseStatus.leftUpY});
                    closeLabelPath();
                } else if (properties.drawingMode == "path") {
                    // Path labeling.

                    if ('ribbon' in svl && svl.ribbon) {
                        // Define point parameters to draw
                        if (!status.drawing) {
                            // Start drawing a path if a user hasn't started to do so.
                            status.drawing = true;
                            if ('tracker' in svl && svl.tracker) {
                                svl.tracker.push('LabelingCanvas_StartLabeling');
                            }
                            tempPath.push({x: mouseStatus.leftUpX, y: mouseStatus.leftUpY});
                        } else {
                            // Close the current path if there are more than 2 points in the tempPath and
                            // the user clicks on a point near the initial point.
                            var closed = false;
                            if (tempPath.length > 2) {
                                var r = Math.sqrt(Math.pow((tempPath[0].x - mouseStatus.leftUpX), 2) + Math.pow((tempPath[0].y - mouseStatus.leftUpY), 2));
                                if (r < properties.radiusThresh) {
                                    closed = true;
                                    status.drawing = false;
                                    closeLabelPath();
                                }
                            }

                            // Otherwise add a new point
                            if (!closed) {
                                tempPath.push({x: mouseStatus.leftUpX, y: mouseStatus.leftUpY});
                            }
                        }
                    }
                }

                self.clear();
                self.setVisibilityBasedOnLocation('visible', getPanoId());
                self.render2();
            } else if (currTime - mouseStatus.prevMouseUpTime < 400) {
                if (properties.drawingMode == "path") {
                    // This part is executed for a double click event
                    // If the current status.drawing = true, then close the current path.
                    var pathLen = tempPath.length;
                    if (status.drawing && pathLen > 2) {
                        status.drawing = false;

                        closeLabelPath();
                        self.clear();
                        self.setVisibilityBasedOnLocation('visible', getPanoId());
                        self.render2();
                    }
                }
            }
        } else {
            // If it is an evaluation mode, do... (nothing)
        }

        svl.tracker.push('LabelingCanvas_MouseUp', {x: mouseStatus.leftUpX, y: mouseStatus.leftUpY});
        mouseStatus.prevMouseUpTime = new Date().getTime();
        mouseStatus.prevMouseDownTime = 0;
    }

    /**
     * This is called on mouse move
     */
    function drawingLayerMouseMove (e) {
        // This function is fired when mouse cursor moves
        // over the drawing layer.
        var mousePosition = mouseposition(e, this);
        mouseStatus.currX = mousePosition.x;
        mouseStatus.currY = mousePosition.y;

        // Change a cursor according to the label type.
        // $(this).css('cursor', )
        if ('ribbon' in svl) {
            var cursorImagePaths = svl.misc.getLabelCursorImagePath();
            var labelType = svl.ribbon.getStatus('mode');
            if (labelType) {
                var cursorImagePath = cursorImagePaths[labelType].cursorImagePath;
                var cursorUrl = "url(" + cursorImagePath + ") 6 25, auto";

                if (rightClickMenu && rightClickMenu.isAnyOpen()) {
                    cursorUrl = 'default';
                }

                $(this).css('cursor', cursorUrl);
            }
        } else {
            throw self.className + ': Import the RibbonMenu.js and instantiate it!';
        }


        if (!status.drawing) {
            var ret = isOn(mouseStatus.currX, mouseStatus.currY);
            if (ret && ret.className === 'Path') {
                self.showLabelTag(status.currentLabel);
                ret.renderBoundingBox(ctx);
            } else {
                self.showLabelTag(undefined);
            }
        }
        self.clear();
        self.render2();
        mouseStatus.prevX = mouseposition(e, this).x;
        mouseStatus.prevY = mouseposition(e, this).y;
    }

    /**
     */
    function imageCoordinates2String (coordinates) {
        if (!(coordinates instanceof Array)) {
            throw self.className + '.imageCoordinates2String() expects Array as an input';
        }
        if (coordinates.length === 0) {
            throw self.className + '.imageCoordinates2String(): Empty array';
        }
        var ret = '';
        var i ;
        var len = coordinates.length;

        for (i = 0; i < len; i += 1) {
            ret += parseInt(coordinates[i].x) + ' ' + parseInt(coordinates[i].y) + ' ';
        }

        return ret;
    }

    /**
      * This is called when a user clicks a delete icon.
      */
    function labelDeleteIconClick () {
        // Deletes the current label
        if (!status.disableLabelDelete) {
            svl.tracker.push('Click_LabelDelete');
            var currLabel = self.getCurrentLabel();
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
                svl.labelContainer.removeLabel(currLabel);
                svl.actionStack.push('deleteLabel', self.getCurrentLabel());
                $divHolderLabelDeleteIcon.css('visibility', 'hidden');
                // $divHolderLabelEditIcon.css('visibility', 'hidden');


                //
                // If showLabelTag is blocked by GoldenInsertion (or by any other object), unlock it as soon as
                // a label is deleted.
                if (lock.showLabelTag) {
                    self.unlockShowLabelTag();
                }
            }
        }
    }

    /**
     * Render a temporary path while the user is drawing.
     */
    function renderTempPath() {
        if (!svl.ribbon) {
            // return if the ribbon menu is not correctly loaded.
            return false;
        }

        var i = 0;
        var pathLen = tempPath.length;
        var labelColor = getLabelColors()[svl.ribbon.getStatus('selectedLabelType')];

        var pointFill = labelColor.fillStyle;
        pointFill = svl.util.color.changeAlphaRGBA(pointFill, 0.5);


        // Draw the first line.
        ctx.strokeStyle = 'rgba(255,255,255,1)';
        ctx.lineWidth = 2;
        if (pathLen > 1) {
            var curr = tempPath[1];
            var prev = tempPath[0];
            var r = Math.sqrt(Math.pow((tempPath[0].x - mouseStatus.currX), 2) + Math.pow((tempPath[0].y - mouseStatus.currY), 2));

            // Change the circle radius of the first point depending on the distance between a mouse cursor and the point coordinate.
            if (r < properties.radiusThresh && pathLen > 2) {
                svl.util.shape.lineWithRoundHead(ctx, prev.x, prev.y, 2 * properties.tempPointRadius, curr.x, curr.y, properties.tempPointRadius, 'both', 'rgba(255,255,255,1)', pointFill, 'none', 'rgba(255,255,255,1)', pointFill);
            } else {
                svl.util.shape.lineWithRoundHead(ctx, prev.x, prev.y, properties.tempPointRadius, curr.x, curr.y, properties.tempPointRadius, 'both', 'rgba(255,255,255,1)', pointFill, 'none', 'rgba(255,255,255,1)', pointFill);
            }
        }

        // Draw the lines in between
        for (i = 2; i < pathLen; i++) {
            var curr = tempPath[i];
            var prev = tempPath[i-1];
            svl.util.shape.lineWithRoundHead(ctx, prev.x, prev.y, 5, curr.x, curr.y, 5, 'both', 'rgba(255,255,255,1)', pointFill, 'none', 'rgba(255,255,255,1)', pointFill);
        }

        if (r < properties.radiusThresh && pathLen > 2) {
            svl.util.shape.lineWithRoundHead(ctx, tempPath[pathLen-1].x, tempPath[pathLen-1].y, properties.tempPointRadius, tempPath[0].x, tempPath[0].y, 2 * properties.tempPointRadius, 'both', 'rgba(255,255,255,1)', pointFill, 'none', 'rgba(255,255,255,1)', pointFill);
        } else {
            svl.util.shape.lineWithRoundHead(ctx, tempPath[pathLen-1].x, tempPath[pathLen-1].y, properties.tempPointRadius, mouseStatus.currX, mouseStatus.currY, properties.tempPointRadius, 'both', 'rgba(255,255,255,1)', pointFill, 'stroke', 'rgba(255,255,255,1)', pointFill);
        }
    }

    /**
     * Cancel drawing while use is drawing a label
     * @method
     */
    function cancelDrawing () {
        // This method clears a tempPath and cancels drawing. This method is called by Keyboard when esc is pressed.
        if ('tracker' in svl && svl.tracker && status.drawing) {
            svl.tracker.push("LabelingCanvas_CancelLabeling");
        }

        tempPath = [];
        status.drawing = false;
        self.clear().render2();
        return this;
    }

    /**
     * Clear what's on the canvas.
     * @method
     */
    function clear () {
        // Clears the canvas
        if (ctx) {
          ctx.clearRect(0, 0, canvasProperties.width, canvasProperties.height);
        } else {
          console.warn('The ctx is not set.')
        }
        return this;
    }

    /**
     *
     * @method
     */
    function disableLabelDelete () {
        if (!status.lockDisableLabelDelete) {
            status.disableLabelDelete = true;
            return this;
        }
        return false;
    }

    /**
     * @method
     * @return {boolean}
     */
    function disableLabelEdit () {
       if (!status.lockDisableLabelEdit) {
           status.disableLabelEdit = true;
           return this;
       }
       return false;
    }

    /**
     * Disable labeling
     * @method
     */
    function disableLabeling () {
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
    }

    /**
     * Enable deleting labels
     * @method
     */
    function enableLabelDelete () {
        if (!status.lockDisableLabelDelete) {
            status.disableLabelDelete = false;
            return this;
        }
        return false;
    }

    /**
     * Enables editing labels
     * @method
     */
    function enableLabelEdit () {
        if (!status.lockDisableLabelEdit) {
            status.disableLabelEdit = false;
            return this;
        }
        return false;
    }

    /**
     * Enables labeling
     * @method
     */
    function enableLabeling () {
        // Check right-click-menu visiibliey
        // If all of the right click menu are hidden,
        // enable labeling
        if (!status.lockDisableLabeling) {
            status.disableLabeling = false;
            return this;
        }
        return false;
    }

    /**
     * Returns the label of the current focus
     * @method
     */
    function getCurrentLabel () {
        return status.currentLabel;
    }

    /**
     * Get labels stored in this canvas.
     * @method
     */
    function getLabels (target) {
        // This method returns a deepcopy of labels stored in this canvas.
        if (!target) {
            target = 'user';
        }

        if (target === 'system') {
            return self.getSystemLabels(false);
        } else {
            return self.getUserLabels(false);
        }
    }

    /**
     * Returns a lock that corresponds to the key.
     * @method
     */
    function getLock (key) {
      return lock[key];
    }

    /**
     * Returns a number of labels in the current panorama.
     * @method
     */
    function getNumLabels () {
        var labels = svl.labelContainer.getCanvasLabels();
        var len = labels.length;
        var i;
        var total = 0;
        for (i =0; i < len; i++) {
            if (!labels[i].isDeleted() && labels[i].isVisible()) {
                total++;
            }
        }
        return total;
    }

    /**
     * @method
     */
    function getRightClickMenu () {
        return rightClickMenu;
    }

    /**
     * Returns a status
     * @method
     */
    function getStatus (key) {
      if (!(key in status)) {
        console.warn("You have passed an invalid key for status.")
      }
        return status[key];
    }

    /**
     * This method returns system labels; the labels stored in our database (e.g., other users' labels and the user's
     * previous labels) that are not from this auditing session.
     * If refrence is true, then it returns reference to the labels.
     * Otherwise it returns deepcopy of labels.
     * @method
     */
    function getSystemLabels (reference) {

        if (!reference) {
            reference = false;
        }

        if (reference) {
            return systemLabels;
        } else {
            return $.extend(true, [], systemLabels);
        }
    }

    /**
     * @method
     */
    function getUserLabelCount () {
        var labels = self.getUserLabels();
        labels = labels.filter(function (label) {
            return !label.isDeleted() && label.isVisible();
        });
        return labels.length;
    }

    /**
     * Returns user labels (i.e., what the user labeled during this session.)
     * @method
     */
    function getUserLabels (reference) {
        // This method returns user labels. If reference is true, then it returns reference to the labels.
        // Otherwise it returns deepcopy of labels.
        if (!reference) {
            reference = false;
        }

        if (reference) {
            return svl.labelContainer.getCanvasLabels();
//            return labels;
        } else {
            return $.extend(true, [], svl.labelContainer.getCanvasLabels());
        }
    }

    /**
     * @method
     */
    function hideDeleteLabel (x, y) {
        rightClickMenu.hideDeleteLabel();
        return this;
    }

    function hideRightClickMenu () {
        rightClickMenu.hideBusStopType();
        rightClickMenu.hideBusStopPosition();
        return this;
    }

    /**
     * @method
     */
    function insertLabel (labelPoints, target) {
        // This method takes a label data (i.e., a set of point coordinates, label types, etc) and
        // and insert it into the labels array so the Canvas will render it
        if (!target) {
            target = 'user';
        }

        var i;
        var labelColors = svl.misc.getLabelColors();
        var iconImagePaths = svl.misc.getIconImagePaths();
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


            point.setProperties({
                fillStyleInnerCircle : labelColors[pointData.LabelType].fillStyle,
                lineWidthOuterCircle : 2,
                iconImagePath : iconImagePaths[pointData.LabelType].iconImagePath,
                originalCanvasCoordinate: pointData.originalCanvasCoordinate,
                originalHeading: pointData.originalHeading,
                originalPitch: pointData.originalPitch,
                originalZoom: pointData.originalZoom,
                pov: pov,
                radiusInnerCircle : properties.pointInnerCircleRadius,
                radiusOuterCircle : properties.pointOuterCircleRadius,
                strokeStyleOuterCircle : 'rgba(255,255,255,1)',
                storedInDatabase : false
            });

            points.push(point)
        }

        var param = {};
        var path;
        var labelDescriptions = svl.misc.getLabelDescriptions();

        path = new Path(points);

        param.canvasWidth = svl.canvasWidth;
        param.canvasHeight = svl.canvasHeight;
        param.canvasDistortionAlphaX = svl.alpha_x;
        param.canvasDistortionAlphaY = svl.alpha_y;
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

        param.svImageWidth = svl.svImageWidth;
        param.svImageHeight = svl.svImageHeight;
        param.svMode = 'html4';

        if (("PhotographerPitch" in labelPoints[0]) && ("PhotographerHeading" in labelPoints[0])) {
            param.photographerHeading = labelPoints[0].PhotographerHeading;
            param.photographerPitch = labelPoints[0].PhotographerPitch;
        }

        var newLabel = new Label(path, param);

        if (target === 'system') {
            systemLabels.push(newLabel);
        } else {
            svl.labelContainer.push(newLabel)
//            labels.push(newLabel);
        }
    }


    /**
     * @method
     * @return {boolean}
     */
    function isDrawing () {
        // This method returns the current status drawing.
        return status.drawing;
    }

    /**
    *
    * @method
    */
    function isOn (x, y) {
        // This function takes cursor coordinates x and y on the canvas.
        // Then returns an object right below the cursor.
        // If a cursor is not on anything, return false.
        var i, lenLabels, ret;
        var labels = svl.labelContainer.getCanvasLabels();
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

    /**
     * @method
     */
    function lockCurrentLabel () {
        status.lockCurrentLabel = true;;
        return this;
    }

    /**
     * @method
     */
    function lockDisableLabelDelete () {
        status.lockDisableLabelDelete = true;;
        return this;
    };

    /**
     * @method
     */
    function lockDisableLabelEdit () {
        status.lockDisableLabelEdit = true;
        return this;
    }

    /**
     * @method
     */
    function lockDisableLabeling () {
        status.lockDisableLabeling = true;
        return this;
    }

    /**
     * @method
     */
    function lockShowLabelTag () {
        // This method locks showLabelTag
        lock.showLabelTag = true;
        return this;
    }

    /**
     * @method
     */
    function pushLabel (label) {
        status.currentLabel = label;
//        labels.push(label);
        svl.labelContainer.push(label);
        if (svl.actionStack) {
            svl.actionStack.push('addLabel', label);
        }
        return this;
    }

    /**
     * This method removes all the labels stored in the labels array.
     * @method
     */
    function removeAllLabels () {
        svl.labelContainer.removeAll();
        return this;
    }

    /**
     * This function removes a passed label and its child path and points
     * @method
     */
//    function removeLabel (label) {
//        if (!label) {
//            return false;
//        }
//        svl.tracker.push('RemoveLabel', {labelId: label.getProperty('labelId')});
//
//        label.setStatus('deleted', true);
//        label.setStatus('visibility', 'hidden');
//
//
//        // Review label correctness if this is a ground truth insertion task.
//        if (("goldenInsertion" in svl) &&
//            svl.goldenInsertion &&
//            svl.goldenInsertion.isRevisingLabels()) {
//            svl.goldenInsertion.reviewLabels();
//        }
//
//        self.clear();
//        self.render2();
//        return this;
//    }

    /**
     * Renders labels
     * @method
     */
    function render2 () {
      if (!ctx) {
        // JavaScript warning
        // http://stackoverflow.com/questions/5188224/throw-new-warning-in-javascript
        console.warn('The ctx is not set.')
        return this;
      }
        var i,
            labels = svl.labelContainer.getCanvasLabels();
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
        var pov = svl.getPOV();


        //
        // The image coordinates of the points in system labels shift as the projection parameters (i.e., heading and pitch) that
        // you can get from Street View API change. So adjust the image coordinate
        // Note that this adjustment happens only once
        if (!status.svImageCoordinatesAdjusted) {
            var currentPhotographerPov = svl.panorama.getPhotographerPov();
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
                            var x = (svImageCoordinate.x + (deltaHeading / 360) * svl.svImageWidth + svl.svImageWidth) % svl.svImageWidth;
                            var y = svImageCoordinate.y + (deltaPitch / 90) * svl.svImageHeight;
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
                            var x = (svImageCoordinate.x + (deltaHeading / 360) * svl.svImageWidth + svl.svImageWidth) % svl.svImageWidth;
                            var y = svImageCoordinate.y + (deltaPitch / 180) * svl.svImageHeight;
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
        if ('form' in svl) {
            svl.form.checkSubmittable();
        }

        if ('progressPov' in svl) {
            svl.progressPov.updateCompletionRate();
        }

        //
        // Update the landmark counts on the right side of the interface.
        if (svl.labeledLandmarkFeedback) {
            svl.labeledLandmarkFeedback.setLabelCount(labelCount);
        }

        //
        // Update the opacity of undo and redo buttons.
        if (svl.actionStack) {
            svl.actionStack.updateOpacity();
        }

        //
        // Update the opacity of Zoom In and Zoom Out buttons.
        if (svl.zoomControl) {
            svl.zoomControl.updateOpacity();
        }

        //
        // This like of code checks if the golden insertion code is running or not.
        if ('goldenInsertion' in svl && svl.goldenInsertion) {
            svl.goldenInsertion.renderMessage();
        }
        return this;
    }

    /**
     * @method
     */
    function renderBoundingBox (path) {
        path.renderBoundingBox(ctx);
        return this;
    }

    /**
     * @method
     */
    function setCurrentLabel (label) {
        if (!status.lockCurrentLabel) {
            status.currentLabel = label;
            return this;
        }
        return false;
    }

    /**
     * @method
     */
    function setStatus (key, value) {
        // This function is allows other objects to access status
        // of this object
        if (key in status) {
            if (key === 'disableLabeling') {
                if (typeof value === 'boolean') {
                    if (value) {
                        self.disableLabeling();
                    } else {
                        self.enableLabeling();
                    }
                    return this;
                } else {
                    return false;
                }
            } else if (key === 'disableMenuClose') {
                if (typeof value === 'boolean') {
                    if (value) {
                        self.disableMenuClose();
                    } else {
                        self.enableMenuClose();
                    }
                    return this;
                } else {
                    return false;
                }
            } else if (key === 'disableLabelDelete') {
                if (value === true) {
                    self.disableLabelDelete();
                } else if (value === false) {
                    self.enableLabelDelete();
                }
            } else {
                status[key] = value;
            }
        } else {
            throw self.className + ": Illegal status name.";
        }
    }

    /**
     * @method
     */
    function showLabelTag (label) {
        // This function sets the passed label's tagVisiblity to 'visible' and all the others to
        // 'hidden'.
        if (!lock.showLabelTag) {
            var i,
                labels = svl.labelContainer.getCanvasLabels(),
                labelLen = labels.length;
            var isAnyVisible = false;
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
            self.clear().render2();
            return this;
        }
    }

    /**
     * @method
     */
    function setTagVisibility (labelIn) {
        // Deprecated
        return self.showLabelTag(labelIn);
    }

    /**
     * @method
     */
    function setVisibility (visibility) {
        var i = 0,
            labels = svl.labelContainer.getCanvasLabels(),
            labelLen = labels.length;

        for (i = 0; i < labelLen; i += 1) {
            labels[i].unlockVisibility().setVisibility('visible');
        }
        return this;
    }

    /**
     * @method
     */
    function setVisibilityBasedOnLocation (visibility) {
        var i = 0,
            labels = svl.labelContainer.getCanvasLabels(),
            labelLen = labels.length;

        for (i = 0; i < labelLen; i += 1) {
            labels[i].setVisibilityBasedOnLocation(visibility, getPanoId());
        }
        return this;
    }

    /**
     * @method
     */
    function setVisibilityBasedOnLabelerId (visibility, LabelerIds, included) {
        // This function should not be used in labeling interfaces, but only in evaluation interfaces.
        // Set labels that are not in LabelerIds hidden
        var i = 0,
            labels = svl.labelContainer.getCanvasLabels(),
            labelLen = labels.length;

        for (i = 0; i < labelLen; i += 1) {
            labels[i].setVisibilityBasedOnLabelerId(visibility, LabelerIds, included);
        }
        return this;
    }

    /**
     * @method
     */
    function setVisibilityBasedOnLabelerIdAndLabelTypes (visibility, table, included) {
        var i = 0,
            labels = svl.labelContainer.getCanvasLabels(),
            labelLen = labels.length;
        for (i = 0; i < labelLen; i += 1) {
            labels[i].setVisibilityBasedOnLabelerIdAndLabelTypes(visibility, table, included);
        }
        return this;
    }

    /**
     * @method
     */
    function showDeleteLabel (x, y) {
        rightClickMenu.showDeleteLabel(x, y);
    }

    /**
     * @method
     */
    function unlockCurrentLabel () {
        status.lockCurrentLabel = false;
        return this;
    }

    /**
     * @method
     */
    function unlockDisableLabelDelete () {
        status.lockDisableLabelDelete = false;
        return this;
    }

    /**
     * @method
     */
    function unlockDisableLabelEdit () {
        status.lockDisableLabelEdit = false;
        return this;
    }

    /**
     * @method
     */
    function unlockDisableLabeling () {
        status.lockDisableLabeling = false;
        return this;
    }

    /**
     * @method
     */
    function unlockShowLabelTag () {
        // This method locks showLabelTag
        lock.showLabelTag = false;
        return this;
    }

    // Initialization
    _init(param);

    // Put public methods to self and return them.
    self.cancelDrawing = cancelDrawing;
    self.clear = clear;
    self.disableLabelDelete = disableLabelDelete;
    self.disableLabelEdit = disableLabelEdit;
    self.disableLabeling = disableLabeling;
    self.enableLabelDelete = enableLabelDelete;
    self.enableLabelEdit = enableLabelEdit;
    self.enableLabeling = enableLabeling;
    self.getCurrentLabel = getCurrentLabel
    self.getLabels = getLabels;
    self.getLock = getLock;
    self.getNumLabels = getNumLabels;
    self.getRightClickMenu = getRightClickMenu;
    self.getStatus = getStatus;
    self.getSystemLabels = getSystemLabels;
    self.getUserLabelCount = getUserLabelCount;
    self.getUserLabels = getUserLabels;
    self.hideDeleteLabel = hideDeleteLabel;
    self.hideRightClickMenu = hideRightClickMenu;
    self.insertLabel = insertLabel;
    self.isDrawing = isDrawing;
    self.isOn = isOn;
    self.lockCurrentLabel = lockCurrentLabel;
    self.lockDisableLabelDelete = lockDisableLabelDelete;
    self.lockDisableLabelEdit = lockDisableLabelEdit;
    self.lockDisableLabeling = lockDisableLabeling;
    self.lockShowLabelTag = lockShowLabelTag;
    self.pushLabel = pushLabel;
    self.removeAllLabels = removeAllLabels;
    self.removeLabel = svl.labelContainer.removeLabel;
    self.render = render2;
    self.render2 = render2;
    self.renderBoundingBox = renderBoundingBox;
    self.setCurrentLabel = setCurrentLabel;
    self.setStatus = setStatus;
    self.showLabelTag = showLabelTag;
    self.setTagVisibility = setTagVisibility;
    self.setVisibility = setVisibility;
    self.setVisibilityBasedOnLocation = setVisibilityBasedOnLocation;
    self.setVisibilityBasedOnLabelerId = setVisibilityBasedOnLabelerId;
    self.setVisibilityBasedOnLabelerIdAndLabelTypes = setVisibilityBasedOnLabelerIdAndLabelTypes;
    self.showDeleteLabel = showDeleteLabel;
    self.unlockCurrentLabel = unlockCurrentLabel;
    self.unlockDisableLabelDelete = unlockDisableLabelDelete;
    self.unlockDisableLabelEdit = unlockDisableLabelEdit;
    self.unlockDisableLabeling = unlockDisableLabeling;
    self.unlockShowLabelTag = unlockShowLabelTag;

    return self;
}
