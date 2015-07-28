var svl = svl || {};

/**
 *
 * @returns {{className: string}}
 * @constructor
 * @memberof svl
 */
function Tracker () {
    var self = {className: 'Tracker'};
    var actions = [];
    var availableActionTypes = [
        'TaskStart',
        'TaskSubmit',
        'TaskSubmitSkip',
        'Click_ModeSwitch_Walk',
        'Click_ModeSwitch_CurbRamp',
        'Click_ModeSwitch_NoCurbRamp',
        'Click_Undo',
        'Click_Redo',
        'Click_ZoomIn',
        'Click_ZoomOut',
        'Click_LabelDelete',
        'Click_LabelEdit',
        'Click_Path',
        'Click_OpenSkipWindow',
        'Click_CloseSkipWindow',
        'Click_SkipRadio',
        'LabelingCanvas_MouseUp',
        'LabelingCanvas_MouseDown',
        'LabelingCanvas_CancelLabeling',
        'LabelingCanvas_StartLabeling',
        'LabelingCanvas_FinishLabeling',
        'ViewControl_MouseDown',
        'ViewControl_MouseUp',
        'ViewControl_DoubleClick',
        'ViewControl_ZoomIn',
        'ViewControl_ZoomOut',
        'WalkTowards',
        'KeyDown',
        'KeyUp',
        'RemoveLabel',
        'Redo_AddLabel',
        'Redo_RemoveLabel',
        'Undo_AddLabel',
        'Undo_RemoveLabel',
        'MessageBox_ClickOk',
        'GoldenInsertion_Submit',
        'GoldenInsertion_ReviewLabels',
        'GoldenInsertion_ReviseFalseNegative',
        'GoldenInsertion_ReviseFalsePositive',
        'Onboarding1_Start',
        'Onboarding1_FirstCorner_IntroduceCurbRamps',
        'Onboarding1_FirstCorner_LabelTheFirstCurbRamps',
        'Onboarding1_FirstCorner_RedoLabelingTheFirstCurbRamps',
        'Onboarding1_FirstCorner_SwitchTheModeToCurbRampForLabelTheSecondCurbRamps',
        'Onboarding1_FirstCorner_LabelTheSecondCurbRamps',
        'Onboarding1_FirstCorner_RedoLabelingTheSecondCurbRamps',
        'Onboarding1_GrabAndDragToMoveToTheNextCorner',
        'Onboarding1_KeepDragging',
        'Onboarding1_SecondCorner_ModeSwitchToCurbRamps',
        'Onboarding1_SecondCorner_LabelTheCurbRamps',
        'Onboarding1_SecondCorner_RedoLabelingTheThirdCurbRamps',
        'Onboarding1_SecondCorner_IntroductionToAMissingCurbRamp',
        'Onboarding1_SecondCorner_LabelTheMissingCurbRamp',
        'Onboarding1_SecondCorner_RedoLabelingTheMissingCurbRamps',
        'Onboarding1_DoneLabelingAllTheCorners_EndLabeling',
        'Onboarding1_Submit',
        'Onboarding2_Start',
        'Onboarding2_FirstCorner_IntroduceMissingCurbRamps',
        'Onboarding2_FirstCorner_LabelTheMissingCurbRamps',
        'Onboarding2_FirstCorner_RedoLabelingTheMissingCurbRamps',
        'Onboarding2_FirstCorner_V2_LabelTheFirstMissingCurbRamps',
        'Onboarding2_FirstCorner_V2_RedoLabelingTheFirstMissingCurbRamps',
        'Onboarding2_FirstCorner_V2_ModeSwitchToMissingCurbRamp',
        'Onboarding2_FirstCorner_V2_LabelTheSecondMissingCurbRamps',
        'Onboarding2_FirstCorner_V2_RedoLabelingTheSecondMissingCurbRamps',
        'Onboarding2_FirstCorner_MissingCurbRampExampleLabels',
        'Onboarding2_GrabAndDragToTheSecondCorner',
        'Onboarding2_KeepDraggingToTheSecondCorner',
        'Onboarding2_SecondCorner_ModeSwitchToCurbRamp',
        'Onboarding2_SecondCorner_LabelTheCurbRamp',
        'Onboarding2_SecondCorner_RedoLabelingTheCurbRamps',
        'Onboarding2_SecondCorner_ExamplesOfDiagonalCurbRamps',
        'Onboarding2_RemindAboutTheCompletionRateMeter',
        'Onboarding2_GrabAndDragToTheThirdCorner',
        'Onboarding2_KeepDraggingToTheThirdCorner',
        'Onboarding2_ThirdCorner_FirstZoomIn',
        'Onboarding2_ThirdCorner_FirstModeSwitchToCurbRamp',
        'Onboarding2_ThirdCorner_LabelTheFirstCurbRamp',
        'Onboarding2_ThirdCorner_RedoLabelingTheFirstCurbRamps',
        'Onboarding2_ThirdCorner_AdjustTheCameraAngle',
        'Onboarding2_ThirdCorner_KeepAdjustingTheCameraAngle',
        'Onboarding2_ThirdCorner_SecondZoomIn',
        'Onboarding2_ThirdCorner_SecondModeSwitchToCurbRamp',
        'Onboarding2_ThirdCorner_LabelTheSecondCurbRamps',
        'Onboarding2_ThirdCorner_RedoLabelingTheSecondCurbRamps',
        'Onboarding2_ThirdCorner_FirstZoomOut',
        'Onboarding2_ThirdCorner_SecondZoomOut',
        'Onboarding2_GrabAndDragToTheFourthCorner',
        'Onboarding2_KeepDraggingToTheFourthCorner',
        'Onboarding2_FourthCorner_IntroduceOcclusion',
        'Onboarding2_DoneLabelingAllTheCorners_EndLabeling',
        'Onboarding2_Submit',
        'Onboarding3_Start',
        'Onboarding3_ShowNorthSideOfTheIntersection',
        'Onboarding3_GrabAndDrag',
        'Onboarding3_KeepDragging',
        'Onboarding3_SouthSideOfTheIntersection',
        'Onboarding3_GrabAndDragToNorth',
        'Onboarding3_ClickSkip',
        'Onboarding3_SelectSkipOption',
        'Onboarding3_ClickSkipOk',
        'Onboarding3_finalMessage',
        'Onboarding3_Submit',
        'OnboardingQuickCheck_nextClick',
        'OnboardingQuickCheck_clickQuickCheckImages',
        'OnboardingQuickCheck_submitClick',
        'OnboardingQuickCheck_submit'
    ];

    ////////////////////////////////////////////////////////////
    // Public functions
    ////////////////////////////////////////////////////////////
    self.getActions = function () {
        return actions;
    };

//    self.getAvailableActionTypes = function () {
//      var tempArray = availableActionTypes.slice(0);
//      return tempArray;
//    };

    self.push = function (action, param) {
        // This function pushes action type, time stamp, current pov, and current panoId
        // into actions list.
        var pov, latlng, panoId, note;

        if (param) {
            if (('x' in param) && ('y' in param)) {
                note = 'x:' + param.x + ',y:' + param.y;
            } else if ('TargetPanoId' in param) {
                note = param.TargetPanoId;
            } else if ('RadioValue' in param) {
                note = param.RadioValue;
            } else if ('keyCode' in param) {
                note = 'keyCode:' + param.keyCode;
            } else if ('errorType' in param) {
                note = 'errorType:' + param.errorType;
            } else if ('quickCheckImageId' in param) {
                note = param.quickCheckImageId;
            } else if ('quickCheckCorrectness' in param) {
                note = param.quickCheckCorrectness;
            } else if ('labelId' in param) {
                note = 'labelId:' + param.labelId;
            } else {
                note = "";
            }
        } else {
            note = "";
        }

        //
        // Initialize variables. Note you cannot get pov, panoid, or position
        // before the map and SV load.
        try {
            pov = svl.getPOV();
        } catch (err) {
            pov = {
                heading: null,
                pitch: null,
                zoom: null
            }
        }

        try {
            latlng = getPosition();
        } catch (err) {
            latlng = {
                lat: null,
                lng: null
            };
        }
        if (!latlng) {
            latlng = {
                lat: null,
                lng: null
            };
        }

        try {
            panoId = getPanoId();
        } catch (err) {
            panoId = null;
        }

        actions.push({
            action : action,
            gsv_panorama_id: panoId,
            lat: latlng.lat,
            lng: latlng.lng,
            heading: pov.heading,
            pitch: pov.pitch,
            zoom: pov.zoom,
            note: note,
            timestamp: new Date().toUTCString()
        });
        return this;
    };

    return self;
}
