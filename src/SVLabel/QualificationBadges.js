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
