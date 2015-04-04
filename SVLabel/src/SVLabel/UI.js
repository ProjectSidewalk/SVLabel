var svw = svw || {};

function UI ($, params) {
    var self = {moduleName: 'MainUI'};
    var properties = {};
    var status = {};

    self.streetViewPane = {};

    ////////////////////////////////////////
    // Private Functions
    ////////////////////////////////////////
    function _init (params) {



      // Ribbon menu DOMs
      $divStreetViewHolder = $("#Holder_StreetView");
      $ribbonButtonBottomLines = $(".RibbonModeSwitchHorizontalLine");
      $ribbonConnector = $("#StreetViewLabelRibbonConnection");
      $spansModeSwitches = $('span.modeSwitch');

      self.ribbonMenu = {};
      self.ribbonMenu.streetViewHolder = $divStreetViewHolder;
      self.ribbonMenu.buttons = $spansModeSwitches;
      self.ribbonMenu.bottonBottomBorders = $ribbonButtonBottomLines;
      self.ribbonMenu.connector = $ribbonConnector;

      // LabeledLandmarkFeedback DOMs
      $labelCountCurbRamp = $("#LabeledLandmarkCount_CurbRamp");
      $labelCountNoCurbRamp = $("#LabeledLandmarkCount_NoCurbRamp");
      $submittedLabelMessage = $("#LabeledLandmarks_SubmittedLabelCount");

      self.labeledLandmark = {}
      self.labeledLandmark.curbRamp = $labelCountCurbRamp;
      self.labeledLandmark.noCurbRamp = $labelCountNoCurbRamp;
      self.labeledLandmark.submitted = $submittedLabelMessage;


    }

    ////////////////////////////////////////
    // Public Functions
    ////////////////////////////////////////

    _init(params);
    return self;
}
