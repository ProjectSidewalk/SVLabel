var svw = svw || {};

function ActionStack ($, params) {
    var self = {
        'className' : 'ActionStack'
        };
    var properties = {};
    var status = {
            actionStackCursor : 0, // This is an index of current state in actionStack
            disableRedo : false,
            disableUndo : false
        };
    var lock = {
            disableRedo : false,
            disableUndo : false
        };
    var actionStack = [];

    // jQuery dom objects
    var $buttonRedo;
    var $buttonUndo;


    ////////////////////////////////////////
    // Private Functions
    ////////////////////////////////////////
    function init (params) {
        // Initialization function
        if (svw.ui && svw.ui.actionStack) {
          // $buttonRedo = $(params.domIds.redoButton);
          // $buttonUndo = $(params.domIds.undoButton);
          $buttonRedo = svw.ui.actionStack.redo;
          $buttonUndo = svw.ui.actionStack.undo;
          $buttonRedo.css('opacity', 0.5);
          $buttonUndo.css('opacity', 0.5);

          // Attach listeners to buttons
          $buttonRedo.bind('click', buttonRedoClick);
          $buttonUndo.bind('click', buttonUndoClick);
        }
    }


    function buttonRedoClick () {
        if (!status.disableRedo) {
          if ('tracker' in svw) {
            svw.tracker.push('Click_Redo');
          }
            self.redo();
        }
    }


    function buttonUndoClick () {
        if (!status.disableUndo) {
          if ('tracker' in svw) {
            svw.tracker.push('Click_Undo');
          }
            self.undo();
        }
    }

    ////////////////////////////////////////
    // Public methods
    ////////////////////////////////////////
    self.disableRedo = function () {
        if (!lock.disableRedo) {
            status.disableRedo = true;
            if (svw.ui && svw.ui.actionStack) {
              $buttonRedo.css('opacity', 0.5);
            }
            return this;
        } else {
            return false;
        }
    };


    self.disableUndo = function () {
        if (!lock.disableUndo) {
            status.disableUndo = true;
            if (svw.ui && svw.ui.actionStack) {
              $buttonUndo.css('opacity', 0.5);
            }
            return this;
        } else {
            return false;
        }
    };


    self.enableRedo = function () {
        if (!lock.disableRedo) {
            status.disableRedo = false;
            if (svw.ui && svw.ui.actionStack) {
              $buttonRedo.css('opacity', 1);
            }
            return this;
        } else {
            return false;
        }
    };


    self.enableUndo = function () {
        if (!lock.disableUndo) {
            status.disableUndo = false;
            if (svw.ui && svw.ui.actionStack) {
              $buttonUndo.css('opacity', 1);
            }
            return this;
        } else {
            return false;
        }
    };

    self.getStatus = function(key) {
        if (!(key in status)) {
            console.warn("You have passed an invalid key for status.")
        }
        return status[key];
    };

    self.lockDisableRedo = function () {
        lock.disableRedo = true;
        return this;
    };


    self.lockDisableUndo = function () {
        lock.disableUndo = true;
        return this;
    };


    self.pop = function () {
        // Delete the last action
        if (actionStack.length > 0) {
            status.actionStackCursor -= 1;
            actionStack.splice(status.actionStackCursor);
        }
        return this;
    };


    self.push = function (action, label) {
        var availableActionList = ['addLabel', 'deleteLabel'];
        if (availableActionList.indexOf(action) === -1) {
            throw self.className + ": Illegal action.";
        }

        var actionItem = {
            'action' : action,
            'label' : label,
            'index' : status.actionStackCursor
        };
        if (actionStack.length !== 0 &&
            actionStack.length > status.actionStackCursor) {
            // Delete all the action items after the cursor before pushing the new acitonItem
            actionStack.splice(status.actionStackCursor);
        }
        actionStack.push(actionItem);
        status.actionStackCursor += 1;
        return this;
    };


    self.redo = function () {
        // Redo an action
        if (!status.disableRedo) {
            if (actionStack.length > status.actionStackCursor) {
                var actionItem = actionStack[status.actionStackCursor];
                if (actionItem.action === 'addLabel') {
                  if ('tracker' in svw) {
                    svw.tracker.push('Redo_AddLabel', {labelId: actionItem.label.getProperty('labelId')});
                  }
                    actionItem.label.setStatus('deleted', false);
                } else if (actionItem.action === 'deleteLabel') {
                  if ('tracker' in svw) {
                    svw.tracker.push('Redo_RemoveLabel', {labelId: actionItem.label.getProperty('labelId')});
                  }
                    actionItem.label.setStatus('deleted', true);
                    actionItem.label.setVisibility('hidden');
                }
                status.actionStackCursor += 1;
            }
            if ('canvas' in svw) {
              svw.canvas.clear().render2();
            }
        }
    };

    self.size = function () {
        // return the size of the stack

        return actionStack.length;
    };

    self.undo = function () {
        // Undo an action
        if (!status.disableUndo) {
            status.actionStackCursor -= 1;
            if(status.actionStackCursor >= 0) {
                var actionItem = actionStack[status.actionStackCursor];
                if (actionItem.action === 'addLabel') {
                  if ('tracker' in svw) {
                    svw.tracker.push('Undo_AddLabel', {labelId: actionItem.label.getProperty('labelId')});
                  }
                    actionItem.label.setStatus('deleted', true);
                } else if (actionItem.action === 'deleteLabel') {
                  if ('tracker' in svw) {
                    svw.tracker.push('Undo_RemoveLabel', {labelId: actionItem.label.getProperty('labelId')});
                  }
                    actionItem.label.setStatus('deleted', false);
                    actionItem.label.setVisibility('visible');
                }
            } else {
                status.actionStackCursor = 0;
            }

            if ('canvas' in svw) {
              svw.canvas.clear().render2();
            }
        }
    };


    self.unlockDisableRedo = function () {
        lock.disableRedo = false;
        return this;
    };


    self.unlockDisableUndo = function () {
        lock.disableUndo = false;
        return this;
    };

    self.getLock = function(key) {
        if (!(key in lock)) {
          console.warn("You have passed an invalid key for status.")
        }
        return lock[key];
    }

    self.updateOpacity = function () {
        // Change opacity
        if (svw.ui && svw.ui.actionStack) {
          if (status.actionStackCursor < actionStack.length) {
              $buttonRedo.css('opacity', 1);
          } else {
              $buttonRedo.css('opacity', 0.5);
          }

          if (status.actionStackCursor > 0) {
              $buttonUndo.css('opacity', 1);
          } else {
              $buttonUndo.css('opacity', 0.5);
          }

          // if the status is set to disabled, then set the opacity of buttons to 0.5 anyway.
          if (status.disableUndo) {
              $buttonUndo.css('opacity', 0.5);
          }
          if (status.disableRedo) {
              $buttonRedo.css('opacity', 0.5);
          }
        }
    };
    ////////////////////////////////////////
    // Initialization
    ////////////////////////////////////////
    init(params);

    return self;
}

function getBusStopPositionLabel() {
    return {
        'NextToCurb' : {
            'id' : 'NextToCurb',
            'label' : 'Next to curb'
        },
        'AwayFromCurb' : {
            'id' : 'AwayFromCurb',
            'label' : 'Away from curb'
        },
        'None' : {
            'id' : 'None',
            'label' : 'Not provided'
        }
    }
}


function getHeadingEstimate(SourceLat, SourceLng, TargetLat, TargetLng) {
    // This function takes a pair of lat/lng coordinates.
    //
    if (typeof SourceLat !== 'number') {
        SourceLat = parseFloat(SourceLat);
    }
    if (typeof SourceLng !== 'number') {
        SourceLng = parseFloat(SourceLng);
    }
    if (typeof TargetLng !== 'number') {
        TargetLng = parseFloat(TargetLng);
    }
    if (typeof TargetLat !== 'number') {
        TargetLat = parseFloat(TargetLat);
    }

    var dLng = TargetLng - SourceLng;
    var dLat = TargetLat - SourceLat;

    if (dLat === 0 || dLng === 0) {
        return 0;
    }

    var angle = toDegrees(Math.atan(dLng / dLat));
    //var angle = toDegrees(Math.atan(dLat / dLng));

    return 90 - angle;
}


function getLabelCursorImagePath() {
    return {
        'Walk' : {
            'id' : 'Walk',
            'cursorImagePath' : undefined
        },
        'StopSign' : {
            'id' : 'StopSign',
            'cursorImagePath' : 'public/img/cursors/Cursor_BusStop2.png'
        },
        'StopSign_OneLeg' : {
            'id' : 'StopSign_OneLeg',
            'cursorImagePath' : 'public/img/cursors/Cursor_BusStop2.png'
        },
        'StopSign_TwoLegs' : {
            'id' : 'StopSign_TwoLegs',
            'cursorImagePath' : 'public/img/cursors/Cursor_BusStop2.png'
        },
        'StopSign_Column' : {
            'id' : 'StopSign_Column',
            'cursorImagePath' : 'public/img/cursors/Cursor_BusStop2.png'
        },
        'StopSign_None' : {
            'id' : 'StopSign_None',
            'cursorImagePath' : 'public/img/cursors/Cursor_BusStop2.png'
        },
        'Landmark_Shelter' : {
            'id' : 'Landmark_Shelter',
            'cursorImagePath' : 'public/img/cursors/Cursor_BusStopShelter2.png'
        },
        'Landmark_Bench' : {
            'id' : 'Landmark_Bench',
            'cursorImagePath' : 'public/img/cursors/Cursor_Bench2.png'
        },
        'Landmark_TrashCan' : {
            'id' : 'Landmark_TrashCan',
            'cursorImagePath' : 'public/img/cursors/Cursor_TrashCan3.png'
        },
        'Landmark_MailboxAndNewsPaperBox' : {
            'id' : 'Landmark_MailboxAndNewsPaperBox',
            'cursorImagePath' : 'public/img/cursors/Cursor_Mailbox2.png'
        },
        'Landmark_OtherPole' : {
            'id' : 'Landmark_OtherPole',
            'cursorImagePath' : 'public/img/cursors/Cursor_OtherPole.png'
        }
    }
}


//
// Returns image paths corresponding to each label type.
//
function getLabelIconImagePath(labelType) {
    return {
        'Walk' : {
            'id' : 'Walk',
            'iconImagePath' : undefined
        },
        'StopSign' : {
            'id' : 'StopSign',
            'iconImagePath' : 'public/img/icons/Icon_BusStop.png'
        },
        'StopSign_OneLeg' : {
            'id' : 'StopSign_OneLeg',
            'iconImagePath' : 'public/img/icons/Icon_BusStopSign_SingleLeg.png'
        },
        'StopSign_TwoLegs' : {
            'id' : 'StopSign_TwoLegs',
            'iconImagePath' : 'public/img/icons/Icon_BusStopSign_TwoLegged.png'
        },
        'StopSign_Column' : {
            'id' : 'StopSign_Column',
            'iconImagePath' : 'public/img/icons/Icon_BusStopSign_Column.png'
        },
        'StopSign_None' : {
            'id' : 'StopSign_None',
            'iconImagePath' : 'public/img/icons/Icon_BusStop.png'
        },
        'Landmark_Shelter' : {
            'id' : 'Landmark_Shelter',
            'iconImagePath' : 'public/img/icons/Icon_BusStopShelter.png'
        },
        'Landmark_Bench' : {
            'id' : 'Landmark_Bench',
            'iconImagePath' : 'public/img/icons/Icon_Bench.png'
        },
        'Landmark_TrashCan' : {
            'id' : 'Landmark_TrashCan',
            'iconImagePath' : 'public/img/icons/Icon_TrashCan2.png'
        },
        'Landmark_MailboxAndNewsPaperBox' : {
            'id' : 'Landmark_MailboxAndNewsPaperBox',
            'iconImagePath' : 'public/img/icons/Icon_Mailbox2.png'
        },
        'Landmark_OtherPole' : {
            'id' : 'Landmark_OtherPole',
            'iconImagePath' : 'public/img/icons/Icon_OtherPoles.png'
        }
    }
}


//
// This function is used in OverlayMessageBox.js.
//
function getLabelInstructions () {
    return {
        'Walk' : {
            'id' : 'Walk',
            'instructionalText' : 'Explore mode: Find the closest bus stop and label surrounding landmarks',
            'textColor' : 'rgba(255,255,255,1)'
        },
        'StopSign' : {
            'id' : 'StopSign',
            'instructionalText' : 'Label mode: Locate and click at the bottom of the <span class="underline">stop sign</span>',
            'textColor' : 'rgba(255,255,255,1)'
        },
        'StopSign_OneLeg' : {
            'id' : 'StopSign_OneLeg',
            'instructionalText' : 'Label mode: Locate and click at the bottom of the <span class="underline">bus stop sign</span>',
            'textColor' : 'rgba(255,255,255,1)'
        },
        'StopSign_TwoLegs' : {
            'id' : 'StopSign_TwoLegs',
            'instructionalText' :'Label mode: Locate and click at the bottom of the <span class="underline">bus stop sign</span>',
            'textColor' :'rgba(255,255,255,1)'
        },
        'StopSign_Column' : {
            'id' : 'StopSign_Column',
            'instructionalText' : 'Label mode: Locate and click at the bottom of the <span class="underline">bus stop sign</span>',
            'textColor' : 'rgba(255,255,255,1)'
        },
        'Landmark_Shelter' : {
            'id' : 'Landmark_Shelter',
            'instructionalText' : 'Label mode: Locate and click at the bottom of the <span class="underline">bus shelter</span>',
            'textColor' : 'rgba(255,255,255,1)'
        },
        'Landmark_Bench' : {
            'id' : 'Landmark_Bench',
            'instructionalText' : 'Label mode: Locate and click at the bottom of the <span class="underline">bench</span> nearby a bus stop',
            'textColor' : 'rgba(255,255,255,1)'
        },
        'Landmark_TrashCan' : {
            'id' : 'Landmark_TrashCan',
            'instructionalText' : 'Label mode: Locate and click at the bottom of the <span class="underline">trash can</span> nearby a bus stop',
            'textColor' : 'rgba(255,255,255,1)'
        },
        'Landmark_MailboxAndNewsPaperBox' : {
            'id' : 'Landmark_MailboxAndNewsPaperBox',
            'instructionalText' : 'Label mode: Locate and click at the bottom of the <span class="underline">mailbox or news paper box</span> nearby a bus stop',
            'textColor' : 'rgba(255,255,255,1)'
        },
        'Landmark_OtherPole' : {
            'id' : 'Landmark_OtherPole',
            'instructionalText' : 'Label mode: Locate and click at the bottom of poles such as <span class="underline bold">traffic sign, traffic light, and light pole</span> nearby a bus stop',
            'textColor' : 'rgba(255,255,255,1)'
        }
    }
}

function getRibbonConnectionPositions () {
    return {
        'Walk' : {
            'id' : 'Walk',
            'text' : 'Walk',
            'labelRibbonConnection' : '25px'
        },
        'StopSign' : {
            'id' : 'StopSign',
            'text' : 'Stop Sign',
            'labelRibbonConnection' : '112px'
        },
        'StopSign_OneLeg' : {
            'id' : 'StopSign_OneLeg',
            'text' : 'One-leg Stop Sign',
            'labelRibbonConnection' : '112px'
        },
        'StopSign_TwoLegs' : {
            'id' : 'StopSign_TwoLegs',
            'text' : 'Two-leg Stop Sign',
            'labelRibbonConnection' : '112px'
        },
        'StopSign_Column' : {
            'id' : 'StopSign_Column',
            'text' : 'Column Stop Sign',
            'labelRibbonConnection' : '112px'
        },
        'Landmark_Shelter' : {
            'id' : 'Landmark_Shelter',
            'text' : 'Bus Shelter',
            'labelRibbonConnection' : '188px'
        },
        'Landmark_Bench' : {
            'id' : 'Landmark_Bench',
            'text' : 'Bench',
            'labelRibbonConnection' : '265px'
        },
        'Landmark_TrashCan' : {
            'id' : 'Landmark_TrashCan',
            'text' : 'Trash Can',
            'labelRibbonConnection' : '338px'
        },
        'Landmark_MailboxAndNewsPaperBox' : {
            'id' : 'Landmark_MailboxAndNewsPaperBox',
            'labelRibbonConnection' : '411px'
        },
        'Landmark_OtherPole' : {
            'id' : 'Landmark_OtherPole',
            'labelRibbonConnection' : '484px'
        }
    }
}

// Colors selected from
// http://colorbrewer2.org/
// - Number of data classes: 4
// - The nature of data: Qualitative
// - Color scheme 1: Paired - (166, 206, 227), (31, 120, 180), (178, 223, 138), (51, 160, 44)
// - Color scheme 2: Set2 - (102, 194, 165), (252, 141, 98), (141, 160, 203), (231, 138, 195)
// I'm currently using Set 2
function getLabelDescriptions () {
    return {
        'Walk' : {
            'id' : 'Walk',
            'text' : 'Walk'
        },
        'StopSign' : {
            'id' : 'StopSign',
            'text' : 'Bus Stop Sign'
        },
        'StopSign_OneLeg' : {
            'id' : 'StopSign_OneLeg',
            'text' : 'One-leg Stop Sign'
        },
        'StopSign_TwoLegs' : {
            'id' : 'StopSign_TwoLegs',
            'text' : 'Two-leg Stop Sign'
        },
        'StopSign_Column' : {
            'id' : 'StopSign_Column',
            'text' : 'Column Stop Sign'
        },
        'StopSign_None' : {
            'id' : 'StopSign_None',
            'text' : 'Not provided'
        },
        'Landmark_Shelter' : {
            'id' : 'Landmark_Shelter',
            'text' : 'Bus Stop Shelter'
        },
        'Landmark_Bench' : {
            'id' : 'Landmark_Bench',
            'text' : 'Bench'
        },
        'Landmark_TrashCan' : {
            'id' : 'Landmark_TrashCan',
            'text' : 'Trash Can / Recycle Can'
        },
        'Landmark_MailboxAndNewsPaperBox' : {
            'id' : 'Landmark_MailboxAndNewsPaperBox',
            'text' : 'Mailbox / News Paper Box'
        },
        'Landmark_OtherPole' : {
            'id' : 'Landmark_OtherPole',
            'text' : 'Traffic Sign / Pole'
        }
    }
}

function getLabelColors () {
    return colorScheme2();
}

function colorScheme1 () {
    return {
        'Walk' : {
            'id' : 'Walk',
            'fillStyle' : 'rgba(0, 0, 0, 0.9)'
        },
        'StopSign' : {
            'id' : 'StopSign',
            'fillStyle' : 'rgba(102, 194, 165, 0.9)'
        },
        'StopSign_OneLeg' : {
            'id' : 'StopSign_OneLeg',
            'fillStyle' : 'rgba(102, 194, 165, 0.9)'
        },
        'StopSign_TwoLegs' : {
            'id' : 'StopSign_TwoLegs',
            'fillStyle' : 'rgba(102, 194, 165, 0.9)'
        },
        'StopSign_Column' : {
            'id' : 'StopSign_Column',
            'fillStyle' : 'rgba(102, 194, 165, 0.9)'
        },
        'StopSign_None' : {
            'id' : 'StopSign_None',
            'fillStyle' : 'rgba(102, 194, 165, 0.9'
        },
        'Landmark_Shelter' : {
            'id' : 'Landmark_Shelter',
            'fillStyle' : 'rgba(252, 141, 98, 0.9)'
        },
        'Landmark_Bench' : {
            'id' : 'Landmark_Bench',
            'fillStyle' : 'rgba(141, 160, 203, 0.9)'
        },
        'Landmark_TrashCan' : {
            'id' : 'Landmark_TrashCan',
            'fillStyle' : 'rgba(231, 138, 195, 0.9)'
        }
    }
}

//
// http://www.colourlovers.com/business/trends/branding/7880/Papeterie_Haute-Ville_Logo
function colorScheme2 () {
    return {
        'Walk' : {
            'id' : 'Walk',
            'fillStyle' : 'rgba(0, 0, 0, 0.9)'
        },
        'StopSign' : {
            'id' : 'StopSign',
            'fillStyle' : 'rgba(0, 161, 203, 0.9)'
        },
        'StopSign_OneLeg' : {
            'id' : 'StopSign_OneLeg',
            'fillStyle' : 'rgba(0, 161, 203, 0.9)'
        },
        'StopSign_TwoLegs' : {
            'id' : 'StopSign_TwoLegs',
            'fillStyle' : 'rgba(0, 161, 203, 0.9)'
        },
        'StopSign_Column' : {
            'id' : 'StopSign_Column',
            'fillStyle' : 'rgba(0, 161, 203, 0.9)'
        },
        'Landmark_Shelter' : {
            'id' : 'Landmark_Shelter',
            'fillStyle' : 'rgba(215, 0, 96, 0.9)'
        },
        'Landmark_Bench' : {
            'id' : 'Landmark_Bench',
            // 'fillStyle' : 'rgba(229, 64, 40, 0.9)' // Kind of hard to distinguish from pink
            // 'fillStyle' : 'rgba(209, 209, 2, 0.9)' // Puke-y
            'fillStyle' : 'rgba(252, 217, 32, 0.9)'
        },
        'Landmark_TrashCan' : {
            'id' : 'Landmark_TrashCan',
            'fillStyle' : 'rgba(97, 174, 36, 0.9)'
        },
        'Landmark_MailboxAndNewsPaperBox' : {
            'id' : 'Landmark_MailboxAndNewsPaperBox',
            'fillStyle' : 'rgba(67, 113, 190, 0.9)'
        },
        'Landmark_OtherPole' : {
            'id' : 'Landmark_OtherPole',
            'fillStyle' : 'rgba(249, 79, 101, 0.9)'
        }
    }
}

//
//http://www.colourlovers.com/fashion/trends/street-fashion/7896/Floral_Much
function colorScheme3 () {
    return {
        'Walk' : {
            'id' : 'Walk',
            'fillStyle' : 'rgba(0, 0, 0, 0.9)'
        },
        'StopSign' : {
            'id' : 'StopSign',
            'fillStyle' : 'rgba(97, 210, 214, 0.9)'
        },
        'StopSign_OneLeg' : {
            'id' : 'StopSign_OneLeg',
            'fillStyle' : 'rgba(97, 210, 214, 0.9)'
        },
        'StopSign_TwoLegs' : {
            'id' : 'StopSign_TwoLegs',
            'fillStyle' : 'rgba(97, 210, 214, 0.9)'
        },
        'StopSign_Column' : {
            'id' : 'StopSign_Column',
            'fillStyle' : 'rgba(97, 210, 214, 0.9)'
        },
        'Landmark_Shelter' : {
            'id' : 'Landmark_Shelter',
            'fillStyle' : 'rgba(237, 20, 111, 0.9)'
        },
        'Landmark_Bench' : {
            'id' : 'Landmark_Bench',
            'fillStyle' : 'rgba(237, 222, 69, 0.9)'
        },
        'Landmark_TrashCan' : {
            'id' : 'Landmark_TrashCan',
            'fillStyle' : 'rgba(155, 240, 233, 0.9)'
        }
    }
}

//
// http://www.colourlovers.com/business/trends/branding/7884/Small_Garden_Logo
function colorScheme4 () {
    return {
        'Walk' : {
            'id' : 'Walk',
            'fillStyle' : 'rgba(0, 0, 0, 0.9)'
        },
        'StopSign' : {
            'id' : 'StopSign',
            'fillStyle' : 'rgba(252, 217, 32, 0.9)'
        },
        'StopSign_OneLeg' : {
            'id' : 'StopSign_OneLeg',
            'fillStyle' : 'rgba(252, 217, 32, 0.9)'
        },
        'StopSign_TwoLegs' : {
            'id' : 'StopSign_TwoLegs',
            'fillStyle' : 'rgba(252, 217, 32, 0.9)'
        },
        'StopSign_Column' : {
            'id' : 'StopSign_Column',
            'fillStyle' : 'rgba(252, 217, 32, 0.9)'
        },
        'Landmark_Shelter' : {
            'id' : 'Landmark_Shelter',
            'fillStyle' : 'rgba(229, 59, 81, 0.9)'
        },
        'Landmark_Bench' : {
            'id' : 'Landmark_Bench',
            'fillStyle' : 'rgba(60, 181, 181, 0.9)'
        },
        'Landmark_TrashCan' : {
            'id' : 'Landmark_TrashCan',
            'fillStyle' : 'rgba(236, 108, 32, 0.9)'
        }
    }
}

//
// http://www.colourlovers.com/business/trends/branding/7874/ROBAROV_WEBDESIGN
function colorScheme5 () {
    return {
        'Walk' : {
            'id' : 'Walk',
            'fillStyle' : 'rgba(0, 0, 0, 0.9)'
        },
        'StopSign' : {
            'id' : 'StopSign',
            'fillStyle' : 'rgba(208, 221, 43, 0.9)'
        },
        'StopSign_OneLeg' : {
            'id' : 'StopSign_OneLeg',
            'fillStyle' : 'rgba(208, 221, 43, 0.9)'
        },
        'StopSign_TwoLegs' : {
            'id' : 'StopSign_TwoLegs',
            'fillStyle' : 'rgba(208, 221, 43, 0.9)'
        },
        'StopSign_Column' : {
            'id' : 'StopSign_Column',
            'fillStyle' : 'rgba(208, 221, 43, 0.9)'
        },
        'Landmark_Shelter' : {
            'id' : 'Landmark_Shelter',
            'fillStyle' : 'rgba(152, 199, 61, 0.9)'
        },
        'Landmark_Bench' : {
            'id' : 'Landmark_Bench',
            'fillStyle' : 'rgba(0, 169, 224, 0.9)'
        },
        'Landmark_TrashCan' : {
            'id' : 'Landmark_TrashCan',
            'fillStyle' : 'rgba(103, 205, 220, 0.9)'
        }
    }
}

//
//http://www.colourlovers.com/print/trends/magazines/7834/Print_Design_Annual_2010
function colorScheme6 () {
    return {
        'Walk' : {
            'id' : 'Walk',
            'fillStyle' : 'rgba(0, 0, 0, 0.9)'
        },
        'StopSign' : {
            'id' : 'StopSign',
            'fillStyle' : 'rgba(210, 54, 125, 0.9)'
        },
        'StopSign_OneLeg' : {
            'id' : 'StopSign_OneLeg',
            'fillStyle' : 'rgba(210, 54, 125, 0.9)'
        },
        'StopSign_TwoLegs' : {
            'id' : 'StopSign_TwoLegs',
            'fillStyle' : 'rgba(210, 54, 125, 0.9)'
        },
        'StopSign_Column' : {
            'id' : 'StopSign_Column',
            'fillStyle' : 'rgba(210, 54, 125, 0.9)'
        },
        'Landmark_Shelter' : {
            'id' : 'Landmark_Shelter',
            'fillStyle' : 'rgba(188, 160, 0, 0.9)'
        },
        'Landmark_Bench' : {
            'id' : 'Landmark_Bench',
            'fillStyle' : 'rgba(207, 49, 4, 0.9)'
        },
        'Landmark_TrashCan' : {
            'id' : 'Landmark_TrashCan',
            'fillStyle' : 'rgba(1, 142, 74, 0.9)'
        }
    }
}

////////////////////////////////////////////////////////////////////////////////
// Global variables
////////////////////////////////////////////////////////////////////////////////
// var canvasWidth = 720;
// var canvasHeight = 480;
// var svImageHeight = 6656;
// var svImageWidth = 13312;

// Image distortion coefficient. Need to figure out how to compute these.
// It seems like these constants do not depend on browsers... (tested on Chrome, Firefox, and Safari.)
// Distortion coefficient for a window size 640x360: var alpha_x = 5.2, alpha_y = -5.25;
// Distortion coefficient for a window size 720x480:
var svw = svw || {}; // Street View Walker namespace.
svw.canvasWidth = 720;
svw.canvasHeight = 480;
svw.svImageHeight = 6656;
svw.svImageWidth = 13312;
svw.alpha_x = 4.6;
svw.alpha_y = -4.65;
svw._labelCounter = 0;
svw.getLabelCounter = function () {
    return svw._labelCounter++;
};

