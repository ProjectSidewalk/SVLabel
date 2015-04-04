var svw = svw || {};

function MainUI ($, params) {
    var self = {moduleName: 'MainUI'};
    var properties = {};
    var status = {};

    self.streetViewPane = {};
    self.ribbonMenu = {};
    ////////////////////////////////////////
    // Private Functions
    ////////////////////////////////////////
    function _init () {

      // Ribbon menu DOMs
      $divStreetViewHolder = $("#Holder_StreetView");
      $ribbonButtonBottomLines = $(".RibbonModeSwitchHorizontalLine");
      $ribbonConnector = $("#StreetViewLabelRibbonConnection");
      $spansModeSwitches = $('span.modeSwitch');

      self.ribbonMenu.streetViewHolder = $divStreetViewHolder;
      self.ribbonMenu.buttons = $spansModeSwitches;
      self.ribbonMenu.bottonBottomBorders = $ribbonButtonBottomLines;
      self.ribbonMenu.connector = $ribbonConnector;

    }

    ////////////////////////////////////////
    // Public Functions
    ////////////////////////////////////////

    _init(params);
    return self;
}
