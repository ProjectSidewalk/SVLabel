var svl = svl || {};

/**
 * The tutorial constructor
 */
function Onboarding ($) {
    var self = { className: 'Tutorial' },
        properties = {
            canvasWidth: 720,
            canvasHeight: 480
        },
        blinkInterval;

    function arrow (x1, y1, x2, y2) {
        var dx = x2 - x1,
            dy = y2 - y1,
            theta = Math.atan2(dy, dx),
            arrowWidth = 5;

        self.ctx.save();
        self.ctx.fillStyle = "rgb(255, 255, 255)";
        self.ctx.strokeStyle = "rgb(0, 0, 0)";
        self.ctx.lineWidth = 2;

        self.ctx.translate(x1, y1);
        self.ctx.beginPath();
        self.ctx.moveTo(arrowWidth * Math.sin(theta), - arrowWidth * Math.cos(theta));
        self.ctx.lineTo(dx + arrowWidth * Math.sin(theta), dy - arrowWidth * Math.cos(theta))

        // Draw an arrow head
        self.ctx.lineTo(dx + 3 * arrowWidth * Math.sin(theta), dy - 3 * arrowWidth * Math.cos(theta));
        self.ctx.lineTo(dx + 3 * arrowWidth * Math.cos(theta), dy + 3 * arrowWidth * Math.sin(theta));
        self.ctx.lineTo(dx - 3 * arrowWidth * Math.sin(theta), dy + 3 * arrowWidth * Math.cos(theta));

        self.ctx.lineTo(dx - arrowWidth * Math.sin(theta), dy + arrowWidth * Math.cos(theta));
        self.ctx.lineTo(- arrowWidth * Math.sin(theta), + arrowWidth * Math.cos(theta));

        self.ctx.fill();
        self.ctx.stroke();
        self.ctx.closePath();
        self.ctx.restore();
        return this;
    }

    function clear () {
        self.ctx.clearRect(0, 0, properties.canvasWidth, properties.canvasHeight);
        return this;
    }

    function start () {
        var messageHtml = 'Hi, we need your help to make sidewalks more accessible for everyone! In this task, your mission is to find and label sidewalk accessibility features that may make navigation easier or more difficult for wheelchair users. These features include: <br />' +
                '[Images] <br>' +
                "We'll <b>begin with a short, interactive tutorial</b> to get you started! Thanks for your help in improving the accessibility of cities.";

        svl.popUpMessage.setBackground('rgb(255, 255, 255)');
        svl.popUpMessage.setFontColor('black');
        svl.popUpMessage.setBorder('3px solid rgba(200,200,200,1)');
        svl.popUpMessage.setTitle('Help Us Improve Sidewalk Accessibility');
        svl.popUpMessage.setMessage(messageHtml);
        svl.popUpMessage.setPosition('fullscreen');
        svl.popUpMessage.appendOKButton(function () {
            _firstCorner_ClickCurbRampButton();
        });
        svl.popUpMessage.show();
        // self.clear().arrow(220, 210, 250, 270).arrow(470, 210, 450, 270);

    }

    function _firstCorner_ClickCurbRampButton() {
        // First curb ramp {x: 12256, y: -509}
        // Second curb ramp {x: 11336, y: -509}
        var highlighted,
            pov = {heading:320, pitch: -10, zoom: 1},
            curbRamp1Coordinate = svl.gsvImageCoordinate2CanvasCoordinate(12256, -509, pov),
            curbRamp2Coordinate = svl.gsvImageCoordinate2CanvasCoordinate(11336, -509, pov);

        svl.panorama.setPov(pov);
        self.clear()
            .arrow(curbRamp1Coordinate.x + 20, curbRamp1Coordinate.y - 60, curbRamp1Coordinate.x, curbRamp1Coordinate.y)
            .arrow(curbRamp2Coordinate.x - 30, curbRamp2Coordinate.y - 60, curbRamp2Coordinate.x, curbRamp2Coordinate.y);

        // Show the instruction
        svl.popUpMessage.reset();
        svl.popUpMessage.setMessage("In this image, we can see two curb ramps. Let's label them! Click the <b>Curb Ramp</b> button in the menu.");
        svl.popUpMessage.setPosition('canvas-top-left');
        svl.popUpMessage.show();

        // Blink the curb ramp button
        blinkInterval = setInterval(function () {
            if (highlighted) {
                highlighted = false;
                svl.ui.ribbonMenu.curbRampButton.css('background', 'rgba(252, 237, 62, 1)');
            } else {
                highlighted = true;
                svl.ui.ribbonMenu.curbRampButton.css('background', 'white');
            }
        }, 500);

        svl.ui.ribbonMenu.curbRampButton.one('click', function () {
            stepDone = true;
            svl.ui.ribbonMenu.curbRampButton.css('background', 'white');
            window.clearInterval(blinkInterval);
            _firstCorner_LabelCurbRamp1();
        });
    }

    function _firstCorner_LabelCurbRamp1 () {
        // First curb ramp {x: 12256, y: -509}
        var pov = {heading:320, pitch: -10, zoom: 1},
            curbRamp1Coordinate = svl.gsvImageCoordinate2CanvasCoordinate(12256, -509, pov);
        svl.panorama.setPov(pov);
        self.clear()
            .arrow(curbRamp1Coordinate.x + 20, curbRamp1Coordinate.y - 60, curbRamp1Coordinate.x, curbRamp1Coordinate.y)
        svl.popUpMessage.reset();
        svl.popUpMessage.setMessage("Good! Now <b>click on one of the curb ramps to label it.</b>");
        svl.popUpMessage.setPosition('canvas-top-left');
        svl.popUpMessage.show();
    }

    function _firstCorner_LabelCurbRamp2 () {
        // First curb ramp {x: 12256, y: -509}
        var pov = {heading:320, pitch: -10, zoom: 1},
            curbRamp2Coordinate = svl.gsvImageCoordinate2CanvasCoordinate(11336, -509, pov);
        svl.panorama.setPov(pov);
        self.clear()
            .arrow(curbRamp2Coordinate.x - 30, curbRamp2Coordinate.y - 60, curbRamp2Coordinate.x, curbRamp2Coordinate.y)
        svl.popUpMessage.reset();
        svl.popUpMessage.setMessage("Good! Now <b>click on another curb ramp to label it.</b>");
        svl.popUpMessage.setPosition('canvas-top-left');
        svl.popUpMessage.show();
    }

    function _secondCorner_ClickCurbRampButton () {
        // First curb ramp {x: 8657, y: -571}
        // Second curb ramp Object {x: 7737, y: -571}
        var blinkInterval, highlighted,
            pov = {heading: 226, pitch: -11, zoom: 1},
            curbRamp1Coordinate = svl.gsvImageCoordinate2CanvasCoordinate(8657, -571, pov),
            curbRamp2Coordinate = svl.gsvImageCoordinate2CanvasCoordinate(7737, -571, pov);

        svl.panorama.setPov(pov);
        self.clear()
            .arrow(curbRamp1Coordinate.x + 20, curbRamp1Coordinate.y - 60, curbRamp1Coordinate.x, curbRamp1Coordinate.y)
            .arrow(curbRamp2Coordinate.x - 30, curbRamp2Coordinate.y - 60, curbRamp2Coordinate.x, curbRamp2Coordinate.y);

        // Show the instruction
        svl.popUpMessage.reset();
        svl.popUpMessage.setMessage("Good! Again, there are two curb ramps on this corner. Let’s label them. <b>Select Curb Ramp.</b>");
        svl.popUpMessage.setPosition('canvas-top-left');
        svl.popUpMessage.show();

        // Blink the curb ramp button
        blinkInterval = setInterval(function () {
            if (highlighted) {
                highlighted = false;
                svl.ui.ribbonMenu.curbRampButton.css('background', 'rgba(252, 237, 62, 1)');
            } else {
                highlighted = true;
                svl.ui.ribbonMenu.curbRampButton.css('background', 'white');
            }
        }, 500);

        svl.ui.ribbonMenu.curbRampButton.one('click', function () {
            stepDone = true;
            svl.ui.ribbonMenu.curbRampButton.css('background', 'white');
            window.clearInterval(blinkInterval);
            _firstCorner_LabelCurbRamp1();
        });
    }

    function _secondCorner_LabelCurbRamp1 () {
        // First curb ramp {x: 12256, y: -509}
        var pov = {heading: 226, pitch: -11, zoom: 1},
            curbRamp1Coordinate = svl.gsvImageCoordinate2CanvasCoordinate(8657, -571, pov);
        svl.panorama.setPov(pov);
        self.clear()
            .arrow(curbRamp1Coordinate.x + 20, curbRamp1Coordinate.y - 60, curbRamp1Coordinate.x, curbRamp1Coordinate.y)
        svl.popUpMessage.reset();
        svl.popUpMessage.setMessage("Now, let's <b>label the first curb ramp.</b>");
        svl.popUpMessage.setPosition('canvas-top-left');
        svl.popUpMessage.show();
    }

    function _secondCorner_LabelCurbRamp2 () {
        // First curb ramp {x: 12256, y: -509}
        var pov = {heading: 226, pitch: -11, zoom: 1},
            curbRamp2Coordinate = svl.gsvImageCoordinate2CanvasCoordinate(7737, -571, pov);
        svl.panorama.setPov(pov);
        self.clear()
            .arrow(curbRamp2Coordinate.x - 30, curbRamp2Coordinate.y - 60, curbRamp2Coordinate.x, curbRamp2Coordinate.y)
        svl.popUpMessage.reset();
        svl.popUpMessage.setMessage("Good! Now <b>click on another curb ramp to label it.</b>");
        svl.popUpMessage.setPosition('canvas-top-left');
        svl.popUpMessage.show();
    }

    function _thirdCorner_ClickCurbRampButton () {
        //{heading: 134.3125, pitch: -6.6875, zoom: 1}
        // First curb ramp {x: 5135, y: -426}
        // Second curb ramp {x: 4215, y: -426}
        var blinkInterval, highlighted,
            pov = {heading: 134, pitch: -7, zoom: 1},
            curbRamp1Coordinate = svl.gsvImageCoordinate2CanvasCoordinate(5135, -426, pov),
            curbRamp2Coordinate = svl.gsvImageCoordinate2CanvasCoordinate(4215, -426, pov);

        svl.panorama.setPov(pov);
        self.clear()
            .arrow(curbRamp1Coordinate.x + 20, curbRamp1Coordinate.y - 60, curbRamp1Coordinate.x, curbRamp1Coordinate.y)
            .arrow(curbRamp2Coordinate.x - 30, curbRamp2Coordinate.y - 60, curbRamp2Coordinate.x, curbRamp2Coordinate.y);

        // Show the instruction
        svl.popUpMessage.reset();
        svl.popUpMessage.setMessage("Good! Again, there are two curb ramps on this corner. Let’s label them. <b>Select Curb Ramp.</b>");
        svl.popUpMessage.setPosition('canvas-top-left');
        svl.popUpMessage.show();

        // Blink the curb ramp button
        blinkInterval = setInterval(function () {
            if (highlighted) {
                highlighted = false;
                svl.ui.ribbonMenu.curbRampButton.css('background', 'rgba(252, 237, 62, 1)');
            } else {
                highlighted = true;
                svl.ui.ribbonMenu.curbRampButton.css('background', 'white');
            }
        }, 500);

        svl.ui.ribbonMenu.curbRampButton.one('click', function () {
            stepDone = true;
            svl.ui.ribbonMenu.curbRampButton.css('background', 'white');
            window.clearInterval(blinkInterval);
            _firstCorner_LabelCurbRamp1();
        });
    }

    function _thirdCorner_LabelCurbRamp1 () {
        // First curb ramp {x: 5135, y: -426}
        var pov = {heading: 134, pitch: -7, zoom: 1},
            curbRamp1Coordinate = svl.gsvImageCoordinate2CanvasCoordinate(5135, -426, pov);
        svl.panorama.setPov(pov);
        self.clear()
            .arrow(curbRamp1Coordinate.x + 20, curbRamp1Coordinate.y - 60, curbRamp1Coordinate.x, curbRamp1Coordinate.y)
        svl.popUpMessage.reset();
        svl.popUpMessage.setMessage("Now, let's <b>label the first curb ramp.</b>");
        svl.popUpMessage.setPosition('canvas-top-left');
        svl.popUpMessage.show();
    }

    function _thirdCorner_LabelCurbRamp2 () {
        // Second curb ramp {x: 4215, y: -426}
        var pov = {heading: 134, pitch: -7, zoom: 1},
            curbRamp2Coordinate = svl.gsvImageCoordinate2CanvasCoordinate(4215, -426, pov);
        svl.panorama.setPov(pov);
        self.clear()
            .arrow(curbRamp2Coordinate.x - 30, curbRamp2Coordinate.y - 60, curbRamp2Coordinate.x, curbRamp2Coordinate.y)
        svl.popUpMessage.reset();
        svl.popUpMessage.setMessage("Good! Now <b>click on another curb ramp to label it.</b>");
        svl.popUpMessage.setPosition('canvas-top-left');
        svl.popUpMessage.show();
    }

    function _fourthCorner_ClickCurbRampButton () {
        // First curb ramp {x: 2258, y: -419}
        // Second curb ramp {x: 1338, y: -419}
        var blinkInterval, highlighted,
            pov = {heading: 52, pitch: -7, zoom: 1},
            curbRamp1Coordinate = svl.gsvImageCoordinate2CanvasCoordinate(2258, -419, pov),
            curbRamp2Coordinate = svl.gsvImageCoordinate2CanvasCoordinate(1338, -419, pov);

        svl.panorama.setPov(pov);
        self.clear()
            .arrow(curbRamp1Coordinate.x + 20, curbRamp1Coordinate.y - 60, curbRamp1Coordinate.x, curbRamp1Coordinate.y)
            .arrow(curbRamp2Coordinate.x - 30, curbRamp2Coordinate.y - 60, curbRamp2Coordinate.x, curbRamp2Coordinate.y);

        // Show the instruction
        svl.popUpMessage.reset();
        svl.popUpMessage.setMessage("Good! Again, there are two curb ramps on this corner. Let’s label them. <b>Select Curb Ramp.</b>");
        svl.popUpMessage.setPosition('canvas-top-left');
        svl.popUpMessage.show();

        // Blink the curb ramp button
        blinkInterval = setInterval(function () {
            if (highlighted) {
                highlighted = false;
                svl.ui.ribbonMenu.curbRampButton.css('background', 'rgba(252, 237, 62, 1)');
            } else {
                highlighted = true;
                svl.ui.ribbonMenu.curbRampButton.css('background', 'white');
            }
        }, 500);

        svl.ui.ribbonMenu.curbRampButton.one('click', function () {
            stepDone = true;
            svl.ui.ribbonMenu.curbRampButton.css('background', 'white');
            window.clearInterval(blinkInterval);
            _firstCorner_LabelCurbRamp1();
        });
    }

    function _fourthCorner_LabelCurbRamp1 () {
        // First curb ramp {x: 2258, y: -419}
        var pov = {heading: 52, pitch: -7, zoom: 1},
            curbRamp1Coordinate = svl.gsvImageCoordinate2CanvasCoordinate(2258, -419, pov);
        svl.panorama.setPov(pov);
        self.clear()
            .arrow(curbRamp1Coordinate.x + 20, curbRamp1Coordinate.y - 60, curbRamp1Coordinate.x, curbRamp1Coordinate.y)
        svl.popUpMessage.reset();
        svl.popUpMessage.setMessage("Now, let's <b>label the first curb ramp.</b>");
        svl.popUpMessage.setPosition('canvas-top-left');
        svl.popUpMessage.show();
    }

    function _fourthCorner_LabelCurbRamp2 () {
        // Second curb ramp {x: 1338, y: -419}
        var pov = {heading: 52, pitch: -7, zoom: 1};
        var curbRamp2Coordinate = svl.gsvImageCoordinate2CanvasCoordinate(1338, -419, pov);
        svl.panorama.setPov(pov);
        self.clear()
            .arrow(curbRamp2Coordinate.x - 30, curbRamp2Coordinate.y - 60, curbRamp2Coordinate.x, curbRamp2Coordinate.y)
        svl.popUpMessage.reset();
        svl.popUpMessage.setMessage("Good! Now <b>click on another curb ramp to label it.</b>");
        svl.popUpMessage.setPosition('canvas-top-left');
        svl.popUpMessage.show();
    }

    function _walkAlongTheRoute () {
        var pov = {heading: 52, pitch: -7, zoom: 1}
        svl.panorama.setPov(pov);

        // Show a message
        var message = "Great! You have labeled all the accessibility features at this intersection. Now, <b>let's walk along the green path shown on the map to audit the accessibility of the sidewalks. Click an arrow ('<') on the Street View picture to move foward.</b>";
        svl.popUpMessage.reset();
        svl.popUpMessage.setMessage(message);
        svl.popUpMessage.setPosition('canvas-top-left');
        svl.popUpMessage.show();

        // Draw an arrow towards a map


        // Remove unnecessary Street View features.
        $('text', '.gmnoprint').remove();
        removeArrows(['h0haZ03SRgPFELt_SJ0Bkw']);

    }

    function _checkBothSidesOfTheStreet () {
        var pov = {heading: 0, pitch: -7, zoom: 1}
            svl.panorama.setPov(pov),
            svl.panorama.setPano('h0haZ03SRgPFELt_SJ0Bkw');

        svl.popUpMessage.reset();
        svl.popUpMessage.setMessage("Good! Now, let's look at the sidewalks on both sides of the street to assess their accessibility.");
        svl.popUpMessage.setPosition('canvas-top-left');
        svl.popUpMessage.show();

        // Remove unnecessary Street View features.
        $('text', '.gmnoprint').remove();
        removeArrows(['me6dLx00lziQzwAIQIuBfQ']);
    }

    function _labelMissingCurbRamp () {
        var pov = {heading: 331, pitch: -12, zoom: 1};
        var highlighted;

        svl.map.disableWalking();
        svl.map.setPov(pov, 1000, function () {
            svl.onboarding.clear().arrow(320, 220, 360, 280);
            hideArrows();
        });
        // svl.panorama.setPov(pov),
        svl.panorama.setPano('me6dLx00lziQzwAIQIuBfQ');

        svl.popUpMessage.reset();
        svl.popUpMessage.setMessage("Uh, oh! There is a missing curb ramp at the end of the crosswalk. Let's label it! First, <b>click Missing Curb Ramp</b> or <b>hit 'M'-key on the keyboard.</b>");
        svl.popUpMessage.setPosition('canvas-top-left');
        svl.popUpMessage.show();

        // Remove unnecessary Street View features.
        $('text', '.gmnoprint').remove();
        removeArrows(['TK4hp7XMGJGCm7DwkPQXJA']);
        hideArrows();

        // Blink the missing curb ramp button
        blinkInterval = setInterval(function () {
            if (highlighted) {
                highlighted = false;
                svl.ui.ribbonMenu.missingCurbRampButton.css('background', 'rgba(252, 237, 62, 1)');
            } else {
                highlighted = true;
                svl.ui.ribbonMenu.missingCurbRampButton.css('background', 'white');
            }
        }, 500);

        svl.ui.ribbonMenu.missingCurbRampButton.one('click', function () {
            svl.ui.ribbonMenu.missingCurbRampButton.css('background', 'white');
            window.clearInterval(blinkInterval);
            // _firstCorner_LabelCurbRamp1();
        });
    }

    function _labelCurbRampsAndWalkForward () {
        var pov = {heading: 0, pitch: -12, zoom: 1};

        svl.panorama.setPano('me6dLx00lziQzwAIQIuBfQ');
        svl.map.enableWalking();

        svl.popUpMessage.reset();
        svl.popUpMessage.setMessage("Great! Now, there are curb ramps too. <b>Let's label them and walk forward!</b>");
        svl.popUpMessage.setPosition('canvas-top-left');
        svl.popUpMessage.show();

        // Remove unnecessary Street View features.
        $('text', '.gmnoprint').remove();
        removeArrows(['TK4hp7XMGJGCm7DwkPQXJA']);
    }

    function _endOfTask () {
        var pov = { heading: 0, pitch: 0, zoom: 1 };
        var title = "Great! You've Successfully Completed the Tutorial!";
        var messageHtml = "Now you are ready to go out and inspect the world's streets and sideawlks to make sure that they are accessible to people with mobility impairments. Please fine the following accessbility features to make the world more accessible! <br />" +
            "[Images]<br />" +
            "Click 'OK' to move on to the actual tasks!";


        svl.panorama.setPano('TK4hp7XMGJGCm7DwkPQXJA');
        svl.popUpMessage.setBackground('rgb(255, 255, 255)');
        svl.popUpMessage.setFontColor('black');
        svl.popUpMessage.setBorder('3px solid rgba(200,200,200,1)');
        svl.popUpMessage.setTitle(title);
        svl.popUpMessage.setMessage(messageHtml);
        svl.popUpMessage.setPosition('fullscreen');
        svl.popUpMessage.appendOKButton(function () {
            console.log("Move on to the task.")
        });
        svl.popUpMessage.show();
    }

    // Some utility functions
    /**
     * Hide the links
     */
    function hideArrows () {
        $('path', '.gmnoprint').css('visibility', 'hidden');
    }

    /**
     * Remove arrows/links to neighboring Street Views
     */
    function removeArrows(exceptFor) {
        $('path[pano]', '.gmnoprint').each(function (i, d) {
            if (exceptFor.indexOf($(d).attr('pano')) < 0) {
                var d1 = $(d).prev(),
                    d2 = $(d1).prev();
                $(d).remove();
                $(d1).remove();
                $(d2).remove();
            }
        });
    }

    function showArrows () {
        $('path', '.gmnoprint').css('visibility', 'visible');
    }

    self.clear = clear;
    self.arrow = arrow;
    self.hideArrows = hideArrows;
    self.removeArrows = removeArrows;
    self.showArrows = showArrows;
    self.start = _endOfTask;
    return self;
}