////////////////////////////////////////////////////////////////////////////////
// Canvas Class Constructor
////////////////////////////////////////////////////////////////////////////////
function Canvas ($, param) {
    var oPublic = {
            className : 'Canvas',
            testCases: {}};

        // Mouse status and mouse event callback functions
    var mouseStatus = {
            currX:0,
            currY:0,
            prevX:0,
            prevY:0,
            leftDownX:0,
            leftDownY:0,
            leftUpX:0,
            leftUpY:0,
            isLeftDown: false,
            prevMouseDownTime : 0,
            prevMouseUpTime : 0
        };
        // Properties
    var properties = {
        evaluationMode: false,
        radiusThresh: 7,
        showDeleteMenuTimeOutToken : undefined,
        tempPointRadius: 5
    };

    var pointParameters = {
        'fillStyleInnerCircle' : 'rgba(0,0,0,1)', // labelColor.fillStyle,
        'lineWidthOuterCircle' : 2,
        'iconImagePath' : undefined, // iconImagePath,
        'radiusInnerCircle' : 5, //13,
        'radiusOuterCircle' : 6, //14,
        'strokeStyleOuterCircle' : 'rgba(255,255,255,1)',
        'storedInDatabase' : false
    };

    var status = {
        'currentLabel' : null,
        'disableLabelDelete' : false,
        'disableLabelEdit' : false,
        'disableLabeling' : false,
        'disableWalking' : false,
        'drawing' : false,
        'lockCurrentLabel' : false,
        'lockDisableLabelDelete' : false,
        'lockDisableLabelEdit' : false,
        'lockDisableLabeling' : false,
        svImageCoordinatesAdjusted: false,
        totalLabelCount: 0,
        'visibilityMenu' : 'hidden'
    };

    var lock = {
        showLabelTag: false
    };


    // Canvas context
    var canvasProperties = {'height':0, 'width':0};
    var ctx;

    var tempPath = [];

    // Right click menu
    var rightClickMenu = undefined;

    // Path elements
    var systemLabels = [];
    var labels = [];

    // jQuery doms
    var $canvas = $("#labelCanvas").length === 0 ? null : $("#labelCanvas");
    var $divLabelDrawingLayer = $("div#labelDrawingLayer").length === 0 ? null : $("div#labelDrawingLayer");
    var $divHolderLabelDeleteIcon = $("#Holder_LabelDeleteIcon").length === 0 ? null : $("#Holder_LabelDeleteIcon");
    var $divHolderLabelEditIcon = $("#Holder_LabelEditIcon").length === 0 ? null : $("#Holder_LabelEditIcon");
    var $labelDeleteIcon = $("#LabelDeleteIcon").length === 0 ? null : $("#LabelDeleteIcon");

    ////////////////////////////////////////
    // Private Functions
    ////////////////////////////////////////
    // Initialization
    function _init (param) {
        var el = document.getElementById("label-canvas");
        ctx = el.getContext('2d');
        canvasProperties.width = el.width;
        canvasProperties.height = el.height;

        if (param && 'evaluationMode' in param) {
            properties.evaluationMode = param.evaluationMode;
        }

        // Attach listeners to dom elements
        if ($divLabelDrawingLayer) {
          $divLabelDrawingLayer.bind('mousedown', drawingLayerMouseDown);
          $divLabelDrawingLayer.bind('mouseup', drawingLayerMouseUp);
          $divLabelDrawingLayer.bind('mousemove', drawingLayerMouseMove);
        }
        if ($labelDeleteIcon) {
          $labelDeleteIcon.bind("click", labelDeleteIconClick);
        }
    }

    function closeLabelPath() {
        svw.tracker.push('LabelingCanvas_FinishLabeling');
        var labelType = svw.ribbon.getStatus('selectedLabelType');
        var labelColor = getLabelColors()[labelType];
        var labelDescription = getLabelDescriptions()[svw.ribbon.getStatus('selectedLabelType')];
        var iconImagePath = getLabelIconImagePath()[labelDescription.id].iconImagePath;

        pointParameters.fillStyleInnerCircle = labelColor.fillStyle;
        pointParameters.iconImagePath = iconImagePath;

        var pathLen = tempPath.length;
        var points = [];
        var pov = svw.getPOV();
        var i;

        for (i = 0; i < pathLen; i++) {
            points.push(new Point(tempPath[i].x, tempPath[i].y, pov, pointParameters));
        }
        var path = new Path(points, {});
        var latlng = getPosition();
        var param = {
            canvasWidth: svw.canvasWidth,
            canvasHeight: svw.canvasHeight,
            canvasDistortionAlphaX: svw.alpha_x,
            canvasDistortionAlphaY: svw.alpha_y,
            labelId: svw.getLabelCounter(),
            labelType: labelDescription.id,
            labelDescription: labelDescription.text,
            labelFillStyle: labelColor.fillStyle,
            panoId: getPanoId(),
            panoramaLat: latlng.lat,
            panoramaLng: latlng.lng,
            panoramaHeading: pov.heading,
            panoramaPitch: pov.pitch,
            panoramaZoom: pov.zoom,
            svImageWidth: svw.svImageWidth,
            svImageHeight: svw.svImageHeight,
            svMode: 'html4'
        };
        if (("panorama" in svw) && ("getPhotographerPov" in svw.panorama)) {
            var photographerPov = svw.panorama.getPhotographerPov();
            param.photographerHeading = photographerPov.heading;
            param.photographerPitch = photographerPov.pitch;
        }

        var label = Label(path, param);
        if (label) {
            status.currentLabel = new Label(path, param)
            labels.push(status.currentLabel);
            svw.actionStack.push('addLabel', status.currentLabel);
        } else {
            throw "Failed to add a new label.";
        }

        // Initialize the tempPath
        tempPath = [];
        svw.ribbon.backToWalk();

        //
        // Review label correctness if this is a ground truth insertion task.
        if (("goldenInsertion" in svw) &&
            svw.goldenInsertion &&
            svw.goldenInsertion.isRevisingLabels()) {
            svw.goldenInsertion.reviewLabels();
        }
    }

    function drawingLayerMouseDown (e) {
        // This function is fired when at the time of mouse-down
        mouseStatus.isLeftDown = true;
        mouseStatus.leftDownX = mouseposition(e, this).x;
        mouseStatus.leftDownY = mouseposition(e, this).y;

        if (!properties.evaluationMode) {
            svw.tracker.push('LabelingCanvas_MouseDown', {x: mouseStatus.leftDownX, y: mouseStatus.leftDownY});
        }

        mouseStatus.prevMouseDownTime = new Date().getTime();
    }

    function drawingLayerMouseUp (e) {
        // This function is fired when at the time of mouse-up
        var currTime;

        mouseStatus.isLeftDown = false;
        mouseStatus.leftUpX = mouseposition(e, this).x;
        mouseStatus.leftUpY = mouseposition(e, this).y;

        currTime = new Date().getTime();

        if (!properties.evaluationMode) {
            if (!status.disableLabeling &&
                currTime - mouseStatus.prevMouseUpTime > 300) {
                // currTime - mouseStatus.prevMouseDownTime < 400) {
                ///!isOn(mouseStatus.leftUpX, mouseStatus.leftUpY)) {
                // This part is executed by a single click
                var iconImagePath;
                var label;
                var latlng;
                var pointParameters;
                var labelColor;
                var labelDescription;

                if (svw.ribbon) {
                    // labelColor = getLabelColors()[svw.ribbon.getStatus('selectedLabelType')];
                    var labelType = svw.ribbon.getStatus('selectedLabelType');
                    var labelDescriptions = getLabelDescriptions();
                    labelDescription = labelDescriptions[labelType];
                    // iconImagePath = getLabelIconImagePath()[labelDescription.id].iconImagePath;

                    // Define point parameters to draw

                    if (!status.drawing) {
                        // Start drawing a path if a user hasn't started to do so.
                        status.drawing = true;
                        if ('tracker' in svw && svw.tracker) {
                            svw.tracker.push('LabelingCanvas_StartLabeling');
                        }

                        var point = {x: mouseStatus.leftUpX, y: mouseStatus.leftUpY};
                        tempPath.push(point);
                    } else {
                        // Close the current path if there are more than 2 points in the tempPath and
                        // the user clicks on a point near the initial point.
                        var closed = false;
                        var pathLen = tempPath.length;
                        if (pathLen > 2) {
                            var r = Math.sqrt(Math.pow((tempPath[0].x - mouseStatus.leftUpX), 2) + Math.pow((tempPath[0].y - mouseStatus.leftUpY), 2));
                            if (r < properties.radiusThresh) {
                                closed = true;
                                status.drawing = false;
                                closeLabelPath();
                            }
                        }

                        //
                        // Otherwise add a new point
                        if (!closed) {
                            var point = {x: mouseStatus.leftUpX, y: mouseStatus.leftUpY};
                            tempPath.push(point);
                        }
                    }
                } else {
                    throw oPublic.className + ' drawingLayerMouseUp(): ribbon not defined.';
                }

                oPublic.clear();
                oPublic.setVisibilityBasedOnLocation('visible', getPanoId());
                oPublic.render2();
            } else if (currTime - mouseStatus.prevMouseUpTime < 400) {
                // This part is executed for a double click event
                // If the current status.drawing = true, then close the current path.
                var pathLen = tempPath.length;
                if (status.drawing && pathLen > 2) {
                    status.drawing = false;

                    closeLabelPath();
                    oPublic.clear();
                    oPublic.setVisibilityBasedOnLocation('visible', getPanoId());
                    oPublic.render2();
                }
            }
        } else {
            // If it is an evaluation mode, do... (nothing)
        }

        svw.tracker.push('LabelingCanvas_MouseUp', {x: mouseStatus.leftUpX, y: mouseStatus.leftUpY});
        mouseStatus.prevMouseUpTime = new Date().getTime();
        mouseStatus.prevMouseDownTime = 0;
    }

    function drawingLayerMouseMove (e) {
        // This function is fired when mouse cursor moves
        // over the drawing layer.
        var mousePosition = mouseposition(e, this);
        mouseStatus.currX = mousePosition.x;
        mouseStatus.currY = mousePosition.y;

        // Change a cursor according to the label type.
        // $(this).css('cursor', )
        if ('ribbon' in svw) {
            var cursorImagePaths = svw.misc.getLabelCursorImagePath();
            var labelType = svw.ribbon.getStatus('mode');
            if (labelType) {
                var cursorImagePath = cursorImagePaths[labelType].cursorImagePath;
                var cursorUrl = "url(" + cursorImagePath + ") 6 25, auto";

                if (rightClickMenu && rightClickMenu.isAnyOpen()) {
                    cursorUrl = 'default';
                }

                $(this).css('cursor', cursorUrl);
            }
        } else {
            throw oPublic.className + ': Import the RibbonMenu.js and instantiate it!';
        }


        if (!status.drawing) {
            var ret = isOn(mouseStatus.currX, mouseStatus.currY);
            if (ret && ret.className === 'Path') {
                oPublic.showLabelTag(status.currentLabel);
                ret.renderBoundingBox(ctx);
            } else {
                oPublic.showLabelTag(undefined);
            }
        }
        oPublic.clear();
        oPublic.render2();
        mouseStatus.prevX = mouseposition(e, this).x;
        mouseStatus.prevY = mouseposition(e, this).y;
    }

    function imageCoordinates2String (coordinates) {
        if (!(coordinates instanceof Array)) {
            throw oPublic.className + '.imageCoordinates2String() expects Array as an input';
        }
        if (coordinates.length === 0) {
            throw oPublic.className + '.imageCoordinates2String(): Empty array';
        }
        var ret = '';
        var i ;
        var len = coordinates.length;

        for (i = 0; i < len; i += 1) {
            ret += parseInt(coordinates[i].x) + ' ' + parseInt(coordinates[i].y) + ' ';
        }

        return ret;
    }

    function isOn (x, y) {
        // This function takes cursor coordinates x and y on the canvas.
        // Then returns an object right below the cursor.
        // If a cursor is not on anything, return false.
        var i, lenLabels, ret;
        lenLabels = labels.length;

        ret = false;
        for (i = 0; i < lenLabels; i += 1) {
            // Check labels, paths, and points to see if they are
            // under a mouse cursor
            ret = labels[i].isOn(x, y);
            if (ret) {
                status.currentLabel = labels[i];
                return ret;
            }
        }
        return false;
    }

    function labelDeleteIconClick () {
        // Deletes the current label
        if (!status.disableLabelDelete) {
            svw.tracker.push('Click_LabelDelete');
            var currLabel = oPublic.getCurrentLabel();
            if (!currLabel) {
                //
                // Sometimes (especially during ground truth insertion if you force a delete icon to show up all the time),
                // currLabel would not be set properly. In such a case, find a label underneath the delete icon.
                var x = $divHolderLabelDeleteIcon.css('left');
                var y = $divHolderLabelDeleteIcon.css('top');
                x = x.replace("px", "");
                y = y.replace("px", "");
                x = parseInt(x, 10) + 5;
                y = parseInt(y, 10) + 5;
                var item = isOn(x, y);
                if (item && item.className === "Point") {
                    var path = item.belongsTo();
                    currLabel = path.belongsTo();
                } else if (item && item.className === "Label") {
                    currLabel = item;
                } else if (item && item.className === "Path") {
                    currLabel = item.belongsTo();
                }
            }

            if (currLabel) {
                oPublic.removeLabel(currLabel);
                svw.actionStack.push('deleteLabel', oPublic.getCurrentLabel());
                $divHolderLabelDeleteIcon.css('visibility', 'hidden');
                // $divHolderLabelEditIcon.css('visibility', 'hidden');


                //
                // If showLabelTag is blocked by GoldenInsertion (or by any other object), unlock it as soon as
                // a label is deleted.
                if (lock.showLabelTag) {
                    oPublic.unlockShowLabelTag();
                }
            }
        }
    }

    function renderTempPath() {
        // This method renders a line from the last point in tempPath to current mouse point.

        if (!svw.ribbon) {
            // return if the ribbon menu is not correctly loaded.
            return false;
        }

        var i = 0;
        var pathLen = tempPath.length;
        var labelColor = getLabelColors()[svw.ribbon.getStatus('selectedLabelType')];

        var pointFill = labelColor.fillStyle;
        pointFill = svw.util.color.changeAlphaRGBA(pointFill, 0.5);


        // Draw the first line.
        ctx.strokeStyle = 'rgba(255,255,255,1)';
        ctx.lineWidth = 2;
        if (pathLen > 1) {
            var curr = tempPath[1];
            var prev = tempPath[0];
            var r = Math.sqrt(Math.pow((tempPath[0].x - mouseStatus.currX), 2) + Math.pow((tempPath[0].y - mouseStatus.currY), 2));

            // Change the circle radius of the first point depending on the distance between a mouse cursor and the point coordinate.
            if (r < properties.radiusThresh && pathLen > 2) {
                svw.util.shape.lineWithRoundHead(ctx, prev.x, prev.y, 2 * properties.tempPointRadius, curr.x, curr.y, properties.tempPointRadius, 'both', 'rgba(255,255,255,1)', pointFill, 'none', 'rgba(255,255,255,1)', pointFill);
            } else {
                svw.util.shape.lineWithRoundHead(ctx, prev.x, prev.y, properties.tempPointRadius, curr.x, curr.y, properties.tempPointRadius, 'both', 'rgba(255,255,255,1)', pointFill, 'none', 'rgba(255,255,255,1)', pointFill);
            }
        }

        // Draw the lines in between
        for (i = 2; i < pathLen; i++) {
            var curr = tempPath[i];
            var prev = tempPath[i-1];
            svw.util.shape.lineWithRoundHead(ctx, prev.x, prev.y, 5, curr.x, curr.y, 5, 'both', 'rgba(255,255,255,1)', pointFill, 'none', 'rgba(255,255,255,1)', pointFill);
        }

        if (r < properties.radiusThresh && pathLen > 2) {
            svw.util.shape.lineWithRoundHead(ctx, tempPath[pathLen-1].x, tempPath[pathLen-1].y, properties.tempPointRadius, tempPath[0].x, tempPath[0].y, 2 * properties.tempPointRadius, 'both', 'rgba(255,255,255,1)', pointFill, 'none', 'rgba(255,255,255,1)', pointFill);
        } else {
            svw.util.shape.lineWithRoundHead(ctx, tempPath[pathLen-1].x, tempPath[pathLen-1].y, properties.tempPointRadius, mouseStatus.currX, mouseStatus.currY, properties.tempPointRadius, 'both', 'rgba(255,255,255,1)', pointFill, 'stroke', 'rgba(255,255,255,1)', pointFill);
        }
        return;
    }

    ////////////////////////////////////////
    // Public Functions
    ////////////////////////////////////////
    oPublic.cancelDrawing = function () {
        // This method clears a tempPath and cancels drawing. This method is called by Keyboard when esc is pressed.
        if ('tracker' in svw && svw.tracker) {
            svw.tracker.push("LabelingCanvas_CancelLabeling");
        }

        tempPath = [];
        status.drawing = false;
        oPublic.clear().render2();
        return this;
    };

    oPublic.clear = function () {
        // Clears the canvas
        if (ctx) {
          ctx.clearRect(0, 0, canvasProperties.width, canvasProperties.height);
        } else {
          console.warn('The ctx is not set.')
        }
        return this;
    };

    oPublic.disableLabelDelete = function () {
        if (!status.lockDisableLabelDelete) {
            status.disableLabelDelete = true;
            return this;
        }
        return false;
    };

    oPublic.disableLabelEdit = function () {
       if (!status.lockDisableLabelEdit) {
           status.disableLabelEdit = true;
           return this;
       }
       return false;
    };

    oPublic.disableLabeling = function () {
        // Check right-click-menu visibility
        // If any of menu is visible, disable labeling
        if (!status.lockDisableLabeling) {
            status.disableLabeling = true;
            /*
            var menuOpen = rightClickMenu.isAnyOpen();
            if (menuOpen) {
                status.disableLabeling = true;
            } else {
                status.disableLabeling = false;
            }
            */
            return this;
        }
        return false;
    };

    // oPublic.disableMenuClose = function () {
    //     if (rightClickMenu) {
    //         rightClickMenu.disableMenuClose();
    //     }
    //     return this;
    // };
    //
    // oPublic.disableMenuSelect = function ()  {
    //     if (rightClickMenu) {
    //         rightClickMenu.disableMenuSelect();
    //     }
    //     return this;
    // };

    oPublic.enableLabelDelete = function () {
        if (!status.lockDisableLabelDelete) {
            status.disableLabelDelete = false;
            return this;
        }
        return false;
    };

    oPublic.enableLabelEdit = function () {
        if (!status.lockDisableLabelEdit) {
            status.disableLabelEdit = false;
            return this;
        }
        return false;
    };

    oPublic.enableLabeling = function () {
        // Check right-click-menu visiibliey
        // If all of the right click menu are hidden,
        // enable labeling
        if (!status.lockDisableLabeling) {
            status.disableLabeling = false;
            return this;
        }
        return false;
    };

    oPublic.getCurrentLabel = function () {
        return status.currentLabel;
    };

    oPublic.getLabels = function (target) {
        // This method returns a deepcopy of labels stored in this canvas.
        if (!target) {
            target = 'user';
        }

        if (target === 'system') {
            return oPublic.getSystemLabels(false);
            // return $.extend(true, [], systemLabels);
        } else {
            return oPublic.getUserLabels(false);
            // $.extend(true, [], labels);
        }
    };

    oPublic.getLock = function (key) {
      return lock[key];
    };

    oPublic.getNumLabels = function () {
        var len = labels.length;
        var i;
        var total = 0;
        for (i =0; i < len; i++) {
            if (!labels[i].isDeleted() && labels[i].isVisible()) {
                total++;
            }
        }
        return total;
    };

    // oPublic.getRightClickMenu = function () {
    //     return rightClickMenu;
    // };

    oPublic.getStatus = function (key) {
      if (!(key in status)) {
        console.warn("You have passed an invalid key for status.")
      }
        return status[key];
    };

    oPublic.getSystemLabels = function (reference) {
        // This method returns system labels. If refrence is true, then it returns reference to the labels.
        // Otherwise it returns deepcopy of labels.
        if (!reference) {
            reference = false;
        }

        if (reference) {
            return systemLabels;
        } else {
            return $.extend(true, [], systemLabels);
        }
    };

    oPublic.getUserLabelCount = function () {
        var labels = oPublic.getUserLabels();
        labels = labels.filter(function (label) {
            return !label.isDeleted() && label.isVisible();
        })
        return labels.length;
    };

    oPublic.getUserLabels = function (reference) {
        // This method returns user labels. If reference is true, then it returns reference to the labels.
        // Otherwise it returns deepcopy of labels.
        if (!reference) {
            reference = false;
        }

        if (reference) {
            return labels;
        } else {
            return $.extend(true, [], labels);
        }
    };

    oPublic.hideDeleteLabel = function (x, y) {
        rightClickMenu.hideDeleteLabel();
        return this;
    };

    // oPublic.hideRightClickMenu = function () {
    //     rightClickMenu.hideBusStopType();
    //     rightClickMenu.hideBusStopPosition();
    //     return this;
    // };

    oPublic.insertLabel = function (labelPoints, target) {
        // This method takes a label data (i.e., a set of point coordinates, label types, etc) and
        // and insert it into the labels array so the Canvas will render it
        if (!target) {
            target = 'user';
        }

        var i;
        var labelColors = svw.misc.getLabelColors();
        var iconImagePaths = svw.misc.getIconImagePaths();
        var length = labelPoints.length;
        var pointData;
        var pov;
        var point;
        var points = [];

        for (i = 0; i < length; i += 1) {
            pointData = labelPoints[i];
            pov = {
                heading: pointData.originalHeading,
                pitch: pointData.originalPitch,
                zoom: pointData.originalZoom
            };
            point = new Point();

            if ('PhotographerHeading' in pointData && pointData.PhotographerHeading &&
                'PhotographerPitch' in pointData && pointData.PhotographerPitch) {
                point.setPhotographerPov(parseFloat(pointData.PhotographerHeading), parseFloat(pointData.PhotographerPitch));
            }

            point.resetSVImageCoordinate({
                x: parseInt(pointData.svImageX, 10),
                y: parseInt(pointData.svImageY, 10)
            });
            point.resetProperties({
                fillStyleInnerCircle : labelColors[pointData.LabelType].fillStyle,
                lineWidthOuterCircle : 2,
                iconImagePath : iconImagePaths[pointData.LabelType].iconImagePath,
                originalCanvasCoordinate: pointData.originalCanvasCoordinate,
                originalHeading: pointData.originalHeading,
                originalPitch: pointData.originalPitch,
                originalZoom: pointData.originalZoom,
                pov: pov,
                radiusInnerCircle : 5, // 13,
                radiusOuterCircle : 6, // 14,
                strokeStyleOuterCircle : 'rgba(255,255,255,1)',
                storedInDatabase : false
            });

            points.push(point)
        }

        var param = {};
        var path;
        var labelDescriptions = svw.misc.getLabelDescriptions();

        path = new Path(points);

        param.canvasWidth = svw.canvasWidth;
        param.canvasHeight = svw.canvasHeight;
        param.canvasDistortionAlphaX = svw.alpha_x;
        param.canvasDistortionAlphaY = svw.alpha_y;
        param.labelId = labelPoints[0].LabelId;
        param.labelerId = labelPoints[0].AmazonTurkerId
        param.labelType = labelPoints[0].LabelType;
        param.labelDescription = labelDescriptions[param.labelType].text;
        param.labelFillStyle = labelColors[param.labelType].fillStyle;
        param.panoId = labelPoints[0].LabelGSVPanoramaId;
        param.panoramaLat = labelPoints[0].Lat;
        param.panoramaLng = labelPoints[0].Lng;
        param.panoramaHeading = labelPoints[0].heading;
        param.panoramaPitch = labelPoints[0].pitch;
        param.panoramaZoom = labelPoints[0].zoom;

        param.svImageWidth = svw.svImageWidth;
        param.svImageHeight = svw.svImageHeight;
        param.svMode = 'html4';

        if (("PhotographerPitch" in labelPoints[0]) && ("PhotographerHeading" in labelPoints[0])) {
            param.photographerHeading = labelPoints[0].PhotographerHeading;
            param.photographerPitch = labelPoints[0].PhotographerPitch;
        }

        var newLabel = new Label(path, param);

        if (target === 'system') {
            systemLabels.push(newLabel);
        } else {
            labels.push(newLabel);
        }
    };

    // oPublic.isBusStopLabeled = function () {
    //     var i;
    //     var isBusStopSignLabeled = false;
    //     var label;
    //     var lenLabels;
    //     lenLabels = labels.length;
    //
    //     for (i = 0; i < lenLabels; i += 1) {
    //         // Check if the label comes from current SV panorama
    //         label = labels[i];
    //         // if (!label.isDeleted() && label.getLabelType() ==="StopSign") {
    //         if (label.isVisible() && label.getLabelType() ==="StopSign") {
    //             isBusStopSignLabeled = true;
    //         }
    //     }
    //     return isBusStopSignLabeled;
    // };
    //
    // oPublic.isBusStopShelterLabeled = function () {
    //     var i;
    //     var isBusStopShelterLabeled = false;
    //     var label;
    //     var lenLabels;
    //     lenLabels = labels.length;
    //
    //     for (i = 0; i < lenLabels; i += 1) {
    //         // Check if the label comes from current SV panorama
    //         label = labels[i];
    //         // if (!label.isDeleted() && label.getLabelType() ==="StopSign") {
    //         if (label.isVisible() && label.getLabelType() ==="Landmark_Shelter") {
    //             isBusStopShelterLabeled = true;
    //         }
    //     }
    //     return isBusStopShelterLabeled;
    // };

    oPublic.isDrawing = function () {
        // This method returns the current status drawing.
        return status.drawing;
    };

    // oPublic.isEvaluationMode = function () {
    //     return properties.evaluationMode;
    // };

    oPublic.isOn = function (x, y) {
        // Get an object right below (x,y)
        return isOn(x, y);
    };

    oPublic.lockCurrentLabel = function () {
        status.lockCurrentLabel = true;;
        return this;
    };

    oPublic.lockDisableLabelDelete = function () {
        status.lockDisableLabelDelete = true;;
        return this;
    };

    oPublic.lockDisableLabelEdit = function () {
        status.lockDisableLabelEdit = true;
        return this;
    };

    oPublic.lockDisableLabeling = function () {
        status.lockDisableLabeling = true;
        return this;
    };

    // oPublic.lockDisableMenuSelect = function () {
    //     rightClickMenu.lockDisableMenuSelect();
    //     return this;
    // };

    oPublic.lockShowLabelTag = function () {
        // This method locks showLabelTag
        lock.showLabelTag = true;
        return this;
    };

    oPublic.pushLabel = function (label) {
        status.currentLabel = label;
        labels.push(label);
        if (svw.actionStack) {
            svw.actionStack.push('addLabel', label);
        }
        return this;
    };

    oPublic.removeAllLabels = function () {
        // This method removes all the labels.
        // This method is mainly for testing.
        labels = [];
        return this;
    };

    oPublic.removeLabel = function (label) {
        // This function removes a passed label and its child path and points
        // var labelIndex = labels.indexOf(label);

        if (!label) {
            return false;
        }
        svw.tracker.push('RemoveLabel', {labelId: label.getProperty('labelId')});

        label.setStatus('deleted', true);
        label.setStatus('visibility', 'hidden');
        // I do not want to actually remove this label, but set the flag as
        // deleted
        // label.removePath();
        // labels.remove(labelIndex);

        //
        // Review label correctness if this is a ground truth insertion task.
        if (("goldenInsertion" in svw) &&
            svw.goldenInsertion &&
            svw.goldenInsertion.isRevisingLabels()) {
            svw.goldenInsertion.reviewLabels();
        }

        oPublic.clear();
        oPublic.render2();
        return this;
    };

    oPublic.render = function () {
        // KH. Deprecated.
        // Renders labels and pathes (as well as points in each path.)
        var pov = svw.getPOV();
        // renderLabels(pov, ctx);
        return this;
    };

    oPublic.render2 = function () {
      if (!ctx) {
        // JavaScript warning
        // http://stackoverflow.com/questions/5188224/throw-new-warning-in-javascript
        console.warn('The ctx is not set.')
        return this;
      }
        var i;
        var label;
        var lenLabels;
        var labelCount = {
            Landmark_Bench : 0,
            Landmark_Shelter: 0,
            Landmark_TrashCan: 0,
            Landmark_MailboxAndNewsPaperBox: 0,
            Landmark_OtherPole: 0,
            StopSign : 0,
            CurbRamp: 0,
            NoCurbRamp: 0
        };
        status.totalLabelCount = 0;
        var pov = svw.getPOV();


        //
        // The image coordinates of the points in system labels shift as the projection parameters (i.e., heading and pitch) that
        // you can get from Street View API change. So adjust the image coordinate
        // Note that this adjustment happens only once
        if (!status.svImageCoordinatesAdjusted) {
            var currentPhotographerPov = svw.panorama.getPhotographerPov();
            if (currentPhotographerPov && 'heading' in currentPhotographerPov && 'pitch' in currentPhotographerPov) {
                var j;
                //
                // Adjust user labels
                lenLabels = labels.length;
                for (i = 0; i < lenLabels; i += 1) {
                    // Check if the label comes from current SV panorama
                    label = labels[i];
                    var points = label.getPoints(true)
                    var pointsLen = points.length;

                    for (j = 0; j < pointsLen; j++) {
                        var pointData = points[j].getProperties();
                        var svImageCoordinate = points[j].getGSVImageCoordinate();
                        if ('photographerHeading' in pointData && pointData.photographerHeading) {
                            var deltaHeading = currentPhotographerPov.heading - pointData.photographerHeading;
                            var deltaPitch = currentPhotographerPov.pitch - pointData.photographerPitch;
                            var x = (svImageCoordinate.x + (deltaHeading / 360) * svw.svImageWidth + svw.svImageWidth) % svw.svImageWidth;
                            var y = svImageCoordinate.y + (deltaPitch / 90) * svw.svImageHeight;
                            points[j].resetSVImageCoordinate({x: x, y: y})
                        }
                    }
                }

                //
                // Adjust system labels
                lenLabels = systemLabels.length;
                for (i = 0; i < lenLabels; i += 1) {
                    // Check if the label comes from current SV panorama
                    label = systemLabels[i];
                    var points = label.getPoints(true)
                    var pointsLen = points.length;

                    for (j = 0; j < pointsLen; j++) {
                        var pointData = points[j].getProperties();
                        var svImageCoordinate = points[j].getGSVImageCoordinate();
                        if ('photographerHeading' in pointData && pointData.photographerHeading) {
                            var deltaHeading = currentPhotographerPov.heading - pointData.photographerHeading;
                            var deltaPitch = currentPhotographerPov.pitch - pointData.photographerPitch;
                            var x = (svImageCoordinate.x + (deltaHeading / 360) * svw.svImageWidth + svw.svImageWidth) % svw.svImageWidth;
                            var y = svImageCoordinate.y + (deltaPitch / 180) * svw.svImageHeight;
                            points[j].resetSVImageCoordinate({x: x, y: y})
                        }
                    }
                }
                status.svImageCoordinatesAdjusted = true;
            }
        }

        //
        // Render user labels
        lenLabels = labels.length;
        for (i = 0; i < lenLabels; i += 1) {
            // Check if the label comes from current SV panorama
            label = labels[i];

            // If it is an evaluation mode, let a label not render a bounding box and a delete button.
            if (properties.evaluationMode) {
                label.render(ctx, pov, true);
            } else {
                label.render(ctx, pov);
            }

            if (label.isVisible() && !label.isDeleted()) {
                labelCount[label.getLabelType()] += 1;
                status.totalLabelCount += 1;
            }
        }

        //
        // Render system labels
        lenLabels = systemLabels.length;
        for (i = 0; i < lenLabels; i += 1) {
            // Check if the label comes from current SV panorama
            label = systemLabels[i];

            // If it is an evaluation mode, let a label not render a bounding box and a delete button.
            if (properties.evaluationMode) {
                label.render(ctx, pov, true);
            } else {
                label.render(ctx, pov);
            }
        }

        //
        // Draw a temporary path from the last point to where a mouse cursor is.
        if (status.drawing) {
            renderTempPath();
        }

        //
        // Check if the user audited all the angles or not.
        if ('form' in svw) {
            svw.form.checkSubmittable();
        }

        if ('progressPov' in svw) {
            svw.progressPov.updateCompletionRate();
        }

        //
        // Update the landmark counts on the right side of the interface.
        if (svw.labeledLandmarkFeedback) {
            svw.labeledLandmarkFeedback.setLabelCount(labelCount);
        }

        //
        // Update the opacity of undo and redo buttons.
        if (svw.actionStack) {
            svw.actionStack.updateOpacity();
        }

        //
        // Update the opacity of Zoom In and Zoom Out buttons.
        if (svw.zoomControl) {
            svw.zoomControl.updateOpacity();
        }

        //
        // This like of code checks if the golden insertion code is running or not.
        if ('goldenInsertion' in svw && svw.goldenInsertion) {
            svw.goldenInsertion.renderMessage();
        }
        return this;
    };

    oPublic.renderBoundingBox = function (path) {
        path.renderBoundingBox(ctx);
        return this;
    };

    oPublic.setCurrentLabel = function (label) {
        if (!status.lockCurrentLabel) {
            status.currentLabel = label;
            return this;
        }
        return false;
    };

    oPublic.setStatus = function (key, value) {
        // This function is allows other objects to access status
        // of this object
        if (key in status) {
            if (key === 'disableLabeling') {
                if (typeof value === 'boolean') {
                    if (value) {
                        oPublic.disableLabeling();
                    } else {
                        oPublic.enableLabeling();
                    }
                    return this;
                } else {
                    return false;
                }
            } else if (key === 'disableMenuClose') {
                if (typeof value === 'boolean') {
                    if (value) {
                        oPublic.disableMenuClose();
                    } else {
                        oPublic.enableMenuClose();
                    }
                    return this;
                } else {
                    return false;
                }
            } else if (key === 'disableLabelDelete') {
                if (value === true) {
                    oPublic.disableLabelDelete();
                } else if (value === false) {
                    oPublic.enableLabelDelete();
                }
            } else {
                status[key] = value;
            }
        } else {
            throw oPublic.className + ": Illegal status name.";
        }
    };

    oPublic.showLabelTag = function (label) {
        // This function sets the passed label's tagVisiblity to 'visible' and all the others to
        // 'hidden'.
        if (!lock.showLabelTag) {
            var i;
            var labelLen;
            var isAnyVisible = false;
            labelLen = labels.length;
            if (label) {
                for (i = 0; i < labelLen; i += 1) {
                    //if (labels[i] === label) {
                    if (labels[i].getLabelId() === label.getLabelId()) {
                        labels[i].setTagVisibility('visible');
                        isAnyVisible = true;
                    } else {
                        labels[i].setTagVisibility('hidden');
                        labels[i].resetTagCoordinate();
                    }
                }
            } else {
                for (i = 0; i < labelLen; i++) {
                    labels[i].setTagVisibility('hidden');
                    labels[i].resetTagCoordinate();
                }
                $divHolderLabelDeleteIcon.css('visibility', 'hidden');
            }
            // If any of the tags is visible, show a deleting icon on it.
            if (!isAnyVisible) {
                $divHolderLabelDeleteIcon.css('visibility', 'hidden');
            }
            oPublic.clear().render2();
            return this;
        }
    };

    oPublic.setTagVisibility = function (labelIn) {
        // Deprecated
        return oPublic.showLabelTag(labelIn);
    };

    oPublic.setVisibility = function (visibility) {
        var i = 0;
        var labelLen = 0;

        labelLen = labels.length;
        for (i = 0; i < labelLen; i += 1) {
            labels[i].unlockVisibility().setVisibility('visible');
        }
        return this;
    };

    oPublic.setVisibilityBasedOnLocation = function (visibility) {
        var i = 0;
        var labelLen = 0;

        labelLen = labels.length;
        for (i = 0; i < labelLen; i += 1) {
            labels[i].setVisibilityBasedOnLocation(visibility, getPanoId());
        }
        return this;
    };

    oPublic.setVisibilityBasedOnLabelerId = function (visibility, LabelerIds, included) {
        // This function should not be used in labeling interfaces, but only in evaluation interfaces.
        // Set labels that are not in LabelerIds hidden
        var i = 0;
        var labelLen = 0;

        labelLen = labels.length;
        for (i = 0; i < labelLen; i += 1) {
            labels[i].setVisibilityBasedOnLabelerId(visibility, LabelerIds, included);
        }
        return this;
    };

    oPublic.setVisibilityBasedOnLabelerIdAndLabelTypes = function (visibility, table, included) {
        var i = 0;
        var labelLen = 0;

        labelLen = labels.length;
        for (i = 0; i < labelLen; i += 1) {
            labels[i].setVisibilityBasedOnLabelerIdAndLabelTypes(visibility, table, included);
        }
        return this;
    };

    oPublic.showDeleteLabel = function (x, y) {
        rightClickMenu.showDeleteLabel(x, y);
    };

    oPublic.unlockCurrentLabel = function () {
        status.lockCurrentLabel = false;
        return this;
    };

    oPublic.unlockDisableLabelDelete = function () {
        status.lockDisableLabelDelete = false;
        return this;
    };

    oPublic.unlockDisableLabelEdit = function () {
        status.lockDisableLabelEdit = false;
        return this;
    };

    oPublic.unlockDisableLabeling = function () {
        status.lockDisableLabeling = false;
        return this;
    };

    // oPublic.unlockDisableMenuSelect = function () {
    //     rightClickMenu.unlockDisableMenuSelect();
    //     return this;
    // };

    oPublic.unlockShowLabelTag = function () {
        // This method locks showLabelTag
        lock.showLabelTag = false;
        return this;
    };

    ////////////////////////////////////////
    // Initialization.
    ////////////////////////////////////////
    _init(param);

    return oPublic;
}

function ExampleWindow ($, params) {
    var api = {
            className : 'ExampleWindow'
        };
    var properties = {
            exampleCategories : ['StopSign_OneLeg', 'StopSign_TwoLegs', 'StopSign_Column', 'NextToCurb', 'AwayFromCurb']
        };
    var status = {
            open : false
        };

        // jQuery elements
    var $divHolderExampleWindow;
    var $divHolderCloseButton;
    var $divExampleOneLegStopSign;
    var $divExampleTwoLegStopSign;
    var $divExampleColumnStopSign;
    var $divExampleNextToCurb;
    var $divExampleAwayFromCurb;
    var exampleWindows = {};

    ////////////////////////////////////////
    // Private functions
    ////////////////////////////////////////
    function init (params) {
        // Initialize jQuery elements
        $divHolderExampleWindow = $(params.domIds.holder);
        $divHolderCloseButton = $(params.domIds.closeButtonHolder);
        $divExampleOneLegStopSign = $(params.domIds.StopSign_OneLeg);
        $divExampleTwoLegStopSign = $(params.domIds.StopSign_TwoLegs);
        $divExampleColumnStopSign = $(params.domIds.StopSign_Column);
        $divExampleNextToCurb = $(params.domIds.NextToCurb);
        $divExampleAwayFromCurb = $(params.domIds.AwayFromCurb);

        exampleWindows = {
            StopSign_OneLeg : $divExampleOneLegStopSign,
            StopSign_TwoLegs : $divExampleTwoLegStopSign,
            StopSign_Column : $divExampleColumnStopSign,
            NextToCurb : $divExampleNextToCurb,
            AwayFromCurb : $divExampleAwayFromCurb
        };

        // Add listeners
        $divHolderCloseButton.bind({
            click : api.close,
            mouseenter : closeButtonMouseEnter,
            mouseleave : closeButtonMouseLeave
        });
    }


    function closeButtonMouseEnter () {
        // A callback function that is invoked when a mouse cursor enters the X sign.
        // This function changes a cursor to a pointer.
        $(this).css({
            cursor : 'pointer'
        });
        return this;
    }


    function closeButtonMouseLeave () {
        // A callback function that is invoked when a mouse cursor leaves the X sign.
        // This function changes a cursor to a 'default'.
        $(this).css({
            cursor : 'default'
        });
        return this;
    }


    ////////////////////////////////////////
    // Public functions
    ////////////////////////////////////////
    api.close = function () {
        // Hide the example window.
        status.open = false;
        $divHolderExampleWindow.css({
            visibility : 'hidden'
        });
        $.each(exampleWindows, function (i, v) {
            v.css({visibility:'hidden'});
        });
        return this;
    };


    api.isOpen = function () {
        return status.open;
    };


    api.show = function (exampleCategory) {
        // Show the example window.
        // Return false if the passed category is not know.
        if (properties.exampleCategories.indexOf(exampleCategory) === -1) {
            return false;
        }

        status.open = true;
        $divHolderExampleWindow.css({
            visibility : 'visible'
        });

        $.each(exampleWindows, function (i, v) {
            console.log(i);
            if (i === exampleCategory) {
                v.css({visibility:'visible'});
            } else {
                v.css({visibility:'hidden'});
            }
        });

        return this;
    };

    ////////////////////////////////////////
    // Initialization
    ////////////////////////////////////////
    init(params);
    return api;
}

