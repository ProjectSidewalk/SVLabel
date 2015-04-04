// Todo: Kotaro should move all the core constants to this file.

var svw = svw || {};


function Main ($, param) {
    var self = {moduleName: 'MainUI'};
    var properties = {};
    var status = {};

    ////////////////////////////////////////
    // Private Functions
    ////////////////////////////////////////
    function _init (param) {
      // Instantiate objects.
      param = param || {};
      svw.ui = new UI($);
      svw.tracker = new Tracker();
      svw.keyboard = new Keyboard($);
      svw.canvas = new Canvas($);
      svw.form = new Form($, param.form);
      svw.examples = undefined
      svw.overlayMessageBox = new OverlayMessageBox($);
      svw.missionDescription = new MissionDescription($, param.missionDescription);
      svw.labeledLandmarkFeedback = new LabeledLandmarkFeedback($);
      svw.qualificationBadges = undefined;
      svw.progressFeedback = new ProgressFeedback($);
      svw.actionStack = new ActionStack($);
      svw.ribbon = new RibbonMenu($);
      svw.messageBox = new MessageBox($);
      svw.zoomControl = new ZoomControl($);
      svw.tooltip = undefined;
      svw.onboarding = undefined;
      svw.progressPov = new ProgressPov($);


      svw.form.disableSubmit();
      svw.tracker.push('TaskStart');
      //
      // Set map parameters and instantiate it.
      var mapParam = {};
      mapParam.canvas = svw.canvas;
      mapParam.overlayMessageBox = svw.overlayMessageBox;

      var SVLat;
      var SVLng;
      var currentProgress;
      var panoId = '_AUz5cV_ofocoDbesxY3Kw';

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

      svw.form.setTaskRemaining(taskRemaining);
      svw.form.setTaskDescription('TestTask');
      svw.form.setTaskPanoramaId(panoId);
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

      svw.missionDescription.setCurrentStatusDescription('Your mission is to ' +
          '<span class="bold">find and label</span> presence and absence of curb ramps at intersections.');
      svw.progressFeedback.setProgress(currentProgress);
      svw.progressFeedback.setMessage("You have finished " + (totalTaskCount - taskRemaining) +
          " out of " + totalTaskCount + ".");

      if (isFirstTask) {
          svw.messageBox.setPosition(10, 120, width=400, height=undefined, background=true);
          svw.messageBox.setMessage("<span class='bold'>Remember, label all the landmarks close to the bus stop.</span> " +
              "Now the actual task begins. Click OK to start the task.");
          svw.messageBox.appendOKButton();
          svw.messageBox.show();
      } else {
          svw.messageBox.hide();
      }

      // Instantiation
      svw.map = new Map(mapParam);
      svw.map.setStatus('hideNonavailablePanoLinks', true);
    }

    ////////////////////////////////////////
    // Public Functions
    ////////////////////////////////////////

    _init(param);
    return self;
}
