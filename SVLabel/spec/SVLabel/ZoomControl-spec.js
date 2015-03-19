describe("Tests for the ZoomControl.", function () {

  var zoom = new ZoomControl(jQuery);
  describe("The method getStatus", function () {
    it("should warn when an illegal key is passed.", function () {
    	expect(zoom.getStatus('status', 'disableZoomIn')).toBe(false);
    });
  });
  
  describe("The method disableZoomIn", function() {
  	it("should not allow it to zoom in", function() {

  	});
  });

  describe("The method disableZoomOut", function() {
  	it("should not allow it to zoom out", function() {

  	});
  });
});
