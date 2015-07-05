/** @namespace */
var svl = svl || {};

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
        if (svl.ui && svl.ui.missinDescription) {
          // $currentStatusDescription = $(params.domIds.descriptionMessage);
          $currentStatusDescription = svl.ui.missinDescription.description;
          $currentStatusDescription.html(params.description);
        }
    }


    ////////////////////////////////////////////////////////////////////////////////
    // Public functions
    ////////////////////////////////////////////////////////////////////////////////
    self.setCurrentStatusDescription = function (description) {
      if (svl.ui && svl.ui.missinDescription) {
        $currentStatusDescription.html(description);
      }
      return this;
    };

    init(params);
    return self;
}