function Form ($, params) {
    var self = {
        'className' : 'Form'
    };

    var properties = {
        commentFieldMessage: undefined,
        isAMTTask : false,
        isPreviewMode : false,
        previousLabelingTaskId: undefined,
        dataStoreUrl : undefined,
        onboarding : false,
        taskRemaining : 0,
        taskDescription : undefined,
        taskPanoramaId: undefined,
        hitId : undefined,
        assignmentId: undefined,
        turkerId: undefined,
        userExperiment: false
    };
    var status = {
        disabledButtonMessageVisibility: 'hidden',
        disableSkipButton : false,
        disableSubmit : false,
        radioValue: undefined,
        skipReasonDescription: undefined,
        submitType: undefined,
        taskDifficulty: undefined,
        taskDifficultyComment: undefined
    };
    var lock = {
        disableSkipButton : false,
        disableSubmit : false
    };

    // jQuery doms
    var $form;
    var $textieldComment;
    var $btnSubmit;
    var $btnSkip;
    var $btnConfirmSkip;
    var $btnCancelSkip;
    var $radioSkipReason;
    var $textSkipOtherReason;
    var $divSkipOptions;
    var $pageOverlay;
    var $taskDifficultyWrapper;
    var $taskDifficultyOKButton;

    var messageCanvas;

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions
    ////////////////////////////////////////////////////////////////////////////////
    function _init (params) {
        var hasGroupId = getURLParameter('groupId') !== "";
        var hasHitId = getURLParameter('hitId') !== "";
        var hasWorkerId = getURLParameter('workerId') !== "";
        var assignmentId = getURLParameter('assignmentId');

        properties.onboarding = params.onboarding;
        properties.dataStoreUrl = params.dataStoreUrl;

        if (('assignmentId' in params) && params.assignmentId) {
            properties.assignmentId = params.assignmentId;
        }
        if (('hitId' in params) && params.hitId) {
            properties.hitId = params.hitId;
        }
        if (('turkerId' in params) && params.turkerId) {
            properties.turkerId = params.turkerId;
        }

        if (('userExperiment' in params) && params.userExperiment) {
            properties.userExperiment = true;
        }

        //
        // initiailze jQuery elements.
        $form = $("#BusStopLabelerForm");
        $textieldComment = $("#CommentField");
        $btnSubmit = $("#Button_Submit");
        $btnSkip = $("#Button_Skip");
        $btnConfirmSkip = $("#BusStopAbsence_Submit");
        $btnCancelSkip = $("#BusStopAbsence_Cancel");
        $radioSkipReason = $('.Radio_BusStopAbsence');
        $textSkipOtherReason = $("#Text_BusStopAbsenceOtherReason");
        $divSkipOptions = $("#Holder_SkipOptions");
        $pageOverlay = $("#Holder_PageOverlay");


        if (properties.userExperiment) {
            $taskDifficultyOKButton = $("#task-difficulty-button");
            $taskDifficultyWrapper = $("#task-difficulty-wrapper");
        }


        $('input[name="assignmentId"]').attr('value', properties.assignmentId);
        $('input[name="workerId"]').attr('value', properties.turkerId);
        $('input[name="hitId"]').attr('value', properties.hitId);


        if (assignmentId && assignmentId === 'ASSIGNMENT_ID_NOT_AVAILABLE') {
            properties.isPreviewMode = true;
            properties.isAMTTask = true;
            self.unlockDisableSubmit().disableSubmit().lockDisableSubmit();
            self.unlockDisableSkip().disableSkip().lockDisableSkip();
        } else if (hasWorkerId && !assignmentId) {
            properties.isPreviewMode = false;
            properties.isAMTTask = false;
        } else if (!assignmentId && !hasHitId && !hasWorkerId) {
            properties.isPreviewMode = false;
            properties.isAMTTask = false;
        } else {
            properties.isPreviewMode = false;
            properties.isAMTTask = true;
        }

        //
        // Check if this is a sandbox task or not
        properties.isSandbox = false;
        if (properties.isAMTTask) {
            if (document.referrer.indexOf("workersandbox.mturk.com") !== -1) {
                properties.isSandbox = true;
                $form.prop("action", "https://workersandbox.mturk.com/mturk/externalSubmit");
            }
        }

        //
        // Check if this is a preview and, if so, disable submission and show a message saying
        // this is a preview.
        if (properties.isAMTTask && properties.isPreviewMode) {
            var dom = '<div class="amt-preview-warning-holder">' +
                '<div class="amt-preview-warning">' +
                'Warning: you are on a Preview Mode!' +
                '</div>' +
                '</div>';
            $("body").append(dom);
            self.disableSubmit();
            self.lockDisableSubmit();
        }

        // if (!('onboarding' in svw && svw.onboarding)) {
        //     messageCanvas = new Onboarding(params, $)
        // }

        //
        // Insert texts in a textfield
        properties.commentFieldMessage = $textieldComment.attr('title');
        $textieldComment.val(properties.commentFieldMessage);

        //
        // Disable Submit button so turkers cannot submit without selecting
        // a reason for not being able to find the bus stop.
        disableConfirmSkip();

        //
        // Attach listeners
        $textieldComment.bind('focus', focusCallback); // focusCallback is in Utilities.js
        $textieldComment.bind('blur', blurCallback); // blurCallback is in Utilities.js
        $form.bind('submit', formSubmit);
        $btnSkip.bind('click', openSkipWindow);
        $btnConfirmSkip.on('click', skipSubmit);
        $btnCancelSkip.on('click', closeSkipWindow);
        $radioSkipReason.on('click', radioSkipReasonClicked);
        // http://stackoverflow.com/questions/11189136/fire-oninput-event-with-jquery
        if ($textSkipOtherReason.get().length > 0) {
            $textSkipOtherReason[0].oninput = skipOtherReasonInput;
        }

        if (properties.userExperiment) {
            $taskDifficultyOKButton.bind('click', taskDifficultyOKButtonClicked);
        }

    }

    function compileSubmissionData() {
        // This method gathers all the data needed for submission.
        var data = {};
        var hitId;
        var assignmentId;
        var turkerId;
        var taskGSVPanoId = svw.map.getInitialPanoId();


        hitId = properties.hitId ? properties.hitId : getURLParameter("hitId");
        assignmentId = properties.assignmentId? properties.assignmentId : getURLParameter("assignmentId");
        turkerId = properties.turkerId ? properties.turkerId : getURLParameter("workerId");

        if (!turkerId) {
            turkerId = 'Test_Kotaro';
        }
        if (!hitId) {
            hitId = 'Test_Hit';
        }
        if (!assignmentId) {
            assignmentId = 'Test_Assignment';
        }

        data.assignment = {
            amazon_turker_id : turkerId,
            amazon_hit_id : hitId,
            amazon_assignment_id : assignmentId,
            interface_type : 'StreetViewLabeler',
            interface_version : '3',
            completed : 0,
            need_qualification : 0,
            task_description : properties.taskDescription
        };

        data.labelingTask = {
            task_panorama_id: properties.taskPanoramaId,
            task_gsv_panorama_id : taskGSVPanoId,
            no_label : 0,
            description: "",
            previous_labeling_task_id: properties.previousLabelingTaskId
        };

        data.labelingTaskEnvironment = {
            browser: getBrowser(),
            browser_version: getBrowserVersion(),
            browser_width: $(window).width(),
            browser_height: $(window).height(),
            screen_width: screen.width,
            screen_height: screen.height,
            avail_width: screen.availWidth,		// total width - interface (taskbar)
            avail_height: screen.availHeight,		// total height - interface };
            operating_system: getOperatingSystem()
        };

        data.userInteraction = svw.tracker.getActions();

        data.labels = [];
        var labels = svw.canvas.getLabels();
        for(var i = 0; i < labels.length; i += 1) {
            var label = labels[i];
            var prop = label.getProperties();
            var points = label.getPath().getPoints();
            var pathLen = points.length;

            var temp = {
                deleted : label.isDeleted() ? 1 : 0,
                label_id : label.getLabelId(),
                label_type : label.getLabelType(),
                label_gsv_panorama_id : prop.panoId,
                label_points : [],
                label_additional_information : undefined
            };

            if (("photographerHeading" in prop) && ("photographerPitch" in prop)) {
                temp.photographer_heading = prop.photographerHeading,
                temp.photographer_pitch = prop.photographerPitch
            }

            for (var j = 0; j < pathLen; j += 1) {
                var point = points[j];
                var gsvImageCoordinate = point.getGSVImageCoordinate();
                var pointParam = {
                    svImageX : gsvImageCoordinate.x,
                    svImageY : gsvImageCoordinate.y,
                    originalCanvasX: point.originalCanvasCoordinate.x,
                    originalCanvasY: point.originalCanvasCoordinate.y,
                    originalHeading: point.originalPov.heading,
                    originalPitch: point.originalPov.pitch,
                    originalZoom : point.originalPov.zoom,
                    canvasX : point.canvasCoordinate.x,
                    canvasY : point.canvasCoordinate.y,
                    heading : point.pov.heading,
                    pitch : point.pov.pitch,
                    zoom : point.pov.zoom,
                    lat : prop.panoramaLat,
                    lng : prop.panoramaLng,
                    svImageHeight : prop.svImageHeight,
                    svImageWidth : prop.svImageWidth,
                    canvasHeight : prop.canvasHeight,
                    canvasWidth : prop.canvasWidth,
                    alphaX : prop.canvasDistortionAlphaX,
                    alphaY : prop.canvasDistortionAlphaY
                };
                temp.label_points.push(pointParam);
            }

            data.labels.push(temp)
        }

        if (data.labels.length === 0) {
            data.labelingTask.no_label = 0;
        }

        //
        // Add the value in the comment field if there are any.
        var comment = $textieldComment.val();
        data.comment = undefined;
        if (comment &&
            comment !== $textieldComment.attr('title')) {
            data.comment = $textieldComment.val();
        }
        return data;
    }


    function disableConfirmSkip () {
        // This method disables the confirm skip button
        $btnConfirmSkip.attr('disabled', true);
        $btnConfirmSkip.css('color', 'rgba(96,96,96,0.5)');
    }


    function enableConfirmSkip () {
        // This method enables the confirm skip button
        $btnConfirmSkip.attr('disabled', false);
        $btnConfirmSkip.css('color', 'rgba(96,96,96,1)');
    }

    function formSubmit (e) {
        // This is a callback function that will be invoked when a user hit a submit button.
        if (!properties.isAMTTask || properties.taskRemaining > 1) {
            e.preventDefault();
        }

        var url = properties.dataStoreUrl;
        var data = {};

        if (status.disableSubmit) {
            showDisabledSubmitButtonMessage();
            return false;
        }

        // temp
        window.location.reload();

        //
        // If this is a task with ground truth labels, check if users made any mistake.
        if ('goldenInsertion' in svw && svw.goldenInsertion) {
            var numMistakes = svw.goldenInsertion.reviewLabels();
            self.disableSubmit().lockDisableSubmit();
            self.disableSkip().lockDisableSkip();
            return false;
        }

        //
        // Disable a submit button and other buttons so turkers cannot submit labels more than once.
        //$btnSubmit.attr('disabled', true);
        //$btnSkip.attr('disabled', true);
        $btnConfirmSkip.attr('disabled', true);
        $pageOverlay.css('visibility', 'visible');


        //
        // If this is a user experiment
        if (properties.userExperiment) {
            if (!status.taskDifficulty) {
                status.submitType = 'submit';
                $taskDifficultyWrapper.css('visibility', 'visible');
                return false;
            }
        }

        //
        // Submit collected data if a user is not in onboarding mode.
        if (!properties.onboarding) {
            svw.tracker.push('TaskSubmit');

            data = compileSubmissionData();

            if (status.taskDifficulty != undefined) {
                data.taskDifficulty = status.taskDifficulty;
                data.labelingTask.description = "TaskDifficulty:" + status.taskDifficulty;
                if (status.taskDifficultyComment) {
                    data.comment = "TaskDifficultyCommentField:" + status.taskDifficultyComment + ";InterfaceCommentField:" + data.comment
                }
            }

            try {
                $.ajax({
                    async: false,
                    url: url,
                    type: 'post',
                    data: data,
                    dataType: 'json',
                    success: function (result) {
                        if (result.error) {
                            console.log(result.error);
                        }
                    },
                    error: function (result) {
                        throw result;
                        // console.error(result);
                    }
                });
            } catch (e) {
                console.error(e);
                return false;
            }

            if (properties.taskRemaining > 1) {
                window.location.reload();
                return false;
            } else {
                if (properties.isAMTTask) {
                    return true;
                } else {
                    window.location.reload();
                    //window.location = '/';
                    return false;
                }
            }
        }
        return false;
    }

    function goldenInsertionSubmit () {
        // This method submits the labels that a user provided on golden insertion task and refreshes the page.
        if ('goldenInsertion' in svw && svw.goldenInsertion) {
            svw.tracker.push('GoldenInsertion_Submit');
            var url = properties.dataStoreUrl;
            var data;
            svw.goldenInsertion.disableOkButton();

            data = compileSubmissionData();
            data.labelingTask.description = "GoldenInsertion";

            try {
                $.ajax({
                    async: false,
                    url: url,
                    type: 'post',
                    data: data,
                    dataType: 'json',
                    success: function (result) {
                        if (((typeof result) == 'object') && ('error' in result) && result.error) {
                            console.log(result.error);
                        }
                    },
                    error: function (result) {
                        throw result;
                        // console.error(result);
                    }
                });
            } catch (e) {
                console.error(e);
                return false;
            }

            window.location.reload();
        } else {
            throw self.className + ": This method cannot be called without GoldenInsertion";
        }
        return false;
    }

    function showDisabledSubmitButtonMessage () {
        // This method is called from formSubmit method when a user clicks the submit button evne then have
        // not looked around and inspected the entire panorama.
        var completionRate = parseInt(svw.progressPov.getCompletionRate() * 100, 10);

        if (!('onboarding' in svw && svw.onboarding) &&
            (completionRate < 100)) {
            var message = "You have inspected " + completionRate + "% of the scene. Let's inspect all the corners before you submit the task!";
            var $OkBtn;

            //
            // Clear and render the onboarding canvas
            var $divOnboardingMessageBox = $("#Holder_OnboardingMessageBox");
            messageCanvas.clear();
            messageCanvas.renderMessage(300, 250, message, 350, 140);
            messageCanvas.renderArrow(650, 282, 710, 282);

            if (status.disabledButtonMessageVisibility === 'hidden') {
                status.disabledButtonMessageVisibility = 'visible';
                var okButton = '<button id="TempOKButton" class="button bold" style="left:20px;position:relative; width:100px;">OK</button>';
                $divOnboardingMessageBox.append(okButton);
                $OkBtn = $("#TempOKButton");
                $OkBtn.bind('click', function () {
                    //
                    // Remove the OK button and clear the message.
                    $OkBtn.remove();
                    messageCanvas.clear();
                    status.disabledButtonMessageVisibility = 'hidden';
                })
            }
        }
    }

    function skipSubmit (e) {
        // To prevent a button in a form to fire form submission, add onclick="return false"
        // http://stackoverflow.com/questions/932653/how-to-prevent-buttons-from-submitting-forms
        if (!properties.isAMTTask || properties.taskRemaining > 1) {
            e.preventDefault();
        }



        var url = properties.dataStoreUrl;
        var data = {};
        //
        // If this is a task with ground truth labels, check if users made any mistake.
        if ('goldenInsertion' in svw && svw.goldenInsertion) {
            self.disableSubmit().lockDisableSubmit();
            $btnSkip.attr('disabled', true);
            $btnConfirmSkip.attr('disabled', true);
            $divSkipOptions.css({
                visibility: 'hidden'
            });
            var numMistakes = svw.goldenInsertion.reviewLabels()
            return false;
        }

        //
        // Disable a submit button.
        $btnSubmit.attr('disabled', true);
        $btnSkip.attr('disabled', true);
        $btnConfirmSkip.attr('disabled', true);
        $pageOverlay.css('visibility', 'visible');


        //
        // If this is a user experiment, run the following lines
        if (properties.userExperiment) {
            if (!status.taskDifficulty) {
                status.submitType = 'skip';
                $taskDifficultyWrapper.css('visibility', 'visible');
                return false;
            }
        }
        //
        // Set a value for skipReasonDescription.
        if (status.radioValue === 'Other:') {
            status.skipReasonDescription = "Other: " + $textSkipOtherReason.val();
        }

        // Submit collected data if a user is not in oboarding mode.
        if (!properties.onboarding) {
            svw.tracker.push('TaskSubmitSkip');

            //
            // Compile the submission data with compileSubmissionData method,
            // then overwrite a part of the compiled data.
            data = compileSubmissionData()
            data.noLabels = true;
            data.labelingTask.no_label = 1;
            data.labelingTask.description = status.skipReasonDescription;

            if (status.taskDifficulty != undefined) {
                data.taskDifficulty = status.taskDifficulty;
                data.labelingTask.description = "TaskDifficulty:" + status.taskDifficulty;
                if (status.taskDifficultyComment) {
                    data.comment = "TaskDifficultyCommentField:" + status.taskDifficultyComment + ";InterfaceCommentField:" + data.comment
                }
            }

            try {
                $.ajax({
                    async: false,
                    url: url,
                    type: 'post',
                    data: data,
                    success: function (result) {
                        if (result.error) {
                            console.log(result.error);
                        }
                    },
                    error: function (result) {
                        throw result;
                        // console.error(self.className, result);
                    }
                });
            } catch (e) {
                console.error(e);
                return false;
            }

            if (properties.taskRemaining > 1) {
                window.location.reload();
                return false;
            } else {
                if (properties.isAMTTask) {
                    // $form.submit();
                    document.getElementById("BusStopLabelerForm").submit();
                    return true;
                } else {
                    // window.location = '/';
                    window.location.reload();
                    return false;
                }
            }

        }
        return false;
    }


    function openSkipWindow (e) {
        e.preventDefault();

        if (status.disableSkip) {
            showDisabledSubmitButtonMessage();
        } else {
            svw.tracker.push('Click_OpenSkipWindow');
            $divSkipOptions.css({
                visibility: 'visible'
            });
        }
        return false;
    }


    function closeSkipWindow (e) {
        // This method closes the skip menu.
        e.preventDefault(); // Do not submit the form!

        svw.tracker.push('Click_CloseSkipWindow');

        $divSkipOptions.css({
            visibility: 'hidden'
        });
        return false;
    }


    function radioSkipReasonClicked () {
        // This function is invoked when one of a radio button is clicked.
        // If the clicked radio button is 'Other', check if a user has entered a text.
        // If the text is entered, then enable submit. Otherwise disable submit.
        status.radioValue = $(this).attr('value');
        svw.tracker.push('Click_SkipRadio', {RadioValue: status.radioValue});

        if (status.radioValue !== 'Other:') {
            status.skipReasonDescription = status.radioValue;
            enableConfirmSkip();
        } else {
            var textValue = $textSkipOtherReason.val();
            if (textValue) {
                enableConfirmSkip();
            } else {
                disableConfirmSkip();
            }
        }
    }

    function skipOtherReasonInput () {
        // This function is invoked when the text is entered in Other field.
        if (status.radioValue && status.radioValue === 'Other:') {
            var textValue = $textSkipOtherReason.val();
            if (textValue) {
                enableConfirmSkip();
            } else {
                disableConfirmSkip();
            }
        }
    }

    function taskDifficultyOKButtonClicked (e) {
        // This is used in the user experiment script
        // Get checked radio value
        // http://stackoverflow.com/questions/4138859/jquery-how-to-get-selected-radio-button-value
        status.taskDifficulty = parseInt($('input[name="taskDifficulty"]:radio:checked').val(), 10);
        status.taskDifficultyComment = $("#task-difficulty-comment").val();
        status.taskDifficultyComment = (status.taskDifficultyComment != "") ? status.taskDifficultyComment : undefined;
        console.log(status.taskDifficultyComment);


        if (status.taskDifficulty) {
            if (('submitType' in status) && status.submitType == 'submit') {
                formSubmit(e);
            } else if (('submitType' in status) && status.submitType == 'skip') {
                skipSubmit(e);
            }
        }
    }
    ////////////////////////////////////////////////////////////////////////////////
    // Public functions
    ////////////////////////////////////////////////////////////////////////////////
    self.checkSubmittable = function () {
        // This method checks whether users can submit labels or skip this task by first checking if they
        // assessed all the angles of the street view.
        // Enable/disable form a submit button and a skip button
        if ('progressPov' in svw && svw.progressPov) {
            var completionRate = svw.progressPov.getCompletionRate();
        } else {
            var completionRate = 0;
        }

        var labelCount = svw.canvas.getNumLabels();

        if (1 - completionRate < 0.01) {
            if (labelCount > 0) {
                self.enableSubmit();
                self.disableSkip();
            } else {
                self.disableSubmit();
                self.enableSkip();
            }
            return true;
        } else {
            self.disableSubmit();
            self.disableSkip();
            return false;
        }
    };

    self.compileSubmissionData = function () {
        // This method returns the return value of a private method compileSubmissionData();
        return compileSubmissionData();
    }

    self.disableSubmit = function () {
        if (!lock.disableSubmit) {
            status.disableSubmit = true;
            //  $btnSubmit.attr('disabled', true);
            $btnSubmit.css('opacity', 0.5);
            return this;
        }
        return false;
    };


    self.disableSkip = function () {
        if (!lock.disableSkip) {
            status.disableSkip = true;
            // $btnSkip.attr('disabled', true);
            $btnSkip.css('opacity', 0.5);
            return this;
        }
        return false;
    };


    self.enableSubmit = function () {
        if (!lock.disableSubmit) {
            status.disableSubmit = false;
            // $btnSubmit.attr('disabled', false);
            $btnSubmit.css('opacity', 1);
            return this;
        }
        return false;
    };


    self.enableSkip = function () {
        if (!lock.disableSkip) {
            status.disableSkip = false;
            // $btnSkip.attr('disabled', false);
            $btnSkip.css('opacity', 1);
            return this;
        }
        return false;
    };

    self.goldenInsertionSubmit = function () {
        // This method allows GoldenInsetion to submit the task.
        return goldenInsertionSubmit();
    };

    self.isPreviewMode = function () {
        // This method returns whether the task is in preview mode or not.
        return properties.isPreviewMode;
    };

    self.lockDisableSubmit = function () {
        lock.disableSubmit = true;
        return this;
    };


    self.lockDisableSkip = function () {
        lock.disableSkip = true;
        return this;
    };

    self.setPreviousLabelingTaskId = function (val) {
        // This method sets the labelingTaskId
        properties.previousLabelingTaskId = val;
        return this;
    };

    self.setTaskDescription = function (val) {
        // This method sets the taskDescription
        properties.taskDescription = val;
        return this;
    };


    self.setTaskRemaining = function (val) {
        // This method sets the number of remaining tasks
        properties.taskRemaining = val;
        return this;
    };

    self.setTaskPanoramaId = function (val) {
        // This method sets the taskPanoramaId. Note it is not same as the GSV panorama id.
        properties.taskPanoramaId = val;
        return this;
    };


    self.unlockDisableSubmit = function () {
        lock.disableSubmit = false;
        return this;
    };


    self.unlockDisableSkip = function () {
        lock.disableSkipButton = false;
        return this;
    };

    _init(params);
    return self;
}

/**
 * Created with JetBrains PhpStorm.
 * User: kotaro
 * Date: 9/1/13
 * Time: 4:07 PM
 * To change this template use File | Settings | File Templates.
 */
var svw = svw || {};

function GoldenInsertion (param, $) {
    var oPublic = {
        className: 'GoldenInsertion'
    };
    var properties = {
        cameraMovementDuration: 500, // 500 ms
        curbRampThreshold: 0.35,
        goldenLabelVisibility: 'hidden',
        noCurbRampThreshold: 0.1
    };
    var status = {
        boxMessage: "",
        currentLabel: undefined,
        hasMistake: false,
        revisingLabels: false
    };
    var lock = {};
    var domOKButton = '<button id="GoldenInsertionOkButton" class="button" style="">OK</button>';

    var onboarding; // This variable will hold an onboarding object

    var $buttonCurbRamp;
    var $buttonNoCurbRamp;

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions
    ////////////////////////////////////////////////////////////////////////////////
    function _init (param) {
        if ('goldenLabelVisibility' in param) {
            properties.goldenLabelVisibility = param.goldenLabelVisibility;
        }

        onboarding = new Onboarding(param, $);
        $buttonCurbRamp = $("#ModeSwitchButton_CurbRamp");
        $buttonNoCurbRamp = $("#ModeSwitchButton_NoCurbRamp");
    }

    function clear () {
        // This method clears the object status and cleans up the instruction canvas.
        status.currentLabel = undefined;
        onboarding.clear();
    }

    function clickOK () {
        // This is a callback function that is invoked when a user clicked an OK button on the final message.
        if ('form' in svw && svw.form) {
            svw.form.goldenInsertionSubmit();
        } else {
            throw oPublic.className + ": Cannnot submit without a Form object.";
        }
    }

    function compare(label1, label2) {
        // A comparison function used to sort a list of labels based on its relativeHeading.
        if (label1.relativeHeading < label2.relativeHeading) {
            return -1;
        } else if (label1.relativeHeading > label2.relativeHeading) {
            return 1
        } else {
            return 0;
        }
    }

    function reviseFalseNegative (label) {
        // This method sets the camera angle to a false negative label and asks a user to label it.
        if (('canvas' in svw && svw.canvas) &&
            ('map' in svw && svw.map)) {
            svw.tracker.push('GoldenInsertion_ReviseFalseNegative');
            var labelId = label.getLabelId();
            var systemLabels = svw.canvas.getSystemLabels(true);
            var systemLabelIndex;
            var systemLabelsLength = systemLabels.length;

            //
            // Find a reference to the right user label
            for (systemLabelIndex = 0; systemLabelIndex < systemLabelsLength; systemLabelIndex++) {
                if (labelId == systemLabels[systemLabelIndex].getLabelId()) {
                    label = systemLabels[systemLabelIndex];
                    label.unlockVisibility().setVisibility('visible').lockVisibility();
                    // label.unlockTagVisibility().setTagVisibility('visible').lockTagVisibility();
                } else {
                    systemLabels[systemLabelIndex].unlockVisibility().setVisibility('hidden').lockVisibility();
                    // systemLabels[systemLabelIndex].unlockTagVisibility().setTagVisibility('hidden').lockTagVisibility();
                }
            }

            //
            // Set the pov so the user can see the label.
            var pov = label.getLabelPov();
            var labelType = label.getLabelType();
            status.currentLabel = label;

            if (labelType === "CurbRamp") {
                // status.boxMessage = "You did not label this <b>curb ramp</b>. Please draw an outline around it by clicking the <b>Curb Ramp</b> button.";
                status.boxMessage = "You did not label this <b>curb ramp</b>. Please draw an outline around it.";
            } else {
                // status.boxMessage = "You did not label this <b>missing curb ramp</b>. Please draw an outline around it by clicking the <b>Missing Curb Ramp</b> button.";
                status.boxMessage = "You did not label this <b>missing curb ramp</b>. Please draw an outline around it.";
            }

            svw.messageBox.hide();
            svw.map.setPov(pov, properties.cameraMovementDuration, function () {
                status.currentLabel = label;
                showMessage();
                //
                // Automatically switch to the CurbRamp or NoCurbRamp labeling mode based on the given label type.
                if (labelType === 'CurbRamp') {
                    svw.ribbon.modeSwitch('CurbRamp');
                } else if (labelType === 'NoCurbRamp') {
                    svw.ribbon.modeSwitch('NoCurbRamp');
                }
            });
            var blue = 'rgba(0,0,255, 0.5)';
            label.fill(blue).blink(5); // True is set to fade the color at the end.
        }
    }

    function reviseFalsePositive (label, overlap) {
        // This method sets the camera angle to a false positive label and asks a user to delete the false positive label.
        if (!overlap || typeof overlap !== "number") {
            overlap = 0;
        }
        if (('canvas' in svw && svw.canvas) &&
            ('map' in svw && svw.map)) {
            svw.tracker.push('GoldenInsertion_ReviseFalsePositive');
            var labelId = label.getLabelId();
            var userLabels = svw.canvas.getUserLabels(true);
            var userLabelIndex;
            var userLabelsLength = svw.canvas.getUserLabelCount();

            //
            // Find a reference to the right user label
            for (userLabelIndex = 0; userLabelIndex < userLabelsLength; userLabelIndex++) {
                if (labelId == userLabels[userLabelIndex].getLabelId()) {
                    label = userLabels[userLabelIndex];
                    break;
                }
            }

            //
            // Set the pov so the user can see the label.
            var pov = label.getLabelPov();
            var labelType = label.getLabelType();
            status.currentLabel = label;

            if (labelType === "CurbRamp") {
                // status.boxMessage = "You did not label this <b>curb ramp</b>. Please draw an outline around it by clicking the <b>Curb Ramp</b> button.";
                if (overlap > 0) {
                    status.boxMessage = "This label does not precisely outline the <b>curb ramp</b>. Mouse over the label and click " +
                        "<img src=\"public/img/icons/Sidewalk/Icon_Delete.svg\" class=\"MessageBoxIcons\"/> " +
                        "to delete.";
                } else {
                    status.boxMessage = "There does not appear to be a curb ramp to label here. Mouse over the label and click " +
                        "<img src=\"public/img/icons/Sidewalk/Icon_Delete.svg\" class=\"MessageBoxIcons\"/> " +
                        "to delete.";
                }
            } else {
                // status.boxMessage = "You did not label this <b>missing curb ramp</b>. Please draw an outline around it by clicking the <b>Missing Curb Ramp</b> button.";
                if (overlap > 0) {
                    status.boxMessage = "Your label is not on a <b>missing curb ramp</b>. Mouse over the label and click " +
                        "<img src=\"public/img/icons/Sidewalk/Icon_Delete.svg\" class=\"MessageBoxIcons\"/> " +
                        "to delete.";
                } else {
                    status.boxMessage = "There does not appear to be any missing curb ramp to label here. Mouse over the label and click " +
                        "<img src=\"public/img/icons/Sidewalk/Icon_Delete.svg\" class=\"MessageBoxIcons\"/> " +
                        "to delete.";
                }
            }

//            if (labelType === "CurbRamp") {
//                var message = "This label does not precisely outline the curb ramp. Please delete the label by clicking the " +
//                    "<img src=\"public/img/icons/Sidewalk/Icon_Delete.svg\" class=\"MessageBoxIcons\"/> " +
//                    "button and try outlining.";
//            } else {
//                var message = "Your label is not on a missing curb ramp. Please delete the label by clicking " +
//                    "<img src=\"public/img/icons/Sidewalk/Icon_Delete.svg\" class=\"MessageBoxIcons\"/> " +
//                    "on the label.";
//            }

            //
            // Change the pov, then invoke a callback function to show an message.
            // Ask an user to delete the label that is wrong.
            // Keep checking if the user deleted the label or not by counting the number of user labels.
            // Move on once the user have corrected the mistake.
            svw.messageBox.hide();
            svw.map.setPov(pov, properties.cameraMovementDuration, function () {
                status.currentLabel = label;
                showMessage();
            });
            // label.highlight().blink(5, true); // The second argument is set to true so the label will fade at the end.
            var red = 'rgba(255, 0, 0, 0.7)';
            label.fill(red).blink(5);
        }
    }

    function reviewLabels () {
        // Deprecated. Use reviewLabels2
        // This method reviews if user provided labels align well with system provided (golden/ground truth) labels.
        // This method extract system labels and user labels from svw.canvas, then compares overlap.
        // Finally it returns the number of mistakes identified.
        if (('canvas' in svw && svw.canvas) &&
            ('form' in svw && svw.form) &&
            ('map' in svw && svw.map)) {
            var userLabels = svw.canvas.getLabels('user');
            var systemLabels = svw.canvas.getLabels('system');
            var userLabelIndex;
            var systemLabelIndex;

            //
            // Clear anything from previous review.
            clear();

            //
            // Filter user labels
            userLabels = userLabels.filter(function (label) {
                return !label.isDeleted() && label.isVisible();
            });

            var userLabelsLength = svw.canvas.getUserLabelCount();
            var systemLabelsLength = systemLabels.length;
            var falseNegativeLabels = []; // This array stores ids of missed system labels.
            var falsePositiveLabels = []; // This array stores ids of false user labels.

            var overlap;
            var labelType;
            var doesOverlap;

            //
            // Check if a user has labeled something that is not a curb ramp or not a missing curb ramp (False positive)
            for (userLabelIndex = 0; userLabelIndex < userLabelsLength; userLabelIndex++) {
                overlap = 0;
                doesOverlap = false;
                for (systemLabelIndex = 0; systemLabelIndex < systemLabelsLength; systemLabelIndex++) {
                    if (!userLabels[userLabelIndex].isDeleted() && userLabels[userLabelIndex].isVisible()) {
                        if (userLabels[userLabelIndex].getLabelType() == systemLabels[systemLabelIndex].getLabelType()) {
                            overlap = userLabels[userLabelIndex].overlap(systemLabels[systemLabelIndex]);
                            labelType = userLabels[userLabelIndex].getLabelType();
                            if (labelType == "CurbRamp" && overlap > properties.curbRampThreshold) {
                                doesOverlap = true;
                                break;
                            } else if (labelType == "NoCurbRamp" && overlap > properties.noCurbRampThreshold) {
                                doesOverlap = true;
                                break;
                            }
                        }
                    }
                }
                if (!doesOverlap) {
                    falsePositiveLabels.push(userLabels[userLabelIndex]);
                }
            }

            //
            // Check if a user has missed to label some of system labels (False negatives)
            for (systemLabelIndex = 0; systemLabelIndex < systemLabelsLength; systemLabelIndex++) {
                overlap = 0;
                doesOverlap = false;
                for (userLabelIndex = 0; userLabelIndex < userLabelsLength; userLabelIndex++) {
                    if (!userLabels[userLabelIndex].isDeleted() && userLabels[userLabelIndex].isVisible()) {

                        if (userLabels[userLabelIndex].getLabelType() == systemLabels[systemLabelIndex].getLabelType()) {
                            overlap = userLabels[userLabelIndex].overlap(systemLabels[systemLabelIndex]);
                            labelType = userLabels[userLabelIndex].getLabelType();
                            if (labelType == "CurbRamp" && overlap > properties.curbRampThreshold) {
                                doesOverlap = true;
                                break;
                            } else if (labelType == "NoCurbRamp" && overlap > properties.noCurbRampThreshold) {
                                doesOverlap = true;
                                break;
                            }
                        }
                    }
                }
                if (!doesOverlap) {
                    falseNegativeLabels.push(systemLabels[systemLabelIndex]);
                }
            }

            //
            // Walk through the mistakes if there are any mistakes
            var numFalseNegatives = falseNegativeLabels.length;
            var numFalsePositives = falsePositiveLabels.length;
            var numMistakes = numFalseNegatives + numFalsePositives;
            if (numMistakes > 0) {
                status.hasMistake = true;
                if (numFalsePositives > 0) {
                    reviseFalsePositive(falsePositiveLabels[0]);
                } else if (numFalseNegatives > 0) {
                    reviseFalseNegative(falseNegativeLabels[0]);
                }
                return numMistakes;
            } else {
                // Change the message depending on whether s/he has made a misatke or not.
                var domSpacer = "<div style='height: 10px'></div>"
                if (status.hasMistake) {
                    var message = "Great, you corrected all the mistakes! Now, let's move on to the next task. " +
                        "Please try to be as accurate as possible. Your labels will be used to make our cities better " +
                        "and more accessible.<br/>" + domSpacer + domOKButton;
                } else {
                    var message = "Fantastic! You labeled everything correctly! Let's move on to the next task. <br />" + domSpacer + domOKButton;
                }
                var messageBoxX = 0;
                var messageBoxY = 320;
                var width = 720;
                var height = null;
                svw.messageBox.setMessage(message).setPosition(messageBoxX, messageBoxY, width, height, true).show();
                $("#GoldenInsertionOkButton").bind('click', clickOK);
                return 0;
            }
        }
        return false;
    }

    function reviewLabels2 () {
        // This method reviews if user provided labels align well with system provided (golden/ground truth) labels.
        // This method extract system labels and user labels from svw.canvas, then compares overlap.
        if (('canvas' in svw && svw.canvas) &&
            ('form' in svw && svw.form) &&
            ('map' in svw && svw.map) &&
            ('panorama' in svw && svw.panorama)) {
            svw.tracker.push('GoldenInsertion_ReviewLabels');
            var userLabels = svw.canvas.getLabels('user');
            var systemLabels = svw.canvas.getLabels('system');
            var allLabels = [];
            var userLabelIndex;
            var systemLabelIndex;

            //
            // Clear anything from previous review.
            clear();

            //
            // Filter user labels
            userLabels = userLabels.filter(function (label) {
                return !label.isDeleted() && label.isVisible();
            });


            var _userLabels = userLabels.map(function (label) {
                label.labeledBy = "user";
                return label;
            });
            var _systemLabels = systemLabels.map(function (label) {
                label.labeledBy = "system";
                return label;
            });
            var allLabels = _userLabels.concat(_systemLabels);
            allLabels = allLabels.map(function (label) {
                var currentHeading = svw.panorama.getPov().heading;
                var labelHeading = label.getLabelPov().heading; //label.//label.getProperty("panoramaHeading");
                var weight = 10; // Add a weight to system labels so they tend to be corrected after correcting user labels.
                label.relativeHeading = parseInt((labelHeading - currentHeading + 360) % 360);
                label.relativeHeading = (label.relativeHeading < 360 - label.relativeHeading) ? label.relativeHeading : 360 - label.relativeHeading;
                label.relativeHeading = (label.labeledBy === "system") ? label.relativeHeading + weight : label.relativeHeading;
                return label;
            });
            //
            // Sort an array of objects by values of the objects
            // http://stackoverflow.com/questions/1129216/sorting-objects-in-an-array-by-a-field-value-in-javascript
            allLabels.sort(compare);


            var overlap;


            //
            // Check if the user has labeled curb ramps and missing curb ramps correctly.
            var allLabelsLength = allLabels.length;
            var i;
            var j;
            var len;
            var correctlyLabeled;
            for (i = 0; i < allLabelsLength; i++) {
                if (("correct" in allLabels[i]) && allLabels[i]["correct"]) {
                    continue;
                } else {
                    correctlyLabeled = false;
                    var maxOverlap = 0;
                    if (allLabels[i].labeledBy === "user") {
                        // compare the user label with all the system labels to see if it is a true positive label.
                        len = systemLabels.length;
                        for (j = 0; j < len; j++) {
                            if (allLabels[i].getLabelType() === systemLabels[j].getLabelType()) {
                                overlap = allLabels[i].overlap(systemLabels[j]);

                                if (overlap > maxOverlap) {
                                    maxOverlap = overlap;
                                }


                                if ((allLabels[i].getLabelType() === "CurbRamp" && overlap > properties.curbRampThreshold) ||
                                    (allLabels[i].getLabelType() === "NoCurbRamp" && overlap > properties.noCurbRampThreshold)) {
                                    allLabels[i].correct = true;
                                    systemLabels[j].correct = true;
                                    correctlyLabeled = true;
                                    break;
                                }
                            }
                        }
                        if (!correctlyLabeled) {
                            if (!status.hasMistake) {
                                // Before moving on to the correction phase, show a message that tells
                                // the user we will guide them to correct labels.
                                showPreLabelCorrectionMesseage(reviseFalsePositive, {label: allLabels[i], overlap: maxOverlap});
                                status.hasMistake = true;
                            } else {
                                reviseFalsePositive(allLabels[i], maxOverlap);
                            }
                            return;
                        }
                    } else {
                        // Compare the system label with all the user labels to see if the user has missed to label this
                        // this system label.
                        len = userLabels.length;
                        for (j = 0; j < len; j++) {
                            if (allLabels[i].getLabelType() === userLabels[j].getLabelType()) {
                                overlap = allLabels[i].overlap(userLabels[j]);
                                if ((allLabels[i].getLabelType() === "CurbRamp" && overlap > properties.curbRampThreshold) ||
                                    (allLabels[i].getLabelType() === "NoCurbRamp" && overlap > properties.noCurbRampThreshold)) {
                                    allLabels[i].correct = true;
                                    userLabels[j].correct = true;
                                    correctlyLabeled = true;
                                    break;
                                }
                            }
                        }
                        if (!correctlyLabeled) {
                            if (!status.hasMistake) {
                                // Before moving on to the correction phase, show a message that tells
                                // the user we will guide them to correct labels.
                                showPreLabelCorrectionMesseage(reviseFalseNegative, {label: allLabels[i]});
                                status.hasMistake = true;
                            } else {
                                reviseFalseNegative(allLabels[i]);
                            }
                            return;
                        }
                    }
                }
            }

            //
            // Change the message depending on whether s/he has made a misatke or not.
            var domSpacer = "<div style='height: 10px'></div>"
            if (status.hasMistake) {
                var message = "Great, you corrected all the mistakes! Please try to be as accurate as possible. " +
                    "Your labels will be used to make our cities better and more accessible." +
                    "Now, let's move on to the next task. <br/>" + domSpacer + domOKButton;
            } else {
                var message = "Fantastic! You labeled everything correctly! Let's move on to the next task. <br />" + domSpacer + domOKButton;
            }
            var messageBoxX = 0;
            var messageBoxY = 320;
            var width = 700;
            var height = null;
            svw.messageBox.setMessage(message).setPosition(messageBoxX, messageBoxY, width, height, true).show();
            $("#GoldenInsertionOkButton").bind('click', clickOK);
            return;
        }
        return;
    }

    function showMessage() {
        // Show a message and ask an user to provide a label the label they missed to label.
        // Keep checking if they provided a new label or not. Until they provide the label, disable submit.
        // Once they provide a label, review other labels.
        //
        // This method assumes that status.currentLabel and status.boxMessage are set.
        onboarding.clear();

        var boundingbox = status.currentLabel.getBoundingBox();
        var messageBoxX = boundingbox.x + boundingbox.width + 50;
        var messageBoxY = boundingbox.y + boundingbox.height / 2 + 60;
        svw.messageBox.setMessage(status.boxMessage).setPosition(messageBoxX, messageBoxY).show();

        //
        // Show a "click here" message and bind events to mode switch buttons.

        // onboarding.renderArrow(x, y - 50, x, y - 20, {arrowWidth: 3});
        onboarding.renderArrow(messageBoxX, boundingbox.y + boundingbox.height / 2 + 10, messageBoxX - 25, boundingbox.y + (boundingbox.height / 2), {arrowWidth: 3});
        // onboarding.renderArrow(messageBoxX, y - 50, messageBoxX - 25, y - 80, {arrowWidth: 3});
        // onboarding.renderCanvasMessage(x - (boundingbox.width / 2) - 150, y - 60, "Trace an outline similar to this one.", {fontSize: 18, bold: true});
    }

    function showPreLabelCorrectionMesseage(callback, params) {
        // Before moving on to the correction phase, show a message that tells
        // the user we will guide them to correct labels.
        if (!params) {
            return false;
        }
        if (!("label" in params) || !params.label) {
            return false;
        }

        var domSpacer = "<div style='height: 10px'></div>"
        var message = "<img src=\"public/img/icons/Icon_WarningSign.svg\" class=\"MessageBoxIcons\" style=\"height:30px; width:30px; top:6px;\"/> " +
            "Uh oh, looks like there is a problem with your labels. Let's see if we can fix this. <br />" + domSpacer + domOKButton;
        var messageBoxX = 0;
        var messageBoxY = 320;
        var width = 720;
        var height = null;
        svw.messageBox.setMessage(message).setPosition(messageBoxX, messageBoxY, width, height, true).show();
        $("#GoldenInsertionOkButton").bind('click', function () {
            svw.messageBox.hide();
            if ("overlap" in params) {
                callback(params.label, params.overlap);
            } else {
                callback(params.label);
            }
        });
    }


    ////////////////////////////////////////////////////////////////////////////////
    // Public functions
    ////////////////////////////////////////////////////////////////////////////////
    oPublic.disableOkButton = function () {
        // This method disables the OK button.
        $("#GoldenInsertionOkButton").unbind('click');
        $("#GoldenInsertionOkButton").css('opacity', 0.7);
    };

    oPublic.getGoldenLabelVisibility = function () {
        // This method returns the visibility of golden labels.
        return properties.goldenLabelVisibility;
    };

    oPublic.isRevisingLabels = function () {
        // This function is called in Canvas to check whether the user should be revising
        // the false labels. See removeLabel amd closePath methods.
        return status.revisingLabels;
    };

    oPublic.renderMessage = function () {
        // This is a function that is executed from Map.js's viewControlLayerMouseMove()
        if (status.currentLabel && status.boxMessage !== "") {
            showMessage();
        }
        return;
    };

    oPublic.reviewLabels = function () {
        status.revisingLabels = true;
        return reviewLabels2();
    };

    _init(param);
    return oPublic;
}

