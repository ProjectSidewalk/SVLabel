var svw = svw || {}; // Street View Walker namespace.

////////////////////////////////////////////////////////////////////////////////
// Label class
////////////////////////////////////////////////////////////////////////////////
function Label (pathIn, params) {
    // Label object constructor
    // This class object holds a Path object and label properties.
    //
    // Ugh, do not go any deeper than depth 1...
    // Label properties:
    // - panoId
    // - panoramaProperties
    //   - location of where this label was labeled
    //     - latitude
    //     - longitude
    //   - Street View pov at the time of labeling
    //     - heading
    //     - pitch
    //     - zoom
    var oPublic = {
        className: 'Label'
    };

    // Path
    var path = undefined;

    var properties = {
        canvasWidth: undefined,
        canvasHeight: undefined,
        canvasDistortionAlphaX: undefined,
        canvasDistortionAlphaY: undefined,
        labelerId : 'DefaultValue',
        labelId: 'DefaultValue',
        labelType: undefined,
        labelDescription: undefined,
        labelFillStyle: undefined,
        panoId: undefined,
        panoramaLat: undefined,
        panoramaLng: undefined,
        panoramaHeading: undefined,
        panoramaPitch: undefined,
        panoramaZoom: undefined,
        photographerHeading: undefined,
        photographerPitch: undefined,
        svImageWidth: undefined,
        svImageHeight: undefined,
        svMode: undefined,
        tagHeight: 20,
        tagWidth: 1,
        tagX: -1,
        tagY: -1
    };

    var status = {
        'deleted' : false,
        'tagVisibility' : 'visible',
        'visibility' : 'visible'
    };

    var lock = {
        tagVisibility: false,
        visibility : false
    };


    //
    // Private functions
    //
    function init (param, pathIn) {
        try {
            if (!pathIn) {
                var errMsg = 'The passed "path" is empty.';
                throw errMsg;
            } else {
                path = pathIn;
            }
            for (attrName in properties) {
                // It is ok if some attributes are not passed as parameters
                if ((attrName === 'tagHeight' ||
                     attrName === 'tagWidth' ||
                     attrName === 'tagX' ||
                     attrName === 'tagY' ||
                     attrName === 'labelerId' ||
                     attrName === 'photographerPov' ||
                     attrName === 'photographerHeading' ||
                     attrName === 'photographerPitch'
                    ) &&
                    !param[attrName]) {
                    continue;
                }

                // Check if all the necessary properties are set in param.
                // Checking paroperties:
                // http://www.nczonline.net/blog/2010/07/27/determining-if-an-object-property-exists/
                if (!(attrName in param)) {
                    var errMsg = '"' + attrName + '" is not in the passed parameter.';
                    throw errMsg;
                }
                properties[attrName] = param[attrName];
            }

            // If the labelType is a "Stop Sign", do not show a tag
            // as a user has to select which type of a stop sign it is
            // (e.g. One-leg, Two-leg, etc)
            // if (properties.labelProperties.labelType === "StopSign") {
            if (false) {
                status.tagVisibility = 'hidden';
            }

            // Set belongs to of the path.
            path.setBelongsTo(oPublic);

            return true;
        } catch (e) {
            console.error(oPublic.className, ':', 'Error initializing the Label object.', e);
            return false;
        }
    };

    function renderTag(ctx) {
        // This function renders a tag on a canvas to show a property of the label
        if (arguments.length !== 3) {
            return false;
        }
        var boundingBox = path.getBoundingBox();

        // Prepare a label message
        var msg = properties.labelDescription;
        var messages = msg.split('\n');

        if (properties.labelerId !== 'DefaultValue') {
            messages.push('Labeler: ' + properties.labelerId);
        }

        ctx.font = '10.5pt Calibri';
        var height = properties.tagHeight * messages.length;
        var width = -1;
        for (var i = 0; i < messages.length; i += 1) {
            var w = ctx.measureText(messages[i]).width + 5;
            if (width < w) {
                width = w;
            }
        }
        properties.tagWidth = width;

        var tagX;
        var tagY;
        ctx.save();
        ctx.lineWidth = 3.5;
        ctx.fillStyle = 'rgba(255,255,255,1)';
        ctx.strokeStyle = 'rgba(255,255,255,1)';
        ctx.beginPath();
        var connectorX = 15;
        if (connectorX > boundingBox.width) {
            connectorX = boundingBox.width - 1;
        }

        if (boundingBox.x < 5) {
            tagX = 5;
        } else {
            tagX = boundingBox.x;
        }

        if (boundingBox.y + boundingBox.height < 400) {
            ctx.moveTo(tagX + connectorX, boundingBox.y + boundingBox.height);
            ctx.lineTo(tagX + connectorX, boundingBox.y + boundingBox.height + 10);
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
            tagY = boundingBox.y + boundingBox.height + 10;
        } else {
            ctx.moveTo(tagX + connectorX, boundingBox.y);
            ctx.lineTo(tagX + connectorX, boundingBox.y - 10);
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
            // tagX = boundingBox.x;
            tagY = boundingBox.y - height - 20;
        }


        var r = 3;
        var paddingLeft = 16;
        var paddingRight = 30;
        var paddingBottom = 10;

        // Set rendering properties
        ctx.save();
        ctx.lineCap = 'square';
        ctx.lineWidth = 2;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'; // point.getProperty('fillStyleInnerCircle');
        ctx.strokeStyle = 'rgba(255,255,255,1)'; // point.getProperty('strokeStyleOuterCircle');
        //point.getProperty('lineWidthOuterCircle');

        // Draw a tag
        ctx.beginPath();
        ctx.moveTo(tagX, tagY);
        ctx.lineTo(tagX + width + paddingLeft + paddingRight, tagY);
        ctx.lineTo(tagX + width + paddingLeft + paddingRight, tagY + height + paddingBottom);
        ctx.lineTo(tagX, tagY + height + paddingBottom);
        ctx.lineTo(tagX, tagY);
//        ctx.moveTo(tagX, tagY - r);
//        ctx.lineTo(tagX + width - r, tagY - r);
//        ctx.arc(tagX + width, tagY, r, 3 * Math.PI / 2, 0, false); // Corner
//        ctx.lineTo(tagX + width + r, tagY + height - r);
//        ctx.arc(tagX + width, tagY + height, r, 0, Math.PI / 2, false); // Corner
//        ctx.lineTo(tagX + r, tagY + height + r);
//        ctx.arc(tagX, tagY + height, r, Math.PI / 2, Math.PI, false); // Corner
//        ctx.lineTo(tagX - r, tagY); // Corner

        ctx.fill();
        ctx.stroke()
        ctx.closePath();
        ctx.restore();

        // Render an icon and a message
        ctx.save();
        ctx.fillStyle = '#000';
        var labelType = properties.labelType;
        var iconImagePath = getLabelIconImagePath()[labelType].iconImagePath;
        var imageObj;
        var imageHeight;
        var imageWidth;
        var imageX;
        var imageY;
        imageObj = new Image();
        imageHeight = imageWidth = 25;
        imageX =  tagX + 5;
        imageY = tagY + 2;

        //imageObj.onload = function () {

        ///            };
        // ctx.globalAlpha = 0.5;
        imageObj.src = iconImagePath;
        ctx.drawImage(imageObj, imageX, imageY, imageHeight, imageWidth);

        for (var i = 0; i < messages.length; i += 1) {
            ctx.fillText(messages[i], tagX + paddingLeft + 20, tagY + 20 + 20 * i);
        }
        // ctx.fillText(msg, tagX, tagY + 17);
        ctx.restore();

        return;
    };

    function showDelete() {
        if (status.tagVisibility !== 'hidden') {
            var boundingBox = path.getBoundingBox();
            var x = boundingBox.x + boundingBox.width - 20;
            var y = boundingBox.y;

            // Show a delete button
            var $divHolderLabelDeleteIcon = $("#Holder_LabelDeleteIcon");
            $divHolderLabelDeleteIcon.css({
                'visibility': 'visible',
                'left' : x, // + width - 5,
                'top' : y
            });
        }
    };

    ////////////////////////////////////////
    // Public functions
    ////////////////////////////////////////
    oPublic.blink = function (numberOfBlinks, fade) {
        // Blink (highlight and fade) the color of this label. If fade is true, turn the label into gray;
        if (!numberOfBlinks) {
            numberOfBlinks = 3;
        } else if (numberOfBlinks < 0) {
            numberOfBlinks = 0;
        }
        var interval;
        var highlighted = true;
        var path = oPublic.getPath();
        var points = path.getPoints();

        var i;
        var len = points.length;

        var fillStyle = 'rgba(200,200,200,0.1)';
        var fillStyleHighlight = path.getFillStyle();

        interval = setInterval(function () {
            if (numberOfBlinks > 0) {
                if (highlighted) {
                    highlighted = false;
                    path.setFillStyle(fillStyle);
                    for (i = 0; i < len; i++) {
                        points[i].setFillStyle(fillStyle);
                    }
                    svw.canvas.clear().render2();
                } else {
                    highlighted = true;
                    path.setFillStyle(fillStyleHighlight);
                    for (i = 0; i < len; i++) {
                        points[i].setFillStyle(fillStyleHighlight);
                    }
                    svw.canvas.clear().render2();
                    numberOfBlinks -= 1;
                }
            } else {
                if (fade) {
                    path.setFillStyle(fillStyle);
                    for (i = 0; i < len; i++) {
                        points[i].setFillStyle(fillStyle);
                    }
                    svw.canvas.clear().render2();
                }

                oPublic.setAlpha(0.05);
                svw.canvas.clear().render2();
                window.clearInterval(interval);
            }
        }, 500);

        return this;
    };

    oPublic.fadeFillStyle = function (mode) {
        // This method turn the associated Path and Points into gray.
        var path = oPublic.getPath();
        var points = path.getPoints()
        var i = 0;
        var len = points.length;
        var fillStyle = undefined;

        if (!mode) {
            mode = 'default';
        }

        if (mode === 'gray') {
            fillStyle = 'rgba(200,200,200,0.5)';
        } else {
            // fillStyle = path.getFillStyle();
            // fillStyle = svw.util.color.changeDarknessRGBA(fillStyle, 0.9);
            // fillStyle = svw.util.color.changeAlphaRGBA(fillStyle, 0.1);
            fillStyle = 'rgba(255,165,0,0.8)';
        }
        path.setFillStyle(fillStyle);
        for (; i < len; i++) {
            points[i].setFillStyle(fillStyle);
        }
        return this;
    };

    oPublic.getBoundingBox = function () {
        // This method returns the boudning box of the label's outline.
        var path = oPublic.getPath();
        return path.getBoundingBox();
    };

    oPublic.getCoordinate = function () {
        // This function returns the coordinate of a point.
        if (path && path.points.length > 0) {
            var pov = path.getPOV();
            return $.extend(true, {}, path.points[0].getCanvasCoordinate(pov));
        }
        return path;
    };

    oPublic.getGSVImageCoordinate = function () {
        // This function return the coordinate of a point in the GSV image coordinate.
        if (path && path.points.length > 0) {
            return path.points[0].getGSVImageCoordinate();
        }
    };

    oPublic.getImageCoordinates = function () {
        // This function returns
        if (path) {
            return path.getImageCoordinates();
        }
        return false;
    };

    oPublic.getLabelId = function () {
        // This function returns labelId property
        return properties.labelId;
    };

    oPublic.getLabelType = function () {
        // This function returns labelType property
        return properties.labelType;
    };

    oPublic.getPath = function (reference) {
        // This function returns the coordinate of a point.
        // If reference is true, return a reference to the path instead of a copy of the path
        if (path) {
            if (reference) {
                console.log("hide");
                return path;
            } else {
                return $.extend(true, {}, path);
            }
        }
        return false;
    };

    oPublic.getPoint = function () {
        // This function returns the coordinate of the first point in the path.
        if (path && path.points.length > 0) {
            return path.points[0];
        }
        return path;
    };

    oPublic.getPoints = function (reference) {
        // This function returns the point objects that constitute the path
        // If reference is set to true, return the reference to the points
        if (path) {
            return path.getPoints(reference);
        } else {
            return false;
        }
    };

    oPublic.getLabelPov = function () {
        // Return the pov of this label
        var heading;//  = parseInt(properties.panoramaHeading, 10);
        var pitch = parseInt(properties.panoramaPitch, 10);
        var zoom = parseInt(properties.panoramaZoom, 10);

        var points = oPublic.getPoints();
        var svImageXs = points.map(function(point) {return point.svImageCoordinate.x;});

        if (svImageXs.max() - svImageXs.min() > (svw.svImageWidth / 2)) {
            svImageXs = svImageXs.map(function (x) {
                if (x < (svw.svImageWidth / 2)) {
                    x += svw.svImageWidth;
                }
                return x;
            })
            var labelSvImageX = parseInt(svImageXs.mean(), 10) % svw.svImageWidth;
        } else {
            var labelSvImageX = parseInt(svImageXs.mean(), 10);
        }
        heading = parseInt((labelSvImageX / svw.svImageWidth) * 360, 10) % 360;

        return {
            heading: parseInt(heading, 10),
            pitch: pitch,
            zoom: zoom
        };
    };

    oPublic.getProperties = function () {
        // Return the deep copy of the properties object,
        // so the caller can only modify properties from
        // setProperties() (which I have not implemented.)
        //
        // JavaScript Deepcopy
        // http://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-clone-a-javascript-object
        return $.extend(true, {}, properties);
    };

    oPublic.getProperty = function (propName) {
        if (!(propName in properties)) {
            return false;
        }
        return properties[propName];
    };

    oPublic.getVisibility = function () {
        return status.visibility;
    };

    oPublic.fill = function (fill) {
        // This method changes the fill color of the path and points that constitute the path.
        var path = oPublic.getPath();
        var points = path.getPoints()
        var i = 0;
        var len = points.length;

        path.setFillStyle(fill);
        for (; i < len; i++) {
            points[i].setFillStyle(fill);
        }
        return this;
    };

    oPublic.highlight = function () {
        // This method changes the fill color of the path and points to orange.
        var fillStyle = 'rgba(255,165,0,0.8)';
        return oPublic.fill(fillStyle);
    };

    oPublic.isDeleted = function () {
        return status.deleted;
    };


    oPublic.isOn = function (x, y) {
        // This function checks if a path is under a cursor
        if (status.deleted ||
            status.visibility === 'hidden') {
            return false;
        }

        var result = path.isOn(x, y);
        if (result) {
            return result;
        } else {
            return false;

            var margin = 20;
            if (properties.tagX - margin < x &&
                properties.tagX + properties.tagWidth + margin > x &&
                properties.tagY - margin < y &&
                properties.tagY + properties.tagHeight + margin > y) {
                // The mouse cursor is on the tag.
                return this;
            } else {
                return false;
            }
        }
    };


    oPublic.isVisible = function () {
        // This method returns the visibility of this label.
        if (status.visibility === 'visible') {
            return true;
        } else {
            return false;
        }
    };

    oPublic.lockTagVisibility = function () {
        lock.tagVisibility = true;
        return this;
    };


    oPublic.lockVisibility = function () {
        lock.visibility = true;
        return this;
    };

    oPublic.overlap = function (label, mode) {
        // This method calculates the area overlap between this label and another label passed as an argument.
        if (!mode) {
            mode = "boundingbox";
        }

        if (mode !== "boundingbox") {
            throw oPublic.className + ": " + mobede + " is not a valid option.";
        }
        var path1 = oPublic.getPath();
        var path2 = label.getPath();

        return path1.overlap(path2, mode);
    };

    oPublic.removePath = function () {
        // This function removes the path and points in the path.
        path.removePoints();
        path = undefined;
    };


    oPublic.render = function (ctx, pov, evaluationMode) {
        if (!evaluationMode) {
            evaluationMode = false;
        }

        if (!status.deleted &&
            status.visibility === 'visible') {
            // Render a tag
            // Get a text to render (e.g, attribute type), and
            // canvas coordinate to render the tag.
            if(status.tagVisibility === 'visible') {
                var labelType =  properties.labelDescription;

                if (!evaluationMode) {
                    renderTag(ctx);
                    path.renderBoundingBox(ctx);
                    showDelete();
                    //showDelete(path);
                }
            }

            // Render a path
            path.render2(ctx, pov);
        }
        return this;
    };

    oPublic.resetFillStyle = function () {
        // This method turn the fill color of associated Path and Points into their original color.
        var path = oPublic.getPath();
        var points = path.getPoints()
        var i = 0;
        var len = points.length;
        path.resetFillStyle();
        for (; i < len; i++) {
            points[i].resetFillStyle();
        }
        return this;
    };

    oPublic.resetTagCoordinate = function () {
        // This function sets properties.tag.x and properties.tag.y to 0
        properties.tagX = 0;
        properties.tagY = 0;
        return this;
    };

    oPublic.setAlpha = function (alpha) {
        // This method changes the alpha channel of the fill color of the path and points that constitute the path.
        var path = oPublic.getPath();
        var points = path.getPoints()
        var i = 0;
        var len = points.length;
        var fill = path.getFillStyle();

        fill = svw.util.color.changeAlphaRGBA(fill, 0.3);

        path.setFillStyle(fill);
        for (; i < len; i++) {
            points[i].setFillStyle(fill);
        }
        return this;
    };

    oPublic.setIconPath = function (iconPath) {
        // This function sets the icon path of the point this label holds.
        if (path && path.points[0]) {
            var point = path.points[0];
            point.setIconPath(iconPath);
            return this;
        }
        return false;
    };


    oPublic.setLabelerId = function (labelerIdIn) {
        properties.labelerId = labelerIdIn;
        return this;
    };


    oPublic.setStatus = function (key, value) {
        if (key in status) {
            if (key === 'visibility' &&
                (value === 'visible' || value === 'hidden')) {
                // status[key] = value;
                oPublic.setVisibility(value);
            } else if (key === 'tagVisibility' &&
                (value === 'visible' || value === 'hidden')) {
                oPublic.setTagVisibility(value);
            } else if (key === 'deleted' && typeof value === 'boolean') {
                status[key] = value;
            }
        }
    };


    oPublic.setTagVisibility = function (visibility) {
        if (!lock.tagVisibility) {
            if (visibility === 'visible' ||
                visibility === 'hidden') {
                status['tagVisibility'] = visibility;
            }
        }
        return this;
    };


    oPublic.setSubLabelDescription = function (labelType) {
        // This function sets the sub label type of this label.
        // E.g. for a bus stop there are StopSign_OneLeg
        var labelDescriptions = getLabelDescriptions();
        var labelDescription = labelDescriptions[labelType].text;
        properties.labelProperties.subLabelDescription = labelDescription;
        return this;
    };


    oPublic.setVisibility = function (visibility) {
        if (!lock.visibility) {
            status.visibility = visibility;
        }
        return this;
    };


    oPublic.setVisibilityBasedOnLocation = function (visibility, panoId) {
        if (!status.deleted) {
            if (panoId === properties.panoId) {
                // oPublic.setStatus('visibility', visibility);
                oPublic.setVisibility(visibility);
            } else {
                visibility = visibility === 'visible' ? 'hidden' : 'visible';
                // oPublic.setStatus('visibility', visibility);
                oPublic.setVisibility(visibility);
            }
        }
        return this;
    };


    oPublic.setVisibilityBasedOnLabelerId = function (visibility, labelerIds, included) {
        // if included is true and properties.labelerId is in labelerIds, then set this
        // label's visibility to the passed visibility
        if (included === undefined) {
            if (labelerIds.indexOf(properties.labelerId) !== -1) {
                oPublic.unlockVisibility().setVisibility(visibility).lockVisibility();
            } else {
                visibility = visibility === 'visible' ? 'hidden' : 'visible';
                oPublic.unlockVisibility().setVisibility(visibility).lockVisibility();
            }
        } else {
            if (included) {
                if (labelerIds.indexOf(properties.labelerId) !== -1) {
                    oPublic.unlockVisibility().setVisibility(visibility).lockVisibility();
                }
            } else {
                if (labelerIds.indexOf(properties.labelerId) === -1) {
                    oPublic.unlockVisibility().setVisibility(visibility).lockVisibility();
                }
            }
        }

        return this;
    };


    oPublic.setVisibilityBasedOnLabelerIdAndLabelTypes = function (visibility, tables, included) {
        var i;
        var tablesLen = tables.length;
        var matched = false;

        for (i = 0; i < tablesLen; i += 1) {
            if (tables[i].userIds.indexOf(properties.labelerId) !== -1) {
                if (tables[i].labelTypesToRender.indexOf(properties.labelProperties.labelType) !== -1) {
                    matched = true;
                }
            }
        }
        if (included === undefined) {
            if (matched) {
                oPublic.unlockVisibility().setVisibility(visibility).lockVisibility();
            } else {
                visibility = visibility === 'visible' ? 'hidden' : 'visible';
                oPublic.unlockVisibility().setVisibility(visibility).lockVisibility();
            }
        } else {
            if (included) {
                if (matched) {
                    oPublic.unlockVisibility().setVisibility(visibility).lockVisibility();
                }
            } else {
                if (!matched) {
                    oPublic.unlockVisibility().setVisibility(visibility).lockVisibility();
                }
            }
        }
    };


    oPublic.unlockTagVisibility = function () {
        lock.tagVisibility = false;
        return this;
    };


    oPublic.unlockVisibility = function () {
        lock.visibility = false;
        return this;
    };

    ////////////////////////////////////////
    // Tests
    ////////////////////////////////////////
    oPublic.runTestCases = function () {
        module('Label tests');

        test('functioning', function () {
            ok(true, 'Test');
        });
    };

    //
    // Initialize
    //
    if (!init(params, pathIn)) {
        return false;
    }
    return oPublic;
}
