describe("The ActionStack module's basic API", function () {
  var stackParam = {
    domIds: {
      redoButton: "",
      undoButton: ""    
    }
  };
  var stack = new ActionStack(stackParam);
  var pov = {
    heading: 0,
    pitch: 0,
    zoom: 1
  };
  var labelColors = svw.misc.getLabelColors();
  var latlng = {lat: 38.894799, lng: -77.021906};
  var latlng2 = {lat: 37.894799, lng: -76.021906};
  var param = {
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
  var p1 = new Point(0, 0, pov, param);
  var p2 = new Point(9, 0, pov, param);
  var p3 = new Point(5, 5, pov, param);
  var path = new Path([p1, p2, p3], {});
  var label1 = new Label(path, param);
  param.panoramaLat = latlng2.lat;
  param.panoramaLng = latlng2.lng;
  var label2 = new Label(path, param);

  describe("Test size", function() {
    it("Stack size should be 0", function() {
      expect(0).toBe(stack.size());
    });
    it("Stack size should be 1", function() {
      stack.push('addLabel', null);
      expect(1).toBe(stack.size());
    });
    it("Stack size should be 0", function() {
      stack.pop();
      expect(0).toBe(stack.size());
    })
  })

  describe("Test push", function () {
    it("Stack size should be 2", function() {
      stack.push('addLabel', label1);
      stack.push('addLabel', label2);
      expect(stack.size()).toBe(2);
    })
  });  

  describe("Test pop", function () {
    it("Calling pop should only leave one item left", function() {
      stack.pop();
      expect(stack.size()).toBe(1);
      stack.pop();
      expect(stack.size()).toBe(0);
      stack.pop();
      expect(stack.size()).toBe(0);
      
    })
  });

  describe("Test redo", function () {
      it("Calling redo should redo addLabel actions", function() {
        stack.push('addLabel', label1);
        stack.push('addLabel', label2);
        expect(stack.getStatus().actionStackCursor).toBe(2);
        stack.undo();
        expect(stack.getStatus().actionStackCursor).toBe(1);
        stack.redo();
        expect(stack.getStatus().actionStackCursor).toBe(2);
      })
  });

  describe("Test undo", function () {
      it("Calling undo should undo addLabel actions", function() {
        stack.push('addLabel', label1);
        stack.undo();
        expect(label1.getstatus().deleted).toBe(true);
        stack.redo();
        expect(label1.getstatus().deleted).toBe(false);

      })
  });
});
