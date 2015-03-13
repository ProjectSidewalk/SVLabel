describe("Tests for the RibbonMenu module.", function () {
  var ribbon = new RibbonMenu(jQuery);

  describe("The getStatus method", function () {
    // Check if it returns a warning message when name
  });

  describe("The modeSwitch method", function () {
    it("should switch the mode", function () {

      expect(ribbon.getStatus("mode")).toBe("CurbRamp");
    })
  })

  describe("The backToWalk method", function () {
    it("should switch the mode to Walk", function () {
      ribbon.modeSwitch("CurbRamp");
      expect(ribbon.getStatus("mode")).toBe("Walk");
    });
  });

  // Continue...
});
