var svl = svl || {};
svl.util = svl.util || {};
svl.util.math = {}

/**
 * This method takes an angle value in radian and returns a value in degree
 * @param angleInRadian
 * @returns {number}
 */
function toDegrees (angleInRadian) {
    // This function converts the angle from radian to degree.
    // http://stackoverflow.com/questions/9705123/how-can-i-get-sin-cos-and-tan-to-return-degrees-instead-of-radians
    return angleInRadian * (180 / Math.PI);
}
svl.util.math.toDegrees = toDegrees;

/**
 * This function takes an angle in degree and returns a value in radian
 * @param angleInDegree
 * @returns {number}
 */
function toRadians (angleInDegree) {
    // This function converts the angle from degree to radian.
    // http://stackoverflow.com/questions/9705123/how-can-i-get-sin-cos-and-tan-to-return-degrees-instead-of-radians
    return angleInDegree * (Math.PI / 180);
}
svl.util.math.toRadians = toRadians;

/**
 * Given a latlng point and a dx and dy (in meters), return a latlng offset (dlng, dlat) .
 * I.e., the new point would be (lng + dlng, lat + dlat)
 * @param lat Current latitude.
 * @param dx Distance along the x-axis
 * @param dy Distance along the y-axis
 */
function latlngOffset(lat, dx, dy) {
    var dlat = dy / 111111;
    var dlng = dx / (111111 * Math.cos(toRadians(lat)));
    return {dlat: dlat, dlng: dlng};
}
svl.util.math.latlngOffset = latlngOffset;

/**
 * This function takes two points of latlon coordinates, origin and current.
 *
 * @param latLngOrigin
 * @param latLngCurr
 * @returns {number}
 */
function deltaLatLngToDegree (latLngOrigin, latLngCurr) {

    var deltaLat, deltaLng, theta;

    deltaLat = latLngCurr.lat - latLngOrigin.lat;
    deltaLng = latLngCurr.lng - latLngOrigin.lng;

    // Math.atan()
    // https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Math/atan
    if (deltaLat > 0) {
        theta = toDegrees(Math.atan(deltaLng/deltaLat));
    } else {
        theta = toDegrees(Math.PI + Math.atan(deltaLng/deltaLat));
    }

    return (360 + theta) % 360;
}


// http://clauswitt.com/simple-statistics-in-javascript.html
function Stats(arr) {
    var self = this;
    var theArray = arr || [];

    //http://en.wikipedia.org/wiki/Mean#Arithmetic_mean_.28AM.29
    self.getArithmeticMean = function() {
        var sum = 0, length = theArray.length;
        for(var i=0;i<length;i++) {
            sum += theArray[i];
        }
        return sum/length;
    }

    //http://en.wikipedia.org/wiki/Mean#Geometric_mean_.28GM.29
    self.getGeometricMean = function() {
        var product = 1, length = theArray.length;
        for(var i=0;i<length;i++) {
            product = product * theArray[i];
        }
        return Math.pow(product,(1/length));
    }

    //http://en.wikipedia.org/wiki/Mean#Harmonic_mean_.28HM.29
    self.getHarmonicMean = function() {
        var sum = 0, length = theArray.length;
        for(var i=0;i<length;i++) {
            sum += (1/theArray[i]);
        }
        return length/sum;
    }

    //http://en.wikipedia.org/wiki/Standard_deviation
    self.getStandardDeviation = function() {
        var arithmeticMean = this.getArithmeticMean();
        var sum = 0, length = theArray.length;
        for(var i=0;i<length;i++) {
            sum += Math.pow(theArray[i]-arithmeticMean, 2);
        }
        return Math.pow(sum/length, 0.5);
    }

    // Added by Kotaro
    // http://en.wikipedia.org/wiki/Standard_error
    self.getStandardError = function () {
        var stdev = this.getStandardDeviation();
        var len = theArray.length;
        var stderr = stdev / Math.sqrt(len)
        return stderr;
    };


    //http://en.wikipedia.org/wiki/Median
    self.getMedian = function() {
        var length = theArray.length;
        var middleValueId = Math.floor(length/2);
        var arr = theArray.sort(function(a, b){return a-b;});
        return arr[middleValueId];
    };


    // Added by Kotaro
    // http://stackoverflow.com/questions/1669190/javascript-min-max-array-values
    self.getMin = function () {
        return Math.min.apply(Math, theArray);
    };


    // Added by Kotaro
    // http://stackoverflow.com/questions/1669190/javascript-min-max-array-values
    self.getMax = function () {
        return Math.max.apply(Math, theArray);
    };


    self.setArray = function(arr) {
        theArray = arr;
        return self;
    }

    self.getArray = function() {
        return theArray;
    }

    return self;
}

function sleep(miliseconds) {
    var end = false;
}

function shuffle(array) {
    // This function returns a shuffled array.
    // Code from http://bost.ocks.org/mike/shuffle/
    var copy = [], n = array.length, i;

    // While there remain elements to shuffle…
    while (n) {

        // Pick a remaining element…
        i = Math.floor(Math.random() * array.length);

        // If not already shuffled, move it to the new array.
        if (i in array) {
            copy.push(array[i]);
            delete array[i];
            n--;
        }
    }

    return copy;
}
