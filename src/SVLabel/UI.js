var svl = svl || {};

/**
 * A UI class
 * @param $
 * @param params
 * @returns {{moduleName: string}}
 * @constructor
 * @memberof svl
 */
function UI ($, params) {
    var self = {moduleName: 'MainUI'};
    self.streetViewPane = {};
    params = params || {};

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

      self.labeledLandmark = {};
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
      self.missinDescription = {};
      self.missinDescription.description = $("#CurrentStatus_Description");

      // OverlayMessage
      self.overlayMessage = {};
      self.overlayMessage.holder = $("#overlay-message-holder");
      self.overlayMessage.holder.append("<span id='overlay-message-box'><span id='overlay-message'>Walk</span></span>");
      self.overlayMessage.box = $("#overlay-message-box");
      self.overlayMessage.message = $("#overlay-message");

      // ProgressPov
      self.progressPov = {};
      self.progressPov.holder = $("#progress-pov-holder");
      self.progressPov.holder.append("<div id='progress-pov-label' class='bold'>Observed area:</div>");
      self.progressPov.holder.append("<div id='progress-pov-current-completion-bar'></div>");
      self.progressPov.holder.append("<div id='progress-pov-current-completion-bar-filler'></div>");
      self.progressPov.holder.append("<div id='progress-pov-current-completion-rate'>Hi</div>");
      self.progressPov.rate = $("#progress-pov-current-completion-rate");
      self.progressPov.bar = $("#progress-pov-current-completion-bar");
      self.progressPov.filler = $("#progress-pov-current-completion-bar-filler");

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

      self.onboarding = {};
      self.onboarding.holder = $("#onboarding-holder");
      if ("onboarding" in params && params.onboarding) {
        self.onboarding.holder.append("<div id='Holder_OnboardingCanvas'><canvas id='onboardingCanvas' width='720px' height='480px'></canvas><div id='Holder_OnboardingMessageBox'><div id='Holder_OnboardingMessage'></div></div></div>");
      }

    }

    _init(params);
    return self;
}