svw.formatRecordsToGoldenLabels = function (records) {
    // This method takes records from database and format it into labels that the Canvas object can read.
    var i;
    var goldenLabels = {};
    var recordsLength = records.length;

    //
    // Group label points by label id
    var labelId;
    var panoId;
    var lat;
    var lng;
    var deleted;
    for (i = 0; i < recordsLength; i++) {
        //
        // Set pano id
        if ('LabelGSVPanoramaId' in records[i]) {
            panoId = records[i].LabelGSVPanoramaId;
        } else if ('GSVPanoramaId' in records[i]) {
            panoId = records[i].GSVPanoramaId;
        } else {
            panoId = undefined;
        }

        //
        // set latlng
        if ('Lat' in records[i]) {
            lat = records[i].Lat;
        } else if ('labelLat' in records[i]) {
            lat = records[i].labelLat;
        } else {
            lat = undefined;
        }
        if ('Lng' in records[i]) {
            lng = records[i].Lng;
        } else if ('labelLng' in records[i]) {
            lng = records[i].labelLng;
        } else {
            lng = undefined;
        }

        if (records[i].Deleted != "1") {
            labelId = records[i].LabelId;
            if (!(labelId in goldenLabels)) {
                goldenLabels[labelId] = [];
            }

            var temp = {
                AmazonTurkerId: records[i].AmazonTurkerId,
                LabelId: records[i].LabelId,
                LabelGSVPanoramaId: panoId,
                LabelType: records[i].LabelType,
                LabelPointId: records[i].LabelPointId,
                svImageX: records[i].svImageX,
                svImageY: records[i].svImageY,
                originalCanvasCoordinate: {x: records[i].originalCanvasX, y: records[i].originalCanvasY},
                originalHeading: records[i].originalHeading,
                originalPitch: records[i].originalPitch,
                originalZoom: records[i].originalZoom,
                heading: records[i].heading,
                pitch: records[i].pitch,
                zoom: records[i].zoom,
                Lat: lat,
                Lng: lng
            };

            if ('PhotographerHeading' in records[i] && 'PhotographerPitch' in records[i]) {
                temp.PhotographerHeading = parseFloat(records[i].PhotographerHeading);
                temp.PhotographerPitch = parseFloat(records[i].PhotographerPitch);
            }
            goldenLabels[labelId].push(temp);
        }
    }

    var ret = [];
    for (labelId in goldenLabels) {
        ret.push(goldenLabels[labelId]);
    }
    return ret;
};

svw.formatRecordsToLabels = svw.formatRecordsToGoldenLabels;
/**
 * Created with JetBrains PhpStorm.
 * User: kotarohara
 * Date: 3/15/13
 * Time: 9:08 PM
 * To change this template use File | Settings | File Templates.
 */
var svw = svw || {};

function Keyboard ($) {
    var oPublic = {
            className : 'Keyboard'
        };
    var status = {
        focusOnTextField: false,
        shiftDown: false
    };

    var $textareaComment;
    var $taskDifficultyComment;
    var $inputSkipOther;

    function init () {
        $textareaComment = ($("#CommentField").length) > 0 ? $("#CommentField") : null;
        $taskDifficultyComment = ($("#task-difficulty-comment").length > 0) ? $("#task-difficulty-comment") : null;
        $inputSkipOther = ($("#Text_BusStopAbsenceOtherReason").length > 0) ? $("#Text_BusStopAbsenceOtherReason") : null;

        if ($textareaComment) {
          $textareaComment.bind('focus', textFieldFocus);
          $textareaComment.bind('blur', textFieldBlur);
        }

        if ($taskDifficultyComment) {
            $taskDifficultyComment.bind('focus', textFieldFocus);
            $taskDifficultyComment.bind('blur', textFieldBlur);
        }

        if ($inputSkipOther) {
          $inputSkipOther.bind('focus', textFieldFocus);
          $inputSkipOther.bind('blur', textFieldBlur);
        }

        $(document).bind('keyup', documentKeyUp);
        $(document).bind('keydown', documentKeyDown);
        $(document).bind('mouseup', mouseUp);
    }

    function documentKeyDown(e) {
        // The callback method that is triggered with a keyUp event.
        if (!status.focusOnTextField) {
          if ('tracker' in svw) {
            svw.tracker.push('KeyDown', {'keyCode': e.keyCode});
          }
            switch (e.keyCode) {
                case 16:
                    // "Shift"
                    status.shiftDown = true;
                    break;
            }
        }
    }

    function documentKeyUp (e) {
        // console.log(e.keyCode);

        // This is a callback method that is triggered when a keyDown event occurs.
        if (!status.focusOnTextField) {
          if ('tracker' in svw) {
            svw.tracker.push('KeyUp', {'keyCode': e.keyCode});
          }
            switch (e.keyCode) {
                case 16:
                    // "Shift"
                    status.shiftDown = false;
                    break;
                case 27:
                    // "Escape"
                    svw.canvas.cancelDrawing();
                    break;
                case 67:
                    // "c" for CurbRamp. Switch the mode to the CurbRamp labeling mode.
                    svw.ribbon.modeSwitchClick("CurbRamp");
                    break
                case 69:
                    // "e" for Explore. Switch the mode to Walk (camera) mode.
                    svw.ribbon.modeSwitchClick("Walk");
                    break;
                case 77:
                    // "m" for MissingCurbRamp. Switch the mode to the MissingCurbRamp labeling mode.
                    svw.ribbon.modeSwitchClick("NoCurbRamp");
                    break;
                case 90:
                    // "z" for zoom. By default, it will zoom in. If "shift" is down, it will zoom out.
                    if (status.shiftDown) {
                        // Zoom out
                        if ("zoomControl" in svw) {
                            svw.zoomControl.zoomOut();
                        }
                    } else {
                        // Zoom in
                        if ("zoomControl" in svw)
                            svw.zoomControl.zoomIn();
                    }
            }
        }
    }

    function mouseUp (e) {
        // A call back method for mouseup. Capture a right click and do something.
        // Capturing right click in javascript.
        // http://stackoverflow.com/questions/2405771/is-right-click-a-javascript-event
        var isRightMB;
        e = e || window.event;

        if ("which" in e)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
            isRightMB = e.which == 3;
        else if ("button" in e)  // IE, Opera
            isRightMB = e.button == 2;

        if (isRightMB) {
            oPublic.clearShiftDown();
        }
    }

    function textFieldBlur () {
        // This is a callback function called when any of the text field is blurred.
        status.focusOnTextField = false
    }

    function textFieldFocus () {
        // This is a callback function called when any of the text field is focused.
        status.focusOnTextField = true;
    }

    ////////////////////////////////////////
    // Public methods
    ////////////////////////////////////////
    oPublic.clearShiftDown = function () {
        // This method turn status.shiftDown to false.
        status.shiftDown = false;
        return this;
    };

    oPublic.getStatus = function (key) {
        if (!(key in status)) {
          console.warn("You have passed an invalid key for status.")
        }
        return status[key];
    };

    oPublic.isShiftDown = function () {
        // This method returns whether a shift key is currently pressed or not.
        return status.shiftDown;
    };

    oPublic.setStatus = function (key, value) {
      if (key in status) {
        status[key] = value;
      }
      return this;
    };

    init();
    return oPublic;
}

var svw = svw || {}; // Street View Walker namespace.

////////////////////////////////////////////////////////////////////////////////
// Label class
////////////////////////////////////////////////////////////////////////////////
function Label (pathIn, params) {
    var oPublic = {
        className: 'Label'
    };

    // Path
    var path = undefined;

    var properties = {
        canvasWidth: undefined,
        canvasHeight: undefined,
        canvasDistortionAlphaX: undefined,
        canvasDistortionAlphaY: undefined,
        labelerId : 'DefaultValue',
        labelId: 'DefaultValue',
        labelType: undefined,
        labelDescription: undefined,
        labelFillStyle: undefined,
        panoId: undefined,
        panoramaLat: undefined,
        panoramaLng: undefined,
        panoramaHeading: undefined,
        panoramaPitch: undefined,
        panoramaZoom: undefined,
        photographerHeading: undefined,
        photographerPitch: undefined,
        svImageWidth: undefined,
        svImageHeight: undefined,
        svMode: undefined,
        tagHeight: 20,
        tagWidth: 1,
        tagX: -1,
        tagY: -1
    };

    var status = {
        'deleted' : false,
        'tagVisibility' : 'visible',
        'visibility' : 'visible'
    };

    var lock = {
        tagVisibility: false,
        visibility : false
    };


    //
    // Private functions
    //
    function init (param, pathIn) {
        try {
            if (!pathIn) {
                var errMsg = 'The passed "path" is empty.';
                throw errMsg;
            } else {
                path = pathIn;
            }
            for (attrName in properties) {
                // It is ok if some attributes are not passed as parameters
                if ((attrName === 'tagHeight' ||
                     attrName === 'tagWidth' ||
                     attrName === 'tagX' ||
                     attrName === 'tagY' ||
                     attrName === 'labelerId' ||
                     attrName === 'photographerPov' ||
                     attrName === 'photographerHeading' ||
                     attrName === 'photographerPitch'
                    ) &&
                    !param[attrName]) {
                    continue;
                }

                // Check if all the necessary properties are set in param.
                // Checking paroperties:
                // http://www.nczonline.net/blog/2010/07/27/determining-if-an-object-property-exists/
                if (!(attrName in param)) {
                    var errMsg = '"' + attrName + '" is not in the passed parameter.';
                    throw errMsg;
                }
                properties[attrName] = param[attrName];
            }

            // If the labelType is a "Stop Sign", do not show a tag
            // as a user has to select which type of a stop sign it is
            // (e.g. One-leg, Two-leg, etc)
            // if (properties.labelProperties.labelType === "StopSign") {
            if (false) {
                status.tagVisibility = 'hidden';
            }

            // Set belongs to of the path.
            path.setBelongsTo(oPublic);

            return true;
        } catch (e) {
            console.error(oPublic.className, ':', 'Error initializing the Label object.', e);
            return false;
        }
    };

    function renderTag(ctx) {
        // This function renders a tag on a canvas to show a property of the label
        if (arguments.length !== 3) {
            return false;
        }
        var boundingBox = path.getBoundingBox();

        // Prepare a label message
        var msg = properties.labelDescription;
        var messages = msg.split('\n');

        if (properties.labelerId !== 'DefaultValue') {
            messages.push('Labeler: ' + properties.labelerId);
        }

        ctx.font = '10.5pt Calibri';
        var height = properties.tagHeight * messages.length;
        var width = -1;
        for (var i = 0; i < messages.length; i += 1) {
            var w = ctx.measureText(messages[i]).width + 5;
            if (width < w) {
                width = w;
            }
        }
        properties.tagWidth = width;

        var tagX;
        var tagY;
        ctx.save();
        ctx.lineWidth = 3.5;
        ctx.fillStyle = 'rgba(255,255,255,1)';
        ctx.strokeStyle = 'rgba(255,255,255,1)';
        ctx.beginPath();
        var connectorX = 15;
        if (connectorX > boundingBox.width) {
            connectorX = boundingBox.width - 1;
        }

        if (boundingBox.x < 5) {
            tagX = 5;
        } else {
            tagX = boundingBox.x;
        }

        if (boundingBox.y + boundingBox.height < 400) {
            ctx.moveTo(tagX + connectorX, boundingBox.y + boundingBox.height);
            ctx.lineTo(tagX + connectorX, boundingBox.y + boundingBox.height + 10);
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
            tagY = boundingBox.y + boundingBox.height + 10;
        } else {
            ctx.moveTo(tagX + connectorX, boundingBox.y);
            ctx.lineTo(tagX + connectorX, boundingBox.y - 10);
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
            // tagX = boundingBox.x;
            tagY = boundingBox.y - height - 20;
        }


        var r = 3;
        var paddingLeft = 16;
        var paddingRight = 30;
        var paddingBottom = 10;

        // Set rendering properties
        ctx.save();
        ctx.lineCap = 'square';
        ctx.lineWidth = 2;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'; // point.getProperty('fillStyleInnerCircle');
        ctx.strokeStyle = 'rgba(255,255,255,1)'; // point.getProperty('strokeStyleOuterCircle');
        //point.getProperty('lineWidthOuterCircle');

        // Draw a tag
        ctx.beginPath();
        ctx.moveTo(tagX, tagY);
        ctx.lineTo(tagX + width + paddingLeft + paddingRight, tagY);
        ctx.lineTo(tagX + width + paddingLeft + paddingRight, tagY + height + paddingBottom);
        ctx.lineTo(tagX, tagY + height + paddingBottom);
        ctx.lineTo(tagX, tagY);
//        ctx.moveTo(tagX, tagY - r);
//        ctx.lineTo(tagX + width - r, tagY - r);
//        ctx.arc(tagX + width, tagY, r, 3 * Math.PI / 2, 0, false); // Corner
//        ctx.lineTo(tagX + width + r, tagY + height - r);
//        ctx.arc(tagX + width, tagY + height, r, 0, Math.PI / 2, false); // Corner
//        ctx.lineTo(tagX + r, tagY + height + r);
//        ctx.arc(tagX, tagY + height, r, Math.PI / 2, Math.PI, false); // Corner
//        ctx.lineTo(tagX - r, tagY); // Corner

        ctx.fill();
        ctx.stroke()
        ctx.closePath();
        ctx.restore();

        // Render an icon and a message
        ctx.save();
        ctx.fillStyle = '#000';
        var labelType = properties.labelType;
        var iconImagePath = getLabelIconImagePath()[labelType].iconImagePath;
        var imageObj;
        var imageHeight;
        var imageWidth;
        var imageX;
        var imageY;
        imageObj = new Image();
        imageHeight = imageWidth = 25;
        imageX =  tagX + 5;
        imageY = tagY + 2;

        //imageObj.onload = function () {

        ///            };
        // ctx.globalAlpha = 0.5;
        imageObj.src = iconImagePath;
        ctx.drawImage(imageObj, imageX, imageY, imageHeight, imageWidth);

        for (var i = 0; i < messages.length; i += 1) {
            ctx.fillText(messages[i], tagX + paddingLeft + 20, tagY + 20 + 20 * i);
        }
        // ctx.fillText(msg, tagX, tagY + 17);
        ctx.restore();

        return;
    };

    function showDelete() {
        if (status.tagVisibility !== 'hidden') {
            var boundingBox = path.getBoundingBox();
            var x = boundingBox.x + boundingBox.width - 20;
            var y = boundingBox.y;

            // Show a delete button
            var $divHolderLabelDeleteIcon = $("#Holder_LabelDeleteIcon");
            $divHolderLabelDeleteIcon.css({
                'visibility': 'visible',
                'left' : x, // + width - 5,
                'top' : y
            });
        }
    };

    ////////////////////////////////////////
    // Public functions
    ////////////////////////////////////////

    oPublic.blink = function (numberOfBlinks, fade) {
        // Blink (highlight and fade) the color of this label. If fade is true, turn the label into gray;
        if (!numberOfBlinks) {
            numberOfBlinks = 3;
        } else if (numberOfBlinks < 0) {
            numberOfBlinks = 0;
        }
        var interval;
        var highlighted = true;
        var path = oPublic.getPath();
        var points = path.getPoints();

        var i;
        var len = points.length;

        var fillStyle = 'rgba(200,200,200,0.1)';
        var fillStyleHighlight = path.getFillStyle();

        interval = setInterval(function () {
            if (numberOfBlinks > 0) {
                if (highlighted) {
                    highlighted = false;
                    path.setFillStyle(fillStyle);
                    for (i = 0; i < len; i++) {
                        points[i].setFillStyle(fillStyle);
                    }
                    svw.canvas.clear().render2();
                } else {
                    highlighted = true;
                    path.setFillStyle(fillStyleHighlight);
                    for (i = 0; i < len; i++) {
                        points[i].setFillStyle(fillStyleHighlight);
                    }
                    svw.canvas.clear().render2();
                    numberOfBlinks -= 1;
                }
            } else {
                if (fade) {
                    path.setFillStyle(fillStyle);
                    for (i = 0; i < len; i++) {
                        points[i].setFillStyle(fillStyle);
                    }
                    svw.canvas.clear().render2();
                }

                oPublic.setAlpha(0.05);
                svw.canvas.clear().render2();
                window.clearInterval(interval);
            }
        }, 500);

        return this;
    };

    oPublic.fadeFillStyle = function (mode) {
        // This method turn the associated Path and Points into gray.
        var path = oPublic.getPath();
        var points = path.getPoints()
        var i = 0;
        var len = points.length;
        var fillStyle = undefined;

        if (!mode) {
            mode = 'default';
        }

        if (mode === 'gray') {
            fillStyle = 'rgba(200,200,200,0.5)';
        } else {
            // fillStyle = path.getFillStyle();
            // fillStyle = svw.util.color.changeDarknessRGBA(fillStyle, 0.9);
            // fillStyle = svw.util.color.changeAlphaRGBA(fillStyle, 0.1);
            fillStyle = 'rgba(255,165,0,0.8)';
        }
        path.setFillStyle(fillStyle);
        for (; i < len; i++) {
            points[i].setFillStyle(fillStyle);
        }
        return this;
    };

    oPublic.getBoundingBox = function (pov) {
        // This method returns the boudning box of the label's outline.
        var path = oPublic.getPath();
        return path.getBoundingBox(pov);
    };

    oPublic.getCoordinate = function () {
        // This function returns the coordinate of a point.
        if (path && path.points.length > 0) {
            var pov = path.getPOV();
            return $.extend(true, {}, path.points[0].getCanvasCoordinate(pov));
        }
        return path;
    };

    oPublic.getGSVImageCoordinate = function () {
        // This function return the coordinate of a point in the GSV image coordinate.
        if (path && path.points.length > 0) {
            return path.points[0].getGSVImageCoordinate();
        }
    };

    oPublic.getImageCoordinates = function () {
        // This function returns
        if (path) {
            return path.getImageCoordinates();
        }
        return false;
    };

    oPublic.getLabelId = function () {
        // This function returns labelId property
        return properties.labelId;
    };

    oPublic.getLabelType = function () {
        // This function returns labelType property
        return properties.labelType;
    };

    oPublic.getPath = function (reference) {
        // This function returns the coordinate of a point.
        // If reference is true, return a reference to the path instead of a copy of the path
        if (path) {
            if (reference) {
                return path;
            } else {
                return $.extend(true, {}, path);
            }
        }
        return false;
    };

    oPublic.getPoint = function () {
        // This function returns the coordinate of the first point in the path.
        if (path && path.points.length > 0) {
            return path.points[0];
        }
        return path;
    };

    oPublic.getPoints = function (reference) {
        // This function returns the point objects that constitute the path
        // If reference is set to true, return the reference to the points
        if (path) {
            return path.getPoints(reference);
        } else {
            return false;
        }
    };

    oPublic.getLabelPov = function () {
        // Return the pov of this label
        var heading;//  = parseInt(properties.panoramaHeading, 10);
        var pitch = parseInt(properties.panoramaPitch, 10);
        var zoom = parseInt(properties.panoramaZoom, 10);

        var points = oPublic.getPoints();
        var svImageXs = points.map(function(point) {return point.svImageCoordinate.x;});

        if (svImageXs.max() - svImageXs.min() > (svw.svImageWidth / 2)) {
            svImageXs = svImageXs.map(function (x) {
                if (x < (svw.svImageWidth / 2)) {
                    x += svw.svImageWidth;
                }
                return x;
            })
            var labelSvImageX = parseInt(svImageXs.mean(), 10) % svw.svImageWidth;
        } else {
            var labelSvImageX = parseInt(svImageXs.mean(), 10);
        }
        heading = parseInt((labelSvImageX / svw.svImageWidth) * 360, 10) % 360;

        return {
            heading: parseInt(heading, 10),
            pitch: pitch,
            zoom: zoom
        };
    };

    oPublic.getProperties = function () {
        // Return the deep copy of the properties object,
        // so the caller can only modify properties from
        // setProperties() (which I have not implemented.)
        //
        // JavaScript Deepcopy
        // http://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-clone-a-javascript-object
        return $.extend(true, {}, properties);
    };

    oPublic.getProperty = function (propName) {
        if (!(propName in properties)) {
            return false;
        }
        return properties[propName];
    };

    oPublic.getstatus = function (key) {
        return status[key];
    }

    oPublic.getVisibility = function () {
        return status.visibility;
    };

    oPublic.fill = function (fill) {
        // This method changes the fill color of the path and points that constitute the path.
        var path = oPublic.getPath();
        var points = path.getPoints()
        var i = 0;
        var len = points.length;

        path.setFillStyle(fill);
        for (; i < len; i++) {
            points[i].setFillStyle(fill);
        }
        return this;
    };

    oPublic.highlight = function () {
        // This method changes the fill color of the path and points to orange.
        var fillStyle = 'rgba(255,165,0,0.8)';
        return oPublic.fill(fillStyle);
    };

    oPublic.isDeleted = function () {
        return status.deleted;
    };


    oPublic.isOn = function (x, y) {
        // This function checks if a path is under a cursor
        if (status.deleted ||
            status.visibility === 'hidden') {
            return false;
        }

        var result = path.isOn(x, y);
        if (result) {
            return result;
        } else {
            return false;

            var margin = 20;
            if (properties.tagX - margin < x &&
                properties.tagX + properties.tagWidth + margin > x &&
                properties.tagY - margin < y &&
                properties.tagY + properties.tagHeight + margin > y) {
                // The mouse cursor is on the tag.
                return this;
            } else {
                return false;
            }
        }
    };


    oPublic.isVisible = function () {
        // This method returns the visibility of this label.
        if (status.visibility === 'visible') {
            return true;
        } else {
            return false;
        }
    };

    oPublic.lockTagVisibility = function () {
        lock.tagVisibility = true;
        return this;
    };


    oPublic.lockVisibility = function () {
        lock.visibility = true;
        return this;
    };

    oPublic.overlap = function (label, mode) {
        // This method calculates the area overlap between this label and another label passed as an argument.
        if (!mode) {
            mode = "boundingbox";
        }

        if (mode !== "boundingbox") {
            throw oPublic.className + ": " + mobede + " is not a valid option.";
        }
        var path1 = oPublic.getPath();
        var path2 = label.getPath();

        return path1.overlap(path2, mode);
    };

    oPublic.removePath = function () {
        // This function removes the path and points in the path.
        path.removePoints();
        path = undefined;
    };


    oPublic.render = function (ctx, pov, evaluationMode) {
        if (!evaluationMode) {
            evaluationMode = false;
        }

        if (!status.deleted &&
            status.visibility === 'visible') {
            // Render a tag
            // Get a text to render (e.g, attribute type), and
            // canvas coordinate to render the tag.
            if(status.tagVisibility === 'visible') {
                var labelType =  properties.labelDescription;

                if (!evaluationMode) {
                    renderTag(ctx);
                    path.renderBoundingBox(ctx);
                    showDelete();
                    //showDelete(path);
                }
            }

            // Render a path
            path.render2(ctx, pov);
        }
        return this;
    };

    oPublic.resetFillStyle = function () {
        // This method turn the fill color of associated Path and Points into their original color.
        var path = oPublic.getPath();
        var points = path.getPoints()
        var i = 0;
        var len = points.length;
        path.resetFillStyle();
        for (; i < len; i++) {
            points[i].resetFillStyle();
        }
        return this;
    };

    oPublic.resetTagCoordinate = function () {
        // This function sets properties.tag.x and properties.tag.y to 0
        properties.tagX = 0;
        properties.tagY = 0;
        return this;
    };

    oPublic.setAlpha = function (alpha) {
        // This method changes the alpha channel of the fill color of the path and points that constitute the path.
        var path = oPublic.getPath();
        var points = path.getPoints()
        var i = 0;
        var len = points.length;
        var fill = path.getFillStyle();

        fill = svw.util.color.changeAlphaRGBA(fill, 0.3);

        path.setFillStyle(fill);
        for (; i < len; i++) {
            points[i].setFillStyle(fill);
        }
        return this;
    };

    oPublic.setIconPath = function (iconPath) {
        // This function sets the icon path of the point this label holds.
        if (path && path.points[0]) {
            var point = path.points[0];
            point.setIconPath(iconPath);
            return this;
        }
        return false;
    };


    oPublic.setLabelerId = function (labelerIdIn) {
        properties.labelerId = labelerIdIn;
        return this;
    };


    oPublic.setStatus = function (key, value) {
        if (key in status) {
            if (key === 'visibility' &&
                (value === 'visible' || value === 'hidden')) {
                // status[key] = value;
                oPublic.setVisibility(value);
            } else if (key === 'tagVisibility' &&
                (value === 'visible' || value === 'hidden')) {
                oPublic.setTagVisibility(value);
            } else if (key === 'deleted' && typeof value === 'boolean') {
                status[key] = value;
            }
        }
    };


    oPublic.setTagVisibility = function (visibility) {
        if (!lock.tagVisibility) {
            if (visibility === 'visible' ||
                visibility === 'hidden') {
                status['tagVisibility'] = visibility;
            }
        }
        return this;
    };


    oPublic.setSubLabelDescription = function (labelType) {
        // This function sets the sub label type of this label.
        // E.g. for a bus stop there are StopSign_OneLeg
        var labelDescriptions = getLabelDescriptions();
        var labelDescription = labelDescriptions[labelType].text;
        properties.labelProperties.subLabelDescription = labelDescription;
        return this;
    };


    oPublic.setVisibility = function (visibility) {
        if (!lock.visibility) {
            status.visibility = visibility;
        }
        return this;
    };


    oPublic.setVisibilityBasedOnLocation = function (visibility, panoId) {
        if (!status.deleted) {
            if (panoId === properties.panoId) {
                // oPublic.setStatus('visibility', visibility);
                oPublic.setVisibility(visibility);
            } else {
                visibility = visibility === 'visible' ? 'hidden' : 'visible';
                // oPublic.setStatus('visibility', visibility);
                oPublic.setVisibility(visibility);
            }
        }
        return this;
    };


    oPublic.setVisibilityBasedOnLabelerId = function (visibility, labelerIds, included) {
        // if included is true and properties.labelerId is in labelerIds, then set this
        // label's visibility to the passed visibility
        if (included === undefined) {
            if (labelerIds.indexOf(properties.labelerId) !== -1) {
                oPublic.unlockVisibility().setVisibility(visibility).lockVisibility();
            } else {
                visibility = visibility === 'visible' ? 'hidden' : 'visible';
                oPublic.unlockVisibility().setVisibility(visibility).lockVisibility();
            }
        } else {
            if (included) {
                if (labelerIds.indexOf(properties.labelerId) !== -1) {
                    oPublic.unlockVisibility().setVisibility(visibility).lockVisibility();
                }
            } else {
                if (labelerIds.indexOf(properties.labelerId) === -1) {
                    oPublic.unlockVisibility().setVisibility(visibility).lockVisibility();
                }
            }
        }

        return this;
    };


    oPublic.setVisibilityBasedOnLabelerIdAndLabelTypes = function (visibility, tables, included) {
        var i;
        var tablesLen = tables.length;
        var matched = false;

        for (i = 0; i < tablesLen; i += 1) {
            if (tables[i].userIds.indexOf(properties.labelerId) !== -1) {
                if (tables[i].labelTypesToRender.indexOf(properties.labelProperties.labelType) !== -1) {
                    matched = true;
                }
            }
        }
        if (included === undefined) {
            if (matched) {
                oPublic.unlockVisibility().setVisibility(visibility).lockVisibility();
            } else {
                visibility = visibility === 'visible' ? 'hidden' : 'visible';
                oPublic.unlockVisibility().setVisibility(visibility).lockVisibility();
            }
        } else {
            if (included) {
                if (matched) {
                    oPublic.unlockVisibility().setVisibility(visibility).lockVisibility();
                }
            } else {
                if (!matched) {
                    oPublic.unlockVisibility().setVisibility(visibility).lockVisibility();
                }
            }
        }
    };


    oPublic.unlockTagVisibility = function () {
        lock.tagVisibility = false;
        return this;
    };


    oPublic.unlockVisibility = function () {
        lock.visibility = false;
        return this;
    };

    ////////////////////////////////////////
    // Tests
    ////////////////////////////////////////
    oPublic.runTestCases = function () {
        module('Label tests');

        test('functioning', function () {
            ok(true, 'Test');
        });
    };

    //
    // Initialize
    //
    if (!init(params, pathIn)) {
        return false;
    }
    return oPublic;
}

function LabeledLandmarkFeedback ($, params) {
    var self = { className : 'LabeledLandmarkFeedback' };
    var properties = {};
    var status = {};

    // jQuery eleemnts
    var $labelCountCurbRamp;
    var $labelCountNoCurbRamp;
    var $submittedLabelMessage;

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions
    ////////////////////////////////////////////////////////////////////////////////
    function _init (params) {
      //
      // Initialize the jQuery DOM elements
      if (svw.ui && svw.ui.ribbonMenu) {
        $labelCountCurbRamp = svw.ui.labeledLandmark.curbRamp;
        $labelCountNoCurbRamp = svw.ui.labeledLandmark.noCurbRamp;
        $submittedLabelMessage = svw.ui.labeledLandmark.submitted;

        $labelCountCurbRamp.html(0);
        $labelCountNoCurbRamp.html(0);
      }
    }


    ////////////////////////////////////////////////////////////////////////////////
    // Public functions
    ////////////////////////////////////////////////////////////////////////////////
    self.setLabelCount = function (labelCount) {
        // This method takes labelCount object that holds label names with
        // corresponding label counts. This function sets the label counts
        // that appears in the feedback window.
        if (svw.ui && svw.ui.ribbonMenu) {
          $labelCountCurbRamp.html(labelCount['CurbRamp']);
          $labelCountNoCurbRamp.html(labelCount['NoCurbRamp']);
        }
        return this;
    };

    self.setSubmittedLabelMessage = function (param) {
        // This method takes a param and sets the submittedLabelCount
        if (!param) {
            return this;
        }
        if (svw.ui && svw.ui.ribbonMenu) {
          if ('message' in param) {
              $submittedLabelMessage.html(message);
          } else if ('numCurbRampLabels' in param && 'numMissingCurbRampLabels' in param) {
              var message = "You've submitted <b>" +
                  param.numCurbRampLabels +
                  "</b> curb ramp labels and <br /><b>" +
                  param.numMissingCurbRampLabels +
                  "</b> missing curb ramp labels.";
              $submittedLabelMessage.html(message);
          }
        }
        return this;
    };

    _init(params);
    return self;
}

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


////////////////////////////////////////
// Street View Global functions that can
// be accessed from anywhere
////////////////////////////////////////
// Get the camera point-of-view (POV)
// http://www.geocodezip.com/v3_Streetview_lookAt.html?lat=34.016673&lng=-118.501322&zoom=18&type=k
var svw = svw || {};
var panorama;
svw.panorama = panorama;

//
// Helper functions
//
function getPanoId() {
    if (svw.panorama) {
        var panoId = svw.panorama.getPano();
        return panoId;
    } else {
        throw 'getPanoId() (in Map.js): panorama not defined.'
    }
}
svw.getPanoId = getPanoId;


function getPosition() {
    if (svw.panorama) {
        var pos = svw.panorama.getPosition();
        if (pos) {
            var ret = {
                'lat' : pos.lat(),
                'lng' : pos.lng()
            };
            return ret;
        }
    } else {
        throw 'getPosition() (in Map.js): panorama not defined.';
    }
}
svw.getPosition = getPosition;


function getPOV() {
    if (svw.panorama) {
        var pov = svw.panorama.getPov();

        // Pov can be less than 0. So adjust it.
        while (pov.heading < 0) {
            pov.heading += 360;
        }

        // Pov can be more than 360. Adjust it.
        while (pov.heading > 360) {
            pov.heading -= 360;
        }
        return pov;
    } else {
        throw 'getPOV() (in Map.js): panoarama not defined.';
    }
}
svw.getPOV = getPOV;


function getLinks () {
    if (svw.panorama) {
        var links = svw.panorama.getLinks();
        return links;
    } else {
        throw 'getLinks() (in Map.js): panorama not defined.';
    }
}
svw.getLinks = getLinks;

//
// Fog related variables.
var fogMode = true;
var fogSet = false;
var current;
var first;
var previousPoints = [];
var radius = .1;
var isNotfirst = 0;
var paths;
svw.fog = undefined;;
var au = [];
var pty = [];
//au = adjustFog(fog, current.lat(), current.lng(), radius);
var polys = [];


