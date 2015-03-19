/**
 * Created with JetBrains PhpStorm.
 * User: kotarohara
 * Date: 2/25/13
 * Time: 5:07 PM
 * To change this template use File | Settings | File Templates.
 */
var svw = svw || {};

function ZoomControl (param, $) {
    var oPublic = {
        'className' : 'ZoomControl'
    };
    var properties = {
        maxZoomLevel: 3,
        minZoomLevel: 1
    };
    var status = {
        disableZoomIn: false,
        disableZoomOut: false
    };
    var lock = {
        disableZoomIn: false,
        disableZoomOut: false
    };
    var actionStack = [];

    // jQuery dom objects
    var $buttonZoomIn;
    var $buttonZoomOut;

    ////////////////////////////////////////
    // Private Functions
    ////////////////////////////////////////
    function _init (param) {
        // Initialization function

        if ('domIds' in param) {
          $buttonZoomIn = ('zoomInButton' in param.domIds) ? $(param.domIds.zoomInButton) : undefined;
          $buttonZoomOut = ('zoomOutButton' in param.domIds) ? $(param.domIds.zoomOutButton) : undefined;
        }


        // Attach listeners to buttons
        if (buttonZoomIn && buttonZoomOut) {
          $buttonZoomIn.bind('click', buttonZoomInClick);
          $buttonZoomOut.bind('click', buttonZoomOutClick);
        }
    }


    function buttonZoomInClick () {
        // This is a callback function for zoom-in button. This function increments a sv zoom level.
        if ('tracker' in svw) {
          svw.tracker.push('Click_ZoomIn');
        }

        if (!status.disableZoomIn) {
            var pov = svw.panorama.getPov();
            setZoom(pov.zoom + 1);
            svw.canvas.clear().render2();
        }
    }

    function buttonZoomOutClick () {
        // This is a callback function for zoom-out button. This function decrements a sv zoom level.
        if ('traker' in svw) {
          svw.tracker.push('Click_ZoomOut');
        }

        if (!status.disableZoomOut) {
            var pov = svw.panorama.getPov();
            setZoom(pov.zoom - 1);
            svw.canvas.clear().render2();
        }
    }

    function pointZoomIn (x, y) {
        // This method takes a (x, y) canvas point and sets a zoom level.
        if (!status.disableZoomIn) {

            //
            // Cancel drawing when zooming in or out.
            if ('canvas' in svw) {
              svw.canvas.cancelDrawing();
            }

            if ('panorama' in svw) {
                var currentPov = svw.panorama.getPov();
                var currentZoomLevel = currentPov.zoom;

                if (currentZoomLevel >= properties.maxZoomLevel) {
                    return false;
                }

                var width = svw.canvasWidth;
                var height = svw.canvasHeight;
                var minPitch = svw.map.getProperty('minPitch');
                var maxPitch = svw.map.getProperty('maxPitch');

                var zoomFactor = currentZoomLevel; // This needs to be fixed as it wouldn't work above level 3.
                var deltaHeading = (x - (width / 2)) / width * (90 / zoomFactor); // Ugh. Hard coding.
                var deltaPitch = - (y - (height / 2)) / height * (70 / zoomFactor); // Ugh. Hard coding.

                var pov = {};
                pov.zoom = currentZoomLevel + 1;
                pov.heading = currentPov.heading + deltaHeading;
                pov.pitch = currentPov.pitch + deltaPitch;

                //
                // Adjust the pitch angle.
                var maxPitch = svw.map.getMaxPitch();
                var minPitch = svw.map.getMinPitch();
                if (pov.pitch > maxPitch) {
                    pov.pitch = maxPitch;
                } else if (pov.pitch < minPitch) {
                    pov.pitch = minPitch;
                }

                //
                // Adjust the pitch so it won't exceed max/min pitch.
                svw.panorama.setPov(pov);
                return currentZoomLevel;
            } else {
                return false;
            }
        }
    }

    function setZoom (zoomLevelIn) {
        // This method sets the zoom level of the street view image.
        if (typeof zoomLevelIn !== "number") {
            return false;
        }

        //
        // Cancel drawing when zooming in or out.
        if ('canvas' in svw) {
          svw.canvas.cancelDrawing();
        }

        //
        // Set the zoom level and change the panorama properties.
        var zoomLevel = undefined;
        zoomLevelIn = parseInt(zoomLevelIn);
        if (zoomLevelIn < 1) {
            zoomLevel = 1;
        } else if (zoomLevelIn > properties.maxZoomLevel) {
            zoomLevel = properties.maxZoomLevel;
        } else {
            zoomLevel = zoomLevelIn;
        }
        svw.panorama.setZoom(zoomLevel);
        return zoomLevel;
    }
    
    ////////////////////////////////////////
    // Public Functions
    ////////////////////////////////////////
    oPublic.disableZoomIn = function () {
        // Enable zoom in.
        if (!lock.disableZoomIn) {
            status.disableZoomIn = true;
            $buttonZoomIn.css('opacity', 0.5);
        }
        return this;
    }

    oPublic.disableZoomOut = function () {
        // Enable zoom out.
        if (!lock.disableZoomOut) {
            status.disableZoomOut = true;
            $buttonZoomOut.css('opacity', 0.5);
        }
        return this;
    };

    oPublic.enableZoomIn = function () {
        // Enable zoom in.
        if (!lock.disableZoomIn) {
            status.disableZoomIn = false;
            $buttonZoomIn.css('opacity', 1);
        }
        return this;
    }

    oPublic.enableZoomOut = function () {
        // Enable zoom out.
        if (!lock.disableZoomOut) {
            status.disableZoomOut = false;
            $buttonZoomOut.css('opacity', 1);
        }
        return this;
    };

    oPublic.getStatus = function () {
      return false; // Todo
    };

    oPublic.lockDisableZoomIn = function () {
        // Lock zoom in
        lock.disableZoomIn = true;
        return this;
    };

    oPublic.lockDisableZoomOut = function () {
        // Lock zoom out.
        lock.disableZoomOut = true;
        return this;
    };

    oPublic.updateOpacity = function () {
        var pov = getPOV();

        if (pov) {
            var zoom = pov.zoom;
            //
            // Change opacity
            if (zoom >= properties.maxZoomLevel) {
                $buttonZoomIn.css('opacity', 0.5);
                $buttonZoomOut.css('opacity', 1);
            } else if (zoom <= properties.minZoomLevel) {
                $buttonZoomIn.css('opacity', 1);
                $buttonZoomOut.css('opacity', 0.5);
            } else {
                $buttonZoomIn.css('opacity', 1);
                $buttonZoomOut.css('opacity', 1);
            }
        }

        //
        // If zoom in and out are disabled, fade them out anyway.
        if (status.disableZoomIn) {
            $buttonZoomIn.css('opacity', 0.5);
        }
        if (status.disableZoomOut) {
            $buttonZoomOut.css('opacity', 0.5);
        }


        return this;
    };

    oPublic.pointZoomIn = function (x, y) {
        // This function takes a canvas coordinate (x, y) and pass it to a private method pointZoomIn()
        if (!status.disableZoomIn) {
            return pointZoomIn(x, y);
        } else {
            return false;
        }
    };

    oPublic.setMaxZoomLevel = function (zoomLevel) {
        // This method sets the maximum zoom level that SV can show.
        properties.maxZoomLevel = zoomLevel;
        return this;
    };

    oPublic.setMinZoomLevel = function (zoomLevel) {
        // This method sets the minimum zoom level that SV can show.
        properties.minZoomLevel = zoomLevel;
        return this;
    };

    oPublic.unlockDisableZoomIn = function () {
        // Lock zoom in
        lock.disableZoomIn = false;
        return this;
    };

    oPublic.unlockDisableZoomOut = function () {
        // Lock zoom out.
        lock.disableZoomOut = false;
        return this;
    };

    oPublic.zoomIn = function () {
        // This method is called from outside this object to zoom in to a GSV image.
        if (!status.disableZoomIn) {
            var pov = svw.panorama.getPov();
            setZoom(pov.zoom + 1);
            svw.canvas.clear().render2();
            return this;
        } else {
            return false;
        }
    };

    oPublic.zoomOut = function () {
        // This method is called from outside this class to zoom out from a GSV image.
        if (!status.disableZoomOut) {
            // ViewControl_ZoomOut
            var pov = svw.panorama.getPov();
            setZoom(pov.zoom - 1);
            svw.canvas.clear().render2();
            return this;
        } else {
            return false;
        }
    };

    ////////////////////////////////////////
    // Initialization
    ////////////////////////////////////////
    _init(param);

    return oPublic;
}
