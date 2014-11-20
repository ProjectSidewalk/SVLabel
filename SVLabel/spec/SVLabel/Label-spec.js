describe("The Label module's basic API", function () {
  var pov = {
    heading: 0,
    pitch: 0,
    zoom: 1
  };
  var param = {};
  var p1 = new Point(0, 0, pov, param);
  var p2 = new Point(9, 0, pov, param);
  var p3 = new Point(5, 5, pov, param);
  var path = new Path([p1, p2, p3], {});

  var labelColors = svw.misc.getLabelColors();
  var latlng = {lat: 38.894799, lng: -77.021906};

  param = {
      canvasWidth: svw.canvasWidth,
      canvasHeight: svw.canvasHeight,
      canvasDistortionAlphaX: svw.alpha_x,
      canvasDistortionAlphaY: svw.alpha_y,
      labelId: 1,
      labelType: 1,
      labelDescription: "CurbRamp",
      labelFillStyle: labelColors.CurbRamp.fillStyle,
      panoId: "_AUz5cV_ofocoDbesxY3Kw",
      panoramaLat: latlng.lat,
      panoramaLng: latlng.lng,
      panoramaHeading: pov.heading,
      panoramaPitch: pov.pitch,
      panoramaZoom: pov.zoom,
      svImageWidth: svw.svImageWidth,
      svImageHeight: svw.svImageHeight,
      svMode: 'html4'
  };

  var label = new Label(path, param);


  describe("Get path", function () {
    it("path exists", function () {
      expect(label.getPath()).not.toBeUndefined();
    });

  });
});