//
// Map Class Constructor
//
function Map (params) {
    var self = {className: 'Map'};
    var canvas;
    var overlayMessageBox;
    var className = 'Map';

    var mapIconInterval = undefined;
    var lock = {
        renderLabels : false
    };
    var markers = [];
    // properties
    var properties = {
        browser : 'unknown',
        latlng : {
            lat : undefined,
            lng : undefined
        },
        initialPanoId : undefined,
        panoramaPov : {
            heading : 359,
            pitch : -10,
            zoom : 1
        },
        maxPitch: 0,
        minPitch: -35,
        minHeading: undefined,
        maxHeading: undefined,
        mode : 'Labeling',
        isInternetExplore: undefined
    };
    var status = {
        availablePanoIds : undefined,
        currentPanoId: undefined,
        disableWalking : false,
        hideNonavailablePanoLinks : false,
        lockDisableWalking : false,
        panoLinkListenerSet: false,
        svLinkArrowsLoaded : false
    };

        // Street view variables
    var panoramaOptions;

        // Mouse status and mouse event callback functions
    var mouseStatus = {
            currX:0,
            currY:0,
            prevX:0,
            prevY:0,
            leftDownX:0,
            leftDownY:0,
            leftUpX:0,
            leftUpY:0,
            isLeftDown:false
        };

    // Maps variables
    var fenway;
    var map;
    var mapOptions;
    var mapStyleOptions;
    var fogParam = {
        interval: undefined,
        ready: undefined
    };
    var svgListenerAdded = false;

    // Street View variables
    var streetViewInit = undefined;

    // jQuery doms
    var $canvas;
    var $divLabelDrawingLayer;
    var $divPano;
    var $divStreetViewHolder;
    var $divViewControlLayer;
    var $spanModeSwitchWalk;
    var $spanModeSwitchDraw;


    ////////////////////////////////////////
    // Initialization
    ////////////////////////////////////////
    // Map UI setting
    // http://www.w3schools.com/googleAPI/google_maps_controls.asp
    if (params.panoramaPov) {
        properties.panoramaPov = params.panoramaPov;
    } else {
        properties.panoramaPov = {
            heading: 0,
            pitch: 0,
            zoom: 1
        };
    }
    if (params.latlng) {
        properties.latlng = params.latlng;
    } else if (('Lat' in params) && ('Lng' in params)) {
        properties.latlng = {'lat': params.Lat, 'lng': params.Lng};
    } else {
        throw self.className + ': latlng not defined.';
    }

    // fenway = new google.maps.LatLng(params.targetLat, params.targetLng);
    fenway = new google.maps.LatLng(properties.latlng.lat, properties.latlng.lng);

    mapOptions = {
        center: fenway,
        mapTypeControl:false,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        maxZoom : 20,
        minZoom : 14,
        overviewMapControl:false,
        panControl:false,
        rotateControl:false,
        scaleControl:false,
        streetViewControl:true,
        zoomControl:false,
        zoom: 18
    };

    var mapCanvas = document.getElementById("google-maps");
    map = new google.maps.Map(mapCanvas, mapOptions);

    // Styling google map.
    // http://stackoverflow.com/questions/8406636/how-to-remove-all-from-google-map
    // http://gmaps-samples-v3.googlecode.com/svn/trunk/styledmaps/wizard/index.html
    mapStyleOptions = [
        {
            featureType: "all",
            stylers: [
                { visibility: "off" }
            ]
        },
        {
            featureType: "road",
            stylers: [
                { visibility: "on" }
            ]
        },
        {
            "elementType": "labels",
            "stylers": [
                { "visibility": "off" }
            ]
        }
    ];


    map.setOptions({styles: mapStyleOptions});

    function init(params) {
        self.properties = properties; // Make properties public.
        properties.browser = getBrowser();

        // canvas = params.canvas;
        overlayMessageBox = params.overlayMessageBox;


        // Set GSV panorama options
        // To not show StreetView controls, take a look at the following gpage
        // http://blog.mridey.com/2010/05/controls-in-maps-javascript-api-v3.html
        //
        // This is awesome... There is a hidden option called 'mode' in the SV panoramaOption.
        // https://groups.google.com/forum/?fromgroups=#!topic/google-maps-js-api-v3/q-SjeW19TJw
        if (params.taskPanoId) {
            panoramaOptions = {
                mode : 'html4',
                // position: fenway,
                pov: properties.panoramaPov,
                pano: params.taskPanoId
            };
        } else if (params.Lat && params.Lng) {
            fenway = new google.maps.LatLng(params.Lat, params.Lng);
            panoramaOptions = {
                mode : 'html4',
                position: fenway,
                pov: properties.panoramaPov
            };

            throw self.className + ' init(): Specifying a dropping point with a latlng coordinate is no longer a good idea. It does not drop the pegman on the specified position.';
        } else {
            throw self.className + ' init(): The pano id nor panorama position is give. Cannot initialize the panorama.';
        }

        var panoCanvas = document.getElementById('pano');
        svw.panorama = new google.maps.StreetViewPanorama(panoCanvas,panoramaOptions);
        svw.panorama.set('addressControl', false);
        svw.panorama.set('clickToGo', false);
        svw.panorama.set('disableDefaultUI', true);
        svw.panorama.set('linksControl', true);
        svw.panorama.set('navigationControl', false);
        svw.panorama.set('panControl', false);
        svw.panorama.set('zoomControl', false);

        properties.initialPanoId = params.taskPanoId;
        $canvas = svw.ui.map.canvas;
        $divLabelDrawingLayer = svw.ui.map.drawingLayer;
        $divPano = svw.ui.map.pano;
        $divStreetViewHolder = svw.ui.map.streetViewHolder;
        $divViewControlLayer = svw.ui.map.viewControlLayer;
        $spanModeSwitchWalk = svw.ui.map.modeSwitchWalk;
        $spanModeSwitchDraw = svw.ui.map.modeSwitchDraw;

        // Set so the links to panoaramas that are not listed on availablePanoIds will be removed
        status.availablePanoIds = params.availablePanoIds;

        // Attach listeners to dom elements
        $divViewControlLayer.bind('mousedown', viewControlLayerMouseDown);
        $divViewControlLayer.bind('mouseup', viewControlLayerMouseUp);
        $divViewControlLayer.bind('mousemove', viewControlLayerMouseMove);
        $divViewControlLayer.bind('mouseleave', viewControlLayerMouseLeave);


        // Add listeners to the SV panorama
        // https://developers.google.com/maps/documentation/javascript/streetview#StreetViewEvents
        google.maps.event.addListener(svw.panorama, "pov_changed", povUpdated);
        google.maps.event.addListener(svw.panorama, "position_changed", povUpdated);
        google.maps.event.addListener(svw.panorama, "pano_changed", updateMap);

        // Connect the map view and panorama view
        map.setStreetView(svw.panorama);

        // Set it to walking mode initially.
        google.maps.event.addListenerOnce(svw.panorama, "pano_changed", self.modeSwitchWalkClick);

        streetViewInit = setInterval(initStreetView, 100);

        //
        // Set the fog parameters
        // Comment out to disable the fog feature.
        if ("onboarding" in svw &&
            svw.onboarding &&
            svw.onboarding.className === "Onboarding_LabelingCurbRampsDifficultScene") { //"zoomViewAngles" in params) {
            fogParam.zoomViewAngles = [Math.PI / 2, Math.PI / 4, Math.PI / 8];
        }
        fogParam.interval = setInterval(initFog, 250);

        // Hide the dude on the top-left of the map.
        mapIconInterval = setInterval(removeIcon, 0.2);

        //
        // For Internet Explore, append an extra canvas in viewControlLayer.
        properties.isInternetExplore = $.browser['msie'];
        if (properties.isInternetExplore) {
            $divViewControlLayer.append('<canvas width="720px" height="480px"  class="Window_StreetView" style=""></canvas>');
        }
    }

    function removeIcon() {
        var doms = $('.gmnoprint');
        if (doms.length > 0) {
            window.clearInterval(mapIconInterval);
            $.each($('.gmnoprint'), function (i, v) {
                var $images = $(v).find('img');
                if ($images) {
                    $images.css('visibility', 'hidden');
                }
            });
        }
    }

    ////////////////////////////////////////
    // Private functions
    ////////////////////////////////////////
    function disableWalking () {
        // This method hides links on SV and disables users from walking.
        if (!status.lockDisableWalking) {
            // Disable clicking links and changing POV
            hideLinks();
            $spanModeSwitchWalk.css('opacity', 0.5);
            status.disableWalking = true;
        }
    }

    function enableWalking () {
        // This method shows links on SV and enables users to walk.
        if (!status.lockDisableWalking) {
            // Enable clicking links and changing POV
            showLinks();
            $spanModeSwitchWalk.css('opacity', 1);
            status.disableWalking = false;
        }
    }

    function fogUpdate () {
        var pov = svw.getPOV();

        if (pov) {
            var heading = pov.heading;
            var dir = heading * (Math.PI / 180);
            svw.fog.updateFromPOV(current, radius, dir, Math.PI/2);
        }
        return;
    }

    function getPanoramaLayer () {
        // Returns a panorama dom element that is dynamically created by GSV API
        return $divPano.children(':first').children(':first').children(':first').children(':eq(5)');
    }

    function getLinkLayer () {
        // Get svg element (arrows) in Street View.
        return $divPano.find('svg').parent();
    }

    function hideLinks () {
        // Hide links by chaging the svg path elements' visibility to hidden.
        if (properties.browser === 'chrome') {
            // Somehow chrome does not allow me to select path
            // and fadeOut. Instead, I'm just manipulating path's style
            // and making it hidden.
            $('path').css('visibility', 'hidden');
        } else {
            // $('path').fadeOut(1000);
            $('path').css('visibility', 'hidden');
        }
    }

    function makeLinksClickable () {
        // Bring the layer with arrows forward.
        var $links = getLinkLayer();
        $divViewControlLayer.append($links);

        if (properties.browser === 'mozilla') {
            // A bug in Firefox? The canvas in the div element with the largest z-index.
            $divViewControlLayer.append($canvas);
        } else if (properties.browser === 'msie') {
            $divViewControlLayer.insertBefore($divLabelDrawingLayer);
        }
    }

    function initFog () {
        // Initialize the fog on top of the map.
        if (current) {
            fogParam.center = current;
            fogParam.radius = 200;

            current = svw.panorama.getPosition();
            svw.fog = new Fog(map, fogParam);
            fogSet = true;
            window.clearInterval(fogParam.interval);
            fogUpdate();
        }
    }

    function initStreetView () {
        // Initialize the Street View interface
        var numPath = $divViewControlLayer.find("path").length;
        if (numPath !== 0) {
            status.svLinkArrowsLoaded = true;
            window.clearTimeout(streetViewInit);
        }

        if (!status.svLinkArrowsLoaded) {
            hideLinks();
        }
    }

    function povUpdated () {
        // This is a callback function that is fired when pov is changed
        if (svw.canvas) {
            var latlng = getPosition();
            var heading = svw.getPOV().heading;

            svw.canvas.clear();

            if (status.currentPanoId !== svw
              .getPanoId()) {
            	svw.canvas.setVisibilityBasedOnLocation('visible', svw.getPanoId());
            }
            status.currentPanoId = svw.getPanoId();


            if (properties.mode === 'Evaluation') {
                myTables.updateCanvas();
            }
            svw.canvas.render2();
        }


        // Sean & Vicki Fog code
        if (fogMode && "fog" in svw) {
            current = svw.panorama.getPosition();
            if (current) {
                if (!fogSet) {

                } else {
                    fogUpdate();
                    // var dir = heading * (Math.PI / 180);
                    // fog.updateFromPOV(current, radius, dir, Math.PI/2);
                }
           }
         }

        // Add event listener to svg. Disable walking to far.
        if ($('svg')[0]) {
            if (!svgListenerAdded) {
                svgListenerAdded = true;
                $('svg')[0].addEventListener('mousedown', function (e) {
                    showLinks();
                });
            }
        }
    }

    function setViewControlLayerCursor(type) {
        switch(type) {
            case 'ZoomOut':
                $divViewControlLayer.css("cursor", "url(img/cursors/Cursor_ZoomOut.png) 4 4, move");
                break;
            case 'OpenHand':
                $divViewControlLayer.css("cursor", "url(img/cursors/openhand.cur) 4 4, move");
                break;
            case 'ClosedHand':
                $divViewControlLayer.css("cursor", "url(img/cursors/closedhand.cur) 4 4, move");
                break;
            default:
                $divViewControlLayer.css("cursor", "default");
        }
    }

    function showLinks (delay) {
        // Show links

        // This is kind of redundant, but as long as the link arrows have not been
        // moved to user control layer, keep calling the modeSwitchWalkClick()
        // to bring arrows to the top layer. Once loaded, move svLinkArrowsLoaded to true.
        if (!status.svLinkArrowsLoaded) {
            var numPath = $divViewControlLayer.find("path").length;
            if (numPath === 0) {
                makeLinksClickable();
            } else {
                status.svLinkArrowsLoaded = true;
            }
        }

        if (status.hideNonavailablePanoLinks &&
            status.availablePanoIds) {
            $.each($('path'), function (i, v) {
                if ($(v).attr('pano')) {
                    var panoId = $(v).attr('pano');
                    var idx = status.availablePanoIds.indexOf(panoId);

                    if (idx === -1) {
                        $(v).prev().prev().remove();
                        $(v).prev().remove();
                        $(v).remove();
                    } else {
                        //if (properties.browser === 'chrome') {
                        // Somehow chrome does not allow me to select path
                        // and fadeOut. Instead, I'm just manipulating path's style
                        // and making it hidden.
                        $(v).prev().prev().css('visibility', 'visible');
                        $(v).prev().css('visibility', 'visible');
                        $(v).css('visibility', 'visible');
                    }
                }
            });
        } else {
            if (properties.browser === 'chrome') {
                // Somehow chrome does not allow me to select path
                // and fadeOut. Instead, I'm just manipulating path's style
                // and making it hidden.
                $('path').css('visibility', 'visible');
            } else {
                if (!delay) {
                    delay = 0;
                }
                // $('path').show();
                $('path').css('visibility', 'hidden');
            }
        }
    }

    function updateMap () {
        // This function updates the map pane.
        if (svw.panorama) {
            var panoramaPosition = svw.panorama.getPosition();
            map.setCenter(panoramaPosition);

            if (svw.canvas) {
                svw.canvas.clear();
                svw.canvas.setVisibilityBasedOnLocation('visible', svw.getPanoId());
                if (properties.mode === 'Evaluation') {
                    myTables.updateCanvas();
                }
                svw.canvas.render2();
            }

            if (fogSet) {
                fogUpdate();
            }
        } else {
            throw self.className + ' updateMap(): panorama not defined.';
        }
    }

    function updatePov (dx, dy) {
        // Update POV of Street View as a user drag a mouse cursor.
        if (svw.panorama) {
            var pov = svw.panorama.getPov(),
                alpha = 0.25;

            pov.heading -= alpha * dx;
            pov.pitch += alpha * dy;

            //
            // View port restriction.
            // Do not allow users to look up the sky or down the ground.
            // If specified, do not allow users to turn around too much by restricting the heading angle.
            if (pov.pitch > properties.maxPitch) {
                pov.pitch = properties.maxPitch;
            } else if (pov.pitch < properties.minPitch) {
                pov.pitch = properties.minPitch;
            }

            if (properties.minHeading && properties.maxHeading) {
                if (properties.minHeading <= properties.maxHeading) {
                    if (pov.heading > properties.maxHeading) {
                        pov.heading = properties.maxHeading;
                    } else if (pov.heading < properties.minHeading) {
                        pov.heading = properties.minHeading;
                    }
                } else {
                    if (pov.heading < properties.minHeading &&
                        pov.heading > properties.maxHeading) {
                        if (Math.abs(pov.heading - properties.maxHeading) < Math.abs(pov.heading - properties.minHeading)) {
                            pov.heading = properties.maxHeading;
                        } else {
                            pov.heading = properties.minHeading;
                        }
                    }
                }
            }

            //
            // Set the property this object. Then update the Street View image
            properties.panoramaPov = pov;
            svw.panorama.setPov(pov);
        } else {
            throw className + ' updatePov(): panorama not defined!';
        }
    }

    function viewControlLayerMouseDown (e) {
        // This is a callback function that is fired with the mouse down event
        // on the view control layer (where you control street view angle.)
        mouseStatus.isLeftDown = true;
        mouseStatus.leftDownX = mouseposition(e, this).x;
        mouseStatus.leftDownY = mouseposition(e, this).y;

        if (!status.disableWalking) {
            // Setting a cursor
            // http://www.jaycodesign.co.nz/css/cross-browser-css-grab-cursors-for-dragging/
            try {
                if (!svw.keyboard.isShiftDown()) {
                    setViewControlLayerCursor('ClosedHand');
                    // $divViewControlLayer.css("cursor", "url(public/img/cursors/openhand.cur) 4 4, move");
                } else {
                    setViewControlLayerCursor('ZoomOut');
                }
            } catch (e) {
                console.error(e);
            }
        }

        // Adding delegation on SVG elements
        // http://stackoverflow.com/questions/14431361/event-delegation-on-svg-elements
        // Or rather just attach a listener to svg and check it's target.
        if (!status.panoLinkListenerSet) {
            try {
                $('svg')[0].addEventListener('click', function (e) {
                    var targetPanoId = e.target.getAttribute('pano');
                    if (targetPanoId) {
                        svw.tracker.push('WalkTowards', {'TargetPanoId': targetPanoId});
                    }
                });
                status.panoLinkListenerSet = true;
            } catch (err) {

            }
        }

        svw.tracker.push('ViewControl_MouseDown', {x: mouseStatus.leftDownX, y:mouseStatus.leftDownY});
    }

    function viewControlLayerMouseUp (e) {
        // This is a callback function that is called with mouse up event on
        // the view control layer (where you change the Google Street view angle.
        var currTime;

        mouseStatus.isLeftDown = false;
        mouseStatus.leftUpX = mouseposition(e, this).x;
        mouseStatus.leftUpY = mouseposition(e, this).y;
        svw.tracker.push('ViewControl_MouseUp', {x:mouseStatus.leftUpX, y:mouseStatus.leftUpY});

        if (!status.disableWalking) {
            // Setting a mouse cursor
            // http://www.jaycodesign.co.nz/css/cross-browser-css-grab-cursors-for-dragging/
            try {
                if (!svw.keyboard.isShiftDown()) {
                    setViewControlLayerCursor('OpenHand');
                    // $divViewControlLayer.css("cursor", "url(public/img/cursors/openhand.cur) 4 4, move");
                } else {
                    setViewControlLayerCursor('ZoomOut');
                }
            } catch (e) {
                console.error(e);
            }
        }

        currTime = new Date().getTime();

        if (currTime - mouseStatus.prevMouseUpTime < 300) {
            // Double click
            // canvas.doubleClickOnCanvas(mouseStatus.leftUpX, mouseStatus.leftDownY);
            svw.tracker.push('ViewControl_DoubleClick');
            if (svw.keyboard.isShiftDown()) {
                // If Shift is down, then zoom out with double click.
                svw.zoomControl.zoomOut();
                svw.tracker.push('ViewControl_ZoomOut');
            } else {
                // If Shift is up, then zoom in wiht double click.
                // svw.zoomControl.zoomIn();
                svw.zoomControl.pointZoomIn(mouseStatus.leftUpX, mouseStatus.leftUpY);
                svw.tracker.push('ViewControl_ZoomIn');
            }
        }



        mouseStatus.prevMouseUpTime = currTime;
    }

    function viewControlLayerMouseMove (e) {
        // This is a callback function that is fired when a user moves a mouse on the
        // view control layer where you change the pov.
        mouseStatus.currX = mouseposition(e, this).x;
        mouseStatus.currY = mouseposition(e, this).y;

        //
        // Show a link and fade it out
        if (!status.disableWalking) {
            showLinks(2000);
            if (!mouseStatus.isLeftDown) {
                try {
                    if (!svw.keyboard.isShiftDown()) {
                        setViewControlLayerCursor('OpenHand');
                        // $divViewControlLayer.css("cursor", "url(public/img/cursors/openhand.cur) 4 4, move");
                    } else {
                        setViewControlLayerCursor('ZoomOut');
                    }
            } catch (e) {
                    console.error(e);
                }
            } else {

            }
        } else {
            setViewControlLayerCursor('default');
            // $divViewControlLayer.css("cursor", "default");
        }

        if (mouseStatus.isLeftDown &&
            status.disableWalking === false) {
            //
            // If a mouse is being dragged on the control layer, move the sv image.
            var dx = mouseStatus.currX - mouseStatus.prevX;
            var dy = mouseStatus.currY - mouseStatus.prevY;
            var pov = svw.getPOV();
            var zoom = pov.zoom;
            var zoomLevel = svw.zoomFactor[zoom];

            dx = dx / (2 * zoomLevel);
            dy = dy / (2 * zoomLevel);

            //
            // It feels the panning is a little bit slow, so speed it up by 50%.
            dx *= 1.5;
            dy *= 1.5;

            updatePov(dx, dy);
        }

        //
        // Show label delete menu
        if ('canvas' in svw && svw.canvas) {
            var item = svw.canvas.isOn(mouseStatus.currX,  mouseStatus.currY);
            if (item && item.className === "Point") {
                var path = item.belongsTo();
                var selectedLabel = path.belongsTo();

                svw.canvas.setCurrentLabel(selectedLabel);
                svw.canvas.showLabelTag(selectedLabel);
                svw.canvas.clear();
                svw.canvas.render2();
            } else if (item && item.className === "Label") {
                var selectedLabel = item;
                svw.canvas.setCurrentLabel(selectedLabel);
                svw.canvas.showLabelTag(selectedLabel);
            } else if (item && item.className === "Path") {
                var label = item.belongsTo();
                svw.canvas.clear();
                svw.canvas.render2();
                svw.canvas.showLabelTag(label);
            }
            else {
                // canvas.hideDeleteLabel();
                svw.canvas.showLabelTag(undefined);
                svw.canvas.setCurrentLabel(undefined);
            }
        }

        mouseStatus.prevX = mouseposition(e, this).x;
        mouseStatus.prevY = mouseposition(e, this).y;
    }

    function viewControlLayerMouseLeave (e) {
        mouseStatus.isLeftDown = false;
    }

    function showDeleteLabelMenu () {
        var item = canvas.isOn(mouseStatus.currX,  mouseStatus.currY);
        if (item && item.className === "Point") {
            var selectedLabel = item.belongsTo().belongsTo();
            if (selectedLabel === canvas.getCurrentLabel()) {
                canvas.showDeleteLabel(mouseStatus.currX, mouseStatus.currY);
            }
        }
    }

    ////////////////////////////////////////
    // Public functions
    ////////////////////////////////////////
    self.disableWalking = function () {
        if (!status.lockDisableWalking) {
            disableWalking();
            return this;
        } else {
            return false;
        }
    };

    self.enableWalking = function () {
        // This method enables users to walk and change the camera angle.
        if (!status.lockDisableWalking) {
            enableWalking();
            return this;
        } else {
            return false;
        }
    };

    self.getInitialPanoId = function () {
        // This method returns the panorama id of the position this user is dropped.
        return properties.initialPanoId;
    };

    self.getMaxPitch = function () {
        // This method returns a max pitch
        return properties.maxPitch;
    };

    self.getMinPitch = function () {
        // This method returns a min pitch
        return properties.minPitch;
    };

    self.getProperty = function (prop) {
        // This method returns a value of a specified property.
        if (prop in properties) {
            return properties[prop];
        } else {
            return false;
        }
    };

    self.hideLinks = function () {
        // This method hides links (arrows to adjacent panoramas.)
        hideLinks();
        return this;
    };

    self.lockDisableWalking = function () {
        // This method locks status.disableWalking
        status.lockDisableWalking = true;
        return this;
    };

    self.lockRenderLabels = function () {
        lock.renderLabels = true;
        return this;
    };

    self.modeSwitchWalkClick = function () {
        // This function brings a div element for drawing labels in front of
        // $svPanoramaLayer = getPanoramaLayer();
        // $svPanoramaLayer.append($divLabelDrawingLayer);
        $divViewControlLayer.css('z-index', '1');
        $divLabelDrawingLayer.css('z-index','0');
        if (!status.disableWalking) {
            // Show the link arrows on top of the panorama
            showLinks();
            // Make links clickable
            makeLinksClickable();
        }
    };

    self.modeSwitchLabelClick = function () {
        // This function
        $divLabelDrawingLayer.css('z-index','1');
        $divViewControlLayer.css('z-index', '0');
        // $divStreetViewHolder.append($divLabelDrawingLayer);

        if (properties.browser === 'mozilla') {
            // A bug in Firefox? The canvas in the div element with the largest z-index.
            $divLabelDrawingLayer.append($canvas);
        }

        hideLinks();

    };

    self.plotMarkers = function () {
        // Examples for plotting markers:
        // https://google-developers.appspot.com/maps/documentation/javascript/examples/icon-complex?hl=fr-FR
        if (canvas) {
            var labels = undefined;
            var labelsLen = 0;
            var prop = undefined;
            var labelType = undefined;
            var latlng = undefined;
            labels = canvas.getLabels();
            labelsLen = labels.length;

            //
            // Clear the map first
            for (var i = 0; i < markers.length; i += 1) {
                markers[i].setMap(null);
            }

            markers = [];
            // Then plot markers
            for (i = 0; i < labelsLen; i++) {
                prop = labels[i].getProperties();
                labelType = prop.labelProperties.labelType;
                latlng = prop.panoramaProperties.latlng;
                if (prop.labelerId.indexOf('Researcher') !== -1) {
                    // Skip researcher labels
                    continue;
                }

                var myLatLng =  new google.maps.LatLng(latlng.lat, latlng.lng);
                var marker = new google.maps.Marker({
                    position: myLatLng,
                    map: map,
                    zIndex: i
                });
                markers.push(marker);
            }
        }
        return false;
    };

    self.setHeadingRange = function (range) {
        // This method sets the minimum and maximum heading angle that users can adjust the Street View camera.
        properties.minHeading = range[0];
        properties.maxHeading = range[1];
        return this;
    };

    self.setMode = function (modeIn) {
        properties.mode = modeIn;
        return this;
    };

    self.setPitchRange = function (range) {
        // This method sets the minimum and maximum pitch angle that users can adjust the Street View camera.
        properties.minPitch = range[0];
        properties.maxPitch = range[1];
        return this;
    };

    self.setPov = function (pov, duration, callback) {
        // Change the pov.
        // If a transition duration is set, smoothly change the pov over the time specified (milli-sec)
        if (('panorama' in svw) && svw.panorama) {
            var currentPov = svw.panorama.getPov();
            var end = false;
            var interval;

            pov.heading = parseInt(pov.heading, 10);
            pov.pitch = parseInt(pov.pitch, 10);
            pov.zoom = parseInt(pov.zoom, 10);

            //
            // Pov restriction
            if (pov.pitch > properties.maxPitch) {
                pov.pitch = properties.maxPitch;
            } else if (pov.pitch < properties.minPitch) {
                pov.pitch = properties.minPitch;
            }

            if (properties.minHeading && properties.maxHeading) {
                if (properties.minHeading <= properties.maxHeading) {
                    if (pov.heading > properties.maxHeading) {
                        pov.heading = properties.maxHeading;
                    } else if (pov.heading < properties.minHeading) {
                        pov.heading = properties.minHeading;
                    }
                } else {
                    if (pov.heading < properties.minHeading &&
                        pov.heading > properties.maxHeading) {
                        if (Math.abs(pov.heading - properties.maxHeading) < Math.abs(pov.heading - properties.minHeading)) {
                            pov.heading = properties.maxHeading;
                        } else {
                            pov.heading = properties.minHeading;
                        }
                    }
                }
            }

            if (duration) {
                var timeSegment = 25; // 25 milli-sec

                // Get how much angle you change over timeSegment of time.
                var cw = (pov.heading - currentPov.heading + 360) % 360;
                var ccw = 360 - cw;
                var headingDelta;
                var headingIncrement;
                if (cw < ccw) {
                    headingIncrement = cw * (timeSegment / duration);
                } else {
                    headingIncrement = (-ccw) * (timeSegment / duration);
                }

                var pitchIncrement;
                var pitchDelta = pov.pitch - currentPov.pitch;
                pitchIncrement = pitchDelta * (timeSegment / duration);


                interval = window.setInterval(function () {
                    var headingDelta = pov.heading - currentPov.heading;
                    if (Math.abs(headingDelta) > 1) {
                        //
                        // Update heading angle and pitch angle
                        /*
                        var angle = (360 - pov.heading) + currentPov.heading;
                        if (angle < 180 || angle > 360) {
                            currentPov.heading -= headingIncrement;
                        } else {
                            currentPov.heading += headingIncrement;
                        }
                        */
                        currentPov.heading += headingIncrement;
                        currentPov.pitch += pitchIncrement;
                        currentPov.heading = (currentPov.heading + 360) % 360; //Math.ceil(currentPov.heading);
                        currentPov.pitch = currentPov.pitch; // Math.ceil(currentPov.pitch);
                        svw.panorama.setPov(currentPov);
                    } else {
                        //
                        // Set the pov to adjust the zoom level. Then clear the interval.
                        // Invoke a callback function if there is one.
                        if (!pov.zoom) {
                            pov.zoom = 1;
                        }
                        //pov.heading = Math.ceil(pov.heading);
                        //pov.pitch = Math.ceil(pov.pitch);
                        svw.panorama.setZoom(pov.zoom);
                        window.clearInterval(interval);
                        if (callback) {
                            callback();
                        }
                    }
                }, timeSegment);


            } else {
                svw.panorama.setPov(pov);
            }
        }

        return this;
    };

    self.setStatus = function (key, value) {
        // This funciton sets the current status of the instantiated object
        if (key in status) {


            // if the key is disableWalking, invoke walk disabling/enabling function
            if (key === "disableWalking") {
                if (typeof value === "boolean") {
                    if (value) {
                        disableWalking();
                    } else {
                        enableWalking();
                    }
                } else {
                    return false
                }
            } else {
                status[key] = value;
            }
            return this;
        }
        return false;
    };

    self.unlockDisableWalking = function () {
        status.lockDisableWalking = false;
        return this;
    };

    self.unlockRenderLabels = function () {
        lock.renderLabels = false;
        return this;
    };

    self.test = function () {
        canvas.testCases.renderLabels();
    };

    init(params);
    return self;
}

function MessageBox ($, param) {
    var self = {className: 'MessageBox'};
    var OKButton = '<button id="MessageBoxOkButton" class="button" style="position: absolute; bottom: 10px; left: 10px;">OK</button>';

    // jQuery elements
    var $divMessageBoxHolder;
    var $divMessageBox;


    function init () {
        $divMessageBoxHolder = $("#Holder_Message");
        $divMessageBox = $("#MessageBox");
    }

    self.setMessage = function (message) {
        $divMessageBox.html(message);
        return this;
    };

    self.setPosition = function (x, y, width, height, background) {
        if (x && typeof x == 'number') {
            x = x + 'px';
        }
        if (y && typeof y === 'number') {
            y = y + 'px';
        }

        if (!width) {
            width = '240px';
        } else if (typeof width === 'number') {
            width = width + 'px';
        }

        if (height && typeof height === 'number') {
            height = height + 'px';
        }

        if (!background) {
            background = false;
        }

        if (background) {
            $divMessageBoxHolder.css({
                height: '100%',
                left: '0px',
                top: '0px',
                visibility: 'visible',
                width: '100%',
                zIndex: 1000
            });
            $divMessageBox.css({
                left: x,
                top: y,
                width: width,
                zIndex: 1000
            });
            if (height) {
                $divMessageBox.css('height', height);
            }
        } else {
            $divMessageBoxHolder.css({
                height: '1px',
                left: x,
                top: y,
                width: '1px',
                zIndex: 1000
            });
            $divMessageBox.css({
                left: '0px',
                top: '0px',
                width: width
            });
            if (height) {
                $divMessageBox.css('height', height);
            }
        }
        return this;
    };

    self.appendOKButton = function (message) {
        $divMessageBox.css('padding-bottom', '50px');
        $divMessageBox.append(OKButton);

        $("#MessageBoxOkButton").on('click', function () {
            if ('tracker' in svw && svw.tracker) {
                if (message) {
                    svw.tracker.push('MessageBox_ClickOk', {message: message});
                } else {
                    svw.tracker.push('MessageBox_ClickOk');
                }
            }
            $divMessageBoxHolder.css({
                visibility: 'hidden'
            });
            $divMessageBox.css({
                'padding-bottom': '',
                'visibility' : 'hidden'
            });
            $("#MessageBoxOkButton").remove();
        });
    };

    self.hide = function () {
        // This method hides the message box.
        $divMessageBox.css('visibility', 'hidden');
        $divMessageBoxHolder.css('visibility', 'hidden');
        return this;
    };

    self.show = function (disableOtherInteraction) {
        // This method shows a messaage box on the page.
        if (!disableOtherInteraction) {
            disableOtherInteraction = false;
        }

        $divMessageBox.css('visibility', 'visible');
        if (disableOtherInteraction) {
            $divMessageBoxHolder.css('visibility', 'visible');
        }
        return this;
    };

    init();
    return self;
}

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

function OverlayMessageBox ($, params) {
    var oPublic = {
            'className' : 'OverlayMessageBox'
        };
    var properties = {
            'visibility' : 'visible'
        };
    var status = {};

    var $divOverlayMessage;
    var $divOverlayMessageBox;

    ////////////////////////////////////////
    // Private functions
    ////////////////////////////////////////
    function init() {
        // Initialization function.
        // $divOverlayMessage = $(params.domIds.OverlayMessage);
        // $divOverlayMessageBox = $(params.domIds.Holder_OverlayMessage);
        if (svw.ui && svw.ui.overlayMessage) {
          $divOverlayMessage = svw.ui.overlayMessage.message;
          $divOverlayMessageBox = svw.ui.overlayMessage.box;

          oPublic.setMessage('Walk');
        }

    }

    ////////////////////////////////////////
    // Public functions
    ////////////////////////////////////////
    oPublic.setMessage = function (mode, message) {
        var instructions = svw.misc.getLabelInstructions(),
            labelColors = svw.misc.getLabelColors();

        if ((mode in instructions) &&
            (mode in labelColors)) {
            // Set the box color.
            var modeColor = labelColors[mode];
            var backgroundColor = changeAlphaRGBA(modeColor.fillStyle, 0.85);
            backgroundColor = changeDarknessRGBA(backgroundColor, 0.35);
            $divOverlayMessageBox.css({
                'background' : backgroundColor
            });
            $divOverlayMessage.css({
                'color' : instructions[mode].textColor
            });

            // Set the instructional message.
            if (message) {
                // Manually set a message.
                $divOverlayMessage.html(message);
            } else {
                // Otherwise use the pre set message
                $divOverlayMessage.html('<strong>' + instructions[mode].instructionalText + '</strong>');
            }
            return this;
        } else {
            return false;
        }
    };

    oPublic.setVisibility = function (val) {
        // Set the visibility to visible or hidden.
        if (val === 'visible' || val === 'hidden') {
            properties.visibility = val;
        }
        return this;
    };

    ////////////////////////////////////////
    // Initialization
    ////////////////////////////////////////
    init();

    return oPublic;
}

var svw = svw || {}; // Street View Walker namespace.

