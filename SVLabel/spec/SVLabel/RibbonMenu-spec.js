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
      ribbon.enableModeSwitch();
    });
  });

  describe("The getStatus method", function () {
  
  });

  describe("The modeSwitch method", function () {
    it("should switch the mode", function () {
      ribbon.modeSwitch('CurbRamp');
      expect(ribbon.getStatus('mode')).toBe('CurbRamp');
    });
  });

  // Continue...
});
