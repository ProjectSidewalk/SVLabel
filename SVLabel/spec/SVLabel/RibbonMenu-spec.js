describe("Tests for the RibbonMenu module.", function () {
  var ribbon = new RibbonMenu(jQuery);
  
  describe("The backToWalk method", function () {
    it("should switch the mode to Walk", function () {
      ribbon.backToWalk();
      expect(ribbon.getStatus('mode')).toBe('val');
    });
  }); 

  describe("The disableModeSwitch method", function() {
    it("should disable mode switch", function() {
      ribbon.disableModeSwitch();
      expect(ribbon.getStatus('disableModeSwitch')).toBe(true);
    });
  });

  describe("The enableModeSwitch method", function() {
    it("should enable mode switch", function() {
      ribbon.enableModeSwitch();
      expect(ribbon.getStatus('disableModeSwitch')).toBe(false);
    });
  });

  describe("The disableLandmarkLabels", function() {
    it("should set disableLandmarkLabels to true", function() {
      ribbon.disableLandmarkLabels();
      expect(ribbon.getStatus('disableLandmarkLabels')).toBe(true);
    });
  });

  describe("The enableLandmarkLabels", function() {
    it("should set disableLandmarkLabels to false", function() {
      ribbon.enableLandmarkLabels();
      expect(ribbon.getStatus('disableLandmarkLabels')).toBe(false);
    });
  });

/*describe("The lockDisableModeSwitch", function() {
    it("should not allow you to disable or enable mode switch", function() {
      
    });
  });

  describe("The unlockDisableModeSwitch", function() {
    it("should allow you to disable or enable mode switch", function() {

    });
  });*/

  describe("The getStatus method", function () {
    it("should warn when an illegal key is passed.", function () {
      expect(ribbon.getStatus('invalid')).toBe(undefined);
    });
    it("should get the status of valid key", function() {
      expect(ribbon.getStatus('disableModeSwitch')).toBe(false);
    });
  });

  describe("The modeSwitch method", function() {
    it("should switch the mode", function () {
      ribbon.modeSwitch('CurbRamp');
      expect(ribbon.getStatus('mode')).toBe('CurbRamp');
    });
  });

  describe("The setAllowedMode method", function() {
    it("should set allowedMode to mode", function() {
      ribbon.setAllowedMode('valid');
      expect(ribbon.getStatus('allowedMode')).toBe('valid');  
    });

  });
});