function Path (points, params) {
    // Path object constructor
    // This class object holds an array of Point objects.
    //
    // For canvas properties, take a look at:
    // https://developer.mozilla.org/en-US/docs/HTML/Canvas/Tutorial/Applying_styles_and_colors
    //
    var oPublic = {
         className : 'Path',
         points : undefined
    };
    var belongsTo;
    var properties = {
        fillStyle: 'rgba(255,255,255,0.5)',
        lineCap : 'round', // ['butt','round','square']
        lineJoin : 'round', // ['round','bevel','miter']
        lineWidth : '3',
        numPoints: points.length,
        originalFillStyle: undefined,
        originalStrokeStyle: undefined,
        strokeStyle : 'rgba(255,255,255,1)',
        strokeStyle_bg : 'rgba(255,255,255,1)' //potentially delete
    };
    var status = {
        visibility: 'visible'
    };

    ////////////////////////////////////////
    // Private functions
    ////////////////////////////////////////
    function _init(points, params) {
        var lenPoints;
        var i;
        oPublic.points = points;
        lenPoints = points.length;

        // Set belongs to of the points
        for (i = 0; i < lenPoints; i += 1) {
            points[i].setBelongsTo(oPublic);
        };

        if (params) {
            for (var attr in params) {
                if (attr in properties) {
                    properties[attr] = params[attr];
                };
            };
        };

        properties.fillStyle = changeAlphaRGBA(points[0].getProperty('fillStyleInnerCircle'), 0.5);
        properties.originalFillStyle = properties.fillStyle;
        properties.originalStrokeStyle = properties.strokeStyle;
    }

    function getLineWidth () {
      // return line width
      return properties.lineWidth;
    }
    function getFill() {
      // get fill
      return properties.fillStyle;
    }

    function setFill(fill) {
      properties.fillStyle = fill;
    }

    function getBoundingBox(povIn) {
      // This function checks if a mouse cursor is on any of a points and return
      var j;
      var len;
      var canvasCoords;
      var pov = povIn ? povIn : getPOV(); // Todo. Get rid of the getPOV() global function.
      var xMax = -1;
      var xMin = 1000000;
      var yMax = -1;
      var yMin = 1000000;

      //
      // Check on points
      canvasCoords = getCanvasCoordinates(pov);
      len = canvasCoords.length;

      for (j = 0; j < len; j += 1) {
        var coord = canvasCoords[j];

        if (coord.x < xMin) {
          xMin = coord.x;
        }
        if (coord.x > xMax) {
          xMax = coord.x;
        }
        if (coord.y < yMin) {
          yMin = coord.y;
        }
        if (coord.y > yMax) {
          yMax = coord.y;
        }
      }

      return {
        x: xMin,
        y: yMin,
        width: xMax - xMin,
        height: yMax - yMin
      };
    }

    function getSvImageBoundingBox() {
      // this method returns a bounding box in terms of svImage coordinates.
      var i;
      var coord;
      var coordinates = getImageCoordinates();
      var len = coordinates.length;
      var xMax = -1;
      var xMin = 1000000;
      var yMax = -1000000;
      var yMin = 1000000;
      var boundary = false;

      //
      // Check if thie is an boundary case
      for (i = 0; i < len; i++) {
        coord = coordinates[i];
        if (coord.x < xMin) {
          xMin = coord.x;
        }
        if (coord.x > xMax) {
          xMax = coord.x;
        }
        if (coord.y < yMin) {
          yMin = coord.y;
        }
        if (coord.y > yMax) {
          yMax = coord.y;
        }
      }

      if (xMax - xMin > 5000) {
        boundary = true;
        xMax = -1;
        xMin = 1000000;

        for (i = 0; i < len; i++) {
          coord = coordinates[i];
          if (coord.x > 6000) {
            if (coord.x < xMin) {
              xMin = coord.x;
            }
          } else {
            if (coord.x > xMax){
              xMax = coord.x;
            }
          }
        }
      }

      //
      // If the path is on boundary, swap xMax and xMin.
      if (boundary) {
        return {
          x: xMin,
          y: yMin,
          width: (svw.svImageWidth - xMin) + xMax,
          height: yMax - yMin,
          boundary: true
        }
      } else {
        return {
          x: xMin,
          y: yMin,
          width: xMax - xMin,
          height: yMax - yMin,
          boundary: false
        }
      }
    }

    function getCanvasCoordinates (pov) {
        // Get canvas coordinates of points that constitute the path.
        var imCoords = getImageCoordinates();
        var i;
        var len = imCoords.length;
        var canvasCoord;
        var canvasCoords = [];
        var min = 10000000;
        var max = -1;

        for (i = 0; i < len; i += 1) {
            if (min > imCoords[i].x) {
                min = imCoords[i].x;
            }
            if (max < imCoords[i].x) {
                max = imCoords[i].x;
            }
        }
        // Note canvasWidthInGSVImage is approximately equals to the image width of GSV image that fits in one canvas view
        var canvasWidthInGSVImage = 3328;
        for (i = 0; i < len; i += 1) {
            if (pov.heading < 180) {
                if (max > svw.svImageWidth - canvasWidthInGSVImage) {
                    if (imCoords[i].x > canvasWidthInGSVImage) {
                        imCoords[i].x -= svw.svImageWidth;
                    }
                }
            } else {
                if (min < canvasWidthInGSVImage) {
                    if (imCoords[i].x < svw.svImageWidth - canvasWidthInGSVImage) {
                        imCoords[i].x += svw.svImageWidth;
                    }
                }
            }
            canvasCoord = svw.gsvImageCoordinate2CanvasCoordinate(imCoords[i].x, imCoords[i].y, pov);
            canvasCoords.push(canvasCoord);
        }

        return canvasCoords;
    }


    function getImageCoordinates() {
        var i;
        var len = oPublic.points.length;
        var coords = [];
        for (i = 0; i < len; i += 1) {
            coords.push(oPublic.points[i].getGSVImageCoordinate());
                }
        return coords;
    }

    function getPoints() {
        return points;
      // return point objects in this path
      // Todo
    }

    function renderBoundingBox (ctx) {
        // This function takes a bounding box returned by a method getBoundingBox()
        var boundingBox = getBoundingBox();

        ctx.save();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(255,255,255,1)';
        ctx.beginPath();
        ctx.moveTo(boundingBox.x, boundingBox.y);
        ctx.lineTo(boundingBox.x + boundingBox.width, boundingBox.y);
        ctx.lineTo(boundingBox.x + boundingBox.width, boundingBox.y + boundingBox.height);
        ctx.lineTo(boundingBox.x, boundingBox.y + boundingBox.height);
        ctx.lineTo(boundingBox.x, boundingBox.y);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();

        return;
    }

    ////////////////////////////////////////
    // oPublic functions
    ////////////////////////////////////////
    oPublic.belongsTo = function () {
        // This function returns which object (i.e. Label) this Path
        // belongs to.
        if (belongsTo) {
            return belongsTo;
        } else {
            return false;
        }
    };

    oPublic.getPOV = function() {
        return points[0].getPOV();
    }

    oPublic.getBoundingBox = function (pov) {
        // Get a bounding box of this path
        return getBoundingBox(pov);
    };

    oPublic.getLineWidth = function () {
      // get line width
      return getLineWidth();
    };

    oPublic.getFill = function () {
      return getFill();
    };

    oPublic.getFillStyle = function () {
        // Get the fill style.
        return properties.fillStyle;
    };


    oPublic.getSvImageBoundingBox = function () {
        // Get a boudning box
        return getSvImageBoundingBox();
    };


    oPublic.getImageCoordinates = function () {
        // Get the image coordinates of the path.
        return getImageCoordinates();
    };


    oPublic.getPoints = function (reference) {
        // This function returns oPublic.points.
        if (!reference) {
            reference = false;
        }

        if (reference) {
            return oPublic.points;
        } else {
            return $.extend(true, [], oPublic.points);
        }

        // return oPublic.points;
    };


    oPublic.isOn = function (x, y) {
        // This function checks if a mouse cursor is on any of a points and return
        // a point if the cursor is indeed on the point.
        // Otherwise, this function checks if the mouse cursor is on a bounding box
        // of this path. If the cursor is on the bounding box, then this function
        // returns this path object.
        var boundingBox;
        var i;
        var j;
        var point;
        var pointsLen;
        var result;

        //
        // Check if the passed point (x, y) is on any of points.
        pointsLen = oPublic.points.length;
        for (j = 0; j < pointsLen; j += 1) {
            point = oPublic.points[j];
            result = point.isOn(x, y);
            if (result) {
                return result;
            }
        }

        //
        // Check if the passed point (x, y) is on a path bounding box
        boundingBox = getBoundingBox();
        if (boundingBox.x < x &&
            boundingBox.x + boundingBox.width > x &&
            boundingBox.y < y &&
            boundingBox.y + boundingBox.height > y) {
            return this;
        } else {
            return false;
        }
    };

    oPublic.overlap = function (path, mode) {
        // This method calculates the area overlap between this path and another pathpassed as an argument.
        if (!mode) {
            mode = "boundingbox";
        }

        var overlap = 0;

        if (mode === "boundingbox") {
            var boundingbox1 = getSvImageBoundingBox();
            var boundingbox2 = path.getSvImageBoundingBox();
            var xOffset;
            var yOffset;

            //
            // Check if a bounding box is on a boundary
            if (!(boundingbox1.boundary && boundingbox2.boundary)) {
                if (boundingbox1.boundary) {
                    boundingbox1.x = boundingbox1.x - svw.svImageWidth;
                    if (boundingbox2.x > 6000) {
                        boundingbox2.x = boundingbox2.x - svw.svImageWidth;
                    }
                } else if (boundingbox2.boundary) {
                    boundingbox2.x = boundingbox2.x - svw.svImageWidth;
                    if (boundingbox1.x > 6000) {
                        boundingbox1.x = boundingbox1.x - svw.svImageWidth;
                    }
                }
            }


            if (boundingbox1.x < boundingbox2.x) {
                xOffset = boundingbox1.x;
            } else {
                xOffset = boundingbox2.x;
            }
            if (boundingbox1.y < boundingbox2.y) {
                yOffset = boundingbox1.y;
            } else {
                yOffset = boundingbox2.y;
            }

            boundingbox1.x -= xOffset;
            boundingbox2.x -= xOffset;
            boundingbox1.y -= yOffset;
            boundingbox2.y -= yOffset;

            var b1x1 = boundingbox1.x
            var b1x2 = boundingbox1.x + boundingbox1.width;
            var b1y1 = boundingbox1.y;
            var b1y2 = boundingbox1.y + boundingbox1.height;
            var b2x1 = boundingbox2.x
            var b2x2 = boundingbox2.x + boundingbox2.width;
            var b2y1 = boundingbox2.y;
            var b2y2 = boundingbox2.y + boundingbox2.height;
            var row = 0;
            var col = 0;
            var rowMax = (b1x2 < b2x2) ? b2x2 : b1x2;
            var colMax = (b1y2 < b2y2) ? b2y2 : b1y2;
            var countUnion = 0;
            var countIntersection = 0;
            var isOnB1 = false;
            var isOnB2 = false;

            for (row = 0; row < rowMax; row++) {
                for (col = 0; col < colMax; col++) {
                    isOnB1 = (b1x1 < row && row < b1x2) && (b1y1 < col && col < b1y2);
                    isOnB2 = (b2x1 < row && row < b2x2) && (b2y1 < col && col < b2y2);
                    if (isOnB1 && isOnB2) {
                        countIntersection += 1;
                    }
                    if (isOnB1 || isOnB2) {
                        countUnion += 1;
                    }
                }
            }
            overlap = countIntersection / countUnion;
        }

        return overlap;
    };

    oPublic.removePoints = function () {
        // This method remove all the points in the list points.
        oPublic.points = undefined;
    };

    oPublic.render2 = function (ctx, pov) {
        return oPublic.render(pov, ctx);
    };

    oPublic.render = function (pov, ctx) {
        // This method renders a path.
        //
        // Deprecated: Use render2
        if (status.visibility === 'visible') {
            var pathLen;
            var point;
            var j;

            pathLen = oPublic.points.length;

            // Get canvas coordinates to render a path.
            var canvasCoords = getCanvasCoordinates(pov);

            // Render fills
            point = oPublic.points[0];
            ctx.save();
            ctx.beginPath();

            if (!properties.fillStyle) {
                properties.fillStyle = changeAlphaRGBA(point.getProperty('fillStyleInnerCircle'), 0.5);
                properties.originalFillStyle = properties.fillStyle;
                ctx.fillStyle = properties.fillStyle;
            } else {
                ctx.fillStyle = properties.fillStyle;
            }

            // ctx.moveTo(point.getCanvasCoordinate(pov).x, point.getCanvasCoordinate(pov).y);
            ctx.moveTo(canvasCoords[0].x, canvasCoords[0].y);
            for (j = 1; j < pathLen; j += 1) {
                // ctx.lineTo(point.getCanvasCoordinate(pov).x, point.getCanvasCoordinate(pov).y);
                ctx.lineTo(canvasCoords[j].x, canvasCoords[j].y);
            }
            // point = oPublic.points[0];
            // ctx.lineTo(point.getCanvasCoordinate(pov).x, point.getCanvasCoordinate(pov).y);
            ctx.lineTo(canvasCoords[0].x, canvasCoords[0].y);
            ctx.fill();
            ctx.closePath();
            ctx.restore();

            // Render points
            for (j = 0; j < pathLen; j += 1) {
                point = oPublic.points[j];
                point.render(pov, ctx);
            }

            // Render lines
            for (j = 0; j < pathLen; j += 1) {
                if (j > 0) {
                    var currCoord = canvasCoords[j];
                    var prevCoord = canvasCoords[j - 1];
                } else {
                    var currCoord = canvasCoords[j];
                    var prevCoord = canvasCoords[pathLen - 1];
                }
                var r = point.getProperty('radiusInnerCircle');
                ctx.save();
                ctx.strokeStyle = properties.strokeStyle;
                svw.util.shape.lineWithRoundHead(ctx, prevCoord.x, prevCoord.y, r, currCoord.x, currCoord.y, r);
                ctx.restore();
            }
        }
    };

    oPublic.renderBoundingBox = function (ctx) {
        renderBoundingBox(ctx);
    };

    oPublic.resetFillStyle = function () {
        // This method changes the value of fillStyle to its original fillStyle value
        properties.fillStyle = properties.originalFillStyle;
        return this;
    };

    oPublic.resetStrokeStyle = function () {
        // This method resets the strokeStyle to its original value
        properties.strokeStyle = properties.originalStrokeStyle;
        return this;
    };

    oPublic.setFill = function(fill) {
        // console.log(fill[1]);
        // console.log(fill.substring(4, fill.length-1));
        if(fill.substring(0,4)=='rgba'){
            setFill(fill);
        }
        else{
            setFill('rgba'+fill.substring(3,fill.length-1)+',0.5)');
        }
        return this;
    };

    oPublic.setBelongsTo = function (obj) {
        belongsTo = obj;
        return this;
    };

    oPublic.setLineWidth = function (lineWidth) {
        if(!isNaN(lineWidth)){
            properties.lineWidth  = ''+lineWidth;
        }
        return this;
    };

    oPublic.setFillStyle = function (fill) {
        // This method sets the fillStyle of the path
        if(fill!=undefined){
            properties.fillStyle = fill;
        };
        return this;
    };

    oPublic.setStrokeStyle = function (stroke) {
        // This method sets the strokeStyle of the path
        properties.strokeStyle = stroke;
        return this;
    };

    oPublic.setVisibility = function (visibility) {
        // This method sets the visibility of a path (and points that cons
        if (visibility === 'visible' || visibility === 'hidden') {
            status.visibility = visibility;
        }
        return this;
    };

    // Initialize
    _init(points, params);

    return oPublic;
}

var svw = svw || {}; // Street View Walker namespace.
function Point (x, y, pov, params) {
  'use strict';
    // Point object constructor.
    //
    // Parameters:
    // - x: x-coordinate of the point on a canvas
    // - y: y-coordinate of the point on a canvas
    if(params.fillStyle==undefined){
        params.fillStyle = 'rgba(255,255,255,0.5)';
    }
    var self = {
            className : 'Point',
            svImageCoordinate : undefined,
            canvasCoordinate : undefined,
            originalCanvasCoordinate : undefined,
            pov : undefined,
            originalPov : undefined
        };
    var belongsTo = undefined;
    var properties = {
        fillStyleInnerCircle: params.fillStyle,
        lineWidthOuterCircle: 2,
        iconImagePath: undefined,
        originalFillStyleInnerCircle: undefined,
        originalStrokeStyleOuterCircle: undefined,
        radiusInnerCircle: 4,
        radiusOuterCircle: 5,
        strokeStyleOuterCircle: 'rgba(255,255,255,1)', // 'rgba(30,30,30,1)',
        storedInDatabase: false
    };
    var unnessesaryProperties = ['originalFillStyleInnerCircle', 'originalStrokeStyleOuterCircle'];
    var status = {
            'deleted' : false,
            'visibility' : 'visible',
            'visibilityIcon' : 'visible'
    };

    function _init (x, y, pov, params) {
        // Convert a canvas coordinate (x, y) into a sv image coordinate
        // Note, svImageCoordinate.x varies from 0 to svImageWidth and
        // svImageCoordinate.y varies from -(svImageHeight/2) to svImageHeight/2.

        //
        // Adjust the zoom level
        var zoom = pov.zoom;
        var zoomFactor = svw.zoomFactor[zoom];
        var svImageHeight = svw.svImageHeight;
        var svImageWidth = svw.svImageWidth;
        self.svImageCoordinate = {};
        self.svImageCoordinate.x = svImageWidth * pov.heading / 360 + (svw.alpha_x * (x - (svw.canvasWidth / 2)) / zoomFactor);
        self.svImageCoordinate.y = (svImageHeight / 2) * pov.pitch / 90 + (svw.alpha_y * (y - (svw.canvasHeight / 2)) / zoomFactor);
        // svImageCoordinate.x could be negative, so adjust it.
        if (self.svImageCoordinate.x < 0) {
            self.svImageCoordinate.x = self.svImageCoordinate.x + svImageWidth;
        }
        // Keep the original canvas coordinate and
        // canvas pov just in case.
        self.canvasCoordinate = {
            x : x,
            y : y
        };
        self.originalCanvasCoordinate = {
            x : x,
            y : y
        };
        self.pov = {
            heading : pov.heading,
            pitch : pov.pitch,
            zoom : pov.zoom
        };
        self.originalPov = {
            heading : pov.heading,
            pitch : pov.pitch,
            zoom : pov.zoom
        };

        // Set properties
        for (var propName in properties) {
            // It is ok if iconImagePath is not specified
            if(propName === "iconImagePath") {
                if (params.iconImagePath) {
                    properties.iconImagePath = params.iconImagePath;
                } else {
                    continue;
                }
            }

            if (propName in params) {
                properties[propName] = params[propName];
            } else {
                // See if this property must be set.
                if (unnessesaryProperties.indexOf(propName) === -1) {
                    // throw self.className + ': "' + propName + '" is not defined.';
                }
            }
        }

        properties.originalFillStyleInnerCircle = properties.fillStyleInnerCircle;
        properties.originalStrokeStyleOuterCircle = properties.strokeStyleOuterCircle;
        return true;
    }


    function _init2 () {
        return true;
    }

    function getCanvasX () {
      return self.canvasCoordinate.x;
    }

    function getCanvasY () {
      return self.canvasCoordinate.y;
    }

    function getFill () {
        // return the fill color of this point
      return properties.fillStyleInnerCircle;
    }
    function getPOV () {
        return pov;
    };

    ////////////////////////////////////////////////////////////////////////////////
    // Public functions
    ////////////////////////////////////////////////////////////////////////////////
    self.belongsTo = function () {
        // This function returns an object directly above this object.
        // I.e., it returns which path it belongs to.
        if (belongsTo) {
            return belongsTo;
        } else {
            return false;
        }
    };

    self.getPOV = function() {
        return getPOV();
    };

    self.getCanvasCoordinate = function (pov) {
        // This function takes current pov of the Street View as a parameter
        // and returns a canvas coordinate of a point.

        //
        // POV adjustment
        self.canvasCoordinate = svw.gsvImageCoordinate2CanvasCoordinate(self.svImageCoordinate.x, self.svImageCoordinate.y, pov);
        return svw.gsvImageCoordinate2CanvasCoordinate(self.svImageCoordinate.x, self.svImageCoordinate.y, pov);
    };

    self.getCanvasX = getCanvasX;
    self.getCanvasY = getCanvasY;
    self.getFill = getFill;

    self.getFillStyle = function () {
        // Get the fill style.
        // return properties.fillStyle;
        return  getFill();
    };

    self.getGSVImageCoordinate = function () {
        return $.extend(true, {}, self.svImageCoordinate);
    };

    self.getProperty = function (name) {
        if (!(name in properties)) {
            throw self.className + ' : A property name "' + name + '" does not exist in properties.';
        }
        return properties[name];
    };


    self.getProperties = function () {
        // Return the deep copy of the properties object,
        // so the caller can only modify properties from
        // setProperties() (which I have not implemented.)
        //
        // JavaScript Deepcopy
        // http://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-clone-a-javascript-object
        return $.extend(true, {}, properties);
    };


    self.isOn = function (x, y) {
        var margin = properties.radiusOuterCircle / 2 + 3;
        if (x < self.canvasCoordinate.x + margin &&
            x > self.canvasCoordinate.x - margin &&
            y < self.canvasCoordinate.y + margin &&
            y > self.canvasCoordinate.y - margin) {
            return this;
        } else {
            return false;
        }
    }


    self.render = function (pov, ctx) {
        // Render points
        if (status.visibility === 'visible') {
            var coord;
            var x;
            var y;
            var r = properties.radiusInnerCircle;
            coord = self.getCanvasCoordinate(pov);
            x = coord.x;
            y = coord.y;

            ctx.save();
            ctx.strokeStyle = properties.strokeStyleOuterCircle;
            ctx.lineWidth = properties.lineWidthOuterCircle;
            ctx.beginPath();
            ctx.arc(x, y, properties.radiusOuterCircle, 2 * Math.PI, 0, true);
            ctx.closePath();
            ctx.stroke();
            ctx.fillStyle = properties.fillStyleInnerCircle; // changeAlphaRGBA(properties.fillStyleInnerCircle, 0.5);
            ctx.beginPath();
            ctx.arc(x, y, properties.radiusInnerCircle, 2 * Math.PI, 0, true);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }

    };

    self.resetFillStyle = function () {
        // This method reverts the fillStyle property to its original value
        properties.fillStyleInnerCircle = properties.originalFillStyleInnerCircle;
        return this;
    };

    self.resetSVImageCoordinate = function (coord) {
        // Set the svImageCoordinate
        self.svImageCoordinate = coord;
        self.canvasCoordinate = {x : 0, y: 0};
        return this;
    };

    self.resetStrokeStyle = function () {
        // This method resets the strokeStyle to its original value
        properties.strokeStyleOuterCircle = properties.originalStrokeStyleOuterCircle;
        return this;
    };

    self.setBelongsTo = function (obj) {
        // This function sets which object (Path)
        // The point belongs to.
        belongsTo = obj;
        return this;
    };

    self.setFillStyle = function (value) {
        // This method sets the fill style of inner circle to the specified value
        properties.fillStyleInnerCircle = value;
        return this;
    };

    self.setIconPath = function (iconPath) {
        properties.iconImagePath = iconPath;
        return this;
    };

    self.setPhotographerPov = function (heading, pitch) {
        // this method sets the photographerHeading and photographerPitch
        properties.photographerHeading = heading;
        properties.photographerPitch = pitch;
        return this;
    };

    self.setProperties = function (params) {
        // This function resets all the properties specified in params.
        for (key in params) {
            if (key in properties) {
                properties[key] = params[key];
            }
        }

        if ('originalCanvasCoordinate' in params) {
            self.originalCanvasCoordinate = params.originalCanvasCoordinate;
        }

        //
        // Set pov parameters
        self.pov = self.pov || {};
        if ('pov' in params) {
            self.pov = params.pov;
        }

        if ('heading' in params) {
            self.pov.heading = params.heading;
        }

        if ('pitch' in params) {
            self.pov.pitch = params.pitch;
        }

        if ('zoom' in params) {
            self.pov.zoom = params.zoom;
        }

        //
        // Set original pov parameters
        self.originalPov = self.originalPov || {};
        if ('originalHeading' in params) {
            self.originalPov.heading = params.originalHeading;
        }

        if ('originalPitch' in params) {
            self.originalPov.pitch = params.originalPitch;
        }

        if ('originalZoom' in params) {
            self.originalPov.zoom = params.originalZoom;
        }


        if (!properties.originalFillStyleInnerCircle) {
            properties.originalFillStyleInnerCircle = properties.fillStyleInnerCircle;
        }
        if (!properties.originalStrokeStyleOuterCircle) {
            properties.originalStrokeStyleOuterCircle = properties.strokeStyleOuterCircle;
        }
        return this;
    };

    self.setStrokeStyle = function (val) {
        // This method sets the strokeStyle of an outer circle to val
        properties.strokeStyleOuterCircle = val;
        return this;
    };

    self.setVisibility = function (visibility) {
        // This method sets the visibility of a path (and points that cons
        if (visibility === 'visible' || visibility === 'hidden') {
            status.visibility = visibility;
        }
        return this;
    };

    // Todo. Deprecated method. Get rid of this later.
    self.resetProperties = self.setProperties;

    ////////////////////////////////////////////////////////////////////////////////
    // Initialization
    ////////////////////////////////////////////////////////////////////////////////
    var argLen = arguments.length;
    if (argLen === 4) {
        _init(x, y, pov, params);
    } else {
        _init2();
    }

    return self;
}


svw.gsvImageCoordinate2CanvasCoordinate = function (xIn, yIn, pov) {
    // This function takes the current pov of the Street View as a parameter
    // and returns a canvas coordinate of a point (xIn, yIn).
    var x;
    var y;
    var zoom = pov.zoom;
    var svImageWidth = svw.svImageWidth * svw.zoomFactor[zoom];
    var svImageHeight = svw.svImageHeight * svw.zoomFactor[zoom];

    xIn = xIn * svw.zoomFactor[zoom];
    yIn = yIn * svw.zoomFactor[zoom];

    x = xIn - (svImageWidth * pov.heading) / 360;
    x = x / svw.alpha_x + svw.canvasWidth / 2;

    //
    // When POV is near 0 or near 360, points near the two vertical edges of
    // the SV image does not appear. Adjust accordingly.
    var edgeOfSvImageThresh = 360 * svw.alpha_x * (svw.canvasWidth / 2) / (svImageWidth) + 10;

    if (pov.heading < edgeOfSvImageThresh) {
        // Update the canvas coordinate of the point if
        // its svImageCoordinate.x is larger than svImageWidth - alpha_x * (svw.canvasWidth / 2).
        if (svImageWidth - svw.alpha_x * (svw.canvasWidth / 2) < xIn) {
            x = (xIn - svImageWidth) - (svImageWidth * pov.heading) / 360;
            x = x / svw.alpha_x + svw.canvasWidth / 2;
        }
    } else if (pov.heading > 360 - edgeOfSvImageThresh) {
        if (svw.alpha_x * (svw.canvasWidth / 2) > xIn) {
            x = (xIn + svImageWidth) - (svImageWidth * pov.heading) / 360;
            x = x / svw.alpha_x + svw.canvasWidth / 2;
        }
    }

    y = yIn - (svImageHeight / 2) * (pov.pitch / 90);
    y = y / svw.alpha_y + svw.canvasHeight / 2;


    //
    // Adjust the zoom level
    //
    //var zoomFactor = svw.zoomFactor[zoom];
    //x = x * zoomFactor;
    //y = y * zoomFactor;


    return {x : x, y : y};
}

svw.zoomFactor = {
    1: 1,
    2: 2.1,
    3: 4,
    4: 8,
    5: 16
};

function ProgressFeedback ($, params) {
    var self = {
        className : 'ProgressFeedback'
    };
    var properties = {
        progressBarWidth : undefined
    };
    var status = {
        progress : undefined
    };

    // jQuery elements
    var $progressBarContainer;
    var $progressBarFilled;
    var $progressMessage;

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions
    ////////////////////////////////////////////////////////////////////////////////
    function init (params) {
        $progressBarContainer = $("#ProgressBarContainer");
        $progressBarFilled = $("#ProgressBarFilled");
        $progressMessage = $("#Progress_Message");

        properties.progressBarWidth = $progressBarContainer.width();

        if (params && params.message) {
            self.setMessage(params.message);
        } else {
            self.setMessage('');
        }

        self.setProgress(0);
    }


    ////////////////////////////////////////////////////////////////////////////////
    // Public functions
    ////////////////////////////////////////////////////////////////////////////////
    self.setMessage = function (message) {
        // This function sets a message box in the feedback area.
        $progressMessage.html(message);
    };


    self.setProgress = function (progress) {
        // Check if the passed argument is a number. If not, try parsing it as a
        // float value. If it fails (if parseFloat returns NaN), then throw an error.
        if (typeof progress !== "number") {
            progress = parseFloat(progress);
        }

        if (progress === NaN) {
            throw new TypeError(self.className + ': The passed value cannot be parsed.');
        }

        if (progress > 1) {
            progress = 1.0;
            console.error(self.className + ': You can not pass a value larger than 1 to setProgress.');
        }

        status.progress = progress;

        if (properties.progressBarWidth) {
            var r;
            var g;
            var color;

            if (progress < 0.5) {
                r = 255;
                g = parseInt(255 * progress * 2);
            } else {
                r = parseInt(255 * (1 - progress) * 2);
                g = 255;
            }

            color = 'rgba(' + r + ',' + g + ',0,1)';
            $progressBarFilled.css({
                background: color,
                width: progress * properties.progressBarWidth
            });
        }

        return this;
    };

    init(params);
    return self;
}


function ProgressPov ($, param) {
    var oPublic = {className: 'ProgressPov'};
    var status = {
        currentCompletionRate: 0,
        previousHeading: 0,
        surveyedAngles: undefined
    };
    var properties = {};

    var $divCurrentCompletionRate;
    var $divCurrentCompletionBar;
    var $divCurrentCompletionBarFiller;

    ////////////////////////////////////////
    // Private functions
    ////////////////////////////////////////
    function _init(param) {
        $divCurrentCompletionRate = svw.ui.progressPov.rate;
        $divCurrentCompletionBar = svw.ui.progressPov.bar;
        $divCurrentCompletionBarFiller = svw.ui.progressPov.filler;

        //
        // Fill in the surveyed angles
        status.surveyedAngles = new Array(100);
        for (var i=0; i < 100; i++) {
            status.surveyedAngles[i] = 0;
        }

        if (param && param.pov) {
            status.previousHeading = param.pov.heading;
        } else {
            try {
                var pov = svw.getPov();
                status.previousHeading = pov.heading;
            } catch (e) {
                status.previousHeading = 0;
            }
        }


        printCompletionRate();
    }

    function printCompletionRate () {
        // This method prints what percent of the intersection the user has observed.
        var completionRate = oPublic.getCompletionRate() * 100;
        completionRate = completionRate.toFixed(0, 10);
        completionRate = completionRate + "%";
        $divCurrentCompletionRate.html(completionRate);
        return this;
    }

    function oneDimensionalMorphology (arr, radius) {
        if (!radius) {
            radius = 5;
        }

        var newArr = new Array(arr.length);
        var len = arr.length;
        var i;
        var r;
        var rIndex;

        for (i = 0; i < len; i++) {
            newArr[i] = 0;
        }

        //
        // Expand
        for (i = 0; i < len; i++) {
            if (arr[i] == 1) {
                newArr[i] = 1;
                for (r = 1; r < radius; r++) {
                    rIndex = (i + r + len) % len;
                    newArr[rIndex] = 1;
                    rIndex = (i - r + len) % len;
                    newArr[rIndex] = 1;
                }
            }
        }

        var arr = $.extend(true, [], newArr);

        //
        // Contract
        for (i = 0; i < len; i++) {
            if (arr[i] == 0) {
                newArr[i] = 0;
                for (r = 1; r < radius; r++) {
                    rIndex = (i + r + len) % len;
                    newArr[rIndex] = 0;
                    rIndex = (i - r + len) % len;
                    newArr[rIndex] = 0;
                }
            }
        }

        return newArr;
    }

    function updateCompletionBar () {
        // This method updates the filler of the completion bar
        var completionRate = oPublic.getCompletionRate();
        var r;
        var g;
        var color;

        var colorIntensity = 255;
        if (completionRate < 0.5) {
            r = colorIntensity;
            g = parseInt(colorIntensity * completionRate * 2);
        } else {
            r = parseInt(colorIntensity * (1 - completionRate) * 2);
            g = colorIntensity;
        }

        color = 'rgba(' + r + ',' + g + ',0,1)';

        completionRate *=  100;
        completionRate = completionRate.toFixed(0, 10);
        completionRate -= 0.8;
        completionRate = completionRate + "%";
        $divCurrentCompletionBarFiller.css({
            background: color,
            width: completionRate
        });
    }

    function updateCompletionRate () {
        // This method updates the printed completion rate and the bar.
        printCompletionRate();
        updateCompletionBar();
    }

    ////////////////////////////////////////
    // Public functions
    ////////////////////////////////////////
    oPublic.getCompletionRate = function () {
        // This method returns what percent of the intersection the user has observed.
        try {
            if (status.currentCompletionRate < 1) {
                var headingRange = 25;
                var pov = svw.getPOV();
                var heading = pov.heading;
                var headingMin = (heading - headingRange + 360) % 360;
                var headingMax = (heading + headingRange) % 360;
                var indexMin = Math.floor(headingMin / 360 * 100);
                var indexMax = Math.floor(headingMax / 360 * 100);
                var i = 0;
                if (indexMin < indexMax) {
                    for (i = indexMin; i < indexMax; i++) {
                        status.surveyedAngles[i] = 1;
                    }
                } else {
                    for (i = indexMin; i < 100; i++) {
                        status.surveyedAngles[i] = 1;
                    }
                    for (i = 0; i < indexMax; i++) {
                        status.surveyedAngles[i] = 1;
                    }
                }

                //
                // Added Aug 28th.
                // Todo. The part above is redundunt. Fix it later.
                // Fill in gaps in surveyedAngles
                var indexCenter = Math.floor(heading / 360 * 100);
                var previousHeading = status.previousHeading;
                if (heading !== previousHeading) {
                    var previousIndex = Math.floor(previousHeading / 360 * 100);
                    var delta = heading - previousHeading;
                    // if ((delta > 0 && delta < 359) || delta < -359) {
                    if ((delta > 0 && delta < 300) || delta < -300) {
                        // Fill in the gap from left to right
                        for (i = previousIndex;;i++) {
                            if (i == status.surveyedAngles.length) {
                                i = 0;
                            }
                            status.surveyedAngles[i] = 1;
                            if (i == indexCenter) {
                                break;
                            }

                        }
                    } else {
                        // Fill in the gap from right to left.
                        for (i = previousIndex;;i--) {
                            if (i == -1) {
                                i = status.surveyedAngles.length - 1;
                            }
                            status.surveyedAngles[i] = 1;
                            if (i == indexCenter) {
                                break;
                            }

                        }
                    }
                }

                // status.surveyedAngles = oneDimensionalMorphology(status.surveyedAngles);

                var total = status.surveyedAngles.reduce(function(a, b) {return a + b});
                status.currentCompletionRate = total / 100;

                status.previousHeading = heading;
                return total / 100;
            } else {
                return 1;
            }
        } catch (e) {
            return 0;
        }
    };

    oPublic.setCompletedHeading = function (range) {
        // This method manipulates the surveyed angle
        var headingMin = range[0];
        var headingMax = range[1];

        var indexMin = Math.floor(headingMin / 360 * 100);
        var indexMax = Math.floor(headingMax / 360 * 100);

        var i;
        for (i = indexMin; i < indexMax; i++) {
            status.surveyedAngles[i] = 1;
        }

        return this;
    };

    oPublic.updateCompletionRate = function () {
          return updateCompletionRate();
    };

    _init(param);
    return oPublic;
}

function QualificationBadges ($, params) {
    var self = { className : 'QualificationBadges' };
    var properties = {
        badgeClassName : 'Badge',
        badgePlaceHolderImagePath : "public/img/badges/EmptyBadge.png",
        busStopAuditorImagePath : "public/img/badges/Onboarding_BusStopExplorerBadge_Orange.png",
        busStopExplorerImagePath : "public/img/badges/Onboarding_BusStopInspector_Green.png"
    };
    var status = {};

    // jQuery elements
    var $badgeImageHolderBusStopAuditor;
    var $badgeImageHolderBusStopExplorer;

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions
    ////////////////////////////////////////////////////////////////////////////////
    function _init (params) {
        $badgeImageHolderBusStopAuditor = $("#BadgeImageHolder_BusStopAuditor");
        $badgeImageHolderBusStopExplorer = $("#BadgeImageHolder_BusStopExplorer");

        // Set the badge field with place holders.
        $badgeImageHolderBusStopAuditor.html('<img src="' + properties.badgePlaceHolderImagePath +
            '" class="' + properties.badgeClassName + '">');
        $badgeImageHolderBusStopExplorer.html('<img src="' + properties.badgePlaceHolderImagePath +
            '" class="' + properties.badgeClassName + '">');
    }


    ////////////////////////////////////////////////////////////////////////////////
    // Public functions
    ////////////////////////////////////////////////////////////////////////////////
    self.giveBusStopAuditorBadge = function () {
        $badgeImageHolderBusStopAuditor.html('<img src="' + properties.busStopAuditorImagePath +
            '" class="' + properties.badgeClassName + '">');
        return this;
    };


    self.giveBusStopExplorerBadge = function () {
        $badgeImageHolderBusStopExplorer.html('<img src="' + properties.busStopExplorerImagePath +
            '" class="' + properties.badgeClassName + '">')
    };

    _init(params);
    return self;
}

var svw = svw || {};

