
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