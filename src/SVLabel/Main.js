/** @namespace */
var svl = svl || {};

/**
 * The main module of SVLabel
 * @param $: jQuery object
 * @param param: other parameters
 * @returns {{moduleName: string}}
 * @constructor
 * @memberof svl
 */
function Main ($, params) {
    var self = {moduleName: 'Main'};
    var properties = {};
    var status = {};

    ////////////////////////////////////////
    // Private Functions
    ////////////////////////////////////////
    function _init (params) {
        var SVLat;
        var SVLng;
        var currentProgress;
        var panoId = params.panoId;


        // Instantiate objects
        svl.ui = new UI($);
        svl.tracker = new Tracker();
        svl.keyboard = new Keyboard($);
        svl.canvas = new Canvas($);
        svl.form = new Form($, param.form);
        svl.examples = undefined;
        svl.overlayMessageBox = new OverlayMessageBox($);
        svl.missionDescription = new MissionDescription($, param.missionDescription);
        svl.labeledLandmarkFeedback = new LabeledLandmarkFeedback($);
        svl.qualificationBadges = undefined;
        svl.progressFeedback = new ProgressFeedback($);
        svl.actionStack = new ActionStack($);
        svl.ribbon = new RibbonMenu($);
        svl.messageBox = new MessageBox($);
        svl.zoomControl = new ZoomControl($);
        svl.tooltip = undefined;
        svl.onboarding = undefined;
        svl.progressPov = new ProgressPov($);
        svl.pointCloud = new PointCloud($, {panoIds: [panoId]});


        svl.form.disableSubmit();
        svl.tracker.push('TaskStart');
      //
      // Set map parameters and instantiate it.
      var mapParam = {};
      mapParam.canvas = svl.canvas;
      mapParam.overlayMessageBox = svl.overlayMessageBox;



      var task = null;
      var nearbyPanoIds = [];
      var totalTaskCount = -1;
      var taskPanoramaId = '';
      var taskRemaining = -1;
      var taskCompleted = -1;
      var isFirstTask = false;

      totalTaskCount = 1; // taskSpecification.numAllTasks;
      taskRemaining = 1; // taskSpecification.numTasksRemaining;
      taskCompleted = totalTaskCount - taskRemaining;
      currentProgress = taskCompleted / totalTaskCount;

      svl.form.setTaskRemaining(taskRemaining);
      svl.form.setTaskDescription('TestTask');
      svl.form.setTaskPanoramaId(panoId);
      SVLat = parseFloat(38.894799); // Todo
      SVLng = parseFloat(-77.021906); // Todo
      currentProgress = parseFloat(currentProgress);

      mapParam.Lat = SVLat;
      mapParam.Lng = SVLng;
      mapParam.panoramaPov = {
          heading: 0,
          pitch: -10,
          zoom: 1
      };
      mapParam.taskPanoId = panoId;
      nearbyPanoIds = [mapParam.taskPanoId];
      mapParam.availablePanoIds = nearbyPanoIds;

      svl.missionDescription.setCurrentStatusDescription('Your mission is to ' +
          '<span class="bold">find and label</span> presence and absence of curb ramps at intersections.');
      svl.progressFeedback.setProgress(currentProgress);
      svl.progressFeedback.setMessage("You have finished " + (totalTaskCount - taskRemaining) +
          " out of " + totalTaskCount + ".");

      if (isFirstTask) {
          svl.messageBox.setPosition(10, 120, width=400, height=undefined, background=true);
          svl.messageBox.setMessage("<span class='bold'>Remember, label all the landmarks close to the bus stop.</span> " +
              "Now the actual task begins. Click OK to start the task.");
          svl.messageBox.appendOKButton();
          svl.messageBox.show();
      } else {
          svl.messageBox.hide();
      }

      // Instantiation
      svl.map = new Map($, mapParam);
      //svl.map.setStatus('hideNonavailablePanoLinks', true);
    }

    ////////////////////////////////////////
    // Public Functions
    ////////////////////////////////////////

    _init(params);
    return self;
}