function RibbonMenu ($, params) {
    var self = {className: 'RibbonMenu'};
    var properties = {
        borderWidth : "3px",
        modeSwitchDefaultBorderColor : "rgba(200,200,200,0.75)",
        originalBackgroundColor: "white"
    };
    var status = {
            'disableModeSwitch' : false,
            'lockDisableModeSwitch' : false,
            'mode' : 'Walk',
            'selectedLabelType' : undefined
        };

    // jQuery DOM elements
    var $divStreetViewHolder;
    var $ribbonButtonBottomLines;
    var $ribbonConnector;
    var $spansModeSwitches;


    ////////////////////////////////////////
    // Private Functions
    ////////////////////////////////////////
    function _init () {
        //
        /// Set some of initial properties
        var browser = getBrowser();
        if (browser === 'mozilla') {
            properties.originalBackgroundColor = "-moz-linear-gradient(center top , #fff, #eee)";
        } else if (browser === 'msie') {
            properties.originalBackgroundColor = "#ffffff";
        } else {
            properties.originalBackgroundColor = "-webkit-gradient(linear, left top, left bottom, from(#fff), to(#eee))";
        }


        var labelColors = svw.misc.getLabelColors();

        //
        // Initialize the jQuery DOM elements
        if (svw.ui && svw.ui.ribbonMenu) {
          // $divStreetViewHolder = $("#Holder_StreetView");

          $divStreetViewHolder = svw.ui.ribbonMenu.streetViewHolder;
          // $ribbonButtonBottomLines = $(".RibbonModeSwitchHorizontalLine");
          $ribbonButtonBottomLines = svw.ui.ribbonMenu.bottonBottomBorders;
          // $ribbonConnector = $("#StreetViewLabelRibbonConnection");
          $ribbonConnector = svw.ui.ribbonMenu.connector;
          // $spansModeSwitches = $('span.modeSwitch');
          $spansModeSwitches = svw.ui.ribbonMenu.buttons;

          //
          // Initialize the color of the lines at the bottom of ribbon menu icons
          $.each($ribbonButtonBottomLines, function (i, v) {
              var labelType = $(v).attr("value");
              var color = labelColors[labelType].fillStyle;
              if (labelType === 'Walk') {
                  $(v).css('width', '56px');
              }

              $(v).css('border-top-color', color);
              $(v).css('background', color);
          });

          setModeSwitchBorderColors(status.mode);
          setModeSwitchBackgroundColors(status.mode);

          $spansModeSwitches.bind('click', modeSwitchClickCallback);
          $spansModeSwitches.bind({
              'mouseenter': modeSwitchMouseEnter,
              'mouseleave': modeSwitchMouseLeave
          });
        }
    }

    function modeSwitch (mode) {
        // This is a callback method that is invoked with a ribbon menu button click
        var labelType;

        if (typeof mode === 'string') {
            labelType = mode;
        } else {
            labelType = $(this).attr('val');
        }

        if (status.disableModeSwitch === false) {
            // Check if a bus stop sign is labeled or not.
            // If it is not, do not allow a user to switch to modes other than
            // Walk and StopSign.
            var labelColors;
            var ribbonConnectorPositions;
            var borderColor;

            //
            // Whenever the ribbon menu is clicked, cancel drawing.
            if ('canvas' in svw && svw.canvas && svw.canvas.isDrawing()) {
                svw.canvas.cancelDrawing();
            }


            labelColors = getLabelColors();
            ribbonConnectorPositions = getRibbonConnectionPositions();
            borderColor = labelColors[labelType].fillStyle;

            if ('map' in svw && svw.map) {
                if (labelType === 'Walk') {
                    // Switch to walking mode.
                    self.setStatus('mode', 'Walk');
                    self.setStatus('selectedLabelType', undefined);
                    if (svw.map) {
                      svw.map.modeSwitchWalkClick();
                    }
                } else {
                    // Switch to labeling mode.
                    self.setStatus('mode', labelType);
                    self.setStatus('selectedLabelType', labelType);
                    if (svw.map) {
                      svw.map.modeSwitchLabelClick();
                    }
                }
            }
            // Set border color

            if (svw.ui && svw.ui.ribbonMenu) {
              setModeSwitchBorderColors(labelType);
              setModeSwitchBackgroundColors(labelType);
              $ribbonConnector.css("left", ribbonConnectorPositions[labelType].labelRibbonConnection);
              $ribbonConnector.css("border-left-color", borderColor);
              $divStreetViewHolder.css("border-color", borderColor);
            }

            // Set the instructional message
            if (svw.overlayMessageBox) {
                svw.overlayMessageBox.setMessage(labelType);
            }
        }
    }

    function modeSwitchClickCallback () {
        if (status.disableModeSwitch === false) {
            var labelType;
            labelType = $(this).attr('val');

            //
            // If allowedMode is set, mode ('walk' or labelType) except for
            // the one set is not allowed
            if (status.allowedMode && status.allowedMode !== labelType) {
                return false;
            }

            //
            // Track the user action
            svw.tracker.push('Click_ModeSwitch_' + labelType);
            modeSwitch(labelType);
        }
    }

    function modeSwitchMouseEnter () {
        if (status.disableModeSwitch === false) {
            // Change the background color and border color of menu buttons
            // But if there is no Bus Stop label, then do not change back ground colors.
            var labelType = $(this).attr("val");

            //
            // If allowedMode is set, mode ('walk' or labelType) except for
            // the one set is not allowed
            if (status.allowedMode && status.allowedMode !== labelType) {
                return false;
            }
            setModeSwitchBackgroundColors(labelType);
            setModeSwitchBorderColors(labelType);
        }
    }

    function modeSwitchMouseLeave () {
        if (status.disableModeSwitch === false) {
            setModeSwitchBorderColors(status.mode);
            setModeSwitchBackgroundColors(status.mode);
        }
    }

    function setModeSwitchBackgroundColors (mode) {
        // background: -moz-linear-gradient(center top , #fff, #eee);
        // background: -webkit-gradient(linear, left top, left bottom, from(#fff), to(#eee));
        if (svw.ui && svw.ui.ribbonMenu) {
          var labelType;
          var labelColors;
          var borderColor;
          var browser;
          var backgroundColor;

          labelColors = getLabelColors();
          borderColor = labelColors[mode].fillStyle;

          $.each($spansModeSwitches, function (i, v) {
              labelType = $(v).attr('val');
              if (labelType === mode) {
                  if (labelType === 'Walk') {
                      backgroundColor = "#ccc";
                  } else {
                      backgroundColor = borderColor;
                  }
                  $(this).css({
                      "background" : backgroundColor
                  });
              } else {
                  backgroundColor = properties.originalBackgroundColor;
                  if (labelType !== status.mode) {
                      // Change background color if the labelType is not the currently selected mode.
                      $(this).css({
                          "background" : backgroundColor
                      });
                  }
              }
          });
      }
      return this;
    }

    function setModeSwitchBorderColors (mode) {
        // This method sets the border color of the ribbon menu buttons
        if (svw.ui && svw.ui.ribbonMenu) {
          var labelType, labelColors, borderColor;
          labelColors = getLabelColors();
          borderColor = labelColors[mode].fillStyle;

          $.each($spansModeSwitches, function (i, v) {
              labelType = $(v).attr('val');
              if (labelType=== mode) {
                  $(this).css({
                      "border-color" : borderColor,
                      "border-style" : "solid",
                      "border-width": properties.borderWidth
                  });
              } else {
                  if (labelType !== status.mode) {
                      // Change background color if the labelType is not the currently selected mode.
                      $(this).css({
                          "border-color" : properties.modeSwitchDefaultBorderColor,
                          "border-style" : "solid",
                          "border-width": properties.borderWidth
                      });

                  }
              }
          });
        }
        return this;
    }

    ////////////////////////////////////////
    // Public Functions
    ////////////////////////////////////////
    self.backToWalk = function () {
        // This function simulates the click on Walk icon
        modeSwitch('Walk');
        return this;
    };


    self.disableModeSwitch = function () {
        if (!status.lockDisableModeSwitch) {
            status.disableModeSwitch = true;
            if (svw.ui && svw.ui.ribbonMenu) {
              $spansModeSwitches.css('opacity', 0.5);
            }
        }
        return this;
    };

    self.disableLandmarkLabels = function () {
        // This function dims landmark labels and
        // also set status.disableLandmarkLabels to true
        if (svw.ui && svw.ui.ribbonMenu) {
          $.each($spansModeSwitches, function (i, v) {
              var labelType = $(v).attr('val');
              if (!(labelType === 'Walk' ||
                  labelType === 'StopSign' ||
                  labelType === 'Landmark_Shelter')
                  ) {
                  $(v).css('opacity', 0.5);
              }
          });
        }
        status.disableLandmarkLabels = true;
        return this;
    };

    self.enableModeSwitch = function () {
        // This method enables mode switch.
        if (!status.lockDisableModeSwitch) {
            status.disableModeSwitch = false;
            if (svw.ui && svw.ui.ribbonMenu) {
              $spansModeSwitches.css('opacity', 1);
            }
        }
        return this;
    };

    self.enableLandmarkLabels = function () {
      if (svw.ui && svw.ui.ribbonMenu) {
        $.each($spansModeSwitches, function (i, v) {
            var labelType = $(v).attr('val');
            $(v).css('opacity', 1);
        });
      }
      status.disableLandmarkLabels = false;
      return this;
    };


    self.lockDisableModeSwitch = function () {
        status.lockDisableModeSwitch = true;
        return this;
    };

    self.modeSwitch = function (labelType) {
        // This function simulates the click on a mode switch icon
        modeSwitch(labelType);
    };

    self.modeSwitchClick = function (labelType) {
        // This function simulates the click on a mode switch icon
        // Todo. Deprecated. Delete when you will refactor this code.
        modeSwitch(labelType);
    };


    self.getStatus = function(key) {
            if (key in status) {
                return status[key];
            } else {
              console.warn(self.className, 'You cannot access a property "' + key + '".');
              return undefined;
            }
    };

    self.setAllowedMode = function (mode) {
        // This method sets the allowed mode.
        status.allowedMode = mode;
        return this;
    };

    self.setStatus = function(name, value) {
        try {
            if (name in status) {
                if (name === 'disableModeSwitch') {
                    if (typeof value === 'boolean') {
                        if (value) {
                            self.disableModeSwitch();
                        } else {
                            self.enableModeSwitch();
                        }
                        return this;
                    } else {
                        return false
                    }
                } else {
                    status[name] = value;
                    return this;
                }
            } else {
                var errMsg = '"' + name + '" is not a modifiable status.';
                throw errMsg;
            }
        } catch (e) {
            console.error(self.className, e);
            return false;
        }

    };

    self.unlockDisableModeSwitch = function () {
        status.lockDisableModeSwitch = false;
        return this;
    };


    _init(params);

    return self;
}

/**
 * Created with JetBrains PhpStorm.
 * User: kotaro
 * Date: 2/25/13
 * Time: 3:28 AM
 * To change this template use File | Settings | File Templates.
 */

function RightClickMenu (params) {
    var oPublic = {
        'className' : 'RightClickMenu'
        };
    var properties = {

        };
    var status = {
            'currentLabel' : undefined,
            'disableLabelDelete' : false,
            'disableMenuClose' : false,
            'disableMenuSelect' : false,
            'lockDisableMenuSelect' : false,
            'visibilityDeleteMenu' : 'hidden',
            'visibilityBusStopLabelMenu' : 'hidden',
            'visibilityBusStopPositionMenu' : 'hidden',
            'menuPosition' : {
                'x' : -1,
                'y' : -1
            }
        };
    var mouseStatus = {
            currX:0,
            currY:0,
            prevX:0,
            prevY:0,
            leftDownX:0,
            leftDownY:0,
            leftUpX:0,
            leftUpY:0,
            mouseDownOnBusStopLabelMenuBar : false,
            mouseDownOnBusStopPositionMenuBar : false
        };
    var canvas;
    var ribbonMenu;

        // jQuery doms
    // Todo. Do not hard cord dom ids.
    var $divLabelMenu;
    var $divLabelMenuBar;
    var $divDeleteLabelMenu;
    var $divHolderRightClickMenu;
    var $radioBusStopSignTypes;
    var $deleteMenuDeleteButton;
    var $deleteMenuCancelButton;
    var $divBusStopLabelMenuItems;
    var $divBusStopPositionMenu;
    var $divBusStopPositionMenuBar;
    var $divBusStopPositionMenuItems;
    var $btnBusStopPositionMenuBack;
    var $divHolderLabelMenuClose;
    var $divHolderPositionMenuClose;
    var $menuBars;
    var $spanHolderBusStopLabelMenuQuestionMarkIcon;
    var $spanHolderBusStopPositionMenuQuestionMarkIcon;


    ////////////////////////////////////////
    // Private functions
    ////////////////////////////////////////
    function init (params) {
        canvas = params.canvas;
        ribbonMenu = params.ribbonMenu;

        // Todo. Do not hard cord dom ids.
        $divLabelMenu = $("div#labelDrawingLayer_LabelMenu");
        $divLabelMenuBar = $("#labelDrawingLayer_LabelMenuBar");
        $divDeleteLabelMenu = $("div#LabelDeleteMenu");
        $divHolderRightClickMenu = $("div#Holder_RightClickMenu");
        $radioBusStopSignTypes = $("input.Radio_BusStopType");
        $deleteMenuDeleteButton = $("button#LabelDeleteMenu_DeleteButton");
        $deleteMenuCancelButton = $("button#LabelDeleteMenu_CancelButton");

        $divBusStopLabelMenuItems = $(".BusStopLabelMenuItem");
        $divHolderLabelMenuClose = $("#Holder_BusStopLabelMenuOptionCloseIcon");


        // Bus stop relative position menu
        $divBusStopPositionMenu = $("#BusStopPositionMenu");
        $divBusStopPositionMenuBar = $("#BusStopPositionMenu_MenuBar");
        $divBusStopPositionMenuItems = $(".BusStopPositionMenu_MenuItem");
        $btnBusStopPositionMenuBack = $("#BusStopPositinoMenu_BackButton");
        $divHolderPositionMenuClose = $("#Holder_BusStopPositionMenuCloseIcon");

        $menuBars = $(".RightClickMenuBar");

        $spanHolderBusStopLabelMenuQuestionMarkIcon = $('.Holder_BusStopLabelMenuQuestionMarkIcon');
        $spanHolderBusStopPositionMenuQuestionMarkIcon = $('.Holder_BusStopPositionMenuQuestionMarkIcon');

        // Attach listenters
        // $radioBusStopSignTypes.bind('mousedown', radioBusStopSignTypeMouseUp);
        // $deleteMenuDeleteButton.bind('mousedown', deleteMenuDeleteClicked);
        // $deleteMenuCancelButton.bind('mousedown', deleteMenuCancelClicked);

        // Bus stop label menu listeners
        $divBusStopLabelMenuItems.bind('mouseup', divBusStopLabelMenuItemsMouseUp);
        $divBusStopLabelMenuItems.bind('mouseenter', divBusStopLabelMenuItemsMouseEnter);
        $divBusStopLabelMenuItems.bind('mouseleave', divBusStopLabelMenuItemsMouseLeave);

        // Bus stop label menu menu-bar
        $divLabelMenuBar.bind('mousedown', divBusStopLabelMenuBarMouseDown);
        $divLabelMenuBar.bind('mouseup', divBusStopLabelMenuBarMouseUp);
        $divLabelMenuBar.bind('mousemove', divBusStopLabelMenuBarMouseMove);
        $divHolderLabelMenuClose.bind('click', divBusHolderLabelMenuCloseClicked);
        $divHolderLabelMenuClose.bind('mouseenter', divBusHolderLabelMenuCloseMouseEnter);
        $divHolderLabelMenuClose.bind('mouseleave', divBusHolderLabelMenuCloseMouseLeave);

        // Position menu listeners
        $divBusStopPositionMenuItems.bind('mouseup', divBusStopPositionMenuItemsMouseUp);
        $divBusStopPositionMenuItems.bind('mouseenter', divBusStopPositionMenuItemsMouseEnter);
        $divBusStopPositionMenuItems.bind('mouseleave', divBusStopPositionMenuItemsMouseLeave);

        $divBusStopPositionMenuBar.bind('mousedown', divBusStopPositionMenuBarMouseDown);
        $divBusStopPositionMenuBar.bind('mouseup', divBusStopPositionMenuBarMouseUp);
        $divBusStopPositionMenuBar.bind('mousemove', divBusStopPositionMenuBarMouseMove);
        $divHolderPositionMenuClose.bind('click', divBusHolderPositionMenuCloseClicked);
        $divHolderPositionMenuClose.bind('mouseenter', divBusHolderPositionMenuCloseMouseEnter);
        $divHolderPositionMenuClose.bind('mouseleave', divBusHolderPositionMenuCloseMouseLeave);


        // Question marks
        $spanHolderBusStopLabelMenuQuestionMarkIcon.bind({
            'mouseenter' : questionMarkMouseEnter,
            'mouseleave' : questionMarkMouseLeave,
            'mouseup' : questionMarkMouseUp
        });
        $spanHolderBusStopPositionMenuQuestionMarkIcon.bind({
            'mouseenter' : questionMarkMouseEnter,
            'mouseleave' : questionMarkMouseLeave,
            'mouseup' : questionMarkMouseUp
        });
        // menu bars
        $menuBars.bind('mouseenter', menuBarEnter);


        $btnBusStopPositionMenuBack.bind('click', busStopPositionMenuBackButtonClicked);
    }

    function questionMarkMouseEnter (e) {
        $(this).find('.tooltip').css('visibility', 'visible');
    }

    function questionMarkMouseLeave () {
        $(this).find('.tooltip').css('visibility', 'hidden');
    }

    function questionMarkMouseUp (e) {
        // Stopping propagation
        // http://stackoverflow.com/questions/13988427/add-event-listener-to-child-whose-parent-has-event-disabled
        e.stopPropagation();
        var category = $(this).parent().attr('value');
        myExamples.show(category);
    }

    function radioBusStopSignTypeMouseUp (e) {
        // This function is invoked when a user click a radio button in
        // the menu.
        // Show current bus stop label's tag and set subLabelType
        // (e.g. one-leg stop sign, two-leg stop sign)
        // canvas.getCurrentLabel().setStatus('visibilityTag', 'visible');
        oPublic.hideBusStopType();

        // Set the subLabelType of the label (e.g. "StopSign_OneLeg"
        var subLabelType = $(this).attr("val");
        canvas.getCurrentLabel().setSubLabelDescription(subLabelType);
        canvas.clear().render();

        // Snap back to walk mode.
        myMenu.backToWalk();
    }


    ////////////////////////////////////////
    // Private Functions (Bus stop label menu)
    ////////////////////////////////////////
    function menuBarEnter () {
        $(this).css('cursor', 'url(public/img/cursors/openhand.cur) 4 4, move');
    }


    function divBusStopLabelMenuItemsMouseUp () {
        if (!status.disableMenuSelect) {
            // This function is invoked when a user click on a bus stop label menu
            var color, iconImagePath, subLabelType, $menuItem;
            color = getLabelColors()['StopSign'].fillStyle;
            // currentLabel.setStatus('visibilityTag', 'visible');


            // Give a slight mouse click feedback to a user
            $menuItem = $(this);
            $menuItem.css('background','transparent');

            setTimeout(function () {
                $menuItem.css('background', color);
                setTimeout(function() {
                    $menuItem.css('background', 'transparent');

                    // Hide the menu
                    oPublic.hideBusStopType();

                    subLabelType = $menuItem.attr("value");
                    if (!subLabelType) {
                        subLabelType = 'StopSign';
                    }

                    // Set the subLabelType of the label (e.g. "StopSign_OneLeg"
                    status.currentLabel.setSubLabelDescription(subLabelType);
                    iconImagePath = getLabelIconImagePath()[subLabelType].iconImagePath;
                    status.currentLabel.setIconPath(iconImagePath);

                    canvas.clear().render();

                    showBusStopPositionMenu();
                }, 100)
            },100);
        }
    }


    function divBusStopLabelMenuItemsMouseEnter () {
        if (!status.disableMenuSelect) {
            var color = getLabelColors()['StopSign'].fillStyle;
            $(this).css({
                'background': color,
                'cursor' : 'pointer'
            });
            return this;
        }
        return false;
    }


    function divBusStopLabelMenuItemsMouseLeave () {
        if (!status.disableMenuSelect) {
            $(this).css({
                'background' : 'transparent',
                'cursor' : 'default'
            });
            return this;
        }
    }


    //
    // Bus stop label menu menu bar
    //
    function divBusStopLabelMenuBarMouseDown () {
        mouseStatus.mouseDownOnBusStopLabelMenuBar = true;
        $(this).css('cursor', 'url(public/img/cursors/closedhand.cur) 4 4, move');
    }


    function divBusStopLabelMenuBarMouseUp () {
        mouseStatus.mouseDownOnBusStopLabelMenuBar = false;
        $(this).css('cursor', 'url(public/img/cursors/openhand.cur) 4 4, move');
    }


    function divBusStopLabelMenuBarMouseMove (e) {
        if (mouseStatus.mouseDownOnBusStopLabelMenuBar) {
            var left = $divLabelMenu.css('left');
            var top = $divLabelMenu.css('top');
            var dx, dy;

            top = parseInt(top.replace("px", ""));
            left = parseInt(left.replace("px",""));

            dx = e.pageX - mouseStatus.prevX;
            dy = e.pageY - mouseStatus.prevY;
            left += dx;
            top += dy;

            // console.log(left, top, dx, dy);

            $divLabelMenu.css({
                'left' : left,
                'top' : top
            });
        }
        mouseStatus.prevX = e.pageX;
        mouseStatus.prevY = e.pageY;
    }


    function divBusHolderLabelMenuCloseClicked () {
        // Label menu close is clicked
        // First close the menu, then delete the generated label.
        if (!status.disableMenuClose) {
            var prop;

            // Check if Bus stop type and bus stop position is set.
            // If not, set the label as deleted, so when a user do
            // Undo -> Redo the label will be treated as deleted and won't show up
            if (status.currentLabel) {
                prop = status.currentLabel.getProperties();
                if (prop.labelProperties.busStopPosition === 'DefaultValue' ||
                    prop.labelProperties.subLabelDescription === 'DefaultValue') {
                    myCanvas.removeLabel(status.currentLabel);
                    myActionStack.pop();
                }
            }
            mouseStatus.mouseDownOnBusStopLabelMenuBar = false;
            oPublic.hideBusStopType();
            canvas.enableLabeling();
            myMenu.setStatus('disableModeSwitch', false);
        }
    }


    function divBusHolderLabelMenuCloseMouseEnter () {
        if (!status.disableMenuClose) {
            $(this).css('cursor', 'pointer');
        }
    }


    function divBusHolderLabelMenuCloseMouseLeave () {
        $(this).css('cursor', 'default');
    }


    ////////////////////////////////////////
    // Private Functions (Bus stop position menu)
    ////////////////////////////////////////
    function divBusStopPositionMenuItemsMouseUp () {
        if (!status.disableMenuSelect) {
            // Set label values
            var busStopPosition, color, currentLabel, $menuItem;
            color = getLabelColors()['StopSign'].fillStyle;

            status.currentLabel.setStatus('visibilityTag', 'visible');

            $menuItem = $(this);
            $menuItem.css('background','transparent');

            // Set bus stop position (e.g. Next
            busStopPosition = $menuItem.attr('value');
            status.currentLabel.setBusStopPosition(busStopPosition);

            setTimeout(function () {
                $menuItem.css('background', color);
                setTimeout(function() {
                    $menuItem.css('background', 'transparent');

                    // Close the menu
                    hideBusStopPositionMenu();
                    // Snap back to walk mode.
                    myMap.enableWalking();
                    myMenu.backToWalk();
                    // myMap.setStatus('disableWalking', false);
                }, 100)
            },100);
        }
    }


    function divBusStopPositionMenuItemsMouseEnter () {
        if (!status.disableMenuSelect) {
            var color = getLabelColors()['StopSign'].fillStyle;
            $(this).css({
                'background': color,
                'cursor' : 'pointer'
            });
            return this;
        }
    }


    function divBusStopPositionMenuItemsMouseLeave () {
        if (!status.disableMenuSelect) {
            $(this).css({
                'background': 'transparent',
                'cursor' : 'default'
            });
            return this;
        }
    }


    function divBusHolderPositionMenuCloseMouseEnter () {
        if (!status.disableMenuClose) {
            $(this).css({
                'cursor' : 'pointer'
            });
        }
    }


    function divBusHolderPositionMenuCloseMouseLeave () {
        $(this).css({
            'cursor' : 'default'
        });
    }


    function divBusHolderPositionMenuCloseClicked () {
        // Label position menu close is clicked
        // First close the menu, then delete the generated label.
        if (!status.disableMenuClose &&
            status.currentLabel) {
            var prop;

            // Check if Bus stop type and bus stop position is set.
            // If not, set the label as deleted, so when a user do
            // Undo -> Redo the label will be treated as deleted and won't show up
            prop = status.currentLabel.getProperties();
            if (prop.labelProperties.busStopPosition === 'DefaultValue' ||
                prop.labelProperties.subLabelDescription === 'DefaultValue') {
                myCanvas.removeLabel(status.currentLabel);
                myActionStack.pop();
            }

            // Hide the menu
            mouseStatus.mouseDownOnBusStopPositionMenuBar = false;
            hideBusStopPositionMenu();
            canvas.enableLabeling();
            myMenu.setStatus('disableModeSwitch', false);
        }
    }


    //
    // Menu bar
    //
    function divBusStopPositionMenuBarMouseDown (e) {
        mouseStatus.mouseDownOnBusStopPositionMenuBar = true;
        $(this).css('cursor', 'url(public/img/cursors/closedhand.cur) 4 4, move');
    }


    function divBusStopPositionMenuBarMouseUp (e) {
        mouseStatus.mouseDownOnBusStopPositionMenuBar = false;
        $(this).css('cursor', 'url(public/img/cursors/openhand.cur) 4 4, move');
    }


    function divBusStopPositionMenuBarMouseMove (e) {
        if (mouseStatus.mouseDownOnBusStopPositionMenuBar) {
            var left = $divBusStopPositionMenu.css('left');
            var top = $divBusStopPositionMenu.css('top');
            var dx, dy;

            top = parseInt(top.replace("px", ""));
            left = parseInt(left.replace("px",""));

            dx = e.pageX - mouseStatus.prevX;
            dy = e.pageY - mouseStatus.prevY;
            left += dx;
            top += dy;

            // console.log(left, top, dx, dy);

            $divBusStopPositionMenu.css({
                'left' : left,
                'top' : top
            });
        }
        mouseStatus.prevX = e.pageX;
        mouseStatus.prevY = e.pageY;
    }

    function hideBusStopPositionMenu () {
        status.visibilityBusStopPositionMenu = 'hidden';

        $divHolderRightClickMenu.css('visibility', 'hidden');
        $divBusStopPositionMenu.css('visibility', 'hidden');

        if (oPublic.isAllClosed()) {
            canvas.setStatus('disableLabeling', false);
            myMenu.setStatus('disableModeSwitch', false);

            status.disableLabelDelete = false;
            status.currentLabel = undefined;

            myActionStack.unlockDisableRedo().enableRedo().lockDisableRedo();
            myActionStack.unlockDisableUndo().enableUndo().lockDisableUndo();
            myForm.unlockDisableSubmit().enableSubmit().lockDisableSubmit();
            myForm.unlockDisableNoBusStopButton().enableNoBusStopButton().lockDisableNoBusStopButton();
        }
    }


    function showBusStopPositionMenu () {
        var menuX = status.menuPosition.x,
            menuY = status.menuPosition.y;
        status.visibilityBusStopPositionMenu = 'visible';

        // Show the right-click menu layer
        // $divHolderRightClickMenu.css('visibility', 'visible');


        // Set the menu bar color
        $divBusStopPositionMenuBar.css({
            'background' : getLabelColors()['StopSign'].fillStyle
        });


        // If menu position is to low or to much towards right,
        // adjust the position
        if (menuX > 400) {
            menuX -= 300;
        }
        if (menuY > 300) {
            menuY -= 200;
        }

        // Show the bus stop position menu
        $divBusStopPositionMenu.css({
            'visibility': 'visible',
            'position' : 'absolute',
            'left' : menuX,
            'top' : menuY,
            'z-index' : 4
        });

        canvas.setStatus('visibilityMenu', 'visible');
        canvas.disableLabeling();
        myMenu.setStatus('disableModeSwitch', true);
        myActionStack.unlockDisableRedo().disableRedo().lockDisableRedo();
        myActionStack.unlockDisableUndo().disableUndo().lockDisableUndo();
    }


    //
    // Back button
    //
    function busStopPositionMenuBackButtonClicked () {
        // Hide bus stop position menu and show sign label menu.
        var currentLabel = status.currentLabel;
        hideBusStopPositionMenu();
        oPublic.showBusStopType(currentLabel.getCoordinate().x, currentLabel.getCoordinate().y);
    }


    ////////////////////////////////////////
    // Private Functions (Deleting labels)
    ////////////////////////////////////////
    function deleteMenuDeleteClicked() {
        canvas.removeLabel(canvas.getCurrentLabel());
        oPublic.hideDeleteLabel();
        myActionStack.push('deleteLabel', canvas.getCurrentLabel());
    }


    function deleteMenuCancelClicked () {
        oPublic.hideDeleteLabel();
    }


    ////////////////////////////////////////
    // oPublic functions
    ////////////////////////////////////////
    oPublic.close = function () {
        // Esc pressed. close all menu windows
        divBusHolderLabelMenuCloseClicked();
        divBusHolderPositionMenuCloseClicked();
    };


    oPublic.disableMenuClose = function () {
        status.disableMenuClose = true;
        return this;
    };


    oPublic.disableMenuSelect = function () {
        if (!status.lockDisableMenuSelect) {
            status.disableMenuSelect = true;
        }
        return this;
    };


    oPublic.enableMenuClose = function () {
        status.disableMenuClose = false;
        return this;
    };


    oPublic.enableMenuSelect = function () {
        if (!status.lockDisableMenuSelect) {
            status.disableMenuSelect = false;
        }
        return this;
    };


    oPublic.getMenuPosition = function () {
        return {
            x : status.menuPosition.x,
            y : status.menuPosition.y
        };
    };


    oPublic.hideBusStopPosition = function () {
        // Hide the right click menu for choosing a bus stop position.
        hideBusStopPositionMenu();
        return this;
    };


    oPublic.hideBusStopType = function () {
        // Hide the right click menu for choosing a bus stop type.

        // Hide the right-click menu layer
        $divHolderRightClickMenu.css('visibility', 'hidden');

        // Hide the bus stop label menu
        $divLabelMenu.css('visibility', 'hidden');
        status.visibilityBusStopLabelMenu = 'hidden';

        canvas.setStatus('visibilityMenu', 'hidden');

        if (oPublic.isAllClosed()) {
            myActionStack.unlockDisableRedo().enableRedo().lockDisableRedo();
            myActionStack.unlockDisableUndo().enableUndo().lockDisableUndo();
            myForm.unlockDisableSubmit().disableSubmit().lockDisableSubmit();
            myForm.unlockDisableNoBusStopButton().disableNoBusStopButton().lockDisableNoBusStopButton();
        }
    };


    oPublic.hideDeleteLabel = function () {
        // Hide the right-click menu layer
        $divHolderRightClickMenu.css('visibility', 'hidden');
        status.visibilityDeleteMenu = 'hidden';

        $divDeleteLabelMenu.css('visibility', 'hidden');
        canvas.setStatus('visibilityMenu', 'hidden');

        if (oPublic.isAllClosed()) {
            canvas.enableLabeling();
            myMenu.setStatus('disableModeSwitch', false);
        }
    };


    oPublic.isAllClosed = function () {
        // This function checks if all the menu windows are hidden and return true/false
        if (status.visibilityBusStopLabelMenu === 'hidden' &&
            status.visibilityDeleteMenu === 'hidden' &&
            status.visibilityBusStopPositionMenu === 'hidden') {
            return true;
        } else {
            return false;
        }
    };


    oPublic.isAnyOpen = function () {
        // This function checks if any menu windows is open and return true/false
        return !oPublic.isAllClosed();
    };


    oPublic.lockDisableMenuSelect = function () {
        status.lockDisableMenuSelect = true;
        return this;
    };

    oPublic.setStatus = function (key, value) {
        if (key in status) {
            if (key === 'disableMenuClose') {
                if (typeof value === 'boolean') {
                    if (value) {
                        oPublic.enableMenuClose();
                    } else {
                        oPublic.disableMenuClose();
                    }
                    return this;
                } else {
                    return false;
                }
            } else {
                status[key] = value;
                return this;
            }
        }
        return false;
    };


    oPublic.showBusStopType = function (x, y) {
        status.currentLabel = canvas.getCurrentLabel();

        if (status.currentLabel &&
            status.currentLabel.getLabelType() === 'StopSign') {
            // Show bus stop label menu
            var menuX, menuY;

            // Show the right-click menu layer
            $divHolderRightClickMenu.css('visibility', 'visible');
            status.visibilityBusStopLabelMenu = 'visible';

            // Set the menu bar color
            $divLabelMenuBar.css({
                'background' : getLabelColors()['StopSign'].fillStyle
            });


            menuX = x + 25;
            menuY = y + 25;

            // If menu position is to low or to much towards right,
            // adjust the position
            if (menuX > 400) {
                menuX -= 300;
            }
            if (menuY > 300) {
                menuY -= 200;
            }

            status.menuPosition.x = menuX;
            status.menuPosition.y = menuY;

            // Show the bus stop label menu
            $divLabelMenu.css({
                'visibility' : 'visible',
                'position' : 'absolute',
                'left' : menuX,
                'top' : menuY,
                'z-index' : 4
            });
            status.visibilityBusStopLabelMenu = 'visible';

            canvas.setStatus('visibilityMenu', 'visible');
            canvas.setStatus('disableLabeling', true);
            canvas.disableLabeling();
            myMap.setStatus('disableWalking', true);
            myMenu.setStatus('disableModeSwitch', true);
        }

    };


    oPublic.showDeleteLabel = function (x, y) {
        // This function shows a menu to delete a label that is in
        // canvas and under the current cursor location (x, y)
        var menuX, menuY;

        if (!status.disableLabelDelete) {
            // Show the right-click menu layer
            $divHolderRightClickMenu.css('visibility', 'visible');


            menuX = x - 5;
            menuY = y - 5

            $divDeleteLabelMenu.css({
                'visibility' : 'visible',
                'position' : 'absolute',
                'left' : menuX,
                'top' : menuY,
                'z-index' : 4
            });
            status.visibilityDeleteMenu = 'visible';

            status.visibilityMenu = 'visible';
            status.disableLabeling = true;
            // myMap.setStatus('disableWalking', true);
            myMenu.setStatus('disableModeSwitch', true);
        }
    };


    oPublic.unlockDisableMenuSelect = function () {
        status.lockDisableMenuSelect = false;
        return this;
    };

    ////////////////////////////////////////
    // Initialization
    ////////////////////////////////////////
    init(params);
    return oPublic;
}
/**
 * Created with JetBrains PhpStorm.
 * User: kotaro
 * Date: 8/19/13
 * Time: 9:44 PM
 * To change this template use File | Settings | File Templates.
 */

var svw = svw || {};

function Tooltip ($, param) {
    var self = {className: 'Tooltip'};
    var properties = {};
    var status = {};

    var $divToolTip;

    ////////////////////////////////////////
    // Private functions
    ////////////////////////////////////////
    function _init(param) {
        $divToolTip = $(param.domIds.tooltipHolder);
    }

    ////////////////////////////////////////
    // Public functions
    ////////////////////////////////////////
    self.show = function (message) {
        $divToolTip.html(message);
        $divToolTip.css('visibility', 'visible');
    };

    self.hide = function () {
        $divToolTip.css('visibility', 'hidden');
    };

    _init(param);
    return self;
}

