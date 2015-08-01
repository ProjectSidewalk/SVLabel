var svl = svl || {};

/**
 * A MissionDescription module
 * @param $
 * @param params
 * @returns {{className: string}}
 * @constructor
 * @memberof svl
 */
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

        $("#current-status-complete-sign-up").on('click', function () {
            $("#sign-in-modal").addClass("hidden");
            $("#sign-up-modal").removeClass("hidden");
            $("#sign-in-modal-container").modal('show');
        });
        $("#current-status-complete-sign-in").on('click', function () {
            $("#sign-up-modal").addClass("hidden");
            $("#sign-in-modal").removeClass("hidden");
            $("#sign-in-modal-container").modal('show');
        });
    }


    ////////////////////////////////////////////////////////////////////////////////
    // Public functions
    ////////////////////////////////////////////////////////////////////////////////
    /**
     * The method sets what's shown in the current status pane in the interface
     * @param description {string} A string (or html) to put.
     * @returns {self}
     */
    function setCurrentStatusDescription (description) {
      if (svl.ui && svl.ui.missinDescription) {
        $currentStatusDescription.html(description);
      }
      return this;
    }

    self.setCurrentStatusDescription = setCurrentStatusDescription;
    init(params);
    return self;
}
