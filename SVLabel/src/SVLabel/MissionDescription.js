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
        if (svw.ui && svw.ui.missinDescription) {
          // $currentStatusDescription = $(params.domIds.descriptionMessage);
          $currentStatusDescription = svw.ui.missinDescription.description;
          $currentStatusDescription.html(params.description);

          // if ('description' in params && params.description) {
          //     $currentStatusDescription.html(params.description);
          // } else {
          //     $currentStatusDescription.html('DefaultDescription');
          // }
        }
    }


    ////////////////////////////////////////////////////////////////////////////////
    // Public functions
    ////////////////////////////////////////////////////////////////////////////////
    self.setCurrentStatusDescription = function (description) {
      if (svw.ui && svw.ui.missinDescription) {
        $currentStatusDescription.html(description);
      }
      return this;
    };

    init(params);
    return self;
}
