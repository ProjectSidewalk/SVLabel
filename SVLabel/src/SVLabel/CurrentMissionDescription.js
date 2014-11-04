/**
 * Created with JetBrains PhpStorm.
 * User: kotarohara
 * Date: 3/18/13
 * Time: 7:38 PM
 * To change this template use File | Settings | File Templates.
 */
function CurrentMissionDescription (params) {
    var oPublic = {
        className : 'CurrentMissionDescription'
    };
    var properties = {};
    var status = {};

    // jQuery elements
    var $currentStatusDescription;

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions
    ////////////////////////////////////////////////////////////////////////////////
    function init (params) {
        // Initialize DOM elements
        $currentStatusDescription = $(params.domIds.descriptionMessage);

        if ('description' in params && params.description) {
            $currentStatusDescription.html(params.description);
        } else {
            $currentStatusDescription.html('DefaultDescription');
        }

    }


    ////////////////////////////////////////////////////////////////////////////////
    // Public functions
    ////////////////////////////////////////////////////////////////////////////////
    oPublic.setCurrentStatusDescription = function (description) {
        $currentStatusDescription.html(description);
        return this;
    };

    init(params);
    return oPublic;
}