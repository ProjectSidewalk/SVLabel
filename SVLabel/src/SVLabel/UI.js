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

      // ActionStack DOMs
      $buttonRedo = $("#ActionStackRedoButton");
      $buttonUndo = $("#ActionStackUndoButton");

      self.actionStack = {};
      self.actionStack.redo = $buttonRedo;
      self.actionStack.undo = $buttonUndo;

      // LabeledLandmarkFeedback DOMs
      $labelCountCurbRamp = $("#LabeledLandmarkCount_CurbRamp");
      $labelCountNoCurbRamp = $("#LabeledLandmarkCount_NoCurbRamp");
      $submittedLabelMessage = $("#LabeledLandmarks_SubmittedLabelCount");

      self.labeledLandmark = {}
      self.labeledLandmark.curbRamp = $labelCountCurbRamp;
      self.labeledLandmark.noCurbRamp = $labelCountNoCurbRamp;
      self.labeledLandmark.submitted = $submittedLabelMessage;

      // Map DOMs
      self.map = {};
      self.map.canvas = $("canvas#labelCanvas");
      self.map.drawingLayer = $("div#labelDrawingLayer");
      self.map.pano = $("div#pano");
      self.map.streetViewHolder = $("div#streetViewHolder");
      self.map.viewControlLayer = $("div#viewControlLayer");
      self.map.modeSwitchWalk = $("span#modeSwitchWalk");
      self.map.modeSwitchDraw = $("span#modeSwitchDraw");

      // MissionDescription DOMs
      $currentStatusDescription = $("#CurrentStatus_Description")
      self.missinDescription = {};
      self.missinDescription.description = $currentStatusDescription;

      // OverlayMessage
      self.overlayMessage = {};
      self.overlayMessage.box = $("#OverlayMessageBox");
      self.overlayMessage.message = $("#OverlayMessage");

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

      // ZoomControl DOMs
      $buttonZoomIn = $("#ZoomControlZoomInButton");
      $buttonZoomOut = $("#ZoomControlZoomOutButton");

      self.zoomControl = {};
      self.zoomControl.zoomIn = $buttonZoomIn;
      self.zoomControl.zoomOut = $buttonZoomOut;

    }

    ////////////////////////////////////////
    // Public Functions
    ////////////////////////////////////////

    _init(params);
    return self;
}
