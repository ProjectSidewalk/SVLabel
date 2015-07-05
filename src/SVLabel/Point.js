/** @namespace */
var svl = svl || {};

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
    var self = {
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
        var zoomFactor = svl.zoomFactor[zoom];
        var svImageHeight = svl.svImageHeight;
        var svImageWidth = svl.svImageWidth;
        self.svImageCoordinate = {};
        self.svImageCoordinate.x = svImageWidth * pov.heading / 360 + (svl.alpha_x * (x - (svl.canvasWidth / 2)) / zoomFactor);
        self.svImageCoordinate.y = (svImageHeight / 2) * pov.pitch / 90 + (svl.alpha_y * (y - (svl.canvasHeight / 2)) / zoomFactor);
        // svImageCoordinate.x could be negative, so adjust it.
        if (self.svImageCoordinate.x < 0) {
            self.svImageCoordinate.x = self.svImageCoordinate.x + svImageWidth;
        }
        // Keep the original canvas coordinate and
        // canvas pov just in case.
        self.canvasCoordinate = {
            x : x,
            y : y
        };
        self.originalCanvasCoordinate = {
            x : x,
            y : y
        };
        self.pov = {
            heading : pov.heading,
            pitch : pov.pitch,
            zoom : pov.zoom
        };
        self.originalPov = {
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
                    // throw self.className + ': "' + propName + '" is not defined.';
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
      return self.canvasCoordinate.x;
    }

    function getCanvasY () {
      return self.canvasCoordinate.y;
    }

    function getFill () {
        // return the fill color of this point
      return properties.fillStyleInnerCircle;
    }
    function getPOV () {
        return pov;
    };

    ////////////////////////////////////////////////////////////////////////////////
    // Public functions
    ////////////////////////////////////////////////////////////////////////////////
    self.belongsTo = function () {
        // This function returns an object directly above this object.
        // I.e., it returns which path it belongs to.
        if (belongsTo) {
            return belongsTo;
        } else {
            return false;
        }
    };

    self.getPOV = function() {
        return getPOV();
    };

    self.getCanvasCoordinate = function (pov) {
        // This function takes current pov of the Street View as a parameter
        // and returns a canvas coordinate of a point.

        //
        // POV adjustment
        self.canvasCoordinate = svl.gsvImageCoordinate2CanvasCoordinate(self.svImageCoordinate.x, self.svImageCoordinate.y, pov);
        return svl.gsvImageCoordinate2CanvasCoordinate(self.svImageCoordinate.x, self.svImageCoordinate.y, pov);
    };

    self.getCanvasX = getCanvasX;
    self.getCanvasY = getCanvasY;
    self.getFill = getFill;

    self.getFillStyle = function () {
        // Get the fill style.
        // return properties.fillStyle;
        return  getFill();
    };

    self.getGSVImageCoordinate = function () {
        return $.extend(true, {}, self.svImageCoordinate);
    };

    self.getProperty = function (name) {
        if (!(name in properties)) {
            throw self.className + ' : A property name "' + name + '" does not exist in properties.';
        }
        return properties[name];
    };


    self.getProperties = function () {
        // Return the deep copy of the properties object,
        // so the caller can only modify properties from
        // setProperties() (which I have not implemented.)
        //
        // JavaScript Deepcopy
        // http://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-clone-a-javascript-object
        return $.extend(true, {}, properties);
    };


    self.isOn = function (x, y) {
        var margin = properties.radiusOuterCircle / 2 + 3;
        if (x < self.canvasCoordinate.x + margin &&
            x > self.canvasCoordinate.x - margin &&
            y < self.canvasCoordinate.y + margin &&
            y > self.canvasCoordinate.y - margin) {
            return this;
        } else {
            return false;
        }
    }


    self.render = function (pov, ctx) {
        // Render points
        if (status.visibility === 'visible') {
            var coord;
            var x;
            var y;
            var r = properties.radiusInnerCircle;
            coord = self.getCanvasCoordinate(pov);
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

    self.resetFillStyle = function () {
        // This method reverts the fillStyle property to its original value
        properties.fillStyleInnerCircle = properties.originalFillStyleInnerCircle;
        return this;
    };

    self.resetSVImageCoordinate = function (coord) {
        // Set the svImageCoordinate
        self.svImageCoordinate = coord;
        self.canvasCoordinate = {x : 0, y: 0};
        return this;
    };

    self.resetStrokeStyle = function () {
        // This method resets the strokeStyle to its original value
        properties.strokeStyleOuterCircle = properties.originalStrokeStyleOuterCircle;
        return this;
    };

    self.setBelongsTo = function (obj) {
        // This function sets which object (Path)
        // The point belongs to.
        belongsTo = obj;
        return this;
    };

    self.setFillStyle = function (value) {
        // This method sets the fill style of inner circle to the specified value
        properties.fillStyleInnerCircle = value;
        return this;
    };

    self.setIconPath = function (iconPath) {
        properties.iconImagePath = iconPath;
        return this;
    };

    self.setPhotographerPov = function (heading, pitch) {
        // this method sets the photographerHeading and photographerPitch
        properties.photographerHeading = heading;
        properties.photographerPitch = pitch;
        return this;
    };

    self.setProperties = function (params) {
        // This function resets all the properties specified in params.
        for (key in params) {
            if (key in properties) {
                properties[key] = params[key];
            }
        }

        if ('originalCanvasCoordinate' in params) {
            self.originalCanvasCoordinate = params.originalCanvasCoordinate;
        }

        //
        // Set pov parameters
        self.pov = self.pov || {};
        if ('pov' in params) {
            self.pov = params.pov;
        }

        if ('heading' in params) {
            self.pov.heading = params.heading;
        }

        if ('pitch' in params) {
            self.pov.pitch = params.pitch;
        }

        if ('zoom' in params) {
            self.pov.zoom = params.zoom;
        }

        //
        // Set original pov parameters
        self.originalPov = self.originalPov || {};
        if ('originalHeading' in params) {
            self.originalPov.heading = params.originalHeading;
        }

        if ('originalPitch' in params) {
            self.originalPov.pitch = params.originalPitch;
        }

        if ('originalZoom' in params) {
            self.originalPov.zoom = params.originalZoom;
        }


        if (!properties.originalFillStyleInnerCircle) {
            properties.originalFillStyleInnerCircle = properties.fillStyleInnerCircle;
        }
        if (!properties.originalStrokeStyleOuterCircle) {
            properties.originalStrokeStyleOuterCircle = properties.strokeStyleOuterCircle;
        }
        return this;
    };

    self.setStrokeStyle = function (val) {
        // This method sets the strokeStyle of an outer circle to val
        properties.strokeStyleOuterCircle = val;
        return this;
    };

    self.setVisibility = function (visibility) {
        // This method sets the visibility of a path (and points that cons
        if (visibility === 'visible' || visibility === 'hidden') {
            status.visibility = visibility;
        }
        return this;
    };

    // Todo. Deprecated method. Get rid of this later.
    self.resetProperties = self.setProperties;

    ////////////////////////////////////////////////////////////////////////////////
    // Initialization
    ////////////////////////////////////////////////////////////////////////////////
    var argLen = arguments.length;
    if (argLen === 4) {
        _init(x, y, pov, params);
    } else {
        _init2();
    }

    return self;
}


svl.gsvImageCoordinate2CanvasCoordinate = function (xIn, yIn, pov) {
    // This function takes the current pov of the Street View as a parameter
    // and returns a canvas coordinate of a point (xIn, yIn).
    var x;
    var y;
    var zoom = pov.zoom;
    var svImageWidth = svl.svImageWidth * svl.zoomFactor[zoom];
    var svImageHeight = svl.svImageHeight * svl.zoomFactor[zoom];

    xIn = xIn * svl.zoomFactor[zoom];
    yIn = yIn * svl.zoomFactor[zoom];

    x = xIn - (svImageWidth * pov.heading) / 360;
    x = x / svl.alpha_x + svl.canvasWidth / 2;

    //
    // When POV is near 0 or near 360, points near the two vertical edges of
    // the SV image does not appear. Adjust accordingly.
    var edgeOfSvImageThresh = 360 * svl.alpha_x * (svl.canvasWidth / 2) / (svImageWidth) + 10;

    if (pov.heading < edgeOfSvImageThresh) {
        // Update the canvas coordinate of the point if
        // its svImageCoordinate.x is larger than svImageWidth - alpha_x * (svl.canvasWidth / 2).
        if (svImageWidth - svl.alpha_x * (svl.canvasWidth / 2) < xIn) {
            x = (xIn - svImageWidth) - (svImageWidth * pov.heading) / 360;
            x = x / svl.alpha_x + svl.canvasWidth / 2;
        }
    } else if (pov.heading > 360 - edgeOfSvImageThresh) {
        if (svl.alpha_x * (svl.canvasWidth / 2) > xIn) {
            x = (xIn + svImageWidth) - (svImageWidth * pov.heading) / 360;
            x = x / svl.alpha_x + svl.canvasWidth / 2;
        }
    }

    y = yIn - (svImageHeight / 2) * (pov.pitch / 90);
    y = y / svl.alpha_y + svl.canvasHeight / 2;


    //
    // Adjust the zoom level
    //
    //var zoomFactor = svl.zoomFactor[zoom];
    //x = x * zoomFactor;
    //y = y * zoomFactor;


    return {x : x, y : y};
}

svl.zoomFactor = {
    1: 1,
    2: 2.1,
    3: 4,
    4: 8,
    5: 16
};
