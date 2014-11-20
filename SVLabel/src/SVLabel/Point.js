var svw = svw || {}; // Street View Walker namespace.

function Point (x, y, pov, params) {
  'use strict';
    // Point object constructor.
    //
    // Parameters:
    // - x: x-coordinate of the point on a canvas
    // - y: y-coordinate of the point on a canvas
    if(params.fillStyle==undefined){
        params.fillStyle = 'rgba(255,255,255,0.5)';
    }
    var oPublic = {
            className : 'Point',
            svImageCoordinate : undefined,
            canvasCoordinate : undefined,
            originalCanvasCoordinate : undefined,
            pov : undefined,
            originalPov : undefined
        };
    var belongsTo = undefined;
    var properties = {
        fillStyleInnerCircle: params.fillStyle,
        lineWidthOuterCircle: 2,
        iconImagePath: undefined,
        originalFillStyleInnerCircle: undefined,
        originalStrokeStyleOuterCircle: undefined,
        radiusInnerCircle: 4,
        radiusOuterCircle: 5,
        strokeStyleOuterCircle: 'rgba(255,255,255,1)', // 'rgba(30,30,30,1)',
        storedInDatabase: false
    };
    var unnessesaryProperties = ['originalFillStyleInnerCircle', 'originalStrokeStyleOuterCircle'];
    var status = {
            'deleted' : false,
            'visibility' : 'visible',
            'visibilityIcon' : 'visible'
    };

    function _init (x, y, pov, params) {
        // Convert a canvas coordinate (x, y) into a sv image coordinate
        // Note, svImageCoordinate.x varies from 0 to svImageWidth and
        // svImageCoordinate.y varies from -(svImageHeight/2) to svImageHeight/2.

        //
        // Adjust the zoom level
        var zoom = pov.zoom;
        var zoomFactor = svw.zoomFactor[zoom];
        var svImageHeight = svw.svImageHeight;
        var svImageWidth = svw.svImageWidth;

        oPublic.svImageCoordinate = {};
        oPublic.svImageCoordinate.x = svImageWidth * pov.heading / 360 + (svw.alpha_x * (x - (svw.canvasWidth / 2)) / zoomFactor);
        oPublic.svImageCoordinate.y = (svImageHeight / 2) * pov.pitch / 90 + (svw.alpha_y * (y - (svw.canvasHeight / 2)) / zoomFactor);


        // svImageCoordinate.x could be negative, so adjust it.
        if (oPublic.svImageCoordinate.x < 0) {
            oPublic.svImageCoordinate.x = oPublic.svImageCoordinate.x + svImageWidth;
        }

        // Keep the original canvas coordinate and
        // canvas pov just in case.
        oPublic.canvasCoordinate = {
            x : x,
            y : y
        };
        oPublic.originalCanvasCoordinate = {
            x : x,
            y : y
        };
        oPublic.pov = {
            heading : pov.heading,
            pitch : pov.pitch,
            zoom : pov.zoom
        };
        oPublic.originalPov = {
            heading : pov.heading,
            pitch : pov.pitch,
            zoom : pov.zoom
        };

        // Set properties
        for (var propName in properties) {
            // It is ok if iconImagePath is not specified
            if(propName === "iconImagePath") {
                if (params.iconImagePath) {
                    properties.iconImagePath = params.iconImagePath;
                } else {
                    continue;
                }
            }

            if (propName in params) {
                properties[propName] = params[propName];
            } else {
                // See if this property must be set.
                if (unnessesaryProperties.indexOf(propName) === -1) {
                    // throw oPublic.className + ': "' + propName + '" is not defined.';
                }
            }
        }

        properties.originalFillStyleInnerCircle = properties.fillStyleInnerCircle;
        properties.originalStrokeStyleOuterCircle = properties.strokeStyleOuterCircle;
        return true;
    }


    function _init2 () {
        return true;
    }

    function getCanvasX () {
      return oPublic.canvasCoordinate.x;
    }

    function getCanvasY () {
      return oPublic.canvasCoordinate.y;
    }

    function getFill () {
        // return the fill color of this point
      return properties.fillStyleInnerCircle;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Public functions
    ////////////////////////////////////////////////////////////////////////////////
    oPublic.belongsTo = function () {
        // This function returns an object directly above this object.
        // I.e., it returns which path it belongs to.
        if (belongsTo) {
            return belongsTo;
        } else {
            return false;
        }
    };

    oPublic.getCanvasCoordinate = function (pov) {
        // This function takes current pov of the Street View as a parameter
        // and returns a canvas coordinate of a point.

        //
        // POV adjsutment
        oPublic.canvasCoordinate = svw.gsvImageCoordinate2CanvasCoordinate(oPublic.svImageCoordinate.x, oPublic.svImageCoordinate.y, pov);
        return svw.gsvImageCoordinate2CanvasCoordinate(oPublic.svImageCoordinate.x, oPublic.svImageCoordinate.y, pov);
    };

    oPublic.getCanvasX = getCanvasX;
    oPublic.getCanvasY = getCanvasY;
    oPublic.getFill = getFill;

    oPublic.getFillStyle = function () {
        // Get the fill style.
        // return properties.fillStyle;
        return  getFill();
    };

    oPublic.getGSVImageCoordinate = function () {
        return $.extend(true, {}, oPublic.svImageCoordinate);
    };

    oPublic.getProperty = function (name) {
        if (!(name in properties)) {
            throw oPublic.className + ' : A property name "' + name + '" does not exist in properties.';
        }
        return properties[name];
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


    oPublic.isOn = function (x, y) {
        var margin = properties.radiusOuterCircle / 2 + 3;
        if (x < oPublic.canvasCoordinate.x + margin &&
            x > oPublic.canvasCoordinate.x - margin &&
            y < oPublic.canvasCoordinate.y + margin &&
            y > oPublic.canvasCoordinate.y - margin) {
            return this;
        } else {
            return false;
        }
    }


    oPublic.render = function (pov, ctx) {
        // Render points
        if (status.visibility === 'visible') {
            var coord;
            var x;
            var y;
            var r = properties.radiusInnerCircle;
            coord = oPublic.getCanvasCoordinate(pov);
            x = coord.x;
            y = coord.y;

            ctx.save();
            ctx.strokeStyle = properties.strokeStyleOuterCircle;
            ctx.lineWidth = properties.lineWidthOuterCircle;
            ctx.beginPath();
            ctx.arc(x, y, properties.radiusOuterCircle, 2 * Math.PI, 0, true);
            ctx.closePath();
            ctx.stroke();
            ctx.fillStyle = properties.fillStyleInnerCircle; // changeAlphaRGBA(properties.fillStyleInnerCircle, 0.5);
            ctx.beginPath();
            ctx.arc(x, y, properties.radiusInnerCircle, 2 * Math.PI, 0, true);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }

    };

    oPublic.resetFillStyle = function () {
        // This method reverts the fillStyle property to its original value
        properties.fillStyleInnerCircle = properties.originalFillStyleInnerCircle;
        return this;
    };

    oPublic.resetSVImageCoordinate = function (coord) {
        // Set the svImageCoordinate
        oPublic.svImageCoordinate = coord;
        oPublic.canvasCoordinate = {x : 0, y: 0};
        return this;
    };

    oPublic.resetStrokeStyle = function () {
        // This method resets the strokeStyle to its original value
        properties.strokeStyleOuterCircle = properties.originalStrokeStyleOuterCircle;
        return this;
    };

    oPublic.setBelongsTo = function (obj) {
        // This function sets which object (Path)
        // The point belongs to.
        belongsTo = obj;
        return this;
    };

    oPublic.setFillStyle = function (value) {
        // This method sets the fill style of inner circle to the specified value
        properties.fillStyleInnerCircle = value;
        return this;
    };

    oPublic.setIconPath = function (iconPath) {
        properties.iconImagePath = iconPath;
        return this;
    };

    oPublic.setPhotographerPov = function (heading, pitch) {
        // this method sets the photographerHeading and photographerPitch
        properties.photographerHeading = heading;
        properties.photographerPitch = pitch;
        return this;
    };

    oPublic.setProperties = function (params) {
        // This function resets all the properties specified in params.
        for (key in params) {
            if (key in properties) {
                properties[key] = params[key];
            }
        }

        if ('originalCanvasCoordinate' in params) {
            oPublic.originalCanvasCoordinate = params.originalCanvasCoordinate;
        }

        //
        // Set pov parameters
        oPublic.pov = oPublic.pov || {};
        if ('pov' in params) {
            oPublic.pov = params.pov;
        }

        if ('heading' in params) {
            oPublic.pov.heading = params.heading;
        }

        if ('pitch' in params) {
            oPublic.pov.pitch = params.pitch;
        }

        if ('zoom' in params) {
            oPublic.pov.zoom = params.zoom;
        }

        //
        // Set original pov parameters
        oPublic.originalPov = oPublic.originalPov || {};
        if ('originalHeading' in params) {
            oPublic.originalPov.heading = params.originalHeading;
        }

        if ('originalPitch' in params) {
            oPublic.originalPov.pitch = params.originalPitch;
        }

        if ('originalZoom' in params) {
            oPublic.originalPov.zoom = params.originalZoom;
        }


        if (!properties.originalFillStyleInnerCircle) {
            properties.originalFillStyleInnerCircle = properties.fillStyleInnerCircle;
        }
        if (!properties.originalStrokeStyleOuterCircle) {
            properties.originalStrokeStyleOuterCircle = properties.strokeStyleOuterCircle;
        }
        return this;
    };

    oPublic.setStrokeStyle = function (val) {
        // This method sets the strokeStyle of an outer circle to val
        properties.strokeStyleOuterCircle = val;
        return this;
    };

    oPublic.setVisibility = function (visibility) {
        // This method sets the visibility of a path (and points that cons
        if (visibility === 'visible' || visibility === 'hidden') {
            status.visibility = visibility;
        }
        return this;
    };

    // Todo. Deprecated method. Get rid of this later.
    oPublic.resetProperties = oPublic.setProperties;

    ////////////////////////////////////////////////////////////////////////////////
    // Initialization
    ////////////////////////////////////////////////////////////////////////////////
    var argLen = arguments.length;
    if (argLen === 4) {
        _init(x, y, pov, params);
    } else {
        _init2();
    }

    return oPublic;
}


svw.gsvImageCoordinate2CanvasCoordinate = function (xIn, yIn, pov) {
    // This function takes the current pov of the Street View as a parameter
    // and returns a canvas coordinate of a point (xIn, yIn).
    var x;
    var y;
    var zoom = pov.zoom;
    var svImageWidth = svw.svImageWidth * svw.zoomFactor[zoom];
    var  = svw.svImageHeight * svw.zoomFactor[zoom];

    xIn = xIn * svw.zoomFactor[zoom];
    yIn = yIn * svw.zoomFactor[zoom];

    x = xIn - (svImageWidth * pov.heading) / 360;
    x = x / svw.alpha_x + svw.canvasWidth / 2;

    //
    // When POV is near 0 or near 360, points near the two vertical edges of
    // the SV image does not appear. Adjust accordingly.
    var edgeOfSvImageThresh = 360 * svw.alpha_x * (svw.canvasWidth / 2) / (svImageWidth) + 10;

    if (pov.heading < edgeOfSvImageThresh) {
        // Update the canvas coordinate of the point if
        // its svImageCoordinate.x is larger than svImageWidth - alpha_x * (svw.canvasWidth / 2).
        if (svImageWidth - svw.alpha_x * (svw.canvasWidth / 2) < xIn) {
            x = (xIn - svImageWidth) - (svImageWidth * pov.heading) / 360;
            x = x / svw.alpha_x + svw.canvasWidth / 2;
        }
    } else if (pov.heading > 360 - edgeOfSvImageThresh) {
        if (svw.alpha_x * (svw.canvasWidth / 2) > xIn) {
            x = (xIn + svImageWidth) - (svImageWidth * pov.heading) / 360;
            x = x / svw.alpha_x + svw.canvasWidth / 2;
        }
    }

    y = yIn - (svImageHeight / 2) * (pov.pitch / 90);
    y = y / svw.alpha_y + svw.canvasHeight / 2;


    //
    // Adjust the zoom level
    //
    //var zoomFactor = svw.zoomFactor[zoom];
    //x = x * zoomFactor;
    //y = y * zoomFactor;


    return {x : x, y : y};
}

svw.zoomFactor = {
    1: 1,
    2: 2.1,
    3: 4,
    4: 8,
    5: 16
};
