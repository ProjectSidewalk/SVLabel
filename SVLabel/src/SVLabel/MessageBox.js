/**
 * Created with JetBrains PhpStorm.
 * User: kotarohara
 * Date: 4/4/13
 * Time: 3:16 PM
 * To change this template use File | Settings | File Templates.
 */
function MessageBox (param) {
    var oPublic = {className: 'MessageBox'};
    var OKButton = '<button id="MessageBoxOkButton" class="button" style="position: absolute; bottom: 10px; left: 10px;">OK</button>';

    // jQuery elements
    var $divMessageBoxHolder;
    var $divMessageBox;


    function init () {
        $divMessageBoxHolder = $("#Holder_Message");
        $divMessageBox = $("#MessageBox");
    }

    oPublic.setMessage = function (message) {
        $divMessageBox.html(message);
        return this;
    };

    oPublic.setPosition = function (x, y, width, height, background) {
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

    oPublic.appendOKButton = function (message) {
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

    oPublic.hide = function () {
        // This method hides the message box.
        $divMessageBox.css('visibility', 'hidden');
        $divMessageBoxHolder.css('visibility', 'hidden');
        return this;
    };

    oPublic.show = function (disableOtherInteraction) {
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
    return oPublic;
}