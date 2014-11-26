describe("The Label module's basic API", function () {
  var pov = {
    heading: 0,
    pitch: 0,
    zoom: 1
  };
  var testCanvas = new Canvas(param, pov);
  var param = {};
  var p1 = new Point(0, 0, pov, param);
  var p2 = new Point(9, 0, pov, param);
  var p3 = new Point(5, 5, pov, param);
  var points = [p1,p2,p3];
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
  console.log(svw.svImageHeight);
  var label = new Label(path, param);

  describe("Test, getBoundingBox", function () {
    var boundingBoxA = label.getBoundingBox();
    var boundingBoxB = {
        x: 0,
        y: 0,
        width: 9,
        height: 5
    };

    it("boundingBox should exist", function () {
      expect(boundingBoxA).not.toBeUndefined();
    });

    it("boundingBoxA should match boundingBox B", function () {
      expect(boundingBoxA.x).toBe(boundingBoxB.x);
      // Todo: Alex. Check for y, width, and height
    });
  });

  // Todo. Alex. Please review this.
  describe("Test getCoordinate", function () {
    var coordinateA = label.getCoordinate();
    var coordinateB = {x: 0, y: 0};
    it("it should return the coordinate of the first point", function () {
      expect(coordinateA.x).toBe(coordinateB.x);
      expect(coordinateA.y).toBe(coordinateB.y);
    });

  });

  describe("Test getGSVImageCoordinate", function () {
    // Todo. Kotaro. Write a test.
  });

  describe("Test getImageCoordinate", function () {
    // Todo. Either this or getCoordinate should be deprecated.
    var coordinateA = label.getImageCoordinate();
    var coordinateB = {x: 0, y: 0};
    it("it should return the coordinate of the first point", function () {
      expect(coordinateA.x).toBe(coordinateB.x);
      expect(coordinateA.y).toBe(coordinateB.y);
    });
  });

  // Todo. Alex. Please write tests for this.
  describe("Test getLabelId", function () {
    it("Label ID should be set to 1", function(){
          expect(label.getLabelId).toBe(1);
    })
  });

  // Todo. Alex. Please write tests for this.
  describe("Test getLabelType", function () {
    it("Label ID should not be 0 or undefined", function(){
          expect(label.getLabelId).not.toBe(0);
          expect(label.getLabelId).not.toBeUndefined();
    });
  });

  // Todo: Alex. Please fix these tests.
  describe("Test getPath method", function () {
    var extractedPath = label.getPath();

    it("path should exist", function () {
      expect(extractedPath).not.toBeUndefined();
    });

    it("should get a reference", function () {
      expect(extractedPath).toBe(path);
    });

    it("should get a deep copy", function () {
      var deepCopy = label.getPath(false);
      expect(deepCopy).not.toBe(path);
    });

    it("should get a path that has same points", function () {
      var extractedPoints = extractedPath.getPoints();
      var len = extractedPoints.length;
      console.log(points[0].svw.svImageHeight);
      var i;
      for (i = 0; i < len; i++) {
        expect(extractedPoints[i]).toBe(points[i]);
      }
    });
  });

  // Todo. This

});
