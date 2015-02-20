/**
 * Created with JetBrains PhpStorm.
 * User: kotarohara
 * Date: 2/25/13
 * Time: 5:07 PM
 * To change this template use File | Settings | File Templates.
 */
var svw = svw || {};

function ActionStack (params) {
    var oPublic = {
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

        $buttonRedo = $(params.domIds.redoButton);
        $buttonUndo = $(params.domIds.undoButton);
        $buttonRedo.css('opacity', 0.5);
        $buttonUndo.css('opacity', 0.5);

        // Attach listeners to buttons
        $buttonRedo.bind('click', buttonRedoClick);
        $buttonUndo.bind('click', buttonUndoClick);
    }


    function buttonRedoClick () {
        if (!status.disableRedo) {
            svw.tracker.push('Click_Redo');
            oPublic.redo();
        }
    }


    function buttonUndoClick () {
        if (!status.disableUndo) {
            svw.tracker.push('Click_Undo');
            oPublic.undo();
        }
    }


    ////////////////////////////////////////
    // oPublic Functions
    ////////////////////////////////////////
    oPublic.disableRedo = function () {
        if (!lock.disableRedo) {
            status.disableRedo = true;
            $buttonRedo.css('opacity', 0.5);
            return this;
        } else {
            return false;
        }
    };


    oPublic.disableUndo = function () {
        if (!lock.disableUndo) {
            status.disableUndo = true;
            $buttonUndo.css('opacity', 0.5);
            return this;
        } else {
            return false;
        }
    };


    oPublic.enableRedo = function () {
        if (!lock.disableRedo) {
            status.disableRedo = false;
            $buttonRedo.css('opacity', 1);
            return this;
        } else {
            return false;
        }
    };


    oPublic.enableUndo = function () {
        if (!lock.disableUndo) {
            status.disableUndo = false;
            $buttonUndo.css('opacity', 1);
            return this;
        } else {
            return false;
        }
    };


    oPublic.lockDisableRedo = function () {
        lock.disableRedo = true;
        return this;
    };


    oPublic.lockDisableUndo = function () {
        lock.disableUndo = true;
        return this;
    };


    oPublic.pop = function () {
        // Delete the last action
        if (actionStack.length > 0) {
            status.actionStackCursor -= 1;
            actionStack.splice(status.actionStackCursor);
        }
        return this;
    };


    oPublic.push = function (action, label) {
        var availableActionList = ['addLabel', 'deleteLabel'];
        if (availableActionList.indexOf(action) === -1) {
            throw oPublic.className + ": Illegal action.";
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


    oPublic.redo = function () {
        // Redo an action
        if (!status.disableRedo) {
            if (actionStack.length > status.actionStackCursor) {
                var actionItem = actionStack[status.actionStackCursor];
                if (actionItem.action === 'addLabel') {
                    svw.tracker.push('Redo_AddLabel', {labelId: actionItem.label.getProperty('labelId')});
                    actionItem.label.setStatus('deleted', false);
                } else if (actionItem.action === 'deleteLabel') {
                    svw.tracker.push('Redo_RemoveLabel', {labelId: actionItem.label.getProperty('labelId')});
                    actionItem.label.setStatus('deleted', true);
                    actionItem.label.setVisibility('hidden');
                }
                status.actionStackCursor += 1;
            }
            svw.canvas.clear().render2();
        }
    };

    oPublic.size = function () {
        // return the size of the stack

        return actionStack.length;
    };


    oPublic.undo = function () {
        // Undo an action
        if (!status.disableUndo) {
            status.actionStackCursor -= 1;
            if(status.actionStackCursor >= 0) {
                var actionItem = actionStack[status.actionStackCursor];
                if (actionItem.action === 'addLabel') {
                    svw.tracker.push('Undo_AddLabel', {labelId: actionItem.label.getProperty('labelId')});
                    actionItem.label.setStatus('deleted', true);
                } else if (actionItem.action === 'deleteLabel') {
                    svw.tracker.push('Undo_RemoveLabel', {labelId: actionItem.label.getProperty('labelId')});
                    actionItem.label.setStatus('deleted', false);
                    actionItem.label.setVisibility('visible');
                }
            } else {
                status.actionStackCursor = 0;
            }
            svw.canvas.clear().render2();
        }
    };


    oPublic.unlockDisableRedo = function () {
        lock.disableRedo = false;
        return this;
    };


    oPublic.unlockDisableUndo = function () {
        lock.disableUndo = false;
        return this;
    };

    oPublic.updateOpacity = function () {
        // Change opacity
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

        //
        // if the status is set to disabled, then set the opacity of buttons to 0.5 anyway.
        if (status.disableUndo) {
            $buttonUndo.css('opacity', 0.5);
        }
        if (status.disableRedo) {
            $buttonRedo.css('opacity', 0.5);
        }
    };
    ////////////////////////////////////////
    // Initialization
    ////////////////////////////////////////
    init(params);

    return oPublic;
}