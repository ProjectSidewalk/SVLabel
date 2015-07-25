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

    self.set = set;
    self.initialLocation = initialLocation;
    self.render = render;
    return self;
}