/**
 * Created with JetBrains PhpStorm.
 * User: kotarohara
 * Date: 4/3/13
 * Time: 12:00 AM
 * To change this template use File | Settings | File Templates.
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

    var undefinedMsg = 'undefined';

    ////////////////////////////////////////////////////////////
    // Public functions
    ////////////////////////////////////////////////////////////
    self.getActions = function () {
        return actions;
    };

    self.getAvailableActionTypes = function () {
      var tempArray = availableActionTypes.slice(0);
      return tempArray;
    };

    self.push = function (action, param) {
        // This function pushes action type, time stamp, current pov, and current panoId
        // into actions list.
        if (availableActionTypes.indexOf(action) === -1) {
            console.warn('Unknown action: ' + action);
            return false;
        } else {
            var pov;
            var latlng;
            var panoId;
            var dump;
            var x;
            var y;
            var note;

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
                    note = undefinedMsg;
                }
            } else {
                note = undefinedMsg;
            }

            //
            // Initialize variables. Note you cannot get pov, panoid, or position
            // before the map and SV load.
            try {
                pov = svw.getPOV();
            } catch (err) {
                pov = {
                    heading: undefinedMsg,
                    pitch: undefinedMsg,
                    zoom: undefinedMsg
                }
            }

            try {
                latlng = getPosition();
            } catch (err) {
                latlng = {
                    lat: undefinedMsg,
                    lng: undefinedMsg
                };
            }
            if (!latlng) {
                latlng = {
                    lat: undefinedMsg,
                    lng: undefinedMsg
                };
            }

            try {
                panoId = getPanoId();
            } catch (err) {
                panoId = undefinedMsg;
            }

            dump = {
                actionType : action,
                heading: pov.heading,
                lat: latlng.lat,
                lng: latlng.lng,
                panoId: panoId,
                pitch: pov.pitch,
                timestamp: new Date().getTime(),
                zoom: pov.zoom,
                note: note
            };
            actions.push(dump);
            return this;
        }
    };

    return self;
}

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

      // ProgressPov
      self.progressPov = {};
      self.progressPov.rate = $("#Holder_CurrentCompletionRate");
      self.progressPov.bar = $("#Holder_CurrentCompletionBar");
      self.progressPov.filler = $("#Holder_CurrentCompletionBarFiller");

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

var svw = svw || {}; // Street View Walker namespace.

////////////////////////////////////////////////////////////////////////////////
// Validator
////////////////////////////////////////////////////////////////////////////////
function Validator (param, $) {
    var oPublic = {
        'className' : 'Validator'
    };
    var properties = {
        onboarding: false
    };
    var status = {
        allLabelsHaveBeenValidated: false,
        disableAgreeButton: false,
        disableDisagreeButton: false,
        disableRadioButtons: false,
        menuBarMouseDown: false,
        radioCurrentLabelCheckState: 'ShowLabel',
        radioCurrentLabelHoverState: 'ShowLabel'
    };
    var mouse = {
        menuBarMouseDownX: undefined,
        menuBarMouseDownY: undefined,
        menuBarMouseUpX: undefined,
        menuBarMouseUpY: undefined,
        menuBarPrevX: undefined,
        menuBarPrevY: undefined
    };
    var currentLabel = undefined;
    var labels = [];

    var $divHolderValidation;
    var $divValidationMenuBar;
    var $divValidationDialogWindow;
    var $validationLabelMessage;
    var $btnAgree;
    var $btnDisagree;
    var $spansValidationCurrentLabeliVisibility;
    var $radioValidationCurrentLabelVisibility;
    var $spanNumCompletedTasks;
    var $spanNumTotalTasks;
    var $divProgressBarFiller;

    ////////////////////////////////////////
    // Private functions
    ////////////////////////////////////////
    function currentLabelVisibilitySpanMousein (e) {
        // This is a mousein callback method for spans that hold ShowLabel/HideLabel radio buttons
        var $span = $(this);
        var radioValue = $span.attr("value"); // $span.find('input').attr('value');

        $span.css('background', 'rgba(230, 230, 230, 1)');
        status.radioCurrentLabelHoverState = radioValue;

        highlightCurrentLabel();
    }

    function currentLabelVisibilitySpanMouseout (e) {
        // This is a mouseout callback method for spans that hold ShowLabel/HideLabel radio buttons
        var $span = $(this);
        $span.css('background', 'transparent');
        status.radioCurrentLabelHoverState = 'ShowLabel';
        highlightCurrentLabel();
    }

    function currentLabelVisibilityRadioMousedown (e) {
        // This is a mousedown callback method for ShowLabel/HideLabel checkboxes.
        var radioValue = $(this).attr('value');
        status.radioCurrentLabelCheckState = radioValue;
        highlightCurrentLabel();
    }

    function getBoundingBox(povIn) {
        // This function takes
        var j;
        var len;
        var canvasCoords;
        var pov = povIn;
        var xMax = -1;
        var xMin = 1000000;
        var yMax = -1;
        var yMin = 1000000;

        // Check on points
        canvasCoords = getCanvasCoordinates(pov);
        len = canvasCoords.length;

        for (j = 0; j < len; j += 1) {
            var coord = canvasCoords[j];

            if (coord.x < xMin) {
                xMin = coord.x;
            }
            if (coord.x > xMax) {
                xMax = coord.x;
            }
            if (coord.y < yMin) {
                yMin = coord.y;
            }
            if (coord.y > yMax) {
                yMax = coord.y;
            }
        }

        return {
            x: xMin,
            y: yMin,
            width: xMax - xMin,
            height: yMax - yMin
        };
    }

    function getCanvasCoordinates (pov, imCoords) {
        // Get canvas coordinates of points that constitute the label.
        // param imCoords: a list of image coordinates, i.e., [{x: xVal, y: yVal}, ...]
        // var imCoords = getImageCoordinates();
        var i;
        var len = imCoords.length;
        var canvasCoord;
        var canvasCoords = [];

        var min = 10000000;
        var max = -1;

        for (i = 0; i < len; i += 1) {
            if (min > imCoords[i].x) {
                min = imCoords[i].x;
            }
            if (max < imCoords[i].x) {
                max = imCoords[i].x;
            }
        }

        // Note canvasWidthInGSVImage is approximately equals to the image width of GSV image that fits in one canvas view
        var canvasWidthInGSVImage = 3328;
        for (i = 0; i < len; i += 1) {
            if (pov.heading < 180) {
                if (max > svw.svImageWidth - canvasWidthInGSVImage) {
                    if (imCoords[i].x > canvasWidthInGSVImage) {
                        imCoords[i].x -= svw.svImageWidth;
                    }
                }
            } else {
                if (min < canvasWidthInGSVImage) {
                    if (imCoords[i].x < svw.svImageWidth - canvasWidthInGSVImage) {
                        imCoords[i].x += svw.svImageWidth;
                    }
                }
            }
            canvasCoord = svw.gsvImageCoordinate2CanvasCoordinate(imCoords[i].x, imCoords[i].y, pov);
            canvasCoords.push(canvasCoord);
        }

        return canvasCoords;
    }

    function getLabelBottom(label) {
        // This method gets the largest y-coordinate (i.e., closest to the bottom of the canvas) of label points
        //
        var i;
        var len = label.points.length;
        var pov = svw.getPOV();
//        {
//            heading: parseFloat(label.points[0].heading),
//            pitch: parseFloat(label.points[0].pitch),
//            zoom: parseFloat(label.points[0].zoom)
//        };

        // Format a label points.
        var point = undefined;
        var points = [];
        for (i = 0; i < len; i++) {
            point = {
                x: parseInt(label.points[i].svImageX),
                y: parseInt(label.points[i].svImageY)
            };
            points.push(point)
        }

        // Get the min
        var canvasCoordinates = getCanvasCoordinates(pov, points);

        var coord;
        var maxY = -1;
        for (i = 0; i < len; i++) {
            coord = canvasCoordinates[i];
            if (maxY < coord.y) {
                maxY = coord.y;
            }
        }
        return maxY;
    }

    function getLabelLeft(label) {
        // This method gets the smallest x-coordinate of label points
        //
        var i;
        var len = label.points.length;
        var pov = {
            heading: parseFloat(label.points[0].heading),
            pitch: parseFloat(label.points[0].pitch),
            zoom: parseFloat(label.points[0].zoom)
        };

        // Format a label points.
        var point = undefined;
        var points = [];
        for (i = 0; i < len; i++) {
            point = {
                x: parseInt(label.points[i].svImageX),
                y: parseInt(label.points[i].svImageY)
            };
            points.push(point)
        }

        // Get the min
        var canvasCoordinates = getCanvasCoordinates(pov, points);

        var coord;
        var minX = 1000000;
        for (i = 0; i < len; i++) {
            coord = canvasCoordinates[i];
            if (minX > coord.x) {
                minX = coord.x;
            }
        }
        return minX;
    }

    function getNextLabel () {
        // Get the next label that is not validated (i.e., label.validated == false)
        // This method returns false if all the labels have been validated.
        var i;
        var len = labels.length;
        var label;
        var allLabelsHaveBeenValidated = true;
        for (i = 0; i < len; i++) {
            label = labels[i];
            if (!label.validated) {
                allLabelsHaveBeenValidated = false;
                break;
            }
        }

        if (allLabelsHaveBeenValidated) {
            status.allLabelsHaveBeenValidated = allLabelsHaveBeenValidated;
            return false;
        } else {
            return label;
        }
    }

    function getNumTasksDone () {
        // Get number of tasks that are done.
        var i;
        var numTotalTasks = labels.length;
        var numTasksDone = 0;
        for (i = 0; i < numTotalTasks; i ++) {
            if (labels[i].validated) {
                numTasksDone += 1;
            }
        }
        return numTasksDone;
    }

    function hideDialogWindow () {
        // Hide the dialog box
        $divValidationDialogWindow.css('visibility', 'hidden');
    }

    function highlightCurrentLabel () {
        // Highlight the current label and dim the rest by changing the label properties
        if (!currentLabel) {
            throw oPublic.className + ': highlightCurrentLabel(): currentLabel is not set.';
        }
        var i;
        var j;
        var len;
        var canvasLabels;
        var canvasLabel;
        var canvasPath;
        var pathPoints;
        var pathPointsLen;

        if (svw.canvas) {
            var showLabel = undefined;
            canvasLabels = svw.canvas.getLabels();
            len = canvasLabels.length;

            // Decided whether currentLabel should be visible or not.
//            if (status.radioCurrentLabelHoverState) {
//                if (status.radioCurrentLabelHoverState === 'ShowLabel') {
//                    showLabel = true;
//                } else {
//                    showLabel = false;
//                }
//            } else {
//                if (status.radioCurrentLabelCheckState === 'ShowLabel') {
//                    showLabel = true;
//                } else {
//                    showLabel = false;
//                }
//            }
            if (status.radioCurrentLabelHoverState === 'ShowLabel') {
                showLabel = true;
            } else {
                showLabel = false;
            }

            for (i = 0; i < len; i ++) {
                canvasLabel = canvasLabels[i];
                canvasPath = canvasLabel.getPath(true); // Get a reference to the currentPath
                if (currentLabel.meta.labelId === canvasLabels[i].getProperty("labelId") &&
                    showLabel) {
                    // Highlight the label
                    // Change the fill and stroke color of a path to the original color (green and white)
                    // canvasPath.resetFillStyle();
                    // canvasPath.resetStrokeStyle();
                    canvasLabel.setVisibility('visible');

                    // Change the fill and stroke color of points to the original color
                    pathPoints = canvasPath.points;
                    pathPointsLen = pathPoints.length;
                    for (j = 0; j < pathPointsLen; j++) {
                        pathPoints[j].resetFillStyle();
                        pathPoints[j].resetStrokeStyle();
                    }
                } else {
                    // Dim the label
                    // Make fill and stroke of a path invisible
                    // canvasPath.setFillStyle('rgba(255,255,255,0)');
                    // canvasPath.setStrokeStyle('rgba(255,255,255,0)');
                    canvasLabel.setVisibility('hidden');

                    // Change the fill and stroke color of points invisible
                    pathPoints = canvasPath.points;
                    pathPointsLen = pathPoints.length;
                    for (j = 0; j < pathPointsLen; j++) {
                        pathPoints[j].setFillStyle('rgba(255,255,255,0)');
                        pathPoints[j].setStrokeStyle('rgba(255,255,255,0)');
                    }
                }

            }
            svw.canvas.clear();
            svw.canvas.render2();
        } else {
            throw oPublic.className + ': highlightCurrentLabel(): canvas is not defined.';
        }
    }

    function init(param) {
        properties.previewMode = param.previewMode;

        $divHolderValidation = $(param.domIds.holder);
        $divValidationDialogWindow = $("#ValidationDialogWindow");
        $divValidationMenuBar = $("#ValidationDialogWindowMenuBar");
        $validationLabelMessage = $("#ValidationLabelValue");
        $btnAgree = $("#ValidationButtonAgree");
        $btnDisagree =$("#ValidationButtonDisagree");
        $spansValidationCurrentLabeliVisibility = $(".SpanValidationCurrentLabeliVisibility");
        $radioValidationCurrentLabelVisibility = $(".RadioValidationCurrentLabelVisibility");

        $spanNumCompletedTasks = $("#NumCompletedTasks");
        $spanNumTotalTasks = $("#NumTotalTasks");
        $divProgressBarFiller = $("#ProgressBarFiller");

        // Attach listeners
        $divValidationMenuBar.on({
            mousedown: validationMenuBarMousedown,
            mouseleave: validationMenuBarMouseleave,
            mousemove: validationMenuBarMousemove,
            mouseup: validationMenuBarMouseup
        });

        $spansValidationCurrentLabeliVisibility.hover(currentLabelVisibilitySpanMousein, currentLabelVisibilitySpanMouseout);
        $radioValidationCurrentLabelVisibility.on('mousedown', currentLabelVisibilityRadioMousedown);

        $btnAgree.on('click', validationButtonAgreeClick);
        $btnDisagree.on('click', validationButtonDisagreeClick);

        hideDialogWindow();
        updateProgress();

        $("#Holder_GoogleMap").css('visibility', 'hidden');
    }

    function showDialogWindow (timelapse) {
        // This method shows a dialog window to ask a user whether a current label is valid/invalid label.
        // If timelapse is specified, wait for timelapse milli-seconds to show the window.
        if (typeof(timelapse) !== "number") {
            console.error(oPublic.className, 'A parameter of showDialogWindow() should be in milli-seconds (number).');
            timelapse = undefined;
        }

        if (currentLabel) {
            var maxY = getLabelBottom(currentLabel); // Get the largest y-coordinate (i.e., closest to the bottom of the canvas) of label points
            var minX = getLabelLeft(currentLabel); // Get the smallest x-coordinate
            var message;

            if (currentLabel.meta.labelType === 'CurbRamp') {
                message = "We believe the green box (label) is correctly placed on a curb ramp in this image. Do you agree?";
                // message = 'We believe the <span class="bold">green box is placed on a curb ramp</span> in this image.';
            } else {
                message = 'We believe <span class="bold">there should be a curb ramp</span> under the highlighted area.';
            }
            $validationLabelMessage.html(message);
            // console.log(currentLabel.meta.labelType);

            if (timelapse) {
            // if (false) {
                setTimeout(function () {
                    // Recalculate. Hm, then the previous calculation is redundant.
                    maxY = getLabelBottom(currentLabel);
                    minX = getLabelLeft(currentLabel);
                    $divValidationDialogWindow.css({
                        left: minX,
                        top: maxY + 20,
                        visibility: 'visible'
                    });
                }, timelapse);

            } else {
                $divValidationDialogWindow.css({
                    left: minX,
                    top: maxY + 20,
                    visibility: 'visible'
                });
            }
        }
    }

    function updateProgress () {
        // This method updates the number of completed tasks and the progress bar in the interface.
        var numTotalTasks = labels.length;
        var numTasksDone = 0;
        numTasksDone = getNumTasksDone();

        $spanNumCompletedTasks.text(numTasksDone);
        $spanNumTotalTasks.text(numTotalTasks);

        var widthRatio = numTasksDone / numTotalTasks;
        var widthPercentage = parseInt(widthRatio * 100, 10) + '%'

        var r;
        var g;
        var rgbValue;
        if (widthRatio < 0.5) {
            r = 255;
            g = parseInt(255 * widthRatio * 2);
        } else {
            r = parseInt(255 * (1 - widthRatio) * 2);
            g = 255;
        }
        rgbValue = 'rgb(' + 4 + ',' + g + ', 0)';

        $divProgressBarFiller.css({
            background: rgbValue,
            width: widthPercentage
        });
    }

    function validationButtonAgreeClick () {
        // A callback function for click on an Agree button
        if (!currentLabel) {
            // if a current label is not set, set one.
            currentLabel = getNextLabel();
            if (!currentLabel) {
                // Todo. Navigate to submit validations
            }
        }
        currentLabel.validated = true;
        currentLabel.validationLabel = 'Agree';


        // svw.validatorForm.submit(); // Debug

        oPublic.validateNext();
        updateProgress();

        //
        // Return when everything is verified
        if (properties.onboarding) {
            return false;
        }
        if (getNumTasksDone() < labels.length) {
            return false;
        } else {
            if (properties.previewMode) {
                // Not a preview mode
                window.location.reload();
                return false;
            } else {
                // Return if it is not a preview mode.
                return true;
            }
        }
    }

    function validationButtonDisagreeClick () {
        // A callback function for click on a Disagree button
        if (!currentLabel) {
            // if a current label is not set, set one...
            currentLabel = getNextLabel();
            if (!currentLabel) {
                // Todo. Navigate to submit validations
            }
        }
        currentLabel.validated = true;
        currentLabel.validationLabel = 'Disagree';
        oPublic.validateNext();
        updateProgress();

        //
        // Return when everything is verified
        if (properties.onboarding) {
            return false;
        }
        if (getNumTasksDone() < labels.length) {
            return false;
        } else {
            if (properties.previewMode) {
                // Not a preview mode
                window.location.reload();
                return false;
            } else {
                // Return if it is not a preview mode.
                return true;
            }
        }
    }

    function validationMenuBarMousedown (e) {
        // A callback function for mousedown on a menu bar
        var m = mouseposition(e, 'body');

        status.menuBarMouseDown = true;
        mouse.menuBarPrevX = m.x;
        mouse.menuBarPrevY = m.y;
        mouse.menuBarMouseDownX = m.x;
        mouse.menuBarMouseDownY = m.y;
    }

    function validationMenuBarMouseleave (e) {
        // A callback function for mouseleave on a menu bar
        var m = mouseposition(e, 'body');

        status.menuBarMouseDown = false;
        mouse.menuBarMouseUpX = m.x;
        mouse.menuBarMouseUpY = m.y;
    }

    function validationMenuBarMousemove (e) {
        // A callback function for mousemove on a menu bar
        var m = mouseposition(e, 'body');
        if (status.menuBarMouseDown) {
            // Move around the validation dialog window if mouse is held down on the menu bar

            if (m && m.x && m.y && mouse.menuBarPrevX && mouse.menuBarPrevX) {
                var dx = m.x - mouse.menuBarPrevX;
                var dy = m.y - mouse.menuBarPrevY;

                // Get css top/left values as number
                // http://stackoverflow.com/questions/395163/get-css-top-value-as-number-not-as-string
                var currX = parseInt($divValidationDialogWindow.css('left'), 10);
                var currY = parseInt($divValidationDialogWindow.css('top'), 10);

                $divValidationDialogWindow.css({
                    left: currX + dx,
                    top: currY + dy
                });
            }
        }

        mouse.menuBarPrevX = m.x;
        mouse.menuBarPrevY = m.y;
    }

    function validationMenuBarMouseup (e) {
        // A callback function for mouseup on a menu bar
        var m = mouseposition(e, 'body');

        status.menuBarMouseDown = false;
        mouse.menuBarMouseUpX = m.x;
        mouse.menuBarMouseUpY = m.y;
    }

    ////////////////////////////////////////
    // Public functions
    ////////////////////////////////////////
    oPublic.disableAgreeButton = function () {
        // This method disables the Agree button.
        status.disableAgreeButton = true;
        $btnAgree.css('opacity', '0.5');
        $btnAgree.attr('disabled', true);
        return this;
    };

    oPublic.disableDisagreeButton = function () {
        // This method disables the Disagree button.
        status.disableDisagreeButton = true;
        $btnDisagree.css('opacity', '0.5');
        $btnDisagree.attr('disabled', true);
        return this;
    };

    oPublic.disableRadioButtons = function () {
        // This method disables "Show label" and "Hide label" radio buttons
        status.disableRadioButtons = true;
        $radioValidationCurrentLabelVisibility.each(function (i, v) {
            $(v).attr('disabled', true);
        });
        return this;
    };

    oPublic.enableAgreeButton = function () {
        // This method enables the Agree button.
        status.disableAgreeButton = false;
        $btnAgree.css('opacity', '1');
        $btnAgree.attr('disabled', false);
        return this;
    };

    oPublic.enableDisagreeButton = function () {
        // This method enables the Disagree button.
        status.disableDisagreeButton = false;
        $btnDisagree.css('opacity', '1');
        $btnDisagree.attr('disabled', false);
    };

    oPublic.enableRadioButtons = function () {
        // This method enables "Show label" and "Hide label" radio buttons
        status.disableRadioButtons = false;
        $radioValidationCurrentLabelVisibility.each(function (i, v) {
            $(v).attr('disabled', false);
        });
        return;
    };

    oPublic.getLabels = function () {
        // This method returns validatorLabels
        return $.extend(true, [], labels);
    };

    oPublic.hideDialogWindow = function () {
        // This method hides a dialog window
        hideDialogWindow();
        return this;
    };

    oPublic.insertLabels = function (labelPoints) {
        // This method takes a label data (i.e., a set of point coordinates, label types, etc) and
        // and insert it into the labels array so the Canvas will render it
        var labelDescriptions = svw.misc.getLabelDescriptions();

        var param = {};
        param.canvasWidth = svw.canvasWidth;
        param.canvasHeight = svw.canvasHeight;
        param.canvasDistortionAlphaX = svw.alpha_x;
        param.canvasDistortionAlphaY = svw.alpha_y;
        param.labelId = labelPoints[0].LabelId;
        param.labelType = labelPoints[0].LabelType;
        param.labelDescription = labelDescriptions[param.labelType].text;
        param.panoId = labelPoints[0].LabelGSVPanoramaId;
        param.panoramaLat = labelPoints[0].Lat;
        param.panoramaLng = labelPoints[0].Lng;
        param.panoramaHeading = labelPoints[0].heading;
        param.panoramaPitch = labelPoints[0].pitch;
        param.panoramaZoom = labelPoints[0].zoom;
        param.svImageWidth = svw.svImageWidth;
        param.svImageHeight = svw.svImageHeight;
        param.svMode = 'html4';

        var label = {
            meta: param,
            points: labelPoints,
            validated: false,
            validationLabel: undefined
        };

        labels.push(label);

        updateProgress();
    };

    oPublic.setDialogWindowBorderWidth = function (width) {
        // This method sets the border width of the dialog window.
        $divValidationDialogWindow.css('border-width', width);
        return this;
    };

    oPublic.setDialogWindowBorderColor = function (color) {
        // This method sets the border color of the dialog window.
        $divValidationDialogWindow.css('border-color', color);
        return this;
    };

    oPublic.showDialogWindow = function (timelapse) {
        // This method shows a dialog window
        showDialogWindow(timelapse);
        return this;
    };

    oPublic.sortLabels = function () {
        // This method sorts the labels by it's heading angle.
        // Sorting an array of objects
        // http://stackoverflow.com/questions/1129216/sorting-objects-in-an-array-by-a-field-value-in-javascript
        function compare (a, b) {
            if (parseInt(a.points[0].svImageX) < parseInt(b.points[0].svImageX)) {
                return -1;
            }
            if (parseInt(a.points[0].svImageX) > parseInt(b.points[0].svImageX)) {
                return 1
            }
            return 0
        }

        labels.sort(compare);
        return this;
    };

    oPublic.validateNext = function (timelapse) {
        // This method changes the heading angle so the next unvalidated label will be centered
        // on the canvas.
        // 0. Wait and see whether panorama is ready
        // 1. Check if svw.map and svw.canvas exist
        // 2. Select the target label
        // 3. Adjust the SV heading angle and pitch angle so the target label will be centered.

        if (!('map' in svw)) {
            throw oPublic.className + ': Map is not defined.';
        }
        if (!('canvas' in svw)) {
            throw oPublic.className + ': Canvas is not defined.';
        }

        currentLabel = getNextLabel();
        if (currentLabel) {
            var pov = {
                heading: parseFloat(currentLabel.meta.panoramaHeading),
                pitch: parseFloat(currentLabel.meta.panoramaPitch),
                zoom: parseFloat(currentLabel.meta.zoom)
            };

            hideDialogWindow();

            if (typeof timelapse === "number" && timelapse >= 0) {
                var changePOVDuration = 500;
                svw.map.setPov(pov, changePOVDuration);
                highlightCurrentLabel();
                showDialogWindow(changePOVDuration);
            } else {
                svw.map.setPov(pov, 500);
                highlightCurrentLabel();
                showDialogWindow(500);
            }

        } else {
            // Todo. Navigate a user to submit
            hideDialogWindow();

            if (properties.onboarding) {
                return false;
            }
            svw.validatorForm.submit();
        }

        return this;
    };

    oPublic.setOnboarding = function (val) {
        properties.onboarding = val;
    };

    ////////////////////////////////////////
    // Initialize
    ////////////////////////////////////////
    init(param);

    return oPublic;
}

/**
 * Created with JetBrains PhpStorm.
 * User: kotarohara
 * Date: 7/6/13
 * Time: 12:40 PM
 * To change this template use File | Settings | File Templates.
 */
var svw = svw || {};

function ValidatorForm (param, $) {
    var oPublic = {className: 'ValidatorForm'};
    var properties = {
        dataStoreUrl: undefined,
        onboarding: undefined,
        taskDescription: undefined,
        taskPanoramaId: undefined,
        assignmentId: undefined,
        hitId: undefined,
        turkerId: undefined
    };
    var labelBinId = undefined;

    var $btnSubmit;

    ////////////////////////////////////////
    // Private functions
    ////////////////////////////////////////
    function init (param) {
        for (attr in properties) {
            properties[attr] = param[attr];
        }
    }

    function submit () {
        // This method collects validation labels and submit the data to
        // the API specified by properties.submitURL.
        if (!('validator' in svw) || !svw.validator) {
            throw oPublic.className + ': Validator not defined.';
        }
        var taskGSVPanoId = properties.panoId;
        var url = properties.dataStoreUrl;
        var hitId;
        var assignmentId;
        var turkerId;
        var data = {};
        var i;
        var len;


        //
        hitId = properties.hitId ? properties.hitId : 'Test_Hit';
        assignmentId = properties.assignmentId? properties.assignmentId : 'Test_Assignment';
        turkerId = properties.turkerId ? properties.turkerId : 'Test_Kotaro';


        // Submit collected data if a user is not in oboarding mode.
        if (!properties.onboarding) {
            // if (true) {
            data.assignment = {
                amazon_turker_id : turkerId,
                amazon_hit_id : hitId,
                amazon_assignment_id : assignmentId,
                interface_type : 'StreetViewValidator',
                interface_version : '1',
                completed : 0,
                task_description : properties.taskDescription
            };

            data.labelBinId = labelBinId;
            data.validationTask = {
                task_panorama_id: properties.taskPanoramaId,
                task_gsv_panorama_id : taskGSVPanoId,
                description: ""
            };

            data.validationTaskEnvironment = {
                browser: getBrowser(),
                browser_version: getBrowserVersion(),
                browser_width: $(window).width(),
                browser_height: $(window).height(),
                screen_width: screen.width,
                screen_height: screen.height,
                avail_width: screen.availWidth,		// total width - interface (taskbar)
                avail_height: screen.availHeight,		// total height - interface };
                operating_system: getOperatingSystem()
            };

            //
            // Get interactions
            svw.tracker.push('TaskSubmit');
            data.userInteraction = svw.tracker.getActions();

            data.labels = [];

            // Format the validation labels
            var validatorLabels = svw.validator.getLabels();
            len = validatorLabels.length;
            for (i = 0; i < len; i++) {
                console.log(validatorLabels[i]);
                var temp = {};
                temp.labelId = validatorLabels[i].points[0].LabelId;
                temp.result = validatorLabels[i].validationLabel === "Disagree" ? 0 : 1;
                data.labels.push(temp);
            }

            // Add the value in the comment field if there are any.
//            var comment = $textieldComment.val();
//            data.comment = undefined;
//            if (comment &&
//                comment !== $textieldComment.attr('title')) {
//                data.comment = $textieldComment.val();
//            }

            // Submit data to
            try {
                $.ajax({
                    async: false,
                    url: url,
                    type: 'post',
                    data: data,
                    dataType: 'json',
                    success: function (result) {
                        if (result.error) {
                            throw result.error.message;
                        }
                    },
                    error: function (result) {
                        throw result;
                        // console.error(result);
                    }
                });
            } catch (e) {
                console.log(e);
            }



            if (properties.taskRemaining > 1) {
                window.location.reload();
            } else {
                if (properties.isAMTTask) {
                    $('input[name="assignmentId"]').attr('value', assignmentId);
                    $('input[name="workerId"]').attr('value', turkerId);
                    $('input[name="hitId"]').attr('value', hitId);
                    return true;
                } else {
                    window.location.reload();
                    //window.location = '/';
                    return false;
                }
            }

        }

        return false;
    }

    ////////////////////////////////////////
    // Public functions
    ////////////////////////////////////////
    oPublic.setLabelBinId = function (binId) {
        labelBinId = binId;
        return this;
    };

    oPublic.submit = function () {
        return submit();
    };

    ////////////////////////////////////////
    // Initialize
    ////////////////////////////////////////
    init(param);
    return oPublic;
}
var svw = svw || {};

function ZoomControl ($, param) {
    var self = {
        'className' : 'ZoomControl'
    };
    var properties = {
        maxZoomLevel: 3,
        minZoomLevel: 1
    };
    var status = {
        disableZoomIn: false,
        disableZoomOut: false
    };
    var lock = {
        disableZoomIn: false,
        disableZoomOut: false
    };
    var actionStack = [];

    // jQuery dom objects
    var $buttonZoomIn;
    var $buttonZoomOut;

    ////////////////////////////////////////
    // Private Functions
    ////////////////////////////////////////
    function _init (param) {
        // Initialization function

        //if ('domIds' in param) {
        if (svw.ui && svw.ui.zoomControl) {
          $buttonZoomIn = svw.ui.zoomControl.zoomIn;
          $buttonZoomOut = svw.ui.zoomControl.zoomOut;
          // $buttonZoomIn = ('zoomInButton' in param.domIds) ? $(param.domIds.zoomInButton) : undefined;
          // $buttonZoomOut = ('zoomOutButton' in param.domIds) ? $(param.domIds.zoomOutButton) : undefined;
        // }
        //
        //
        // // Attach listeners to buttons
        // if ($buttonZoomIn && $buttonZoomOut) {
          $buttonZoomIn.bind('click', buttonZoomInClick);
          $buttonZoomOut.bind('click', buttonZoomOutClick);
        }
    }


    function buttonZoomInClick () {
        // This is a callback function for zoom-in button. This function increments a sv zoom level.
        if ('tracker' in svw) {
          svw.tracker.push('Click_ZoomIn');
        }

        if (!status.disableZoomIn) {
            var pov = svw.panorama.getPov();
            setZoom(pov.zoom + 1);
            svw.canvas.clear().render2();
        }
    }

    function buttonZoomOutClick () {
        // This is a callback function for zoom-out button. This function decrements a sv zoom level.
        if ('traker' in svw) {
          svw.tracker.push('Click_ZoomOut');
        }

        if (!status.disableZoomOut) {
            var pov = svw.panorama.getPov();
            setZoom(pov.zoom - 1);
            svw.canvas.clear().render2();
        }
    }

    function pointZoomIn (x, y) {
        // This method takes a (x, y) canvas point and sets a zoom level.
        if (!status.disableZoomIn) {
            // Cancel drawing when zooming in or out.
            if ('canvas' in svw) {
              svw.canvas.cancelDrawing();
            }
            if ('panorama' in svw) {
                console.log("hi");
                var currentPov = svw.panorama.getPov();
                var currentZoomLevel = currentPov.zoom;

                if (currentZoomLevel >= properties.maxZoomLevel) {
                    return false;
                }

                var width = svw.canvasWidth;
                var height = svw.canvasHeight;
                var minPitch = svw.map.getProperty('minPitch');
                var maxPitch = svw.map.getProperty('maxPitch');

                var zoomFactor = currentZoomLevel; // This needs to be fixed as it wouldn't work above level 3.
                var deltaHeading = (x - (width / 2)) / width * (90 / zoomFactor); // Ugh. Hard coding.
                var deltaPitch = - (y - (height / 2)) / height * (70 / zoomFactor); // Ugh. Hard coding.

                var pov = {};
                pov.zoom = currentZoomLevel + 1;
                pov.heading = currentPov.heading + deltaHeading;
                pov.pitch = currentPov.pitch + deltaPitch;

                //
                // Adjust the pitch angle.
                var maxPitch = svw.map.getMaxPitch();
                var minPitch = svw.map.getMinPitch();
                if (pov.pitch > maxPitch) {
                    pov.pitch = maxPitch;
                } else if (pov.pitch < minPitch) {
                    pov.pitch = minPitch;
                }

                //
                // Adjust the pitch so it won't exceed max/min pitch.
                svw.panorama.setPov(pov);
                return currentZoomLevel;
            } else {
                return false;
            }
        }
    }

    function setZoom (zoomLevelIn) {
        // This method sets the zoom level of the street view image.
        if (typeof zoomLevelIn !== "number") {
            return false;
        }

        // Cancel drawing when zooming in or out.
        if ('canvas' in svw) {
          svw.canvas.cancelDrawing();
        }

        // Set the zoom level and change the panorama properties.
        var zoomLevel = undefined;
        zoomLevelIn = parseInt(zoomLevelIn);
        if (zoomLevelIn < 1) {
            zoomLevel = 1;
        } else if (zoomLevelIn > properties.maxZoomLevel) {
            zoomLevel = properties.maxZoomLevel;
        } else {
            zoomLevel = zoomLevelIn;
        }
        svw.panorama.setZoom(zoomLevel);
        return zoomLevel;
    }

    ////////////////////////////////////////
    // Public Functions
    ////////////////////////////////////////
    self.disableZoomIn = function () {
        // Enable zoom in.
        if (!lock.disableZoomIn) {
            status.disableZoomIn = true;
            if ($buttonZoomIn) {
                $buttonZoomIn.css('opacity', 0.5);
            }
        }
        return this;
    }

    self.disableZoomOut = function () {
        // Enable zoom out.
        if (!lock.disableZoomOut) {
            status.disableZoomOut = true;
            if ($buttonZoomOut) {
                $buttonZoomOut.css('opacity', 0.5);
            }
        }
        return this;
    };

    self.enableZoomIn = function () {
        // Enable zoom in.
        if (!lock.disableZoomIn) {
            status.disableZoomIn = false;
            if ($buttonZoomIn) {
                $buttonZoomIn.css('opacity', 1);
            }
        }
        return this;
    }

    self.enableZoomOut = function () {
        // Enable zoom out.
        if (!lock.disableZoomOut) {
            status.disableZoomOut = false;
            if ($buttonZoomOut) {
                $buttonZoomOut.css('opacity', 1);
            }
        }
        return this;
    };

    self.getLock = function (name) {
        if (name in lock) {
            return lock[name];
        } else {
            var errMsg = 'You cannot access a property "' + name + '".';
            throw errMsg;
        }
    }

    self.getStatus = function (name) {
        if (name in status) {
            return status[name];
        } else {
            var errMsg = 'You cannot access a property "' + name + '".';
            throw errMsg;
        }
    }

    self.getProperties = function (name) {
        if (name in properties) {
            return properties[name];
        } else {
            var errMsg = 'You cannot access a property "' + name + '".';
            throw errMsg;
        }
    }

    self.lockDisableZoomIn = function () {
        // Lock zoom in
        lock.disableZoomIn = true;
        return this;
    };

    self.lockDisableZoomOut = function () {
        // Lock zoom out.
        lock.disableZoomOut = true;
        return this;
    };

    self.updateOpacity = function () {
        var pov = svw.getPOV();

        if (pov) {
            var zoom = pov.zoom;
            //
            // Change opacity
            if (zoom >= properties.maxZoomLevel) {
                $buttonZoomIn.css('opacity', 0.5);
                $buttonZoomOut.css('opacity', 1);
            } else if (zoom <= properties.minZoomLevel) {
                $buttonZoomIn.css('opacity', 1);
                $buttonZoomOut.css('opacity', 0.5);
            } else {
                $buttonZoomIn.css('opacity', 1);
                $buttonZoomOut.css('opacity', 1);
            }
        }

        //
        // If zoom in and out are disabled, fade them out anyway.
        if (status.disableZoomIn) {
            $buttonZoomIn.css('opacity', 0.5);
        }
        if (status.disableZoomOut) {
            $buttonZoomOut.css('opacity', 0.5);
        }


        return this;
    };

    self.pointZoomIn = function (x, y) {
        // This function takes a canvas coordinate (x, y) and pass it to a private method pointZoomIn()
        if (!status.disableZoomIn) {
            return pointZoomIn(x, y);
        } else {
            return false;
        }
    };

    self.setMaxZoomLevel = function (zoomLevel) {
        // This method sets the maximum zoom level that SV can show.
        properties.maxZoomLevel = zoomLevel;
        return this;
    };

    self.setMinZoomLevel = function (zoomLevel) {
        // This method sets the minimum zoom level that SV can show.
        properties.minZoomLevel = zoomLevel;
        return this;
    };

    self.unlockDisableZoomIn = function () {
        // Lock zoom in
        lock.disableZoomIn = false;
        return this;
    };

    self.unlockDisableZoomOut = function () {
        // Lock zoom out.
        lock.disableZoomOut = false;
        return this;
    };

    self.zoomIn = function () {
        // This method is called from outside this object to zoom in to a GSV image.
        if (!status.disableZoomIn) {
            var pov = svw.panorama.getPov();
            setZoom(pov.zoom + 1);
            svw.canvas.clear().render2();
            return this;
        } else {
            return false;
        }
    };

    self.zoomOut = function () {
        // This method is called from outside this class to zoom out from a GSV image.
        if (!status.disableZoomOut) {
            // ViewControl_ZoomOut
            var pov = svw.panorama.getPov();
            setZoom(pov.zoom - 1);
            svw.canvas.clear().render2();
            return this;
        } else {
            return false;
        }
    };

    ////////////////////////////////////////
    // Initialization
    ////////////////////////////////////////
    _init(param);

    return self;
};
