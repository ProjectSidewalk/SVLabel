function MissionDescription ($, params) {
    var self = {
        className : 'MissionDescription'
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
    self.setCurrentStatusDescription = function (description) {
        $currentStatusDescription.html(description);
        return this;
    };

    init(params);
    return self;
}
