/**
 * Created with JetBrains PhpStorm.
 * User: kotaro
 * Date: 8/19/13
 * Time: 9:44 PM
 * To change this template use File | Settings | File Templates.
 */

var svw = svw || {};

function Tooltip ($, param) {
    var self = {className: 'Tooltip'};
    var properties = {};
    var status = {};

    var $divToolTip;

    ////////////////////////////////////////
    // Private functions
    ////////////////////////////////////////
    function _init(param) {
        $divToolTip = $(param.domIds.tooltipHolder);
    }

    ////////////////////////////////////////
    // Public functions
    ////////////////////////////////////////
    self.show = function (message) {
        $divToolTip.html(message);
        $divToolTip.css('visibility', 'visible');
    };

    self.hide = function () {
        $divToolTip.css('visibility', 'hidden');
    };

    _init(param);
    return self;
}
