/**
 * Created with JetBrains PhpStorm.
 * User: kotarohara
 * Date: 2/21/13
 * Time: 6:07 PM
 * To change this template use File | Settings | File Templates.
 */

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

        if (!('onboarding' in svw && svw.onboarding)) {
            messageCanvas = new Onboarding(params, $)
        }



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
