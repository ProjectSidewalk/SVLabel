describe("Specs for the Canvas module.", function () {
  var param = {};
  var canvas = new Canvas(param, $);

  // A fake label class.
  var FakeLabel = function (param) {
    var oPublic = {};
    var status = {};
    status.deleted = false;
    status.visible = true;
    oPublic.className = 'Label';
    oPublic.name = ((typeof param == 'object') && ('name' in param)) ? param.name : null;
    oPublic.isVisible = function () { return status.visible; };
    oPublic.isDeleted = function () { return status.deleted; };
    return oPublic;
  };

  beforeEach(function () {
    canvas.removeAllLabels();
  });

  describe("The method setStatus", function () {
    it("should not set invalid status", function () {
      expect(function () { canvas.setStatus('foo'); }).toThrow("Canvas: Illegal status name.");
    });
  })

  describe("The method cancelDrawing", function () {
    it("should set status.drawing to false", function () {
      canvas.setStatus('drawing', true);
      canvas.cancelDrawing();
      expect(canvas.getStatus('drawing')).toBeFalsy();
    });
  });

  describe("The methods that disable/enable actions", function () {
    it("disableLabelDelete should set status.disableLabelDelete to true", function () {
      canvas.disableLabelDelete();
      expect(canvas.getStatus('disableLabelDelete')).toBeTruthy();
    });

    it("enableLabelDelete should set status.disableLabelDelete to false", function () {
      canvas.enableLabelDelete();
      expect(canvas.getStatus('disableLabelDelete')).toBeFalsy();
    });

    it("disableLabelEdit should set status.disableLabelEdit to true", function () {
      canvas.disableLabelEdit();
      expect(canvas.getStatus('disableLabelEdit')).toBeTruthy();
    });

    it('enableLabelEdit should set status.disableLabelEdit to false', function () {
      canvas.enableLabelEdit();
      expect(canvas.getStatus('disableLabelEdit')).toBeFalsy();
    });

    it("disableLabeling should set status.disableLabeling to true", function () {
      canvas.disableLabeling();
      expect(canvas.getStatus('disableLabeling')).toBeTruthy();
    });

    it("enableLabeling should set status.disableLabeling to false", function () {
      canvas.enableLabeling();
      expect(canvas.getStatus('disableLabeling')).toBeFalsy();
    });
  });

  describe("The method getCurrentLabel", function () {
    var label = new FakeLabel();
    it("should return the current label", function () {
      canvas.setCurrentLabel(label);
      expect(canvas.getCurrentLabel()).toBe(label);
    });

    it("should return null if current label is not set", function () {
      canvas.setCurrentLabel(null);
      expect(canvas.getCurrentLabel()).toBeNull();
    });
  });

  describe("The method getLabels", function () {
    var label1 = new FakeLabel({name: 'label1'});
    var label2 = new FakeLabel({name: 'label2'});
    var label3 = new FakeLabel({name: 'label3'});

    it("should return an empty array when there are no labels", function () {
      // Check if a variable is an array
      // http://stackoverflow.com/questions/218798/in-javascript-how-can-we-identify-whether-an-object-is-a-hash-or-an-array
      expect(canvas.getLabels() instanceof Array).toBeTruthy();
      expect(canvas.getLabels().length).toBe(0);
    });

    it("should return an array of labels", function () {
      canvas.pushLabel(label1).pushLabel(label2).pushLabel(label3);
      expect(canvas.getLabels().length).toBe(3);
      expect(canvas.getLabels()[0].name).toBe('label1');
      expect(canvas.getLabels()[1].name).toBe('label2');
      expect(canvas.getLabels()[2].name).toBe('label3');
    });
  });

  describe("The method getNumLabels", function () {
    var label1 = new FakeLabel({name: 'label1'});
    var label2 = new FakeLabel({name: 'label2'});
    var label3 = new FakeLabel({name: 'label3'});

    it("should return 0 when there are not labels", function () {
      expect(canvas.getNumLabels()).toBe(0);
    });

    it("should return the number of elements in the labels array.", function () {
      canvas.pushLabel(label1).pushLabel(label2).pushLabel(label3);
      expect(canvas.getNumLabels()).toBe(3);
    })
  });

  describe("The method getStatus", function () {
    beforeEach(function() {
      spyOn(console, 'warn'); // To use toHaveBeenCalled()
    });

    it("should return currentLabel", function () {
      expect(canvas.getStatus('currentLabel')).toBeNull();

      var label = new FakeLabel();
      canvas.setCurrentLabel(label);
      expect(canvas.getStatus('currentLabel')).toBe(label);
    });

    it("should return the status 'drawing'", function () {
      expect(canvas.getStatus('drawing')).toBeFalsy();

      canvas.setStatus('drawing', true);
      expect(canvas.getStatus('drawing')).toBeTruthy();
    });

    it("should warn if invalid key for status is passed", function () {
      // Testing console output with Jasmine
      // http://stackoverflow.com/questions/19825020/how-can-i-use-jasmine-js-to-test-for-console-output
      canvas.getStatus('foo');
      expect(console.warn).toHaveBeenCalled();
    });
  });


  // Todo. continue from here. Mar 4, 2015.
  describe("The method isDrawing", function () {

  });
});
