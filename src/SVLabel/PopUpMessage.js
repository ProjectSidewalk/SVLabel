var svl = svl || {};

/**
 * A MessageBox module
 * @param $
 * @param param
 * @returns {{className: string}}
 * @constructor
 * @memberof svl
 */
function PopUpMessage ($, param) {
    var self = {className: 'PopUpMessage'},
        buttons = [],
        OKButton = '<button id="pop-up-message-ok-button">OK</button>';

    function appendHTML (htmlDom, callback) {
        var $html = $(htmlDom);
        svl.ui.popUpMessage.box.append($html);

        if (callback) {
            $html.on("click", callback);
        }
        $html.on('click', hide);
        buttons.push($html);
    }

    function appendButton (buttonDom, callback) {
        var $button = $(buttonDom);

        $button.css({
            margin: '10 10 10 0'
        });
        $button.addClass('button');

//        svl.ui.popUpMessage.box.css('padding-bottom', '50px');
        svl.ui.popUpMessage.box.append($button);

        if (callback) {
            $button.on('click', callback);
        } else {
            $button.on('click', hide);
        }

        buttons.push($button);
    }

    function appendOKButton(callback) {
        appendButton(OKButton, callback);
    }

    function handleClickOK () {
        $("#pop-up-message-ok-button").on('click', function () {
            if ('tracker' in svl && svl.tracker) {
                if (message) {
                    svl.tracker.push('MessageBox_ClickOk', {message: message});
                } else {
                    svl.tracker.push('MessageBox_ClickOk');
                }
            }
            $("#pop-up-message-ok-button").remove();
        });
    }

    /**
     * Hides the message box.
     */
    function hide () {
        // This method hides the message box.
        svl.ui.popUpMessage.holder.removeClass('visible');
        svl.ui.popUpMessage.holder.addClass('hidden');
        hideBackground();  // hide background
        reset();  // reset all the parameters
        return this;
    }

    /**
     * Hides the background
     */
    function hideBackground () {
        svl.ui.popUpMessage.holder.css({ width: '', height: '' });
    }

    /**
     * Reset all the parameters.
     */
    function reset () {
        svl.ui.popUpMessage.holder.css({ width: '', height: '' });
        svl.ui.popUpMessage.box.css({
                    background: 'rgba(69,183,214,1)',
                    border: '3px solid rgba(255,255,255,1)',
                    color: 'white',
                    left: '',
                    top: '',
                    width: '',
                    height: '',
                    zIndex: ''
                });

        svl.ui.popUpMessage.box.css('padding-bottom', '')
        setTitle('');
        setMessage('');

        for (var i = 0; i < buttons.length; i++ ){
            try {
                buttons[i].remove();
            } catch (e) {
                console.warning("Button does not exist.", e);
            }
        }
        buttons = [];
    }

    /**
     * This method shows a messaage box on the page.
     */
    function show (disableOtherInteraction) {
        if (disableOtherInteraction) {
            showBackground();
        }

        svl.ui.popUpMessage.holder.removeClass('hidden');
        svl.ui.popUpMessage.holder.addClass('visible');
        return this;
    }

    /**
     * Show a semi-transparent background to block people to interact with
     * other parts of the interface.
     */
    function showBackground () {
        svl.ui.popUpMessage.holder.css({ width: '100%', height: '100%'});
    }

    /**
     *
     */
    function setBackground (rgb) {
        svl.ui.popUpMessage.box.css('background', rgb);

    }

    function setBorder (border) {
        svl.ui.popUpMessage.box.css('border', border);
    }

    function setFontColor (rgb) {
        svl.ui.popUpMessage.box.css('color', rgb);
    }

    /**
     * Sets the title
     */
    function setTitle (title) {
         svl.ui.popUpMessage.title.html(title);
         return this;
    }

    /**
     * Sets the message.
     */
    function setMessage (message) {
        svl.ui.popUpMessage.content.html(message);
        return this;
    }

    /*
     * Sets the position of the message.
     */
    function setPosition (x, y, width, height) {
        if (x == 'fullscreen') {
            svl.ui.popUpMessage.box.css({
                left: 0,
                top: 0,
                width: '960px',
                height: '680px',
                zIndex: 1000
            });
        } else if (x == 'canvas-top-left') {
            svl.ui.popUpMessage.box.css({
                left: 365,
                top: 122,
                width: '360px',
                height: '',
                zIndex: 1000
            });
        } else {
            svl.ui.popUpMessage.box.css({
                left: x,
                top: y,
                width: width,
                height: height,
                zIndex: 1000
            });
        }

        return this;
    }

    self.appendButton = appendButton;
    self.appendHTML = appendHTML;
    self.appendOKButton = appendOKButton;
    self.hide = hide;
    self.hideBackground = hideBackground;
    self.reset = reset;
    self.setBackground = setBackground;
    self.setBorder = setBorder;
    self.setFontColor = setFontColor;
    self.setPosition = setPosition;
    self.setTitle = setTitle;
    self.setMessage = setMessage;
    self.show = show;
    self.showBackground = showBackground;
    return self;
}
