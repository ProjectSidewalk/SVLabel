var svl = svl || {};

/**
 * The tutorial
 */
function Tutorial ($) {
    var self = { className: 'Tutorial' };

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
    }

    function _firstCorner_ClickCurbRampButton() {
        svl.popUpMessage.reset();
        svl.popUpMessage.setMessage("In this image, we can see two curb ramps. Let's label them! Click the <b>Curb Ramp</b> button in the menu.");
        svl.popUpMessage.setPosition('canvas-top-left');
        $("#ModeSwitchButton_CurbRamp").one('click', function () {
            _firstCorner_LabelCurbRamp1();
        });
    }

    function _firstCorner_LabelCurbRamp1 () {
        svl.popUpMessage.setMessage("Good! Now <b>click on one of the curb ramps to label it.</b>");

    }

    self.start = start;
    return self;
}