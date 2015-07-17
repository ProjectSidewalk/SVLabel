var svl = svl || {};

/**
 *
 * @param points
 * @param params
 * @returns {{className: string, points: undefined}}
 * @constructor
 * @memberof svl
 */
function Path (points, params) {
    // Path object constructor
    // This class object holds an array of Point objects.
    //
    // For canvas properties, take a look at:
    // https://developer.mozilla.org/en-US/docs/HTML/Canvas/Tutorial/Applying_styles_and_colors
    //
    var self = { className : 'Path', points : undefined };
    var belongsTo;
    var properties = {
        fillStyle: 'rgba(255,255,255,0.5)',
        lineCap : 'round', // ['butt','round','square']
        lineJoin : 'round', // ['round','bevel','miter']
        lineWidth : '3',
        numPoints: points.length,
        originalFillStyle: undefined,
        originalStrokeStyle: undefined,
        strokeStyle : 'rgba(255,255,255,1)',
        strokeStyle_bg : 'rgba(255,255,255,1)' //potentially delete
    };
    var status = {
        visibility: 'visible'
    };

    function _init(points, params) {
        var lenPoints;
        var i;
        self.points = points;
        lenPoints = points.length;

        // Set belongs to of the points
        for (i = 0; i < lenPoints; i += 1) {
            points[i].setBelongsTo(self);
        }

        if (params) {
            for (var attr in params) {
                if (attr in properties) {
                    properties[attr] = params[attr];
                }
            }
        }

        properties.fillStyle = changeAlphaRGBA(points[0].getProperty('fillStyleInnerCircle'), 0.5);
        properties.originalFillStyle = properties.fillStyle;
        properties.originalStrokeStyle = properties.strokeStyle;
    }

    /**
     * Returns the line width
     * @returns {string}
     */
    function getLineWidth () {
      return properties.lineWidth;
    }

    /**
     * Returns fill color of the path
     * @returns {string}
     */
    function getFill() {
      return properties.fillStyle;
    }

    /**
     * Sets fill color of the path
     * @param fill
     */
    function setFill(fill) {
      properties.fillStyle = fill;
    }

    /**
     * This function checks if a mouse cursor is on any of a points and return
     * @param povIn
     * @returns {{x: number, y: number, width: number, height: number}}
     */
    function getBoundingBox(povIn) {
        var pov = povIn ? povIn : svl.getPOV();
        var canvasCoords = getCanvasCoordinates(pov);
        var xMin, xMax, yMin, yMax, width, height;
        if (points.length > 2) {
            xMax = -1;
            xMin = 1000000;
            yMax = -1;
            yMin = 1000000;

            for (var j = 0; j < canvasCoords.length; j += 1) {
                var coord = canvasCoords[j];
                if (coord.x < xMin) { xMin = coord.x; }
                if (coord.x > xMax) { xMax = coord.x; }
                if (coord.y < yMin) { yMin = coord.y; }
                if (coord.y > yMax) { yMax = coord.y; }
            }
            width = xMax - xMin;
            height = yMax - yMin;
        } else {
            xMin = canvasCoords[0].x;
            yMin = canvasCoords[0].y;
            width = 0;
            height = 0;
        }

        return { x: xMin, y: yMin, width: width, height: height };
    }

    /**
     * this method returns a bounding box in terms of svImage coordinates.
     * @returns {{x: number, y: number, width: number, height: number, boundary: boolean}}
     */
    function getSvImageBoundingBox() {
      var i;
      var coord;
      var coordinates = getImageCoordinates();
      var len = coordinates.length;
      var xMax = -1;
      var xMin = 1000000;
      var yMax = -1000000;
      var yMin = 1000000;
      var boundary = false;

      //
      // Check if thie is an boundary case
      for (i = 0; i < len; i++) {
        coord = coordinates[i];
        if (coord.x < xMin) {
          xMin = coord.x;
        }
        if (coord.x > xMax) {
          xMax = coord.x;
        }
        if (coord.y < yMin) {
          yMin = coord.y;
        }
        if (coord.y > yMax) {
          yMax = coord.y;
        }
      }

      if (xMax - xMin > 5000) {
        boundary = true;
        xMax = -1;
        xMin = 1000000;

        for (i = 0; i < len; i++) {
          coord = coordinates[i];
          if (coord.x > 6000) {
            if (coord.x < xMin) {
              xMin = coord.x;
            }
          } else {
            if (coord.x > xMax){
              xMax = coord.x;
            }
          }
        }
      }

      //
      // If the path is on boundary, swap xMax and xMin.
      if (boundary) {
        return {
          x: xMin,
          y: yMin,
          width: (svl.svImageWidth - xMin) + xMax,
          height: yMax - yMin,
          boundary: true
        }
      } else {
        return {
          x: xMin,
          y: yMin,
          width: xMax - xMin,
          height: yMax - yMin,
          boundary: false
        }
      }
    }

    /**
     * Get canvas coordinate
     * @param pov
     * @returns {Array}
     */
    function getCanvasCoordinates (pov) {
        // Get canvas coordinates of points that constitute the path.
        var imCoords = getImageCoordinates();
        var i;
        var len = imCoords.length;
        var canvasCoord;
        var canvasCoords = [];
        var min = 10000000;
        var max = -1;

        for (i = 0; i < len; i += 1) {
            if (min > imCoords[i].x) {
                min = imCoords[i].x;
            }
            if (max < imCoords[i].x) {
                max = imCoords[i].x;
            }
        }
        // Note canvasWidthInGSVImage is approximately equals to the image width of GSV image that fits in one canvas view
        var canvasWidthInGSVImage = 3328;
        for (i = 0; i < len; i += 1) {
            if (pov.heading < 180) {
                if (max > svl.svImageWidth - canvasWidthInGSVImage) {
                    if (imCoords[i].x > canvasWidthInGSVImage) {
                        imCoords[i].x -= svl.svImageWidth;
                    }
                }
            } else {
                if (min < canvasWidthInGSVImage) {
                    if (imCoords[i].x < svl.svImageWidth - canvasWidthInGSVImage) {
                        imCoords[i].x += svl.svImageWidth;
                    }
                }
            }
            canvasCoord = svl.gsvImageCoordinate2CanvasCoordinate(imCoords[i].x, imCoords[i].y, pov);
            canvasCoords.push(canvasCoord);
        }

        return canvasCoords;
    }


    /**
     * This method returns an array of image coordinates of points
     * @returns {Array}
     */
    function getImageCoordinates() {
        var i, len = self.points.length, coords = [];
        for (i = 0; i < len; i += 1) {
            coords.push(self.points[i].getGSVImageCoordinate());
                }
        return coords;
    }

    /**
     * Returns points
     * @returns {*}
     */
    function getPoints() {
        return points;
    }

    /**
     * This method renders a bounding box around a path.
     * @param ctx
     */
    function renderBoundingBox (ctx) {
        // This function takes a bounding box returned by a method getBoundingBox()
        var boundingBox = getBoundingBox();

        ctx.save();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(255,255,255,1)';
        ctx.beginPath();
        ctx.moveTo(boundingBox.x, boundingBox.y);
        ctx.lineTo(boundingBox.x + boundingBox.width, boundingBox.y);
        ctx.lineTo(boundingBox.x + boundingBox.width, boundingBox.y + boundingBox.height);
        ctx.lineTo(boundingBox.x, boundingBox.y + boundingBox.height);
        ctx.lineTo(boundingBox.x, boundingBox.y);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }

    ////////////////////////////////////////
    // self functions
    ////////////////////////////////////////
    self.belongsTo = function () {
        // This function returns which object (i.e. Label) this Path
        // belongs to.
        if (belongsTo) {
            return belongsTo;
        } else {
            return false;
        }
    };

    self.getPOV = function() {
        return points[0].getPOV();
    };

    self.getBoundingBox = function (pov) {
        // Get a bounding box of this path
        return getBoundingBox(pov);
    };

    self.getLineWidth = function () {
      // get line width
      return getLineWidth();
    };

    self.getFill = function () {
      return getFill();
    };

    self.getFillStyle = function () {
        // Get the fill style.
        return properties.fillStyle;
    };


    self.getSvImageBoundingBox = function () {
        // Get a boudning box
        return getSvImageBoundingBox();
    };


    self.getImageCoordinates = function () {
        // Get the image coordinates of the path.
        return getImageCoordinates();
    };


    /**
     * This function returns points.
     */
    self.getPoints = function (reference) {
        //
        if (!reference) {
            reference = false;
        }

        if (reference) {
            // return self.points;
            return points;
        } else {
            // return $.extend(true, [], self.points);
            return $.extend(true, [], points);
        }
    };

    self.getProperty = function (key) {
        return properties[key];
    };


    self.isOn = function (x, y) {
        // This function checks if a mouse cursor is on any of a points and return
        // a point if the cursor is indeed on the point.
        // Otherwise, this function checks if the mouse cursor is on a bounding box
        // of this path. If the cursor is on the bounding box, then this function
        // returns this path object.
        var boundingBox;
        var i;
        var j;
        var point;
        var pointsLen;
        var result;

        //
        // Check if the passed point (x, y) is on any of points.
        pointsLen = self.points.length;
        for (j = 0; j < pointsLen; j += 1) {
            point = self.points[j];
            result = point.isOn(x, y);
            if (result) {
                return result;
            }
        }

        //
        // Check if the passed point (x, y) is on a path bounding box
        boundingBox = getBoundingBox();
        if (boundingBox.x < x &&
            boundingBox.x + boundingBox.width > x &&
            boundingBox.y < y &&
            boundingBox.y + boundingBox.height > y) {
            return this;
        } else {
            return false;
        }
    };

    /**
     * This method calculates the area overlap between bouding boxes of this path and
     * another path passed as an argument.
     * @param path
     * @param mode
     * @returns {number}
     */
    self.overlap = function (path, mode) {
        if (!mode) {
            mode = "boundingbox";
        }

        var overlap = 0;

        if (mode === "boundingbox") {
            var boundingbox1 = getSvImageBoundingBox();
            var boundingbox2 = path.getSvImageBoundingBox();
            var xOffset;
            var yOffset;

            //
            // Check if a bounding box is on a boundary
            if (!(boundingbox1.boundary && boundingbox2.boundary)) {
                if (boundingbox1.boundary) {
                    boundingbox1.x = boundingbox1.x - svl.svImageWidth;
                    if (boundingbox2.x > 6000) {
                        boundingbox2.x = boundingbox2.x - svl.svImageWidth;
                    }
                } else if (boundingbox2.boundary) {
                    boundingbox2.x = boundingbox2.x - svl.svImageWidth;
                    if (boundingbox1.x > 6000) {
                        boundingbox1.x = boundingbox1.x - svl.svImageWidth;
                    }
                }
            }


            if (boundingbox1.x < boundingbox2.x) {
                xOffset = boundingbox1.x;
            } else {
                xOffset = boundingbox2.x;
            }
            if (boundingbox1.y < boundingbox2.y) {
                yOffset = boundingbox1.y;
            } else {
                yOffset = boundingbox2.y;
            }

            boundingbox1.x -= xOffset;
            boundingbox2.x -= xOffset;
            boundingbox1.y -= yOffset;
            boundingbox2.y -= yOffset;

            var b1x1 = boundingbox1.x;
            var b1x2 = boundingbox1.x + boundingbox1.width;
            var b1y1 = boundingbox1.y;
            var b1y2 = boundingbox1.y + boundingbox1.height;
            var b2x1 = boundingbox2.x;
            var b2x2 = boundingbox2.x + boundingbox2.width;
            var b2y1 = boundingbox2.y;
            var b2y2 = boundingbox2.y + boundingbox2.height;
            var row = 0;
            var col = 0;
            var rowMax = (b1x2 < b2x2) ? b2x2 : b1x2;
            var colMax = (b1y2 < b2y2) ? b2y2 : b1y2;
            var countUnion = 0;
            var countIntersection = 0;
            var isOnB1 = false;
            var isOnB2 = false;

            for (row = 0; row < rowMax; row++) {
                for (col = 0; col < colMax; col++) {
                    isOnB1 = (b1x1 < row && row < b1x2) && (b1y1 < col && col < b1y2);
                    isOnB2 = (b2x1 < row && row < b2x2) && (b2y1 < col && col < b2y2);
                    if (isOnB1 && isOnB2) {
                        countIntersection += 1;
                    }
                    if (isOnB1 || isOnB2) {
                        countUnion += 1;
                    }
                }
            }
            overlap = countIntersection / countUnion;
        }

        return overlap;
    };

    /**
     * This method remove all the points in the list points.
     */
    self.removePoints = function () {
        self.points = undefined;
    };

    self.render2 = function (ctx, pov) {
        return self.render(pov, ctx);
    };

    /**
     * This method renders a path.
     * @param pov
     * @param ctx
     */
    self.render = function (pov, ctx) {
        if (status.visibility === 'visible') {
            var pathLen;
            var point;
            var j;

            pathLen = self.points.length;

            // Get canvas coordinates to render a path.
            var canvasCoords = getCanvasCoordinates(pov);

            // Set the fill color
            point = self.points[0];
            ctx.save();
            ctx.beginPath();
            if (!properties.fillStyle) {
                properties.fillStyle = changeAlphaRGBA(point.getProperty('fillStyleInnerCircle'), 0.5);
                properties.originalFillStyle = properties.fillStyle;
                ctx.fillStyle = properties.fillStyle;
            } else {
                ctx.fillStyle = properties.fillStyle;
            }

            if (pathLen > 1) {
                // Render fill
                ctx.moveTo(canvasCoords[0].x, canvasCoords[0].y);
                for (j = 1; j < pathLen; j += 1) {
                    ctx.lineTo(canvasCoords[j].x, canvasCoords[j].y);
                }
                ctx.lineTo(canvasCoords[0].x, canvasCoords[0].y);
                ctx.fill();
                ctx.closePath();
                ctx.restore();
            }

            // Render points
            for (j = 0; j < pathLen; j += 1) {
                point = self.points[j];
                point.render(pov, ctx);
            }

            if (pathLen > 1) {
                // Render segments
                for (j = 0; j < pathLen; j += 1) {
                    if (j > 0) {
                        var currCoord = canvasCoords[j];
                        var prevCoord = canvasCoords[j - 1];
                    } else {
                        var currCoord = canvasCoords[j];
                        var prevCoord = canvasCoords[pathLen - 1];
                    }
                    var r = point.getProperty('radiusInnerCircle');
                    ctx.save();
                    ctx.strokeStyle = properties.strokeStyle;
                    svl.util.shape.lineWithRoundHead(ctx, prevCoord.x, prevCoord.y, r, currCoord.x, currCoord.y, r);
                    ctx.restore();
                }
            }
        }
    };

    self.renderBoundingBox = renderBoundingBox;

    /**
     * This method changes the value of fillStyle to its original fillStyle value
     * @returns {self}
     */
    self.resetFillStyle = function () {
        properties.fillStyle = properties.originalFillStyle;
        return this;
    };

    /**
     * This method resets the strokeStyle to its original value
     * @returns {self}
     */
    self.resetStrokeStyle = function () {
        properties.strokeStyle = properties.originalStrokeStyle;
        return this;
    };

    self.setFill = function(fill) {
        // console.log(fill[1]);
        // console.log(fill.substring(4, fill.length-1));
        if(fill.substring(0,4)=='rgba'){
            setFill(fill);
        }
        else{
            setFill('rgba'+fill.substring(3,fill.length-1)+',0.5)');
        }
        return this;
    };

    self.setBelongsTo = function (obj) {
        belongsTo = obj;
        return this;
    };

    self.setLineWidth = function (lineWidth) {
        if(!isNaN(lineWidth)){
            properties.lineWidth  = ''+lineWidth;
        }
        return this;
    };

    self.setFillStyle = function (fill) {
        // This method sets the fillStyle of the path
        if(fill!=undefined){
            properties.fillStyle = fill;
        };
        return this;
    };

    self.setStrokeStyle = function (stroke) {
        // This method sets the strokeStyle of the path
        properties.strokeStyle = stroke;
        return this;
    };

    self.setVisibility = function (visibility) {
        // This method sets the visibility of a path (and points that cons
        if (visibility === 'visible' || visibility === 'hidden') {
            status.visibility = visibility;
        }
        return this;
    };

    // Initialize
    _init(points, params);

    return self;
}
