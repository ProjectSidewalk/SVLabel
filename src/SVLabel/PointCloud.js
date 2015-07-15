var svl = svl || {};

/**
 *
 * @param $
 * @constructor
 */
function PointCloud ($, params) {
    var self = {};
    var _callbacks = {};
    var _pointClouds = {};

    function _init(params) {
        params = params || {};

        // Get initial point clouds
        if ('panoIds' in params && params.panoIds) {
            for (var i = 0; i < params.panoIds.length; i++) {
                createPointCloud(params.panoIds[i]);
            }
        }
    }

    /**
     * This method downloads 3D depth data from Google Street View and creates point cloud data.
     * @param panoId
     */
    function createPointCloud(panoId) {
        if (!(panoId in _pointClouds)) {
            // Download the depth data only if it hasn't been downloaded. First put null in _pointClouds[panoId] so
            // that even while processing the data we don't accidentally download the data again.
            var _pointCloudLoader = new GSVPANO.PanoPointCloudLoader();
            _pointClouds[panoId] = null;
            _pointCloudLoader.onPointCloudLoad = function () {
                _pointClouds[panoId] = this.pointCloud;

                if (panoId in _callbacks) {
                    for (var i = 0; i < _callbacks[panoId].length; i++) {
                        _callbacks[panoId][i]();
                    }
                    _callbacks[panoId] = null;
                }
            }
            _pointCloudLoader.load(panoId);
        }
    }

    /**
     * This method returns point cloud data if it exists. Otherwise it calls createPointCloud to load the data.
     *
     * @param panoId
     * @returns {*}
     */
    function getPointCloud(panoId) {
        if (!(panoId in _pointClouds)) {
            createPointCloud(panoId);
            return null;
        } else {
            return _pointClouds[panoId];
        }
    }

    /**
     * Push a callback function into _callbacks
     * @param func
     */
    function ready(panoId, func) {
        if (!(panoId in _callbacks)) { _callbacks[panoId] = []; }
        _callbacks[panoId].push(func);
    }

    /**
     * Given the coordinate x, y (and z), return index of the data x
     * @panoId
     * @param x
     * @param y
     * @param param An object that could contain z-coordinate and a distance tolerance (r).
     */
    function search(panoId, x, y, param) {
        if (panoId in _pointClouds && getPointCloud(panoId)){
            var w = 512;
            var h = 256;
            var r2 = x * x + y * y;
            var tolerance = 100; // m
            var minR2 = 100;
            var ix;
            // var iy;

            // Todo. Needs find the actual nearest using a data structure (e.g., kd-tree, octtree).
            for (var piy = 0; piy < _pointClouds[panoId].pointCloud.length; i += 3) {
                var px = _pointClouds[panoId].pointCloud[i];
                var py = _pointClouds[panoId].pointCloud[i + 1];


                if (!px || !py || px > tolerance || py > tolerance) {
                    continue;
                }

                var pr2 = px * px + py + py;
                if (pr2 < minR2) {
                    minR2 = pr2;
                    ix = i;
                    // iy = i + 1;
                    // console.log(px, py);
                }
            }

            return ix;
        } else {
            return false;
        }
    }

    self.createPointCloud = createPointCloud;
    self.getPointCloud = getPointCloud;
    self.ready = ready;
    self.search = search;

    _init(params);
    return self;
}