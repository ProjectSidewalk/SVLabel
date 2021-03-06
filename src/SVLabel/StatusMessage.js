var svl = svl || {};

/**
 * A MissionDescription module
 * @param $
 * @param params
 * @returns {{className: string}}
 * @constructor
 * @memberof svl
 */
function StatusMessage ($, params) {
    var self = { className : 'StatusMessage' },
        properties = {},
        status = {};

    function _init (params) {    }

    function animate() {
        svl.ui.statusMessage.holder.removeClass('bounce animated').addClass('bounce animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
            $(this).removeClass('bounce animated');
        });
//        $('#animationSandbox').removeClass().addClass('bounce animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
//              $(this).removeClass();
//            });
    }

    function restoreDefault () {
        setBackgroundColor('rgb(255, 255, 255)');
        setCurrentStatusDescription('Your mission is to find and label all the accessibility attributes in the sidewalks and streets.');
        setCurrentStatusTitle('Mission:');
    }
    /**
     *
     */
    function setBackgroundColor (rgb) {
        svl.ui.statusMessage.holder.css('background', rgb);
    }

    /**
     * The method sets what's shown in the current status pane in the interface
     * @param description {string} A string (or html) to put.
     * @returns {self}
     */
    function setCurrentStatusDescription (description) {
      svl.ui.statusMessage.description.html(description);
      return this;
    }

    function setCurrentStatusTitle (title) {
        svl.ui.statusMessage.title.html(title);
        return this;
    }

    self.animate = animate;
    self.restoreDefault = restoreDefault;
    self.setBackgroundColor = setBackgroundColor;
    self.setCurrentStatusDescription = setCurrentStatusDescription;
    self.setCurrentStatusTitle = setCurrentStatusTitle;
    _init(params);
    return self;
}
