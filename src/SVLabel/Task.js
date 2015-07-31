var svl = svl || {};

/**
 * Task constructor
 * @param $
 * @param param
 * @returns {{className: string}}
 * @constructor
 * @memberof svl
 */
function Task ($) {
    var self = {className: 'Task'},
        properties = {},
        status = {},
        taskSetting;

    /**
     * End the current task
     */
    function endTask () {
        // Show the end of the task message.
        // Prompt a user who's not logged in to login.
        // Submit the data.

    }

    /**
     * Returns the street edge id of the current task.
     */
    function getStreetEdgeId () {
        return taskSetting.features[0].properties.street_edge_id
    }

    /**
     * Returns the task start time
     */
    function getTaskStart () {
        return taskSetting.features[0].properties.task_start;
    }

    /**
     * Returns the starting location
     */
    function initialLocation() {
        if (taskSetting) {
            return {
                lat: taskSetting.features[0].properties.y1,
                lng: taskSetting.features[0].properties.x1
            }
        }
    }

    /**
     * This method checks if the task is done or not by assessing the
     * current distance and the ending distance.
     */
    function isAtEnd (lat, lng, threshold) {
        if (taskSetting) {
            var featuresLength = taskSetting.features.length,
                latEnd = taskSetting.features[0].properties.y2,
                lngEnd = taskSetting.features[0].properties.x2,
                d;

            if (!threshold) {
                threshold = 15; // 15 meters
            }

            d = svl.util.math.haversine(lat, lng, latEnd, lngEnd);

            if (d < threshold) {
                return true;
            } else {
                return false;
            }
        }
    }

    /**
     *
     * Reference: https://developers.google.com/maps/documentation/javascript/shapes#polyline_add
     */
    function render() {
        if ('map' in svl && google) {
            var gCoordinates = taskSetting.features[0].geometry.coordinates.map(function (coord) {
                return new google.maps.LatLng(coord[1], coord[0]);
            });
            var path = new google.maps.Polyline({
                path: gCoordinates,
                geodesic: true,
                strokeColor: '#00FF00',
                strokeOpacity: 1.0,
                strokeWeight: 2
            });
            path.setMap(svl.map.getMap())
        }
    }

    /**
     * This method takes a task parameters in geojson format.
     */
    function set(json) {
        taskSetting = json;
    }

    self.endTask = endTask;
    self.getStreetEdgeId = getStreetEdgeId;
    self.getTaskStart = getTaskStart;
    self.set = set;
    self.initialLocation = initialLocation;
    self.isAtEnd = isAtEnd;
    self.render = render;
    return self;
}
